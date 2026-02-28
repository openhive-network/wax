#include "core/foundation.hpp"

#include "core/types.hpp"
#include "core/utils.hpp"
#include "core/binary_view_helper.hpp"
#include "core/signing_keys_collector.hpp"
#include "core/minimize_required_signatures_helper.hpp"

#include <fc/reflect/reflect.hpp>
#include <fc/io/json.hpp>
#include <fc/crypto/elliptic.hpp>
#include <fc/crypto/hex.hpp>

#include <boost/lexical_cast.hpp>

#include <string>

#include <hive/protocol/asset.hpp>
#include <hive/protocol/key_utils.hpp>
#include <hive/protocol/transaction.hpp>
#include <hive/protocol/transaction_util.hpp>
#include <hive/protocol/crypto_memo.hpp>
#include <hive/protocol/hive_collateral.hpp>
#include <hive/protocol/forward_impacted.hpp>
#include <hive/protocol/get_config.hpp>
#include <hive/protocol/operation_util.hpp>
#include <hive/protocol/hbd_interest.hpp>

#include <hive/chain/util/manabar.hpp>

namespace cpp {

void wax_tx_ptr_deleter::operator()(hive_tx* t) const
{
  delete t;
}

void wax_op_ptr_deleter::operator()(hive_op* t) const
{
  delete t;
}

unsigned int hive_transaction_handle::instance_count = 0;
unsigned int hive_transaction_handle::max_instance_count = 0;

hive_transaction_handle::hive_transaction_handle() : tx(new hive_tx())
{
  ++instance_count;
  if(instance_count > max_instance_count)
    max_instance_count = instance_count;
}

hive_transaction_handle::hive_transaction_handle(hive_transaction_handle&& rhs) : tx(std::move(rhs.tx))
{
  ++instance_count;
  if (instance_count > max_instance_count)
    max_instance_count = instance_count;
}

hive_transaction_handle::~hive_transaction_handle()
{
  --instance_count;
}

json_asset to_json_asset(const hive::protocol::asset& asset)
{
  return cpp::safe_exception_wrapper([&]() ->json_asset {
    return {
      boost::lexical_cast<std::string>(asset.amount.value),
      /* uint64_t */ uint32_t(asset.symbol.decimals()),
      asset.symbol.to_nai_string()
    };
  });
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
  return to_json_asset(hive::protocol::HIVE_asset( amount ).to_asset());
}

json_asset foundation::cpp_hbd(const int64_t amount)const
{
  return to_json_asset(hive::protocol::HBD_asset( amount ).to_asset());
}

json_asset foundation::cpp_vests(const int64_t amount)const
{
  return to_json_asset(hive::protocol::VEST_asset( amount ).to_asset());
}


witness_set_properties_serialized foundation::cpp_serialize_witness_set_properties(const witness_set_properties_data& value) const
{
  return cpp::safe_exception_wrapper([&]() ->witness_set_properties_serialized {
  witness_set_properties_serialized result;

  auto key = fc::ecc::public_key::from_base58_with_prefix(value.key, HIVE_ADDRESS_PREFIX);

  result.emplace("key", fc::to_hex(fc::raw::pack_to_vector(key)));

  if(value.new_signing_key.has_value())
  {
    key = fc::ecc::public_key::from_base58_with_prefix(value.new_signing_key.value(), HIVE_ADDRESS_PREFIX);
    result.emplace("new_signing_key", fc::to_hex(fc::raw::pack_to_vector(key)));
  }

  if(value.account_creation_fee.has_value())
    result.emplace("account_creation_fee", fc::to_hex(fc::raw::pack_to_vector(value.account_creation_fee.value())));

  if(value.url.has_value())
    result.emplace("url", fc::to_hex(fc::raw::pack_to_vector(value.url.value())));

  if(value.hbd_exchange_rate.has_value())
    result.emplace("hbd_exchange_rate", fc::to_hex(fc::raw::pack_to_vector(value.hbd_exchange_rate.value())));

  if(value.maximum_block_size.has_value())
    result.emplace("maximum_block_size", fc::to_hex(fc::raw::pack_to_vector(value.maximum_block_size.value())));

  if(value.hbd_interest_rate.has_value())
    result.emplace("hbd_interest_rate", fc::to_hex(fc::raw::pack_to_vector(value.hbd_interest_rate.value())));

  if(value.account_subsidy_budget.has_value())
    result.emplace("account_subsidy_budget", fc::to_hex(fc::raw::pack_to_vector(value.account_subsidy_budget.value())));

  if(value.account_subsidy_decay.has_value())
    result.emplace("account_subsidy_decay", fc::to_hex(fc::raw::pack_to_vector(value.account_subsidy_decay.value())));

  return result;
  });
}

namespace detail {
  template <typename T>
  void convert_from_hex(const std::string& data, T& load_to)
  {
    std::vector<char> loaded_hex_container;
    loaded_hex_container.resize(data.size() / 2);

    fc::from_hex(data, loaded_hex_container.data(), loaded_hex_container.size());

    fc::raw::unpack_from_vector(loaded_hex_container, load_to);
  }
  template <typename T>
  void convert_from_hex(const std::string& data, std::optional<T>& load_to)
  {
    T load_to_holder;

    convert_from_hex<T>(data, load_to_holder);

    load_to = load_to_holder;
  }
}

witness_set_properties_data foundation::cpp_deserialize_witness_set_properties(const witness_set_properties_serialized& value) const
{
  return cpp::safe_exception_wrapper([&]() -> witness_set_properties_data {
  witness_set_properties_data result;

  auto itr = value.find("key");

  FC_ASSERT(itr != value.end(), "key is required in serialized data");

  hive::protocol::public_key_type public_key;
  detail::convert_from_hex(itr->second, public_key);

  result.key = fc::ecc::public_key::to_base58_with_prefix(public_key, HIVE_ADDRESS_PREFIX);

  itr = value.find("new_signing_key");
  if(itr != value.end())
  {
    detail::convert_from_hex(itr->second, public_key);
    result.new_signing_key = fc::ecc::public_key::to_base58_with_prefix(public_key, HIVE_ADDRESS_PREFIX);
  }

  itr = value.find("account_creation_fee");
  if(itr != value.end())
  {
    hive::protocol::asset actualFee;
    detail::convert_from_hex(itr->second, actualFee);

    result.account_creation_fee = to_json_asset(actualFee);
  }

  itr = value.find("url");
  if(itr != value.end())
    detail::convert_from_hex(itr->second, result.url);

  itr = value.find("hbd_exchange_rate");
  if(itr == value.end())
    itr = value.find("sbd_exchange_rate");

  if(itr != value.end())
    detail::convert_from_hex(itr->second, result.hbd_exchange_rate);

  itr = value.find("maximum_block_size");
  if(itr != value.end())
    detail::convert_from_hex(itr->second, result.maximum_block_size);

  itr = value.find("hbd_interest_rate");
  if(itr == value.end())
    itr = value.find("sbd_interest_rate");

  if(itr != value.end())
    detail::convert_from_hex(itr->second, result.hbd_interest_rate);

  itr = value.find("account_subsidy_budget");
  if(itr != value.end())
    detail::convert_from_hex(itr->second, result.account_subsidy_budget);

  itr = value.find("account_subsidy_decay");
  if(itr != value.end())
    detail::convert_from_hex(itr->second, result.account_subsidy_decay);

  return result;
  });
}

std::string foundation::cpp_asset_value(const json_asset& value) const
{
  return cpp::safe_exception_wrapper([&]() -> std::string {
  auto a = to_legacy_asset(value);

  /// FIXME optimize it by extending legacy_asset interface by providing function to just convert amount
  std::string s;
  s = a.to_string();
  auto space_pos = s.find( ' ' );
  FC_ASSERT( space_pos != std::string::npos );
  auto value_part = s.substr( 0, space_pos );

  return value_part;
  });
}

std::string foundation::cpp_asset_symbol(const json_asset& value) const
{
  return cpp::safe_exception_wrapper([&]() -> std::string {
  auto a = to_legacy_asset(value);
  hive::protocol::legacy_asset la(a);

  const auto symbol = la.asset_num_to_string();

  if(symbol == "UNKN")
    return value.nai;

  return symbol;
  });
}

std::string foundation::cpp_generate_private_key()
{
  return cpp::safe_exception_wrapper([&]() -> std::string
  {
    return fc::ecc::private_key::generate().key_to_wif();
  });
}

private_key_data foundation::cpp_generate_private_key(const std::string& account, const std::string& role, const std::string& password)
{
  return cpp::safe_exception_wrapper(
    [&]() -> private_key_data {
      private_key_data ret_val;
      const auto private_key_data = hive::protocol::generate_private_key_from_password(account, role, password);
      ret_val.associated_public_key = fc::ecc::public_key::to_base58_with_prefix(private_key_data.first, HIVE_ADDRESS_PREFIX);
      ret_val.wif_private_key = private_key_data.second;

      return ret_val;
    }
  );
}

std::string foundation::cpp_convert_raw_private_key_to_wif(const std::string& hexData)
{
  return cpp::safe_exception_wrapper(
    [&]() -> std::string {
    FC_ASSERT(hexData.size() == 64 && "Expected hex string pointing 32 byte buffer");

    fc::sha256 sharedSecret(hexData);

    return fc::ecc::private_key::regenerate(sharedSecret).key_to_wif();
    }
  );
}

std::string foundation::cpp_convert_raw_public_key_to_wif(const std::string& hexData)
{
  return cpp::safe_exception_wrapper(
    [&]() -> std::string {
      if(hexData.size() == 2 * sizeof(fc::ecc::public_key_data))
      {
        /// compressed form
        fc::ecc::public_key_data keyData;
        detail::convert_from_hex(hexData, keyData);

        return fc::ecc::public_key::to_base58_with_prefix(keyData, HIVE_ADDRESS_PREFIX);

      }
      else
      {
        FC_ASSERT(hexData.size() == 2 * sizeof(fc::ecc::public_key_point_data), "Invalid size of raw public key buffer: ${s}", ("s", (hexData.size())));
        /// uncompressed form
        fc::ecc::public_key_point_data keyData;
        detail::convert_from_hex(hexData, keyData);

        fc::ecc::public_key key(keyData);
        return key.to_base58_with_prefix(HIVE_ADDRESS_PREFIX);
      }
    }
  );
}

std::string foundation::cpp_convert_wif_public_key_to_raw(const std::string& wifPublicKey)
{
  return cpp::safe_exception_wrapper(
    [&]() -> std::string {
      fc::ecc::public_key publicKey = fc::ecc::public_key::from_base58_with_prefix(wifPublicKey, HIVE_ADDRESS_PREFIX);
      fc::ecc::public_key_data keyData = publicKey.serialize();

      return fc::to_hex( (const char*)&keyData, sizeof(keyData) );
    }
  );
}

brain_key_data foundation::cpp_suggest_brain_key()
{
  return cpp::safe_exception_wrapper(
    []() ->brain_key_data {
      brain_key_data ret_val;

      const auto bki = hive::protocol::suggest_brain_key();

      ret_val.brain_key = bki.brain_priv_key;
      ret_val.associated_public_key = fc::ecc::public_key::to_base58_with_prefix(bki.pub_key, HIVE_ADDRESS_PREFIX);
      ret_val.wif_private_key = bki.wif_priv_key;

      return ret_val;
    }
  );
}
static inline
hive::protocol::authority convert_wax_authority_to_protocol_authority(const wax_authority& w_authority)
{
  using authority = hive::protocol::authority;
  auto convert_wax_key_auth_map_to_hive_key_auth_map = [](const wax_authority::authority_map& auth_map) -> authority::key_authority_map {
    authority::key_authority_map result;
    for (const auto& auth : auth_map)
      result.emplace(auth.first, auth.second);
    return result;
    };

  authority a;
  a.weight_threshold = w_authority.weight_threshold;
  a.key_auths = convert_wax_key_auth_map_to_hive_key_auth_map(w_authority.key_auths);
  a.account_auths = authority::account_authority_map(w_authority.account_auths.cbegin(), w_authority.account_auths.cend());

  return a;
}

static inline
hive::protocol::authorities_t convert_wax_authorities_to_authorities(const wax_authorities& w_authorities)
{
  using authority = hive::protocol::authority;

  authority active = convert_wax_authority_to_protocol_authority(w_authorities.active);
  authority owner = convert_wax_authority_to_protocol_authority(w_authorities.owner);
  authority posting = convert_wax_authority_to_protocol_authority(w_authorities.posting);

  return { std::move(active), std::move(owner), std::move(posting) };
}

hive::protocol::authority_verification_trace foundation::cpp_trace_authority_verification(
  const required_authority_collection_t& required_authorities,
  const std::vector<std::string>& decodedSignaturePublicKeys,
  IAccountAuthorityProvider& authorityProvider) const
{
  struct Impl final : public hive::protocol::authority_getter_i
  {
    explicit Impl(IAccountAuthorityProvider& authorityProvider) : _authorityProvider(authorityProvider) {}
    virtual ~Impl() = default;

    using authority = hive::protocol::authority;
    using public_key_type = hive::protocol::public_key_type;

    virtual std::optional<authority> get_active(const std::string& a) const override
    {
      return acquireAuthority(a, "active");
    }

    virtual std::optional<authority> get_owner(const std::string& a) const override
    {
      return acquireAuthority(a, "owner");
    }

    virtual std::optional<authority> get_posting(const std::string& a) const override
    {
      return acquireAuthority(a, "posting");
    }

    virtual std::optional<public_key_type> get_witness_key(const std::string& account) const override
    {
      std::optional<public_key_type> retval;
      const auto signingKey = _authorityProvider.getWitnessPublicKey(account);
      if(signingKey)
        retval = fc::ecc::public_key::from_base58_with_prefix(*signingKey, HIVE_ADDRESS_PREFIX);
      return retval;
    }

  private:
    std::optional<authority> acquireAuthority(const std::string& account, const char* role) const
    {
      auto wAuth = _authorityProvider.getAuthority(account, role);
      if(wAuth)
        return convert_wax_authority_to_protocol_authority(*wAuth);

      return std::optional<authority>();
    }

  private:
    IAccountAuthorityProvider& _authorityProvider;
  };

  return cpp::safe_exception_wrapper([&]() ->hive::protocol::authority_verification_trace {
  flat_set<hive::protocol::public_key_type> _signatureDecodedPublicKeys;
  for(const auto& decodedKey : decodedSignaturePublicKeys)
  {
    auto key = fc::ecc::public_key::from_base58_with_prefix(decodedKey, HIVE_ADDRESS_PREFIX);
    _signatureDecodedPublicKeys.insert(key);
  }

  hive::protocol::required_authorities_type _requiredAuths;

  _requiredAuths.required_active.insert(required_authorities.active_accounts.cbegin(), required_authorities.active_accounts.end());
  _requiredAuths.required_owner.insert(required_authorities.owner_accounts.cbegin(), required_authorities.owner_accounts.end());
  _requiredAuths.required_posting.insert(required_authorities.posting_accounts.cbegin(), required_authorities.posting_accounts.end());

  ///_requiredAuths.required_witness; /// ? missing field in required_authority_collection_t?
  for(const auto& o : required_authorities.other_authorities)
  {
    _requiredAuths.other.emplace_back(convert_wax_authority_to_protocol_authority(o));
  }

  /// TODO: FIXME allow to pass by params
  const bool allow_strict_and_mixed_authorities = false;
  const bool allow_redundant_signatures = false;

  Impl protocolDataProvider(authorityProvider);

  hive::protocol::authority_verification_trace trace = hive::protocol::verify_authority_with_tracing(
    allow_strict_and_mixed_authorities,
    allow_redundant_signatures,
    _requiredAuths,
    _signatureDecodedPublicKeys,
    protocolDataProvider);

  return trace;
  });
}
std::string foundation::cpp_get_default_comment_options_operation() const
{
  return cpp::safe_exception_wrapper([&]() -> std::string
    {
      hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
      hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

      hive::protocol::comment_options_operation op;

      return fc::json::to_string(op);
    });
}
std::map<std::string, std::string> foundation::cpp_get_hive_protocol_config(const std::string& chain_id)
{
  return cpp::safe_exception_wrapper([&]() -> std::map<std::string, std::string> {
    const auto config = hive::protocol::get_config(NEW_HIVE_TREASURY_ACCOUNT, fc::sha256(chain_id));
    std::map<std::string, std::string> result;
    for (const auto& elem : config)
    {
      const auto& key = elem.key();
      const auto& value = elem.value();

      switch (value.get_type())
      {
        case fc::variant::int64_type:
        case fc::variant::uint64_type:
        case fc::variant::bool_type:
        case fc::variant::string_type:
          result.emplace(key, value.as_string());
          break;

        case fc::variant::object_type:
        {
          const auto& v = value.get_object().begin()->value();
          result.emplace(key, v.as_string());
          break;
        }

        default:
          FC_ASSERT(false, "Unexpected type of value ${type} for ${key}.", ("type", value.get_type()) ("key", key));
          break;
      }
    }

    return result;
    });
}

std::string foundation::cpp_get_public_key_from_signature(const std::string& digest, const std::string& signature)
{
  return cpp::safe_exception_wrapper([&]() -> std::string
  {
    const auto d = hive::protocol::digest_type{ digest };
    auto sig = hive::protocol::signature_type{};

    fc::from_hex(signature, reinterpret_cast<char*>(&*sig.begin()), sig.size());

    return fc::ecc::public_key::to_base58_with_prefix(fc::ecc::public_key{ sig, d }, HIVE_ADDRESS_PREFIX);
  });
}

void foundation::cpp_throws(int type) const
{
  return cpp::safe_exception_wrapper([&]() NO_RETURN -> void {
    if(type == 1)
      throw "Hello";
    else if(type == 2)
      throw std::string{"Hello, world!"};
    else if(type == 3)
      throw std::runtime_error{ "Hello, my exception!" };
    else if(type == 4)
      FC_ASSERT( false, "Hello fc exception!" );
    else if(type == 5) // This should throw std exception under the hood
      throw fc::assert_exception( FC_LOG_MESSAGE( error, "Simulated assert exception" ) );
    else if(type == 6) // External library unhandled exception object
      throw boost::bad_lexical_cast{};

    throw; // This should std::terminate()
  });
}

transaction_handle_stats foundation::cpp_report_transaction_handle_stats() const
{
  return { hive_transaction_handle::instance_count, hive_transaction_handle::max_instance_count };
}

void foundation::cpp_transform_api_error_response_into_exception(const std::string& data) const
{
  fc::exception e;

  try
  {
    fc::variant json = fc::json::from_string(data, fc::json::format_validation_mode::full);

    if (json.get_type() != fc::variant::object_type)
    {
      throw std::runtime_error("Got non-object-like error."); // Do not add data here as it will be added in outer catch clause
    }

    fc::from_variant(json, e);
  }
  catch(fc::exception& fc_e)
  {
    throw std::runtime_error("Non assert_exception error received: " + fc_e.to_detail_string() + " Original deserialization data: " + data);
  }
  catch(std::exception& std_e)
  {
    throw std::runtime_error("Non assert_exception error received: " + std::string(std_e.what()) + " Original deserialization data: " + data);
  }
  catch (...)
  {
    throw std::runtime_error("Non-fc::exception error received: " + data + " No additional exception data available.");
  }

  /** Since there is predefined set of subclasses of fc::assert_exception
      which have assigned own exception_code values (exceeding fc::exception_code type)
      simple condition to verify exception class according to its code fails for example for `transaction_expiration_exception` - see database_exceptions.hpp
      One of most important data carried by serialized assert_exception is `FC_ASSERT_EXPRESSION_KEY` extension property holding source of assetion hash value.
  */
  if(e.get_extension(FC_ASSERT_EXPRESSION_KEY).is_null())
  {
    // Not an assert_exception either.
    throw std::runtime_error("Non assert_exception error received: " + e.to_detail_string() + " Original deserialization data: " + data);
  }

  fc::assert_exception ae(e);
  uint64_t unrecognized_assertion_code = throw_recognized_wax_assertion( ae );
  throw wax_unknown_assertion( unrecognized_assertion_code, ae );
}

crypto_memo foundation::cpp_crypto_memo_from_string(const std::string& value) const
{
  return cpp::safe_exception_wrapper([&]() -> crypto_memo {
      std::optional<hive::protocol::crypto_memo::memo_content> loaded = hive::protocol::crypto_memo{}.load_from_string(value);

      FC_ASSERT( loaded.has_value(), "Could not load the crypto memo content from given string", (value) );

      const std::string from = fc::ecc::public_key::to_base58_with_prefix(loaded->from, HIVE_ADDRESS_PREFIX);
      const std::string to = fc::ecc::public_key::to_base58_with_prefix(loaded->to, HIVE_ADDRESS_PREFIX);

      fc::crypto_data::content crypto_obj{ loaded->nonce, loaded->check, std::move(loaded->encrypted) };

      return crypto_memo{ from, to, fc::to_base58( fc::raw::pack_to_vector( crypto_obj ) ) };
    }
  );
}

std::string foundation::cpp_crypto_memo_dump_string(const crypto_memo& value) const
{
  return cpp::safe_exception_wrapper([&]()-> std::string {
      auto memo_obj = hive::protocol::crypto_memo{};

      const fc::ecc::public_key from = fc::ecc::public_key::from_base58_with_prefix( value._from, HIVE_ADDRESS_PREFIX );
      const fc::ecc::public_key to = fc::ecc::public_key::from_base58_with_prefix( value.to, HIVE_ADDRESS_PREFIX );

      const hive::protocol::crypto_memo::memo_content encoded = memo_obj.build_from_base58_content(from, to, value.content);

      return memo_obj.dump_to_string(encoded);
    }
  );
}

void foundation::cpp_check_memo_for_private_keys(const std::string& memo, const std::string& account,
  const wax_authorities& auths, const std::string& memo_key, const std::vector<std::string>& imported_keys) const
{
  return cpp::safe_exception_wrapper([&]() -> void {
    std::vector<hive::protocol::public_key_type> keys;
    hive::protocol::collect_potential_keys(&keys, account, memo);

    if (keys.empty())
      return;

    fc::flat_set<std::string> _keys;
    _keys.reserve(keys.size());
    std::transform(keys.cbegin(), keys.cend(), std::inserter(_keys, _keys.end()), [](const auto& key) { return static_cast<std::string>(key); });

    const auto throwException = [&](const char* role, const std::string& publicKey) -> void {
      fc::mutable_variant_object vo;
      vo["msg"] = "Detected private key leak.";
      vo["account"] = account;
      vo["authority_role"] = role;
      vo["public_key"] = publicKey;

      std::string msg = fc::json::to_string(vo);
      throw wax_private_key_leak(msg);
      };


    for (const auto& key_weight_pair : auths.owner.key_auths)
    {
      if(_keys.contains(key_weight_pair.first))
        throwException("owner", key_weight_pair.first);
    }

    for (const auto& key_weight_pair : auths.active.key_auths)
    {
      if(_keys.contains(key_weight_pair.first))
        throwException("active", key_weight_pair.first);
    }

    for (const auto& key_weight_pair : auths.posting.key_auths)
    {
      if(_keys.contains(key_weight_pair.first))
        throwException("posting", key_weight_pair.first);
    }

    if(_keys.contains(memo_key))
      throwException("memo", memo_key);

    for (const auto& imported_key : imported_keys)
    {
      if(_keys.contains(imported_key))
        throwException("imported", imported_key);
    }
  });
}


std::string foundation::cpp_calculate_public_key(const std::string& wif)
{
  return cpp::safe_exception_wrapper([&]()-> std::string {
    const auto private_key = fc::ecc::private_key::wif_to_key(wif);
    FC_ASSERT(private_key.valid(), "given string is not valid private key");
    return fc::ecc::public_key::to_base58_with_prefix(private_key->get_public_key(), HIVE_ADDRESS_PREFIX);
  });
}

int64_t __current_manabar(int32_t* now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time)
{
  using namespace hive::chain::util;
  const manabar_params params{ max_mana, HIVE_RC_REGEN_TIME };

  /// patch now to match last_update_time and avoid assertions during misuse at client side
  if(last_update_time > static_cast<uint32_t>(*now))
    *now = static_cast<int32_t>(last_update_time);

  manabar manabar{ current_mana, last_update_time };
  manabar.regenerate_mana(params, *now);
  return manabar.current_mana;
}

uint64_t foundation::cpp_calculate_manabar_full_regeneration_time(int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time)
{
  // safe is used because of detected issue with overflow
  using safe_uint128_t = fc::safe<fc::uint128_t>;

  return cpp::safe_exception_wrapper([&]() -> uint64_t
  {
    const safe_uint128_t hive_rc_regen_time{ HIVE_RC_REGEN_TIME };
    const safe_uint128_t safe_max_mana{ max_mana };

    const safe_uint128_t mana = __current_manabar(&now, max_mana, current_mana, last_update_time);
    const safe_uint128_t safe_now{ now };

    const safe_uint128_t time_to_regenerate_missing_mana = (safe_max_mana - mana) * hive_rc_regen_time / max_mana;

    return fc::uint128_to_uint64((safe_now + time_to_regenerate_missing_mana).value);
  });
}

int64_t foundation::cpp_calculate_current_manabar_value(int32_t now, const int64_t max_mana, const int64_t current_mana, const uint32_t last_update_time) {
  return cpp::safe_exception_wrapper([&]() -> int64_t
  {
    return __current_manabar(&now, max_mana, current_mana, last_update_time);
  });
}

ref_block_data foundation::cpp_get_tapos_data(const std::string& block_id)
{
  return cpp::safe_exception_wrapper([&]()-> ref_block_data {
    const hive::protocol::block_id_type id { block_id };
    hive::protocol::transaction tx;

    tx.set_reference_block(id);

    return { tx.ref_block_num, tx.ref_block_prefix };
  });
}

std::string foundation::cpp_calculate_hp_apr(const uint32_t head_block_num, const uint16_t vesting_reward_percent, const json_asset& virtual_supply, const json_asset& total_vesting_fund_hive) const
{
  return cpp::safe_exception_wrapper([&]() -> std::string
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

    return std::to_string(hp_apr_percent) + "." + std::to_string(hp_apr_percent_decimals);
  });
}

