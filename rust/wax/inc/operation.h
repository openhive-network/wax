#pragma once

#include "rust/cxx.h"

#include <map>
#include <string>

namespace cpp {
	struct HiveOperationHandle {
		std::string op_kind;
		std::map<std::string, std::string> fields;
		bool from_protobuf{false};

		rust::String kind() const;
		rust::String description() const;

		std::string describe_impl() const;
	};
}
