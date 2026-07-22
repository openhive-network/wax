//! Builders for the `comment_operation` + optional `comment_options_operation`
//! pair, mirroring `ts/wasm/lib/detailed/complex_operations/comment.ts`.
//!
//! Two public builders: [`ReplyOperation`] (reply to an existing post/comment)
//! and [`BlogPostOperation`] (top-level post under a category). Both produce
//! a `comment_operation` and, if the caller set any option-shaped field, a
//! second `comment_options_operation`. The options op is suppressed when the
//! computed options equal the chain defaults — same behaviour as TS's
//! `deepEqual(defaultCommentOptions, this.commentOptions)` check.
//!
//! Differences from the TS port:
//! - `pushMetadataProperty` is not ported as a method; the public
//!   `json_metadata` field covers the same use case. Its entries are merged
//!   into the generated metadata with TS constructor semantics: they
//!   override the `format`/`app` defaults, and the typed fields (`format`,
//!   `tags`, `images`, `links`, `alternative_author`, `description`, `app`)
//!   are applied on top. `app` defaults to `{CARGO_PKG_NAME}/{CARGO_PKG_VERSION}` and
//!   can be overridden via the `app` field or a `json_metadata` entry
//!   (mirrors TS's `jsonMetadata.app`).
//! - The default `comment_options` payload is hard-coded against the
//!   protocol constants rather than fetched through an FFI call to
//!   `cpp_get_default_comment_options_operation`. The values (1_000_000_000
//!   HBD payout, 10_000 bps percent_hbd, both `allow_*` true) are protocol-
//!   stable; this avoids adding bridge surface for a single helper.

use std::time::{SystemTime, UNIX_EPOCH};

use crate::core::proto;
use serde_json::Value;

use crate::WaxError;
use crate::base::constants::{
    DEFAULT_COMMENT_MAX_ACCEPTED_PAYOUT_SATOSHIS, DEFAULT_COMMENT_PERCENT_HBD,
};
use crate::base::foundation::WaxFoundation;
use crate::base::internal::ordered_object::OrderedObject;
use crate::base::models::asset::{AssetName, NaiAsset, NaiAssetConvertible};
use crate::base::models::basic::AccountName;
use crate::base::operation::ComplexOperation;

const APP_TAG: &str =
    concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION"));

/// Represents the wire-form `format` value written to `json_metadata.format`.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub enum CommentFormat {
    Html,
    Markdown,
    /// The format the builders write to `json_metadata.format` when none is
    /// set.
    #[default]
    Mixed,
}

impl CommentFormat {
    fn as_str(self) -> &'static str {
        match self {
            CommentFormat::Html => "html",
            CommentFormat::Markdown => "markdown",
            CommentFormat::Mixed => "markdown+html",
        }
    }
}

/// Represents one beneficiary entry for `comment_options.extensions`, mirroring
/// `proto::BeneficiaryRouteType` without forcing callers to import from
/// `wax::proto`.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct BeneficiaryRoute {
    pub account: AccountName,
    pub weight: u32,
}

/// Represents a reply / comment under an existing post or comment.
/// `parent_author` and `parent_permlink` are required and non-empty; an empty
/// value for either is rejected at `finalize` time.
#[derive(Debug, Clone, Default)]
pub struct ReplyOperation {
    pub parent_author: AccountName,
    pub parent_permlink: String,
    pub author: AccountName,
    pub body: String,
    /// Defaults to `"re-{parent_author}-{millis}"` if `None`.
    pub permlink: Option<String>,
    /// Defaults to `""` if `None`.
    pub title: Option<String>,

