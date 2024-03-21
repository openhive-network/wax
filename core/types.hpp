#pragma once

#include <set>
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
  uint32_t    precision=0;
  std::string nai;

  json_asset() = default;
  json_asset(const std::string& _amount, uint32_t _precision, const std::string& _nai)
    : amount(_amount), precision(_precision), nai(_nai) {}
};

struct crypto_memo
{
  std::string from;
  std::string to;
  std::string content;

  crypto_memo() = default;
  crypto_memo(const std::string& from, const std::string& to, const std::string& content)
    : from(from), to(to), content(content) {}
};

struct ref_block_data
{
  uint16_t ref_block_num;
  uint32_t ref_block_prefix;
};

struct required_authority_collection
{
  typedef std::set<std::string> account_set;

  account_set posting_accounts;
  account_set active_accounts;
  account_set owner_accounts;

  /** TODO: Additionally we need to collect here also other required authority based entries, according to `void transaction::get_required_authorities` interface
  *   It is hard to do atm since we don't have representation of authority and pointing it directly can be troublesome.
  */
  /// std::vector<authority> other_authorities;
};

} /// namespace cpp
