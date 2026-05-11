use wax::{new_foundation, RustTransaction};

#[test]
fn create_transaction_handle_populates_fields() {
    let f = new_foundation();
    let input = RustTransaction::new(
        42,
        0xdead_beef,
        "2026-05-11T12:00:00",
        vec!["op_a".into(), "op_b".into()],
    );

    let handle = f
        .cpp_create_transaction_handle(&input, true)
        .expect("transaction build");

    assert_eq!(handle.operation_count(), 2);
    let id = handle.transaction_id();
    assert!(id.contains("deadbeef"), "id missing ref_block_prefix: {id}");
    assert!(id.contains("42"), "id missing ref_block_num: {id}");
    assert!(id.contains("proto"), "is_protobuf flag not reflected: {id}");
}

#[test]
fn create_transaction_handle_zero_ref_block_num_errors() {
    let f = new_foundation();
    let input = RustTransaction::new(0, 0, "now", vec![]);

    let err = match f.cpp_create_transaction_handle(&input, true) {
        Ok(_) => panic!("ref_block_num=0 must fail"),
        Err(e) => e,
    };

    assert!(
        err.to_string().contains("ref_block_num"),
        "unexpected error: {err}"
    );
}
