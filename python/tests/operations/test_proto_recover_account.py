from tests.utils.checkers import check_operations, check_transaction
from wax._private.proto import future_extensions_pb2

from wax.proto.operations import (
    recover_account,
    operation,
)
from wax.proto.transaction import transaction
from wax.proto.authority import authority


def test_recover_account():
    extension: future_extensions_pb2.future_extensions = future_extensions_pb2.future_extensions()
    authority1: authority = authority(
        weight_threshold=1,
        account_auths={"account": 1, "account1": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1},
    )
    authority2: authority = authority(
        weight_threshold=1,
        account_auths={"account1": 1, "account2": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1},
    )
    recover_account_proto: recover_account = recover_account(
        account_to_recover="account", new_owner_authority=authority1, recent_owner_authority=authority2, extensions=[]
    )

    recover_account_operation: operation = operation(recover_account_operation=recover_account_proto)

    check_operations(recover_account_operation)

    transaction_proto: transaction = transaction(operations=[recover_account_operation])

    check_transaction(transaction_proto)
