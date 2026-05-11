#pragma once

#include "rust/cxx.h"
#include "operation.h"
#include "transaction.h"

#include <memory>

namespace cpp {
	struct RustTransaction;
	struct RustOperation;

	class Foundation {
	public:
		Foundation() = default;

		std::unique_ptr<HiveTransactionHandle> cpp_create_transaction_handle(
			const RustTransaction& tx,
			bool is_protobuf
		) const;

		std::unique_ptr<HiveOperationHandle> cpp_create_operation_handle(
			const RustOperation& op,
			bool is_protobuf
		) const;

		void cpp_tx_add_operation(HiveTransactionHandle& tx_handle,
			const HiveOperationHandle& op_handle
		) const;
	};

	std::unique_ptr<Foundation> new_foundation();
}