    pub format: Option<CommentFormat>,
    pub tags: Vec<String>,
    pub images: Vec<String>,
    pub links: Vec<String>,
    pub alternative_author: Option<AccountName>,
    pub description: Option<String>,
    /// Overrides the `app` tag in `json_metadata`. Defaults to
    /// `{CARGO_PKG_NAME}/{CARGO_PKG_VERSION}` when `None`.
    pub app: Option<String>,
    /// Arbitrary extra `json_metadata` entries, merged in order over the
    /// `format`/`app` defaults before the typed fields above are applied.
    pub json_metadata: Vec<(String, Value)>,

    pub beneficiaries: Vec<BeneficiaryRoute>,
    pub allow_curation_rewards: Option<bool>,
    pub allow_votes: Option<bool>,
    pub percent_hbd: Option<u32>,
    pub max_accepted_payout: Option<NaiAssetConvertible>,
}

/// Represents a top-level blog post under a category (e.g. `"travel"` or a
/// community id like `"hive-174695"`). `parent_author` is always `""`, and
/// `parent_permlink = category`.
#[derive(Debug, Clone, Default)]
pub struct BlogPostOperation {
    pub author: AccountName,
    pub category: String,
    pub title: String,
    pub body: String,
    /// Defaults to `"{author}-{millis}"` if `None`.
    pub permlink: Option<String>,

    pub format: Option<CommentFormat>,
    pub tags: Vec<String>,
    pub images: Vec<String>,
    pub links: Vec<String>,
    pub alternative_author: Option<AccountName>,
    pub description: Option<String>,
    /// Overrides the `app` tag in `json_metadata`. Defaults to
    /// `{CARGO_PKG_NAME}/{CARGO_PKG_VERSION}` when `None`.
    pub app: Option<String>,
    /// Arbitrary extra `json_metadata` entries, merged in order over the
    /// `format`/`app` defaults before the typed fields above are applied.
    pub json_metadata: Vec<(String, Value)>,

    pub beneficiaries: Vec<BeneficiaryRoute>,
    pub allow_curation_rewards: Option<bool>,
    pub allow_votes: Option<bool>,
    pub percent_hbd: Option<u32>,
    pub max_accepted_payout: Option<NaiAssetConvertible>,
}

/// Internal merged representation used by both builders' `finalize` paths.
/// Carries the fully-resolved `parent_*` / `permlink` / `title` values so
/// the shared finalize logic doesn't have to know which builder produced it.
struct CommentInputs {
    parent_author: String,
    parent_permlink: String,
    author: String,
    permlink: String,
    title: String,
    body: String,
    format: Option<CommentFormat>,
    tags: Vec<String>,
    images: Vec<String>,
    links: Vec<String>,
    alternative_author: Option<AccountName>,
    description: Option<String>,
    app: Option<String>,
    json_metadata: Vec<(String, Value)>,
    beneficiaries: Vec<BeneficiaryRoute>,
    allow_curation_rewards: Option<bool>,
    allow_votes: Option<bool>,
    percent_hbd: Option<u32>,
    max_accepted_payout: Option<NaiAssetConvertible>,
}

impl ComplexOperation for ReplyOperation {
    fn finalize(
        self,
        foundation: &WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let this = self;
        if this.parent_author.is_empty() {
            return Err(WaxError::new(
                "No parent author specified in the reply operation",
            ));
        }
        if this.parent_permlink.is_empty() {
            return Err(WaxError::new(
                "No parent permlink specified in the reply operation",
            ));
        }

        let permlink = this.permlink.unwrap_or_else(|| {
            format!("re-{}-{}", this.parent_author, now_millis())
        });

        let inputs = CommentInputs {
            parent_author: this.parent_author,
            parent_permlink: this.parent_permlink,
            author: this.author,
            permlink,
            title: this.title.unwrap_or_default(),
            body: this.body,
            format: this.format,
            tags: this.tags,
            images: this.images,
            links: this.links,
            alternative_author: this.alternative_author,
            description: this.description,
            app: this.app,
            json_metadata: this.json_metadata,
            beneficiaries: this.beneficiaries,
            allow_curation_rewards: this.allow_curation_rewards,
            allow_votes: this.allow_votes,
            percent_hbd: this.percent_hbd,
            max_accepted_payout: this.max_accepted_payout,
        };
        inputs.into_operations(foundation)
    }
}

