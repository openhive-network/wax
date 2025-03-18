from tests.utils.checkers import check_operations, check_transaction

from wax.proto.operations import (
    operation,
    set_withdraw_vesting_route,
)
from wax.proto.transaction import transaction

def test_set_withdraw_vesting_route():
    set_withdraw_vesting_route_proto: set_withdraw_vesting_route = (
        set_withdraw_vesting_route(
            from_account="faddy",
            to_account="faddy",
            percent=10,
            auto_vest=True
        )
    )

    set_withdraw_vesting_route_opertaion: operation = (
        operation(set_withdraw_vesting_route=set_withdraw_vesting_route_proto)
    )

    check_operations(set_withdraw_vesting_route_opertaion)

    transaction_proto: transaction = transaction(
        operations=[set_withdraw_vesting_route_opertaion]
    )

    check_transaction(transaction_proto)
