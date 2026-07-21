//! Builder for the Community "hive apps" operation.
//!
//! Mirrors `CommunityOperation` from
//! `ts/wasm/lib/detailed/hive_apps_operations/community.ts`. Builds one
//! `custom_json_operation` per staged entry on `authorize` (see
//! [`super::factory::HiveAppsOperation`]), with `id="community"`.

use crate::core::proto;
use serde::Serialize;

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

    /// Serializes `body` (typed structs below — field order matches the TS
    /// insertion order, so the payload bytes equal `JSON.stringify`) and
    /// stages it under `action`.
    fn push(
        &mut self,
        action: CommunityOperationActions,
        body: &impl Serialize,
    ) {
        let body = serde_json::to_string(body)
            .expect("community body serialization is infallible");
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
            &PostNotesBody {
                community: trimmed(community),
                account: trimmed(account),
                permlink: trimmed(permlink),
                notes: trimmed(notes),
            },
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
            &RoleBody {
                community: trimmed(community),
                account: trimmed(account),
                role: role.as_str(),
            },
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
            &TitleBody {
                community: trimmed(community),
                account: trimmed(account),
                title: trimmed(title),
            },
        );
        self
    }

    /// Stages a `subscribe` action on the given community.
    pub fn subscribe(mut self, community: impl Into<String>) -> Self {
        self.push(
            CommunityOperationActions::Subscribe,
            &CommunityBody {
                community: trimmed(community),
            },
        );
        self
    }

    /// Stages an `unsubscribe` action from the given community.
    pub fn unsubscribe(mut self, community: impl Into<String>) -> Self {
        self.push(
            CommunityOperationActions::Unsubscribe,
            &CommunityBody {
                community: trimmed(community),
            },
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
            &PostBody {
                community: trimmed(community),
                account: trimmed(account),
                permlink: trimmed(permlink),
            },
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
            &PostBody {
                community: trimmed(community),
                account: trimmed(account),
                permlink: trimmed(permlink),
            },
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
        self.push(
            CommunityOperationActions::UpdateProps,
            &UpdatePropsBody {
                community: trimmed(community),
                props: UpdatePropsPayload {
                    title: props.title,
                    about: props.about.unwrap_or_default(),
                    description: props.description.unwrap_or_default(),
                    flag_text: props.flag_text.unwrap_or_default(),
                    is_nsfw: props.is_nsfw.unwrap_or(false),
                    lang: props.lang.unwrap_or_else(|| {
                        SupportedLanguages::English.as_str().to_string()
                    }),
                },
            },
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
            &PostNotesBody {
                community: trimmed(community),
                account: trimmed(account),
                permlink: trimmed(permlink),
                notes: trimmed(notes),
            },
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
            &PostNotesBody {
                community: trimmed(community),
                account: trimmed(account),
                permlink: trimmed(permlink),
                notes: trimmed(notes),
            },
        );
        self
    }
}

// Staged-body shapes. Field order mirrors the TS insertion order —
// serialized bytes must match `JSON.stringify` exactly, because the payload
// string is part of the signed operation.

#[derive(Serialize)]
struct PostNotesBody {
    community: String,
    account: AccountName,
    permlink: String,
    notes: String,
}

#[derive(Serialize)]
struct PostBody {
    community: String,
    account: AccountName,
    permlink: String,
}

#[derive(Serialize)]
struct RoleBody {
    community: String,
    account: AccountName,
    role: &'static str,
}

#[derive(Serialize)]
struct TitleBody {
    community: String,
    account: AccountName,
    title: String,
}

#[derive(Serialize)]
struct CommunityBody {
    community: String,
}

#[derive(Serialize)]
struct UpdatePropsBody {
    community: String,
    props: UpdatePropsPayload,
}

#[derive(Serialize)]
struct UpdatePropsPayload {
    title: String,
    about: String,
    description: String,
    flag_text: String,
    is_nsfw: bool,
    lang: String,
}

/// TS NOTE: the TS `push` guard trims every top-level string field of a
/// staged body (`data[key].trim()`); the typed bodies apply the same trim
/// per field at construction time. Nested objects (`props`) stay untouched,
/// as in TS.
fn trimmed(value: impl Into<String>) -> String {
    value.into().trim().to_string()
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
