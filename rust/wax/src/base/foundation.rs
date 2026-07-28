//! The offline foundation type: [`WaxFoundation`], created by
//! [`create_wax_foundation`](crate::create_wax_foundation).

use std::collections::HashMap;
use std::sync::{Arc, OnceLock};

use crate::core::ffi::{
    RustCryptoMemo, RustJsonAsset, RustJsonPrice, RustWitnessPropEntry,
    RustWitnessSetPropertiesData,
};
use crate::core::{RustOperation, RustTransaction, proto};

use rust_decimal::Decimal;
use rust_decimal::prelude::ToPrimitive;
use std::str::FromStr;

use crate::WaxError;
use crate::base::constants::{
    DEFAULT_CHAIN_ID, DEFAULT_COMMENT_MAX_ACCEPTED_PAYOUT_SATOSHIS,
    DEFAULT_COMMENT_PERCENT_HBD,
};
use crate::base::formatters::WaxFormatter;
use crate::base::internal::authority::to_rust_authorities;
use crate::base::internal::protocol::rust_protocol;
use crate::base::models::asset::{
    Asset, AssetAmount, AssetName, NaiAsset, NaiAssetConvertible,
};
use crate::base::models::authority::Authorities;
use crate::base::models::basic::{
    AccountName, Hex, PublicKey, SigDigest, Signature,
};
use crate::base::models::hive_date_time::HiveDateTime;
use crate::base::models::manabar_data::ManabarData;
use crate::base::operation::Operation;
use crate::base::options::WaxOptions;
use crate::base::result::{
    Assets, BinaryViewOutputData, BrainKeyData, ChainConfig, CryptoMemo,
    HiveAssetData, JsonPrice, PrivateKeyData, RefBlockData,
    WitnessSetPropertiesProps,
};
use crate::base::transaction::{Transaction, to_binary_view_output};

/// Represents the offline Hive API: asset math, key and account helpers,
/// transaction and operation construction, and validation. Created by
/// [`create_wax_foundation`](crate::create_wax_foundation).
pub struct WaxFoundation {
    options: WaxOptions,
    // Lazily-populated cache of `hive::protocol::get_config(chain_id)` so we
    // don't pay the FFI + map-build cost on every `address_prefix()` /
    // `config()` call (TS caches identically in WaxBaseApi, Python in
    // base_api._cached_config).
    cached_config: OnceLock<ChainConfig>,
    // Lazily-built default formatter (TS initializes `this.formatter` in the
    // WaxBaseApi constructor; here the default-rule registration is deferred
    // to the first `formatter()` call).
    cached_formatter: OnceLock<WaxFormatter>,
    // Zero-amount NaiAsset templates. Eagerly populated in `new()` to match
    // how TS sets `this.ASSETS` in its constructor and Python in `Asset.__init__`.
    assets: Assets,
}

const HIVE_PRECISION: u32 = 3;
const HBD_PRECISION: u32 = 3;
const VESTS_PRECISION: u32 = 6;

const HIVE_ADDRESS_PREFIX_KEY: &str = "HIVE_ADDRESS_PREFIX";

impl WaxFoundation {
    pub(crate) fn new(options: WaxOptions) -> Self {
        // The three cpp_{hive,hbd,vests}(0) calls are deterministic for a
        // well-built native lib; failure here is a build / linkage problem,
        // not a runtime input issue. Matches `RustTransaction::new`'s
        // `.expect("failed to create transaction handle")` precedent.
        let protocol = rust_protocol();
        let assets = Assets {
            hive: to_nai_asset(protocol.cpp_hive(0).expect(
                "cpp_hive(0) must not fail in a well-built core bridge",
            )),
            hbd: to_nai_asset(protocol.cpp_hbd(0).expect(
                "cpp_hbd(0) must not fail in a well-built core bridge",
            )),
            vests: to_nai_asset(protocol.cpp_vests(0).expect(
                "cpp_vests(0) must not fail in a well-built core bridge",
            )),
        };
        Self {
            options,
            cached_config: OnceLock::new(),
            cached_formatter: OnceLock::new(),
            assets,
        }
    }

    /// Returns the default output formatter bound to this foundation's chain
    /// context. Cached per foundation; derive configured or extended
    /// formatters from it with [`WaxFormatter::extend`] /
    /// [`WaxFormatter::extend_options`].
    pub fn formatter(&self) -> &WaxFormatter {
        self.cached_formatter.get_or_init(|| {
            // The formatter needs an owned foundation handle; deriving one
            // from the options is lossless — they are the whole identity of
            // a foundation.
            WaxFormatter::new(
                Arc::new(WaxFoundation::new(self.options.clone())),
                None,
            )
        })
    }

    /// Returns the chain id this foundation was constructed with.
    pub fn chain_id(&self) -> &str {
        &self.options.chain_id
    }

    /// Returns the Hive address prefix (typically `"STM"` for mainnet),
    /// derived from [`Self::config`] via the `HIVE_ADDRESS_PREFIX` key.
    pub fn address_prefix(&self) -> Result<String, WaxError> {
        let config = self.config()?;
        config.get(HIVE_ADDRESS_PREFIX_KEY).cloned().ok_or_else(|| {
            WaxError::new(format!(
                "{HIVE_ADDRESS_PREFIX_KEY} missing from protocol config"
            ))
        })
    }

