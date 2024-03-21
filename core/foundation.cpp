#include "core/foundation.hpp"

#include "core/types.hpp"
#include "core/utils.hpp"
#include "fc/crypto/elliptic.hpp"

#include <boost/lexical_cast.hpp>

#include <string>

#include <hive/protocol/asset.hpp>
#include <hive/protocol/transaction.hpp>
#include <hive/protocol/crypto_memo.hpp>

#include <hive/chain/util/manabar.hpp>

namespace cpp {

json_asset to_json_asset(const hive::protocol::asset& asset)
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

int64_t calculate_inflation_rate_for_block(const uint32_t block_num)
{
  /**
    * At block 7,000,000 have a 9.5% instantaneous inflation rate, decreasing to 0.95% at a rate of 0.01%
    * every 250k blocks. This narrowing will take approximately 20.5 years and will complete on block 220,750,000
    */
  const int64_t start_inflation_rate = int64_t( HIVE_INFLATION_RATE_START_PERCENT );
  const int64_t inflation_rate_adjustment = int64_t( block_num / HIVE_INFLATION_NARROWING_PERIOD );
  const int64_t inflation_rate_floor = int64_t( HIVE_INFLATION_RATE_STOP_PERCENT );
  
  // below subtraction cannot underflow int64_t because inflation_rate_adjustment is <2^32
  return std::max( start_inflation_rate - inflation_rate_adjustment, inflation_rate_floor );
}

hive::protocol::asset to_asset(const json_asset& v)
{
  fc::mutable_variant_object mv;
  mv( "amount", v.amount )("precision", uint64_t( v.precision ) )("nai", v.nai );

  hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
  hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

  fc::variant helper(mv);
  hive::protocol::asset a;
  fc::from_variant(helper, a);

  return a;
}

hive::protocol::legacy_asset to_legacy_asset(const json_asset& v)
{
  return hive::protocol::legacy_asset(to_asset(v));
}

json_asset foundation::cpp_general_asset(const uint32_t asset_num, const int64_t amount)const
{
  return to_json_asset(hive::protocol::asset{ amount, hive::protocol::asset_symbol_type::from_asset_num(asset_num) });
}

json_asset foundation::cpp_hive(const int64_t amount)const
{
  return to_json_asset(hive::protocol::HIVE_asset{ amount });
}

json_asset foundation::cpp_hbd(const int64_t amount)const
{
  return to_json_asset(hive::protocol::HBD_asset{ amount });
}

json_asset foundation::cpp_vests(const int64_t amount)const
{
  return to_json_asset(hive::protocol::VEST_asset{ amount });
}

std::string foundation::cpp_asset_value(const json_asset& value) const
{
  auto a = to_legacy_asset(value);

  /// FIXME optimize it by extending legacy_asset interface by providing function to just convert amount
  std::string s;
  s = a.to_string();
  auto space_pos = s.find( ' ' );
  FC_ASSERT( space_pos != std::string::npos );
  auto value_part = s.substr( 0, space_pos );

  return value_part;
}

std::string foundation::cpp_asset_symbol(const json_asset& value) const
{
  auto a = to_legacy_asset(value);
  hive::protocol::legacy_asset la(a);

  const auto symbol = la.asset_num_to_string();

  if(symbol == "UNKN")
    return value.nai;

  return symbol;
}

result foundation::cpp_generate_private_key()
{
  return method_wrapper([&](result& _result)
  {
    _result.content = fc::ecc::private_key::generate().key_to_wif();
  });
}

result foundation::cpp_get_public_key_from_signature(const std::string& digest, const std::string& signature)
{
  return method_wrapper([&](result& _result)
  {
    const auto d = hive::protocol::digest_type{ digest };
    auto sig = hive::protocol::signature_type{};

    fc::from_hex(signature, reinterpret_cast<char*>(&*sig.begin()), sig.size());

    _result.content = fc::ecc::public_key::to_base58(fc::ecc::public_key{ sig, d, fc::ecc::bip_0062 }, false);
  });
}

void foundation::cpp_throws(int type) const
{
  if(type == 0)
    throw;
  else if(type == 1)
    throw "Hello";
  else if(type == 2)
    throw std::string{"Hello, world!"};
  else if(type == 3)
    throw std::runtime_error{ "Hello, my exception!" };
  else if(type == 4)
    FC_ASSERT( false, "Hello fc exception!" );
}

crypto_memo foundation::cpp_crypto_memo_from_string(const std::string& value) const
{
  std::optional<hive::protocol::crypto_memo::memo_content> loaded = hive::protocol::crypto_memo{}.load_from_string(value);

  FC_ASSERT( loaded.has_value(), "Could not load the crypto memo content from given string", (value) );

  const std::string from = loaded->from.to_base58();
  const std::string to = loaded->to.to_base58();

  fc::crypto_data::content crypto_obj{ std::move(loaded.value()) };

  return crypto_memo{ from, to, fc::to_base58( fc::raw::pack_to_vector( crypto_obj ) ) };
}

std::string foundation::cpp_crypto_memo_dump_string(const crypto_memo& value) const
{
  auto memo_obj = hive::protocol::crypto_memo{};

  const fc::ecc::public_key from = fc::ecc::public_key::from_base58( value.from );
  const fc::ecc::public_key to = fc::ecc::public_key::from_base58( value.to );

  const hive::protocol::crypto_memo::memo_content encoded = memo_obj.build_from_base58_content(from, to, value.content);

  return memo_obj.dump_to_string(encoded);
}

result foundation::cpp_calculate_public_key(const std::string& wif)
{
  return method_wrapper([&](result& _result)
  {
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

  return method_wrapper([&](result& _result)
  {
    const safe_uint128_t hive_rc_regen_time{ HIVE_RC_REGEN_TIME };
    const safe_uint128_t safe_max_mana{ max_mana };
    const safe_uint128_t safe_now{ now };

    const safe_uint128_t mana = __current_manabar(now, max_mana, current_mana, last_update_time);
    const safe_uint128_t time_to_regenerate_missing_mana = (safe_max_mana - mana) * hive_rc_regen_time / max_mana;

    _result.content = std::to_string((safe_now + time_to_regenerate_missing_mana).value);
  });
}

result foundation::cpp_calculate_current_manabar_value(const int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time) {
  return method_wrapper([&](result& _result)
  {
    _result.content = std::to_string(__current_manabar(now, max_mana, current_mana, last_update_time));
  });
}

ref_block_data foundation::cpp_get_tapos_data(const std::string& block_id)
{
  try
  {
    const hive::protocol::block_id_type id { block_id };
    hive::protocol::transaction tx;

    tx.set_reference_block(id);

    return { tx.ref_block_num, tx.ref_block_prefix };
  }
  catch(...)
  {
    return { 0, 0 };
  }
}

result foundation::cpp_calculate_hp_apr(const uint32_t head_block_num, const uint16_t vesting_reward_percent, const json_asset& virtual_supply, const json_asset& total_vesting_fund_hive) const
{
  return method_wrapper([&](result& _result)
  {
    const int64_t current_inflation_rate = calculate_inflation_rate_for_block(head_block_num);

    // calculate the "APR"
    hive::protocol::asset _virtual_supply = to_asset(virtual_supply);
    hive::protocol::asset _total_vesting_fund_hive = to_asset(total_vesting_fund_hive);
    FC_ASSERT( _virtual_supply.symbol == HIVE_SYMBOL, "'virtual_supply' param expect as HIVE asset" );
    FC_ASSERT( _total_vesting_fund_hive.symbol == HIVE_SYMBOL, "'total_vesting_fund_hive' param expect as HIVE asset" );
    const int64_t hp_apr = (_virtual_supply.amount.value * current_inflation_rate * vesting_reward_percent / _total_vesting_fund_hive.amount.value) / HIVE_100_PERCENT;
    const int64_t hp_apr_percent = hp_apr / 100;
    const int64_t hp_apr_percent_decimals = hp_apr % 100;

    _result.content = std::to_string(hp_apr_percent) + "." + std::to_string(hp_apr_percent_decimals);
  });
}

json_asset foundation::cpp_hbd_to_hive(const json_asset &hbd, const json_asset& base, const json_asset& quote) const
{
  const hive::protocol::asset _hbd = to_asset(hbd);
  const hive::protocol::asset _base = to_asset(base);
  const hive::protocol::asset _quote = to_asset(quote);
  FC_ASSERT( _hbd.symbol == HBD_SYMBOL, "'hbd' param expected as HBD asset" );
  FC_ASSERT( _base.symbol == HBD_SYMBOL, "'price_base' param expected as HBD asset" );
  FC_ASSERT( _quote.symbol == HIVE_SYMBOL, "'price_quote' param expected as HIVE asset" );
  const hive::protocol::price hbd_to_hive_feed{ _base, _quote };

  const hive::protocol::asset hive = _hbd * hbd_to_hive_feed;
  return to_json_asset(hive);
}

json_asset foundation::cpp_vests_to_hp(const json_asset& vests, const json_asset& total_vesting_fund_hive, const json_asset& total_vesting_shares) const
{
  const hive::protocol::asset _vests = to_asset(vests);
  const hive::protocol::asset _total_vesting_fund_hive = to_asset(total_vesting_fund_hive);
  const hive::protocol::asset _total_vesting_shares = to_asset(total_vesting_shares);
  FC_ASSERT( _vests.symbol == VESTS_SYMBOL, "'vests' param expected as VESTS asset" );
  FC_ASSERT( _total_vesting_fund_hive.symbol == HIVE_SYMBOL, "'total_vesting_fund_hive' param expected as HIVE asset" );
  FC_ASSERT( _total_vesting_shares.symbol == VESTS_SYMBOL, "'total_vesting_shares' param expected as VESTS asset" );
  const hive::protocol::price vests_to_hive_feed{ _total_vesting_fund_hive, _total_vesting_shares };

  const hive::protocol::asset hp = _vests * vests_to_hive_feed;
  return to_json_asset(hp);
}

result foundation::cpp_calculate_inflation_rate_for_block(const uint32_t block_num) const 
{
  return method_wrapper([&](result& _result)
  {
    _result.content = std::to_string(calculate_inflation_rate_for_block(block_num));
  });
}

} /// namespace cpp

