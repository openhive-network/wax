from abc import ABC, abstractmethod

from wax.proto.operations import (
    account_create,
    account_create_with_delegation,
    account_update,
    account_update2,
    account_witness_proxy,
    account_witness_vote,
    cancel_transfer_from_savings,
    change_recovery_account,
    claim_account,
    claim_reward_balance,
    collateralized_convert,
    comment,
    comment_options,
    convert,
    create_claimed_account,
    create_proposal,
    custom,
    custom_json,
    decline_voting_rights,
    delegate_vesting_shares,
    delete_comment,
    escrow_approve,
    escrow_dispute,
    escrow_release,
    escrow_transfer,
    feed_publish,
    limit_order_cancel,
    limit_order_create,
    limit_order_create2,
    operation,
    pow,
    pow2,
    recover_account,
    recurrent_transfer,
    remove_proposal,
    request_account_recovery,
    set_withdraw_vesting_route,
    transfer,
    transfer_from_savings,
    transfer_to_savings,
    transfer_to_vesting,
    update_proposal,
    update_proposal_votes,
    vote,
    withdraw_vesting,
    witness_block_approve,
    witness_set_properties,
    witness_update,
)


class AbstractOperationVisitor(ABC):
    """User must overrides all the abstract methods in derived visitor class."""

    def accept(self, op: operation) -> None:
        target_operation_name: str = op.WhichOneof("value")
        pure_operation_name = target_operation_name.replace("_operation", "")

        # Accept both forms: overridden method of full compliant operation type name,
        # like also without "_operation" suffix

        if hasattr(self, target_operation_name):
            method = getattr(self, target_operation_name)
            target_operation = getattr(op, target_operation_name)
            method(target_operation)
        elif hasattr(self, pure_operation_name):
            method = getattr(self, pure_operation_name)
            target_operation = getattr(op, target_operation_name)
            method(target_operation)
        else:
            raise AttributeError(
                f"Method for operation '{target_operation_name}' not exists in '{self.__class__.__name__}'."
            )

    @abstractmethod
    def vote(self, op: vote) -> None:
        pass

    @abstractmethod
    def comment(self, op: comment) -> None:
        pass

    @abstractmethod
    def transfer(self, op: transfer) -> None:
        pass

    @abstractmethod
    def transfer_to_vesting(self, op: transfer_to_vesting) -> None:
        pass

    @abstractmethod
    def withdraw_vesting(self, op: withdraw_vesting) -> None:
        pass

    @abstractmethod
    def limit_order_create(self, op: limit_order_create) -> None:
        pass

    @abstractmethod
    def limit_order_cancel(self, op: limit_order_cancel) -> None:
        pass

    @abstractmethod
    def feed_publish(self, op: feed_publish) -> None:
        pass

    @abstractmethod
    def convert(self, op: convert) -> None:
        pass

    @abstractmethod
    def account_create(self, op: account_create) -> None:
        pass

    @abstractmethod
    def account_update(self, op: account_update) -> None:
        pass

    @abstractmethod
    def witness_update(self, op: witness_update) -> None:
        pass

    @abstractmethod
    def account_witness_vote(self, op: account_witness_vote) -> None:
        pass

    @abstractmethod
    def account_witness_proxy(self, op: account_witness_proxy) -> None:
        pass

    @abstractmethod
    def pow(self, op: pow) -> None:
        pass

    @abstractmethod
    def custom(self, op: custom) -> None:
        pass

    @abstractmethod
    def witness_block_approve(self, op: witness_block_approve) -> None:
        pass

    @abstractmethod
    def delete_comment(self, op: delete_comment) -> None:
        pass

    @abstractmethod
    def custom_json(self, op: custom_json) -> None:
        pass

    @abstractmethod
    def comment_options(self, op: comment_options) -> None:
        pass

    @abstractmethod
    def set_withdraw_vesting_route(self, op: set_withdraw_vesting_route) -> None:
        pass

    @abstractmethod
    def limit_order_create2(self, op: limit_order_create2) -> None:
        pass

    @abstractmethod
    def claim_account(self, op: claim_account) -> None:
        pass

    @abstractmethod
    def create_claimed_account(self, op: create_claimed_account) -> None:
        pass

    @abstractmethod
    def request_account_recovery(self, op: request_account_recovery) -> None:
        pass

    @abstractmethod
    def recover_account(self, op: recover_account) -> None:
        pass

    @abstractmethod
    def change_recovery_account(self, op: change_recovery_account) -> None:
        pass

    @abstractmethod
    def escrow_transfer(self, op: escrow_transfer) -> None:
        pass

    @abstractmethod
    def escrow_dispute(self, op: escrow_dispute) -> None:
        pass

    @abstractmethod
    def escrow_release(self, op: escrow_release) -> None:
        pass

    @abstractmethod
    def pow2(self, op: pow2) -> None:
        pass

    @abstractmethod
    def escrow_approve(self, op: escrow_approve) -> None:
        pass

    @abstractmethod
    def transfer_to_savings(self, op: transfer_to_savings) -> None:
        pass

    @abstractmethod
    def transfer_from_savings(self, op: transfer_from_savings) -> None:
        pass

    @abstractmethod
    def cancel_transfer_from_savings(self, op: cancel_transfer_from_savings) -> None:
        pass

    @abstractmethod
    def decline_voting_rights(self, op: decline_voting_rights) -> None:
        pass

    @abstractmethod
    def claim_reward_balance(self, op: claim_reward_balance) -> None:
        pass

    @abstractmethod
    def delegate_vesting_shares(self, op: delegate_vesting_shares) -> None:
        pass

    @abstractmethod
    def account_create_with_delegation(self, op: account_create_with_delegation) -> None:
        pass

    @abstractmethod
    def witness_set_properties(self, op: witness_set_properties) -> None:
        pass

    @abstractmethod
    def account_update2(self, op: account_update2) -> None:
        pass

    @abstractmethod
    def create_proposal(self, op: create_proposal) -> None:
        pass

    @abstractmethod
    def update_proposal_votes(self, op: update_proposal_votes) -> None:
        pass

    @abstractmethod
    def remove_proposal(self, op: remove_proposal) -> None:
        pass

    @abstractmethod
    def update_proposal(self, op: update_proposal) -> None:
        pass

    @abstractmethod
    def collateralized_convert(self, op: collateralized_convert) -> None:
        pass

    @abstractmethod
    def recurrent_transfer(self, op: recurrent_transfer) -> None:
        pass