    /// Returns the full hived protocol config for this chain — the map
    /// returned by `hive::protocol::get_config`. Cached per foundation.
    pub fn config(&self) -> Result<ChainConfig, WaxError> {
        if let Some(cached) = self.cached_config.get() {
            return Ok(cached.clone());
        }

        let entries = rust_protocol()
            .cpp_get_hive_protocol_config(&self.options.chain_id)
            .map_err(WaxError::from)?;
        let map: ChainConfig =
            entries.into_iter().map(|e| (e.key, e.value)).collect();
        // OnceLock::set is a noop if another thread won the race; either way,
        // we end up returning the same logical config.
        let _ = self.cached_config.set(map.clone());

        Ok(map)
    }

    /// Returns the bundled crate version (`CARGO_PKG_VERSION`).
    pub fn get_version(&self) -> &'static str {
        env!("CARGO_PKG_VERSION")
    }

    /// Derives a new foundation that shares this one's runtime state but uses
    /// the given chain id.
    pub fn extend_config(&self, chain_id: &str) -> Self {
        Self::new(WaxOptions {
            chain_id: chain_id.to_string(),
        })
    }

    /// Returns zero-amount NaiAsset templates for HIVE / HBD / VESTS. Cached
    /// per foundation.
    pub fn assets(&self) -> Result<Assets, WaxError> {
        Ok(self.assets.clone())
    }

    /// Creates a HIVE asset from a whole-coin amount.
    pub fn hive_coins(
        &self,
        amount: impl Into<AssetAmount>,
    ) -> Result<NaiAsset, WaxError> {
        let satoshis = amount_to_satoshis(amount.into(), HIVE_PRECISION)?;
        self.hive_satoshis(satoshis)
    }

    /// Creates an HBD asset from a whole-coin amount.
    pub fn hbd_coins(
        &self,
        amount: impl Into<AssetAmount>,
    ) -> Result<NaiAsset, WaxError> {
        let satoshis = amount_to_satoshis(amount.into(), HBD_PRECISION)?;
        self.hbd_satoshis(satoshis)
    }

    /// Creates a VESTS asset from a whole-coin amount.
    pub fn vests_coins(
        &self,
        amount: impl Into<AssetAmount>,
    ) -> Result<NaiAsset, WaxError> {
        let satoshis = amount_to_satoshis(amount.into(), VESTS_PRECISION)?;
        self.vests_satoshis(satoshis)
    }

    /// Creates a HIVE asset from a raw satoshi amount.
    pub fn hive_satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_hive(amount)
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    /// Creates an HBD asset from a raw satoshi amount.
    pub fn hbd_satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_hbd(amount)
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    /// Creates a VESTS asset from a raw satoshi amount.
    pub fn vests_satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_vests(amount)
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    /// Creates an asset of an arbitrary symbol from its packed asset number and
    /// a raw satoshi amount. Unlike
    /// [`Self::create_asset_with_required_symbol`] (which only handles the
    /// HIVE/HBD/VESTS symbols), this accepts any packed asset id — e.g.
    /// `3_200_000_035` for HIVE.
    pub fn general_asset(
        &self,
        asset_num: u32,
        amount: i64,
    ) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_general_asset(asset_num, amount)
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    /// Converts an HBD amount into HIVE using the given price feed.
    pub fn hbd_to_hive(
        &self,
        hbd: &NaiAsset,
        base: &NaiAsset,
        quote: &NaiAsset,
    ) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_hbd_to_hive(
                &to_ffi_asset(hbd),
                &to_ffi_asset(base),
                &to_ffi_asset(quote),
            )
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    /// Converts a HIVE amount into HBD using the given price feed.
    pub fn hive_to_hbd(
        &self,
        amount: &NaiAsset,
        base: &NaiAsset,
        quote: &NaiAsset,
    ) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_hive_to_hbd(
                &to_ffi_asset(amount),
                &to_ffi_asset(base),
                &to_ffi_asset(quote),
            )
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    /// Converts a VESTS amount into Hive Power (HP).
    pub fn vests_to_hp(
        &self,
        vests: &NaiAsset,
        total_vesting_fund_hive: &NaiAsset,
        total_vesting_shares: &NaiAsset,
    ) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_vests_to_hp(
                &to_ffi_asset(vests),
                &to_ffi_asset(total_vesting_fund_hive),
                &to_ffi_asset(total_vesting_shares),
            )
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    /// Converts a Hive Power (HP) amount into VESTS.
    pub fn hp_to_vests(
        &self,
        hive: &NaiAsset,
        total_vesting_fund_hive: &NaiAsset,
        total_vesting_shares: &NaiAsset,
    ) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_hp_to_vests(
                &to_ffi_asset(hive),
                &to_ffi_asset(total_vesting_fund_hive),
                &to_ffi_asset(total_vesting_shares),
            )
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    /// Calculates an account's Hive Power from its vesting shares.
    pub fn calculate_account_hp(
        &self,
        vests: NaiAssetConvertible,
        total_vesting_fund_hive: NaiAssetConvertible,
        total_vesting_shares: NaiAssetConvertible,
    ) -> Result<NaiAsset, WaxError> {
        let vests =
            self.create_asset_with_required_symbol(AssetName::Vests, vests)?;
        let total_vesting_fund_hive = self.create_asset_with_required_symbol(
            AssetName::Hive,
            total_vesting_fund_hive,
        )?;
        let total_vesting_shares = self.create_asset_with_required_symbol(
            AssetName::Vests,
            total_vesting_shares,
        )?;
        self.vests_to_hp(
            &vests,
            &total_vesting_fund_hive,
            &total_vesting_shares,
        )
    }

    /// Calculates the Hive Power backing a witness's votes.
    pub fn calculate_witness_votes_hp(
        &self,
        votes: NaiAssetConvertible,
        total_vesting_fund_hive: NaiAssetConvertible,
        total_vesting_shares: NaiAssetConvertible,
    ) -> Result<NaiAsset, WaxError> {
        let votes =
            self.create_asset_with_required_symbol(AssetName::Vests, votes)?;
        let total_vesting_fund_hive = self.create_asset_with_required_symbol(
            AssetName::Hive,
            total_vesting_fund_hive,
        )?;
        let total_vesting_shares = self.create_asset_with_required_symbol(
            AssetName::Vests,
            total_vesting_shares,
        )?;
        self.vests_to_hp(
            &votes,
            &total_vesting_fund_hive,
            &total_vesting_shares,
        )
    }

    /// Estimates the HIVE collateral required to borrow the given HBD amount.
    pub fn estimate_hive_collateral(
        &self,
        current_median_history: &JsonPrice,
        current_min_history: &JsonPrice,
        hbd_amount_to_get: &NaiAsset,
    ) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_estimate_hive_collateral(
                &to_ffi_price(current_median_history),
                &to_ffi_price(current_min_history),
                &to_ffi_asset(hbd_amount_to_get),
            )
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    /// Estimates the HBD interest accrued for the given holding period.
    pub fn estimate_hbd_interest(
        &self,
        hbd_seconds: u128,
        head_block_time: u32,
        hbd: &NaiAsset,
        hbd_seconds_last_update: u32,
        hbd_interest_rate: u16,
    ) -> Result<NaiAsset, WaxError> {
        let hbd_seconds_low = hbd_seconds as u64;
        let hbd_seconds_high = (hbd_seconds >> 64) as u64;
        rust_protocol()
            .cpp_estimate_hbd_interest(
                hbd_seconds_low,
                hbd_seconds_high,
                head_block_time,
                &to_ffi_asset(hbd),
                hbd_seconds_last_update,
                hbd_interest_rate,
            )
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    /// Calculates the current Hive Power APR, in percent (2 decimal
    /// places).
    pub fn calculate_hp_apr(
        &self,
        head_block_num: u32,
        vesting_reward_percent: u16,
        virtual_supply: &NaiAsset,
        total_vesting_fund_hive: &NaiAsset,
    ) -> Result<Decimal, WaxError> {
        let apr = rust_protocol()
            .cpp_calculate_hp_apr(
                head_block_num,
                vesting_reward_percent,
                &to_ffi_asset(virtual_supply),
                &to_ffi_asset(total_vesting_fund_hive),
            )
            .map_err(WaxError::from)?;

        apr.parse()
            .map_err(|_| WaxError::DecimalConversionNotANumber)
    }

    /// Calculates the instantaneous inflation rate, in basis points, for the
    /// given block number.
    pub fn calculate_inflation_rate_for_block(
        &self,
        block_num: u32,
    ) -> Result<i64, WaxError> {
        rust_protocol()
            .cpp_calculate_inflation_rate_for_block(block_num)
            .map_err(WaxError::from)
    }

    /// Resolves a convertible asset into a [`NaiAsset`] of the required symbol.
    pub fn create_asset_with_required_symbol(
        &self,
        required_symbol: AssetName,
        asset: NaiAssetConvertible,
    ) -> Result<NaiAsset, WaxError> {
        Asset::new()?.resolve_from_convertible_type(required_symbol, asset)
    }

    /// Returns the symbol metadata and formatted value of an asset.
    pub fn get_asset(
        &self,
        asset: &NaiAsset,
    ) -> Result<HiveAssetData, WaxError> {
        let protocol = rust_protocol();
        let ffi = to_ffi_asset(asset);
        let amount = protocol.cpp_asset_value(&ffi).map_err(WaxError::from)?;
        let symbol = protocol.cpp_asset_symbol(&ffi).map_err(WaxError::from)?;
        Ok(HiveAssetData { amount, symbol })
    }

    /// Calculates a manabar's current value, regenerated to `head_block_time`.
    pub fn calculate_current_manabar_value(
        &self,
        head_block_time: HiveDateTime,
        max_mana: i64,
        current_mana: i64,
        last_update_time: u32,
    ) -> Result<ManabarData, WaxError> {
        let now = head_block_time_to_now(head_block_time);
        let regenerated = rust_protocol()
            .cpp_calculate_current_manabar_value(
                now,
                max_mana,
                current_mana,
                last_update_time,
            )
            .map_err(WaxError::from)?;
        Ok(ManabarData::new(max_mana, regenerated))
    }

    /// Calculates the time at which a manabar will be fully regenerated.
    pub fn calculate_manabar_full_regeneration_time(
        &self,
        head_block_time: HiveDateTime,
        max_mana: i64,
        current_mana: i64,
        last_update_time: u32,
    ) -> Result<u64, WaxError> {
        let now = head_block_time_to_now(head_block_time);
        rust_protocol()
            .cpp_calculate_manabar_full_regeneration_time(
                now,
                max_mana,
                current_mana,
                last_update_time,
            )
            .map_err(WaxError::from)
    }

    /// Returns whether the given string is a valid Hive account name.
    pub fn is_valid_account_name(&self, name: &str) -> bool {
        rust_protocol().cpp_is_valid_account_name(name)
    }

    /// Calculates the public key matching the given WIF private key.
    pub fn calculate_public_key(
        &self,
        wif_private_key: &str,
    ) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_calculate_public_key(wif_private_key)
            .map_err(WaxError::from)
    }

    /// Recovers the WIF-format public key that produced `signature` for the
    /// given transaction `sig_digest`.
    pub fn get_public_key_from_signature(
        &self,
        sig_digest: &SigDigest,
        signature: &Signature,
    ) -> Result<PublicKey, WaxError> {
        rust_protocol()
            .cpp_get_public_key_from_signature(sig_digest, signature)
            .map_err(WaxError::from)
    }

    /// Generates a random brain key with its derived keys.
    pub fn suggest_brain_key(&self) -> Result<BrainKeyData, WaxError> {
        rust_protocol()
            .cpp_suggest_brain_key()
            .map(|d| BrainKeyData {
                brain_key: d.brain_key,
                wif_private_key: d.wif_private_key,
                associated_public_key: d.associated_public_key,
            })
            .map_err(WaxError::from)
    }

    /// Derives the private key for an account role from a master password.
    pub fn get_private_key_from_password(
        &self,
        account: &str,
        role: &str,
        password: &str,
    ) -> Result<PrivateKeyData, WaxError> {
        rust_protocol()
            .cpp_get_private_key_from_password(account, role, password)
            .map(|d| PrivateKeyData {
                wif_private_key: d.wif_private_key,
                associated_public_key: d.associated_public_key,
            })
            .map_err(WaxError::from)
    }

    /// Generates a fresh, random WIF private key.
    pub fn generate_private_key(&self) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_generate_private_key()
            .map_err(WaxError::from)
    }

    /// Converts a raw hex-encoded private key into its WIF form.
    pub fn convert_raw_private_key_to_wif(
        &self,
        raw_private_key: &Hex,
    ) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_convert_raw_private_key_to_wif(raw_private_key)
            .map_err(WaxError::from)
    }

    /// Converts a raw hex-encoded public key into its WIF form.
    pub fn convert_raw_public_key_to_wif(
        &self,
        raw_public_key: &Hex,
    ) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_convert_raw_public_key_to_wif(raw_public_key)
            .map_err(WaxError::from)
    }

    /// Converts a WIF-form public key into its raw hex form — the inverse of
    /// [`Self::convert_raw_public_key_to_wif`].
    pub fn convert_wif_public_key_to_raw(
        &self,
        wif_public_key: &PublicKey,
    ) -> Result<Hex, WaxError> {
        rust_protocol()
            .cpp_convert_wif_public_key_to_raw(wif_public_key)
            .map_err(WaxError::from)
    }

    /// Converts a wire-form (hex) transaction into its API JSON string.
    pub fn deserialize_transaction(
        &self,
        hex: &str,
    ) -> Result<String, WaxError> {
        let protocol = rust_protocol();
        let handle = protocol
            .cpp_deserialize_transaction(hex)
            .map_err(WaxError::from)?;
        protocol.cpp_tx_to_json(&handle).map_err(WaxError::from)
    }

    /// Convert a transaction from Hive API-form JSON into its HF26 binary
    /// (hex) form. Mirrors TS `convertTransactionToBinaryForm`.
    ///
    /// Pass `strip_to_unsigned = true` to drop the signatures container before
    /// serialization — useful when computing an external transaction hash.
    pub fn convert_transaction_to_binary_form(
        &self,
        transaction: &serde_json::Value,
        strip_to_unsigned: bool,
    ) -> Result<Hex, WaxError> {
        let json = serde_json::to_string(transaction)
            .map_err(|e| WaxError::new(e.to_string()))?;
        let tx = self.create_transaction_from_json(&json)?;
        tx.to_binary_form(strip_to_unsigned)
    }

    /// Convert a transaction from HF26 binary (hex) form back into a Hive
    /// API-form JSON object. Mirrors TS `convertTransactionFromBinaryForm`.
    ///
    /// Unlike [`Self::deserialize_transaction`] (which returns the raw JSON
    /// string), this returns a parsed [`serde_json::Value`] for structured
    /// access by callers.
    pub fn convert_transaction_from_binary_form(
        &self,
        hex: &str,
    ) -> Result<serde_json::Value, WaxError> {
        let raw = self.deserialize_transaction(hex)?;
        serde_json::from_str(&raw).map_err(|e| WaxError::new(e.to_string()))
    }

    /// Converts a legacy-form JSON transaction into HF26/API JSON.
    pub fn legacy_transaction_to_json(
        &self,
        legacy_json: &str,
    ) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_legacy_tx_to_json(legacy_json)
            .map_err(WaxError::from)
    }

    /// Build a transaction from a legacy-form JSON transaction. Mirrors TS
    /// `createTransactionFromLegacyJson` and Python's
    /// `create_transaction_from_legacy_json`: rewrites the legacy payload to
    /// HF26/API JSON via [`Self::legacy_transaction_to_json`] and then parses
    /// it with [`Self::create_transaction_from_json`].
    pub fn create_transaction_from_legacy_json(
        &self,
        legacy_json: &str,
    ) -> Result<Transaction, WaxError> {
        let api_json = self.legacy_transaction_to_json(legacy_json)?;
        self.create_transaction_from_json(&api_json)
    }

    /// Returns the TaPoS reference-block data derived from a block id.
    pub fn get_tapos_data(
        &self,
        block_id: &str,
    ) -> Result<RefBlockData, WaxError> {
        rust_protocol()
            .cpp_get_tapos_data(block_id)
            .map(|d| RefBlockData {
                ref_block_num: d.ref_block_num,
                ref_block_prefix: d.ref_block_prefix,
            })
            .map_err(WaxError::from)
    }

    /// Creates a transaction from a [`proto::Transaction`].
    pub fn create_transaction_from_proto(
        &self,
        transaction: proto::Transaction,
    ) -> Result<Transaction, WaxError> {
        Ok(Transaction::from_rust(RustTransaction::from_proto(
            rust_protocol(),
            self.options.chain_id.clone(),
            transaction,
        )))
    }

    /// Creates a transaction from Hive API-shape JSON.
    pub fn create_transaction_from_json(
        &self,
        json: &str,
    ) -> Result<Transaction, WaxError> {
        validate_api_transaction_shape(json)?;

        let proto_json = rust_protocol()
            .cpp_tx_api_to_proto_json(json)
            .map_err(WaxError::from)?;
        let tx = RustTransaction::from_json(
            rust_protocol(),
            self.options.chain_id.clone(),
            &proto_json,
        )
        .map_err(WaxError::new)?;
        Ok(Transaction::from_rust(tx))
    }

    /// Build a transaction from proto-shape JSON — operations keyed by their
    /// oneof name (e.g. `{"vote_operation": { ... }}`) — as opposed to the Hive
    /// API shape (`{"type": ..., "value": ...}`) consumed by
    /// [`Self::create_transaction_from_json`].
    pub fn create_transaction_from_proto_json(
        &self,
        json: &str,
    ) -> Result<Transaction, WaxError> {
        let tx = RustTransaction::from_json(
            rust_protocol(),
            self.options.chain_id.clone(),
            json,
        )
        .map_err(WaxError::new)?;
        Ok(Transaction::from_rust(tx))
    }

    /// Creates a transaction bound to the given TaPoS block id and expiration.
    ///
    /// `expiration` accepts an absolute Hive timestamp or a `+N[s|m|h]`
    /// offset from the current wall clock; `None` defaults to `+1m` —
    /// matching TS `createTransactionWithTaPoS(taposBlockId, expirationTime?)`.
    pub fn create_transaction_with_tapos<'a>(
        &self,
        tapos_block_id: &str,
        expiration: impl Into<Option<&'a str>>,
    ) -> Result<Transaction, WaxError> {
        let spec = expiration.into().unwrap_or("+1m");
        let resolved = resolve_expiration(spec, None)?;

        let tapos = rust_protocol()
            .cpp_get_tapos_data(tapos_block_id)
            .map_err(WaxError::from)?;

        Ok(Transaction::from_rust(RustTransaction::new(
            rust_protocol(),
            self.options.chain_id.clone(),
            tapos.ref_block_num as u32,
            tapos.ref_block_prefix,
            &resolved,
            Vec::new(),
        )))
    }

    /// Build a transaction from chain reference data: a tapos block id, plus
    /// optional head-block time and expiration spec. Mirrors TS
    /// `createTransactionWithChainReferenceData`.
    ///
    /// `expiration` accepts either an absolute Hive timestamp
    /// (`"2026-05-15T12:00:00"`) or a `+N[s|m|h]` relative offset (unitless
    /// suffix is treated as seconds). When `None`, defaults to `"+1m"` —
    /// matching the TS default.
    ///
    /// `head_block_time` is only used as the reference for relative offsets on
    /// **non-default** chains (testnet/mirrornet). On mainnet it is ignored in
    /// favor of the local clock, so transaction expiration doesn't depend on
    /// API-node time accuracy.
    pub fn create_transaction_with_chain_reference_data(
        &self,
        tapos_block_id: &str,
        head_block_time: Option<HiveDateTime>,
        expiration: Option<&str>,
    ) -> Result<Transaction, WaxError> {
        build_transaction_with_chain_reference_data(
            &self.options.chain_id,
            tapos_block_id,
            head_block_time,
            expiration,
        )
        .map(Transaction::from_rust)
    }

    /// Build an [`Operation`] from a [`proto::Operation`]. Hides the underlying
    /// `crate::core::RustOperation` so callers stay on the public surface.
    pub fn create_operation_from_proto(
        &self,
        operation: proto::Operation,
    ) -> Operation {
        Operation::from_rust(RustOperation::from_proto(
            rust_protocol(),
            operation,
        ))
    }

    /// Build an [`Operation`] from an [`proto::operation::Value`] variant —
    /// shorthand for wrapping the value in a `proto::Operation` and calling
    /// [`Self::create_operation_from_proto`].
    pub fn create_operation(
        &self,
        value: proto::operation::Value,
    ) -> Operation {
        Operation::from_rust(RustOperation::new(rust_protocol(), value))
    }

    /// Build an [`Operation`] from proto-shape JSON (e.g.
    /// `{"vote_operation": { ... }}`). The JSON counterpart of
    /// [`Self::create_operation_from_proto`].
    pub fn create_operation_from_json(
        &self,
        json: &str,
    ) -> Result<Operation, WaxError> {
        let op = RustOperation::from_json(rust_protocol(), json)
            .map_err(WaxError::new)?;

        Ok(Operation::from_rust(op))
    }

    /// Build the chain-default `comment_options` payload for `author` /
    /// `permlink` — the options a `comment_options_operation` carries when the
    /// caller overrides nothing (1_000_000_000 HBD max payout, 10_000 bps
    /// `percent_hbd`, votes and curation rewards allowed, no extensions). The
    /// comment complex operation uses this to decide whether an explicit
    /// options op is even needed.
    pub fn default_comment_options(
        &self,
        author: &str,
        permlink: &str,
    ) -> Result<proto::CommentOptions, WaxError> {
        Ok(proto::CommentOptions {
            author: author.to_string(),
            permlink: permlink.to_string(),
            max_accepted_payout: self
                .hbd_satoshis(DEFAULT_COMMENT_MAX_ACCEPTED_PAYOUT_SATOSHIS)?,
            percent_hbd: DEFAULT_COMMENT_PERCENT_HBD,
            allow_votes: true,
            allow_curation_rewards: true,
            extensions: Vec::new(),
        })
    }

    /// Accounts whose state would be affected by `operation`. Mirrors TS
    /// `operationGetImpactedAccounts` and Python's equivalent on the base API.
    /// The order of the returned list matches the C++ producer; callers that
    /// need deduplication should collect into a set themselves.
    pub fn operation_get_impacted_accounts(
        &self,
        operation: &proto::Operation,
    ) -> Result<Vec<AccountName>, WaxError> {
        self.create_operation_from_proto(operation.clone())
            .impacted_accounts()
    }

    /// Binary view of `operation`: the wire-form hex plus a parsed AST
    /// annotating each byte range with its field name and type. Mirrors TS
    /// `operationBinaryViewMetadata` (TS defaults `use_hf26_serialization` to
    /// `true`; Rust requires the flag explicitly).
    pub fn operation_binary_view_metadata(
        &self,
        operation: &proto::Operation,
        use_hf26_serialization: bool,
    ) -> Result<BinaryViewOutputData, WaxError> {
        let op = RustOperation::from_proto(rust_protocol(), operation.clone());
        rust_protocol()
            .cpp_op_binary(&op.handle, use_hf26_serialization)
            .map(to_binary_view_output)
            .map_err(WaxError::from)
    }

    /// Serialize witness-update props into the `name → hex(packed bytes)` map
    /// that `witness_set_properties_operation.props` expects on the wire.
    ///
    /// Mirrors the TS `serializeWitnessProps` and Python `serialize_witness_props`
    /// base-API helpers. Optional fields on `props` that are `None` are simply
    /// omitted from the output, matching the C++ behaviour.
    pub fn serialize_witness_props(
        &self,
        props: &WitnessSetPropertiesProps,
    ) -> Result<HashMap<String, String>, WaxError> {
        let entries = rust_protocol()
            .cpp_serialize_witness_set_properties(&to_ffi_witness_props(props))
            .map_err(WaxError::from)?;
        Ok(entries.into_iter().map(|e| (e.key, e.value)).collect())
    }

    /// Deserialize the `name → hex(packed bytes)` witness-props map produced
    /// by [`Self::serialize_witness_props`] back into structured
    /// [`WitnessSetPropertiesProps`] — the inverse of that call.
    ///
    /// Mirrors the TS `deserializeWitnessProps` and Python
    /// `deserialize_witness_set_properties` base-API helpers. Entries absent
    /// from the map come back as `None`; `key` is required and its absence is
    /// surfaced as an error by the C++ side.
    pub fn deserialize_witness_props(
        &self,
        serialized_props: &HashMap<String, String>,
    ) -> Result<WitnessSetPropertiesProps, WaxError> {
        let entries: Vec<RustWitnessPropEntry> = serialized_props
            .iter()
            .map(|(key, value)| RustWitnessPropEntry {
                key: key.clone(),
                value: value.clone(),
            })
            .collect();

        let data = rust_protocol()
            .cpp_deserialize_witness_set_properties(&entries)
            .map_err(WaxError::from)?;

        Ok(from_ffi_witness_props(data))
    }

    /// Scan `content` for any private keys that match `account`'s authorities,
    /// memo key, or any of `other_keys`. Mirrors TS
    /// `scanTextForMatchingPrivateKeys` and Python
    /// `scan_text_for_matching_private_keys`.
    ///
    /// Returns `Ok(())` when no leak is detected. Returns `Err(WaxError::Cxx)`
    /// carrying the C++ leak diagnostic (account / authority role / public
    /// key) when a private key is found — useful for surfacing the role that
    /// was exposed.
    pub fn scan_text_for_matching_private_keys(
        &self,
        content: &str,
        account: &str,
        account_authorities: &Authorities,
        memo_key: &PublicKey,
        other_keys: &[PublicKey],
    ) -> Result<(), WaxError> {
        let auths = to_rust_authorities(account_authorities.clone());
        let others = other_keys.to_vec();
        rust_protocol()
            .cpp_check_memo_for_private_keys(
                content, account, &auths, memo_key, &others,
            )
            .map_err(WaxError::from)
    }

    /// Encode a [`CryptoMemo`] into a `crypto-memo` string — the second step of
    /// memo encryption, after a wallet has produced the inner `content`. The
    /// returned string is the full `#`-prefixed memo payload.
    pub fn crypto_memo_dump_string(
        &self,
        memo: &CryptoMemo,
    ) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_crypto_memo_dump_string(&RustCryptoMemo {
                from: memo.from.clone(),
                to: memo.to.clone(),
                content: memo.content.clone(),
            })
            .map_err(WaxError::from)
    }

    /// Decode a `crypto-memo` string into a [`CryptoMemo`] — the first step of
    /// memo decryption, before handing `content` (with the embedded `from`/`to`
    /// keys) to a wallet for decryption.
    pub fn crypto_memo_from_string(
        &self,
        value: &str,
    ) -> Result<CryptoMemo, WaxError> {
        let memo = rust_protocol()
            .cpp_crypto_memo_from_string(value)
            .map_err(WaxError::from)?;

        Ok(CryptoMemo {
            from: memo.from,
            to: memo.to,
            content: memo.content,
        })
    }
}

