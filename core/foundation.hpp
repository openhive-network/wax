#pragma once

#include "core/types.hpp"
#include <map>
#include <memory>
#include <string>

#include <hive/protocol/authority_trace_data.hpp>

#include "operations_fwd.hpp"

namespace hive { namespace protocol {
  class signed_transaction;
} } // namespace hive::protocol

namespace cpp {

/** Helper interface instance to allow integration of TS/JS/Python environment and override (implement) a virtual methods
*   to provide data to underlying C++ algoruthms.
*/
class IAccountAuthorityProvider
{
public:
  /** Allows to query for given account authority and specific role (owner, active, posting).
  */
  virtual std::optional<wax_authority> getAuthority(std::string account_name, std::string authorityRole) = 0;
  /// Allows to query for given witness signing key.
  virtual std::optional<std::string> getWitnessPublicKey(std::string witness_name) = 0;

  virtual ~IAccountAuthorityProvider() = default;
};

using hive_tx = hive::protocol::signed_transaction;
using hive_op = hive::protocol::operation;

struct wax_tx_ptr_deleter
{
  void operator()(hive_tx* t) const;
};
struct wax_op_ptr_deleter
{
  void operator()(hive_op* t) const;
};

class hive_transaction_handle
{
public:
  hive_transaction_handle();
  ~hive_transaction_handle();
  hive_transaction_handle(hive_transaction_handle&&);
  hive_transaction_handle& operator=(hive_transaction_handle&&) = default;
  hive_transaction_handle& operator=(const hive_transaction_handle&) = delete;
  hive_transaction_handle(const hive_transaction_handle&) = delete;

  hive_tx& get() const { return *tx; }

  std::unique_ptr<hive_tx, wax_tx_ptr_deleter> tx;

  static unsigned int instance_count;
  static unsigned int max_instance_count;
};

class hive_operation_handle
{
public:
  std::unique_ptr<hive_op, wax_op_ptr_deleter> op;
};

///  Common base providing functionality independent on JSON format being used for parameter transport
class foundation
{
public:
  using required_authority_collection_t = required_authority_collection;

  std::string cpp_calculate_public_key(const std::string& wif);
  std::string cpp_generate_private_key();
  private_key_data cpp_generate_private_key(const std::string& account, const std::string& role, const std::string& password);
  /** Allows to convert 32 bytes data buffer expressed as hex string (pointing private key secret) into private key encoded as WIF format.
  */
  std::string cpp_convert_raw_private_key_to_wif(const std::string& hexData);

  /** Allows to convert raw public key form (expressed as hex string) into Hive WIF format (with prefix).
  *   \param hexData - depending on length compressed or uncompressed key format is chosen
  */
  std::string cpp_convert_raw_public_key_to_wif(const std::string& hexData);

  brain_key_data cpp_suggest_brain_key();

  /** Returns map of hive::protocol constants in form:
  *   constant_name => constant_value as string.
  */
  std::map<std::string, std::string> cpp_get_hive_protocol_config(const std::string& chain_id);

  ///  Allows to retrieve public key in WIF format from the signature and digest in hexadecimal format
  std::string cpp_get_public_key_from_signature(const std::string& digest, const std::string& signature);

  json_asset cpp_general_asset(const uint32_t asset_num, const int64_t amount)const;
  json_asset cpp_hive(const int64_t amount)const;
  json_asset cpp_hbd(const int64_t amount)const;
  json_asset cpp_vests(const int64_t amount)const;

  witness_set_properties_serialized cpp_serialize_witness_set_properties(const witness_set_properties_data& value) const;
  witness_set_properties_data cpp_deserialize_witness_set_properties(const witness_set_properties_serialized& value) const;

  std::string cpp_asset_value(const json_asset& value) const;
  std::string cpp_asset_symbol(const json_asset& value) const;

  void cpp_throws(int type) const;
  transaction_handle_stats cpp_report_transaction_handle_stats() const;

  /* Allows to decode a `crypto-memo` string into structure providing such data directly (needed to start actual decryption process).
  *  To be used as 1st step of decryption process.
  * @returns A structure holding data decoded from input string, providing all required informations for further decryption.
  */
  crypto_memo cpp_crypto_memo_from_string(const std::string& value) const;

