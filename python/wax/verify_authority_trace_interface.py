from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from wax.models.basic import AccountName, PublicKey, Signature


@dataclass
class AuthorityEntryVerificationSuccess:
    is_open_authority: bool
    """
    - true if authority is open
    - false when any key in the authority matched (it implies sufficient weight)
    """
    entry_accepted: bool = True


@dataclass
class AuthorityEntryVerificationFailure:
    account_authority_processing_depth_exceeded: bool
    """True if given authority processing has been interrupted by crossing recursion limit"""
    account_authority_count_exceeded: bool
    """True if given path entry processing has been interrupted by crossing number of processed account redirections"""
    account_authority_points_missing_account: bool
    """True if given path entry points to the account not known by the blockchain."""
    has_account_authority_cycle: bool
    """True if given path entry created a cycle while processing authority account redirection."""
    has_insufficient_weight: bool
    """True when key/account entry matched, but the weight was insufficient."""
    has_matching_public_key: bool
    """
    - true when authority has matching any key, but the weight is insufficient
    - false when authority does not contain any matching key
    """
    unrelated_account_matched_to_public_key: AccountName | None = None
    """
    Will be set to non-none value when given (decoded from signature) public key matched to some account,
    but it is not associated in any way to required authority accounts.
    """
    entry_accepted: bool = False


type AuthorityEntryProcessingStatus = AuthorityEntryVerificationSuccess | AuthorityEntryVerificationFailure


@dataclass
class AuthorityPathEntry:
    processed_entry: AccountName | PublicKey
    """Account name or public key bein specified at given authority entry definition."""
    processed_role: str
    """Role level (posting/active/owner) being processed."""
    threshold: int
    """Threshold specific to processed authority role definition."""
    weight: int
    """A weight specific to processed (account or key) entry definition."""
    recursion_depth: int
    """Current processing nest level (in case of account authority redirection it can be > 1)."""
    processing_status: AuthorityEntryProcessingStatus
    """Determines set of information collected during processing given authority path entry."""
    visited_entries: list[AuthorityPathEntry]
    """
    Holds entries being visited during traversing redirected account authority definitions.
    This structure allows to see all paths entered during authority verification process.
    """


@dataclass
class AuthorityTraceSignatureInfo:
    signature_key: PublicKey
    signature: Signature


@dataclass
class AuthorityPathTraceData:
    matching_signatures: list[AuthorityTraceSignatureInfo]
    final_authority_path: AuthorityPathEntry


@dataclass
class VerifyAuthorityTrace:
    collected_data: list[AuthorityPathTraceData]
    root_entries: list[AuthorityPathEntry]
    verification_status: AuthorityEntryProcessingStatus
