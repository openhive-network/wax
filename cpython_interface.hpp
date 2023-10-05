#pragma once

#include<string>


#include "core/foundation.hpp"

namespace cpp
{
 
  ///  Interface providing Hive protocol functionality operating on Hive native JSON format.
  class protocol : public foundation
  {
    public:
      result cpp_validate_operation( const std::string& operation );
      result cpp_validate_transaction( const std::string& transaction );
      result cpp_calculate_transaction_id( const std::string& transaction );
      result cpp_calculate_sig_digest( const std::string& transaction, const std::string& chain_id );
      result cpp_serialize_transaction( const std::string& transaction );
  };

  ///  Interface providing Hive protocol functionality operating on Protobuf specific JSON format.
  class proto_protocol : public foundation
  {
    public:
      result cpp_validate_operation( const std::string& operation );
      result cpp_validate_transaction( const std::string& transaction );
      result cpp_calculate_transaction_id( const std::string& transaction );
      result cpp_calculate_sig_digest( const std::string& transaction, const std::string& chain_id );
      result cpp_serialize_transaction( const std::string& transaction );

      // TODO: Implement block bi-directional protobuf JSON conversion
      result cpp_proto_to_api( const std::string& operation_or_tx );
      result cpp_api_to_proto( const std::string& operation_or_tx );
  };
}
