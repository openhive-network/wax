# account_update_operation =  {
#   "type": "account_update_operation",
#   "value": {
#     "account": "theoretical",
#     "posting": {
#       "weight_threshold": 1,
#       "account_auths": [],
#       "key_auths": [
#         [
#           "STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo",
#           1
#         ],
#         [
#           "STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76",
#           1
#         ]
#       ]
#     },
#     "memo_key": "STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo",
#     "json_metadata": ""
#   }
# }

from utils.checkers import check_operations

from wax.proto import account_update_pb2, authority_pb2, transaction_pb2


def test_account_update():
    posting: authority_pb2.authority = authority_pb2.authority(
        weight_threshold=1,
        account_auths={"STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo": 1},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1},
    )
    account_update: account_update_pb2.account_update = (
        account_update_pb2.account_update(
            account="theoretical",
            posting=posting,
            memo_key="STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo",
            json_metadata="",
        )
    )

    account_update_operation: transaction_pb2.operation = transaction_pb2.operation(
        account_update=account_update
    )

    check_operations(account_update_operation)
