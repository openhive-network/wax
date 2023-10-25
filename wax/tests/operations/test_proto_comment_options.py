from utils.checkers import check_operations, check_transaction

from wax.proto import (
    asset_pb2,
    comment_options_pb2,
    operation_pb2,
    transaction_pb2
)

def test_comment_options():
    beneficiary_route : comment_options_pb2.beneficiary_route_type = comment_options_pb2.beneficiary_route_type(account="account", weight=10)
    comment_payout_beneficiaries: comment_options_pb2.comment_payout_beneficiaries = comment_options_pb2.comment_payout_beneficiaries(
        beneficiaries=[beneficiary_route])
    comment_options_extension: comment_options_pb2.comment_options_extension = comment_options_pb2.comment_options_extension(
        comment_payout_beneficiaries=comment_payout_beneficiaries)
    asset: asset_pb2.asset = asset_pb2.asset(
        nai="@@000000013", precision=3, amount="10"
    )
    comment_options: comment_options_pb2.comment_options = comment_options_pb2.comment_options(
        author="author",
        permlink="/",
        max_accepted_payout=asset,
        percent_hbd=10,
        allow_votes=True,
        allow_curation_rewards=True,
        extensions=[comment_options_extension]
    )

    comment_options_operation: operation_pb2.operation = operation_pb2.operation(
        comment_options=comment_options
    )

    check_operations(comment_options_operation)

    transaction: transaction_pb2.transaction = transaction_pb2.transaction(
        operations=[comment_options_operation]
    )

    check_transaction(transaction)
