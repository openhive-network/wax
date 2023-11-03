from abc import ABC, abstractmethod

from wax.proto import (
    vote_pb2,
    comment_pb2,
    transfer_pb2,
    transfer_to_vesting_pb2,
    withdraw_vesting_pb2,
    limit_order_create_pb2,
    limit_order_cancel_pb2,
    feed_publish_pb2,
    convert_pb2,
    account_create_pb2,
    account_update_pb2,
    witness_update_pb2,
    account_witness_vote_pb2,
    account_witness_proxy_pb2,
    pow_pb2,
    custom_pb2,
    witness_block_approve_pb2,
    delete_comment_pb2,
    custom_json_pb2,
    comment_options_pb2,
    set_withdraw_vesting_route_pb2,
    limit_order_create2_pb2,
    claim_account_pb2,
    create_claimed_account_pb2,
    request_account_recovery_pb2,
    recover_account_pb2,
    change_recovery_account_pb2,
    escrow_transfer_pb2,
    escrow_dispute_pb2,
    escrow_release_pb2,
    pow2_pb2,
    escrow_approve_pb2,
    transfer_to_savings_pb2,
    transfer_from_savings_pb2,
    cancel_transfer_from_savings_pb2,
    decline_voting_rights_pb2,
    claim_reward_balance_pb2,
    delegate_vesting_shares_pb2,
    account_create_with_delegation_pb2,
    witness_set_properties_pb2,
    account_update2_pb2,
    create_proposal_pb2,
    update_proposal_votes_pb2,
    remove_proposal_pb2,
    update_proposal_pb2,
    collateralized_convert_pb2,
    recurrent_transfer_pb2,
    operation_pb2,
    transaction_pb2
)


