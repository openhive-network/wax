use thiserror::Error;

use crate::models::asset::AssetName;
use crate::models::basic::{AccountName, PublicKey};

/// Represents any error returned by the offline wax API, including errors
/// surfaced from the underlying C++ layer.
#[derive(Debug, Error)]
pub enum WaxError {
    #[error("{0}")]
    Cxx(String),

    #[error("{0}")]
    Generic(String),

    #[error(
        "You must compile the proto files before importing them. \
         Using `build.sh` script is recommended."
    )]
    ImportProtoBeforeCompile,

    #[error("{data}")]
    Assertion { hash: String, data: String },

    #[error("{data}")]
    ChainAssertion { hash: String, data: String },

    #[error("{data}")]
    ProtocolAssertion { hash: String, data: String },

    #[error("Cannot create asset with the invalid amount: {amount}")]
    InvalidAssetAmount { amount: String },

    #[error("Unknown asset type: {symbol}")]
    UnknownAssetType { symbol: String },

    #[error("Unknown asset with nai: {nai}")]
    UnknownAssetNai { nai: String },

    #[error("Cannot create asset from {potential_asset}.")]
    CannotCreateAsset { potential_asset: String },

    #[error("Unexpected asset: {asset}, expected: {expected:?}")]
    UnexpectedAssetType {
        asset: String,
        expected: Vec<AssetName>,
    },

    #[error("Account '{accounts:?}' not found.")]
    AccountNotFound { accounts: Vec<AccountName> },

    #[error("Cannot edit temporary account in hive category")]
    HiveTempAccountUsed,

    #[error("Authority membership exceeds. Max: {max}, current: {current}")]
    HiveMaxAuthorityMembershipExceeded { max: u32, current: u32 },

    #[error("{level} authority cannot be satisfied due to insufficient weight")]
    AuthorityCannotBeSatisfied { level: String },

    #[error("Private key was detected in the memo field")]
    PrivateKeyDetectedInMemo,

    #[error("Missing authority")]
    MissingAuthority,

    #[error("Decimal conversion failed: value is not a number")]
    DecimalConversionNotANumber,

    #[error("Precision must be a positive integer. Given: {precision}")]
    DecimalConversionNegativePrecision { precision: i32 },

    #[error("Validation using wax failed due to: {reason}")]
    Validation { reason: String },

    #[error("Account name '{account}' is invalid.")]
    InvalidAccountName { account: AccountName },

    #[error("Operation is in invalid format")]
    InvalidOperationFormat,

    #[error("Endpoint url '{url}' is in invalid format.")]
    InvalidEndpointUrlFormat { url: String },

    #[error("Account or key '{account_or_key}' is invalid.")]
    InvalidAccountOrKey { account_or_key: String },

    #[error("Invalid memo key: {memo_key} provided.")]
    InvalidMemoKey { memo_key: PublicKey },

    #[error("No operations updating account authority generated.")]
    NoAuthorityOperationGenerated,

    #[error("Too long following list. Accepted max length: {max_length}.")]
    ToLongFollowingList { max_length: u32 },
}

impl WaxError {
    /// Creates a generic error from an arbitrary message.
    pub fn new(message: impl Into<String>) -> Self {
        Self::Generic(message.into())
    }

    /// Returns the error's human-readable message.
    pub fn message(&self) -> String {
        self.to_string()
    }
}

impl From<cxx::Exception> for WaxError {
    fn from(value: cxx::Exception) -> Self {
        Self::Cxx(value.what().to_string())
    }
}
