#pragma once

#include "core/types.hpp"

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
  result cpp_calculate_transaction_id(const std::string& transaction);
  result cpp_calculate_sig_digest(const std::string& transaction, const std::string& chain_id);
  result cpp_serialize_transaction(const std::string& transaction);
};

} /// namespace cpp

