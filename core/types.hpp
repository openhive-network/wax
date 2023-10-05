#pragma once

#include <string>

namespace cpp {

enum error_code { fail = 0, ok = 1 };

struct result
{
  error_code value = error_code::fail;

  std::string content;
  std::string exception_message;

  result() noexcept = default;
};

struct json_asset
{
  std::string amount;
  uint32_t precision; // XXX: is uint64_t actually
  std::string nai;
};

} /// namespace cpp