  /** Encodes `crypto_memo` structure into `crypto-memo` encoded string.
  *   To be used as 2nd step of encryption process.
  *
  *   @returns Encoded string holding all required informations for further decryption.
  */
  std::string cpp_crypto_memo_dump_string(const crypto_memo& value) const;

  void cpp_check_memo_for_private_keys(const std::string& memo, const std::string& account, const wax_authorities& auths, const std::string& memo_key,
    const std::vector<std::string>& imported_keys) const;

  uint64_t cpp_calculate_manabar_full_regeneration_time(int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time);
  int64_t cpp_calculate_current_manabar_value(int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time);

  ref_block_data cpp_get_tapos_data(const std::string& block_id);

  /**
   * Calculate current HP APR.
   *
   * @param head_block_num - from dgpo
   * @param vesting_reward_percent - from dgpo
   * @param virtual_supply - from dgpo
   * @param total_vesting_fund_hive - from dgpo
   *
   * @returns HP APR percent with 2 decimals as string
   *          We have to pass the result as string to avoid issues with floating point precision.
   *          Also, returning double could result in overflow for large values (int64_t)
   */
  std::string cpp_calculate_hp_apr(const uint32_t head_block_num, const uint16_t vesting_reward_percent, const json_asset& virtual_supply, const json_asset& total_vesting_fund_hive) const;

  /**
   * Convert HBD to HIVE.
   *
   * @param hbd   - HBD asset
   * @param base  - base value from get_current_price_feed (HBD asset)
   * @param quote - quote value from get_current_price_feed (HIVE asset)
   *
   * @returns value in HIVE asset
   */
  json_asset cpp_hbd_to_hive(const json_asset &hbd, const json_asset& base, const json_asset& quote) const;

  /**
   * Convert HIVE to HBD.
   *
   * @param amount - amount of HIVE asset to be converted to HBD
   * @param base   - base value from get_current_price_feed (HBD asset)
   * @param quote  - quote value from get_current_price_feed (HIVE asset)
   *
   * @returns value in HBD asset
   */
  json_asset cpp_hive_to_hbd(const json_asset& amount, const json_asset& base, const json_asset& quote) const;

  /**
   * Convert VESTS to HP (HIVE).
   *
   * @param vests - VESTS asset (also voting power or RC expressed as VESTS asset)
   * @param total_vesting_fund_hive - from dgpo HIVE asset
   * @param total_vesting_shares - from dgpo VESTS asset
   *
   * @returns value in HIVE asset (HP)
   */
  json_asset cpp_vests_to_hp(const json_asset& vests, const json_asset& total_vesting_fund_hive, const json_asset& total_vesting_shares) const;

  /**
   * Convert HP (HIVE) to VESTS.
   *
   * @param vests - HIVE asset (HP)
   * @param total_vesting_fund_hive - from dgpo HIVE asset
   * @param total_vesting_shares - from dgpo VESTS asset
   *
   * @returns value in VESTS asset
   */
  json_asset cpp_hp_to_vests(const json_asset& hive, const json_asset& total_vesting_fund_hive, const json_asset& total_vesting_shares) const;

  /**
   * Calculate current inflation rate.
   *
   * @param block_num - block number for which will be calculated inflation rate
   *
   * @returns curent inflation rate.
   */
  int64_t cpp_calculate_inflation_rate_for_block(const uint32_t block_num) const;

  /**
   * Estimate hive collateral
   *
   * @param current_median_history Current median price retrieved by `get_feed_history`
   * @param current_min_history Current minimal price retrieved by `get_feed_history`
   * @param hbd_amount_to_get HBD asset used to get HIVE asset
   *
   * @returns value in HIVE asset
   */
  json_asset cpp_estimate_hive_collateral( const json_price& current_median_history, const json_price& current_min_history, const json_asset& hbd_amount_to_get ) const;

