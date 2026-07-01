#pragma once

#include "rust/cxx.h"
#include "wax_core/src/lib.rs.h"

#include <fc/exception/exception.hpp>

#include <cstdint>
#include <optional>
#include <string>
#include <vector>

namespace cpp {
	class rust_managed_object {
	public:
		rust_managed_object() = default;

		explicit rust_managed_object(
			::rust::Box<RustManagedObject> obj
		) : obj_(std::move(obj)) {}

		rust_managed_object(const rust_managed_object& other) {
			if (other.obj_.has_value())
				obj_ = rmo_clone(other.borrow());
		}

		rust_managed_object& operator=(const rust_managed_object& other) {
			if (this == &other)
				return *this;

			if (other.obj_.has_value())
				obj_ = rmo_clone(other.borrow());
			else
				obj_.reset();
			return *this;
		}

		rust_managed_object(rust_managed_object&&)            = default;
		rust_managed_object& operator=(rust_managed_object&&) = default;

		// JSON-backed factory. Used by the `to_proto_visitor` flat_map
		// specialization (`ManagedObjectT::object()`) and by the
		// `cpp_tx_api_to_proto_json` entry point (`from_json`).
		static rust_managed_object object() {
			return rust_managed_object(rmo_new_object());
		}

		static rust_managed_object from_json(const std::string& json) {
			return rust_managed_object(rmo_from_json_str(::rust::Str(json)));
		}

		std::string to_json_string() const {
			return static_cast<std::string>(rmo_to_json_string(borrow()));
		}

		// In-place mutations on JSON-backed objects. The visitor uses these
		// to rewrite `{ "type": "X", "value": {…} }` envelopes into proto-
		// shape `{ "X": {…} }` and to convert pair-arrays into objects.
		void set(const char* key, const rust_managed_object& value) {
			rmo_set_field(borrow(), ::rust::Str(key), value.borrow());
		}

		void set(const std::string& key, const rust_managed_object& value) {
			set(key.c_str(), value);
		}

		void set(const rust_managed_object& key, const rust_managed_object& value) {
			rmo_set_field_obj_key(borrow(), key.borrow(), value.borrow());
		}

		void del(const std::string& key) {
			rmo_del_field(borrow(), ::rust::Str(key));
		}

		rust_managed_object operator[](const char* key) const {
			return rust_managed_object(rmo_get_field(borrow(), ::rust::Str(key)));
		}

		rust_managed_object operator[](const std::string& key) const {
			return (*this)[key.c_str()];
		}

		rust_managed_object operator[](std::size_t idx) const {
			return rust_managed_object(rmo_get_index(borrow(), idx));
		}

		rust_managed_object operator[](int idx) const {
			return (*this)[static_cast<std::size_t>(idx)];
		}

		std::size_t array_length() const {
			return rmo_array_length(borrow());
		}

		bool is_undefined() const {
			return !obj_.has_value() || rmo_is_undefined(borrow());
		}

		bool is_string() const {
			return obj_.has_value() && rmo_is_string(borrow());
		}

		bool is_optional_field_present(const char* name) const {
			return obj_.has_value()
				&& rmo_is_optional_field_present(borrow(), ::rust::Str(name));
		}

		std::string get_underlying_sv_type() const {
			std::string variant = static_cast<std::string>(rmo_oneof_variant(borrow()));
			// TS NOTE: emscripten_managed_object::get_underlying_sv_type FC_ASSERTs
			// when the value has no keys. Mirror it: an empty oneof would otherwise
			// make from_jsval evaluate jsval[""], and rust_managed_object's get_field
			// panics on the unknown field — a non-Result cxx boundary turns that panic
			// into SIGABRT. Asserting here throws a catchable fc::assert_exception
			// (-> safe_exception_wrapper -> cxx Err) instead.
			FC_ASSERT(!variant.empty(), "Expected a key in static variant");
			return variant;
		}

		std::vector<std::string> get_map_keys() const {
			auto keys = rmo_map_keys(borrow());

			std::vector<std::string> out;
			out.reserve(keys.size());
			for (auto& k : keys)
				out.emplace_back(static_cast<std::string>(k));

			return out;
		}

		template<typename T>
		T as() const {
			T out;
			as(out);

			return out;
		}

		void as(std::string&   out) const { out = static_cast<std::string>(rmo_as_string(borrow())); }
		void as(bool&          out) const { out = rmo_as_bool(borrow()); }
		void as(std::int64_t&  out) const { out = rmo_as_i64(borrow()); }
		void as(std::int32_t&  out) const { out = rmo_as_i32(borrow()); }
		void as(std::int16_t&  out) const { out = rmo_as_i16(borrow()); }
		void as(std::int8_t&   out) const { out = rmo_as_i8(borrow()); }
		void as(std::uint64_t& out) const { out = rmo_as_u64(borrow()); }
		void as(std::uint32_t& out) const { out = rmo_as_u32(borrow()); }
		void as(std::uint16_t& out) const { out = rmo_as_u16(borrow()); }
		void as(std::uint8_t&  out) const { out = rmo_as_u8(borrow()); }

		operator std::string() const {
			return as<std::string>();
		}

	private:
		const RustManagedObject& borrow() const {
			return *obj_.value();
		}

		std::optional<::rust::Box<RustManagedObject>> obj_;
	};
}