pub(crate) fn to_nai_asset(asset: RustJsonAsset) -> NaiAsset {
    NaiAsset {
        amount: asset.amount,
        precision: asset.precision,
        nai: asset.nai,
    }
}

pub(crate) fn to_ffi_asset(asset: &NaiAsset) -> RustJsonAsset {
    RustJsonAsset {
        amount: asset.amount.clone(),
        precision: asset.precision,
        nai: asset.nai.clone(),
    }
}

pub(crate) fn to_ffi_price(price: &JsonPrice) -> RustJsonPrice {
    RustJsonPrice {
        base: to_ffi_asset(&price.base),
        quote: to_ffi_asset(&price.quote),
    }
}

/// Map idiomatic `Option`-bearing Rust props into the cxx-bridge's flat
/// `RustWitnessSetPropertiesData` (which can't express `Option`, so it uses
/// paired `has_X` discriminants — see `RustMinimizeRequiredSignaturesData`
/// for the same trick).
fn to_ffi_witness_props(
    props: &WitnessSetPropertiesProps,
) -> RustWitnessSetPropertiesData {
    // cxx-bridge shared structs aren't `Clone`, so the inert placeholders for
    // unset optional fields are built fresh each time. The C++ side ignores
    // them when the corresponding `has_*` flag is false.
    fn zero_asset() -> RustJsonAsset {
        RustJsonAsset {
            amount: "0".to_string(),
            precision: HIVE_PRECISION,
            nai: String::new(),
        }
    }

    RustWitnessSetPropertiesData {
        key: props.key.clone(),

        new_signing_key: props.new_signing_key.clone().unwrap_or_default(),
        has_new_signing_key: props.new_signing_key.is_some(),

        account_creation_fee: props
            .account_creation_fee
            .as_ref()
            .map(to_ffi_asset)
            .unwrap_or_else(zero_asset),
        has_account_creation_fee: props.account_creation_fee.is_some(),

        url: props.url.clone().unwrap_or_default(),
        has_url: props.url.is_some(),

        hbd_exchange_rate: props
            .hbd_exchange_rate
            .as_ref()
            .map(to_ffi_price)
            .unwrap_or_else(|| RustJsonPrice {
                base: zero_asset(),
                quote: zero_asset(),
            }),
        has_hbd_exchange_rate: props.hbd_exchange_rate.is_some(),

        maximum_block_size: props.maximum_block_size.unwrap_or(0),
        has_maximum_block_size: props.maximum_block_size.is_some(),

        hbd_interest_rate: props.hbd_interest_rate.unwrap_or(0),
        has_hbd_interest_rate: props.hbd_interest_rate.is_some(),

        account_subsidy_budget: props.account_subsidy_budget.unwrap_or(0),
        has_account_subsidy_budget: props.account_subsidy_budget.is_some(),

        account_subsidy_decay: props.account_subsidy_decay.unwrap_or(0),
        has_account_subsidy_decay: props.account_subsidy_decay.is_some(),
    }
}