json_asset foundation::cpp_hbd_to_hive(const json_asset &hbd, const json_asset& base, const json_asset& quote) const
{
  return cpp::safe_exception_wrapper([&]() -> json_asset {
  const hive::protocol::asset _hbd = to_asset(hbd);
  const hive::protocol::asset _base = to_asset(base);
  const hive::protocol::asset _quote = to_asset(quote);
  FC_ASSERT( _hbd.symbol == HBD_SYMBOL, "'hbd' param expected as HBD asset" );
  FC_ASSERT( _base.symbol == HBD_SYMBOL, "'price_base' param expected as HBD asset" );
  FC_ASSERT( _quote.symbol == HIVE_SYMBOL, "'price_quote' param expected as HIVE asset" );
  const hive::protocol::price hbd_to_hive_feed{ _base, _quote };

  const hive::protocol::asset hive = _hbd * hbd_to_hive_feed;
  return to_json_asset(hive);
  });
}

json_asset foundation::cpp_hive_to_hbd(const json_asset& amount, const json_asset& base, const json_asset& quote) const
{
  return cpp::safe_exception_wrapper([&]() -> json_asset {
    const hive::protocol::asset _amount = to_asset(amount);
    const hive::protocol::asset _base = to_asset(base);
    const hive::protocol::asset _quote = to_asset(quote);
    FC_ASSERT(_amount.symbol == HIVE_SYMBOL, "'amount' param expected as HIVE asset");
    FC_ASSERT(_base.symbol == HBD_SYMBOL, "'price_base' param expected as HBD asset");
    FC_ASSERT(_quote.symbol == HIVE_SYMBOL, "'price_quote' param expected as HIVE asset");
    const hive::protocol::price hive_to_hbd_feed{ _quote, _base };

    const hive::protocol::asset hbd = _amount * hive_to_hbd_feed;
    return to_json_asset(hbd);
    });
}

