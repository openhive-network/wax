#include "core/foundation.hpp"

#include "core/types.hpp"
#include "core/utils.hpp"

#include <boost/lexical_cast.hpp>

#include <string>

#include <hive/protocol/asset.hpp>

#include <hive/chain/util/manabar.hpp>

namespace cpp {

json_asset cpp_generate_nai(const hive::protocol::asset& asset)
{
  try
  {
    return {
      boost::lexical_cast<std::string>(asset.amount.value),
      /* uint64_t */ uint32_t(asset.symbol.decimals()),
      asset.symbol.to_nai_string()
    };
  }
  catch (...)
  {
    return {
      "",
      0,
      ""
    };
  }
}


json_asset foundation::cpp_general_asset(const uint32_t asset_num, const int64_t amount)const
{
  return cpp_generate_nai(hive::protocol::asset{ amount, hive::protocol::asset_symbol_type::from_asset_num(asset_num) });
}

json_asset foundation::cpp_hive(const int64_t amount)const
{
  return cpp_generate_nai(hive::protocol::HIVE_asset{ amount });
}

json_asset foundation::cpp_hbd(const int64_t amount)const
{
  return cpp_generate_nai(hive::protocol::HBD_asset{ amount });
}

json_asset foundation::cpp_vests(const int64_t amount)const
{
  return cpp_generate_nai(hive::protocol::VEST_asset{ amount });
}

result foundation::cpp_generate_private_key()
{
  return method_wrapper([&](result& _result) {
    _result.content = fc::ecc::private_key::generate().key_to_wif();
    });
}

result foundation::cpp_calculate_public_key(const std::string& wif)
{
  return method_wrapper([&](result& _result) {
    const auto private_key = fc::ecc::private_key::wif_to_key(wif);
    FC_ASSERT(private_key.valid(), "given string is not valid private key");
    _result.content = fc::ecc::public_key::to_base58(private_key->get_public_key(), false/*is_sha256*/);
    });
}

int64_t __current_manabar(const int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time)
{
  using namespace hive::chain::util;
  const manabar_params params{ max_mana, HIVE_RC_REGEN_TIME };
  manabar manabar{ current_mana, last_update_time };
  manabar.regenerate_mana(params, now);
  return manabar.current_mana;
}

result foundation::cpp_calculate_manabar_full_regeneration_time(const int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time)
{
  // safe is used because of detected issue with overflow
  using safe_uint128_t = fc::safe<fc::uint128_t>;

  return method_wrapper([&](result& _result) {
    const safe_uint128_t hive_rc_regen_time{ HIVE_RC_REGEN_TIME };
    const safe_uint128_t safe_max_mana{ max_mana };
    const safe_uint128_t safe_now{ now };

    const safe_uint128_t mana = __current_manabar(now, max_mana, current_mana, last_update_time);
    const safe_uint128_t time_to_regenerate_missing_mana = (safe_max_mana - mana) * hive_rc_regen_time / max_mana;

    _result.content = std::to_string((safe_now + time_to_regenerate_missing_mana).value);
    });
}

result foundation::cpp_calculate_current_manabar_value(const int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time) {
  return method_wrapper([&](result& _result) {
    _result.content = std::to_string(__current_manabar(now, max_mana, current_mana, last_update_time));
    });
}

} /// namespace cpp

