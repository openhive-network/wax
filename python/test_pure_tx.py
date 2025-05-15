from wax import create_wax_foundation, cpp_pass_pure_transaction
from wax.proto.operations import comment as comment_operation, operation, vote as vote_operation, account_update as account_update_operation
from wax.proto.transaction import transaction as proto_transaction
from wax.proto.authority import authority

from google.protobuf.json_format import MessageToDict

TAPOS = "00000449f7860b82b4fbe2f317c670e9f01d6d9a"

waxF = create_wax_foundation()

transaction = waxF.create_transaction_with_tapos(TAPOS)

tx = transaction.transaction

tx.operations.append(operation(comment_operation = comment_operation(
  author="test",
  permlink="test",
  parent_author="test",
  parent_permlink="test",
  title="test",
  body="test",
  json_metadata="{}"
)))

posting: authority = authority(
        weight_threshold=1,
        account_auths={"account": 1, "account1": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1},
    )
account_update_proto: account_update_operation = (
    account_update_operation(
        account="theoretical",
        posting=posting,
        memo_key="STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo",
        json_metadata="",
    )
)

# print(account_update_proto.posting.account_auths["account"])
# print(account_update_proto.posting.account_auths.__getitem__("account"))

# print(account_update_proto.posting.account_auths.__iter__().__next__())

tx.operations.append(operation(account_update_operation=account_update_proto))

tx.operations.append(operation(vote_operation = vote_operation(
    voter="voter",
    author="author",
    permlink="permlink",
    weight=10000
)))

# print(f"{tx.operations[1].account_update_operation.DESCRIPTOR.fields_by_name}")

print(cpp_pass_pure_transaction(tx))

# txc = proto_transaction(expiration = tx.expiration, ref_block_num=tx.ref_block_num, ref_block_prefix=tx.ref_block_prefix, operations=tx.operations, extensions=tx.extensions);

# posting: authority = authority(
#         weight_threshold=1,
#         account_auths={"account": 1, "account1": 2},
#         key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1},
#     )
# account_update_proto: account_update_operation = (
#     account_update_operation(
#         account="theoretical",
#         posting=posting,
#         memo_key="STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo",
#         json_metadata="",
#     )
# )



# tx.operations.append(operation(
#     account_update_operation = account_update_proto
#     ))

# print(f"account_update_operation.posting: {tx.operations[2].account_update_operation.posting}")

# print(f"{tx.operations[2].account_update_operation.DESCRIPTOR.fields_by_name}")

# print(str(tx))

# tx2 = MessageToDict(tx, True)

# for(key, value) in tx2.items():
#   print(f" key: {key}: {value}")

# op_type = tx.operations[1].WhichOneof("value")
# op = tx.operations[1].__getattribute__(op_type)
# print(f"op_type: {op_type}")
# print(f"op: {op}")

# #for key, value in txc.ListFields():
# #  print(f"-- key: {key.name}: {value}")

# #print(tx.ref_block_num);


# cpp_pass_pure_transaction(tx)

# print(f"tx expiration: {txc.expiration}")

# op_type = tx.operations[0].WhichOneof("value")
# op_data = tx.operations[0].__getattribute__(op_type)
# print(f"op_data: {op_data.__getattribute__("parent_author")}")
# print(f"op_type: {type(op_data)}")

# op_type = tx.operations[2].WhichOneof("value")
# op = tx.operations[2].__getattribute__(op_type)
# print(f"op_type: {op_type}")
# print(f"op: {op}")

# cpp_pass_pure_transaction(txc)