json_asset foundation::cpp_vests_to_hp(const json_asset& vests, const json_asset& total_vesting_fund_hive, const json_asset& total_vesting_shares) const
{
  return cpp::safe_exception_wrapper([&]() -> json_asset {
  const hive::protocol::asset _vests = to_asset(vests);
  const hive::protocol::asset _total_vesting_fund_hive = to_asset(total_vesting_fund_hive);
  const hive::protocol::asset _total_vesting_shares = to_asset(total_vesting_shares);
  FC_ASSERT( _vests.symbol == VESTS_SYMBOL, "'vests' param expected as VESTS asset" );
  FC_ASSERT( _total_vesting_fund_hive.symbol == HIVE_SYMBOL, "'total_vesting_fund_hive' param expected as HIVE asset" );
  FC_ASSERT( _total_vesting_shares.symbol == VESTS_SYMBOL, "'total_vesting_shares' param expected as VESTS asset" );
  const hive::protocol::price vests_to_hive_feed{ _total_vesting_fund_hive, _total_vesting_shares };

  const hive::protocol::asset hp = _vests * vests_to_hive_feed;
  return to_json_asset(hp);
  });
}

json_asset foundation::cpp_hp_to_vests(const json_asset& hive, const json_asset& total_vesting_fund_hive, const json_asset& total_vesting_shares) const
{
  return cpp::safe_exception_wrapper([&]() -> json_asset {
  const hive::protocol::asset _hive = to_asset(hive);
  const hive::protocol::asset _total_vesting_fund_hive = to_asset(total_vesting_fund_hive);
  const hive::protocol::asset _total_vesting_shares = to_asset(total_vesting_shares);
  FC_ASSERT( _hive.symbol == HIVE_SYMBOL, "'hive' param expected as HIVE asset" );
  FC_ASSERT( _total_vesting_fund_hive.symbol == HIVE_SYMBOL, "'total_vesting_fund_hive' param expected as HIVE asset" );
  FC_ASSERT( _total_vesting_shares.symbol == VESTS_SYMBOL, "'total_vesting_shares' param expected as VESTS asset" );
  const hive::protocol::price hive_to_vests_feed{ _total_vesting_shares, _total_vesting_fund_hive };

  const hive::protocol::asset vests = _hive * hive_to_vests_feed;
  return to_json_asset(vests);
  });
}

