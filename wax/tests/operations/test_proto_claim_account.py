from utils.checkers import check_operations, check_transaction

from wax.proto import (
    claim_account_pb2,
    operation_pb2,
    transaction_pb2,
    future_extensions_pb2,
    asset_pb2
)

def test_claim_account():
    extension: future_extensions_pb2.future_extensions = future_extensions_pb2.future_extensions(void_t=future_extensions_pb2.void_t())
    fee: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000021", precision=3, amount="10"
    )
    claim_account: claim_account_pb2.claim_account = claim_account_pb2.claim_account(
        creator="rosylisboa",
        fee=fee,
        extensions=[]
    )

    claim_account_operation: operation_pb2.operation = operation_pb2.operation(
        claim_account=claim_account
    )

    check_operations(claim_account_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[claim_account_operation]
    )

    check_transaction(transaction)
