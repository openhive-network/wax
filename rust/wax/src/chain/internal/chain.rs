use std::collections::HashMap;
use std::sync::Arc;

use crate::WaxError;
use crate::WaxFoundation;
use crate::WaxOptions;
use crate::create_wax_foundation;

use crate::chain::options::WaxChainOptions;
use crate::models::asset::{
    AssetAmount, AssetName, NaiAsset, NaiAssetConvertible,
};
use crate::models::authority::Authorities;
use crate::models::basic::{
    AccountName, Hex, HiveDateTime, PublicKey, SigDigest, Signature,
};
use crate::proto;
use crate::result::{
    Assets, BinaryViewOutputData, BrainKeyData, ChainConfig, CryptoMemo,
    HiveAssetData, JsonPrice, PrivateKeyData, RefBlockData,
    WitnessSetPropertiesProps,
};
use crate::{ManabarData, Operation, Transaction};

use crate::chain::error::WaxChainError;
use crate::chain::hive_chain::HiveChain;
use crate::chain::rest::{RestCaller, RestClient};
use crate::chain::rpc::{JsonRpcCaller, JsonRpcClient};

/// Concrete [`HiveChain`] implementation. Composes a [`WaxFoundation`] for
/// offline operations and owns the JSON-RPC / REST transports used for
/// online calls.
pub(crate) struct HiveChainApi {
    foundation: Box<dyn WaxFoundation>,
    rpc: Arc<JsonRpcClient>,
    rest: Arc<RestClient>,
    // Kept for the `options()` snapshot — the transports do not expose them
    // back.
    api_timeout_ms: u32,
    wax_api_caller: Option<String>,
}

impl HiveChainApi {
    pub(crate) fn new(options: WaxChainOptions) -> Result<Self, WaxChainError> {
        validate_endpoint(&options.api_endpoint)?;
        validate_endpoint(&options.rest_api_endpoint)?;

        let foundation = create_wax_foundation(WaxOptions {
            chain_id: options.chain_id.clone(),
        });
        let rpc = Arc::new(JsonRpcClient::new(
            options.api_endpoint.clone(),
            options.api_timeout_ms.into(),
            options.wax_api_caller.clone(),
        ));
        let rest = Arc::new(RestClient::new(
            options.rest_api_endpoint,
            options.api_timeout_ms.into(),
            options.wax_api_caller.clone(),
        ));

        Ok(Self {
            foundation,
            rpc,
            rest,
            api_timeout_ms: options.api_timeout_ms,
            wax_api_caller: options.wax_api_caller,
        })
    }
}

fn validate_endpoint(url: &str) -> Result<(), WaxChainError> {
    url::Url::parse(url).map_err(|source| WaxChainError::EndpointParse {
        url: url.to_string(),
        source,
    })?;

    Ok(())
}

impl HiveChain for HiveChainApi {
    fn endpoint_url(&self) -> String {
        self.rpc.endpoint()
    }

    fn set_endpoint_url(&self, url: &str) -> Result<(), WaxChainError> {
        validate_endpoint(url)?;
        self.rpc.set_endpoint(url.to_string());
        Ok(())
    }

    fn rest_endpoint_url(&self) -> String {
        self.rest.endpoint()
    }

    fn set_rest_endpoint_url(&self, url: &str) -> Result<(), WaxChainError> {
        validate_endpoint(url)?;
        self.rest.set_endpoint(url.to_string());

        Ok(())
    }

    fn json_rpc_caller(&self) -> JsonRpcCaller {
        JsonRpcCaller::new(self.rpc.clone())
    }

    fn rest_caller(&self) -> RestCaller {
        RestCaller::new(self.rest.clone())
    }

    fn options(&self) -> WaxChainOptions {
        WaxChainOptions {
            chain_id: self.foundation.chain_id().to_string(),
            api_endpoint: self.rpc.endpoint(),
            rest_api_endpoint: self.rest.endpoint(),
            api_timeout_ms: self.api_timeout_ms,
            wax_api_caller: self.wax_api_caller.clone(),
        }
    }
}

// Delegates every WaxFoundation method to the composed foundation.
//
// NOTE: Rust has no "extends" — to satisfy the `HiveChain: WaxFoundation`
// supertrait bound, we forward each method here. Body changes belong on the
// underlying foundation, not this delegating impl.
macro_rules! forward {
    ($( fn $name:ident(&self $(, $arg:ident: $argty:ty)* $(,)?) -> $ret:ty );* $(;)?) => {
        $(
            fn $name(&self $(, $arg: $argty)*) -> $ret {
                self.foundation.$name($($arg),*)
            }
        )*
    };
}

