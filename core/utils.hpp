#pragma once

#include <exception>
#include <functional>

#include <fc/exception/exception.hpp>

namespace cpp
{

using callback = std::function<void(result&)>;

static result method_wrapper(callback&& method)
{
  result _result;

  try
  {
    method(_result);
    _result.value = ok;
  }
  catch (fc::exception& e)
  {
    _result.exception_message = e.to_detail_string();
  }
  catch (const std::exception& e)
  {
    _result.exception_message = e.what();
  }
  catch (...)
  {
    _result.exception_message = "Unknown exception.";
  }

  return _result;
}

} /// namespace cpp

