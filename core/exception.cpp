#include "core/exception.hpp"

#include <fc/exception/exception.hpp>
#include <fc/io/json.hpp>

namespace {

std::string get_assertion_as_json(const fc::assert_exception& e)
{
  fc::variant ev;
  fc::to_variant(*(dynamic_cast<const fc::exception*>(&e)), ev);
  std::string assertion_as_json = fc::json::to_string(ev);
  return assertion_as_json;
}

}
namespace cpp {

wax_assertion::wax_assertion( uint64_t assertion_code, const fc::assert_exception& e ) :
  std::runtime_error( get_assertion_as_json(e) ),
  _assertion_code( assertion_code ),
  _original_exception( e.dynamic_copy_exception() )
{}

} /// namespace cpp