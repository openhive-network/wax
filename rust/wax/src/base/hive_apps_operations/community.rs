//! Builder for the Community "hive apps" operation.
//!
//! Mirrors `CommunityOperation` from
//! `ts/wasm/lib/detailed/hive_apps_operations/community.ts`. Builds one
//! `custom_json_operation` per staged entry on `authorize` (see
//! [`super::factory::HiveAppsOperation`]), with `id="community"`.

use crate::core::proto;
use serde_json::{Value, json};

use super::factory::{HiveAppsOperation, HiveAppsOperationBase};
use crate::WaxError;
use crate::base::foundation::WaxFoundation;
use crate::base::models::basic::AccountName;
use crate::base::operation::ComplexOperation;

const OPERATION_ID: &str = "community";

/// Represents languages supported by Hive community props.
///
/// TS NOTE: mirrors `ESupportedLanguages`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SupportedLanguages {
    English,
    Korean,
    Chinese,
    Malay,
    Polish,
    Portuguese,
    Russian,
    Italian,
    German,
    Spanish,
    Swedish,
}

impl SupportedLanguages {
    /// Returns the on-wire string form of the value.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::English => "en",
            Self::Korean => "kr",
            Self::Chinese => "zh",
            Self::Malay => "ms",
            Self::Polish => "pl",
            Self::Portuguese => "pt",
            Self::Russian => "ru",
            Self::Italian => "it",
            Self::German => "de",
            Self::Spanish => "es",
            Self::Swedish => "sv",
        }
    }
}

/// Represents the membership roles available within a Hive community.
///
/// TS NOTE: mirrors `EAvailableCommunityRoles`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AvailableCommunityRoles {
    Muted,
    Guest,
    Member,
    Mod,
    Admin,
    Owner,
}

impl AvailableCommunityRoles {
    /// Returns the on-wire string form of the value.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Muted => "muted",
            Self::Guest => "guest",
            Self::Member => "member",
            Self::Mod => "mod",
            Self::Admin => "admin",
            Self::Owner => "owner",
        }
    }
}

/// Represents the on-wire action tag for a single community-operation body.
///
/// TS NOTE: mirrors `ECommunityOperationActions`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CommunityOperationActions {
    FlagPost,
    SetUserTitle,
    SetRole,
    Subscribe,
    Unsubscribe,
    PinPost,
    UnpinPost,
    UpdateProps,
    MutePost,
    UnmutePost,
}

impl CommunityOperationActions {
    /// Returns the on-wire string form of the value.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::FlagPost => "flagPost",
            Self::SetUserTitle => "setUserTitle",
            Self::SetRole => "setRole",
            Self::Subscribe => "subscribe",
            Self::Unsubscribe => "unsubscribe",
            Self::PinPost => "pinPost",
            Self::UnpinPost => "unpinPost",
            Self::UpdateProps => "updateProps",
            Self::MutePost => "mutePost",
            Self::UnmutePost => "unmutePost",
        }
    }
}

/// Represents community properties — the `props` payload of an `updateProps`
/// action. Defaults are applied at stage time inside
/// [`CommunityOperation::update_props`].
///
/// TS NOTE: mirrors `ICommunityProps`. `lang` accepts an arbitrary string;
/// pass [`SupportedLanguages::as_str`] when emitting one of the known codes.
#[derive(Debug, Clone, Default)]
pub struct CommunityProps {
    pub title: String,
    pub about: Option<String>,
    pub is_nsfw: Option<bool>,
    pub lang: Option<String>,
    pub description: Option<String>,
    pub flag_text: Option<String>,
}

/// Represents the fluent builder for `custom_json_operation` with
/// `id="community"`.
///
/// Stage entries with the action methods, then commit them via the
/// [`HiveAppsOperation::authorize`] method inherited from the base trait.
/// One `custom_json_operation` is produced per staged entry; the builder
/// can be reused across multiple `stage → authorize` cycles before being
/// pushed onto a transaction.
#[derive(Debug, Clone)]
pub struct CommunityOperation {
    base: HiveAppsOperationBase,
}

impl Default for CommunityOperation {
    fn default() -> Self {
        Self::new()
    }
}

impl CommunityOperation {
    /// Creates an empty community-operation builder.
    pub fn new() -> Self {
        Self {
            base: HiveAppsOperationBase::new(OPERATION_ID),
        }
    }

    /// TS NOTE: trim every top-level string field on the staged body —
    /// matches the TS `push` guard
    /// `if(typeof data[key] === "string") data[key] = data[key].trim();`.
    /// Nested objects (e.g. `props` on `updateProps`) are left untouched,
    /// as in TS.
    fn push(&mut self, action: CommunityOperationActions, mut body: Value) {
        if let Some(obj) = body.as_object_mut() {
            for v in obj.values_mut() {
                if let Value::String(s) = v {
                    *v = Value::String(s.trim().to_string());
                }
            }
        }
        self.base.body.push((action.as_str(), body));
    }

