#pragma once

#include "core/types.hpp"

#include <vector>
#include <string>

namespace cpp {

/** Common implementation of protobuf_protocol interface, next exposed to other languages 
*   It provides Hive protocol functionality operating on Protobuf specific JSON format.
*/
template <class FoundationProvider>
class proto_protocol_impl : public FoundationProvider
{
public:
  using required_authority_collection_t = typename FoundationProvider::required_authority_collection_t;

  std::vector<std::string> cpp_operation_get_impacted_accounts(const std::string& operation) const;
  std::vector<std::string> cpp_transaction_get_impacted_accounts(const std::string& transaction) const;

  result cpp_validate_operation(const std::string& operation);
  result cpp_validate_transaction(const std::string& transaction);
  result cpp_calculate_transaction_id(const std::string& transaction);
  result cpp_calculate_legacy_transaction_id(const std::string& transaction);
  result cpp_calculate_sig_digest(const std::string& transaction, const std::string& chain_id);
  result cpp_calculate_legacy_sig_digest(const std::string& transaction, const std::string& chain_id);
  result cpp_serialize_transaction(const std::string& transaction);
  result cpp_deserialize_transaction(const std::string& transaction);
  required_authority_collection_t cpp_collect_transaction_required_authorities(const std::string& transaction);

  // TODO: Implement block bi-directional protobuf JSON conversion
  result cpp_proto_to_api(const std::string& operation_or_tx);
  result cpp_proto_to_legacy_api(const std::string& transaction);
  result cpp_api_to_proto(const std::string& operation_or_tx_or_block);
};

} /// namespace cpp
