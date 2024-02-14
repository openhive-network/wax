#pragma once

#include "core/types.hpp"

#include <string>

namespace cpp {

///  Common base providing functionality independent on JSON format being used for parameter transport
class foundation
{
public:
  result cpp_calculate_public_key(const std::string& wif);
  result cpp_generate_private_key();

  ///  Allows to retrieve public key in WIF format from the signature and digest in hexadecimal format
  result cpp_get_public_key_from_signature(const std::string& digest, const std::string& signature);

  json_asset cpp_general_asset(const uint32_t asset_num, const int64_t amount)const;
  json_asset cpp_hive(const int64_t amount)const;
  json_asset cpp_hbd(const int64_t amount)const;
  json_asset cpp_vests(const int64_t amount)const;

  std::string cpp_asset_value(const json_asset& value) const;
  std::string cpp_asset_symbol(const json_asset& value) const;

  result cpp_calculate_manabar_full_regeneration_time(const int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time);
  result cpp_calculate_current_manabar_value(const int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time);

  ref_block_data cpp_get_tapos_data(const std::string& block_id);

protected:
  /// use this only through derived classes
  foundation() = default;
  ~foundation() = default;
};

} /// namespace cpp
