from wax._private.proto.future_extensions_pb2 import future_extensions, void_t
from wax.proto.asset import asset
from wax.proto.operations import claim_account, operation
from wax.proto.transaction import transaction
from wax_local_tools.checkers import check_operations, check_transaction


def test_claim_account():
    extension: future_extensions = future_extensions(void_t=void_t())
    fee: asset = asset(nai="@@000000021", precision=3, amount="10")
    claim_account_proto: claim_account = claim_account(creator="rosylisboa", fee=fee, extensions=[])

    claim_account_operation: operation = operation(claim_account_operation=claim_account_proto)

    check_operations(claim_account_operation)

    transaction_proto: transaction = transaction(operations=[claim_account_operation])

    check_transaction(transaction_proto)
