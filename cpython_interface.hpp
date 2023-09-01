#pragma once

#include<string>
#include<functional>

#include <hive/protocol/asset.hpp>

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
    private:

      using callback = std::function<void(result&)>;

      result method_wrapper( callback&& method );
      json_asset cpp_generate_nai(const hive::protocol::asset& asset)const;

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
      json_asset general_asset(const uint32_t asset_num, const int64_t amount)const;
      json_asset hive(const int64_t amount)const;
      json_asset hbd(const int64_t amount)const;
      json_asset vests(const int64_t amount)const;
  };
}
