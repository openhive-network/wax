from tests.utils.checkers import check_operations, check_transaction
from wax._private.proto import future_extensions_pb2

from wax.proto.operations import (
    request_account_recovery,
    operation,
)
from wax.proto.authority import authority
from wax.proto.transaction import transaction


def test_request_account_recovery():
    extension: future_extensions_pb2.future_extensions = future_extensions_pb2.future_extensions()
    authority_proto: authority = authority(
        weight_threshold=1,
        account_auths={"account": 1, "account1": 2},
        key_auths={"STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76": 1}
    )
    request_account_recovery_proto: request_account_recovery = request_account_recovery(
        recovery_account="account",
        account_to_recover="account1",
        new_owner_authority=authority_proto,
        extensions=[]
    )

    request_account_recovery_operation: operation = operation(
        request_account_recovery_operation=request_account_recovery_proto
    )

    check_operations(request_account_recovery_operation)

    transaction_proto: transaction = transaction(
        operations=[request_account_recovery_operation]
    )

    check_transaction(transaction_proto)
