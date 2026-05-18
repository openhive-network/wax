#include "rust_protocol.hpp"
#include "wax_core/src/lib.rs.h"

#include "core/val_protocol.hpp"
#include "core/proto_converter.hpp"
#include "core/utils.hpp"

#include <hive/protocol/authority_trace_data.hpp>

#include <optional>
#include <string>
#include <vector>

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

		wax_authority from_rust_wax_authority(const RustWaxAuthority& a) {
			wax_authority out;
			out.weight_threshold = a.weight_threshold;
			for (const auto& e : a.account_auths) {
				out.account_auths.emplace(std::string(e.name), static_cast<uint16_t>(e.weight));
			}
			for (const auto& e : a.key_auths) {
				out.key_auths.emplace(std::string(e.name), static_cast<uint16_t>(e.weight));
			}
			return out;
		}

		wax_authorities_map_t rust_retrieve_authorities_trampoline(
			std::vector<std::string> accounts,
			void* ctx
		) {
			const auto* provider = static_cast<const RustAuthorityProvider*>(ctx);

			::rust::Vec<::rust::String> rust_accounts;
			rust_accounts.reserve(accounts.size());
			for (const auto& a : accounts) {
				rust_accounts.emplace_back(a);
			}

			auto results = rap_get_authorities(*provider, std::move(rust_accounts));

			wax_authorities_map_t out;
			for (const auto& entry : results) {
				wax_authorities wa;
				wa.owner   = from_rust_wax_authority(entry.authorities.owner);
				wa.active  = from_rust_wax_authority(entry.authorities.active);
				wa.posting = from_rust_wax_authority(entry.authorities.posting);
				out.emplace(std::string(entry.account), std::move(wa));
			}
			return out;
		}

		std::string rust_get_witness_public_key_trampoline(std::string account, void* ctx) {
			const auto* provider = static_cast<const RustAuthorityProvider*>(ctx);
			::rust::String result = rap_get_witness_public_key(*provider, ::rust::String(account));
			return std::string(result);
		}

		RustJsonAsset to_rust_json_asset(const json_asset& a) {
			return RustJsonAsset{
				::rust::String(a.amount),
				a.precision,
				::rust::String(a.nai),
			};
		}

		json_asset from_rust_json_asset(const RustJsonAsset& a) {
			return json_asset(std::string(a.amount), a.precision, std::string(a.nai));
		}

		required_authority_collection from_rust_required_authorities(const RustRequiredAuthorities& r) {
			required_authority_collection out;
			out.posting_accounts.reserve(r.posting_accounts.size());
			for (const auto& a : r.posting_accounts) out.posting_accounts.emplace_back(a);
			out.active_accounts.reserve(r.active_accounts.size());
			for (const auto& a : r.active_accounts) out.active_accounts.emplace_back(a);
			out.owner_accounts.reserve(r.owner_accounts.size());
			for (const auto& a : r.owner_accounts) out.owner_accounts.emplace_back(a);
			out.other_authorities.reserve(r.other_authorities.size());
			for (const auto& wa : r.other_authorities) out.other_authorities.emplace_back(from_rust_wax_authority(wa));
			return out;
		}

		class RustAccountAuthorityProviderAdapter final : public IAccountAuthorityProvider {
		public:
			explicit RustAccountAuthorityProviderAdapter(const RustAuthorityProvider& provider)
				: _provider(provider) {}

			std::optional<wax_authority> getAuthority(std::string account_name, std::string authorityRole) override {
				::rust::Vec<::rust::String> accounts;
				accounts.emplace_back(account_name);
				auto results = rap_get_authorities(_provider, std::move(accounts));
				for (const auto& entry : results) {
					if (std::string(entry.account) != account_name) continue;
					if (authorityRole == "active")  return from_rust_wax_authority(entry.authorities.active);
					if (authorityRole == "owner")   return from_rust_wax_authority(entry.authorities.owner);
					if (authorityRole == "posting") return from_rust_wax_authority(entry.authorities.posting);
				}
				return std::nullopt;
			}

			std::optional<std::string> getWitnessPublicKey(std::string witness_name) override {
				::rust::String result = rap_get_witness_public_key(_provider, ::rust::String(witness_name));
				std::string s(result);
				if (s.empty()) return std::nullopt;
				return s;
			}

		private:
			const RustAuthorityProvider& _provider;
		};

		uint32_t flatten_path_entry(
			const hive::protocol::authority_verification_trace::path_entry& src,
			::rust::Vec<RustAuthPathNode>& nodes
		) {
			::rust::Vec<uint32_t> visited;
			visited.reserve(src.visited_entries.size());
			for (const auto& child : src.visited_entries) {
				visited.push_back(flatten_path_entry(child, nodes));
			}

			uint32_t self_idx = static_cast<uint32_t>(nodes.size());
			nodes.push_back(RustAuthPathNode{
				::rust::String(src.processed_entry),
				::rust::String(src.processed_role),
				static_cast<uint32_t>(src.recursion_depth),
				static_cast<uint32_t>(src.threshold),
				static_cast<uint32_t>(src.weight),
				static_cast<uint32_t>(src.flags),
				std::move(visited),
			});
			return self_idx;
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

	::rust::Vec<::rust::String> rust_protocol::cpp_tx_collect_signing_keys(
		const hive_transaction_handle& tx,
		const RustAuthorityProvider& provider
	) const {
		return to_rust_string_vec(foundation::cpp_collect_signing_keys(
			tx,
			&rust_retrieve_authorities_trampoline,
			const_cast<RustAuthorityProvider*>(&provider)
		));
	}

	RustJsonAsset rust_protocol::cpp_hive(int64_t amount) const {
		return to_rust_json_asset(foundation::cpp_hive(amount));
	}

	RustJsonAsset rust_protocol::cpp_hbd(int64_t amount) const {
		return to_rust_json_asset(foundation::cpp_hbd(amount));
	}

	RustJsonAsset rust_protocol::cpp_vests(int64_t amount) const {
		return to_rust_json_asset(foundation::cpp_vests(amount));
	}

	RustJsonAsset rust_protocol::cpp_hbd_to_hive(
		const RustJsonAsset& hbd,
		const RustJsonAsset& base,
		const RustJsonAsset& quote
	) const {
		return to_rust_json_asset(foundation::cpp_hbd_to_hive(
			from_rust_json_asset(hbd),
			from_rust_json_asset(base),
			from_rust_json_asset(quote)
		));
	}

	RustJsonAsset rust_protocol::cpp_hive_to_hbd(
		const RustJsonAsset& amount,
		const RustJsonAsset& base,
		const RustJsonAsset& quote
	) const {
		return to_rust_json_asset(foundation::cpp_hive_to_hbd(
			from_rust_json_asset(amount),
			from_rust_json_asset(base),
			from_rust_json_asset(quote)
		));
	}

	RustJsonAsset rust_protocol::cpp_vests_to_hp(
		const RustJsonAsset& vests,
		const RustJsonAsset& total_vesting_fund_hive,
		const RustJsonAsset& total_vesting_shares
	) const {
		return to_rust_json_asset(foundation::cpp_vests_to_hp(
			from_rust_json_asset(vests),
			from_rust_json_asset(total_vesting_fund_hive),
			from_rust_json_asset(total_vesting_shares)
		));
	}

	RustJsonAsset rust_protocol::cpp_hp_to_vests(
		const RustJsonAsset& hive,
		const RustJsonAsset& total_vesting_fund_hive,
		const RustJsonAsset& total_vesting_shares
	) const {
		return to_rust_json_asset(foundation::cpp_hp_to_vests(
			from_rust_json_asset(hive),
			from_rust_json_asset(total_vesting_fund_hive),
			from_rust_json_asset(total_vesting_shares)
		));
	}

	RustJsonAsset rust_protocol::cpp_estimate_hive_collateral(
		const RustJsonPrice& current_median_history,
		const RustJsonPrice& current_min_history,
		const RustJsonAsset& hbd_amount_to_get
	) const {
		json_price median{
			from_rust_json_asset(current_median_history.base),
			from_rust_json_asset(current_median_history.quote),
		};
		json_price minimal{
			from_rust_json_asset(current_min_history.base),
			from_rust_json_asset(current_min_history.quote),
		};
		return to_rust_json_asset(foundation::cpp_estimate_hive_collateral(
			median,
			minimal,
			from_rust_json_asset(hbd_amount_to_get)
		));
	}

	RustJsonAsset rust_protocol::cpp_estimate_hbd_interest(
		uint64_t hbd_seconds_low,
		uint64_t hbd_seconds_high,
		uint32_t head_block_time,
		const RustJsonAsset& hbd,
		uint32_t hbd_seconds_last_update,
		uint16_t hbd_interest_rate
	) const {
		return to_rust_json_asset(foundation::cpp_evaluate_hbd_interest(
			hbd_seconds_low,
			hbd_seconds_high,
			head_block_time,
			from_rust_json_asset(hbd),
			hbd_seconds_last_update,
			hbd_interest_rate
		));
	}

	::rust::String rust_protocol::cpp_calculate_hp_apr(
		uint32_t head_block_num,
		uint16_t vesting_reward_percent,
		const RustJsonAsset& virtual_supply,
		const RustJsonAsset& total_vesting_fund_hive
	) const {
		return foundation::cpp_calculate_hp_apr(
			head_block_num,
			vesting_reward_percent,
			from_rust_json_asset(virtual_supply),
			from_rust_json_asset(total_vesting_fund_hive)
		);
	}

	::rust::String rust_protocol::cpp_asset_value(const RustJsonAsset& asset) const {
		return foundation::cpp_asset_value(from_rust_json_asset(asset));
	}

	::rust::String rust_protocol::cpp_asset_symbol(const RustJsonAsset& asset) const {
		return foundation::cpp_asset_symbol(from_rust_json_asset(asset));
	}

	int64_t rust_protocol::cpp_calculate_current_manabar_value(
		int32_t now,
		int64_t max_mana,
		int64_t current_mana,
		uint32_t last_update_time
	) const {
		// foundation::cpp_calculate_current_manabar_value isn't declared const
		// upstream even though it doesn't mutate `*this`.
		auto& self = const_cast<rust_protocol&>(*this);
		return self.foundation::cpp_calculate_current_manabar_value(now, max_mana, current_mana, last_update_time);
	}

	uint64_t rust_protocol::cpp_calculate_manabar_full_regeneration_time(
		int32_t now,
		int64_t max_mana,
		int64_t current_mana,
		uint32_t last_update_time
	) const {
		auto& self = const_cast<rust_protocol&>(*this);
		return self.foundation::cpp_calculate_manabar_full_regeneration_time(now, max_mana, current_mana, last_update_time);
	}

	bool rust_protocol::cpp_is_valid_account_name(::rust::Str name) const {
		return foundation::cpp_is_valid_account_name(std::string(name));
	}

	std::unique_ptr<hive_transaction_handle>
	rust_protocol::cpp_deserialize_transaction(::rust::Str hex) const {
		auto handle = std::make_unique<hive_transaction_handle>();
		foundation::cpp_deserialize_hive_tx(std::string(hex), &handle->get());
		return handle;
	}

	::rust::String rust_protocol::cpp_legacy_tx_to_json(::rust::Str tx_str) const {
		return foundation::cpp_legacy_tx_to_json(std::string(tx_str));
	}

	void rust_protocol::cpp_tx_set_expiration(
		hive_transaction_handle& tx,
		::rust::Str expiration
	) const {
		foundation::cpp_tx_set_expiration(tx, std::string(expiration));
	}

	RustRefBlockData rust_protocol::cpp_get_tapos_data(::rust::Str block_id) const {
		// foundation::cpp_get_tapos_data is not declared const upstream even
		// though the implementation does not mutate `*this`; cast it away so
		// the rust side can keep this method on the immutable code path.
		auto& self = const_cast<rust_protocol&>(*this);
		const auto data = self.foundation::cpp_get_tapos_data(std::string(block_id));
		return RustRefBlockData{ data.ref_block_num, data.ref_block_prefix };
	}

	::rust::Vec<::rust::String> rust_protocol::cpp_minimize_required_signatures(
		const hive_transaction_handle& tx,
		const RustMinimizeRequiredSignaturesData& data,
		const RustAuthorityProvider& provider
	) const {
		minimize_required_signatures_data_t cpp_data;
		cpp_data.chain_id = std::string(data.chain_id);

		cpp_data.available_keys.reserve(data.available_keys.size());
		for (const auto& k : data.available_keys) {
			cpp_data.available_keys.emplace_back(k);
		}

		for (const auto& entry : data.authorities) {
			wax_authorities wa;
			wa.active  = from_rust_wax_authority(entry.authorities.active);
			wa.owner   = from_rust_wax_authority(entry.authorities.owner);
			wa.posting = from_rust_wax_authority(entry.authorities.posting);
			cpp_data.authorities_map.emplace(std::string(entry.account), std::move(wa));
		}

		cpp_data.get_witness_key_cb = &rust_get_witness_public_key_trampoline;
		cpp_data.get_witness_key_fn = const_cast<RustAuthorityProvider*>(&provider);

		if (data.has_max_recursion)      cpp_data.max_recursion      = data.max_recursion;
		if (data.has_max_membership)     cpp_data.max_membership     = data.max_membership;
		if (data.has_max_account_auths)  cpp_data.max_account_auths  = data.max_account_auths;
		cpp_data.allow_strict_and_mixed_authorities = data.allow_strict_and_mixed_authorities;

		return to_rust_string_vec(foundation::cpp_minimize_required_signatures(tx, cpp_data));
	}

	RustAuthVerificationTrace rust_protocol::cpp_trace_authority_verification(
		const RustRequiredAuthorities& required_authorities,
		const ::rust::Vec<::rust::String>& decoded_signature_public_keys,
		const RustAuthorityProvider& provider
	) const {
		auto cpp_required = from_rust_required_authorities(required_authorities);

		std::vector<std::string> cpp_keys;
		cpp_keys.reserve(decoded_signature_public_keys.size());
		for (const auto& k : decoded_signature_public_keys) {
			cpp_keys.emplace_back(k);
		}

		RustAccountAuthorityProviderAdapter adapter(provider);

		const auto trace = foundation::cpp_trace_authority_verification(cpp_required, cpp_keys, adapter);

		::rust::Vec<RustAuthPathNode> nodes;

		::rust::Vec<uint32_t> root_indices;
		root_indices.reserve(trace.root.size());
		for (const auto& entry : trace.root) {
			root_indices.push_back(flatten_path_entry(entry, nodes));
		}

		::rust::Vec<uint32_t> final_path_indices;
		final_path_indices.reserve(trace.final_authority_path.size());
		for (const auto& entry : trace.final_authority_path) {
			final_path_indices.push_back(flatten_path_entry(entry, nodes));
		}

		return RustAuthVerificationTrace{
			std::move(nodes),
			std::move(root_indices),
			std::move(final_path_indices),
			static_cast<uint32_t>(trace.verification_status),
		};
	}
}
