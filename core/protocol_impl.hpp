#pragma once

#include "core/types.hpp"

#include <set>
#include <string>

namespace cpp {

/** Common implementation of protocol interface, next exposed to other languages
    It provides Hive protocol functionality operating on Hive native JSON format.
*/
template <class FoundationProvider>
class protocol_impl : public FoundationProvider
{
public:
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
  required_authority_collection cpp_collect_transaction_required_authorities(const std::string& transaction);
};

} /// namespace cpp

