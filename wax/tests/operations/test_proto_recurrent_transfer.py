from utils.checkers import check_operations

from wax.proto import asset_pb2, recurrent_transfer_pb2, transaction_pb2


def test_recurrent_transfer():
    amount: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="10"
    )
    recurrent_transfer_pair_id: recurrent_transfer_pb2.recurrent_transfer_pair_id = (
        recurrent_transfer_pb2.recurrent_transfer_pair_id(pair_id=0)
    )
    extensions: recurrent_transfer_pb2.recurrent_transfer_extension = (
        recurrent_transfer_pb2.recurrent_transfer_extension(
            recurrent_transfer_pair_id=recurrent_transfer_pair_id
        )
    )
    recurrent_transfer: recurrent_transfer_pb2.recurrent_transfer = (
        recurrent_transfer_pb2.recurrent_transfer(
            from_="alice",
            to="harry",
            amount=amount,
            memo="it is only memo",
            recurrence=1,
            executions=3,
            extensions=[extensions],
        )
    )
    recurrent_transfer_operation: transaction_pb2.operation = transaction_pb2.operation(
        recurrent_transfer=recurrent_transfer
    )

    check_operations(recurrent_transfer_operation)