/// Map the cxx-bridge's flat `RustWitnessSetPropertiesData` back into the
/// idiomatic `Option`-bearing `WitnessSetPropertiesProps`. The inverse of
/// [`to_ffi_witness_props`]: a `false` `has_*` discriminant becomes `None`,
/// and the paired value member (left value-initialized by C++) is ignored.
fn from_ffi_witness_props(
    data: RustWitnessSetPropertiesData,
) -> WitnessSetPropertiesProps {
    WitnessSetPropertiesProps {
        key: data.key,
        new_signing_key: data
            .has_new_signing_key
            .then_some(data.new_signing_key),
        account_creation_fee: data
            .has_account_creation_fee
            .then(|| to_nai_asset(data.account_creation_fee)),
        url: data.has_url.then_some(data.url),
        hbd_exchange_rate: data.has_hbd_exchange_rate.then(|| JsonPrice {
            base: to_nai_asset(data.hbd_exchange_rate.base),
            quote: to_nai_asset(data.hbd_exchange_rate.quote),
        }),
        maximum_block_size: data
            .has_maximum_block_size
            .then_some(data.maximum_block_size),
        hbd_interest_rate: data
            .has_hbd_interest_rate
            .then_some(data.hbd_interest_rate),
        account_subsidy_budget: data
            .has_account_subsidy_budget
            .then_some(data.account_subsidy_budget),
        account_subsidy_decay: data
            .has_account_subsidy_decay
            .then_some(data.account_subsidy_decay),
    }
}

