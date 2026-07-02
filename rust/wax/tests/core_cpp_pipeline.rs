use wax::core::proto::{Operation, Vote, operation::Value};
use wax::core::{RustOperation, RustTransaction, new_rust_protocol};

#[test]
fn new_rust_protocol_returns_non_null_instance() {
    let protocol = new_rust_protocol();
    assert!(!protocol.is_null());
}

#[test]
fn vote_operation_round_trips_into_hive_operation_handle() {
    let protocol = new_rust_protocol();
    let op = RustOperation::new(
        protocol.as_ref().unwrap(),
        Value::VoteOperation(Vote {
            voter: "alice".into(),
            author: "bob".into(),
            permlink: "post-1".into(),
            weight: 10_000,
        }),
    );

    assert!(
        !op.handle.is_null(),
        "expected a populated hive_operation_handle"
    );
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
    let protocol = new_rust_protocol();
    let tx = RustTransaction::new(
        protocol.as_ref().unwrap(),
        "beeab0de00000000000000000000000000000000000000000000000000000000",
        42,
        0xdead_beef,
        "2026-05-11T12:00:00",
        ops,
    );
    let extra_op = RustOperation::new(
        protocol.as_ref().unwrap(),
        Value::VoteOperation(Vote {
            voter: "second".into(),
            author: "a".into(),
            permlink: "p".into(),
            weight: 2,
        }),
    );

    let mut tx_handle = protocol
        .cpp_create_transaction_handle(tx.to_managed())
        .expect("transaction should ingest cleanly");
    assert!(!tx_handle.is_null());

    assert!(!extra_op.handle.is_null());

    protocol
        .cpp_tx_add_operation(tx_handle.pin_mut(), &extra_op.handle)
        .expect(
            "appending an operation to the transaction handle should succeed",
        );
}
