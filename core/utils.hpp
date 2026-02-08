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
  #define WAX_EXCEPTION_WLOG( FORMAT, ...) wlog( FORMAT, __VA_ARGS__ )
#else
  #define WAX_EXCEPTION_ILOG( FORMAT, ...) /* nothing */
  #define WAX_EXCEPTION_WLOG( FORMAT, ...) /* nothing */
#endif /// WAX_EXCEPTION_LOGGING

namespace cpp
{
uint64_t throw_recognized_wax_assertion( fc::assert_exception& e );

/** Classifies the current exception and re-throws it as a type safely handled by Python/WASM runtimes.
    Defined in utils.cpp to avoid duplicating exception handling code across template instantiations.
*/
[[noreturn]] void safe_exception_handler();

/** Allows to wrap given function call into exception handler which at most throw std::exception (safely handled by Python/WASM runtimes)
*/
template <typename ProcessorFn, typename... Args>
static decltype(auto) safe_exception_wrapper(ProcessorFn fn, Args&&... args)
{
  try
  {
    return fn(std::forward<Args>(args)...);
  }
  catch (...)
  {
    safe_exception_handler();
  }
}

} /// namespace cpp