fn head_block_time_to_now(dt: HiveDateTime) -> i32 {
    dt.inner().timestamp() as i32
}

/// Builds a [`RustTransaction`] anchored to the given chain reference data
/// (TaPoS block id, head block time, expiration spec). Shared by
/// [`WaxFoundation::create_transaction_with_chain_reference_data`] and the
/// online `create_transaction` factory, which needs the concrete type.
pub(crate) fn build_transaction_with_chain_reference_data(
    chain_id: &str,
    tapos_block_id: &str,
    head_block_time: Option<HiveDateTime>,
    expiration: Option<&str>,
) -> Result<RustTransaction, WaxError> {
    let expiration_spec = expiration.unwrap_or("+1m");
    // TS deliberately ignores caller-supplied head_block_time on the
    // default chain so mainnet expiration is anchored to the local clock —
    // see createTransactionWithChainReferenceData / Transaction ctor.
    let reference = if chain_id == DEFAULT_CHAIN_ID {
        None
    } else {
        head_block_time
    };
    let resolved = resolve_expiration(expiration_spec, reference)?;

    let tapos = rust_protocol()
        .cpp_get_tapos_data(tapos_block_id)
        .map_err(WaxError::from)?;

    Ok(RustTransaction::new(
        rust_protocol(),
        chain_id,
        tapos.ref_block_num as u32,
        tapos.ref_block_prefix,
        &resolved,
        Vec::new(),
    ))
}

