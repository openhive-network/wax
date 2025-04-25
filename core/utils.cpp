#include "core/utils.hpp"

namespace cpp {

using assertion_id_data_container_t = std::map< uint64_t, std::string >;

assertion_id_data_container_t init_assertion_data()
{
  assertion_id_data_container_t container;
  //container.insert( std::make_pair( 2247020312206164887ull, "protocol") );

  // TODO: Add remaining generated inlines or replace the code with general solution.
#include "protocol_assertion_hashes_wax.inl"

  return container;
}

void throw_appropriate_wax_assertion( fc::assert_exception& e )
{
  static assertion_id_data_container_t assertion_data( init_assertion_data() );
  auto ae = e.get_extension( FC_ASSERT_EXPRESSION_KEY );
  uint64_t assertion_code = fc::exception::hash_expr( ae );
  
  const auto it = assertion_data.find( assertion_code );
  if( it ==  assertion_data.end() )
    throw wax_unknown_assertion( assertion_code, e );
  else
  {
    if( it->second == "protocol" )
    {
      throw wax_protocol_assertion( assertion_code, e );
    }
    else if( it->second == "chain" )
    {
      throw wax_chain_assertion( assertion_code, e );
    }
    else if( it->second == "api" )
    {
      throw wax_api_assertion( assertion_code, e );
    }
    else
      throw wax_unknown_assertion( assertion_code, e );
  }
}

} /// namespace cpp