impl ComplexOperation for BlogPostOperation {
    fn finalize(
        self,
        foundation: &WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let this = self;
        let permlink = this
            .permlink
            .unwrap_or_else(|| format!("{}-{}", this.author, now_millis()));

        let inputs = CommentInputs {
            parent_author: String::new(),
            parent_permlink: this.category,
            author: this.author,
            permlink,
            title: this.title,
            body: this.body,
            format: this.format,
            tags: this.tags,
            images: this.images,
            links: this.links,
            alternative_author: this.alternative_author,
            description: this.description,
            app: this.app,
            json_metadata: this.json_metadata,
            beneficiaries: this.beneficiaries,
            allow_curation_rewards: this.allow_curation_rewards,
            allow_votes: this.allow_votes,
            percent_hbd: this.percent_hbd,
            max_accepted_payout: this.max_accepted_payout,
        };
        inputs.into_operations(foundation)
    }
}

impl CommentInputs {
    /// `true` iff the caller touched any option-shaped field. Triggers
    /// lazy creation of the `comment_options_operation` per TS semantics.
    fn has_options_input(&self) -> bool {
        self.allow_curation_rewards.is_some()
            || self.allow_votes.is_some()
            || self.percent_hbd.is_some()
            || self.max_accepted_payout.is_some()
            || !self.beneficiaries.is_empty()
    }

    fn into_operations(
        self,
        foundation: &WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        // Snapshot the options-trigger before consuming `self` field-by-field
        // below — `has_options_input` needs `&self` and would conflict with
        // the partial moves into `proto::Comment`.
        let has_options = self.has_options_input();

        let json_metadata = self.build_json_metadata()?;

        let comment_op = proto::Comment {
            parent_author: self.parent_author,
            parent_permlink: self.parent_permlink,
            author: self.author.clone(),
            permlink: self.permlink.clone(),
            title: self.title,
            body: self.body,
            json_metadata,
        };

        let mut ops = Vec::with_capacity(2);
        ops.push(proto::Operation {
            value: Some(proto::operation::Value::CommentOperation(comment_op)),
        });

        if has_options {
            let default = foundation
                .default_comment_options(&self.author, &self.permlink)?;
            let computed = build_comment_options(
                foundation,
                &self.author,
                &self.permlink,
                self.allow_curation_rewards,
                self.allow_votes,
                self.percent_hbd,
                self.max_accepted_payout,
                &self.beneficiaries,
            )?;

            if computed != default {
                ops.push(proto::Operation {
                    value: Some(
                        proto::operation::Value::CommentOptionsOperation(
                            computed,
                        ),
                    ),
                });
            }
        }

        Ok(ops)
    }

    /// Builds the serialized `json_metadata` string, replicating the TS
    /// constructor sequence: the `format` default, then the user-supplied
    /// `json_metadata` entries (`Object.assign` semantics), then `app`,
    /// then the typed fields on top.
    fn build_json_metadata(&self) -> Result<String, WaxError> {
        let mut metadata = OrderedObject(Vec::new());
        metadata.set("format", Value::from(CommentFormat::default().as_str()));

        for (key, value) in &self.json_metadata {
            metadata.set(key, value.clone());
        }

        let app = match (&self.app, metadata.get("app")) {
            (Some(app), _) => Value::from(app.as_str()),
            (None, Some(app)) => app.clone(),
            (None, None) => Value::from(APP_TAG),
        };
        metadata.set("app", app);

        if !self.tags.is_empty() {
            let combined = metadata_array(&metadata, "tags")?
                .into_iter()
                .chain(self.tags.iter().map(|t| Value::from(t.as_str())));
            metadata.set(
                "tags",
                Value::Array(deduplicate_preserving_order(combined)),
            );
        }

        if !self.images.is_empty() {
            let mut image = metadata_array(&metadata, "image")?;
            image.extend(self.images.iter().map(|i| Value::from(i.as_str())));
            metadata.set("image", Value::Array(image));
        }

        if !self.links.is_empty() {
            let mut links = metadata_array(&metadata, "links")?;
            links.extend(self.links.iter().map(|l| Value::from(l.as_str())));
            metadata.set("links", Value::Array(links));
        }

        if let Some(author) = &self.alternative_author {
            metadata.set("author", Value::from(author.as_str()));
        }

        if let Some(description) = &self.description {
            metadata.set("description", Value::from(description.as_str()));
        }

        if let Some(format) = self.format {
            metadata.set("format", Value::from(format.as_str()));
        }

        serde_json::to_string(&metadata).map_err(|e| {
            WaxError::new(format!(
                "failed to serialize comment json_metadata: {e}"
            ))
        })
    }
}

