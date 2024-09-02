import {
  operation, limit_order_cancel, vote, comment, recurrent_transfer, account_create,
  account_create_with_delegation, account_update, account_update2, account_witness_proxy,
  account_witness_vote, cancel_transfer_from_savings, change_recovery_account, claim_account,
  claim_reward_balance, collateralized_convert, comment_options, convert, create_claimed_account,
  create_proposal, custom, custom_json, decline_voting_rights, delegate_vesting_shares, delete_comment,
  escrow_approve, escrow_dispute, escrow_release, escrow_transfer, feed_publish, limit_order_create,
  limit_order_create2, pow, pow2, recover_account, remove_proposal, request_account_recovery,
  set_withdraw_vesting_route, transfer, transfer_from_savings, transfer_to_savings,
  transfer_to_vesting, update_proposal, update_proposal_votes, withdraw_vesting,
  witness_block_approve, witness_set_properties, witness_update
} from "./protocol.js";

export type TOperationVisitor<R = void> = {
  [K in keyof Required<operation>]?: (op: Required<operation>[K]) => R;
};

// https://github.com/Microsoft/TypeScript/issues/8306#issuecomment-1636697326
declare const _: unique symbol;
type NoOverride = { [_]: typeof _; };

export class OperationVisitor<R = void> implements TOperationVisitor<R> {
  /**
   * You should not override this method
   */
  readonly accept = (op: operation): NoOverride & (R | void) => {
    const key = Object.keys(op).filter((key: string) => typeof op[key] !== 'undefined')[0] as (keyof operation | undefined);

    if(typeof key !== 'undefined')
      return this[key]?.(op[key] as any) as (NoOverride & R);
  };

  vote?(op: vote): R;
  comment?(op: comment): R;
  transfer?(op: transfer): R;
  transfer_to_vesting?(op: transfer_to_vesting): R;
  withdraw_vesting?(op: withdraw_vesting): R;
  limit_order_create?(op: limit_order_create): R;
  limit_order_cancel?(op: limit_order_cancel): R;
  feed_publish?(op: feed_publish): R;
  convert?(op: convert): R;
  account_create?(op: account_create): R;
  account_update?(op: account_update): R;
  witness_update?(op: witness_update): R;
  account_witness_vote?(op: account_witness_vote): R;
  account_witness_proxy?(op: account_witness_proxy): R;
  pow?(op: pow): R;
  custom?(op: custom): R;
  witness_block_approve?(op: witness_block_approve): R;
  delete_comment?(op: delete_comment): R;
  custom_json?(op: custom_json): R;
  comment_options?(op: comment_options): R;
  set_withdraw_vesting_route?(op: set_withdraw_vesting_route): R;
  limit_order_create2?(op: limit_order_create2): R;
  claim_account?(op: claim_account): R;
  create_claimed_account?(op: create_claimed_account): R;
  request_account_recovery?(op: request_account_recovery): R;
  recover_account?(op: recover_account): R;
  change_recovery_account?(op: change_recovery_account): R;
  escrow_transfer?(op: escrow_transfer): R;
  escrow_dispute?(op: escrow_dispute): R;
  escrow_release?(op: escrow_release): R;
  pow2?(op: pow2): R;
  escrow_approve?(op: escrow_approve): R;
  transfer_to_savings?(op: transfer_to_savings): R;
  transfer_from_savings?(op: transfer_from_savings): R;
  cancel_transfer_from_savings?(op: cancel_transfer_from_savings): R;
  decline_voting_rights?(op: decline_voting_rights): R;
  claim_reward_balance?(op: claim_reward_balance): R;
  delegate_vesting_shares?(op: delegate_vesting_shares): R;
  account_create_with_delegation?(op: account_create_with_delegation): R;
  witness_set_properties?(op: witness_set_properties): R;
  account_update2?(op: account_update2): R;
  create_proposal?(op: create_proposal): R;
  update_proposal_votes?(op: update_proposal_votes): R;
  remove_proposal?(op: remove_proposal): R;
  update_proposal?(op: update_proposal): R;
  collateralized_convert?(op: collateralized_convert): R;
  recurrent_transfer?(op: recurrent_transfer): R;
}
