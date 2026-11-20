#include "core/utils.hpp"

#include <boost/lexical_cast.hpp>
#include <fc/io/json.hpp>

#include <algorithm>
#include <array>
#include <cstddef>
#include <string>
#include <utility>

#ifdef __EMSCRIPTEN__
#include <emscripten/val.h>
#endif

namespace cpp {

namespace {

constexpr bool is_same_category( const char* a, const char* b )
{
  while( *a != '\0' && *a == *b )
  {
    ++a;
    ++b;
  }
  return *a == *b;
}

/// Counts per category the generated lines `container.insert( std::make_pair( hash, "category") );`.
struct assertion_hash_counter
{
  size_t protocol = 0;
  size_t chain = 0;

  constexpr void insert( const std::pair< unsigned long long, const char* >& entry )
  {
    if( is_same_category( entry.second, "protocol" ) )
      ++protocol;
    else if( is_same_category( entry.second, "chain" ) )
      ++chain;
  }
};

constexpr assertion_hash_counter count_assertion_hashes()
{
  assertion_hash_counter container;
#include "protocol_assertion_hashes_wax.inl"
#include "chain_assertion_hashes_wax.inl"
  return container;
}

constexpr assertion_hash_counter assertion_hash_count = count_assertion_hashes();

/// The hashes of the generated lines per category, filled at compile time: constant tables instead of a map filled
/// by hundreds of inserts at the first exception.
struct assertion_hash_tables
{
  std::array< uint64_t, assertion_hash_count.protocol > protocol{};
  std::array< uint64_t, assertion_hash_count.chain > chain{};
  size_t protocol_size = 0;
  size_t chain_size = 0;

  constexpr void insert( const std::pair< unsigned long long, const char* >& entry )
  {
    if( is_same_category( entry.second, "protocol" ) )
      protocol[ protocol_size++ ] = entry.first;
    else if( is_same_category( entry.second, "chain" ) )
      chain[ chain_size++ ] = entry.first;
  }
};

constexpr assertion_hash_tables build_assertion_hash_tables()
{
  assertion_hash_tables container;
#include "protocol_assertion_hashes_wax.inl"
#include "chain_assertion_hashes_wax.inl"
  return container;
}

constexpr assertion_hash_tables assertion_hashes = build_assertion_hash_tables();

template< size_t N >
bool contains( const std::array< uint64_t, N >& hashes, uint64_t hash )
{
  return std::find( hashes.begin(), hashes.end(), hash ) != hashes.end();
}

} /// namespace

[[noreturn]] static void classify_and_rethrow_current_exception()
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

#ifdef __EMSCRIPTEN__
/** Names the current exception by catching it by type: the types `classify_and_rethrow_current_exception` and
    `foundation::cpp_transform_api_error_response_into_exception` throw, derived classes before their bases.
*/
static std::pair<std::string, std::string> describe_current_exception()
{
  try
  {
    std::rethrow_exception(std::current_exception());
  }
  catch (const wax_protocol_assertion& e)  { return { "cpp::wax_protocol_assertion", e.what() }; }
  catch (const wax_chain_assertion& e)     { return { "cpp::wax_chain_assertion", e.what() }; }
  catch (const wax_api_assertion& e)       { return { "cpp::wax_api_assertion", e.what() }; }
  catch (const wax_unknown_assertion& e)   { return { "cpp::wax_unknown_assertion", e.what() }; }
  catch (const wax_assertion& e)           { return { "cpp::wax_assertion", e.what() }; }
  catch (const wax_private_key_leak& e)    { return { "cpp::wax_private_key_leak", e.what() }; }
  catch (const boost::bad_lexical_cast& e) { return { "boost::bad_lexical_cast", e.what() }; }
  catch (const std::runtime_error& e)      { return { "std::runtime_error", e.what() }; }
  catch (const std::exception& e)          { return { "std::exception", e.what() }; }
  catch (...)                              { return { "unknown", "Nonstandard exception" }; }
}

[[noreturn]] void throw_current_exception_to_js()
{
  const auto [name, message] = describe_current_exception();
  emscripten::val error = emscripten::val::global("Error").new_(emscripten::val(message));
  error.set("cppExceptionName", emscripten::val(name));
  error.throw_();
}
#endif

[[noreturn]] void safe_exception_handler()
{
#ifdef __EMSCRIPTEN__
  try
  {
    classify_and_rethrow_current_exception();
  }
  catch (...)
  {
    throw_current_exception_to_js();
  }
#else
  classify_and_rethrow_current_exception();
#endif
}

uint64_t throw_recognized_wax_assertion( fc::assert_exception& e )
{
  auto ae = e.get_extension( FC_ASSERT_EXPRESSION_KEY );
  uint64_t assertion_code = fc::exception::hash_expr( ae );

  /// protocol first: in the former map the first insert of a hash won, and the protocol list was inserted first
  if( contains( assertion_hashes.protocol, assertion_code ) )
  {
    //wlog("Throwing recognized wax_protocol_assertion ${assertion_code}", (assertion_code));
    throw wax_protocol_assertion( assertion_code, e );
  }
  if( contains( assertion_hashes.chain, assertion_code ) )
  {
    //wlog("Throwing recognized wax_chain_assertion ${assertion_code}", (assertion_code));
    throw wax_chain_assertion( assertion_code, e );
  }
  // TODO: Add an "api" table once API assertions are recognized (throw wax_api_assertion).

  // Let unrecognized assertion to be thrown outside.
  return assertion_code;
}

} /// namespace cpp