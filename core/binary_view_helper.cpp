#include <core/binary_view_helper.hpp>

#include <hive/protocol/misc_utilities.hpp>

#include <fc/crypto/hex.hpp>
#include <fc/io/raw_fwd.hpp>

namespace cpp {
  binary_data generate_binary_transaction_metadata(const hive::protocol::signed_transaction& tx)
  {
    binary_data result;
    result.binary = serialize_transaction(tx);

    return result;
  }

  std::string serialize_transaction(const hive::protocol::signed_transaction& tx)
  {
    hive::protocol::serialization_mode_controller::mode_guard guard(hive::protocol::transaction_serialization_type::hf26);
    hive::protocol::serialization_mode_controller::set_pack(hive::protocol::transaction_serialization_type::hf26);

    return fc::to_hex(fc::raw::pack_to_vector(tx));
  }
}
