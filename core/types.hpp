#pragma once

#include <cstdint>
#include <string>

namespace cpp {

enum error_code { fail = 0, ok = 1 };

struct result
{
  error_code value = error_code::ok;

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

struct ref_block_data
{
  uint16_t ref_block_num;
  uint32_t ref_block_prefix;
};

} /// namespace cpp