class AbstractOperationVisitor(ABC):
    """
    User must overrides all the abstract methods in derived visitor class.
    """

    def accept(self, operation: operation_pb2.operation):
        target_operation_name = operation.WhichOneof("value")
        if hasattr(self, target_operation_name):
            method = getattr(self, target_operation_name)
            target_operation = getattr(operation, target_operation_name)
            method(target_operation)
        else:
            raise AttributeError("Method for operation '{}' not exists in '{}'.".format(target_operation_name, __class__.__name__))

    @abstractmethod
    def vote(self, op:vote_pb2.vote):
        pass

    @abstractmethod
    def comment(self, op:comment_pb2.comment):
        pass

    @abstractmethod
    def transfer(self, op:transfer_pb2.transfer):
        pass

    @abstractmethod
    def transfer_to_vesting(self, op:transfer_to_vesting_pb2.transfer_to_vesting):
        pass

    @abstractmethod
    def withdraw_vesting(self, op:withdraw_vesting_pb2.withdraw_vesting):
        pass

    @abstractmethod
    def limit_order_create(self, op:limit_order_create_pb2.limit_order_create):
        pass

    @abstractmethod
    def limit_order_cancel(self, op:limit_order_cancel_pb2.limit_order_cancel):
        pass

    @abstractmethod
    def feed_publish(self, op:feed_publish_pb2.feed_publish):
        pass

    @abstractmethod
    def convert(self, op:convert_pb2.convert):
        pass

    @abstractmethod
    def account_create(self, op:account_create_pb2.account_create):
        pass

    @abstractmethod
    def account_update(self, op:account_update_pb2.account_update):
        pass

    @abstractmethod
    def witness_update(self, op:witness_update_pb2.witness_update):
        pass

    @abstractmethod
    def account_witness_vote(self, op:account_witness_vote_pb2.account_witness_vote):
        pass

    @abstractmethod
    def account_witness_proxy(self, op:account_witness_proxy_pb2.account_witness_proxy):
        pass

    @abstractmethod
    def pow(self, op:pow_pb2.pow):
        pass

    @abstractmethod
    def custom(self, op:custom_pb2.custom):
        pass

    @abstractmethod
    def witness_block_approve(self, op:witness_block_approve_pb2.witness_block_approve):
        pass

    @abstractmethod
    def delete_comment(self, op:delete_comment_pb2.delete_comment):
        pass

    @abstractmethod
    def custom_json(self, op:custom_json_pb2.custom_json):
        pass

    @abstractmethod
    def comment_options(self, op:comment_options_pb2.comment_options):
        pass

    @abstractmethod
    def set_withdraw_vesting_route(self, op:set_withdraw_vesting_route_pb2.set_withdraw_vesting_route):
        pass

    @abstractmethod
    def limit_order_create2(self, op:limit_order_create2_pb2.limit_order_create2):
        pass

    @abstractmethod
    def claim_account(self, op:claim_account_pb2.claim_account):
        pass

    @abstractmethod
    def create_claimed_account(self, op:create_claimed_account_pb2.create_claimed_account):
        pass

    @abstractmethod
    def request_account_recovery(self, op:request_account_recovery_pb2.request_account_recovery):
        pass

    @abstractmethod
    def recover_account(self, op:recover_account_pb2.recover_account):
        pass

    @abstractmethod
    def change_recovery_account(self, op:change_recovery_account_pb2.change_recovery_account):
        pass

    @abstractmethod
    def escrow_transfer(self, op:escrow_transfer_pb2.escrow_transfer):
        pass

    @abstractmethod
    def escrow_dispute(self, op:escrow_dispute_pb2.escrow_dispute):
        pass

    @abstractmethod
    def escrow_release(self, op:escrow_release_pb2.escrow_release):
        pass

    @abstractmethod
    def pow2(self, op:pow2_pb2.pow2):
        pass

    @abstractmethod
    def escrow_approve(self, op:escrow_approve_pb2.escrow_approve):
        pass

    @abstractmethod
    def transfer_to_savings(self, op:transfer_to_savings_pb2.transfer_to_savings):
        pass

    @abstractmethod
    def transfer_from_savings(self, op:transfer_from_savings_pb2.transfer_from_savings):
        pass

    @abstractmethod
    def cancel_transfer_from_savings(self, op:cancel_transfer_from_savings_pb2.cancel_transfer_from_savings):
        pass

    @abstractmethod
    def decline_voting_rights(self, op:decline_voting_rights_pb2.decline_voting_rights):
        pass

    @abstractmethod
    def claim_reward_balance(self, op:claim_reward_balance_pb2.claim_reward_balance):
        pass

    @abstractmethod
    def delegate_vesting_shares(self, op:delegate_vesting_shares_pb2.delegate_vesting_shares):
        pass

    @abstractmethod
    def account_create_with_delegation(self, op:account_create_with_delegation_pb2.account_create_with_delegation):
        pass

    @abstractmethod
    def witness_set_properties(self, op:witness_set_properties_pb2.witness_set_properties):
        pass

    @abstractmethod
    def account_update2(self, op:account_update2_pb2.account_update2):
        pass

    @abstractmethod
    def create_proposal(self, op:create_proposal_pb2.create_proposal):
        pass

    @abstractmethod
    def update_proposal_votes(self, op:update_proposal_votes_pb2.update_proposal_votes):
        pass

    @abstractmethod
    def remove_proposal(self, op:remove_proposal_pb2.remove_proposal):
        pass

    @abstractmethod
    def update_proposal(self, op:update_proposal_pb2.update_proposal):
        pass

    @abstractmethod
    def collateralized_convert(self, op:collateralized_convert_pb2.collateralized_convert):
        pass

    @abstractmethod
    def recurrent_transfer(self, op:recurrent_transfer_pb2.recurrent_transfer):
        pass



