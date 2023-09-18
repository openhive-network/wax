#pragma once

#include<string>
#include<functional>

namespace cpp
{
  enum error_code { fail = 0, ok = 1 };

  struct result
  {
    error_code value = error_code::fail;

    std::string content;
    std::string exception_message;

    result() noexcept = default;
  };

  struct json_asset
  {
    std::string amount;
    uint32_t precision; // XXX: is uint64_t actually
    std::string nai;
  };

  class protocol
  {
    protected:

      using callback = std::function<void(result&)>;

      result method_wrapper( callback&& method );

    public:

      result cpp_validate_operation( const std::string& operation );
      result cpp_validate_transaction( const std::string& transaction );
      result cpp_calculate_transaction_id( const std::string& transaction );
      result cpp_calculate_sig_digest( const std::string& transaction, const std::string& chain_id );
      result cpp_serialize_transaction( const std::string& transaction );
      result cpp_calculate_public_key( const std::string& wif );
      result cpp_generate_private_key();
      result cpp_calculate_manabar_full_regeneration_time( const int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time );
      result cpp_calculate_current_manabar_value( const int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time );
      json_asset cpp_general_asset(const uint32_t asset_num, const int64_t amount)const;
      json_asset cpp_hive(const int64_t amount)const;
      json_asset cpp_hbd(const int64_t amount)const;
      json_asset cpp_vests(const int64_t amount)const;
  };

  class proto_protocol : public protocol
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
