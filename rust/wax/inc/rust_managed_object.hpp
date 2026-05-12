#pragma once

// rust_managed_object — C++ adapter that lets core/ visitors (val_protocol,
// proto_converter, api_converter) walk a Rust-owned protobuf payload.
//
// The actual data lives in Rust as a prost_reflect::DynamicMessage wrapped
// in a RustManagedObject. This class holds it via rust::Box<RustManagedObject>
// and forwards every call back into Rust through the cxx-generated `rmo_*`
// shim functions. Surface matches python_managed_object so the templated
// visitors in core/ instantiate identically.

#include "rust/cxx.h"
#include "wax/src/lib.rs.h"

#include <cstdint>
#include <optional>
#include <string>
#include <vector>

namespace cpp {

class rust_managed_object
{
public:
  // Default-constructed instance is "undefined" — mirrors python_managed_object's
  // py_object_ptr::take(nullptr) case. rust::Box<T> is non-nullable, so we hold
  // it in a std::optional to represent the empty slot.
  rust_managed_object() = default;

  explicit rust_managed_object(::rust::Box<RustManagedObject> obj)
    : obj_(std::move(obj))
  {}

  rust_managed_object(const rust_managed_object&) = delete;
  rust_managed_object& operator=(const rust_managed_object&) = delete;
  rust_managed_object(rust_managed_object&&) = default;
  rust_managed_object& operator=(rust_managed_object&&) = default;

  rust_managed_object operator[](const char* key) const
  {
    return rust_managed_object(rmo_get_field(borrow(), ::rust::Str(key)));
  }

  rust_managed_object operator[](const std::string& key) const
  {
    return (*this)[key.c_str()];
  }

  rust_managed_object operator[](std::size_t idx) const
  {
    return rust_managed_object(rmo_get_index(borrow(), idx));
  }

  rust_managed_object operator[](int idx) const
  {
    return (*this)[static_cast<std::size_t>(idx)];
  }

  std::size_t array_length() const { return rmo_array_length(borrow()); }
  bool is_undefined() const        { return !obj_.has_value() || rmo_is_undefined(borrow()); }
  bool is_string() const           { return obj_.has_value() && rmo_is_string(borrow()); }

  bool is_optional_field_present(const char* name) const
  {
    return obj_.has_value() && rmo_is_optional_field_present(borrow(), ::rust::Str(name));
  }

  std::string get_underlying_sv_type() const
  {
    return static_cast<std::string>(rmo_oneof_variant(borrow()));
  }

  std::vector<std::string> get_map_keys() const
  {
    auto keys = rmo_map_keys(borrow());
    std::vector<std::string> out;
    out.reserve(keys.size());
    for (auto& k : keys)
      out.emplace_back(static_cast<std::string>(k));
    return out;
  }

  // Conversion accessors — match python_managed_object::as<T>(out).
  template<typename T> T as() const { T out; as(out); return out; }

  void as(std::string& out) const { out = static_cast<std::string>(rmo_as_string(borrow())); }
  void as(bool& out)        const { out = rmo_as_bool(borrow()); }
  void as(std::int64_t& out)const { out = rmo_as_i64(borrow()); }
  void as(std::int32_t& out)const { out = rmo_as_i32(borrow()); }
  void as(std::int16_t& out)const { out = rmo_as_i16(borrow()); }
  void as(std::int8_t& out) const { out = rmo_as_i8(borrow()); }
  void as(std::uint64_t& out)const{ out = rmo_as_u64(borrow()); }
  void as(std::uint32_t& out)const{ out = rmo_as_u32(borrow()); }
  void as(std::uint16_t& out)const{ out = rmo_as_u16(borrow()); }
  void as(std::uint8_t& out) const{ out = rmo_as_u8(borrow()); }

  operator std::string() const { return as<std::string>(); }

private:
  const RustManagedObject& borrow() const { return *obj_.value(); }

  std::optional<::rust::Box<RustManagedObject>> obj_;
};

} // namespace cpp
