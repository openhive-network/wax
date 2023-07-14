#include "cpython_interface.hpp"
#include "hive/libraries/chain/include/hive/chain/util/manabar.hpp"

#include <hive/protocol/types.hpp>
#include <hive/protocol/operations.hpp>
#include <hive/protocol/transaction.hpp>

#include <fc/io/json.hpp>

#include <iostream>
#include <string>

namespace cpp
{
  void log( const std::string& message )
  {
    std::cout<< message << std::endl;
  }

  struct validate_visitor
  {
    typedef void result_type;

    template< typename T >
    void operator()( const T& x )
    {
      x.validate();
    }
  };

  result protocol::method_wrapper( callback&& method )
  {
    result _result;

    try
    {
      method( _result );
      _result.value = ok;
    }
    catch( fc::exception& e )
    {
      _result.exception_message = e.to_detail_string();
    }
    catch( const std::exception& e )
    {
      _result.exception_message = e.what();
    }
    catch(...)
    {
      _result.exception_message = "Unknown exception.";
    }

    return _result;
  }

  hive::protocol::transaction get_transaction(const std::string& trx)
  {
    return fc::json::from_string( trx ).as<hive::protocol::transaction>();
  }

  result protocol::cpp_validate_operation( const std::string& operation )
  {
    return method_wrapper([&]( result& )
    {
      fc::variant _v = fc::json::from_string( operation );
      hive::protocol::operation _operation = _v.as<hive::protocol::operation>();

      validate_visitor _visitor;
      _operation.visit( _visitor );
    });
  };

  result protocol::cpp_validate_transaction( const std::string& transaction )
  {
    return method_wrapper([&]( result& )
    {
      get_transaction(transaction).validate();
    });
  }

  result protocol::cpp_calculate_digest( const std::string& transaction, const std::string& chain_id )
  {
    return method_wrapper([&]( result& _result )
    {
      const auto _transaction = get_transaction(transaction);
      const auto _digest = _transaction.sig_digest( hive::protocol::chain_id_type( chain_id ), hive::protocol::pack_type::hf26 );

      _result.content = _digest.str();
    });
  }

  result protocol::cpp_serialize_transaction( const std::string& transaction )
  {
    return method_wrapper([&]( result& _result )
    {
      hive::protocol::serialization_mode_controller::mode_guard guard( hive::protocol::transaction_serialization_type::hf26 );
      hive::protocol::serialization_mode_controller::set_pack( hive::protocol::transaction_serialization_type::hf26 );

      const auto _transaction = get_transaction(transaction);
      const auto _packed = fc::to_hex( fc::raw::pack_to_vector( _transaction ) );
      _result.content = std::string( _packed.data(), _packed.size() );
    });
  }

  result protocol::cpp_generate_private_key()
  {
    return method_wrapper([&](result& _result){
      _result.content = fc::ecc::private_key::generate().key_to_wif();
    });
  }

  result protocol::cpp_calculate_public_key( const std::string& wif )
  {
    return method_wrapper([&](result& _result){
      const auto private_key = fc::ecc::private_key::wif_to_key(wif);
      FC_ASSERT(private_key.valid(), "given string is not valid private key");
      _result.content = fc::ecc::public_key::to_base58( private_key->get_public_key(), false/*is_sha256*/ );
    });
  }

  int64_t __current_manabar(const int32_t now, const int64_t max_mana, const int64_t current_mana, const int32_t last_update_time)
  {
    using namespace hive::chain::util;
    const manabar_params params{max_mana, HIVE_RC_REGEN_TIME};
    manabar manabar{current_mana, last_update_time};
    manabar.regenerate_mana(params, now);
    return manabar.current_mana;
  }

  result protocol::cpp_calculate_manabar_full_regeneration_time( const int32_t now, const int64_t max_mana, const int64_t current_mana, const int32_t last_update_time )
  {
    // safe is used because of detected issue with overflow
    using safe_uint128_t = fc::safe<fc::uint128_t>;

    return method_wrapper([&](result& _result){
      const safe_uint128_t hive_rc_regen_time{ HIVE_RC_REGEN_TIME };
      const safe_uint128_t safe_max_mana{ max_mana };
      const safe_uint128_t safe_now{ now };

      const safe_uint128_t mana = __current_manabar(now, max_mana, current_mana, last_update_time);
      const safe_uint128_t time_to_regenerate_missing_mana = (safe_max_mana - mana) * hive_rc_regen_time / max_mana;

      _result.content = std::to_string((safe_now + time_to_regenerate_missing_mana).value);
    });
  }

  result protocol::cpp_calculate_current_manabar_value(const int32_t now, const int64_t max_mana, const int64_t current_mana, const int32_t last_update_time) {
    return method_wrapper([&](result &_result) {
      _result.content = std::to_string(__current_manabar(now, max_mana, current_mana, last_update_time));
    });
  }

} // namespace cpp
