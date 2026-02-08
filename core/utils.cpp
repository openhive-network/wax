#include "core/utils.hpp"

#include <boost/lexical_cast.hpp>
#include <fc/io/json.hpp>

namespace cpp {

using assertion_id_data_container_t = std::map< uint64_t, std::string >;

assertion_id_data_container_t init_assertion_data()
{
  assertion_id_data_container_t container;
  //container.insert( std::make_pair( 2247020312206164887ull, "protocol") );

  // TODO: Add remaining generated inlines or replace the code with general solution.
#include "protocol_assertion_hashes_wax.inl"
#include "chain_assertion_hashes_wax.inl"

  return container;
}

[[noreturn]] void safe_exception_handler()
{
  std::exception_ptr eptr = std::current_exception();
  try
  {
    std::rethrow_exception(eptr);
  }
  catch (fc::assert_exception& e)
  {
    WAX_EXCEPTION_WLOG("Caught fc::assert_exception: ${details}", ("details", e.to_detail_string()));
    uint64_t unrecognized_assertion_code = throw_recognized_wax_assertion( e );
    throw wax_unknown_assertion( unrecognized_assertion_code, e );
  }
  catch (fc::exception& e)
  {
    WAX_EXCEPTION_WLOG("Caught fc::exception: ${details}", ("details", e.to_detail_string()));
    throw std::runtime_error(e.to_detail_string());
  }
  catch (const wax_private_key_leak& e)
  {
    /// warning until emscripten/wasm bug will be fixed do not rethrow: https://gitlab.syncad.com/hive/wax/-/issues/161#note_252570
    /// since this exception class is quite important to propagate to client side it should be not erased
    /// during std::exception handling
    throw e;
  }
  catch (const boost::bad_lexical_cast& e)
  {
    /// Preserve type to avoid breaking client code that matches on this exception type.
    throw e;
  }
  catch (const std::exception& e)
  {
    WAX_EXCEPTION_WLOG("Caught std::exception: ${details}", ("details", e.what()));
    /// warning until emscripten/wasm bug will be fixed do not rethrow: https://gitlab.syncad.com/hive/wax/-/issues/161#note_252570
    throw std::runtime_error(e.what());
  }
  catch (...)
  {
    WAX_EXCEPTION_WLOG("Caught nonstandard exception");
    throw std::runtime_error("Nonstandard exception");
  }
}

uint64_t throw_recognized_wax_assertion( fc::assert_exception& e )
{
  static assertion_id_data_container_t assertion_data( init_assertion_data() );
  auto ae = e.get_extension( FC_ASSERT_EXPRESSION_KEY );
  uint64_t assertion_code = fc::exception::hash_expr( ae );
  
  const auto it = assertion_data.find( assertion_code );
  if( it !=  assertion_data.end() )
  {
    if( it->second == "protocol" )
    {
      //wlog("Throwing recognized wax_protocol_assertion ${assertion_code}", (assertion_code));
      throw wax_protocol_assertion( assertion_code, e );
    }
    else if( it->second == "chain" )
    {
      //wlog("Throwing recognized wax_chain_assertion ${assertion_code}", (assertion_code));
      throw wax_chain_assertion( assertion_code, e );
    }
    // TODO: Uncomment once API assertions are recognized.
    /*else if( it->second == "api" )
    {
      //wlog("Throwing recognized wax_api_assertion ${assertion_code}", (assertion_code));
      throw wax_api_assertion( assertion_code, e );
    }*/
  }

  // Let unrecognized assertion to be thrown outside.
  return assertion_code;
}

} /// namespace cpp