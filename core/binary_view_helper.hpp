#pragma once

#include <core/types.hpp>
#include <hive/protocol/transaction.hpp>
#include <string>

namespace cpp {
binary_data generate_binary_transaction_metadata( const hive::protocol::signed_transaction& tx );

std::string serialize_transaction( const hive::protocol::signed_transaction& tx );
} // namespace cpp
