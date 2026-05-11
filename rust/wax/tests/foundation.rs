use wax::{new_foundation, RustOperation, RustTransaction};

fn vote_input() -> RustOperation {
    RustOperation::new(
        "vote",
        vec![
            ("voter".into(), "alice".into()),
            ("author".into(), "bob".into()),
            ("permlink".into(), "post-1".into()),
            ("weight".into(), "10000".into()),
        ],
    )
}

#[test]
fn tx_add_operation_appends_one() {
    let f = new_foundation();
    let tx_in = RustTransaction::new(1, 0, "2026-01-01T00:00:00", vec![]);
    let mut tx = f
        .cpp_create_transaction_handle(&tx_in, true)
        .expect("tx build");
    assert_eq!(tx.operation_count(), 0);

    let op = f
        .cpp_create_operation_handle(&vote_input(), true)
        .expect("op build");
    f.cpp_tx_add_operation(tx.pin_mut(), &op)
        .expect("add operation");

    assert_eq!(tx.operation_count(), 1);
}

#[test]
fn tx_add_operation_stacks_multiple_on_top_of_preset() {
    let f = new_foundation();
    let tx_in = RustTransaction::new(1, 0, "2026-01-01T00:00:00", vec!["seed_op".into()]);
    let mut tx = f
        .cpp_create_transaction_handle(&tx_in, true)
        .expect("tx build");
    assert_eq!(tx.operation_count(), 1, "preset op should be present");

    let op1 = f
        .cpp_create_operation_handle(&vote_input(), true)
        .expect("op1");
    let op2 = f
        .cpp_create_operation_handle(&vote_input(), false)
        .expect("op2");

    f.cpp_tx_add_operation(tx.pin_mut(), &op1).expect("add op1");
    f.cpp_tx_add_operation(tx.pin_mut(), &op2).expect("add op2");

    assert_eq!(tx.operation_count(), 3);
}