/// Resolve an expiration spec to a concrete Hive-formatted timestamp.
///
/// Absolute specs (anything not starting with `+`) round-trip unchanged — the
/// C++ side validates the format when the transaction is committed. Relative
/// specs are `+N[s|m|h]`, where an absent suffix is treated as seconds. The
/// offset is added to `reference` if supplied, otherwise to the current wall
/// clock. Mirrors TS `calculateExpiration`.
fn resolve_expiration(
    expiration: &str,
    reference: Option<HiveDateTime>,
) -> Result<String, WaxError> {
    if !expiration.starts_with('+') {
        return Ok(expiration.to_string());
    }

    let body = &expiration[1..];
    let digits_end = body
        .find(|c: char| !c.is_ascii_digit())
        .unwrap_or(body.len());
    if digits_end == 0 {
        return Err(WaxError::new(format!(
            "Invalid expiration time offset: '{expiration}'"
        )));
    }
    let (num_str, suffix) = body.split_at(digits_end);
    let num: i64 = num_str.parse().map_err(|_| {
        WaxError::new(format!("Invalid expiration time offset: '{expiration}'"))
    })?;

    let seconds = match suffix {
        "" | "s" => num,
        "m" => num.checked_mul(60).ok_or_else(|| {
            WaxError::new(format!("Expiration overflow: '{expiration}'"))
        })?,
        "h" => num.checked_mul(3_600).ok_or_else(|| {
            WaxError::new(format!("Expiration overflow: '{expiration}'"))
        })?,
        other => {
            return Err(WaxError::new(format!(
                "Invalid expiration time suffix: '{other}' in '{expiration}'"
            )));
        }
    };

    let reference = reference.unwrap_or_else(HiveDateTime::now);
    let delta = chrono::Duration::try_seconds(seconds).ok_or_else(|| {
        WaxError::new(format!("Expiration overflow: '{expiration}'"))
    })?;
    Ok(HiveDateTime::new(reference.inner() + delta).serialize())
}

