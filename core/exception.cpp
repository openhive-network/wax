#include "core/exception.hpp"

#include <fc/exception/exception.hpp>

namespace cpp {

wax_assertion::wax_assertion( uint64_t assertion_code, const fc::assert_exception& e ) :
  std::runtime_error( e.to_detail_string() ), 
  _assertion_code( assertion_code ),
  _original_exception( e.dynamic_copy_exception() )
{}

} /// namespace cpp