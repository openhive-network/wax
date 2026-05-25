#pragma once

#include "rust/cxx.h"

namespace cpp {
    class rust_protocol;
    class hive_transaction_handle;
    class hive_operation_handle;

    struct RustRequiredAuthorities;
    struct RustAuthorityProvider;
    struct RustJsonAsset;
    struct RustJsonPrice;
    struct RustRefBlockData;
    struct RustMinimizeRequiredSignaturesData;
    struct RustAuthVerificationTrace;
    struct RustBrainKeyData;
    struct RustPrivateKeyData;
    struct RustBinaryData;
    struct RustBinaryDataNode;
    struct RustConfigEntry;
}

#include "rust_managed_object.hpp"
#include "core/foundation.hpp"

#include <memory>

namespace cpp {
	class rust_protocol : public foundation {
	public:
		rust_protocol() = default;

		std::unique_ptr<hive_operation_handle>
		cpp_create_operation_handle(::rust::Box<RustManagedObject> obj) const;

		std::unique_ptr<hive_transaction_handle>
		cpp_create_transaction_handle(::rust::Box<RustManagedObject> obj) const;

		void cpp_tx_add_operation(
			hive_transaction_handle& tx,
			const hive_operation_handle& op
		) const;

		void cpp_tx_add_signature(
			hive_transaction_handle& tx,
			::rust::Str signature
		) const;

		void cpp_tx_validate(const hive_transaction_handle& tx) const;

		void cpp_op_validate(const hive_operation_handle& op) const;

		::rust::Vec<::rust::String> cpp_op_impacted_accounts(const hive_operation_handle& op) const;

		RustBinaryData cpp_op_binary(
			const hive_operation_handle& op,
			bool use_hf26_serialization
		) const;

		::rust::String cpp_tx_sig_digest(
			const hive_transaction_handle& tx,
			::rust::Str chain_id
		) const;

		::rust::String cpp_tx_legacy_sig_digest(
			const hive_transaction_handle& tx,
			::rust::Str chain_id
		) const;

		::rust::String cpp_tx_id(const hive_transaction_handle& tx) const;

		::rust::String cpp_tx_legacy_id(const hive_transaction_handle& tx) const;

		::rust::String cpp_tx_to_binary(
			const hive_transaction_handle& tx,
			bool strip_to_unsigned_transaction
		) const;

		RustBinaryData cpp_tx_binary_view(
			const hive_transaction_handle& tx,
			bool use_hf26_serialization,
			bool strip_to_unsigned_transaction
		) const;

		::rust::Vec<::rust::String> cpp_tx_signature_keys(
			const hive_transaction_handle& tx,
			::rust::Str chain_id
		) const;

		::rust::Vec<::rust::String> cpp_tx_legacy_signature_keys(
			const hive_transaction_handle& tx,
			::rust::Str chain_id
		) const;

		::rust::String cpp_tx_to_json(const hive_transaction_handle& tx) const;

		::rust::String cpp_tx_to_legacy_json(const hive_transaction_handle& tx) const;

		::rust::Vec<::rust::String> cpp_tx_impacted_accounts(const hive_transaction_handle& tx) const;

		RustRequiredAuthorities cpp_tx_required_authorities(const hive_transaction_handle& tx) const;

		::rust::Vec<::rust::String> cpp_tx_collect_signing_keys(
			const hive_transaction_handle& tx,
			const RustAuthorityProvider& provider
		) const;

		RustJsonAsset cpp_hive(int64_t amount) const;
		RustJsonAsset cpp_hbd(int64_t amount) const;
		RustJsonAsset cpp_vests(int64_t amount) const;

		RustJsonAsset cpp_hbd_to_hive(const RustJsonAsset& hbd, const RustJsonAsset& base, const RustJsonAsset& quote) const;
		RustJsonAsset cpp_hive_to_hbd(const RustJsonAsset& amount, const RustJsonAsset& base, const RustJsonAsset& quote) const;
		RustJsonAsset cpp_vests_to_hp(const RustJsonAsset& vests, const RustJsonAsset& total_vesting_fund_hive, const RustJsonAsset& total_vesting_shares) const;
		RustJsonAsset cpp_hp_to_vests(const RustJsonAsset& hive, const RustJsonAsset& total_vesting_fund_hive, const RustJsonAsset& total_vesting_shares) const;

		RustJsonAsset cpp_estimate_hive_collateral(
			const RustJsonPrice& current_median_history,
			const RustJsonPrice& current_min_history,
			const RustJsonAsset& hbd_amount_to_get
		) const;

		RustJsonAsset cpp_estimate_hbd_interest(
			uint64_t hbd_seconds_low,
			uint64_t hbd_seconds_high,
			uint32_t head_block_time,
			const RustJsonAsset& hbd,
			uint32_t hbd_seconds_last_update,
			uint16_t hbd_interest_rate
		) const;

		::rust::String cpp_calculate_hp_apr(
			uint32_t head_block_num,
			uint16_t vesting_reward_percent,
			const RustJsonAsset& virtual_supply,
			const RustJsonAsset& total_vesting_fund_hive
		) const;

		::rust::String cpp_asset_value(const RustJsonAsset& asset) const;
		::rust::String cpp_asset_symbol(const RustJsonAsset& asset) const;

		int64_t cpp_calculate_current_manabar_value(
			int32_t now,
			int64_t max_mana,
			int64_t current_mana,
			uint32_t last_update_time
		) const;

		uint64_t cpp_calculate_manabar_full_regeneration_time(
			int32_t now,
			int64_t max_mana,
			int64_t current_mana,
			uint32_t last_update_time
		) const;

		bool cpp_is_valid_account_name(::rust::Str name) const;

		::rust::String cpp_calculate_public_key(::rust::Str wif) const;

		::rust::String cpp_get_public_key_from_signature(
			::rust::Str digest,
			::rust::Str signature
		) const;

		RustBrainKeyData cpp_suggest_brain_key() const;

		RustPrivateKeyData cpp_get_private_key_from_password(
			::rust::Str account,
			::rust::Str role,
			::rust::Str password
		) const;

		::rust::String cpp_convert_raw_private_key_to_wif(::rust::Str hex_data) const;

		::rust::String cpp_convert_raw_public_key_to_wif(::rust::Str hex_data) const;

		std::unique_ptr<hive_transaction_handle>
		cpp_deserialize_transaction(::rust::Str hex) const;

		::rust::String cpp_legacy_tx_to_json(::rust::Str tx_str) const;

		::rust::String cpp_tx_api_to_proto_json(::rust::Str api_json) const;

		void cpp_tx_set_expiration(
			hive_transaction_handle& tx,
			::rust::Str expiration
		) const;

		RustRefBlockData cpp_get_tapos_data(::rust::Str block_id) const;

		::rust::Vec<::rust::String> cpp_minimize_required_signatures(
			const hive_transaction_handle& tx,
			const RustMinimizeRequiredSignaturesData& data,
			const RustAuthorityProvider& provider
		) const;

		RustAuthVerificationTrace cpp_trace_authority_verification(
			const RustRequiredAuthorities& required_authorities,
			const ::rust::Vec<::rust::String>& decoded_signature_public_keys,
			const RustAuthorityProvider& provider
		) const;

		::rust::Vec<RustConfigEntry> cpp_get_hive_protocol_config(::rust::Str chain_id) const;
	};

	std::unique_ptr<rust_protocol> new_rust_protocol();
}
