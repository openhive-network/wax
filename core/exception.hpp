#pragma once

#include <memory>
#include <stdexcept>

namespace fc {
  class assert_exception;
  class exception;
}

namespace cpp {

class wax_assertion : public std::runtime_error
{
public:
  wax_assertion( uint64_t assertion_code, const fc::assert_exception& e );

  uint64_t get_assertion_code() const { return _assertion_code; }
private:
  uint64_t                        _assertion_code = 0ull;
  std::shared_ptr<fc::exception>  _original_exception;
};

class wax_protocol_assertion : public wax_assertion
{
public:
  using wax_assertion::wax_assertion;
};

class wax_chain_assertion : public wax_assertion
{
public:
  using wax_assertion::wax_assertion;
};

class wax_api_assertion : public wax_assertion
{
public:
  using wax_assertion::wax_assertion;
};

class wax_unknown_assertion : public wax_assertion
{
public:
  using wax_assertion::wax_assertion;
};

} /// namespace cpp
