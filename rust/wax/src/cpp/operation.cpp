#include "operation.h"

#include <sstream>

namespace cpp {
	std::string HiveOperationHandle::describe_impl() const {
		std::ostringstream oss;
		oss << op_kind << '{';
		bool first = true;
		for (const auto& kv : fields) {
			if (!first) oss << ',';
			oss << kv.first << '=' << kv.second;
			first = false;
		}
		oss << '}';
		return oss.str();
	}

	rust::String HiveOperationHandle::kind() const {
		return rust::String(op_kind);
	}

	rust::String HiveOperationHandle::description() const {
		return rust::String(describe_impl());
	}
}
