#pragma once

#include <core/types.hpp>
#include <hive/protocol/transaction.hpp>
#include <hive/protocol/operations.hpp>
#include <string>

namespace cpp {
binary_data generate_binary_transaction_metadata( const hive::protocol::signed_transaction& tx, bool use_hf26_serialization = true );
binary_data generate_binary_operation_metadata( const hive::protocol::operation& op, bool use_hf26_serialization = true );

std::string serialize_transaction( const hive::protocol::signed_transaction& tx, bool use_hf26_serialization = true );
} // namespace cpp
