//! Output formatting: an extensible tree rewriter turning raw blockchain
//! data (NAI assets, transactions, hive-apps `custom_json` payloads) into
//! human-readable output.
//!
//! The entry point is [`WaxFoundation::formatter`](crate::WaxFoundation::formatter)
//! (also reachable on a chain through its foundation `Deref`); extend it
//! with custom rules via [`WaxFormatter::extend`] and the
//! [`hive_formatter`](crate::hive_formatter) attribute. Ports
//! `ts/wasm/lib/detailed/formatters/`; the design record is `formatters.md`
//! and the TS capability differences `formatters_diff.md` at the repo root.

pub(crate) mod defaults;
pub(crate) mod engine;
pub(crate) mod formatter;
pub(crate) mod options;
pub(crate) mod registry;

#[cfg(test)]
mod tests;

pub use defaults::DefaultFormatters;
pub use formatter::{FormattedDisplay, FoundationHandle, WaxFormatter};
pub use options::{
    AssetFormatterOptions, NumberSeparators, TransactionFormatterOptions,
    WaxFormatterOptions,
};
pub use registry::{
    CustomFormatter, FormatContext, FormatFn, FormatterRegistry, MatchRule,
};
