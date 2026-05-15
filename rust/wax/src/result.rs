use std::collections::HashMap;

use crate::models::authority::Authorities;
use crate::models::basic::{AccountName, ChainId, PublicKey};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct JsonAsset {
    pub amount: String,
    pub precision: u32,
    pub nai: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct JsonPrice {
    pub base: JsonAsset,
    pub quote: JsonAsset,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RefBlockData {
    pub ref_block_num: u16,
    pub ref_block_prefix: u32,
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