int64_t foundation::cpp_calculate_inflation_rate_for_block(const uint32_t block_num) const
{
  return cpp::safe_exception_wrapper([&]() -> int64_t
  {
    return calculate_inflation_rate_for_block(block_num);
  });
}

json_asset foundation::cpp_estimate_hive_collateral( const json_price& current_median_history, const json_price& current_min_history, const json_asset& hbd_amount_to_get ) const
{
  return cpp::safe_exception_wrapper([&]() -> json_asset {
    const hive::protocol::price _current_median_history { to_asset(current_median_history.base), to_asset(current_median_history.quote) };
    const hive::protocol::price _current_min_history { to_asset(current_min_history.base), to_asset(current_min_history.quote) };
    const hive::protocol::asset _hbd_amount_to_get = to_asset(hbd_amount_to_get);

    const hive::protocol::asset _hive = hive::protocol::hive_collateral::estimate_hive_collateral(_current_median_history, _current_min_history, _hbd_amount_to_get);

    return to_json_asset(_hive);
  });
}

json_asset foundation::cpp_evaluate_hbd_interest( const uint64_t hbd_seconds_low, const uint64_t hbd_seconds_high, const uint32_t head_block_time, const json_asset hbd, const uint32_t hbd_seconds_last_update,
                                                  const uint16_t hbd_interest_rate ) const
{
  return cpp::safe_exception_wrapper([&]() -> json_asset {
    fc::uint128_t hbd_seconds = fc::to_uint128(hbd_seconds_high, hbd_seconds_low);
    hive::protocol::HBD_asset _hbd( to_asset(hbd) );
    fc::time_point_sec _head_block_time = fc::time_point_sec(head_block_time);
    fc::time_point_sec _hbd_seconds_last_update = fc::time_point_sec(hbd_seconds_last_update);
    fc::uint128_t interest = hive::protocol::hbd_interest::evaluate_hbd_interest(&hbd_seconds, _head_block_time, _hbd, _hbd_seconds_last_update, hbd_interest_rate, true);
    hive::protocol::asset interest_paid(fc::uint128_to_uint64(interest), HBD_SYMBOL);
    return to_json_asset(interest_paid);
  });
}

