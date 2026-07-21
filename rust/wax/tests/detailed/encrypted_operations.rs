// Rust port of `ts/wasm/__tests__/detailed/encrypted_operations.ts`.
//
// Tests appear in TS source order. Each Rust test has a `// TS line N` comment
// pointing back to the TS original.
//
// Every test drives `util_function_test` (see `encryption_data.rs`): the
// pushed operations are encrypted, signed and decrypted again, and the final
// assertion checks the decrypted transaction equals the original input.

use wax::proto::{self, operation::Value as OperationValue};

use crate::common::{WaxTestCtx, wax_test};
use crate::encryption_data::{
    comment_op, convert_op, custom_json_op, recurrent_transfer_op,
    transfer_from_savings_op, transfer_op, transfer_to_savings_op,
    util_function_test, vote_op,
};

fn expected_op(value: &OperationValue) -> proto::Operation {
    proto::Operation {
        value: Some(value.clone()),
    }
}

/// Runs the single-operation round trip shared by most tests in this file:
/// encrypt `value` (optionally for two recipient keys), sign, decrypt, then
/// assert the operation came back unchanged.
fn assert_encrypt_round_trip(
    ctx: &WaxTestCtx,
    value: OperationValue,
    other_encryption_key: bool,
) {
    let expected = expected_op(&value);
    let result = util_function_test(
        ctx,
        |tx, _| {
            tx.push_operation(ctx.base.create_operation(value));
        },
        &[],
        other_encryption_key,
    );

    assert_eq!(result.operations[0], expected);
}

// TS line 18: "Should be able to encrypt transaction with comment operation".
#[test]
fn encrypt_tx_with_comment_operation() {
    wax_test(None, |ctx| {
        assert_encrypt_round_trip(ctx, comment_op(), false);
    });
}

// TS line 28: "Should be able to encrypt transaction with transfer
// operation".
#[test]
fn encrypt_tx_with_transfer_operation() {
    wax_test(None, |ctx| {
        assert_encrypt_round_trip(ctx, transfer_op(), false);
    });
}

// TS line 38: "Should be able to encrypt transaction with custom json
// operation".
#[test]
fn encrypt_tx_with_custom_json_operation() {
    wax_test(None, |ctx| {
        assert_encrypt_round_trip(ctx, custom_json_op(), false);
    });
}

// TS line 48: "Should be able to encrypt transaction with transfer to savings
// operation".
#[test]
fn encrypt_tx_with_transfer_to_savings_operation() {
    wax_test(None, |ctx| {
        assert_encrypt_round_trip(ctx, transfer_to_savings_op(), false);
    });
}

// TS line 58: "Should be able to encrypt transaction with transfer from
// savings operation".
#[test]
fn encrypt_tx_with_transfer_from_savings_operation() {
    wax_test(None, |ctx| {
        assert_encrypt_round_trip(ctx, transfer_from_savings_op(), false);
    });
}

// TS line 68: "Should be able to encrypt transaction with recurrent transfer
// operation".
#[test]
fn encrypt_tx_with_recurrent_transfer_operation() {
    wax_test(None, |ctx| {
        assert_encrypt_round_trip(ctx, recurrent_transfer_op(), false);
    });
}

// TS line 78: "Should be able to encrypt transaction with different
// operations".
#[test]
fn encrypt_tx_with_different_operations() {
    wax_test(None, |ctx| {
        let ops = [
            recurrent_transfer_op(),
            convert_op(),
            transfer_to_savings_op(),
            vote_op(),
            comment_op(),
            transfer_op(),
        ];
        let expected: Vec<proto::Operation> =
            ops.iter().map(expected_op).collect();

        let result = util_function_test(
            ctx,
            |tx, _| {
                for op in ops {
                    tx.push_operation(ctx.base.create_operation(op));
                }
            },
            &[1, 3],
            false,
        );

        assert_eq!(result.operations, expected);
    });
}

// TS line 88: "Should be able to encrypt transaction with comment operation
// with different keys".
#[test]
fn encrypt_tx_with_comment_operation_with_different_keys() {
    wax_test(None, |ctx| {
        assert_encrypt_round_trip(ctx, comment_op(), true);
    });
}

// TS line 98: "Should be able to encrypt transaction with recurrent transfer
// operation with different keys".
#[test]
fn encrypt_tx_with_recurrent_transfer_operation_with_different_keys() {
    wax_test(None, |ctx| {
        assert_encrypt_round_trip(ctx, recurrent_transfer_op(), true);
    });
}

// TS line 108: "Should be able to encrypt transaction with transfer to
// savings operation with different keys".
#[test]
fn encrypt_tx_with_transfer_to_savings_operation_with_different_keys() {
    wax_test(None, |ctx| {
        assert_encrypt_round_trip(ctx, transfer_to_savings_op(), true);
    });
}

