#pragma once

// rust_protocol — analogous to cpp::protocol (python/wax/cpython_interface.hpp)
// and foundation_wasm (ts/wasm/src/foundation_wasm.hpp): a subclass of
// cpp::foundation that knows how to ingest a language-native protobuf
// payload (here, a rust::Box<RustManagedObject>) and forward it to the
// existing core/ visitor pipeline.
//
// This header is the bridge contract. The implementation lives in
// src/cpp/rust_protocol.cpp and is only compiled when the `with_cpp_core`
// cargo feature is on (it depends on core/foundation.hpp, which transitively
// pulls in hive_protocol/fc/boost — the same build prerequisites Python and
// TS already satisfy).

#include "rust/cxx.h"
#include "rust_managed_object.hpp"
#include "core/foundation.hpp"

#include <memory>

namespace cpp {

class rust_protocol : public foundation
{
public:
  rust_protocol() = default;

  std::unique_ptr<hive_operation_handle>   cpp_create_operation_handle  (::rust::Box<RustManagedObject> obj) const;
  std::unique_ptr<hive_transaction_handle> cpp_create_transaction_handle(::rust::Box<RustManagedObject> obj) const;

  void cpp_tx_add_operation(hive_transaction_handle& tx, const hive_operation_handle& op) const;
};

std::unique_ptr<rust_protocol> new_rust_protocol();

} // namespace cpp
