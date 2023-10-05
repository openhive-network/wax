/// Implementation file for protobuf_protocol_impl class template methods

#include "core/protobuf_protocol_impl.hpp"

namespace cpp {

// PROTO TO API --------------------------------

fc::variants parse_proto_extensions(const fc::variant& ex)
{
  FC_ASSERT(ex.is_array(), "Extensions must be an array");

  fc::variants result;
  const fc::variants& extensions = ex.get_array();

  for (const auto& extension : extensions)
  {
    std::string key = extension.get_object().begin()->key();
    FC_ASSERT(extension.get_object()[key].is_object(), "Extension should contain the body");
    result.emplace_back(std::move(fc::mutable_variant_object{ "type", key }("value", extension.get_object()[key].get_object())));
  }

  return result;
}

fc::mutable_variant_object parse_proto_operation(const fc::variant& op)
{
  FC_ASSERT(op.is_object() && op.get_object().size(), "Operation cannot be empty");

  std::string key = op.get_object().begin()->key();

  // TODO: Add map operation type key check here

  FC_ASSERT(op.get_object()[key].is_object(), "Operation should contain the body");

  fc::mutable_variant_object op_body = op.get_object()[key].get_object();

  if (op_body.find("extensions") != op_body.end())
    op_body("extensions", std::move(parse_proto_extensions(op_body["extensions"])));

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

  if (tx_body.find("extensions") != tx_body.end())
    tx_body("extensions", std::move(parse_proto_extensions(tx_body["extensions"])));

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
      extension.get_object()["value"].is_object(), "Not a valid api operation extension");

    std::string key = extension.get_object()["type"].get_string();
    result.emplace_back(std::move(fc::mutable_variant_object{ key, extension.get_object()["value"].get_object() }));
  }

  return result;
}

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

  if (op_body.find("extensions") != op_body.end())
    op_body("extensions", std::move(parse_api_extensions(op_body["extensions"])));

  return fc::mutable_variant_object{ key, std::move(op_body) };
}

fc::mutable_variant_object parse_api_transaction(const fc::variant& trx)
{
  FC_ASSERT(trx.is_object() && trx.get_object().contains("operations") && trx.get_object()["operations"].is_array(), "Transaction cannot be empty");

  fc::variants operations;
  fc::mutable_variant_object tx_body = trx.get_object();

  for (const auto& op : tx_body["operations"].get_array())
    operations.emplace_back(std::move(parse_api_operation(op)));

  if (tx_body.find("extensions") != tx_body.end())
    tx_body("extensions", std::move(parse_api_extensions(tx_body["extensions"])));

  return fc::mutable_variant_object{ std::move(tx_body) }("operations", std::move(operations));
}


std::string cpp_api_to_proto_impl(const std::string& operation_or_tx)
{
  fc::variant var = fc::json::from_string(operation_or_tx);
  FC_ASSERT(var.is_object(), "cpp_proto_to_api requires JSON object as an argument");

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

} /// namespace cpp 

