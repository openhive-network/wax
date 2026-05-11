use wax::{new_foundation, RustOperation};

#[test]
fn create_transfer_operation_populates_description() {
    let f = new_foundation();
    let input = RustOperation::new(
        "transfer",
        vec![
            ("from".into(), "alice".into()),
            ("to".into(), "bob".into()),
            ("amount".into(), "100.000 HIVE".into()),
        ],
    );

    let handle = f
        .cpp_create_operation_handle(&input, true)
        .expect("transfer build");

    assert_eq!(handle.kind(), "transfer");
    let desc = handle.description();
    for needle in ["from=alice", "to=bob", "amount=100.000 HIVE"] {
        assert!(desc.contains(needle), "description missing {needle}: {desc}");
    }
}

#[test]
fn create_operation_missing_required_field_errors() {
    let f = new_foundation();
    let input = RustOperation::new(
        "transfer",
        vec![
            ("from".into(), "alice".into()),
            ("to".into(), "bob".into()),
        ],
    );

    let err = match f.cpp_create_operation_handle(&input, true) {
        Ok(_) => panic!("missing amount must fail"),
        Err(e) => e,
    };

    let msg = err.to_string();
    assert!(msg.contains("amount"), "error doesn't name the field: {msg}");
    assert!(msg.contains("missing"), "error not phrased as 'missing': {msg}");
}
