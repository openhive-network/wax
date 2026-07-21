// Rust port of `ts/wasm/__tests__/detailed/non_encrypted_operations.ts`.
//
// Tests appear in TS source order. Each Rust test has a `// TS line N` comment
// pointing back to the TS original.
//
// Every test pushes a single operation without encryption support inside an
// open encryption range and runs the full encrypt + sign + decrypt round trip
// of `util_function_test`; the operation must pass through unchanged.
//
// TS NOTE: the witness-update and witness-set-properties variants are
// commented out in the TS source (`// XXX`) and are deliberately not ported.

use wax::proto::{self, operation::Value as OperationValue};

use crate::common::{WaxTestCtx, wax_test};
use crate::encryption_data::{
    account_create_op, account_create_with_delegation_op, account_update_op,
    account_update2_op, account_witness_proxy_op, account_witness_vote_op,
    cancel_transfer_from_savings_op, change_recovery_account_op,
    claim_account_op, claim_reward_balance_op, collateralized_convert_op,
    comment_options_op, convert_op, create_claimed_account_op,
    create_proposal_op, decline_voting_rights_op, delegate_vesting_shares_op,
    delete_comment_op, escrow_approve_op, escrow_dispute_op, escrow_release_op,
    escrow_transfer_op, feed_publish_op, limit_order_cancel_op,
    limit_order_create_op, limit_order_create2_op, remove_proposal_op,
    request_account_recovery_op, set_withdraw_vesting_route_op,
    transfer_to_vesting_op, update_proposal_op, update_proposal_votes_op,
    util_function_test, vote_op, withdraw_vesting_op, witness_block_approve_op,
};

/// Runs the encryption pass-through round trip: `value` has no encryptable
/// field, so it must come back from encrypt + sign + decrypt untouched.
fn assert_pass_through(ctx: &WaxTestCtx, value: OperationValue) {
    let expected = proto::Operation {
        value: Some(value.clone()),
    };
    let result = util_function_test(
        ctx,
        |tx, _| {
            tx.push_operation(ctx.base.create_operation(value));
        },
        &[],
        false,
    );

    assert_eq!(result.operations[0], expected);
}

// TS line 45: "Should be able to pass through encryption on transaction with
// vote operation which does not support encryption".
#[test]
fn pass_through_vote_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, vote_op()));
}

// TS line 55: "... transfer to vesting operation ...".
#[test]
fn pass_through_transfer_to_vesting_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, transfer_to_vesting_op())
    });
}

// TS line 65: "... withdraw vesting operation ...".
#[test]
fn pass_through_withdraw_vesting_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, withdraw_vesting_op()));
}

// TS line 75: "... limit order create operation ...".
#[test]
fn pass_through_limit_order_create_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, limit_order_create_op())
    });
}

// TS line 85: "... limit order cancel operation ...".
#[test]
fn pass_through_limit_order_cancel_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, limit_order_cancel_op())
    });
}

// TS line 95: "... feed publish operation ...".
#[test]
fn pass_through_feed_publish_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, feed_publish_op()));
}

// TS line 105: "... convert operation ...".
#[test]
fn pass_through_convert_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, convert_op()));
}

// TS line 115: "... account create operation ...".
#[test]
fn pass_through_account_create_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, account_create_op()));
}

// TS line 125: "... account update operation ...".
#[test]
fn pass_through_account_update_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, account_update_op()));
}

// TS line 144: "... account witness vote operation ...".
#[test]
fn pass_through_account_witness_vote_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, account_witness_vote_op())
    });
}

// TS line 154: "... account witness proxy operation ...".
#[test]
fn pass_through_account_witness_proxy_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, account_witness_proxy_op())
    });
}

// TS line 164: "... witness block approve operation ...".
#[test]
fn pass_through_witness_block_approve_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, witness_block_approve_op())
    });
}

// TS line 174: "... delete comment operation ...".
#[test]
fn pass_through_delete_comment_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, delete_comment_op()));
}

// TS line 184: "... comment options operation ...".
#[test]
fn pass_through_comment_options_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, comment_options_op()));
}

// TS line 194: "... set withdraw vesting route operation ...".
#[test]
fn pass_through_set_withdraw_vesting_route_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, set_withdraw_vesting_route_op())
    });
}

// TS line 204: "... limit order create 2 operation ...".
#[test]
fn pass_through_limit_order_create2_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, limit_order_create2_op())
    });
}

// TS line 214: "... claim account operation ...".
#[test]
fn pass_through_claim_account_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, claim_account_op()));
}

// TS line 224: "... create claimed account operation ...".
#[test]
fn pass_through_create_claimed_account_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, create_claimed_account_op())
    });
}

// TS line 234: "... request account recovery operation ...".
#[test]
fn pass_through_request_account_recovery_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, request_account_recovery_op())
    });
}

// TS line 244: "... change recovery account operation ...".
#[test]
fn pass_through_change_recovery_account_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, change_recovery_account_op())
    });
}

// TS line 254: "... escrow transfer operation ...".
#[test]
fn pass_through_escrow_transfer_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, escrow_transfer_op()));
}

// TS line 264: "... escrow dispute operation ...".
#[test]
fn pass_through_escrow_dispute_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, escrow_dispute_op()));
}

// TS line 274: "... escrow release operation ...".
#[test]
fn pass_through_escrow_release_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, escrow_release_op()));
}

// TS line 284: "... escrow approve operation ...".
#[test]
fn pass_through_escrow_approve_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, escrow_approve_op()));
}

// TS line 294: "... cancel transfer from savings operation ...".
#[test]
fn pass_through_cancel_transfer_from_savings_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, cancel_transfer_from_savings_op())
    });
}

// TS line 304: "... decline voting rights operation ...".
#[test]
fn pass_through_decline_voting_rights_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, decline_voting_rights_op())
    });
}

// TS line 314: "... claim reward balance operation ...".
#[test]
fn pass_through_claim_reward_balance_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, claim_reward_balance_op())
    });
}

// TS line 324: "... delegate vesting shares operation ...".
#[test]
fn pass_through_delegate_vesting_shares_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, delegate_vesting_shares_op())
    });
}

// TS line 334: "... account create with delegation operation ...".
#[test]
fn pass_through_account_create_with_delegation_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, account_create_with_delegation_op())
    });
}

// TS line 353: "... account update 2 operation ...".
#[test]
fn pass_through_account_update2_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, account_update2_op()));
}

// TS line 363: "... create proposal operation ...".
#[test]
fn pass_through_create_proposal_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, create_proposal_op()));
}

// TS line 373: "... update proposal votes operation ...".
#[test]
fn pass_through_update_proposal_votes_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, update_proposal_votes_op())
    });
}

// TS line 383: "... remove proposal operation ...".
#[test]
fn pass_through_remove_proposal_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, remove_proposal_op()));
}

// TS line 393: "... update proposal operation ...".
#[test]
fn pass_through_update_proposal_operation() {
    wax_test(None, |ctx| assert_pass_through(ctx, update_proposal_op()));
}

// TS line 403: "... collateralized converts operation ...".
#[test]
fn pass_through_collateralized_convert_operation() {
    wax_test(None, |ctx| {
        assert_pass_through(ctx, collateralized_convert_op())
    });
}
