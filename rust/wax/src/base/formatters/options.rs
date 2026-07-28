//! Configuration for the wax output formatter.

/// Represents the configuration of a
/// [`WaxFormatter`](super::formatter::WaxFormatter).
///
/// Mirrors `IWaxFormatterOptions` from
/// `ts/wasm/lib/detailed/formatters/types.ts`; the TS `DeepPartial` override
/// form maps onto `Default` + struct-update syntax here.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WaxFormatterOptions {
    pub asset: AssetFormatterOptions,
    pub transaction: TransactionFormatterOptions,
    /// Registers the default wax formatting rules on construction.
    ///
    /// Defaults to `true`.
    pub create_default_formatters: bool,
}

/// Represents the asset-formatting options of a
/// [`WaxFormatter`](super::formatter::WaxFormatter).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AssetFormatterOptions {
    /// Displays assets in NAI form instead of the human-readable form.
    ///
    /// Defaults to `false`.
    pub display_as_nai: bool,
    /// Appends the token name after the asset amount (e.g. `1.100 HIVE`).
    ///
    /// Defaults to `true`.
    pub append_token_name: bool,
    /// Formats the output amount with group separators (e.g.
    /// `100,000,000.100 HIVE`).
    ///
    /// Defaults to `true`.
    pub format_amount: bool,
    /// Separators used when `format_amount` is enabled.
    pub separators: NumberSeparators,
}

/// Represents the transaction-formatting options of a
/// [`WaxFormatter`](super::formatter::WaxFormatter).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TransactionFormatterOptions {
    /// Displays a transaction as its id instead of an object.
    ///
    /// Defaults to `true`.
    pub display_as_id: bool,
}

/// Represents the group and decimal separators used when formatting
/// amounts.
///
/// TS NOTE: TS delegates grouping to `Intl.NumberFormat` with optional
/// BCP-47 `locales`; Rust has no built-in locale data, so the separators
/// are explicit (defaulting to the `en-US` style).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct NumberSeparators {
    pub group: String,
    pub decimal: String,
}

// Builder-style setters reaching through the option nesting, so a
// configuration reads as one chain (`WaxFormatterOptions::default()
// .with_display_as_nai(true).with_separators(" ", ".")`). The fields stay
// public — struct-update syntax remains available for the explicit form.
impl WaxFormatterOptions {
    /// Displays assets in NAI form instead of the human-readable form.
    pub fn with_display_as_nai(mut self, value: bool) -> Self {
        self.asset.display_as_nai = value;
        self
    }

    /// Appends the token name after the asset amount (e.g. `1.100 HIVE`).
    pub fn with_append_token_name(mut self, value: bool) -> Self {
        self.asset.append_token_name = value;
        self
    }

    /// Formats amounts with group separators.
    pub fn with_format_amount(mut self, value: bool) -> Self {
        self.asset.format_amount = value;
        self
    }

    /// Sets the group and decimal separators used when `format_amount` is
    /// enabled.
    pub fn with_separators(
        mut self,
        group: impl Into<String>,
        decimal: impl Into<String>,
    ) -> Self {
        self.asset.separators = NumberSeparators {
            group: group.into(),
            decimal: decimal.into(),
        };
        self
    }

    /// Displays transactions as their id instead of an object.
    pub fn with_transaction_as_id(mut self, value: bool) -> Self {
        self.transaction.display_as_id = value;
        self
    }

    /// Registers the default wax formatting rules on construction.
    pub fn with_default_formatters(mut self, value: bool) -> Self {
        self.create_default_formatters = value;
        self
    }
}

impl Default for WaxFormatterOptions {
    fn default() -> Self {
        Self {
            asset: AssetFormatterOptions::default(),
            transaction: TransactionFormatterOptions::default(),
            create_default_formatters: true,
        }
    }
}

impl Default for AssetFormatterOptions {
    fn default() -> Self {
        Self {
            display_as_nai: false,
            append_token_name: true,
            format_amount: true,
            separators: NumberSeparators::default(),
        }
    }
}

impl Default for TransactionFormatterOptions {
    fn default() -> Self {
        Self {
            display_as_id: true,
        }
    }
}

impl Default for NumberSeparators {
    fn default() -> Self {
        Self {
            group: ",".to_string(),
            decimal: ".".to_string(),
        }
    }
}
