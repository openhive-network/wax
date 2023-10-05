#include "cpython_interface.hpp"

#include "core/protocol_impl.inl"
#include "core/protobuf_protocol_impl.inl"

namespace cpp
{

template class protocol_impl<foundation>;
template class proto_protocol_impl<foundation>;

} // namespace cpp
