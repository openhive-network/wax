#pragma once

#include "rust/cxx.h"

namespace cpp {
    class rust_protocol;
    class hive_transaction_handle;
    class hive_operation_handle;

    struct RustRequiredAuthorities;
    struct RustAuthorityProvider;
    struct RustJsonAsset;
    struct RustRefBlockData;
    struct RustMinimizeRequiredSignaturesData;
    struct RustAuthVerificationTrace;
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

		::rust::String cpp_tx_sig_digest(
			const hive_transaction_handle& tx,
			::rust::Str chain_id
		) const;

		::rust::String cpp_tx_id(const hive_transaction_handle& tx) const;

		::rust::String cpp_tx_to_binary(
			const hive_transaction_handle& tx,
			bool strip_to_unsigned_transaction
		) const;

		::rust::Vec<::rust::String> cpp_tx_signature_keys(
			const hive_transaction_handle& tx,
			::rust::Str chain_id
		) const;

		::rust::String cpp_tx_to_json(const hive_transaction_handle& tx) const;

		::rust::Vec<::rust::String> cpp_tx_impacted_accounts(const hive_transaction_handle& tx) const;

		RustRequiredAuthorities cpp_tx_required_authorities(const hive_transaction_handle& tx) const;

		::rust::Vec<::rust::String> cpp_tx_collect_signing_keys(
			const hive_transaction_handle& tx,
			const RustAuthorityProvider& provider
		) const;

		RustJsonAsset cpp_hive(int64_t amount) const;
		RustJsonAsset cpp_hbd(int64_t amount) const;
		RustJsonAsset cpp_vests(int64_t amount) const;

		bool cpp_is_valid_account_name(::rust::Str name) const;

		std::unique_ptr<hive_transaction_handle>
		cpp_deserialize_transaction(::rust::Str hex) const;

		::rust::String cpp_legacy_tx_to_json(::rust::Str tx_str) const;

		void cpp_tx_set_expiration(
			hive_transaction_handle& tx,
			::rust::Str expiration
		) const;

		RustRefBlockData cpp_get_tapos_data(::rust::Str block_id);

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
	};

	std::unique_ptr<rust_protocol> new_rust_protocol();
}
