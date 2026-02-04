from tests.wax.utils.checkers import check_operations, check_transaction
from wax._private.proto import recurrent_transfer_pb2

from wax.proto.operations import (
    recurrent_transfer,
    operation,
)
from wax.proto.asset import asset
from wax.proto.transaction import transaction
from wax._private.proto.recurrent_transfer_extension_pb2 import recurrent_transfer_extension, recurrent_transfer_pair_id


def test_recurrent_transfer():
    amount: asset = asset(nai="@@000000021", precision=3, amount="10")
    _recurrent_transfer_pair_id: recurrent_transfer_pair_id = recurrent_transfer_pair_id(pair_id=0)
    extensions: recurrent_transfer_extension = recurrent_transfer_extension(
        recurrent_transfer_pair_id=_recurrent_transfer_pair_id
    )
    recurrent_transfer_proto: recurrent_transfer = recurrent_transfer(
        from_account="alice",
        to_account="harry",
        amount=amount,
        memo="it is only memo",
        recurrence=30,
        executions=3,
        extensions=[extensions],
    )
    recurrent_transfer_operation: operation = operation(recurrent_transfer_operation=recurrent_transfer_proto)

    check_operations(recurrent_transfer_operation)

    transaction_proto: transaction = transaction(operations=[recurrent_transfer_operation])

    check_transaction(transaction_proto)