/// Validates the operation envelopes of API-shape transaction JSON before it
/// reaches the C++ conversion visitor.
///
/// NOTE: the visitor runs against the prebuilt native bundle, which cannot
/// surface Rust-side panics as errors — a malformed envelope (e.g. a bare
/// legacy-style `{"vote": {...}}` operation) would abort the process
/// mid-callback. TS guarantees a thrown error for exactly these inputs (its
/// parser rejects operations without the `{type, value}` envelope), so this
/// guard restores that contract at the boundary.
fn validate_api_transaction_shape(json: &str) -> Result<(), WaxError> {
    let parsed: serde_json::Value = serde_json::from_str(json)
        .map_err(|e| WaxError::new(format!("Invalid transaction JSON: {e}")))?;

    let operations = parsed
        .get("operations")
        .and_then(serde_json::Value::as_array)
        .ok_or_else(|| {
            WaxError::new(
                "Invalid transaction JSON: `operations` must be an array",
            )
        })?;

    for (index, op) in operations.iter().enumerate() {
        let valid = op.get("type").is_some_and(serde_json::Value::is_string)
            && op.get("value").is_some_and(serde_json::Value::is_object);
        if !valid {
            return Err(WaxError::new(format!(
                "Invalid operation #{index}: expected an object with a \
                 string `type` and an object `value`"
            )));
        }
    }

    Ok(())
}

fn amount_to_satoshis(
    amount: AssetAmount,
    precision: u32,
) -> Result<i64, WaxError> {
    let decimal = match amount {
        AssetAmount::Int(v) => Decimal::from(v),
        AssetAmount::Decimal(v) => v,
        // NOTE: via the shortest round-trip string, exactly like the JS
        // `String(number)` coercion TS feeds into its parser. Neither
        // rust_decimal f64 constructor matches: `from_f64_retain` keeps the
        // excess binary bits (100.3 → 100.2999…, one satoshi short) and
        // `from_f64` clamps to 15 significant digits (too few near
        // Number.MAX_SAFE_INTEGER).
        AssetAmount::Float(v) => Decimal::from_str(&v.to_string())
            .map_err(|_| WaxError::DecimalConversionNotANumber)?,
    };

    let scaled = decimal * Decimal::from(10_i64.pow(precision));
    scaled
        .trunc()
        .to_i64()
        .ok_or_else(|| WaxError::InvalidAssetAmount {
            amount: scaled.to_string(),
        })
}
