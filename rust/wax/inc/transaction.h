#pragma once

#include "rust/cxx.h"

#include <cstddef>
#include <cstdint>
#include <string>
#include <vector>

namespace cpp {
	struct HiveTransactionHandle {
		std::string tx_id;
		std::vector<std::string> operations;
		std::uint32_t ref_block_num{0};
		std::uint32_t ref_block_prefix{0};
		std::string expiration;
		bool from_protobuf{false};

		rust::String transaction_id() const;
		std::size_t operation_count() const;
	};
}
