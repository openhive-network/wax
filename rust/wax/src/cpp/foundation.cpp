#include "foundation.h"
#include "wax/src/lib.rs.h"

#include <initializer_list>
#include <sstream>
#include <stdexcept>

namespace cpp {
	std::unique_ptr<Foundation> new_foundation() {
		return std::make_unique<Foundation>();
	}

	namespace {
		void require_fields(
			const std::map<std::string, std::string>& fields,
			std::initializer_list<const char*> names,
			const std::string& op_kind
		) {
			for (const char* name : names) {
				if (fields.find(name) == fields.end()) {
					throw std::runtime_error(op_kind + ": missing required field '" + name + "'");
				}
			}
		}
	}

	std::unique_ptr<HiveTransactionHandle> Foundation::cpp_create_transaction_handle(
		const RustTransaction& tx,
		bool is_protobuf
	) const {
		if (tx.ref_block_num() == 0) {
			throw std::runtime_error("ref_block_num must be non-zero");
		}

		auto handle = std::make_unique<HiveTransactionHandle>();
		handle->ref_block_num = tx.ref_block_num();
		handle->ref_block_prefix = tx.ref_block_prefix();
		handle->expiration = static_cast<std::string>(tx.expiration());
		handle->from_protobuf = is_protobuf;

		const std::size_t count = tx.operation_count();
		handle->operations.reserve(count);
		for (std::size_t i = 0; i < count; ++i) {
			handle->operations.emplace_back(static_cast<std::string>(tx.operation_at(i)));
		}

		std::ostringstream oss;
		oss << std::hex << handle->ref_block_prefix << '-' << std::dec
			<< handle->ref_block_num << '-' << count << "ops-"
			<< (is_protobuf ? "proto" : "json");
		handle->tx_id = oss.str();

		return handle;
	}

	std::unique_ptr<HiveOperationHandle> Foundation::cpp_create_operation_handle(
		const RustOperation& op,
		bool is_protobuf
	) const {
		auto handle = std::make_unique<HiveOperationHandle>();
		handle->op_kind = static_cast<std::string>(op.op_type());
		handle->from_protobuf = is_protobuf;

		const std::size_t count = op.field_count();
		for (std::size_t i = 0; i < count; ++i) {
			handle->fields.emplace(static_cast<std::string>(op.field_key_at(i)),
				static_cast<std::string>(op.field_value_at(i)));
		}

		if (handle->op_kind == "transfer") {
			require_fields(handle->fields, {"from", "to", "amount"}, handle->op_kind);
		} else if (handle->op_kind == "vote") {
			require_fields(handle->fields, {"voter", "author", "permlink", "weight"},
				handle->op_kind);
		} else {
			throw std::runtime_error("unknown operation type: " + handle->op_kind);
		}

		return handle;
	}

	void Foundation::cpp_tx_add_operation(
		HiveTransactionHandle& tx_handle,
		const HiveOperationHandle& op_handle
	) const {
		if (tx_handle.tx_id.empty()) {
			throw std::runtime_error("transaction handle is not initialized");
		}
		if (op_handle.op_kind.empty()) {
			throw std::runtime_error("operation handle is not initialized");
		}

		tx_handle.operations.emplace_back(op_handle.describe_impl());
	}
}