  /**
   * Check if given account name is valid, which means it follows given rules:
   * - Names must comply with RFC 1035 grammar
   * - All letters must be lowercase
   * - Length is between (inclusive) HIVE_MIN_ACCOUNT_NAME_LENGTH and HIVE_MAX_ACCOUNT_NAME_LENGTH
   *
   * @param name - account name to be checked
   * @returns true if account name is valid, false otherwise
   */
  bool cpp_is_valid_account_name( const std::string& name ) const;

  /** Allows to perform traced verify_authority call, and collect data gathered during analysis, returned through authority_verification_trace object.
  */
  hive::protocol::authority_verification_trace cpp_trace_authority_verification(
    const required_authority_collection_t& required_authorities,
    const std::vector<std::string>& decodedSignaturePublicKeys,
    IAccountAuthorityProvider& authorityProvider) const;

  std::string cpp_get_default_comment_options_operation() const;

  void cpp_deserialize_hive_tx(const std::string& hex, hive_tx* storage)const;
  cpp::hive_operation_handle cpp_deserialize_operation(std::string hex)const;

  std::vector<std::string>        cpp_op_impacted_accounts(const hive_operation_handle& op_handle)const;
  std::string                     cpp_op_to_binary(const hive_operation_handle& op_handle, bool use_hf26_serialization)const;
  binary_data                     cpp_op_binary(const hive_operation_handle& op_handle, bool use_hf26_serialization)const;
  void                            cpp_op_validate(const hive_operation_handle& op_handle)const;
  required_authority_collection_t cpp_op_required_authorities(const hive_operation_handle& op_handle)const;

  void                            cpp_tx_add_operation(hive_transaction_handle& tx_handle, const hive_operation_handle& op_handle)const;
  void                            cpp_tx_add_signature(hive_transaction_handle& tx_handle, const std::string& signature)const;
  void                            cpp_tx_set_expiration(hive_transaction_handle& tx_handle, const std::string& expiration)const;
  std::string                     cpp_tx_to_legacy_json(const hive_transaction_handle& tx_handle)const;
  std::string                     cpp_tx_to_binary(const hive_transaction_handle& tx_handle, bool use_hf26_serialization, bool strip_to_unsigned_transaction)const;
  std::string                     cpp_tx_to_json(const hive_transaction_handle& tx_handle)const;
  std::string                     cpp_tx_id(const hive_transaction_handle& tx_handle, bool use_hf26_serialization)const;
  binary_data                     cpp_tx_binary(const hive_transaction_handle& tx_handle, bool use_hf26_serialization, bool strip_to_unsigned_transaction)const;
  required_authority_collection_t cpp_tx_required_authorities(const hive_transaction_handle& tx_handle)const;
  std::vector<std::string>        cpp_tx_impacted_accounts(const hive_transaction_handle& tx_handle)const;
  std::vector<std::string>        cpp_tx_signature_keys(const hive_transaction_handle& tx_handle, const std::string& chain_id, bool use_hf26_serialization)const;
  std::string                     cpp_tx_sig_digest(const hive_transaction_handle& tx_handle, const std::string& chain_id, bool use_hf26_serialization)const;
  std::vector<std::string>        cpp_collect_signing_keys(const hive_transaction_handle& tx_handle, retrieve_authorities_cb_t retrieve_authorities_cb, void* retrieve_authorities_fn) const;
  std::vector<std::string>        cpp_minimize_required_signatures(const hive_transaction_handle& tx_handle, const minimize_required_signatures_data_t& minimize_required_signatures_data) const;

  void                            cpp_tx_validate(const hive_transaction_handle& tx_handle)const;

// protected: // XXX: Temporary remove this, as it may not be supported by emscripten
  /// use this only through derived classes
  foundation() = default;
  ~foundation() = default;
};

} /// namespace cpp

namespace fc { namespace raw {
  template<typename Stream>
  inline void pack( Stream& s, const cpp::json_asset& u );
  template<typename Stream>
  inline void unpack( Stream& s, cpp::json_asset& u, uint32_t d, bool limit_is_disabled );
  template<typename Stream>
  inline void pack( Stream& s, const cpp::json_price& u );
  template<typename Stream>
  inline void unpack( Stream& s, cpp::json_price& u, uint32_t d, bool limit_is_disabled );
} }