impl WaxFoundation for HiveChainApi {
    fn chain_id(&self) -> &str {
        self.foundation.chain_id()
    }

    fn get_version(&self) -> &'static str {
        self.foundation.get_version()
    }

    fn extend_config(&self, chain_id: &str) -> Box<dyn WaxFoundation> {
        self.foundation.extend_config(chain_id)
    }

    forward! {
        fn crypto_memo_dump_string(
            &self,
            memo: &CryptoMemo
        ) -> Result<String, WaxError>;
        fn crypto_memo_from_string(
            &self,
            value: &str
        ) -> Result<CryptoMemo, WaxError>;

        fn address_prefix(&self) -> Result<String, WaxError>;
        fn config(&self) -> Result<ChainConfig, WaxError>;
        fn assets(&self) -> Result<Assets, WaxError>;

        fn hive_coins(&self, amount: AssetAmount) -> Result<NaiAsset, WaxError>;
        fn hbd_coins(&self, amount: AssetAmount) -> Result<NaiAsset, WaxError>;
        fn vests_coins(&self, amount: AssetAmount) -> Result<NaiAsset, WaxError>;

        fn hive_satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError>;
        fn hbd_satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError>;
        fn vests_satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError>;

        fn hbd_to_hive(
            &self,
            hbd: &NaiAsset,
            base: &NaiAsset,
            quote: &NaiAsset,
        ) -> Result<NaiAsset, WaxError>;

        fn hive_to_hbd(
            &self,
            amount: &NaiAsset,
            base: &NaiAsset,
            quote: &NaiAsset,
        ) -> Result<NaiAsset, WaxError>;

        fn vests_to_hp(
            &self,
            vests: &NaiAsset,
            total_vesting_fund_hive: &NaiAsset,
            total_vesting_shares: &NaiAsset,
        ) -> Result<NaiAsset, WaxError>;

        fn hp_to_vests(
            &self,
            hive: &NaiAsset,
            total_vesting_fund_hive: &NaiAsset,
            total_vesting_shares: &NaiAsset,
        ) -> Result<NaiAsset, WaxError>;

        fn calculate_account_hp(
            &self,
            vests: NaiAssetConvertible,
            total_vesting_fund_hive: NaiAssetConvertible,
            total_vesting_shares: NaiAssetConvertible,
        ) -> Result<NaiAsset, WaxError>;

        fn calculate_witness_votes_hp(
            &self,
            votes: NaiAssetConvertible,
            total_vesting_fund_hive: NaiAssetConvertible,
            total_vesting_shares: NaiAssetConvertible,
        ) -> Result<NaiAsset, WaxError>;

        fn estimate_hive_collateral(
            &self,
            current_median_history: &JsonPrice,
            current_min_history: &JsonPrice,
            hbd_amount_to_get: &NaiAsset,
        ) -> Result<NaiAsset, WaxError>;

        fn estimate_hbd_interest(
            &self,
            hbd_seconds: u128,
            head_block_time: u32,
            hbd: &NaiAsset,
            hbd_seconds_last_update: u32,
            hbd_interest_rate: u16,
        ) -> Result<NaiAsset, WaxError>;

        fn calculate_hp_apr(
            &self,
            head_block_num: u32,
            vesting_reward_percent: u16,
            virtual_supply: &NaiAsset,
            total_vesting_fund_hive: &NaiAsset,
        ) -> Result<String, WaxError>;

        fn create_asset_with_required_symbol(
            &self,
            required_symbol: AssetName,
            asset: NaiAssetConvertible,
        ) -> Result<NaiAsset, WaxError>;

        fn get_asset(&self, asset: &NaiAsset) -> Result<HiveAssetData, WaxError>;

        fn calculate_current_manabar_value(
            &self,
            head_block_time: HiveDateTime,
            max_mana: i64,
            current_mana: i64,
            last_update_time: u32,
        ) -> Result<ManabarData, WaxError>;

        fn calculate_manabar_full_regeneration_time(
            &self,
            head_block_time: HiveDateTime,
            max_mana: i64,
            current_mana: i64,
            last_update_time: u32,
        ) -> Result<u64, WaxError>;

        fn is_valid_account_name(&self, name: &str) -> bool;

        fn calculate_public_key(&self, wif_private_key: &str) -> Result<String, WaxError>;

        fn get_public_key_from_signature(
            &self,
            sig_digest: &SigDigest,
            signature: &Signature,
        ) -> Result<PublicKey, WaxError>;

        fn suggest_brain_key(&self) -> Result<BrainKeyData, WaxError>;

        fn get_private_key_from_password(
            &self,
            account: &str,
            role: &str,
            password: &str,
        ) -> Result<PrivateKeyData, WaxError>;

        fn convert_raw_private_key_to_wif(
            &self,
            raw_private_key: &Hex,
        ) -> Result<String, WaxError>;

        fn convert_raw_public_key_to_wif(
            &self,
            raw_public_key: &Hex,
        ) -> Result<String, WaxError>;

        fn deserialize_transaction(&self, hex: &Hex) -> Result<String, WaxError>;

        fn convert_transaction_to_binary_form(
            &self,
            transaction: &serde_json::Value,
            strip_to_unsigned: bool,
        ) -> Result<Hex, WaxError>;

        fn convert_transaction_from_binary_form(
            &self,
            hex: &Hex,
        ) -> Result<serde_json::Value, WaxError>;

        fn legacy_transaction_to_json(&self, legacy_json: &str) -> Result<String, WaxError>;

        fn create_transaction_from_legacy_json(
            &self,
            legacy_json: &str,
        ) -> Result<Transaction, WaxError>;

        fn get_tapos_data(&self, block_id: &str) -> Result<RefBlockData, WaxError>;

        fn create_transaction_from_proto(
            &self,
            transaction: proto::Transaction,
        ) -> Result<Transaction, WaxError>;

        fn create_transaction_from_json(
            &self,
            json: &str,
        ) -> Result<Transaction, WaxError>;

        fn create_transaction_from_proto_json(
            &self,
            json: &str,
        ) -> Result<Transaction, WaxError>;

        fn create_transaction_with_tapos(
            &self,
            tapos_block_id: &str,
            expiration: &str,
        ) -> Result<Transaction, WaxError>;

        fn create_transaction_with_chain_reference_data(
            &self,
            tapos_block_id: &str,
            head_block_time: Option<HiveDateTime>,
            expiration: Option<&str>,
        ) -> Result<Transaction, WaxError>;

        fn operation_get_impacted_accounts(
            &self,
            operation: &proto::Operation,
        ) -> Result<Vec<AccountName>, WaxError>;

        fn operation_binary_view_metadata(
            &self,
            operation: &proto::Operation,
            use_hf26_serialization: bool,
        ) -> Result<BinaryViewOutputData, WaxError>;

        fn create_operation_from_proto(
            &self,
            operation: proto::Operation,
        ) -> Box<dyn Operation>;

        fn create_operation(&self, value: proto::operation::Value) -> Box<dyn Operation>;

        fn create_operation_from_json(
            &self,
            json: &str,
        ) -> Result<Box<dyn Operation>, WaxError>;

        fn serialize_witness_props(
            &self,
            props: &WitnessSetPropertiesProps,
        ) -> Result<HashMap<String, String>, WaxError>;

        fn scan_text_for_matching_private_keys(
            &self,
            content: &str,
            account: &str,
            account_authorities: &Authorities,
            memo_key: &PublicKey,
            other_keys: &[PublicKey],
        ) -> Result<(), WaxError>;

        fn general_asset(
            &self,
            asset_num: u32,
            amount: i64,
        ) -> Result<NaiAsset, WaxError>;

        fn calculate_inflation_rate_for_block(
            &self,
            block_num: u32,
        ) -> Result<i64, WaxError>;

        fn generate_private_key(&self) -> Result<String, WaxError>;

        fn convert_wif_public_key_to_raw(
            &self,
            wif_public_key: &PublicKey,
        ) -> Result<Hex, WaxError>;

        fn default_comment_options(
            &self,
            author: &str,
            permlink: &str,
        ) -> Result<proto::CommentOptions, WaxError>;

        fn deserialize_witness_props(
            &self,
            serialized_props: &HashMap<String, String>,
        ) -> Result<WitnessSetPropertiesProps, WaxError>;
    }
}
