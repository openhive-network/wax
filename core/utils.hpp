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

} /// namespace cpp

