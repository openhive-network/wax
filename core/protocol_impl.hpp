#pragma once

#include "core/types.hpp"

#include <vector>
#include <string>
#include <map>

namespace cpp {

/** Common implementation of protocol interface, next exposed to other languages
    It provides Hive protocol functionality operating on Hive native JSON format.
*/
template <class FoundationProvider>
class protocol_impl : public FoundationProvider
{
public:
  using required_authority_collection_t = typename FoundationProvider::required_authority_collection_t;

  std::vector<std::string> cpp_operation_get_impacted_accounts(const std::string& operation) const;
  std::vector<std::string> cpp_transaction_get_impacted_accounts(const std::string& transaction) const;

  result cpp_validate_operation(const std::string& operation);
  result cpp_validate_transaction(const std::string& transaction);
  
  ///  Allows to calculate hf26 compliant transaction-id (serialized using hf26 form)
  result cpp_calculate_transaction_id(const std::string& transaction);
  /**  Allows to calculate legacy transaction-id (serialized using pre-hf26 form)
  *    This method is provided only to make possible verification of old Hive transaction ids (read from blocks produced before hf26).
  */
  result cpp_calculate_legacy_transaction_id(const std::string& transaction);

  ///  Allows to calculate hf26 compliant sig-digest (serialized using hf26 form)
  result cpp_calculate_sig_digest(const std::string& transaction, const std::string& chain_id);

  ///  Allows to calculate legacy sig-digest (serialized using pre-hf26 form)
  result cpp_calculate_legacy_sig_digest(const std::string& transaction, const std::string& chain_id);

  /** Allows to perform binary serialization of specified transaction.
  *   Uses HF26 serialization form.
  */
  result cpp_serialize_transaction(const std::string& transaction);

  /** Allows to restore a transaction object from HF26 binary serialization form.
  *   Returns a JSON form of deserialized transaction.
  */
  result cpp_deserialize_transaction(const std::string& transaction);

  /** Allows to collect all authorities required to process given transaction (needed to correctly sign it)
  *   Can throw on error.
  */
  required_authority_collection_t cpp_collect_transaction_required_authorities(const std::string& transaction);

  /** Allows to collect signing keys from given transaction
  *   Can throw on error.
  */
  std::vector<std::string> cpp_collect_signing_keys(const std::string& transaction, retrieve_authorities_cb_t retrieve_authorities_cb,
    void* retrieve_authorities_fn);

  void cpp_check_memo_for_private_keys(const std::string& memo, const std::string& account, const wax_authorities& auths, const std::string& memo_key,
    const std::vector<std::string>& imported_keys);

  /** Minimize required signatures collection depend on given available keys and authorities.
  */
  std::vector<std::string> cpp_minimize_required_signatures(const std::string& signed_transaction, const minimize_required_signatures_data_t& minimize_required_signatures_data);

  /** Returns map of hive::protocol constants in form:
  *   constant_name => constant_value as string.
  */
  std::map<std::string, std::string> cpp_get_hive_protocol_config(const std::string& treasury_name, const std::string& chain_id);

};

} /// namespace cpp
