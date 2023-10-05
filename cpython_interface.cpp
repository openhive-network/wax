#include "cpython_interface.hpp"

#include <hive/protocol/types.hpp>

#include <boost/preprocessor/variadic/to_seq.hpp>
#include <boost/preprocessor/seq/enum.hpp>
#include <boost/preprocessor/seq/transform.hpp>

#include <fc/io/json.hpp>

#include <iostream>
#include <string>

namespace cpp
{
  void log( const std::string& message )
  {
    std::cout<< message << std::endl;
  }

  result proto_protocol::cpp_proto_to_api( const std::string& operation_or_tx )
  {
    return method_wrapper([&]( result& _result )
    {
      _result.content = cpp_proto_to_api_impl(operation_or_tx);
    });
  }

  result proto_protocol::cpp_api_to_proto( const std::string& operation_or_tx )
  {
    return method_wrapper([&]( result& _result )
    {
      _result.content = cpp_api_to_proto_impl(operation_or_tx);
    });
  }

  result proto_protocol::cpp_serialize_transaction( const std::string& transaction )
  {
    return method_wrapper([&](result& _result)
    {
        protocol provider;
      _result = provider.cpp_serialize_transaction(
          cpp_proto_to_api_impl(transaction)
        );
    });
  }
} // namespace cpp