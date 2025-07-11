#include "core/utils.hpp"

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