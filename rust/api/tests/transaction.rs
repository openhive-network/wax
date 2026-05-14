use api::RustTransactionApi;
use wax::proto::{operation::Value, Vote};
use wax::{RustOperation, RustTransaction};

fn vote(voter: &str, weight: u32) -> RustOperation {
    RustOperation::new(Value::VoteOperation(Vote {
        voter: voter.into(),
        author: "author".into(),
        permlink: "permlink".into(),
        weight,
    }))
}

#[test]
fn push_operation_appends_op_to_proto_state() {
    let tx = RustTransaction::new(1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new());
    assert!(tx.proto().operations.is_empty());

    let tx = tx.push_operation(vote("alice", 10_000));

    assert_eq!(tx.proto().operations.len(), 1);
    assert_eq!(
        tx.proto().operations[0].value,
        Some(Value::VoteOperation(Vote {
            voter: "alice".into(),
            author: "author".into(),
            permlink: "permlink".into(),
            weight: 10_000,
        }))
    );
}

#[test]
fn validate_passes_for_well_formed_transaction() {
    let tx = RustTransaction::new(1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 10_000));

    tx.validate().expect("well-formed transaction should validate");
}

#[test]
fn validate_fails_for_invalid_operation() {
    let tx = RustTransaction::new(1, 0xfeed_face, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("alice", 20_000));

    assert!(
        tx.validate().is_err(),
        "vote with out-of-range weight should fail validation"
    );
}

#[test]
fn push_operation_preserves_order_when_chained() {
    let tx = RustTransaction::new(2, 0xdead_beef, "2026-05-13T12:00:00", Vec::new())
        .push_operation(vote("first", 1))
        .push_operation(vote("second", 2));

    let voters: Vec<&str> = tx
        .proto()
        .operations
        .iter()
        .map(|op| match op.value.as_ref().expect("op value present") {
            Value::VoteOperation(v) => v.voter.as_str(),
            other => panic!("unexpected op variant: {other:?}"),
        })
        .collect();

    assert_eq!(voters, ["first", "second"]);
}
