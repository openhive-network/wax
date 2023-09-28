"""
@generated by mypy-protobuf.  Do not edit manually!
isort:skip_file
"""
import account_create_pb2
import account_created_pb2
import account_update2_pb2
import account_update_pb2
import account_witness_proxy_pb2
import account_witness_vote_pb2
import author_reward_pb2
import builtins
import cancel_transfer_from_savings_pb2
import change_recovery_account_pb2
import changed_recovery_account_pb2
import claim_account_pb2
import claim_reward_balance_pb2
import clear_null_account_balance_pb2
import collateralized_convert_immediate_conversion_pb2
import collateralized_convert_pb2
import comment_benefactor_reward_pb2
import comment_options_pb2
import comment_payout_update_pb2
import comment_pb2
import comment_reward_pb2
import consolidate_treasury_balance_pb2
import convert_pb2
import create_claimed_account_pb2
import create_proposal_pb2
import curation_reward_pb2
import custom_json_pb2
import custom_pb2
import decline_voting_rights_pb2
import declined_voting_rights_pb2
import delayed_voting_pb2
import delegate_vesting_shares_pb2
import delete_comment_pb2
import dhf_conversion_pb2
import dhf_funding_pb2
import effective_comment_vote_pb2
import escrow_approve_pb2
import escrow_approved_pb2
import escrow_dispute_pb2
import escrow_rejected_pb2
import escrow_release_pb2
import escrow_transfer_pb2
import expired_account_notification_pb2
import failed_recurrent_transfer_pb2
import feed_publish_pb2
import fill_collateralized_convert_request_pb2
import fill_convert_request_pb2
import fill_order_pb2
import fill_recurrent_transfer_pb2
import fill_transfer_from_savings_pb2
import fill_vesting_withdraw_pb2
import google.protobuf.descriptor
import google.protobuf.message
import hardfork_hive_pb2
import hardfork_hive_restore_pb2
import hardfork_pb2
import ineffective_delete_comment_pb2
import interest_pb2
import limit_order_cancel_pb2
import limit_order_cancelled_pb2
import limit_order_create2_pb2
import limit_order_create_pb2
import liquidity_reward_pb2
import pow_reward_pb2
import producer_missed_pb2
import producer_reward_pb2
import proposal_fee_pb2
import proposal_pay_pb2
import proxy_cleared_pb2
import recover_account_pb2
import recurrent_transfer_pb2
import remove_proposal_pb2
import request_account_recovery_pb2
import return_vesting_delegation_pb2
import set_withdraw_vesting_route_pb2
import shutdown_witness_pb2
import sys
import system_warning_pb2
import transfer_from_savings_pb2
import transfer_pb2
import transfer_to_savings_pb2
import transfer_to_vesting_completed_pb2
import transfer_to_vesting_pb2
import update_proposal_pb2
import update_proposal_votes_pb2
import vesting_shares_split_pb2
import vote_pb2
import withdraw_vesting_pb2
import witness_block_approve_pb2
import witness_set_properties_pb2
import witness_update_pb2

if sys.version_info >= (3, 8):
    import typing as typing_extensions
else:
    import typing_extensions

DESCRIPTOR: google.protobuf.descriptor.FileDescriptor

