#pragma once

#include<string>

#include "core/foundation.hpp"
#include "core/protocol_impl.hpp"
#include "core/protobuf_protocol_impl.hpp"
#include "core/retrieve_authorities_wrapper.hpp"

namespace cpp
{
 
  ///  Interface providing Hive protocol functionality operating on Hive native JSON format.
  class protocol : public protocol_impl<foundation> {};

  ///  Interface providing Hive protocol functionality operating on Protobuf specific JSON format.
  class proto_protocol : public proto_protocol_impl<foundation> {};

  extern template class protocol_impl<foundation>;
  extern template class proto_protocol_impl<foundation>;

} /// namespace cpp