class OperationVisitor(AbstractOperationVisitor):
    """
    User need to overrides only method(s) for operation(s) he want be processed.
    All other operations will be silently skipped.
    """

    def vote(self, op:vote_pb2.vote):
        pass

    def comment(self, op:comment_pb2.comment):
        pass

    def transfer(self, op:transfer_pb2.transfer):
        pass

    def transfer_to_vesting(self, op:transfer_to_vesting_pb2.transfer_to_vesting):
        pass

    def withdraw_vesting(self, op:withdraw_vesting_pb2.withdraw_vesting):
        pass

    def limit_order_create(self, op:limit_order_create_pb2.limit_order_create):
        pass

    def limit_order_cancel(self, op:limit_order_cancel_pb2.limit_order_cancel):
        pass

    def feed_publish(self, op:feed_publish_pb2.feed_publish):
        pass

    def convert(self, op:convert_pb2.convert):
        pass

    def account_create(self, op:account_create_pb2.account_create):
        pass

    def account_update(self, op:account_update_pb2.account_update):
        pass

    def witness_update(self, op:witness_update_pb2.witness_update):
        pass

    def account_witness_vote(self, op:account_witness_vote_pb2.account_witness_vote):
        pass

    def account_witness_proxy(self, op:account_witness_proxy_pb2.account_witness_proxy):
        pass

    def pow(self, op:pow_pb2.pow):
        pass

    def custom(self, op:custom_pb2.custom):
        pass

    def witness_block_approve(self, op:witness_block_approve_pb2.witness_block_approve):
        pass

    def delete_comment(self, op:delete_comment_pb2.delete_comment):
        pass

    def custom_json(self, op:custom_json_pb2.custom_json):
        pass

    def comment_options(self, op:comment_options_pb2.comment_options):
        pass

    def set_withdraw_vesting_route(self, op:set_withdraw_vesting_route_pb2.set_withdraw_vesting_route):
        pass

    def limit_order_create2(self, op:limit_order_create2_pb2.limit_order_create2):
        pass

    def claim_account(self, op:claim_account_pb2.claim_account):
        pass

    def create_claimed_account(self, op:create_claimed_account_pb2.create_claimed_account):
        pass

    def request_account_recovery(self, op:request_account_recovery_pb2.request_account_recovery):
        pass

    def recover_account(self, op:recover_account_pb2.recover_account):
        pass

    def change_recovery_account(self, op:change_recovery_account_pb2.change_recovery_account):
        pass

    def escrow_transfer(self, op:escrow_transfer_pb2.escrow_transfer):
        pass

    def escrow_dispute(self, op:escrow_dispute_pb2.escrow_dispute):
        pass

    def escrow_release(self, op:escrow_release_pb2.escrow_release):
        pass

    def pow2(self, op:pow2_pb2.pow2):
        pass

    def escrow_approve(self, op:escrow_approve_pb2.escrow_approve):
        pass

    def transfer_to_savings(self, op:transfer_to_savings_pb2.transfer_to_savings):
        pass

    def transfer_from_savings(self, op:transfer_from_savings_pb2.transfer_from_savings):
        pass

    def cancel_transfer_from_savings(self, op:cancel_transfer_from_savings_pb2.cancel_transfer_from_savings):
        pass

    def decline_voting_rights(self, op:decline_voting_rights_pb2.decline_voting_rights):
        pass

    def claim_reward_balance(self, op:claim_reward_balance_pb2.claim_reward_balance):
        pass

    def delegate_vesting_shares(self, op:delegate_vesting_shares_pb2.delegate_vesting_shares):
        pass

    def account_create_with_delegation(self, op:account_create_with_delegation_pb2.account_create_with_delegation):
        pass

    def witness_set_properties(self, op:witness_set_properties_pb2.witness_set_properties):
        pass

    def account_update2(self, op:account_update2_pb2.account_update2):
        pass

    def create_proposal(self, op:create_proposal_pb2.create_proposal):
        pass

    def update_proposal_votes(self, op:update_proposal_votes_pb2.update_proposal_votes):
        pass

    def remove_proposal(self, op:remove_proposal_pb2.remove_proposal):
        pass

    def update_proposal(self, op:update_proposal_pb2.update_proposal):
        pass

    def collateralized_convert(self, op:collateralized_convert_pb2.collateralized_convert):
        pass

    def recurrent_transfer(self, op:recurrent_transfer_pb2.recurrent_transfer):
        pass
