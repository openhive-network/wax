from wax.wax_visitor import AbstractOperationVisitor

from wax.proto import vote_pb2


class MyOperationVisitor(AbstractOperationVisitor):
    def vote(self, op: vote_pb2.vote) -> None:
        pass


def test_abstract_operation_visitor():
    try:
        visitor = MyOperationVisitor()
    except TypeError as ex:
        assert str(ex) == (
            "Can't instantiate abstract class MyOperationVisitor with abstract methods "
            "account_create, account_create_with_delegation, account_update, account_update2, "
            "account_witness_proxy, account_witness_vote, cancel_transfer_from_savings, "
            "change_recovery_account, claim_account, claim_reward_balance, collateralized_convert, "
            "comment, comment_options, convert, create_claimed_account, create_proposal, custom, "
            "custom_json, decline_voting_rights, delegate_vesting_shares, delete_comment, escrow_approve, "
            "escrow_dispute, escrow_release, escrow_transfer, feed_publish, limit_order_cancel, "
            "limit_order_create, limit_order_create2, pow, pow2, recover_account, recurrent_transfer, "
            "remove_proposal, request_account_recovery, set_withdraw_vesting_route, transfer, "
            "transfer_from_savings, transfer_to_savings, transfer_to_vesting, update_proposal, "
            "update_proposal_votes, withdraw_vesting, witness_block_approve, witness_set_properties, "
            "witness_update"
        )
