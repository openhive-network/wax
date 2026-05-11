#include "transaction.h"

namespace cpp {
	rust::String HiveTransactionHandle::transaction_id() const {
		return rust::String(tx_id);
	}

	std::size_t HiveTransactionHandle::operation_count() const {
		return operations.size();
	}
}
