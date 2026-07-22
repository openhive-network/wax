//! Builder for the Follow / Reblog "hive apps" operation.
//!
//! Mirrors `FollowOperation` from
//! `ts/wasm/lib/detailed/hive_apps_operations/follow.ts`. Builds one
//! `custom_json_operation` per staged entry on `authorize`
//! (see [`super::factory::HiveAppsOperation`]), with `id="follow"` and
//! per-entry action tags of either `follow` or `reblog`.

use crate::core::proto;
use serde::Serialize;
use serde_json::Value;

use super::factory::{HiveAppsOperation, HiveAppsOperationBase};
use crate::WaxError;
use crate::base::foundation::WaxFoundation;
use crate::base::models::basic::AccountName;
use crate::base::operation::ComplexOperation;

const OPERATION_ID: &str = "follow";

/// Maximum number of `following` entries allowed on a single `follow` body
/// when emitted as an array.
const MAX_FOLLOWING: usize = 100;

/// Represents which list (or both) a `reset_blog_list` call should drop
/// matching entries from.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum FollowBlogAction {
    FollowBlog,
    MuteBlog,
    Both,
}

/// Represents the outer action tag carried by a `follow` hive-apps body —
/// either a follow-list mutation or a reblog.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum FollowOperationActions {
    Follow,
    Reblog,
}

impl FollowOperationActions {
    /// Returns the on-wire string form of the action.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Follow => "follow",
            Self::Reblog => "reblog",
        }
    }
}

/// Represents the `what`-tag a single follow-action body carries.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum FollowActions {
    Follow,
    Unfollow,
    Mute,
    ResetBlacklist,
    Blacklist,
    ResetFollowBlacklist,
    FollowBlacklist,
    Unblacklist,
    UnfollowBlacklist,
    ResetFollowMutedList,
    FollowMuted,
    UnfollowMuted,
    ResetAllLists,
    ResetFollowingList,
    ResetMutedList,
}

impl FollowActions {
    /// Returns the on-wire string form of the action.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Follow => "blog",
            Self::Unfollow => "",
            Self::Mute => "ignore",
            Self::ResetBlacklist => "reset_blacklist",
            Self::Blacklist => "blacklist",
            Self::ResetFollowBlacklist => "reset_follow_blacklist",
            Self::FollowBlacklist => "follow_blacklist",
            Self::Unblacklist => "unblacklist",
            Self::UnfollowBlacklist => "unfollow_blacklist",
            Self::ResetFollowMutedList => "reset_follow_muted_list",
            Self::FollowMuted => "follow_muted",
            Self::UnfollowMuted => "unfollow_muted",
            Self::ResetAllLists => "reset_all_lists",
            Self::ResetFollowingList => "reset_following_list",
            Self::ResetMutedList => "reset_muted_list",
        }
    }
}

/// Represents the fluent builder for `custom_json_operation` with
/// `id="follow"`.
///
/// Stage entries with the action methods (`follow_blog`, `mute_blog`,
/// `reblog`, …), then commit them via the
/// [`HiveAppsOperation::authorize`] method inherited from the base trait.
/// One `custom_json_operation` is produced per staged entry; the builder
/// can be reused across multiple `stage → authorize` cycles before being
/// pushed onto a transaction.
#[derive(Debug, Clone)]
pub struct FollowOperation {
    base: HiveAppsOperationBase,
}

impl Default for FollowOperation {
    fn default() -> Self {
        Self::new()
    }
}

impl FollowOperation {
    /// Creates an empty follow-operation builder.
    pub fn new() -> Self {
        Self {
            base: HiveAppsOperationBase::new(OPERATION_ID),
        }
    }

    /// Shared body builder for every `follow`-tagged action.
    fn follow_body_builder(
        mut self,
        what: FollowActions,
        working_account: AccountName,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        if blogs.is_empty() {
            return Err(WaxError::new(
                "blogs must contain at least one account",
            ));
        }

        let following = if blogs.len() == 1 {
            Value::String(blogs.into_iter().next().unwrap())
        } else {
            if blogs.len() > MAX_FOLLOWING {
                return Err(WaxError::ToLongFollowingList {
                    max_length: MAX_FOLLOWING as u32,
                });
            }
            Value::Array(blogs.into_iter().map(Value::String).collect())
        };

        let body = serde_json::to_string(&FollowBody {
            follower: working_account,
            following,
            what: [what.as_str()],
        })
        .expect("follow body serialization is infallible");
        self.base
            .body
            .push((FollowOperationActions::Follow.as_str(), body));

        Ok(self)
    }

