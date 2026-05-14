#include "rust_protocol.hpp"

#include "core/val_protocol.hpp"
#include "core/proto_converter.hpp"
#include "core/utils.hpp"

namespace cpp {
	std::unique_ptr<rust_protocol>
	new_rust_protocol() {
		return std::make_unique<rust_protocol>();
	}

	std::unique_ptr<hive_operation_handle>
	rust_protocol::cpp_create_operation_handle(
		::rust::Box<RustManagedObject> obj
	) const {
		return safe_exception_wrapper([&]() -> std::unique_ptr<hive_operation_handle> {
			auto handle = std::make_unique<hive_operation_handle>();

			hive::protocol::operation op;
			cpp::from_jsval(rust_managed_object{ std::move(obj) }, op, true);
			handle->op.reset(new hive_op(std::move(op)));

			return handle;
		});
	}

	std::unique_ptr<hive_transaction_handle>
	rust_protocol::cpp_create_transaction_handle(
		::rust::Box<RustManagedObject> obj
	) const {
		return safe_exception_wrapper([&]() -> std::unique_ptr<hive_transaction_handle> {
			auto handle = std::make_unique<hive_transaction_handle>();

			fc::reflector<hive::protocol::signed_transaction>::visit(
				cpp::val_protocol_visitor<rust_managed_object, hive::protocol::signed_transaction>{
					rust_managed_object{ std::move(obj) },
					handle->get(),
					true,
				});

			return handle;
		});
	}

	void rust_protocol::cpp_tx_add_operation(
		hive_transaction_handle& tx,
		const hive_operation_handle& op
	) const {
		foundation::cpp_tx_add_operation(tx, op);
	}

	void rust_protocol::cpp_tx_validate(const hive_transaction_handle& tx) const {
		foundation::cpp_tx_validate(tx);
	}
}
