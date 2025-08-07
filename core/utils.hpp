#pragma once

#include "core/exception.hpp"
#include "core/types.hpp"

#include "fc/exception/exception.hpp"

#include <exception>
#include <functional>
#include <stdexcept>

//#define WAX_EXCEPTION_LOGGING
#ifdef WAX_EXCEPTION_LOGGING
  #define WAX_EXCEPTION_ILOG( FORMAT, ...) ilog( FORMAT, __VA_ARGS__ )
  #define WAX_EXCEPTION_WLOG( FORMAT, ...) WAX_EXCEPTION_WLOG( FORMAT, __VA_ARGS__ )
#else
  #define WAX_EXCEPTION_ILOG( FORMAT, ...) /* nothing */
  #define WAX_EXCEPTION_WLOG( FORMAT, ...) /* nothing */
#endif /// VAL_PROTOCOL_LOGGING

namespace cpp
{
uint64_t throw_appropriate_wax_assertion( fc::assert_exception& e );

/** Allows to wrap given function call into exception handler which at most throw std::exception (safely handled by Python/WASM runtimes)
*/
template <typename ProcessorFn, typename... Args>
static decltype(auto) safe_exception_wrapper(ProcessorFn fn, Args&&... args)
{
  try
  {
    return fn(std::forward<Args>(args)...);
  }
  catch (fc::assert_exception& e)
  {
    WAX_EXCEPTION_WLOG("Caught fc::assert_exception: ${details}", ("details", e.to_detail_string()));
    uint64_t unrecognized_assertion_code = throw_appropriate_wax_assertion( e );
    throw wax_unknown_assertion( unrecognized_assertion_code, e );
  }
  catch (fc::exception& e)
  {
    WAX_EXCEPTION_WLOG("Caught fc::exception: ${details}", ("details", e.to_detail_string()));
    throw std::runtime_error(e.to_detail_string());
  }
  catch (const std::exception& e)
  {
    WAX_EXCEPTION_WLOG("Caught std::exception: ${details}", ("details", e.what()));
    throw;
  }
  catch (...)
  {
    std::exception_ptr e = std::current_exception();
    if(e)
    {
      try
      {
        /// give it last chance to be recognized
        std::rethrow_exception(e);
      }
      catch (const std::exception& ex)
      {
        WAX_EXCEPTION_WLOG("Caught std::exception: ${details}", ("details", ex.what()));
        throw;
      }
      catch (...)
      {
        WAX_EXCEPTION_WLOG("Caught nonstandard exception");
        throw std::runtime_error("Nonstanard exception");
      }
    }
    else
    {
      WAX_EXCEPTION_WLOG("Caught unknown exception");
      throw std::runtime_error("Unknown exception.");
    }
  }
}

} /// namespace cpp