    /// Stages a `flagPost` action on the given community.
    pub fn flag_post(
        mut self,
        community: impl Into<String>,
        account: impl Into<AccountName>,
        permlink: impl Into<String>,
        notes: impl Into<String>,
    ) -> Self {
        self.push(
            CommunityOperationActions::FlagPost,
            json!({
                "community": community.into(),
                "account": account.into(),
                "permlink": permlink.into(),
                "notes": notes.into(),
            }),
        );
        self
    }

    /// Stages a `setRole` action updating the role for a community member.
    pub fn set_role(
        mut self,
        community: impl Into<String>,
        account: impl Into<AccountName>,
        role: AvailableCommunityRoles,
    ) -> Self {
        self.push(
            CommunityOperationActions::SetRole,
            json!({
                "community": community.into(),
                "account": account.into(),
                "role": role.as_str(),
            }),
        );
        self
    }

    /// Stages a `setUserTitle` action setting a title on the given user.
    pub fn set_user_title(
        mut self,
        community: impl Into<String>,
        account: impl Into<AccountName>,
        title: impl Into<String>,
    ) -> Self {
        self.push(
            CommunityOperationActions::SetUserTitle,
            json!({
                "community": community.into(),
                "account": account.into(),
                "title": title.into(),
            }),
        );
        self
    }

    /// Stages a `subscribe` action on the given community.
    pub fn subscribe(mut self, community: impl Into<String>) -> Self {
        self.push(
            CommunityOperationActions::Subscribe,
            json!({ "community": community.into() }),
        );
        self
    }

    /// Stages an `unsubscribe` action from the given community.
    pub fn unsubscribe(mut self, community: impl Into<String>) -> Self {
        self.push(
            CommunityOperationActions::Unsubscribe,
            json!({ "community": community.into() }),
        );
        self
    }

    /// Stages a `pinPost` action pinning a post on the community page.
    pub fn pin_post(
        mut self,
        community: impl Into<String>,
        account: impl Into<AccountName>,
        permlink: impl Into<String>,
    ) -> Self {
        self.push(
            CommunityOperationActions::PinPost,
            json!({
                "community": community.into(),
                "account": account.into(),
                "permlink": permlink.into(),
            }),
        );
        self
    }

    /// Stages an `unpinPost` action unpinning a post from the community page.
    pub fn unpin_post(
        mut self,
        community: impl Into<String>,
        account: impl Into<AccountName>,
        permlink: impl Into<String>,
    ) -> Self {
        self.push(
            CommunityOperationActions::UnpinPost,
            json!({
                "community": community.into(),
                "account": account.into(),
                "permlink": permlink.into(),
            }),
        );
        self
    }

    /// Stages an `updateProps` action updating community properties.
    ///
    /// TS NOTE: optional fields fall back to the TS defaults — empty
    /// strings for the text fields, `false` for `is_nsfw`, and `en` for
    /// `lang`.
    pub fn update_props(
        mut self,
        community: impl Into<String>,
        props: CommunityProps,
    ) -> Self {
        let props_value = json!({
            "title": props.title,
            "about": props.about.unwrap_or_default(),
            "description": props.description.unwrap_or_default(),
            "flag_text": props.flag_text.unwrap_or_default(),
            "is_nsfw": props.is_nsfw.unwrap_or(false),
            "lang": props
                .lang
                .unwrap_or_else(|| SupportedLanguages::English.as_str().to_string()),
        });
        self.push(
            CommunityOperationActions::UpdateProps,
            json!({
                "community": community.into(),
                "props": props_value,
            }),
        );
        self
    }

    /// Stages a `mutePost` action muting a post on the community.
    pub fn mute_post(
        mut self,
        community: impl Into<String>,
        account: impl Into<AccountName>,
        permlink: impl Into<String>,
        notes: impl Into<String>,
    ) -> Self {
        self.push(
            CommunityOperationActions::MutePost,
            json!({
                "community": community.into(),
                "account": account.into(),
                "permlink": permlink.into(),
                "notes": notes.into(),
            }),
        );
        self
    }

    /// Stages an `unmutePost` action unmuting a post on the community.
    pub fn unmute_post(
        mut self,
        community: impl Into<String>,
        account: impl Into<AccountName>,
        permlink: impl Into<String>,
        notes: impl Into<String>,
    ) -> Self {
        self.push(
            CommunityOperationActions::UnmutePost,
            json!({
                "community": community.into(),
                "account": account.into(),
                "permlink": permlink.into(),
                "notes": notes.into(),
            }),
        );
        self
    }
}

impl HiveAppsOperation for CommunityOperation {
    fn base_mut(&mut self) -> &mut HiveAppsOperationBase {
        &mut self.base
    }
}

impl ComplexOperation for CommunityOperation {
    fn finalize(
        self,
        _foundation: &WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        Ok(self.base.finalize())
    }
}