class OperationVisitor(AbstractOperationVisitor):
    """
    User need to override only method(s) for operation(s) he wants to be processed.

    All other operations will be silently skipped.
    """

    def vote(self, op: vote) -> None:
        pass

    def comment(self, op: comment) -> None:
        pass

    def transfer(self, op: transfer) -> None:
        pass

    def transfer_to_vesting(self, op: transfer_to_vesting) -> None:
        pass

    def withdraw_vesting(self, op: withdraw_vesting) -> None:
        pass

    def limit_order_create(self, op: limit_order_create) -> None:
        pass

    def limit_order_cancel(self, op: limit_order_cancel) -> None:
        pass

    def feed_publish(self, op: feed_publish) -> None:
        pass

    def convert(self, op: convert) -> None:
        pass

    def account_create(self, op: account_create) -> None:
        pass

    def account_update(self, op: account_update) -> None:
        pass

    def witness_update(self, op: witness_update) -> None:
        pass

    def account_witness_vote(self, op: account_witness_vote) -> None:
        pass

    def account_witness_proxy(self, op: account_witness_proxy) -> None:
        pass

    def pow(self, op: pow) -> None:
        pass

    def custom(self, op: custom) -> None:
        pass

    def witness_block_approve(self, op: witness_block_approve) -> None:
        pass

    def delete_comment(self, op: delete_comment) -> None:
        pass

    def custom_json(self, op: custom_json) -> None:
        pass

    def comment_options(self, op: comment_options) -> None:
        pass

    def set_withdraw_vesting_route(self, op: set_withdraw_vesting_route) -> None:
        pass

    def limit_order_create2(self, op: limit_order_create2) -> None:
        pass

    def claim_account(self, op: claim_account) -> None:
        pass

    def create_claimed_account(self, op: create_claimed_account) -> None:
        pass

    def request_account_recovery(self, op: request_account_recovery) -> None:
        pass

    def recover_account(self, op: recover_account) -> None:
        pass

    def change_recovery_account(self, op: change_recovery_account) -> None:
        pass

    def escrow_transfer(self, op: escrow_transfer) -> None:
        pass

    def escrow_dispute(self, op: escrow_dispute) -> None:
        pass

    def escrow_release(self, op: escrow_release) -> None:
        pass

    def pow2(self, op: pow2) -> None:
        pass

    def escrow_approve(self, op: escrow_approve) -> None:
        pass

    def transfer_to_savings(self, op: transfer_to_savings) -> None:
        pass

    def transfer_from_savings(self, op: transfer_from_savings) -> None:
        pass

    def cancel_transfer_from_savings(self, op: cancel_transfer_from_savings) -> None:
        pass

    def decline_voting_rights(self, op: decline_voting_rights) -> None:
        pass

    def claim_reward_balance(self, op: claim_reward_balance) -> None:
        pass

    def delegate_vesting_shares(self, op: delegate_vesting_shares) -> None:
        pass

    def account_create_with_delegation(self, op: account_create_with_delegation) -> None:
        pass

    def witness_set_properties(self, op: witness_set_properties) -> None:
        pass

    def account_update2(self, op: account_update2) -> None:
        pass

    def create_proposal(self, op: create_proposal) -> None:
        pass

    def update_proposal_votes(self, op: update_proposal_votes) -> None:
        pass

    def remove_proposal(self, op: remove_proposal) -> None:
        pass

    def update_proposal(self, op: update_proposal) -> None:
        pass

    def collateralized_convert(self, op: collateralized_convert) -> None:
        pass

    def recurrent_transfer(self, op: recurrent_transfer) -> None:
        pass
