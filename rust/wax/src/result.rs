use std::collections::HashMap;

use crate::models::asset::NaiAsset;
use crate::models::authority::Authorities;
use crate::models::basic::{AccountName, ChainId, Hex, PublicKey};

#[derive(Debug, Clone, PartialEq)]
pub struct JsonPrice {
    pub base: NaiAsset,
    pub quote: NaiAsset,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RefBlockData {
    pub ref_block_num: u16,
    pub ref_block_prefix: u32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct HiveAssetData {
    pub amount: String,
    pub symbol: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BrainKeyData {
    pub brain_key: String,
    pub wif_private_key: String,
    pub associated_public_key: PublicKey,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PrivateKeyData {
    pub wif_private_key: String,
    pub associated_public_key: PublicKey,
}

/// One node in the binary view tree returned by [`Transaction::binary_view_metadata`].
///
/// Mirrors `IBinaryViewNode` in the TypeScript bindings and `binary_data_node` in
/// `core/types.hpp`. The shape is a recursive AST over the wire-serialized
/// transaction: scalars hold a printable `value`, arrays hold a `length` and
/// `children`, objects hold `children` only.
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

/// Binary view of a transaction: the hex-encoded wire form plus a parsed AST
/// (`offsets`) that annotates each byte range with its semantic role.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BinaryViewOutputData {
    pub binary: Hex,
    pub offsets: Vec<BinaryViewNode>,
}

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
