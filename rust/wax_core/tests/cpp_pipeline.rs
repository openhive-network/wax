#![cfg(feature = "with_cpp_core")]

use wax_core::proto::{operation::Value, Operation, Vote};
use wax_core::{new_rust_protocol, RustOperation, RustTransaction};

#[test]
fn new_rust_protocol_returns_non_null_instance() {
    let protocol = new_rust_protocol();
    assert!(!protocol.is_null());
}

#[test]
fn vote_operation_round_trips_into_hive_operation_handle() {
    let op = RustOperation::new(Value::VoteOperation(Vote {
        voter: "alice".into(),
        author: "bob".into(),
        permlink: "post-1".into(),
        weight: 10_000,
    }));

    let protocol = new_rust_protocol();
    let handle = protocol
        .cpp_create_operation_handle(op.to_managed())
        .expect("cpp_create_operation_handle should succeed for a valid vote operation");

    assert!(!handle.is_null(), "expected a populated hive_operation_handle");
}

#[test]
fn transaction_handle_accepts_added_operation() {
    let ops = vec![Operation {
        value: Some(Value::VoteOperation(Vote {
            voter: "first".into(),
            author: "a".into(),
            permlink: "p".into(),
            weight: 1,
        })),
    }];
    let tx = RustTransaction::new(42, 0xdead_beef, "2026-05-11T12:00:00", ops);
    let extra_op = RustOperation::new(Value::VoteOperation(Vote {
        voter: "second".into(),
        author: "a".into(),
        permlink: "p".into(),
        weight: 2,
    }));

    let protocol = new_rust_protocol();
    let mut tx_handle = protocol
        .cpp_create_transaction_handle(tx.to_managed())
        .expect("transaction should ingest cleanly");
    assert!(!tx_handle.is_null());

    let op_handle = protocol
        .cpp_create_operation_handle(extra_op.to_managed())
        .expect("operation should ingest cleanly");
    assert!(!op_handle.is_null());

    protocol
        .cpp_tx_add_operation(tx_handle.pin_mut(), &op_handle)
        .expect("appending an operation to the transaction handle should succeed");
}
