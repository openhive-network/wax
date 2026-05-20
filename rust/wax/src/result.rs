use std::collections::HashMap;

use crate::models::asset::NaiAsset;
use crate::models::authority::Authorities;
use crate::models::basic::{AccountName, ChainId, PublicKey};

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
