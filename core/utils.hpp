#pragma once

#include "core/exception.hpp"
#include "core/types.hpp"

#include "fc/exception/exception.hpp"

#include <exception>
#include <functional>
#include <stdexcept>

namespace cpp
{

using callback = std::function<void(result&)>;

static result method_wrapper(callback&& method)
{
  result _result;

  try
  {
    method(_result);
  }
  catch (fc::exception& e)
  {
    _result.exception_message = e.to_detail_string();
    _result.value = fail;
  }
  catch (const std::exception& e)
  {
    _result.exception_message = e.what();
    _result.value = fail;
  }
  catch (...)
  {
    _result.exception_message = "Unknown exception.";
    _result.value = fail;
  }

  return _result;
}

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
    wlog("Caught fc::assert_exception: ${details}", ("details", e.to_detail_string()));
    uint64_t unrecognized_assertion_code = throw_appropriate_wax_assertion( e );
    throw wax_unknown_assertion( unrecognized_assertion_code, e );
  }
  catch (fc::exception& e)
  {
    wlog("Caught fc::exception: ${details}", ("details", e.to_detail_string()));
    throw std::runtime_error(e.to_detail_string());
  }
  catch (const std::exception& e)
  {
    wlog("Caught std::exception: ${details}", ("details", e.what()));
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
        wlog("Caught std::exception: ${details}", ("details", ex.what()));
        throw;
      }
      catch (...)
      {
        wlog("Caught nonstandard exception");
        throw std::runtime_error("Nonstanard exception");
      }
    }
    else
    {
      wlog("Caught unknown exception");
      throw std::runtime_error("Unknown exception.");
    }
  }
}

} /// namespace cpp

