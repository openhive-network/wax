//! Enums mirroring TS `EManabarType` and `ECommentFormat`. Currently unused
//! by the offline crate — kept here so consumers in §3 (Comment builders) and
//! §7/§8 (online manabar accessors) can land without a parallel models PR.

/// Which manabar pool to inspect on an account. Mirrors TS `EManabarType`
/// (`chain_api.ts`). Discriminant values match TS exactly so the FFI form is
/// the same when an online layer eventually consumes it.
#[allow(dead_code)]
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

/// Content format hint for the comment-family builders. Mirrors TS
/// `ECommentFormat` from `complex_operations/comment.ts`; the string forms
/// match the values the JSON metadata uses on chain.
#[allow(dead_code)]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ECommentFormat {
    Html,
    Markdown,
    /// `"markdown+html"` — Hive's mixed-format marker.
    Mixed,
}

impl ECommentFormat {
    #[allow(dead_code)]
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Html => "html",
            Self::Markdown => "markdown",
            Self::Mixed => "markdown+html",
        }
    }
}