bool foundation::cpp_is_valid_account_name( const std::string& name )const
{
  /// no cpp::safe_exception_wrapper as function does not throw.
  return hive::protocol::is_valid_account_name(name);
}

void foundation::cpp_tx_add_operation(hive_transaction_handle& tx_handle, const hive_operation_handle& op_handle)const
{
  return cpp::safe_exception_wrapper([&]() -> void {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");
    FC_ASSERT(op_handle.op, "Operation handle is not initialized");

    tx_handle.tx->operations.emplace_back(*op_handle.op);
  });
}

void foundation::cpp_tx_add_signature(hive_transaction_handle& tx_handle, const std::string& signature)const
{
  return cpp::safe_exception_wrapper([&]() -> void {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");

    hive::protocol::signature_type sig;
    fc::from_hex(signature, reinterpret_cast<char*>(&*sig.begin()), sig.size());

    tx_handle.tx->signatures.emplace_back(std::move(sig));
  });
}

void foundation::cpp_tx_set_expiration(hive_transaction_handle& tx_handle, const std::string& expiration)const
{
  return cpp::safe_exception_wrapper([&]() -> void {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");

    tx_handle.tx->expiration = fc::time_point_sec::from_iso_string(expiration);
  });
}

std::string foundation::cpp_legacy_tx_to_json(const std::string& tx_str)const
{
  return cpp::safe_exception_wrapper([&]() -> std::string {
    hive::protocol::signed_transaction tx;

    {
      hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::legacy);
      hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::legacy);

      fc::variant v = fc::json::from_string(tx_str, fc::json::format_validation_mode::full);
      fc::from_variant(v, tx);
    }

    return fc::json::to_string(tx);
  });
}

