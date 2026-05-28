# wax_chain

The **online** layer of Wax: chain-bound capabilities built on top of the
offline [`wax`](../wax) crate. Where `wax` builds and signs transactions
locally, `wax_chain` adds everything that needs to talk to a Hive node —
endpoint management, JSON-RPC transport, and chain-dependent transaction checks.

> **Status:** the public surface is being defined first; some operations are
> stubbed with `todo!` pending implementation. Expect the API to grow (API
> namespaces, `broadcast`, online transaction construction) in later phases.

## Responsibility

- Layer chain-bound behavior on top of `WaxFoundation` via the `HiveChain`
  trait (which has `WaxFoundation` as a supertrait, so a chain can be used
  anywhere a foundation is expected).
- Manage the JSON-RPC and REST endpoint URLs at runtime.
- Carry a pooled `reqwest` HTTP client and issue JSON-RPC calls.
- Provide chain-dependent transaction checks via `OnlineTransaction`:
  private-key leak detection (cross-referencing signing accounts against chain
  state) and authority-verification trace generation.

## API

Entry point:

```rust
use wax_chain::{create_hive_chain, WaxChainOptions};

let chain = create_hive_chain(WaxChainOptions::default())?;
let _ = chain.endpoint_url();
chain.set_endpoint_url("https://api.hive.blog")?;
```

Exports (from the crate root):

| Item | Description |
|------|-------------|
| `create_hive_chain` | Factory returning a `Box<dyn HiveChain>`. Synchronous (unlike the async TS `createHiveChain`). |
| `HiveChain` | Online API surface; extends `WaxFoundation`. Currently: JSON-RPC and REST endpoint get/set. |
| `OnlineTransaction` | Extends `wax::Transaction` with chain-dependent checks: `perform_on_chain_verification`, `generate_authority_verification_trace`. |
| `WaxChainOptions` | Construction options: `chain_id`, `api_endpoint`, `rest_api_endpoint`, `api_timeout_ms`, optional caller tag. |
| `WaxChainError` | Error enum: HTTP, JSON-RPC envelope, deserialization, endpoint-parse, and wrapped `wax::WaxError`. |
| Authority-trace types | `AuthorityTrace`, `AuthorityPathTraceData`, `AuthorityPathEntry`, `AuthorityTraceSignatureInfo`, `AuthorityEntryProcessingStatus`, `ProcessedEntry`, `AuthorityRole` — the structured output of authority verification. |

## Building & testing

```bash
cargo build -p wax_chain    # pulls in wax / wax_core (CMake) on first run
cargo test  -p wax_chain
```

See the workspace [README](../README.md) for prerequisites and the Docker build.
