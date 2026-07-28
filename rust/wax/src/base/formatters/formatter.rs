//! The public formatter type: [`WaxFormatter`], created through
//! [`WaxFoundation::formatter`](crate::WaxFoundation::formatter) or
//! [`WaxFormatter::new`].

use std::any::{Any, TypeId};
use std::fmt;
use std::sync::Arc;

use serde::Serialize;
use serde_json::Value;

use crate::WaxError;
use crate::base::foundation::WaxFoundation;

use super::defaults::DefaultFormatters;
use super::engine::format_value;
use super::options::{NumberSeparators, WaxFormatterOptions};
use super::registry::{CustomFormatter, FormatterRegistry};

/// The shared foundation handle formatter extensions receive through
/// [`CustomFormatter::create`] — the Rust form of the `wax` constructor
/// argument of TS custom formatter classes.
pub type FoundationHandle = Arc<WaxFoundation>;

/// Represents the extensible wax output formatter: a tree rewriter turning
/// raw blockchain data (NAI assets, transactions, hive-apps `custom_json`
/// payloads) into human-readable output.
///
/// Mirrors `WaxFormatter` from `ts/wasm/lib/detailed/formatters/waxify.ts`.
/// Derive configured or extended formatters with [`Self::extend`] /
/// [`Self::extend_options`] — both return a new formatter and never mutate
/// the one they are called on.
#[derive(Clone)]
pub struct WaxFormatter {
    wax: FoundationHandle,
    options: WaxFormatterOptions,
    registry: FormatterRegistry,
}

/// Represents the rendered output of [`WaxFormatter::display`].
pub struct FormattedDisplay(String);

impl WaxFormatter {
    /// Creates a formatter bound to the given foundation handle, registering
    /// the [`DefaultFormatters`] unless `options.create_default_formatters`
    /// is `false`. `None` uses the default options.
    pub fn new(
        wax: FoundationHandle,
        options: impl Into<Option<WaxFormatterOptions>>,
    ) -> Self {
        let options = options.into().unwrap_or_default();
        let base = Self {
            wax,
            options,
            registry: FormatterRegistry::default(),
        };

        if base.options.create_default_formatters {
            return base.extend::<DefaultFormatters>();
        }
        base
    }

    /// Returns the formatter options.
    pub fn options(&self) -> &WaxFormatterOptions {
        &self.options
    }

    /// Derives a new formatter with `F`'s rules registered on top of this
    /// one's. Mirrors TS `formatter.extend(FormatterClass)`: `F` is
    /// constructed with the foundation handle and its rules take precedence
    /// over previously registered ones.
    pub fn extend<F: CustomFormatter>(&self) -> Self {
        let mut next = self.clone();
        let custom = Arc::new(F::create(Arc::clone(&self.wax)));
        custom.register(&mut next.registry);

        next
    }

    /// Derives a new formatter with the same rules but the given options.
    /// Mirrors the TS options-only `formatter.extend(options)` overload;
    /// partial overrides use struct-update syntax on
    /// [`WaxFormatterOptions::default`].
    pub fn extend_options(&self, options: WaxFormatterOptions) -> Self {
        Self {
            wax: Arc::clone(&self.wax),
            options,
            registry: self.registry.clone(),
        }
    }

    /// Formats `value` through the registered rules and returns the
    /// rewritten tree. Mirrors TS `format`, which returns live objects where
    /// rules produced them; here the tree is plain JSON — retrieve typed
    /// data through the decode parsers instead (e.g.
    /// [`ResourceCreditsOperationData`](crate::hive_apps_operations::ResourceCreditsOperationData)).
    ///
    /// Typed-root rules registered with
    /// [`FormatterRegistry::register_instance`] are checked against `value`'s
    /// concrete type first — the closest port of the TS `matchInstanceOf`
    /// matching.
    pub fn format<T>(&self, value: &T) -> Result<Value, WaxError>
    where
        T: Serialize + Any,
    {
        let instance = self.registry.instances.get(&TypeId::of::<T>());
        if let Some(format) = instance
            && let Some(result) = format(&self.options, value)
        {
            return Ok(result);
        }

        let source = serde_json::to_value(value).map_err(|e| {
            WaxError::new(format!("failed to serialize formatter input: {e}"))
        })?;

        Ok(format_value(&self.registry, &self.options, &source))
    }

