#pragma once

#include "rust/cxx.h"

namespace cpp {
    class rust_protocol;
    class hive_transaction_handle;
    class hive_operation_handle;
}

#include "rust_managed_object.hpp"
#include "core/foundation.hpp"

#include <memory>

namespace cpp {
	class rust_protocol : public foundation {
	public:
		rust_protocol() = default;

		std::unique_ptr<hive_operation_handle>
		cpp_create_operation_handle(::rust::Box<RustManagedObject> obj) const;

		std::unique_ptr<hive_transaction_handle>
		cpp_create_transaction_handle(::rust::Box<RustManagedObject> obj) const;

		void cpp_tx_add_operation(
			hive_transaction_handle& tx,
			const hive_operation_handle& op
		) const;

		void cpp_tx_add_signature(
			hive_transaction_handle& tx,
			::rust::Str signature
		) const;

		void cpp_tx_validate(const hive_transaction_handle& tx) const;

		::rust::String cpp_tx_sig_digest(
			const hive_transaction_handle& tx,
			::rust::Str chain_id
		) const;

		::rust::String cpp_tx_id(const hive_transaction_handle& tx) const;

		::rust::String cpp_tx_to_binary(
			const hive_transaction_handle& tx,
			bool strip_to_unsigned_transaction
		) const;
	};

	std::unique_ptr<rust_protocol> new_rust_protocol();
}