std::string foundation::cpp_tx_to_legacy_json(const hive_transaction_handle& tx_handle)const
{
  return cpp::safe_exception_wrapper([&]() -> std::string {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");

    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::legacy);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::legacy);

    return fc::json::to_string(*tx_handle.tx);
  });
}

std::string foundation::cpp_tx_to_binary(const hive_transaction_handle& tx_handle, bool use_hf26_serialization, bool strip_to_unsigned_transaction)const
{
  return cpp::safe_exception_wrapper([&]() -> std::string {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");

    return cpp::serialize_transaction(*tx_handle.tx, use_hf26_serialization, strip_to_unsigned_transaction);
  });
}

std::string foundation::cpp_op_to_binary(const hive_operation_handle& op_handle, bool use_hf26_serialization)const
{
  return cpp::safe_exception_wrapper([&]() -> std::string {
    FC_ASSERT(op_handle.op, "Operation handle is not initialized");

    return cpp::serialize_operation(*op_handle.op, use_hf26_serialization);
  });
}

std::string foundation::cpp_op_to_json(const hive_operation_handle& op_handle)const
{
  return cpp::safe_exception_wrapper([&]() -> std::string {
    FC_ASSERT(op_handle.op, "Operation handle is not initialized");

    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

    return fc::json::to_string(*op_handle.op);
  });
}

std::string foundation::cpp_tx_to_json(const hive_transaction_handle& tx_handle)const
{
  return cpp::safe_exception_wrapper([&]() -> std::string {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");

    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

    return fc::json::to_string(*tx_handle.tx);
  });
}

std::string foundation::cpp_tx_id(const hive_transaction_handle& tx_handle, bool use_hf26_serialization)const
{
  return cpp::safe_exception_wrapper([&]() -> std::string {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");

    return tx_handle.tx->id(use_hf26_serialization ? hive::protocol::serialization_type::hf26 : hive::protocol::serialization_type::legacy).str();
  });
}