fn now_millis() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("system clock before unix epoch")
        .as_millis() as u64
}

/// Reads a metadata key that the typed fields extend (`tags`, `image`,
/// `links`), defaulting to an empty array when the key is absent.
/// NOTE: TS throws a `TypeError` when spreading a non-iterable
/// user-supplied value here; surfaced as a [`WaxError`] instead.
fn metadata_array(
    metadata: &OrderedObject,
    key: &str,
) -> Result<Vec<Value>, WaxError> {
    match metadata.get(key) {
        None => Ok(Vec::new()),
        Some(Value::Array(items)) => Ok(items.clone()),
        Some(_) => Err(WaxError::new(format!(
            "comment json_metadata key `{key}` must be an array"
        ))),
    }
}

/// First-occurrence-wins dedupe preserving order. Mirrors TS
/// `[...new Set([...existing, ...data.tags])]`.
fn deduplicate_preserving_order(
    items: impl Iterator<Item = Value>,
) -> Vec<Value> {
    let mut out: Vec<Value> = Vec::new();
    for item in items {
        if !out.contains(&item) {
            out.push(item);
        }
    }

    out
}

#[allow(clippy::too_many_arguments)]
fn build_comment_options(
    foundation: &WaxFoundation,
    author: &str,
    permlink: &str,
    allow_curation_rewards: Option<bool>,
    allow_votes: Option<bool>,
    percent_hbd: Option<u32>,
    max_accepted_payout: Option<NaiAssetConvertible>,
    beneficiaries: &[BeneficiaryRoute],
) -> Result<proto::CommentOptions, WaxError> {
    let max_accepted_payout: NaiAsset = match max_accepted_payout {
        Some(asset) => foundation
            .create_asset_with_required_symbol(AssetName::Hbd, asset)?,
        None => foundation
            .hbd_satoshis(DEFAULT_COMMENT_MAX_ACCEPTED_PAYOUT_SATOSHIS)?,
    };

    let extensions = if beneficiaries.is_empty() {
        Vec::new()
    } else {
        vec![proto::CommentOptionsExtension {
            value: Some(
                proto::comment_options_extension::Value::CommentPayoutBeneficiaries(
                    proto::CommentPayoutBeneficiaries {
                        beneficiaries: beneficiaries
                            .iter()
                            .map(|b| proto::BeneficiaryRouteType {
                                account: b.account.clone(),
                                weight: b.weight,
                            })
                            .collect(),
                    },
                ),
            ),
        }]
    };

    Ok(proto::CommentOptions {
        author: author.to_string(),
        permlink: permlink.to_string(),
        max_accepted_payout,
        percent_hbd: percent_hbd.unwrap_or(DEFAULT_COMMENT_PERCENT_HBD),
        allow_votes: allow_votes.unwrap_or(true),
        allow_curation_rewards: allow_curation_rewards.unwrap_or(true),
        extensions,
    })
}
