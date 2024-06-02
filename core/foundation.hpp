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

  private_key_data cpp_generate_private_key(const std::string& account, const std::string& role, const std::string& password);
  private_key_data cpp_suggest_brain_key();

  ///  Allows to retrieve public key in WIF format from the signature and digest in hexadecimal format
  result cpp_get_public_key_from_signature(const std::string& digest, const std::string& signature);

  json_asset cpp_general_asset(const uint32_t asset_num, const int64_t amount)const;
  json_asset cpp_hive(const int64_t amount)const;
  json_asset cpp_hbd(const int64_t amount)const;
  json_asset cpp_vests(const int64_t amount)const;

  std::string cpp_asset_value(const json_asset& value) const;
  std::string cpp_asset_symbol(const json_asset& value) const;

  void cpp_throws(int type) const;

  /* Allows to decode a `crypto-memo` string into structure providing such data directly (needed to start actual decryption process).
  *  To be used as 1st step of decryption process.
  * @returns A structure holding data decoded from input string, providing all required informations for further decryption.
  */
  crypto_memo cpp_crypto_memo_from_string(const std::string& value) const;

  /** Encodes `crypto_memo` structure into `crypto-memo` encoded string.
  *   To be used as 2nd step of encryption process.
  *
  *   @returns Encoded string holding all required informations for further decryption.
  */
  std::string cpp_crypto_memo_dump_string(const crypto_memo& value) const;

  result cpp_calculate_manabar_full_regeneration_time(const int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time);
  result cpp_calculate_current_manabar_value(const int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time);

  ref_block_data cpp_get_tapos_data(const std::string& block_id);

  /**
   * Calculate current HP APR.
   *
   * @param head_block_num - from dgpo
   * @param vesting_reward_percent - from dgpo
   * @param virtual_supply - from dgpo
   * @param total_vesting_fund_hive - from dgpo
   *
   * @returns HP APR percent with 2 decimals as string in result.content
   */
  result cpp_calculate_hp_apr(const uint32_t head_block_num, const uint16_t vesting_reward_percent, const json_asset& virtual_supply, const json_asset& total_vesting_fund_hive) const;

  /**
   * Convert HBD to HIVE.
   *
   * @param hbd   - HBD asset
   * @param base  - base value from get_current_price_feed (HBD asset)
   * @param quote - quote value from get_current_price_feed (HIVE asset)
   *
   * @returns value in HIVE asset
   */
  json_asset cpp_hbd_to_hive(const json_asset &hbd, const json_asset& base, const json_asset& quote) const;

  /**
   * Convert VESTS to HP.
   *
   * @param vests - VESTS asset (also voting power or RC expressed as VESTS asset)
   * @param total_vesting_fund_hive - from dgpo HIVE asset
   * @param total_vesting_shares - from dgpo VESTS asset
   *
   * @returns value in HIVE asset (HP)
   */
  json_asset cpp_vests_to_hp(const json_asset& vests, const json_asset& total_vesting_fund_hive, const json_asset& total_vesting_shares) const;

  /**
   * Calculate current inflation rate.
   *
   * @param block_num - block number for which will be calculated inflation rate
   *
   * @returns curent inflation rate.
   */
  result cpp_calculate_inflation_rate_for_block(const uint32_t block_num) const;

protected:
  /// use this only through derived classes
  foundation() = default;
  ~foundation() = default;
};

} /// namespace cpp
