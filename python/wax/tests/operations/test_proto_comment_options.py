from wax_local_tools.checkers import check_operations, check_transaction
from wax._private.proto import comment_options_pb2

from wax.proto.operations import (
    comment_options,
    operation,
)
from wax.proto.transaction import transaction
from wax.proto.asset import asset


def test_comment_options():
    beneficiary_route: comment_options_pb2.beneficiary_route_type = comment_options_pb2.beneficiary_route_type(
        account="account", weight=10
    )
    comment_payout_beneficiaries: comment_options_pb2.comment_payout_beneficiaries = (
        comment_options_pb2.comment_payout_beneficiaries(beneficiaries=[beneficiary_route])
    )
    comment_options_extension: comment_options_pb2.comment_options_extension = (
        comment_options_pb2.comment_options_extension(comment_payout_beneficiaries=comment_payout_beneficiaries)
    )
    asset_proto: asset = asset(nai="@@000000013", precision=3, amount="10")
    comment_options_proto: comment_options = comment_options(
        author="author",
        permlink="/",
        max_accepted_payout=asset_proto,
        percent_hbd=10,
        allow_votes=True,
        allow_curation_rewards=True,
        extensions=[comment_options_extension],
    )

    comment_options_operation: operation = operation(comment_options_operation=comment_options_proto)

    check_operations(comment_options_operation)

    transaction_proto: transaction = transaction(operations=[comment_options_operation])

    check_transaction(transaction_proto)
