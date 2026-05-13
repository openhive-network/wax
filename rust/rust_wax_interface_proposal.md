# Rust Wax Public Interface Proposal

## Crate naming

The current `api/` crate name conflicts with the established meaning of "api" in the wax ecosystem — in both TypeScript and Python, `api` refers to Hive JSON-RPC node communication. The public interface crate should be renamed to `wax_foundation`, directly mirroring `createWaxFoundation()` (TS) and `create_wax_foundation()` (Python).

Future online-capable crate would follow the same pattern: `wax_chain` (mirroring `createHiveChain()`).

## Trait naming

Rust does not use the `I` prefix for traits. The TypeScript interfaces map to Rust traits without the prefix:

| TypeScript | Rust |
|------------|------|
| `ITransaction` | `Transaction` |
| `IWaxBaseInterface` | `WaxFoundation` |
| `IHiveChainInterface` | `HiveChain` |

## Crate structure

```
wax_foundation/
└── src/
    ├── lib.rs              ← public API surface (re-exports only)
    ├── prelude.rs          ← convenience re-exports for users
    ├── error.rs            ← pub struct WaxError
    ├── transaction.rs      ← pub trait Transaction
    ├── foundation.rs       ← pub trait WaxFoundation
    ├── chain.rs            ← pub trait HiveChain
    └── internal/           ← pub(crate) implementations, never re-exported
        ├── wax_transaction.rs
        ├── wax_foundation.rs
        └── protocol.rs
```

## Public API surface (`lib.rs`)

```rust
pub mod prelude {
    pub use crate::transaction::Transaction;
    pub use crate::foundation::WaxFoundation;
    pub use crate::chain::HiveChain;
    pub use crate::error::WaxError;
}

pub use prelude::*;

pub mod transaction;
pub mod foundation;
pub mod chain;
pub mod error;

mod internal;

pub fn create_wax_foundation() -> Box<dyn WaxFoundation> { ... }
pub fn create_hive_chain(endpoint: &str) -> Box<dyn HiveChain> { ... }
```

## Implementation hiding

Concrete types (`WaxTransactionImpl`, `WaxFoundationImpl`) are `pub(crate)` inside `internal/` and never exposed. Factory functions return `Box<dyn Trait>`, matching the TypeScript pattern where users work with interface types and never touch the underlying class:

```rust
let foundation: Box<dyn WaxFoundation> = create_wax_foundation();
let mut tx: Box<dyn Transaction> = foundation.create_transaction(...);
tx.push_operation(op);
```

Swapping the implementation requires changing only the `Box::new(...)` inside the factory — no changes to user code.

## `Transaction` trait scope

Methods map directly to `ITransaction` / `ITransactionBase` from `interfaces.ts`. Methods requiring C++ serialization bridge are declared in the trait but stubbed with `todo!()` until the bridge is extended:

| Method | Status |
|--------|--------|
| `push_operation(&mut self, op: Operation)` | implemented |
| `add_signature(&mut self, sig: String)` | implemented |
| `is_signed(&self) -> bool` | implemented |
| `transaction(&self) -> &proto::Transaction` | implemented |
| `sig_digest(&self) -> Result<String, WaxError>` | stub — needs C++ serialization |
| `id(&self) -> Result<String, WaxError>` | stub — needs C++ serialization |
| `to_api(&self) -> Result<String, WaxError>` | stub — needs C++ serialization |
| `validate(&self) -> Result<(), WaxError>` | stub — needs C++ serialization |
| `to_binary_form(&self, strip: bool) -> Result<String, WaxError>` | stub — needs C++ serialization |
