#include "core/exception.hpp"

#include <fc/exception/exception.hpp>
#include <fc/io/json.hpp>

namespace {

std::string get_assertion_as_json(const fc::assert_exception& e)
{
  try {
    fc::variant ev;
    fc::to_variant(e, ev);
    std::string assertion_as_json = fc::json::to_string(ev);
    return assertion_as_json;
  }
  catch (const fc::exception& e)
  {
    throw std::runtime_error(std::string("Unexpected fc::exception caught while serializing fc::assert_exception: ") + e.to_detail_string());
  }
}

}
namespace cpp {

wax_assertion::wax_assertion( uint64_t assertion_code, const fc::assert_exception& e ) :
  std::runtime_error( get_assertion_as_json(e) ),
  _assertion_code( assertion_code ),
  _original_exception( e.dynamic_copy_exception() )
{}

} /// namespace cpp