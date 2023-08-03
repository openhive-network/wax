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

  class protocol
  {
    private:

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
  };
}
