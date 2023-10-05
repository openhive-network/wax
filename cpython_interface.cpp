#include "cpython_interface.hpp"

#include <hive/protocol/types.hpp>

#include <boost/preprocessor/variadic/to_seq.hpp>
#include <boost/preprocessor/seq/enum.hpp>
#include <boost/preprocessor/seq/transform.hpp>

#include <fc/io/json.hpp>

#include <iostream>
#include <string>

namespace cpp
{
  void log( const std::string& message )
  {
    std::cout<< message << std::endl;
  }


} // namespace cpp