    /// Formats `value` and renders it for display: strings verbatim, any
    /// other result as compact JSON. The Rust form of the TS `waxify` tagged
    /// template — compose it with the `format!` family:
    ///
    /// ```no_run
    /// # fn demo(formatter: &wax::WaxFormatter, nai: &wax::models::NaiAsset)
    /// # -> Result<(), wax::WaxError> {
    /// println!("Account value: {}", formatter.display(nai)?);
    /// # Ok(())
    /// # }
    /// ```
    pub fn display<T>(&self, value: &T) -> Result<FormattedDisplay, WaxError>
    where
        T: Serialize + Any,
    {
        let formatted = self.format(value)?;
        let rendered = match formatted {
            Value::String(text) => text,
            other => other.to_string(),
        };

        Ok(FormattedDisplay(rendered))
    }

    /// Formats a numeric amount (integer or decimal, of arbitrary
    /// magnitude) with the configured group separators, keeping `precision`
    /// fraction digits (padded with zeros) or the amount's own fraction when
    /// `None`.
    ///
    /// Mirrors TS `formatNumber`; see [`NumberSeparators`] for the locale
    /// handling difference.
    pub fn format_number(
        &self,
        amount: impl ToString,
        precision: impl Into<Option<u32>>,
    ) -> String {
        format_number_with(
            &amount.to_string(),
            precision.into(),
            &self.options.asset.separators,
        )
    }
}

impl fmt::Display for FormattedDisplay {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

impl From<FormattedDisplay> for String {
    fn from(value: FormattedDisplay) -> Self {
        value.0
    }
}

/// Formats a stringified numeric amount with the given separators — the
/// grouping half of TS `formatNumber`, sans `Intl`.
///
/// NOTE: TS throws from `BigInt(...)` on a non-numeric amount; a string
/// that is not `-?digits[.digits]` is returned unchanged here instead.
pub(crate) fn format_number_with(
    amount: &str,
    precision: Option<u32>,
    separators: &NumberSeparators,
) -> String {
    // TS coerces `NaN` to 0 before formatting.
    let amount = if amount == "NaN" { "0" } else { amount };

    let Some((sign, integer, fraction)) = split_decimal(amount) else {
        return amount.to_string();
    };

    let grouped = group_digits(integer, &separators.group);

    // No decimal part when the precision is zero, or when the amount has
    // no fraction and no precision was requested.
    if precision == Some(0) || (fraction.is_none() && precision.is_none()) {
        return format!("{sign}{grouped}");
    }

    let fraction = fraction_digits(fraction.unwrap_or(""), precision);

    format!("{sign}{grouped}{}{fraction}", separators.decimal)
}

/// Splits a stringified amount into its sign, integer digits and fraction
/// digits; `None` when it is not `-?digits[.digits]`.
fn split_decimal(amount: &str) -> Option<(&'static str, &str, Option<&str>)> {
    let (sign, magnitude) = amount
        .strip_prefix('-')
        .map_or(("", amount), |rest| ("-", rest));
    let (integer, fraction) = match magnitude.split_once('.') {
        Some((integer, fraction)) => (integer, Some(fraction)),
        None => (magnitude, None),
    };

    let valid = |digits: &str| {
        !digits.is_empty() && digits.bytes().all(|b| b.is_ascii_digit())
    };

    (valid(integer) && fraction.is_none_or(valid))
        .then_some((sign, integer, fraction))
}

/// Groups integer digits in threes, dropping leading zeros.
fn group_digits(integer: &str, group: &str) -> String {
    let integer = integer.trim_start_matches('0');
    let integer = if integer.is_empty() { "0" } else { integer };

    let mut grouped = String::new();
    for (index, digit) in integer.chars().enumerate() {
        let remaining = integer.len() - index;
        if index > 0 && remaining % 3 == 0 {
            grouped.push_str(group);
        }
        grouped.push(digit);
    }

    grouped
}

/// Keeps `precision` fraction digits (zero-padded), or the fraction as-is
/// when no precision was requested.
fn fraction_digits(fraction: &str, precision: Option<u32>) -> String {
    let Some(precision) = precision else {
        return fraction.to_string();
    };

    let precision = precision as usize;
    let mut kept: String = fraction.chars().take(precision).collect();
    while kept.len() < precision {
        kept.push('0');
    }

    kept
}