    /// Stages a follow entry for the given blog account(s).
    pub fn follow_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::Follow,
            working_account.into(),
            blogs,
        )
    }

    /// Stages an unfollow entry — also used to unmute, per the TS comment.
    pub fn unfollow_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::Unfollow,
            working_account.into(),
            blogs,
        )
    }

    /// Stages a mute entry for the given blog account(s).
    pub fn mute_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::Mute,
            working_account.into(),
            blogs,
        )
    }

    /// Stages an unmute entry — alias for [`Self::unfollow_blog`] to match
    /// the TS `unmuteBlog` helper.
    pub fn unmute_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.unfollow_blog(working_account, blogs)
    }

    /// Stages a `reset_blacklist` entry for the given blog account(s).
    pub fn reset_blacklist_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::ResetBlacklist,
            working_account.into(),
            blogs,
        )
    }

    /// Stages a `blacklist` entry for the given blog account(s).
    pub fn blacklist_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::Blacklist,
            working_account.into(),
            blogs,
        )
    }

    /// Stages a `reset_follow_blacklist` entry for the given blog account(s).
    pub fn reset_follow_blacklist_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::ResetFollowBlacklist,
            working_account.into(),
            blogs,
        )
    }

    /// Stages a `follow_blacklist` entry for the given blog account(s).
    pub fn follow_blacklist_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::FollowBlacklist,
            working_account.into(),
            blogs,
        )
    }

    /// Stages an `unblacklist` entry for the given blog account(s).
    pub fn unblacklist_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::Unblacklist,
            working_account.into(),
            blogs,
        )
    }

    /// Stages an `unfollow_blacklist` entry for the given blog account(s).
    pub fn unfollow_blacklist_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::UnfollowBlacklist,
            working_account.into(),
            blogs,
        )
    }

    /// Stages a `reset_follow_muted_list` entry for the given blog account(s).
    pub fn reset_follow_muted_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::ResetFollowMutedList,
            working_account.into(),
            blogs,
        )
    }

    /// Stages a `follow_muted` entry for the given blog account(s).
    pub fn follow_muted_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::FollowMuted,
            working_account.into(),
            blogs,
        )
    }

    /// Stages an `unfollow_muted` entry for the given blog account(s).
    pub fn unfollow_muted_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::UnfollowMuted,
            working_account.into(),
            blogs,
        )
    }

    /// Stages a `reset_all_lists` entry for the given blog account(s).
    pub fn reset_all_blog(
        self,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.follow_body_builder(
            FollowActions::ResetAllLists,
            working_account.into(),
            blogs,
        )
    }

    /// Stages reset entries clearing matching entries between
    /// `working_account` (the follower) and the given blog account(s),
    /// scoped to `action`.
    pub fn reset_blog_list(
        self,
        action: FollowBlogAction,
        working_account: impl Into<AccountName>,
        blogs: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        let working_account = working_account.into();
        match action {
            FollowBlogAction::FollowBlog => self.follow_body_builder(
                FollowActions::ResetFollowingList,
                working_account,
                blogs,
            ),
            FollowBlogAction::MuteBlog => self.follow_body_builder(
                FollowActions::ResetMutedList,
                working_account,
                blogs,
            ),
            FollowBlogAction::Both => self
                .follow_body_builder(
                    FollowActions::ResetFollowingList,
                    working_account.clone(),
                    blogs.clone(),
                )?
                .follow_body_builder(
                    FollowActions::ResetMutedList,
                    working_account,
                    blogs,
                ),
        }
    }

    /// Stages a `reblog` entry for the given post.
    pub fn reblog(
        mut self,
        working_account: impl Into<AccountName>,
        author: impl Into<AccountName>,
        permlink: impl Into<String>,
    ) -> Self {
        let body = serde_json::to_string(&ReblogBody {
            account: working_account.into(),
            author: author.into(),
            permlink: permlink.into(),
        })
        .expect("reblog body serialization is infallible");
        self.base
            .body
            .push((FollowOperationActions::Reblog.as_str(), body));
        self
    }
}

// Staged-body shapes. Field order mirrors the TS insertion order —
// serialized bytes must match `JSON.stringify` exactly, because the payload
// string is part of the signed operation.

#[derive(Serialize)]
struct FollowBody {
    follower: AccountName,
    /// Bare string for a single blog, array otherwise (TS shape).
    following: Value,
    what: [&'static str; 1],
}

#[derive(Serialize)]
struct ReblogBody {
    account: AccountName,
    author: AccountName,
    permlink: String,
}

impl HiveAppsOperation for FollowOperation {
    fn base_mut(&mut self) -> &mut HiveAppsOperationBase {
        &mut self.base
    }
}

impl ComplexOperation for FollowOperation {
    fn finalize(
        self,
        _foundation: &WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        Ok(self.base.finalize())
    }
}
