/// Implementation file for protobuf_protocol_impl class template methods

#include "core/protobuf_protocol_impl.hpp"

#include <functional>
#include <map>

namespace cpp {

using TParseMethod = std::function<void(fc::mutable_variant_object&)>;
// Set of methods for selected operations
using TParseMethodMap = std::map<const std::string_view, TParseMethod>;

// PROTO TO API --------------------------------

fc::variants parse_proto_extensions(const fc::variant& ex)
{
  FC_ASSERT(ex.is_array(), "Extensions must be an array");

  fc::variants result;
  const fc::variants& extensions = ex.get_array();

  for (const auto& extension : extensions)
  {
    FC_ASSERT(extension.is_object(), "Each extension should be an object");
    const auto& obj = extension.get_object();
    FC_ASSERT(obj.size() != 0, "Each extension should be a nonempty object");
    const std::string& key = obj.begin()->key();
    FC_ASSERT(obj[key].is_object() || obj[key].is_array() || obj[key].is_string(), "Extension should contain the body");
    result.emplace_back(std::move(fc::mutable_variant_object{ "type", key }("value", obj[key])));
  }

  return result;
}

void try_parse_proto_extensions(fc::mutable_variant_object& body)
{
  if (body.find("extensions") != body.end())
    body("extensions", std::move(parse_proto_extensions(body["extensions"])));
}

// Convert map to table of pairs
fc::variant parse_proto_map(const fc::variant& _map)
{
  FC_ASSERT(_map.is_object(), "map should be an object");
  const fc::variant_object& obj = _map.get_object();
  fc::variants arr;

  for (const auto& elem : obj)
    {
    fc::variants subarray {elem.key(), elem.value()};
    arr.emplace_back(std::move(subarray));
    }

  fc::variant result { arr };

  return result;
}

fc::variant parse_proto_authority(const fc::variant& auth)
{
  FC_ASSERT(auth.is_object() && auth.get_object().size(), "authority cannot be empty");
  fc::mutable_variant_object auth_body = auth.get_object();

  if (auth_body.find("account_auths") != auth_body.end())
    auth_body["account_auths"] = std::move(parse_proto_map(auth_body["account_auths"]));
  
  if (auth_body.find("key_auths") != auth_body.end())
    auth_body["key_auths"] = std::move(parse_proto_map(auth_body["key_auths"]));
  
  return auth_body;
}

void try_parse_proto_authority(fc::mutable_variant_object& body, const char* auth_name)
{
  if (body.find(auth_name) != body.end())
    body[auth_name] = std::move(parse_proto_authority(body[auth_name]));
}

void parse_proto_authority3(fc::mutable_variant_object& body)
{
  FC_ASSERT(body.find("owner") != body.end(), "Operation should contain owner authority");
  body["owner"] = std::move(parse_proto_authority(body["owner"]));
  FC_ASSERT(body.find("active") != body.end(), "Operation should contain active authority");
  body["active"] = std::move(parse_proto_authority(body["active"]));
  FC_ASSERT(body.find("posting") != body.end(), "Operation should contain posting authority");
  body["posting"] = std::move(parse_proto_authority(body["posting"]));
}

void try_parse_proto_authority3(fc::mutable_variant_object& body)
{
  try_parse_proto_authority(body, "owner");
  try_parse_proto_authority(body, "active");
  try_parse_proto_authority(body, "posting");
}

void parse_proto_account_create_with_delegation(fc::mutable_variant_object& body)
{
  try_parse_proto_extensions(body);
  parse_proto_authority3(body);
}

#define parse_proto_create_claimed_account parse_proto_account_create_with_delegation

void parse_proto_account_update2(fc::mutable_variant_object& body)
{
  try_parse_proto_extensions(body);
  try_parse_proto_authority3(body);
}

void parse_proto_witness_set_properties(fc::mutable_variant_object& body)
{
  try_parse_proto_extensions(body);
  if (body.find("props") != body.end())
    body["props"] = std::move(parse_proto_map(body["props"]));
}

void parse_proto_request_account_recovery(fc::mutable_variant_object& body)
{
  try_parse_proto_extensions(body);
  FC_ASSERT(body.find("new_owner_authority") != body.end(), "Operation should contain new_owner_authority");
  body["new_owner_authority"] = std::move(parse_proto_authority(body["new_owner_authority"]));
}

void parse_proto_recover_account(fc::mutable_variant_object& body)
{
  try_parse_proto_extensions(body);
  FC_ASSERT(body.find("new_owner_authority") != body.end(), "Operation should contain new_owner_authority");
  body["new_owner_authority"] = std::move(parse_proto_authority(body["new_owner_authority"]));
  FC_ASSERT(body.find("recent_owner_authority") != body.end(), "Operation should contain recent_owner_authority");
  body["recent_owner_authority"] = std::move(parse_proto_authority(body["recent_owner_authority"]));
}

void parse_proto_reset_account(fc::mutable_variant_object& body)
{
  FC_ASSERT(body.find("new_owner_authority") != body.end(), "Operation should contain new_owner_authority");
  body["new_owner_authority"] = std::move(parse_proto_authority(body["new_owner_authority"]));
}

void parse_proto_pow2(fc::mutable_variant_object& body)
{
  FC_ASSERT(body.find("work") != body.end(), "pow2 operation should contain work");
  const fc::variant& work = body["work"];
  FC_ASSERT(work.is_object(), "pow2 work should be an object");
  const auto& obj = work.get_object();
  FC_ASSERT(obj.size() != 0, "pow2 work should be a nonempty object");
  const std::string& key = obj.begin()->key();
  FC_ASSERT(obj[key].is_object(), "pow2 work should contain the body");
  body["work"] = std::move(fc::mutable_variant_object{ "type", key }("value", obj[key].get_object()));
}

const TParseMethodMap parse_proto_methods =
{
  { "comment_options", try_parse_proto_extensions },
  { "claim_account", try_parse_proto_extensions },
  { "change_recovery_account", try_parse_proto_extensions },
  { "recurrent_transfer", try_parse_proto_extensions },
  { "create_proposal", try_parse_proto_extensions },
  { "update_proposal", try_parse_proto_extensions },
  { "update_proposal_votes", try_parse_proto_extensions },
  { "remove_proposal", try_parse_proto_extensions },
  { "account_create", parse_proto_authority3 },
  { "account_create_with_delegation", parse_proto_account_create_with_delegation },
  { "account_update", try_parse_proto_authority3 },
  { "account_update2", parse_proto_account_update2 },
  { "create_claimed_account", parse_proto_create_claimed_account },
  { "witness_set_properties", parse_proto_witness_set_properties },
  { "request_account_recovery", parse_proto_request_account_recovery },
  { "recover_account", parse_proto_recover_account },
  { "reset_account", parse_proto_reset_account },
  { "pow2", parse_proto_pow2 }
};

fc::mutable_variant_object parse_proto_operation(const fc::variant& op)
{
  FC_ASSERT(op.is_object() && op.get_object().size(), "Operation cannot be empty");

  const std::string& key = op.get_object().begin()->key();

  // TODO: Add map operation type key check here

  FC_ASSERT(op.get_object()[key].is_object(), "Operation should contain the body");

  fc::mutable_variant_object op_body = op.get_object()[key].get_object();

  const auto parse_method = parse_proto_methods.find(key);

  if (parse_method != parse_proto_methods.end())
    parse_method->second(op_body);

  return fc::mutable_variant_object{ "type", key + "_operation" }("value", std::move(op_body));
}

fc::mutable_variant_object parse_proto_transaction(const fc::variant& trx)
{
  FC_ASSERT(trx.is_object() && trx.get_object().contains("operations") && trx.get_object()["operations"].is_array(), "Transaction cannot be empty");

  // Proto operations are not the same as hive api operations - they look like this:
  // { vote: { author: "", ... } }
  // instead of our api like:
  // { type: "vote_operation", value: { author: "",... } }
  // So we have to extract the key here and convert to fc-reflect-readable format
  // Same applies to every static_variant in our implementation of hive protocol
  fc::variants operations;
  fc::mutable_variant_object tx_body = trx.get_object();

  for (const auto& op : tx_body["operations"].get_array())
    operations.emplace_back(std::move(parse_proto_operation(op)));

  try_parse_proto_extensions(tx_body);

  return fc::mutable_variant_object{ std::move(tx_body) }("operations", std::move(operations));
}

// API TO PROTO --------------------------------

fc::variants parse_api_extensions(const fc::variant& ex)
{
  FC_ASSERT(ex.is_array(), "Extensions must be an array");

  fc::variants result;
  const fc::variants& extensions = ex.get_array();

  for (const auto& extension : extensions)
  {
    FC_ASSERT(
      extension.is_object() &&
      extension.get_object().contains("type") &&
      extension.get_object()["type"].is_string() &&
      extension.get_object().contains("value") &&
      (extension.get_object()["value"].is_object() || extension.get_object()["value"].is_string()), "Not a valid api operation extension");

    std::string key = extension.get_object()["type"].get_string();
    result.emplace_back(std::move(fc::mutable_variant_object{ key, extension.get_object()["value"] }));
  }

  return result;
}

void try_parse_api_extensions(fc::mutable_variant_object& body)
{
  if (body.find("extensions") != body.end())
    body("extensions", std::move(parse_api_extensions(body["extensions"])));
}

// Convert table of pairs to map
fc::variant parse_api_pairs_table(const fc::variant& table)
{
  FC_ASSERT(table.is_array(), "table should be an array");
  const fc::variants& arr = table.get_array();
  fc::mutable_variant_object result;

  for (const auto& elem : arr)
    {
    const fc::variants& obj = elem.get_array();
    FC_ASSERT(obj.size() == 2, "Pair is expected");
    result(obj[0].get_string(), obj[1]);
    }

  return result;
}

fc::variant parse_api_authority(const fc::variant& auth)
{
  FC_ASSERT(auth.is_object() && auth.get_object().size(), "authority cannot be empty");
  fc::mutable_variant_object auth_body = auth.get_object();

  if (auth_body.find("account_auths") != auth_body.end())
    auth_body["account_auths"] = std::move(parse_api_pairs_table(auth_body["account_auths"]));
  
  if (auth_body.find("key_auths") != auth_body.end())
    auth_body["key_auths"] = std::move(parse_api_pairs_table(auth_body["key_auths"]));
  
  return auth_body;
}

void try_parse_api_authority(fc::mutable_variant_object& body, const char* auth_name)
{
  if (body.find(auth_name) != body.end())
    body[auth_name] = std::move(parse_api_authority(body[auth_name]));
}

void parse_api_authority3(fc::mutable_variant_object& body)
{
  FC_ASSERT(body.find("owner") != body.end(), "Operation should contain owner authority");
  body["owner"] = std::move(parse_api_authority(body["owner"]));
  FC_ASSERT(body.find("active") != body.end(), "Operation should contain active authority");
  body["active"] = std::move(parse_api_authority(body["active"]));
  FC_ASSERT(body.find("posting") != body.end(), "Operation should contain posting authority");
  body["posting"] = std::move(parse_api_authority(body["posting"]));
}

void try_parse_api_authority3(fc::mutable_variant_object& body)
{
  try_parse_api_authority(body, "owner");
  try_parse_api_authority(body, "active");
  try_parse_api_authority(body, "posting");
}

void parse_api_account_create_with_delegation(fc::mutable_variant_object& body)
{
  try_parse_api_extensions(body);
  parse_api_authority3(body);
}

#define parse_api_create_claimed_account parse_api_account_create_with_delegation

void parse_api_account_update2(fc::mutable_variant_object& body)
{
  try_parse_api_extensions(body);
  try_parse_api_authority3(body);
}

void parse_api_witness_set_properties(fc::mutable_variant_object& body)
{
  try_parse_api_extensions(body);
  if (body.find("props") != body.end())
    body["props"] = std::move(parse_api_pairs_table(body["props"]));
}

void parse_api_request_account_recovery(fc::mutable_variant_object& body)
{
  try_parse_api_extensions(body);
  FC_ASSERT(body.find("new_owner_authority") != body.end(), "Operation should contain new_owner_authority");
  body["new_owner_authority"] = std::move(parse_api_authority(body["new_owner_authority"]));
}

void parse_api_recover_account(fc::mutable_variant_object& body)
{
  try_parse_api_extensions(body);
  FC_ASSERT(body.find("new_owner_authority") != body.end(), "Operation should contain new_owner_authority");
  body["new_owner_authority"] = std::move(parse_api_authority(body["new_owner_authority"]));
  FC_ASSERT(body.find("recent_owner_authority") != body.end(), "Operation should contain recent_owner_authority");
  body["recent_owner_authority"] = std::move(parse_api_authority(body["recent_owner_authority"]));
}

void parse_api_reset_account(fc::mutable_variant_object& body)
{
  FC_ASSERT(body.find("new_owner_authority") != body.end(), "Operation should contain new_owner_authority");
  body["new_owner_authority"] = std::move(parse_api_authority(body["new_owner_authority"]));
}

void parse_api_pow2(fc::mutable_variant_object& body)
{
  FC_ASSERT(body.find("work") != body.end(), "pow2 operation should contain work");
  const fc::variant& work = body["work"];
  FC_ASSERT(
    work.is_object() &&
    work.get_object().contains("type") &&
    work.get_object()["type"].is_string() &&
    work.get_object().contains("value") &&
    work.get_object()["value"].is_object(), "Not a valid api pow2 operation work");

  const std::string& key = work.get_object()["type"].get_string();
  body["work"] = std::move(fc::mutable_variant_object{ key, work.get_object()["value"].get_object() });
}

const TParseMethodMap parse_api_methods =
{
  { "comment_options", try_parse_api_extensions },
  { "claim_account", try_parse_api_extensions },
  { "change_recovery_account", try_parse_api_extensions },
  { "recurrent_transfer", try_parse_api_extensions },
  { "create_proposal", try_parse_api_extensions },
  { "update_proposal", try_parse_api_extensions },
  { "update_proposal_votes", try_parse_api_extensions },
  { "remove_proposal", try_parse_api_extensions },
  { "account_create", parse_api_authority3 },
  { "account_create_with_delegation", parse_api_account_create_with_delegation },
  { "account_update", try_parse_api_authority3 },
  { "account_update2", parse_api_account_update2 },
  { "create_claimed_account", parse_api_create_claimed_account },
  { "witness_set_properties", parse_api_witness_set_properties },
  { "request_account_recovery", parse_api_request_account_recovery },
  { "recover_account", parse_api_recover_account },
  { "reset_account", parse_api_reset_account },
  { "pow2", parse_api_pow2 }
};

fc::mutable_variant_object parse_api_operation(const fc::variant& op)
{
  FC_ASSERT(
    op.is_object() &&
    op.get_object().contains("type") &&
    op.get_object()["type"].is_string() &&
    op.get_object().contains("value") &&
    op.get_object()["value"].is_object(), "Not a valid api operation");

  std::string key = op.get_object()["type"].get_string();
  key.resize(key.size() - 10 /*strlen("_operation")*/);

  fc::mutable_variant_object op_body = op.get_object()["value"].get_object();

  const auto parse_method = parse_api_methods.find(key);

  if (parse_method != parse_api_methods.end())
    parse_method->second(op_body);

  return fc::mutable_variant_object{ key, std::move(op_body) };
}

fc::mutable_variant_object parse_api_transaction(const fc::variant& trx)
{
  FC_ASSERT(trx.is_object() && trx.get_object().contains("operations") && trx.get_object()["operations"].is_array(), "Transaction cannot be empty");

  fc::variants operations;
  fc::mutable_variant_object tx_body = trx.get_object();

  for (const auto& op : tx_body["operations"].get_array())
    operations.emplace_back(std::move(parse_api_operation(op)));

  try_parse_api_extensions(tx_body);

  return fc::mutable_variant_object{ std::move(tx_body) }("operations", std::move(operations));
}

fc::mutable_variant_object parse_api_block(const fc::variant& block)
{
  FC_ASSERT(block.is_object() && block.get_object().contains("transactions") && block.get_object()["transactions"].is_array(), "Block should have an array of transactions");

  fc::variants transactions;
  fc::mutable_variant_object block_body = block.get_object();

  for (const auto& trx : block_body["transactions"].get_array())
    transactions.emplace_back(std::move(parse_api_transaction(trx)));

  try_parse_api_extensions(block_body);

  return fc::mutable_variant_object{ std::move(block_body) }("transactions", std::move(transactions));
}

std::string cpp_api_to_proto_impl(const std::string& operation_or_tx_or_block)
{
  fc::variant var = fc::json::from_string(operation_or_tx_or_block);
  FC_ASSERT(var.is_object(), "cpp_proto_to_api requires JSON object as an argument");

  if (var.get_object().contains("transactions"))
    return fc::json::to_string(parse_api_block(var));

  if (var.get_object().contains("operations"))
    return fc::json::to_string(parse_api_transaction(var));

  return fc::json::to_string(parse_api_operation(var));
}

std::string cpp_proto_to_api_impl(const std::string& operation_or_tx)
{
  fc::variant var = fc::json::from_string(operation_or_tx);
  FC_ASSERT(var.is_object(), "cpp_proto_to_api requires JSON object as an argument");

  if (var.get_object().contains("operations"))
    return fc::json::to_string(parse_proto_transaction(var));

  return fc::json::to_string(parse_proto_operation(var));
}

template <class FoundationProvider>
result proto_protocol_impl<FoundationProvider>::cpp_validate_operation(const std::string& operation)
{
  return method_wrapper([&](result& _result)
    {
      protocol_impl<FoundationProvider> provider;
      _result = provider.cpp_validate_operation(
        cpp_proto_to_api_impl(operation)
      );
    });
}

template <class FoundationProvider>
result proto_protocol_impl<FoundationProvider>::cpp_validate_transaction(const std::string& transaction)
{
  return method_wrapper([&](result& _result)
    {
      protocol_impl<FoundationProvider> provider;
      // XXX: We can optimize it by using the sharing the same logic via variant_objects
      _result = provider.cpp_validate_transaction(
        cpp_proto_to_api_impl(transaction)
      );
    });
}

template <class FoundationProvider>
result proto_protocol_impl<FoundationProvider>::cpp_calculate_transaction_id(const std::string& transaction)
{
  return method_wrapper([&](result& _result)
    {
      protocol_impl<FoundationProvider> provider;
      _result = provider.cpp_calculate_transaction_id(
        cpp_proto_to_api_impl(transaction)
      );
    });
}

template <class FoundationProvider>
result proto_protocol_impl<FoundationProvider>::cpp_calculate_legacy_transaction_id(const std::string& transaction)
{
  return method_wrapper([&](result& _result)
    {
      protocol_impl<FoundationProvider> provider;
      _result = provider.cpp_calculate_legacy_transaction_id(
        cpp_proto_to_api_impl(transaction)
      );
    });
}

template <class FoundationProvider>
result proto_protocol_impl<FoundationProvider>::cpp_calculate_sig_digest(const std::string& transaction, const std::string& chain_id)
{
  return method_wrapper([&](result& _result)
    {
      protocol_impl<FoundationProvider> provider;
      _result = provider.cpp_calculate_sig_digest(
        cpp_proto_to_api_impl(transaction),
        chain_id
      );
    });
}

template <class FoundationProvider>
result proto_protocol_impl<FoundationProvider>::cpp_calculate_legacy_sig_digest(const std::string& transaction, const std::string& chain_id)
  {
  return method_wrapper([&](result& _result)
    {
      protocol_impl<FoundationProvider> provider;
      _result = provider.cpp_calculate_legacy_sig_digest(
        cpp_proto_to_api_impl(transaction),
        chain_id
      );
    });
  }

template <class FoundationProvider>
result proto_protocol_impl<FoundationProvider>::cpp_serialize_transaction(const std::string& transaction)
{
  return method_wrapper([&](result& _result)
    {
      protocol_impl<FoundationProvider> provider;
      _result = provider.cpp_serialize_transaction(
        cpp_proto_to_api_impl(transaction)
      );
    });
}

template <class FoundationProvider>
result proto_protocol_impl<FoundationProvider>::cpp_deserialize_transaction(const std::string& transaction)
{
  return method_wrapper([&](result& _result)
    {
      protocol_impl<FoundationProvider> provider;
      _result = provider.cpp_deserialize_transaction(transaction);
      _result.content = cpp_api_to_proto_impl(_result.content);
    });
}

template <class FoundationProvider>
ref_block_data proto_protocol_impl<FoundationProvider>::cpp_get_tapos_data(const std::string& transaction_id)
{
  protocol_impl<FoundationProvider> provider;

  return provider.cpp_get_tapos_data(transaction_id);
}

template <class FoundationProvider>
result proto_protocol_impl<FoundationProvider>::cpp_proto_to_api(const std::string& operation_or_tx)
{
  return method_wrapper([&](result& _result)
    {
      _result.content = cpp_proto_to_api_impl(operation_or_tx);
    });
}

template <class FoundationProvider>
result proto_protocol_impl<FoundationProvider>::cpp_api_to_proto(const std::string& operation_or_tx_or_block)
{
  return method_wrapper([&](result& _result)
    {
      _result.content = cpp_api_to_proto_impl(operation_or_tx_or_block);
    });
}

} /// namespace cpp 
