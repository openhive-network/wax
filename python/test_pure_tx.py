from wax import create_wax_foundation, cpp_pass_pure_transaction
from wax.proto.operations import comment as comment_operation, operation
from wax.proto.transaction import transaction as proto_transaction

from google.protobuf.json_format import MessageToDict

TAPOS = "00000449f7860b82b4fbe2f317c670e9f01d6d9a"

waxF = create_wax_foundation()

transaction = waxF.create_transaction_with_tapos(TAPOS)

tx = transaction.transaction

txc = proto_transaction(expiration = tx.expiration, ref_block_num=tx.ref_block_num, ref_block_prefix=tx.ref_block_prefix, operations=tx.operations, extensions=tx.extensions);

tx2 = MessageToDict(tx, True)

for(key, value) in tx2.items():
  print(f" key: {key}: {value}")

cpp_pass_pure_transaction(tx)

print("===================================")

cpp_pass_pure_transaction(txc)
