//! Authority-trace data: the result of walking the on-chain authority
//! graph for a signed transaction.

use crate::models::basic::{AccountName, PublicKey, Signature};

/// Represents data produced by walking the on-chain authority graph for a
/// signed transaction.
#[derive(Debug, Clone, Default)]
pub struct AuthorityTrace {
    /// One entry per required authority — pairs the chosen path with the
    /// signatures that satisfied it.
    pub collected_data: Vec<AuthorityPathTraceData>,
    /// Top-level authority entries, one per required signer.
    pub root_entries: Vec<AuthorityPathEntry>,
    /// Overall outcome of the verification, summarised from the last root
    /// entry processed.
    pub verification_status: Option<AuthorityEntryProcessingStatus>,
}

/// Represents the per-required-authority slice of a verification trace:
/// the chosen authority path plus any matching signatures that satisfied it.
#[derive(Debug, Clone)]
pub struct AuthorityPathTraceData {
    /// Signatures whose decoded public key matched a leaf on this path.
    pub matching_signatures: Vec<AuthorityTraceSignatureInfo>,
    /// The selected authority path — successful path on accept, last
    /// processed path on rejection.
    pub final_authority_path: AuthorityPathEntry,
}

/// Represents a single node along an authority resolution path.
#[derive(Debug, Clone)]
pub struct AuthorityPathEntry {
    /// Account name or public key declared by this authority entry.
    pub processed_entry: ProcessedEntry,
    /// Role (posting / active / owner / ...) attached to this entry.
    pub processed_role: AuthorityRole,
    /// Threshold of the parent authority definition.
    pub threshold: u32,
    /// Weight contributed by this entry toward the threshold.
    pub weight: u32,
    /// Nesting level reached while expanding account-authority redirections.
    pub recursion_depth: u32,
    /// Outcome of processing this entry.
    pub processing_status: AuthorityEntryProcessingStatus,
    /// Sub-entries visited while traversing redirected account authorities.
    pub visited_entries: Vec<AuthorityPathEntry>,
}

/// Represents a signature that matched a public key encountered during
/// authority resolution.
#[derive(Debug, Clone)]
pub struct AuthorityTraceSignatureInfo {
    pub signature_key: PublicKey,
    pub signature: Signature,
}

/// Represents the outcome of processing a single authority path entry —
/// either accepted (with extra context) or rejected (with a breakdown of
/// failure causes).
#[derive(Debug, Clone)]
pub enum AuthorityEntryProcessingStatus {
    Accepted {
        /// True when the authority has no signing requirement (threshold 0).
        is_open_authority: bool,
    },
    Rejected {
        /// Recursion limit hit while expanding nested account authorities.
        account_authority_processing_depth_exceeded: bool,
        /// Total processed account-redirection count exceeded.
        account_authority_count_exceeded: bool,
        /// Path entry references an account unknown to the chain.
        account_authority_points_missing_account: bool,
        /// Following account-authority redirections produced a cycle.
        has_account_authority_cycle: bool,
        /// Key/account matched but combined weight fell below threshold.
        has_insufficient_weight: bool,
        /// True if some key in the authority matched but was insufficient;
        /// false if no key matched at all.
        has_matching_public_key: bool,
        /// Set when a signature-decoded public key matched an account that
        /// has no relation to the required authority account.
        unrelated_account_matched_to_public_key: Option<AccountName>,
    },
}

/// Represents the entry being processed at a single step of authority
/// resolution: either an account name (which redirects to another authority)
/// or a public key (a leaf).
#[derive(Debug, Clone)]
pub enum ProcessedEntry {
    Account(AccountName),
    PublicKey(PublicKey),
}

/// Represents the role (posting / active / owner / ...) tied to an authority
/// entry.
pub type AuthorityRole = String;
