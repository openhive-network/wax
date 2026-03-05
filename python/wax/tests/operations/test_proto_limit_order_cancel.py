from wax.proto.operations import (
    limit_order_cancel,
    operation,
)
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_limit_order_cancel():
    limit_order_cancel_proto: limit_order_cancel = limit_order_cancel(owner="adm", orderid=1)

    limit_order_cancel_operation: operation = operation(limit_order_cancel_operation=limit_order_cancel_proto)

    check_operations(limit_order_cancel_operation)

    proto_transaction: transaction = transaction(operations=[limit_order_cancel_operation])

    check_transaction(proto_transaction)
