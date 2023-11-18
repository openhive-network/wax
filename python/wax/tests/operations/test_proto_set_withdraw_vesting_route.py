from utils.checkers import check_operations, check_transaction

from wax.proto import (
    operation_pb2,
    transaction_pb2,
    set_withdraw_vesting_route_pb2
)

def test_set_withdraw_vesting_route():
    set_withdraw_vesting_route: set_withdraw_vesting_route_pb2.set_withdraw_vesting_route = (
        set_withdraw_vesting_route_pb2.set_withdraw_vesting_route(
            from_account="faddy",
            to_account="faddy",
            percent=10,
            auto_vest=True
        )
    )

    set_withdraw_vesting_route_opertaion: operation_pb2.operation = (
        operation_pb2.operation(set_withdraw_vesting_route=set_withdraw_vesting_route)
    )

    check_operations(set_withdraw_vesting_route_opertaion)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[set_withdraw_vesting_route_opertaion]
    )

    check_transaction(transaction)
