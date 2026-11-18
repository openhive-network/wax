from wax.proto.operations import (
    delegate_rc,
    operation,
)
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_delegate_rc():
    delegate_rc_proto: delegate_rc = delegate_rc(
        from_account="faddy", delegatees=["alice", "bob"], max_rc=5000000000, extensions=[]
    )

    delegate_rc_operation: operation = operation(delegate_rc_operation=delegate_rc_proto)

    check_operations(delegate_rc_operation)

    transaction_proto: transaction = transaction(operations=[delegate_rc_operation])

    check_transaction(transaction_proto)
