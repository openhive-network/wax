//! Result and output types returned by the offline [`crate::WaxFoundation`]
//! and [`crate::Transaction`] APIs.

use std::collections::HashMap;

use crate::models::asset::NaiAsset;
use crate::models::authority::Authorities;
use crate::models::basic::{AccountName, ChainId, Hex, PublicKey};

/// Represents zero-amount NaiAsset templates for the three first-class Hive
/// symbols, useful as a starting point or a symbol-specific sentinel.
///
/// TS NOTE: mirrors `IWaxBaseInterface.ASSETS`.
#[derive(Debug, Clone, PartialEq)]
pub struct Assets {
    pub hive: NaiAsset,
    pub hbd: NaiAsset,
    pub vests: NaiAsset,
}

/// Represents the Hive chain configuration constants returned by `hived`'s
/// `get_config` helper. Keys vary by chain build; common ones include
/// `HIVE_CHAIN_ID`, `HIVE_ADDRESS_PREFIX`, `HIVE_TREASURY_ACCOUNT`,
/// `HIVE_SYMBOL`, `HBD_SYMBOL`, `VESTS_SYMBOL` and `IS_TEST_NET`.
///
/// TS NOTE: mirrors `IChainConfig`.
pub type ChainConfig = HashMap<String, String>;

/// Represents a price as a base/quote pair of assets.
#[derive(Debug, Clone, PartialEq)]
pub struct JsonPrice {
    pub base: NaiAsset,
    pub quote: NaiAsset,
}

/// Represents the TaPoS reference-block data (`ref_block_num` and
/// `ref_block_prefix`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RefBlockData {
    pub ref_block_num: u16,
    pub ref_block_prefix: u32,
}

/// Represents an asset's formatted amount and symbol.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct HiveAssetData {
    pub amount: String,
    pub symbol: String,
}

/// Represents a generated brain key with its derived WIF private key and
/// associated public key.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BrainKeyData {
    pub brain_key: String,
    pub wif_private_key: String,
    pub associated_public_key: PublicKey,
}

/// Represents a private key as its WIF form paired with the associated public
/// key.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PrivateKeyData {
    pub wif_private_key: String,
    pub associated_public_key: PublicKey,
}

/// Represents a decoded `crypto-memo`: the two public keys it was encrypted
/// for and the inner base58 encrypted content (the buffer produced by a
/// wallet's `encrypt_data`).
///
/// TS NOTE: mirrors the `crypto_memo` shape passed to / returned from
/// `cpp_crypto_memo_dump_string` / `cpp_crypto_memo_from_string`.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CryptoMemo {
    pub from: PublicKey,
    pub to: PublicKey,
    pub content: String,
}

/// Represents one node in the binary view tree returned by
/// [`crate::Transaction::binary_view_metadata`]. The shape is a recursive AST
/// over the wire-serialized transaction: scalars hold a printable `value`,
/// arrays hold a `length` and `children`, objects hold `children` only.
///
/// TS NOTE: mirrors `IBinaryViewNode` (and `binary_data_node` in
/// `core/types.hpp`).
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum BinaryViewNode {
    Scalar {
        key: String,
        offset: u32,
        size: u32,
        value: String,
    },
    Array {
        key: String,
        offset: u32,
        size: u32,
        length: u32,
        value: String,
        children: Vec<BinaryViewNode>,
    },
    Object {
        key: String,
        offset: u32,
        size: u32,
        value: String,
        children: Vec<BinaryViewNode>,
    },
}

/// Represents the binary view of a transaction: the hex-encoded wire form plus
/// a parsed AST (`offsets`) that annotates each byte range with its semantic
/// role.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BinaryViewOutputData {
    pub binary: Hex,
    pub offsets: Vec<BinaryViewNode>,
}

/// Represents the inputs to
/// [`crate::Transaction::minimize_required_signatures`]: the available keys,
/// the known account authorities and the optional recursion/membership limits
/// applied while minimizing.
#[derive(Debug, Clone, Default, PartialEq)]
pub struct MinimizeRequiredSignaturesData {
    pub chain_id: ChainId,
    pub available_keys: Vec<PublicKey>,
    pub authorities: HashMap<AccountName, Authorities>,
    pub max_recursion: Option<u32>,
    pub max_membership: Option<u32>,
    pub max_account_auths: Option<u32>,
    pub allow_strict_and_mixed_authorities: bool,
}

/// Represents the input to [`crate::WaxFoundation::serialize_witness_props`].
/// Mirrors the C++ `witness_set_properties_data` struct — every field except
/// `key` (the current signing key, used to gate the operation) is optional,
/// and the serializer only packs the subset the caller actually provided.
#[derive(Debug, Clone, PartialEq)]
pub struct WitnessSetPropertiesProps {
    /// Current witness signing public key. Used by hived to authorise the
    /// update; always required.
    pub key: PublicKey,
    pub new_signing_key: Option<PublicKey>,
    /// HIVE-denominated. Caller is expected to have already coerced the asset
    /// to the HIVE symbol (the builder does this in `finalize`).
    pub account_creation_fee: Option<NaiAsset>,
    pub url: Option<String>,
    /// Price pair with `base` in HBD and `quote` in HIVE.
    pub hbd_exchange_rate: Option<JsonPrice>,
    pub maximum_block_size: Option<u32>,
    pub hbd_interest_rate: Option<u16>,
    pub account_subsidy_budget: Option<i32>,
    pub account_subsidy_decay: Option<u32>,
}
