use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::Duration;

use wax::WaxError;
use wax::WaxFoundation;
use wax::WaxOptions;
use wax::create_wax_foundation;

use crate::options::WaxChainOptions;
use wax::models::asset::{AssetAmount, AssetName, NaiAsset, NaiAssetConvertible};
use wax::models::authority::Authorities;
use wax::models::basic::{AccountName, Hex, HiveDateTime, PublicKey, SigDigest, Signature};
use wax::proto;
use wax::result::{
    Assets, BinaryViewOutputData, BrainKeyData, ChainConfig, HiveAssetData, JsonPrice,
    PrivateKeyData, RefBlockData, WitnessSetPropertiesProps,
};
use wax::{ManabarData, RustTransaction};

use crate::chain::HiveChain;
use crate::error::WaxChainError;
use crate::rpc::JsonRpcClient;


/// Concrete [`HiveChain`] implementation. Composes a [`WaxFoundation`] for
/// offline operations and holds the JSON-RPC / REST endpoints used for
/// online calls.
pub(crate) struct HiveChainApi {
    foundation: Box<dyn WaxFoundation>,
    #[allow(dead_code)]
    rpc: Arc<JsonRpcClient>,
    rest_endpoint: Mutex<String>,
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
            Duration::from_millis(options.api_timeout_ms.into()),
        )?);

        Ok(Self {
            foundation,
            rpc,
            rest_endpoint: Mutex::new(options.rest_api_endpoint),
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
        self.rest_endpoint
            .lock()
            .expect("rest endpoint mutex poisoned")
            .clone()
    }

    fn set_rest_endpoint_url(&self, url: &str) -> Result<(), WaxChainError> {
        validate_endpoint(url)?;
        *self
            .rest_endpoint
            .lock()
            .expect("rest endpoint mutex poisoned") = url.to_string();
        Ok(())
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
        ) -> Result<RustTransaction, WaxError>;

        fn get_tapos_data(&self, block_id: &str) -> Result<RefBlockData, WaxError>;

        fn create_transaction_from_proto(
            &self,
            transaction: proto::Transaction,
        ) -> Result<RustTransaction, WaxError>;

        fn create_transaction_from_json(&self, json: &str) -> Result<RustTransaction, WaxError>;

        fn create_transaction_with_tapos(
            &self,
            tapos_block_id: &str,
            expiration: &str,
        ) -> Result<RustTransaction, WaxError>;

        fn create_transaction_with_chain_reference_data(
            &self,
            tapos_block_id: &str,
            head_block_time: Option<HiveDateTime>,
            expiration: Option<&str>,
        ) -> Result<RustTransaction, WaxError>;

        fn operation_get_impacted_accounts(
            &self,
            operation: &proto::Operation,
        ) -> Result<Vec<AccountName>, WaxError>;

        fn operation_binary_view_metadata(
            &self,
            operation: &proto::Operation,
            use_hf26_serialization: bool,
        ) -> Result<BinaryViewOutputData, WaxError>;

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
    }
}
