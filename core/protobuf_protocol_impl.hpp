#pragma once

#include "core/types.hpp"

#include <vector>
#include <string>

namespace cpp {

class wax_beneficiary_route_type {
  public:
    std::string account;
    unsigned int weight = 0;
};

class IProtoTransactionTransformer {
public:
  virtual void start_transaction(unsigned int ref_block_num, unsigned int ref_block_prefix, const std::string& expirationTime) = 0;
  virtual void add_vote_operation(const std::string& voter, const std::string& author, const std::string& permlink, int weight) = 0;
  virtual void add_comment_operation(const std::string& author, const std::string& permlink,
    const std::string& parent_author, const std::string& parent_permlink,
    const std::string& title, const std::string& json_metadata, const std::string& body) = 0;
  /** Allows to push comment_options_operation with optional beneficiaries extension (if extension was present in original operation, passed vector will be not empty)
  */
  virtual void add_comment_options_operation(const std::string& author, const std::string& permlink,
      const json_asset& max_accepted_payout, unsigned int percent_hbd, bool allow_votes, bool allow_curation_rewards,
      const std::vector<wax_beneficiary_route_type>& beneficiariesExtension) = 0;
  virtual void add_custom_json_operation(const std::vector<std::string>& required_auths, const std::vector<std::string>& required_posting_auths, const std::string& id, const std::string& json) = 0;
  
  virtual void add_transfer_operation(const std::string& from, const std::string& to, const json_asset& amount, const std::string& memo) = 0;

  virtual void add_signature(const std::string& hexString) = 0;

  virtual ~IProtoTransactionTransformer() = default;  
};

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

  binary_data cpp_generate_binary_transaction_metadata(const std::string& transaction, bool use_hf26_serialization, bool strip_to_unsigned_transaction)const;
  binary_data cpp_generate_binary_operation_metadata(const std::string& operation, bool use_hf26_serialization)const;

  result cpp_validate_operation(const std::string& operation);
  result cpp_validate_transaction(const std::string& transaction);
  result cpp_calculate_transaction_id(const std::string& transaction);
  result cpp_calculate_legacy_transaction_id(const std::string& transaction);
  result cpp_calculate_sig_digest(const std::string& transaction, const std::string& chain_id);
  result cpp_calculate_legacy_sig_digest(const std::string& transaction, const std::string& chain_id);
  result cpp_serialize_transaction(const std::string& transaction, bool strip_to_unsigned_transaction);
  result cpp_deserialize_transaction(const std::string& transaction);
  required_authority_collection_t cpp_collect_transaction_required_authorities(const std::string& transaction);

  // TODO: Implement block bi-directional protobuf JSON conversion
  result cpp_proto_to_api(const std::string& operation_or_tx);

  void cpp_transform_api_transaction(IProtoTransactionTransformer& transformer, const std::string& api_transaction) const;

  result cpp_proto_to_legacy_api(const std::string& transaction);
  result cpp_api_to_proto(const std::string& operation_or_tx_or_block);
};

} /// namespace cpp
