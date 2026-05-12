use wax::proto::{operation::Value, Asset, Operation, Transfer, Vote};
use wax::{RustManagedObject, RustOperation, RustTransaction};

fn hive_asset(amount: &str) -> Asset {
    Asset {
        amount: amount.into(),
        precision: 3,
        nai: "@@000000021".into(),
    }
}

#[test]
fn descriptor_pool_loads_hive_protocol_buffers() {
    let pool = wax::descriptor_pool();
    assert!(
        pool.get_message_by_name("hive.protocol.buffers.operation")
            .is_some(),
        "FileDescriptorSet is missing the Operation message"
    );
    assert!(pool
        .get_message_by_name("hive.protocol.buffers.transaction")
        .is_some());
    assert!(pool
        .get_message_by_name("hive.protocol.buffers.transfer")
        .is_some());
}

#[test]
fn vote_operation_fields_round_trip_by_name() {
    let op = RustOperation::new(Value::VoteOperation(Vote {
        voter: "alice".into(),
        author: "bob".into(),
        permlink: "post-1".into(),
        weight: 10_000,
    }));

    let mo = op.to_managed();
    assert_eq!(mo.oneof_variant(), "vote_operation");

    let vote = mo.get_field("vote_operation");
    assert_eq!(vote.get_field("voter").as_string(), "alice");
    assert_eq!(vote.get_field("author").as_string(), "bob");
    assert_eq!(vote.get_field("permlink").as_string(), "post-1");
    assert_eq!(vote.get_field("weight").as_u32(), 10_000);
}

#[test]
fn transfer_operation_exposes_nested_asset() {
    let op = RustOperation::new(Value::TransferOperation(Transfer {
        from_account: "alice".into(),
        to_account: "bob".into(),
        amount: hive_asset("100000"),
        memo: "hello".into(),
    }));

    let mo = op.to_managed();
    assert_eq!(mo.oneof_variant(), "transfer_operation");

    let t = mo.get_field("transfer_operation");
    assert_eq!(t.get_field("from_account").as_string(), "alice");
    assert_eq!(t.get_field("to_account").as_string(), "bob");
    assert_eq!(t.get_field("memo").as_string(), "hello");

    let amount = t.get_field("amount");
    assert_eq!(amount.get_field("amount").as_string(), "100000");
    assert_eq!(amount.get_field("precision").as_u32(), 3);
    assert_eq!(amount.get_field("nai").as_string(), "@@000000021");
}

#[test]
fn transaction_repeated_operations_are_indexable() {
    let ops = vec![
        Operation {
            value: Some(Value::VoteOperation(Vote {
                voter: "first".into(),
                author: "a".into(),
                permlink: "p".into(),
                weight: 1,
            })),
        },
        Operation {
            value: Some(Value::VoteOperation(Vote {
                voter: "second".into(),
                author: "a".into(),
                permlink: "p".into(),
                weight: 2,
            })),
        },
    ];

    let tx = RustTransaction::new(42, 0xdead_beef, "2026-05-11T12:00:00", ops);
    let mo = tx.to_managed();

    assert_eq!(mo.get_field("ref_block_num").as_u32(), 42);
    assert_eq!(mo.get_field("ref_block_prefix").as_u32(), 0xdead_beef);
    assert_eq!(
        mo.get_field("expiration").as_string(),
        "2026-05-11T12:00:00"
    );

    let operations = mo.get_field("operations");
    assert_eq!(operations.array_length(), 2);

    let first = operations.get_index(0);
    assert_eq!(first.oneof_variant(), "vote_operation");
    assert_eq!(
        first
            .get_field("vote_operation")
            .get_field("voter")
            .as_string(),
        "first"
    );

    let second = operations.get_index(1);
    assert_eq!(
        second
            .get_field("vote_operation")
            .get_field("voter")
            .as_string(),
        "second"
    );
}

#[test]
fn operation_with_no_variant_reports_empty_oneof() {
    let mo = RustManagedObject::from_operation(&Operation::default());
    assert_eq!(mo.oneof_variant(), "");
}

#[test]
fn is_optional_field_present_returns_true_for_required_fields() {
    let op = RustOperation::new(Value::VoteOperation(Vote::default()));
    let mo = op.to_managed();
    let vote = mo.get_field("vote_operation");
    assert!(vote.is_optional_field_present("voter"));
    assert!(vote.is_optional_field_present("weight"));
}
