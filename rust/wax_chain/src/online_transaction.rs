use wax::Transaction;

use crate::error::WaxChainError;

/// Represents data produced by walking the on-chain authority graph for a
/// signed transaction.
///
/// TS NOTE: the TypeScript counterpart `IVerifyAuthorityTrace`
/// (`ts/wasm/lib/detailed/verify_authority_trace_interface.ts`) carries a
/// tree of `IAuthorityPathEntry` nodes plus matched signatures. The Rust
/// shape is left as a placeholder until the authority-trace transport is
/// wired up — see `rust/hive.md` Phase 4.
#[derive(Debug, Clone, Default)]
pub struct AuthorityTrace {}

/// Provides chain-bound checks on top of an offline-built [`Transaction`].
///
/// Layered on top of `Transaction`:
/// - private-key leak detection (signing accounts cross-referenced against chain state)
/// - authority verification trace generation
///
/// Both require fetching account authorities from the chain, so they live on
/// this trait instead of `Transaction`.
///
#[allow(async_fn_in_trait)]
pub trait OnlineTransaction: Transaction {
    /// Runs chain-dependent transaction checks (currently: private-key leak
    /// detection). Returns an error if any check fails.
    async fn perform_on_chain_verification(&self) -> Result<(), WaxChainError>;

    /// Builds an authority verification trace for the (already signed)
    /// transaction. `use_legacy` forces pre-HF26 serialization when true.
    async fn generate_authority_verification_trace(
        &self,
        use_legacy: bool,
    ) -> Result<AuthorityTrace, WaxChainError>;
}
