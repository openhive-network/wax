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
//! - `pushMetadataProperty` and the arbitrary user-supplied `jsonMetadata`
//!   object are not ported. Only the typed metadata fields (`format`,
//!   `tags`, `images`, `links`, `alternative_author`, `description`, `app`)
//!   are surfaced. `app` defaults to `wax/{CARGO_PKG_VERSION}` and can be
//!   overridden via the `app` field (mirrors TS's `jsonMetadata.app`).
//! - The default `comment_options` payload is hard-coded against the
//!   protocol constants rather than fetched through an FFI call to
//!   `cpp_get_default_comment_options_operation`. The values (1_000_000_000
//!   HBD payout, 10_000 bps percent_hbd, both `allow_*` true) are protocol-
//!   stable; this avoids adding bridge surface for a single helper.

use std::time::{SystemTime, UNIX_EPOCH};

use serde::Serialize;
use wax_core::proto;

use crate::WaxError;
use crate::constants::{
    DEFAULT_COMMENT_MAX_ACCEPTED_PAYOUT_SATOSHIS, DEFAULT_COMMENT_PERCENT_HBD,
};
use crate::foundation::WaxFoundation;
use crate::interfaces::OperationBuilder;
use crate::models::asset::{AssetName, NaiAsset, NaiAssetConvertible};
use crate::models::basic::AccountName;

const APP_TAG: &str =
    concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION"));

/// Represents the wire-form `format` value written to `json_metadata.format`.
///
/// TS NOTE: mirrors `ECommentFormat`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CommentFormat {
    Html,
    Markdown,
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
#[derive(Debug, Clone, PartialEq, Eq)]
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
    /// `wax/{CARGO_PKG_VERSION}` when `None`.
    pub app: Option<String>,

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
    /// `wax/{CARGO_PKG_VERSION}` when `None`.
    pub app: Option<String>,

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
    beneficiaries: Vec<BeneficiaryRoute>,
    allow_curation_rewards: Option<bool>,
    allow_votes: Option<bool>,
    percent_hbd: Option<u32>,
    max_accepted_payout: Option<NaiAssetConvertible>,
}

impl OperationBuilder for ReplyOperation {
    fn finalize(
        self: Box<Self>,
        foundation: &dyn WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let this = *self;
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
            beneficiaries: this.beneficiaries,
            allow_curation_rewards: this.allow_curation_rewards,
            allow_votes: this.allow_votes,
            percent_hbd: this.percent_hbd,
            max_accepted_payout: this.max_accepted_payout,
        };
        inputs.into_operations(foundation)
    }
}

impl OperationBuilder for BlogPostOperation {
    fn finalize(
        self: Box<Self>,
        foundation: &dyn WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let this = *self;
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
        foundation: &dyn WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        // Snapshot the options-trigger before consuming `self` field-by-field
        // below — `has_options_input` needs `&self` and would conflict with
        // the partial moves into `proto::Comment`.
        let has_options = self.has_options_input();

        let json_metadata = build_json_metadata(
            self.format.unwrap_or(CommentFormat::Mixed),
            &self.tags,
            &self.images,
            &self.links,
            self.alternative_author.as_deref(),
            self.description.as_deref(),
            self.app.as_deref(),
        )?;

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
}

fn now_millis() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("system clock before unix epoch")
        .as_millis() as u64
}

/// Internal struct backing the JSON metadata serialization. Field
/// declaration order matters: `serde_json` preserves it, so the output
/// matches the TS `JSON.stringify` shape byte-for-byte
/// (`format`, `app`, `tags`, `image`, `links`, `author`, `description`).
#[derive(Serialize)]
struct JsonMetadata<'a> {
    format: &'a str,
    app: &'a str,
    #[serde(skip_serializing_if = "Option::is_none")]
    tags: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    image: Option<&'a [String]>,
    #[serde(skip_serializing_if = "Option::is_none")]
    links: Option<&'a [String]>,
    #[serde(skip_serializing_if = "Option::is_none")]
    author: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<&'a str>,
}

fn build_json_metadata(
    format: CommentFormat,
    tags: &[String],
    images: &[String],
    links: &[String],
    alternative_author: Option<&str>,
    description: Option<&str>,
    app: Option<&str>,
) -> Result<String, WaxError> {
    let metadata = JsonMetadata {
        format: format.as_str(),
        app: app.unwrap_or(APP_TAG),
        tags: if tags.is_empty() {
            None
        } else {
            Some(deduplicate_preserving_order(tags))
        },
        image: if images.is_empty() {
            None
        } else {
            Some(images)
        },
        links: if links.is_empty() { None } else { Some(links) },
        author: alternative_author,
        description,
    };

    serde_json::to_string(&metadata).map_err(|e| {
        WaxError::new(format!("failed to serialize comment json_metadata: {e}"))
    })
}

/// First-occurrence-wins dedupe preserving order. Mirrors TS
/// `[...new Set([...existing, ...data.tags])]`.
fn deduplicate_preserving_order(items: &[String]) -> Vec<String> {
    let mut seen = std::collections::HashSet::with_capacity(items.len());
    let mut out = Vec::with_capacity(items.len());
    for item in items {
        if seen.insert(item.clone()) {
            out.push(item.clone());
        }
    }
    out
}

#[allow(clippy::too_many_arguments)]
fn build_comment_options(
    foundation: &dyn WaxFoundation,
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
