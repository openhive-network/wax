#include "rust_protocol.hpp"
#include "wax_core/src/lib.rs.h"

#include "core/val_protocol.hpp"
#include "core/proto_converter.hpp"
#include "core/utils.hpp"

namespace cpp {
	namespace {
		template <typename T>
		::rust::Vec<::rust::String> to_rust_string_vec(const std::vector<T>& v) {
			::rust::Vec<::rust::String> result;
			result.reserve(v.size());
			for (const auto& item : v) {
				result.emplace_back(item);
			}
			return result;
		}

		RustWaxAuthority to_rust_wax_authority(const wax_authority& a) {
			::rust::Vec<RustAuthEntry> account_auths;
			account_auths.reserve(a.account_auths.size());
			for (const auto& [name, weight] : a.account_auths) {
				account_auths.push_back(RustAuthEntry{ ::rust::String(name), static_cast<uint32_t>(weight) });
			}

			::rust::Vec<RustAuthEntry> key_auths;
			key_auths.reserve(a.key_auths.size());
			for (const auto& [name, weight] : a.key_auths) {
				key_auths.push_back(RustAuthEntry{ ::rust::String(name), static_cast<uint32_t>(weight) });
			}

			return RustWaxAuthority{
				a.weight_threshold,
				std::move(account_auths),
				std::move(key_auths),
			};
		}
	}

	std::unique_ptr<rust_protocol>
	new_rust_protocol() {
		return std::make_unique<rust_protocol>();
	}

	std::unique_ptr<hive_operation_handle>
	rust_protocol::cpp_create_operation_handle(
		::rust::Box<RustManagedObject> obj
	) const {
		return safe_exception_wrapper([&]() -> std::unique_ptr<hive_operation_handle> {
			auto handle = std::make_unique<hive_operation_handle>();

			hive::protocol::operation op;
			cpp::from_jsval(rust_managed_object{ std::move(obj) }, op, true);
			handle->op.reset(new hive_op(std::move(op)));

			return handle;
		});
	}

	std::unique_ptr<hive_transaction_handle>
	rust_protocol::cpp_create_transaction_handle(
		::rust::Box<RustManagedObject> obj
	) const {
		return safe_exception_wrapper([&]() -> std::unique_ptr<hive_transaction_handle> {
			auto handle = std::make_unique<hive_transaction_handle>();

			fc::reflector<hive::protocol::signed_transaction>::visit(
				cpp::val_protocol_visitor<rust_managed_object, hive::protocol::signed_transaction>{
					rust_managed_object{ std::move(obj) },
					handle->get(),
					true,
				});

			return handle;
		});
	}

	void rust_protocol::cpp_tx_add_operation(
		hive_transaction_handle& tx,
		const hive_operation_handle& op
	) const {
		foundation::cpp_tx_add_operation(tx, op);
	}

	void rust_protocol::cpp_tx_add_signature(
		hive_transaction_handle& tx,
		::rust::Str signature
	) const {
		foundation::cpp_tx_add_signature(tx, std::string(signature));
	}

	void rust_protocol::cpp_tx_validate(const hive_transaction_handle& tx) const {
		foundation::cpp_tx_validate(tx);
	}

	::rust::String rust_protocol::cpp_tx_sig_digest(
		const hive_transaction_handle& tx,
		::rust::Str chain_id
	) const {
		return foundation::cpp_tx_sig_digest(tx, std::string(chain_id), true);
	}

	::rust::String rust_protocol::cpp_tx_id(const hive_transaction_handle& tx) const {
		return foundation::cpp_tx_id(tx, true);
	}

	::rust::String rust_protocol::cpp_tx_to_binary(
		const hive_transaction_handle& tx,
		bool strip_to_unsigned_transaction
	) const {
		return foundation::cpp_tx_to_binary(tx, true, strip_to_unsigned_transaction);
	}

	::rust::Vec<::rust::String> rust_protocol::cpp_tx_signature_keys(
		const hive_transaction_handle& tx,
		::rust::Str chain_id
	) const {
		return to_rust_string_vec(foundation::cpp_tx_signature_keys(tx, std::string(chain_id), true));
	}

	::rust::String rust_protocol::cpp_tx_to_json(const hive_transaction_handle& tx) const {
		return foundation::cpp_tx_to_json(tx);
	}

	::rust::Vec<::rust::String> rust_protocol::cpp_tx_impacted_accounts(
		const hive_transaction_handle& tx
	) const {
		return to_rust_string_vec(foundation::cpp_tx_impacted_accounts(tx));
	}

	RustRequiredAuthorities rust_protocol::cpp_tx_required_authorities(
		const hive_transaction_handle& tx
	) const {
		auto required = foundation::cpp_tx_required_authorities(tx);

		::rust::Vec<RustWaxAuthority> other_authorities;
		other_authorities.reserve(required.other_authorities.size());
		for (const auto& authority : required.other_authorities) {
			other_authorities.push_back(to_rust_wax_authority(authority));
		}

		return RustRequiredAuthorities{
			to_rust_string_vec(required.posting_accounts),
			to_rust_string_vec(required.active_accounts),
			to_rust_string_vec(required.owner_accounts),
			std::move(other_authorities),
		};
	}
}