binary_data foundation::cpp_tx_binary(const hive_transaction_handle& tx_handle, bool use_hf26_serialization, bool strip_to_unsigned_transaction)const
{
  return cpp::safe_exception_wrapper([&]() -> binary_data {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");

    return cpp::generate_binary_transaction_metadata(*tx_handle.tx, use_hf26_serialization, strip_to_unsigned_transaction);
  });
}

binary_data foundation::cpp_op_binary(const hive_operation_handle& op_handle, bool use_hf26_serialization)const
{
  return cpp::safe_exception_wrapper([&]() -> binary_data {
    FC_ASSERT(op_handle.op, "Operation handle is not initialized");

    return cpp::generate_binary_operation_metadata(*op_handle.op, use_hf26_serialization);
  });
}

foundation::required_authority_collection_t foundation::cpp_tx_required_authorities(const hive_transaction_handle& tx_handle)const
{
  return cpp::safe_exception_wrapper([&]() -> foundation::required_authority_collection_t {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");
    typedef flat_set<hive::protocol::account_name_type> raw_account_set;

    if (tx_handle.tx->operations.empty())
    {
      return foundation::required_authority_collection_t{};
    }

    raw_account_set active;
    raw_account_set owner;
    raw_account_set posting;
    raw_account_set witness;
    std::vector<hive::protocol::authority> other_authorities;
    tx_handle.tx->get_required_authorities(active, owner, posting, witness, other_authorities);

    foundation::required_authority_collection_t ret_val;
    using account_collection_t = typename foundation::required_authority_collection_t::account_collection_t;
    ret_val.posting_accounts = std::move(account_collection_t(posting.cbegin(), posting.cend()));
    ret_val.owner_accounts = std::move(account_collection_t(owner.cbegin(), owner.cend()));
    ret_val.active_accounts = std::move(account_collection_t(active.cbegin(), active.cend()));

    for(const auto& auth : other_authorities)
    {
      wax_authority wa;
      wa.weight_threshold = auth.weight_threshold;

      for(const auto& [account, weight] : auth.account_auths)
        wa.account_auths.emplace(account.operator std::string(), weight);

      for(const auto& [key, weight] : auth.key_auths)
        wa.key_auths.emplace(key.operator std::string(), weight);

      ret_val.other_authorities.emplace_back(wa);
    }

    return ret_val;
  });
}

foundation::required_authority_collection_t foundation::cpp_op_required_authorities(const hive_operation_handle& op_handle)const
{
  return cpp::safe_exception_wrapper([&]() -> foundation::required_authority_collection_t {
    FC_ASSERT(op_handle.op, "Operation handle is not initialized");
    typedef flat_set<hive::protocol::account_name_type> raw_account_set;

    raw_account_set active;
    raw_account_set owner;
    raw_account_set posting;
    raw_account_set witness;
    std::vector<hive::protocol::authority> other_authorities;
    hive::protocol::operation_get_required_authorities(*op_handle.op, active, owner, posting, witness, other_authorities);

    foundation::required_authority_collection_t ret_val;
    using account_collection_t = typename foundation::required_authority_collection_t::account_collection_t;
    ret_val.posting_accounts = std::move(account_collection_t(posting.cbegin(), posting.cend()));
    ret_val.owner_accounts = std::move(account_collection_t(owner.cbegin(), owner.cend()));
    ret_val.active_accounts = std::move(account_collection_t(active.cbegin(), active.cend()));

    for(const auto& auth : other_authorities)
    {
      wax_authority wa;
      wa.weight_threshold = auth.weight_threshold;

      for(const auto& [account, weight] : auth.account_auths)
        wa.account_auths.emplace(account.operator std::string(), weight);

      for(const auto& [key, weight] : auth.key_auths)
        wa.key_auths.emplace(key.operator std::string(), weight);

      ret_val.other_authorities.emplace_back(wa);
    }

    return ret_val;
  });
}

std::vector<std::string> foundation::cpp_tx_impacted_accounts(const hive_transaction_handle& tx_handle)const
{
  return cpp::safe_exception_wrapper([&]() -> std::vector<std::string> {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");

    std::vector<std::string> result;
    fc::flat_set<hive::protocol::account_name_type> impacted;
    for (const auto& op : tx_handle.tx->operations)
    {
      hive::app::operation_get_impacted_accounts(op, impacted);
    }
    result.insert( result.end(), impacted.begin(), impacted.end() );
    return result;
  });
}

std::vector<std::string> foundation::cpp_op_impacted_accounts(const hive_operation_handle& op_handle)const
{
  return cpp::safe_exception_wrapper([&]() -> std::vector<std::string> {
    FC_ASSERT(op_handle.op, "Operation handle is not initialized");

    std::vector<std::string> result;
    fc::flat_set<hive::protocol::account_name_type> impacted;
    hive::app::operation_get_impacted_accounts(*op_handle.op, impacted);
    result.insert( result.end(), impacted.begin(), impacted.end() );
    return result;
  });
}

std::vector<std::string> foundation::cpp_tx_signature_keys(const hive_transaction_handle& tx_handle, const std::string& chain_id, bool use_hf26_serialization)const
{
  return cpp::safe_exception_wrapper([&]() -> std::vector<std::string> {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");

    if (tx_handle.tx->signatures.empty())
    {
      return std::vector<std::string>{};
    }

    hive::protocol::digest_type sig_digest = tx_handle.tx->sig_digest(
      hive::protocol::chain_id_type{ chain_id },
      use_hf26_serialization ? hive::protocol::serialization_type::hf26 : hive::protocol::serialization_type::legacy
    );

    std::vector<std::string> result;
    for (const auto& sig : tx_handle.tx->signatures)
    {
      result.emplace_back(fc::ecc::public_key::to_base58_with_prefix(
        fc::ecc::public_key{ sig, sig_digest },
        HIVE_ADDRESS_PREFIX
      ));
    }
    return result;
  });
}