@typing_extensions.final
class operation(google.protobuf.message.Message):
    """NOTE: do not change the order of any operations prior to the virtual operations
    or it will trigger a hardfork.
    """

    DESCRIPTOR: google.protobuf.descriptor.Descriptor

    VOTE_FIELD_NUMBER: builtins.int
    COMMENT_FIELD_NUMBER: builtins.int
    TRANSFER_FIELD_NUMBER: builtins.int
    TRANSFER_TO_VESTING_FIELD_NUMBER: builtins.int
    WITHDRAW_VESTING_FIELD_NUMBER: builtins.int
    LIMIT_ORDER_CREATE_FIELD_NUMBER: builtins.int
    LIMIT_ORDER_CANCEL_FIELD_NUMBER: builtins.int
    FEED_PUBLISH_FIELD_NUMBER: builtins.int
    CONVERT_FIELD_NUMBER: builtins.int
    ACCOUNT_CREATE_FIELD_NUMBER: builtins.int
    ACCOUNT_UPDATE_FIELD_NUMBER: builtins.int
    WITNESS_UPDATE_FIELD_NUMBER: builtins.int
    ACCOUNT_WITNESS_VOTE_FIELD_NUMBER: builtins.int
    ACCOUNT_WITNESS_PROXY_FIELD_NUMBER: builtins.int
    CUSTOM_FIELD_NUMBER: builtins.int
    WITNESS_BLOCK_APPROVE_FIELD_NUMBER: builtins.int
    DELETE_COMMENT_FIELD_NUMBER: builtins.int
    CUSTOM_JSON_FIELD_NUMBER: builtins.int
    COMMENT_OPTIONS_FIELD_NUMBER: builtins.int
    SET_WITHDRAW_VESTING_ROUTE_FIELD_NUMBER: builtins.int
    LIMIT_ORDER_CREATE2_FIELD_NUMBER: builtins.int
    CLAIM_ACCOUNT_FIELD_NUMBER: builtins.int
    CREATE_CLAIMED_ACCOUNT_FIELD_NUMBER: builtins.int
    REQUEST_ACCOUNT_RECOVERY_FIELD_NUMBER: builtins.int
    RECOVER_ACCOUNT_FIELD_NUMBER: builtins.int
    CHANGE_RECOVERY_ACCOUNT_FIELD_NUMBER: builtins.int
    ESCROW_TRANSFER_FIELD_NUMBER: builtins.int
    ESCROW_DISPUTE_FIELD_NUMBER: builtins.int
    ESCROW_RELEASE_FIELD_NUMBER: builtins.int
    ESCROW_APPROVE_FIELD_NUMBER: builtins.int
    TRANSFER_TO_SAVINGS_FIELD_NUMBER: builtins.int
    TRANSFER_FROM_SAVINGS_FIELD_NUMBER: builtins.int
    CANCEL_TRANSFER_FROM_SAVINGS_FIELD_NUMBER: builtins.int
    DECLINE_VOTING_RIGHTS_FIELD_NUMBER: builtins.int
    CLAIM_REWARD_BALANCE_FIELD_NUMBER: builtins.int
    DELEGATE_VESTING_SHARES_FIELD_NUMBER: builtins.int
    WITNESS_SET_PROPERTIES_FIELD_NUMBER: builtins.int
    ACCOUNT_UPDATE2_FIELD_NUMBER: builtins.int
    CREATE_PROPOSAL_FIELD_NUMBER: builtins.int
    UPDATE_PROPOSAL_VOTES_FIELD_NUMBER: builtins.int
    REMOVE_PROPOSAL_FIELD_NUMBER: builtins.int
    UPDATE_PROPOSAL_FIELD_NUMBER: builtins.int
    COLLATERALIZED_CONVERT_FIELD_NUMBER: builtins.int
    RECURRENT_TRANSFER_FIELD_NUMBER: builtins.int
    FILL_CONVERT_REQUEST_FIELD_NUMBER: builtins.int
    AUTHOR_REWARD_FIELD_NUMBER: builtins.int
    CURATION_REWARD_FIELD_NUMBER: builtins.int
    COMMENT_REWARD_FIELD_NUMBER: builtins.int
    LIQUIDITY_REWARD_FIELD_NUMBER: builtins.int
    INTEREST_FIELD_NUMBER: builtins.int
    FILL_VESTING_WITHDRAW_FIELD_NUMBER: builtins.int
    FILL_ORDER_FIELD_NUMBER: builtins.int
    SHUTDOWN_WITNESS_FIELD_NUMBER: builtins.int
    FILL_TRANSFER_FROM_SAVINGS_FIELD_NUMBER: builtins.int
    HARDFORK_FIELD_NUMBER: builtins.int
    COMMENT_PAYOUT_UPDATE_FIELD_NUMBER: builtins.int
    RETURN_VESTING_DELEGATION_FIELD_NUMBER: builtins.int
    COMMENT_BENEFACTOR_REWARD_FIELD_NUMBER: builtins.int
    PRODUCER_REWARD_FIELD_NUMBER: builtins.int
    CLEAR_NULL_ACCOUNT_BALANCE_FIELD_NUMBER: builtins.int
    PROPOSAL_PAY_FIELD_NUMBER: builtins.int
    DHF_FUNDING_FIELD_NUMBER: builtins.int
    HARDFORK_HIVE_FIELD_NUMBER: builtins.int
    HARDFORK_HIVE_RESTORE_FIELD_NUMBER: builtins.int
    DELAYED_VOTING_FIELD_NUMBER: builtins.int
    CONSOLIDATE_TREASURY_BALANCE_FIELD_NUMBER: builtins.int
    EFFECTIVE_COMMENT_VOTE_FIELD_NUMBER: builtins.int
    INEFFECTIVE_DELETE_COMMENT_FIELD_NUMBER: builtins.int
    DHF_CONVERSION_FIELD_NUMBER: builtins.int
    EXPIRED_ACCOUNT_NOTIFICATION_FIELD_NUMBER: builtins.int
    CHANGED_RECOVERY_ACCOUNT_FIELD_NUMBER: builtins.int
    TRANSFER_TO_VESTING_COMPLETED_FIELD_NUMBER: builtins.int
    POW_REWARD_FIELD_NUMBER: builtins.int
    VESTING_SHARES_SPLIT_FIELD_NUMBER: builtins.int
    ACCOUNT_CREATED_FIELD_NUMBER: builtins.int
    FILL_COLLATERALIZED_CONVERT_REQUEST_FIELD_NUMBER: builtins.int
    SYSTEM_WARNING_FIELD_NUMBER: builtins.int
    FILL_RECURRENT_TRANSFER_FIELD_NUMBER: builtins.int
    FAILED_RECURRENT_TRANSFER_FIELD_NUMBER: builtins.int
    LIMIT_ORDER_CANCELLED_FIELD_NUMBER: builtins.int
    PRODUCER_MISSED_FIELD_NUMBER: builtins.int
    PROPOSAL_FEE_FIELD_NUMBER: builtins.int
    COLLATERALIZED_CONVERT_IMMEDIATE_CONVERSION_FIELD_NUMBER: builtins.int
    ESCROW_APPROVED_FIELD_NUMBER: builtins.int
    ESCROW_REJECTED_FIELD_NUMBER: builtins.int
    PROXY_CLEARED_FIELD_NUMBER: builtins.int
    DECLINED_VOTING_RIGHTS_FIELD_NUMBER: builtins.int
    @property
    def vote(self) -> vote_pb2.vote: ...
    @property
    def comment(self) -> comment_pb2.comment: ...
    @property
    def transfer(self) -> transfer_pb2.transfer: ...
    @property
    def transfer_to_vesting(self) -> transfer_to_vesting_pb2.transfer_to_vesting: ...
    @property
    def withdraw_vesting(self) -> withdraw_vesting_pb2.withdraw_vesting: ...
    @property
    def limit_order_create(self) -> limit_order_create_pb2.limit_order_create: ...
    @property
    def limit_order_cancel(self) -> limit_order_cancel_pb2.limit_order_cancel: ...
    @property
    def feed_publish(self) -> feed_publish_pb2.feed_publish: ...
    @property
    def convert(self) -> convert_pb2.convert: ...
    @property
    def account_create(self) -> account_create_pb2.account_create: ...
    @property
    def account_update(self) -> account_update_pb2.account_update: ...
    @property
    def witness_update(self) -> witness_update_pb2.witness_update: ...
    @property
    def account_witness_vote(self) -> account_witness_vote_pb2.account_witness_vote: ...
    @property
    def account_witness_proxy(self) -> account_witness_proxy_pb2.account_witness_proxy: ...
    @property
    def custom(self) -> custom_pb2.custom: ...
    @property
    def witness_block_approve(self) -> witness_block_approve_pb2.witness_block_approve: ...
    @property
    def delete_comment(self) -> delete_comment_pb2.delete_comment: ...
    @property
    def custom_json(self) -> custom_json_pb2.custom_json: ...
    @property
    def comment_options(self) -> comment_options_pb2.comment_options: ...
    @property
    def set_withdraw_vesting_route(self) -> set_withdraw_vesting_route_pb2.set_withdraw_vesting_route: ...
    @property
    def limit_order_create2(self) -> limit_order_create2_pb2.limit_order_create2: ...
    @property
    def claim_account(self) -> claim_account_pb2.claim_account: ...
    @property
    def create_claimed_account(self) -> create_claimed_account_pb2.create_claimed_account: ...
    @property
    def request_account_recovery(self) -> request_account_recovery_pb2.request_account_recovery: ...
    @property
    def recover_account(self) -> recover_account_pb2.recover_account: ...
    @property
    def change_recovery_account(self) -> change_recovery_account_pb2.change_recovery_account: ...
    @property
    def escrow_transfer(self) -> escrow_transfer_pb2.escrow_transfer: ...
    @property
    def escrow_dispute(self) -> escrow_dispute_pb2.escrow_dispute: ...
    @property
    def escrow_release(self) -> escrow_release_pb2.escrow_release: ...
    @property
    def escrow_approve(self) -> escrow_approve_pb2.escrow_approve: ...
    @property
    def transfer_to_savings(self) -> transfer_to_savings_pb2.transfer_to_savings: ...
    @property
    def transfer_from_savings(self) -> transfer_from_savings_pb2.transfer_from_savings: ...
    @property
    def cancel_transfer_from_savings(self) -> cancel_transfer_from_savings_pb2.cancel_transfer_from_savings: ...
    @property
    def decline_voting_rights(self) -> decline_voting_rights_pb2.decline_voting_rights: ...
    @property
    def claim_reward_balance(self) -> claim_reward_balance_pb2.claim_reward_balance: ...
    @property
    def delegate_vesting_shares(self) -> delegate_vesting_shares_pb2.delegate_vesting_shares: ...
    @property
    def witness_set_properties(self) -> witness_set_properties_pb2.witness_set_properties: ...
    @property
    def account_update2(self) -> account_update2_pb2.account_update2: ...
    @property
    def create_proposal(self) -> create_proposal_pb2.create_proposal: ...
    @property
    def update_proposal_votes(self) -> update_proposal_votes_pb2.update_proposal_votes: ...
    @property
    def remove_proposal(self) -> remove_proposal_pb2.remove_proposal: ...
    @property
    def update_proposal(self) -> update_proposal_pb2.update_proposal: ...
    @property
    def collateralized_convert(self) -> collateralized_convert_pb2.collateralized_convert: ...
    @property
    def recurrent_transfer(self) -> recurrent_transfer_pb2.recurrent_transfer: ...
    @property
    def fill_convert_request(self) -> fill_convert_request_pb2.fill_convert_request:
        """Virtual operations:"""
    @property
    def author_reward(self) -> author_reward_pb2.author_reward: ...
    @property
    def curation_reward(self) -> curation_reward_pb2.curation_reward: ...
    @property
    def comment_reward(self) -> comment_reward_pb2.comment_reward: ...
    @property
    def liquidity_reward(self) -> liquidity_reward_pb2.liquidity_reward: ...
    @property
    def interest(self) -> interest_pb2.interest: ...
    @property
    def fill_vesting_withdraw(self) -> fill_vesting_withdraw_pb2.fill_vesting_withdraw: ...
    @property
    def fill_order(self) -> fill_order_pb2.fill_order: ...
    @property
    def shutdown_witness(self) -> shutdown_witness_pb2.shutdown_witness: ...
    @property
    def fill_transfer_from_savings(self) -> fill_transfer_from_savings_pb2.fill_transfer_from_savings: ...
    @property
    def hardfork(self) -> hardfork_pb2.hardfork: ...
    @property
    def comment_payout_update(self) -> comment_payout_update_pb2.comment_payout_update: ...
    @property
    def return_vesting_delegation(self) -> return_vesting_delegation_pb2.return_vesting_delegation: ...
    @property
    def comment_benefactor_reward(self) -> comment_benefactor_reward_pb2.comment_benefactor_reward: ...
    @property
    def producer_reward(self) -> producer_reward_pb2.producer_reward: ...
    @property
    def clear_null_account_balance(self) -> clear_null_account_balance_pb2.clear_null_account_balance: ...
    @property
    def proposal_pay(self) -> proposal_pay_pb2.proposal_pay: ...
    @property
    def dhf_funding(self) -> dhf_funding_pb2.dhf_funding: ...
    @property
    def hardfork_hive(self) -> hardfork_hive_pb2.hardfork_hive: ...
    @property
    def hardfork_hive_restore(self) -> hardfork_hive_restore_pb2.hardfork_hive_restore: ...
    @property
    def delayed_voting(self) -> delayed_voting_pb2.delayed_voting: ...
    @property
    def consolidate_treasury_balance(self) -> consolidate_treasury_balance_pb2.consolidate_treasury_balance: ...
    @property
    def effective_comment_vote(self) -> effective_comment_vote_pb2.effective_comment_vote: ...
    @property
    def ineffective_delete_comment(self) -> ineffective_delete_comment_pb2.ineffective_delete_comment: ...
    @property
    def dhf_conversion(self) -> dhf_conversion_pb2.dhf_conversion: ...
    @property
    def expired_account_notification(self) -> expired_account_notification_pb2.expired_account_notification: ...
    @property
    def changed_recovery_account(self) -> changed_recovery_account_pb2.changed_recovery_account: ...
    @property
    def transfer_to_vesting_completed(self) -> transfer_to_vesting_completed_pb2.transfer_to_vesting_completed: ...
    @property
    def pow_reward(self) -> pow_reward_pb2.pow_reward: ...
    @property
    def vesting_shares_split(self) -> vesting_shares_split_pb2.vesting_shares_split: ...
    @property
    def account_created(self) -> account_created_pb2.account_created: ...
    @property
    def fill_collateralized_convert_request(self) -> fill_collateralized_convert_request_pb2.fill_collateralized_convert_request: ...
    @property
    def system_warning(self) -> system_warning_pb2.system_warning: ...
    @property
    def fill_recurrent_transfer(self) -> fill_recurrent_transfer_pb2.fill_recurrent_transfer: ...
    @property
    def failed_recurrent_transfer(self) -> failed_recurrent_transfer_pb2.failed_recurrent_transfer: ...
    @property
    def limit_order_cancelled(self) -> limit_order_cancelled_pb2.limit_order_cancelled: ...
    @property
    def producer_missed(self) -> producer_missed_pb2.producer_missed: ...
    @property
    def proposal_fee(self) -> proposal_fee_pb2.proposal_fee: ...
    @property
    def collateralized_convert_immediate_conversion(self) -> collateralized_convert_immediate_conversion_pb2.collateralized_convert_immediate_conversion: ...
    @property
    def escrow_approved(self) -> escrow_approved_pb2.escrow_approved: ...
    @property
    def escrow_rejected(self) -> escrow_rejected_pb2.escrow_rejected: ...
    @property
    def proxy_cleared(self) -> proxy_cleared_pb2.proxy_cleared: ...
    @property
    def declined_voting_rights(self) -> declined_voting_rights_pb2.declined_voting_rights: ...
    def __init__(
        self,
        *,
        vote: vote_pb2.vote | None = ...,
        comment: comment_pb2.comment | None = ...,
        transfer: transfer_pb2.transfer | None = ...,
        transfer_to_vesting: transfer_to_vesting_pb2.transfer_to_vesting | None = ...,
        withdraw_vesting: withdraw_vesting_pb2.withdraw_vesting | None = ...,
        limit_order_create: limit_order_create_pb2.limit_order_create | None = ...,
        limit_order_cancel: limit_order_cancel_pb2.limit_order_cancel | None = ...,
        feed_publish: feed_publish_pb2.feed_publish | None = ...,
        convert: convert_pb2.convert | None = ...,
        account_create: account_create_pb2.account_create | None = ...,
        account_update: account_update_pb2.account_update | None = ...,
        witness_update: witness_update_pb2.witness_update | None = ...,
        account_witness_vote: account_witness_vote_pb2.account_witness_vote | None = ...,
        account_witness_proxy: account_witness_proxy_pb2.account_witness_proxy | None = ...,
        custom: custom_pb2.custom | None = ...,
        witness_block_approve: witness_block_approve_pb2.witness_block_approve | None = ...,
        delete_comment: delete_comment_pb2.delete_comment | None = ...,
        custom_json: custom_json_pb2.custom_json | None = ...,
        comment_options: comment_options_pb2.comment_options | None = ...,
        set_withdraw_vesting_route: set_withdraw_vesting_route_pb2.set_withdraw_vesting_route | None = ...,
        limit_order_create2: limit_order_create2_pb2.limit_order_create2 | None = ...,
        claim_account: claim_account_pb2.claim_account | None = ...,
        create_claimed_account: create_claimed_account_pb2.create_claimed_account | None = ...,
        request_account_recovery: request_account_recovery_pb2.request_account_recovery | None = ...,
        recover_account: recover_account_pb2.recover_account | None = ...,
        change_recovery_account: change_recovery_account_pb2.change_recovery_account | None = ...,
        escrow_transfer: escrow_transfer_pb2.escrow_transfer | None = ...,
        escrow_dispute: escrow_dispute_pb2.escrow_dispute | None = ...,
        escrow_release: escrow_release_pb2.escrow_release | None = ...,
        escrow_approve: escrow_approve_pb2.escrow_approve | None = ...,
        transfer_to_savings: transfer_to_savings_pb2.transfer_to_savings | None = ...,
        transfer_from_savings: transfer_from_savings_pb2.transfer_from_savings | None = ...,
        cancel_transfer_from_savings: cancel_transfer_from_savings_pb2.cancel_transfer_from_savings | None = ...,
        decline_voting_rights: decline_voting_rights_pb2.decline_voting_rights | None = ...,
        claim_reward_balance: claim_reward_balance_pb2.claim_reward_balance | None = ...,
        delegate_vesting_shares: delegate_vesting_shares_pb2.delegate_vesting_shares | None = ...,
        witness_set_properties: witness_set_properties_pb2.witness_set_properties | None = ...,
        account_update2: account_update2_pb2.account_update2 | None = ...,
        create_proposal: create_proposal_pb2.create_proposal | None = ...,
        update_proposal_votes: update_proposal_votes_pb2.update_proposal_votes | None = ...,
        remove_proposal: remove_proposal_pb2.remove_proposal | None = ...,
        update_proposal: update_proposal_pb2.update_proposal | None = ...,
        collateralized_convert: collateralized_convert_pb2.collateralized_convert | None = ...,
        recurrent_transfer: recurrent_transfer_pb2.recurrent_transfer | None = ...,
        fill_convert_request: fill_convert_request_pb2.fill_convert_request | None = ...,
        author_reward: author_reward_pb2.author_reward | None = ...,
        curation_reward: curation_reward_pb2.curation_reward | None = ...,
        comment_reward: comment_reward_pb2.comment_reward | None = ...,
        liquidity_reward: liquidity_reward_pb2.liquidity_reward | None = ...,
        interest: interest_pb2.interest | None = ...,
        fill_vesting_withdraw: fill_vesting_withdraw_pb2.fill_vesting_withdraw | None = ...,
        fill_order: fill_order_pb2.fill_order | None = ...,
        shutdown_witness: shutdown_witness_pb2.shutdown_witness | None = ...,
        fill_transfer_from_savings: fill_transfer_from_savings_pb2.fill_transfer_from_savings | None = ...,
        hardfork: hardfork_pb2.hardfork | None = ...,
        comment_payout_update: comment_payout_update_pb2.comment_payout_update | None = ...,
        return_vesting_delegation: return_vesting_delegation_pb2.return_vesting_delegation | None = ...,
        comment_benefactor_reward: comment_benefactor_reward_pb2.comment_benefactor_reward | None = ...,
        producer_reward: producer_reward_pb2.producer_reward | None = ...,
        clear_null_account_balance: clear_null_account_balance_pb2.clear_null_account_balance | None = ...,
        proposal_pay: proposal_pay_pb2.proposal_pay | None = ...,
        dhf_funding: dhf_funding_pb2.dhf_funding | None = ...,
        hardfork_hive: hardfork_hive_pb2.hardfork_hive | None = ...,
        hardfork_hive_restore: hardfork_hive_restore_pb2.hardfork_hive_restore | None = ...,
        delayed_voting: delayed_voting_pb2.delayed_voting | None = ...,
        consolidate_treasury_balance: consolidate_treasury_balance_pb2.consolidate_treasury_balance | None = ...,
        effective_comment_vote: effective_comment_vote_pb2.effective_comment_vote | None = ...,
        ineffective_delete_comment: ineffective_delete_comment_pb2.ineffective_delete_comment | None = ...,
        dhf_conversion: dhf_conversion_pb2.dhf_conversion | None = ...,
        expired_account_notification: expired_account_notification_pb2.expired_account_notification | None = ...,
        changed_recovery_account: changed_recovery_account_pb2.changed_recovery_account | None = ...,
        transfer_to_vesting_completed: transfer_to_vesting_completed_pb2.transfer_to_vesting_completed | None = ...,
        pow_reward: pow_reward_pb2.pow_reward | None = ...,
        vesting_shares_split: vesting_shares_split_pb2.vesting_shares_split | None = ...,
        account_created: account_created_pb2.account_created | None = ...,
        fill_collateralized_convert_request: fill_collateralized_convert_request_pb2.fill_collateralized_convert_request | None = ...,
        system_warning: system_warning_pb2.system_warning | None = ...,
        fill_recurrent_transfer: fill_recurrent_transfer_pb2.fill_recurrent_transfer | None = ...,
        failed_recurrent_transfer: failed_recurrent_transfer_pb2.failed_recurrent_transfer | None = ...,
        limit_order_cancelled: limit_order_cancelled_pb2.limit_order_cancelled | None = ...,
        producer_missed: producer_missed_pb2.producer_missed | None = ...,
        proposal_fee: proposal_fee_pb2.proposal_fee | None = ...,
        collateralized_convert_immediate_conversion: collateralized_convert_immediate_conversion_pb2.collateralized_convert_immediate_conversion | None = ...,
        escrow_approved: escrow_approved_pb2.escrow_approved | None = ...,
        escrow_rejected: escrow_rejected_pb2.escrow_rejected | None = ...,
        proxy_cleared: proxy_cleared_pb2.proxy_cleared | None = ...,
        declined_voting_rights: declined_voting_rights_pb2.declined_voting_rights | None = ...,
    ) -> None: ...
    def HasField(self, field_name: typing_extensions.Literal["account_create", b"account_create", "account_created", b"account_created", "account_update", b"account_update", "account_update2", b"account_update2", "account_witness_proxy", b"account_witness_proxy", "account_witness_vote", b"account_witness_vote", "author_reward", b"author_reward", "cancel_transfer_from_savings", b"cancel_transfer_from_savings", "change_recovery_account", b"change_recovery_account", "changed_recovery_account", b"changed_recovery_account", "claim_account", b"claim_account", "claim_reward_balance", b"claim_reward_balance", "clear_null_account_balance", b"clear_null_account_balance", "collateralized_convert", b"collateralized_convert", "collateralized_convert_immediate_conversion", b"collateralized_convert_immediate_conversion", "comment", b"comment", "comment_benefactor_reward", b"comment_benefactor_reward", "comment_options", b"comment_options", "comment_payout_update", b"comment_payout_update", "comment_reward", b"comment_reward", "consolidate_treasury_balance", b"consolidate_treasury_balance", "convert", b"convert", "create_claimed_account", b"create_claimed_account", "create_proposal", b"create_proposal", "curation_reward", b"curation_reward", "custom", b"custom", "custom_json", b"custom_json", "decline_voting_rights", b"decline_voting_rights", "declined_voting_rights", b"declined_voting_rights", "delayed_voting", b"delayed_voting", "delegate_vesting_shares", b"delegate_vesting_shares", "delete_comment", b"delete_comment", "dhf_conversion", b"dhf_conversion", "dhf_funding", b"dhf_funding", "effective_comment_vote", b"effective_comment_vote", "escrow_approve", b"escrow_approve", "escrow_approved", b"escrow_approved", "escrow_dispute", b"escrow_dispute", "escrow_rejected", b"escrow_rejected", "escrow_release", b"escrow_release", "escrow_transfer", b"escrow_transfer", "expired_account_notification", b"expired_account_notification", "failed_recurrent_transfer", b"failed_recurrent_transfer", "feed_publish", b"feed_publish", "fill_collateralized_convert_request", b"fill_collateralized_convert_request", "fill_convert_request", b"fill_convert_request", "fill_order", b"fill_order", "fill_recurrent_transfer", b"fill_recurrent_transfer", "fill_transfer_from_savings", b"fill_transfer_from_savings", "fill_vesting_withdraw", b"fill_vesting_withdraw", "hardfork", b"hardfork", "hardfork_hive", b"hardfork_hive", "hardfork_hive_restore", b"hardfork_hive_restore", "ineffective_delete_comment", b"ineffective_delete_comment", "interest", b"interest", "limit_order_cancel", b"limit_order_cancel", "limit_order_cancelled", b"limit_order_cancelled", "limit_order_create", b"limit_order_create", "limit_order_create2", b"limit_order_create2", "liquidity_reward", b"liquidity_reward", "pow_reward", b"pow_reward", "producer_missed", b"producer_missed", "producer_reward", b"producer_reward", "proposal_fee", b"proposal_fee", "proposal_pay", b"proposal_pay", "proxy_cleared", b"proxy_cleared", "recover_account", b"recover_account", "recurrent_transfer", b"recurrent_transfer", "remove_proposal", b"remove_proposal", "request_account_recovery", b"request_account_recovery", "return_vesting_delegation", b"return_vesting_delegation", "set_withdraw_vesting_route", b"set_withdraw_vesting_route", "shutdown_witness", b"shutdown_witness", "system_warning", b"system_warning", "transfer", b"transfer", "transfer_from_savings", b"transfer_from_savings", "transfer_to_savings", b"transfer_to_savings", "transfer_to_vesting", b"transfer_to_vesting", "transfer_to_vesting_completed", b"transfer_to_vesting_completed", "update_proposal", b"update_proposal", "update_proposal_votes", b"update_proposal_votes", "value", b"value", "vesting_shares_split", b"vesting_shares_split", "vote", b"vote", "withdraw_vesting", b"withdraw_vesting", "witness_block_approve", b"witness_block_approve", "witness_set_properties", b"witness_set_properties", "witness_update", b"witness_update"]) -> builtins.bool: ...
    def ClearField(self, field_name: typing_extensions.Literal["account_create", b"account_create", "account_created", b"account_created", "account_update", b"account_update", "account_update2", b"account_update2", "account_witness_proxy", b"account_witness_proxy", "account_witness_vote", b"account_witness_vote", "author_reward", b"author_reward", "cancel_transfer_from_savings", b"cancel_transfer_from_savings", "change_recovery_account", b"change_recovery_account", "changed_recovery_account", b"changed_recovery_account", "claim_account", b"claim_account", "claim_reward_balance", b"claim_reward_balance", "clear_null_account_balance", b"clear_null_account_balance", "collateralized_convert", b"collateralized_convert", "collateralized_convert_immediate_conversion", b"collateralized_convert_immediate_conversion", "comment", b"comment", "comment_benefactor_reward", b"comment_benefactor_reward", "comment_options", b"comment_options", "comment_payout_update", b"comment_payout_update", "comment_reward", b"comment_reward", "consolidate_treasury_balance", b"consolidate_treasury_balance", "convert", b"convert", "create_claimed_account", b"create_claimed_account", "create_proposal", b"create_proposal", "curation_reward", b"curation_reward", "custom", b"custom", "custom_json", b"custom_json", "decline_voting_rights", b"decline_voting_rights", "declined_voting_rights", b"declined_voting_rights", "delayed_voting", b"delayed_voting", "delegate_vesting_shares", b"delegate_vesting_shares", "delete_comment", b"delete_comment", "dhf_conversion", b"dhf_conversion", "dhf_funding", b"dhf_funding", "effective_comment_vote", b"effective_comment_vote", "escrow_approve", b"escrow_approve", "escrow_approved", b"escrow_approved", "escrow_dispute", b"escrow_dispute", "escrow_rejected", b"escrow_rejected", "escrow_release", b"escrow_release", "escrow_transfer", b"escrow_transfer", "expired_account_notification", b"expired_account_notification", "failed_recurrent_transfer", b"failed_recurrent_transfer", "feed_publish", b"feed_publish", "fill_collateralized_convert_request", b"fill_collateralized_convert_request", "fill_convert_request", b"fill_convert_request", "fill_order", b"fill_order", "fill_recurrent_transfer", b"fill_recurrent_transfer", "fill_transfer_from_savings", b"fill_transfer_from_savings", "fill_vesting_withdraw", b"fill_vesting_withdraw", "hardfork", b"hardfork", "hardfork_hive", b"hardfork_hive", "hardfork_hive_restore", b"hardfork_hive_restore", "ineffective_delete_comment", b"ineffective_delete_comment", "interest", b"interest", "limit_order_cancel", b"limit_order_cancel", "limit_order_cancelled", b"limit_order_cancelled", "limit_order_create", b"limit_order_create", "limit_order_create2", b"limit_order_create2", "liquidity_reward", b"liquidity_reward", "pow_reward", b"pow_reward", "producer_missed", b"producer_missed", "producer_reward", b"producer_reward", "proposal_fee", b"proposal_fee", "proposal_pay", b"proposal_pay", "proxy_cleared", b"proxy_cleared", "recover_account", b"recover_account", "recurrent_transfer", b"recurrent_transfer", "remove_proposal", b"remove_proposal", "request_account_recovery", b"request_account_recovery", "return_vesting_delegation", b"return_vesting_delegation", "set_withdraw_vesting_route", b"set_withdraw_vesting_route", "shutdown_witness", b"shutdown_witness", "system_warning", b"system_warning", "transfer", b"transfer", "transfer_from_savings", b"transfer_from_savings", "transfer_to_savings", b"transfer_to_savings", "transfer_to_vesting", b"transfer_to_vesting", "transfer_to_vesting_completed", b"transfer_to_vesting_completed", "update_proposal", b"update_proposal", "update_proposal_votes", b"update_proposal_votes", "value", b"value", "vesting_shares_split", b"vesting_shares_split", "vote", b"vote", "withdraw_vesting", b"withdraw_vesting", "witness_block_approve", b"witness_block_approve", "witness_set_properties", b"witness_set_properties", "witness_update", b"witness_update"]) -> None: ...
    def WhichOneof(self, oneof_group: typing_extensions.Literal["value", b"value"]) -> typing_extensions.Literal["vote", "comment", "transfer", "transfer_to_vesting", "withdraw_vesting", "limit_order_create", "limit_order_cancel", "feed_publish", "convert", "account_create", "account_update", "witness_update", "account_witness_vote", "account_witness_proxy", "custom", "witness_block_approve", "delete_comment", "custom_json", "comment_options", "set_withdraw_vesting_route", "limit_order_create2", "claim_account", "create_claimed_account", "request_account_recovery", "recover_account", "change_recovery_account", "escrow_transfer", "escrow_dispute", "escrow_release", "escrow_approve", "transfer_to_savings", "transfer_from_savings", "cancel_transfer_from_savings", "decline_voting_rights", "claim_reward_balance", "delegate_vesting_shares", "witness_set_properties", "account_update2", "create_proposal", "update_proposal_votes", "remove_proposal", "update_proposal", "collateralized_convert", "recurrent_transfer", "fill_convert_request", "author_reward", "curation_reward", "comment_reward", "liquidity_reward", "interest", "fill_vesting_withdraw", "fill_order", "shutdown_witness", "fill_transfer_from_savings", "hardfork", "comment_payout_update", "return_vesting_delegation", "comment_benefactor_reward", "producer_reward", "clear_null_account_balance", "proposal_pay", "dhf_funding", "hardfork_hive", "hardfork_hive_restore", "delayed_voting", "consolidate_treasury_balance", "effective_comment_vote", "ineffective_delete_comment", "dhf_conversion", "expired_account_notification", "changed_recovery_account", "transfer_to_vesting_completed", "pow_reward", "vesting_shares_split", "account_created", "fill_collateralized_convert_request", "system_warning", "fill_recurrent_transfer", "failed_recurrent_transfer", "limit_order_cancelled", "producer_missed", "proposal_fee", "collateralized_convert_immediate_conversion", "escrow_approved", "escrow_rejected", "proxy_cleared", "declined_voting_rights"] | None: ...

global___operation = operation