// TS line 118: "Should be able to encrypt transaction with different
// operations with different keys".
#[test]
fn encrypt_tx_with_different_operations_with_different_keys() {
    wax_test(None, |ctx| {
        let ops = [
            recurrent_transfer_op(),
            convert_op(),
            transfer_to_savings_op(),
            vote_op(),
            comment_op(),
            transfer_op(),
        ];
        let expected: Vec<proto::Operation> =
            ops.iter().map(expected_op).collect();

        let result = util_function_test(
            ctx,
            |tx, keys| {
                let [
                    recurrent_transfer,
                    convert,
                    transfer_to_savings,
                    vote,
                    comment,
                    transfer,
                ] = ops;
                tx.push_operation(
                    ctx.base.create_operation(recurrent_transfer),
                );
                tx.stop_encrypt().expect("stop_encrypt");
                tx.push_operation(ctx.base.create_operation(convert));
                tx.start_encrypt(&keys[0], keys.get(1).map(String::as_str));
                tx.push_operation(
                    ctx.base.create_operation(transfer_to_savings),
                );
                tx.stop_encrypt().expect("stop_encrypt");
                tx.push_operation(ctx.base.create_operation(vote));
                tx.start_encrypt(&keys[0], keys.get(1).map(String::as_str));
                tx.push_operation(ctx.base.create_operation(comment));
                tx.push_operation(ctx.base.create_operation(transfer));
            },
            &[1, 3],
            true,
        );

        assert_eq!(result.operations, expected);
    });
}

// TS line 138: "Should be able to encrypt some specific operations in
// transaction".
//
// TS NOTE: index 6 (the trailing vote) is left out of the non-encrypted list
// on purpose — the TS test uses it to prove the `EncryptionVisitor` never
// invokes its callback for operations without an encryptable field.
#[test]
fn encrypt_specific_operations() {
    wax_test(None, |ctx| {
        let ops = [
            recurrent_transfer_op(),
            convert_op(),
            transfer_to_savings_op(),
            vote_op(),
            comment_op(),
            transfer_op(),
            vote_op(),
        ];
        let expected: Vec<proto::Operation> =
            ops.iter().map(expected_op).collect();

        let result = util_function_test(
            ctx,
            |tx, keys| {
                let [
                    recurrent_transfer,
                    convert,
                    transfer_to_savings,
                    vote,
                    comment,
                    transfer,
                    final_vote,
                ] = ops;
                tx.push_operation(
                    ctx.base.create_operation(recurrent_transfer),
                );
                tx.stop_encrypt().expect("stop_encrypt");
                tx.push_operation(ctx.base.create_operation(convert));
                tx.push_operation(
                    ctx.base.create_operation(transfer_to_savings),
                );
                tx.push_operation(ctx.base.create_operation(vote));
                tx.start_encrypt(&keys[0], keys.get(1).map(String::as_str));
                tx.push_operation(ctx.base.create_operation(comment));
                tx.stop_encrypt().expect("stop_encrypt");
                tx.push_operation(ctx.base.create_operation(transfer));
                // The lambda ends with an open encryption range so the shared
                // helper can close it itself, exactly like the TS original.
                tx.start_encrypt(&keys[0], None);
                tx.push_operation(ctx.base.create_operation(final_vote));
            },
            &[1, 2, 3, 5],
            false,
        );

        assert_eq!(result.operations, expected);
    });
}

// TS line 159: "Should be able to encrypt some specific operations in
// transaction with a barren keys pair at the end".
#[test]
fn encrypt_specific_operations_with_barren_keys_pair_at_end() {
    wax_test(None, |ctx| {
        let ops = [
            recurrent_transfer_op(),
            convert_op(),
            transfer_to_savings_op(),
            vote_op(),
            comment_op(),
            transfer_op(),
        ];
        let expected: Vec<proto::Operation> =
            ops.iter().map(expected_op).collect();

        let result = util_function_test(
            ctx,
            |tx, keys| {
                let [
                    recurrent_transfer,
                    convert,
                    transfer_to_savings,
                    vote,
                    comment,
                    transfer,
                ] = ops;
                tx.push_operation(
                    ctx.base.create_operation(recurrent_transfer),
                );
                tx.stop_encrypt().expect("stop_encrypt");
                tx.push_operation(ctx.base.create_operation(convert));
                tx.push_operation(
                    ctx.base.create_operation(transfer_to_savings),
                );
                tx.push_operation(ctx.base.create_operation(vote));
                tx.start_encrypt(&keys[0], keys.get(1).map(String::as_str));
                tx.push_operation(ctx.base.create_operation(comment));
                tx.stop_encrypt().expect("stop_encrypt");
                tx.push_operation(ctx.base.create_operation(transfer));
                // Open a final range that never receives an operation — the
                // "barren keys pair" the TS test name refers to.
                tx.start_encrypt(&keys[0], keys.get(1).map(String::as_str));
            },
            &[1, 2, 3, 5],
            true,
        );

        assert_eq!(result.operations, expected);
    });
}