std::string foundation::cpp_tx_sig_digest(const hive_transaction_handle& tx_handle, const std::string& chain_id, bool use_hf26_serialization)const
{
  return cpp::safe_exception_wrapper([&]() -> std::string {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");

    hive::protocol::digest_type sig_digest = tx_handle.tx->sig_digest(
      hive::protocol::chain_id_type{ chain_id },
      use_hf26_serialization ? hive::protocol::serialization_type::hf26 : hive::protocol::serialization_type::legacy
    );

    return sig_digest.str();
  });
}

std::vector<std::string> foundation::cpp_collect_signing_keys(const hive_transaction_handle& tx_handle, retrieve_authorities_cb_t retrieve_authorities_cb, void* retrieve_authorities_fn) const
{
  return cpp::safe_exception_wrapper([&]() -> std::vector<std::string> {
    const auto& tx = tx_handle.get();
    signing_keys_collector::retrieve_authorities_t retrieve_authorities = [&](const std::vector<std::string>& accounts)
      {
        const auto wax_authorities_map = retrieve_authorities_cb(accounts, retrieve_authorities_fn);
        hive::protocol::authorities_map_t authorities_map;
        for (const auto& wax_authorities_info : wax_authorities_map)
        {
          signing_keys_collector::account_name_type account = wax_authorities_info.first;
          signing_keys_collector::authorities_t authorities = convert_wax_authorities_to_authorities(wax_authorities_info.second);
          authorities_map.emplace(account, std::move(authorities));
        }

        return authorities_map;
      };

    signing_keys_collector signing_keys_collector(retrieve_authorities);
    std::vector<std::string> result = signing_keys_collector.collect_signing_keys(tx);

    return result;
    });
}

std::vector<std::string> foundation::cpp_minimize_required_signatures(const hive_transaction_handle& tx_handle, const minimize_required_signatures_data_t& minimize_required_signatures_data) const
{
  return cpp::safe_exception_wrapper([&]() -> std::vector<std::string> {
    const auto& tx = tx_handle.get();
    hive::protocol::authorities_map_t authorities_map;
    for (const auto& wax_authorities_info : minimize_required_signatures_data.authorities_map)
    {
      hive::protocol::account_name_type account = wax_authorities_info.first;
      hive::protocol::authorities_t authorities = convert_wax_authorities_to_authorities(wax_authorities_info.second);
      authorities_map.emplace(account, std::move(authorities));
    }

    auto result = minimize_required_signatures_helper::minimize_required_signatures(
      tx, minimize_required_signatures_data.chain_id, minimize_required_signatures_data.available_keys, authorities_map,
      minimize_required_signatures_data.get_witness_key_cb, minimize_required_signatures_data.get_witness_key_fn,
      minimize_required_signatures_data.max_recursion, minimize_required_signatures_data.max_membership, minimize_required_signatures_data.max_account_auths,
      minimize_required_signatures_data.allow_strict_and_mixed_authorities);

    return result;
    });
}

void foundation::cpp_tx_validate(const hive_transaction_handle& tx_handle)const
{
  return cpp::safe_exception_wrapper([&]() -> void {
    FC_ASSERT(tx_handle.tx, "Transaction handle is not initialized");

    tx_handle.tx->validate();
  });
}

void foundation::cpp_op_validate(const hive_operation_handle& op_handle)const
{
  return cpp::safe_exception_wrapper([&]() -> void {
    FC_ASSERT(op_handle.op, "Operation handle is not initialized");

    hive::protocol::operation_validate(*op_handle.op);
  });
}

void foundation::cpp_deserialize_hive_tx(const std::string& hex, hive_tx* storage)const
{
  return cpp::safe_exception_wrapper([&]() -> void {
    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

    std::vector<char> raw_data(hex.size());
    fc::from_hex(hex, raw_data.data(), raw_data.size());

    fc::raw::unpack_from_char_array(raw_data.data(), static_cast<uint32_t>(raw_data.size()), *storage, 0);
  });
}
cpp::hive_operation_handle foundation::cpp_deserialize_operation(std::string hex)const
{
  return cpp::safe_exception_wrapper([&]() -> cpp::hive_operation_handle {
    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

    std::vector<char> raw_data(hex.size());
    fc::from_hex(hex, raw_data.data(), raw_data.size());

    hive::protocol::operation obj;
    fc::raw::unpack_from_char_array(raw_data.data(), static_cast<uint32_t>(raw_data.size()), obj, 0);

    cpp::hive_operation_handle h;
    h.op.reset(new cpp::hive_op(std::move(obj)));

    return h;
  });
}

} /// namespace cpp

// Instead of specifying the custom pack/unpack functions for the cpp::json_asset and cpp::price types,
// we are using the ones for hive::protocol::asset and hive::protocol::price

// WARNING this serialization primitives are used atm only in context of witness_set_properties operation.
namespace fc { namespace raw {
  template<typename Stream>
  inline void pack( Stream& s, const cpp::json_asset& u )
  {
    const auto actualAsset = cpp::to_asset(u);

    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

    pack(s, actualAsset);
  }

  template<typename Stream>
  inline void unpack( Stream& s, cpp::json_asset& u, uint32_t d, bool limit_is_disabled )
  {
    hive::protocol::asset tmp;

    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

    unpack(s, tmp, d + 1, limit_is_disabled);
    u = cpp::to_json_asset(tmp);
  }

  template<typename Stream>
  inline void pack( Stream& s, const cpp::json_price& u )
  {
    hive::protocol::price actualPrice { cpp::to_asset(u.base), cpp::to_asset(u.quote) };

    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);
    pack(s, actualPrice);
  }

  template<typename Stream>
  inline void unpack( Stream& s, cpp::json_price& u, uint32_t d, bool limit_is_disabled )
  {
    hive::protocol::price tmp;
    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

    unpack(s, tmp, d + 1, limit_is_disabled);
    u = { .base = cpp::to_json_asset(tmp.base), .quote = cpp::to_json_asset(tmp.quote) };
  }
} }

// Note: This differs from the hive::protocol::asset struct in that it uses a string for the amount
FC_REFLECT( cpp::json_asset, (amount)(precision)(nai) );
FC_REFLECT( cpp::json_price, (base)(quote) );

