//! Enums shared with the comment builders and online manabar accessors.

/// Represents which manabar pool to inspect on an account. Consumed by the
/// per-account manabar accessors of [`crate::HiveChain`]
/// (`calculate_current_manabar_value_for_account` /
/// `calculate_manabar_full_regeneration_time_for_account`).
///
/// TS NOTE: mirrors `EManabarType` (`chain_api.ts`); discriminant values match
/// TS exactly.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[repr(u8)]
pub enum EManabarType {
    Upvote = 0,
    Downvote = 1,
    Rc = 2,
}

impl Default for EManabarType {
    fn default() -> Self {
        Self::Upvote
    }
}

/// Represents the content-format hint for the comment-family builders.
///
/// TS NOTE: mirrors `ECommentFormat` from `complex_operations/comment.ts`; the
/// string forms match the values the JSON metadata uses on chain.
#[allow(dead_code)]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ECommentFormat {
    Html,
    Markdown,
    /// `"markdown+html"` — Hive's mixed-format marker.
    Mixed,
}

impl ECommentFormat {
    /// Returns the on-chain string form of the format.
    #[allow(dead_code)]
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Html => "html",
            Self::Markdown => "markdown",
            Self::Mixed => "markdown+html",
        }
    }
}
