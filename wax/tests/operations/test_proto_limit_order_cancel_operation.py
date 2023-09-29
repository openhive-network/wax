from utils.checkers import check_operations

from wax.proto import (
    limit_order_cancel_pb2,
    operation_pb2,
    transaction_pb2
)

def test_limit_order_cancel_operation():
    limit_order_cancel: limit_order_cancel_pb2.limit_order_cancel = (
        limit_order_cancel_pb2.limit_order_cancel(orderid=1, order="adm")
    )

    limit_order_cancel_operation: operation_pb2.operation = operation_pb2.operation(
        limit_order_cancel=limit_order_cancel
    )

    check_operations(limit_order_cancel_operation)
