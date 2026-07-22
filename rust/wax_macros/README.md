# hiveio-wax-macros

Proc-macro companion of the [`hiveio-wax`](../wax/README.md) crate: the
`#[hive_api]` attribute generating typed JSON-RPC / REST API surfaces for
`HiveChain::extend` / `HiveChain::extend_rest`.

Do not depend on this crate directly — use `hiveio-wax`, which re-exports the
attribute as `wax::hive_api` and pins the exact version it was built against.

## License

MIT — see [LICENSE.md](../../LICENSE.md).
