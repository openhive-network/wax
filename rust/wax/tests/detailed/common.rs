//! Shared test fixture for the `detailed` integration-test suite. Rust port of
//! the TS `waxTest` helper in
//! `ts/wasm/__tests__/assets/jest-helper.ts`.

use wax::{WaxFoundation, WaxOptions, create_wax_foundation};

pub struct WaxTestCtx {
    pub base: Box<dyn WaxFoundation>,
}

pub fn wax_test<R>(
    options: impl Into<Option<WaxOptions>>,
    test: impl FnOnce(&WaxTestCtx) -> R,
) -> R {
    let ctx = WaxTestCtx {
        base: create_wax_foundation(options),
    };
    test(&ctx)
}
