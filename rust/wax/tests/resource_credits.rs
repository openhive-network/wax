//! Rust counterparts to `ts/wasm/__tests__/detailed/custom_jsons.ts`'s
//! `ResourceCreditsOperation` test (and the Python apps-operations tests).
//!
//! The emitted `custom_json` payload is wire-compared against the TS
//! reference: same field order (`from`, `delegatees`, `max_rc`, `extensions`),
//! `max_rc` as a quoted string (to survive non-int64-safe JSON parsers, per
//! the `as_int64` directive the chain's serializer uses).

use wax::hive_apps_operations::rc::ResourceCreditsOperation;
use wax::{Transaction, WaxFoundation, create_wax_foundation};

const TAPOS: &str = "04c507a8c7fe5be96be64ce7c86855e1806cbde3";
const EXPIRATION: &str = "2023-11-09T21:51:27";

fn foundation() -> Box<dyn WaxFoundation> {
    create_wax_foundation(None)
}

fn fresh_tx(f: &dyn WaxFoundation) -> Box<dyn Transaction> {
    f.create_transaction_with_tapos(TAPOS, EXPIRATION)
        .expect("create_transaction_with_tapos")
}

fn extract_custom_json(op: &wax::proto::Operation) -> &wax::proto::CustomJson {
    match &op.value {
        Some(wax::proto::operation::Value::CustomJsonOperation(cj)) => cj,
        other => panic!("expected CustomJsonOperation, got {other:?}"),
    }
}

// Mirrors `Should be able to create transaction with hive apps rc operation
// using transaction interface` in ts/wasm/__tests__/detailed/custom_jsons.ts.
#[test]
fn delegate_then_remove() {
    let f = foundation();

    let op = ResourceCreditsOperation::new()
        .delegate("initminer", 3000, vec!["gtg".into()])
        .expect("delegate")
        .authorize(vec!["initminer".into()], Vec::new())
        .expect("authorize delegate")
        .remove_delegation("initminer", vec!["gtg".into()])
        .expect("remove_delegation")
        .authorize(vec!["initminer".into()], Vec::new())
        .expect("authorize remove");

    let tx = fresh_tx(&*f).push_builder(&*f, Box::new(op)).expect("push_builder");

    let ops = &tx.transaction().operations;
    assert_eq!(ops.len(), 2);

    let first = extract_custom_json(&ops[0]);
    assert_eq!(first.id, "rc");
    assert_eq!(first.required_auths, Vec::<String>::new());
    assert_eq!(first.required_posting_auths, vec!["initminer".to_string()]);
    assert_eq!(
        first.json,
        r#"["delegate_rc",{"from":"initminer","delegatees":["gtg"],"max_rc":"3000","extensions":[]}]"#,
    );

    let second = extract_custom_json(&ops[1]);
    assert_eq!(second.id, "rc");
    assert_eq!(second.required_posting_auths, vec!["initminer".to_string()]);
    assert_eq!(
        second.json,
        r#"["delegate_rc",{"from":"initminer","delegatees":["gtg"],"max_rc":"0","extensions":[]}]"#,
    );
}

#[test]
fn delegate_multiple_delegatees() {
    let f = foundation();

    let op = ResourceCreditsOperation::new()
        .delegate(
            "alice",
            1000,
            vec!["bob".into(), "carol".into(), "dave".into()],
        )
        .expect("delegate")
        .authorize(vec!["testAuthority".into()], Vec::new())
        .expect("authorize");

    let tx = fresh_tx(&*f).push_builder(&*f, Box::new(op)).expect("push_builder");
    let cj = extract_custom_json(&tx.transaction().operations[0]);

    assert_eq!(
        cj.json,
        r#"["delegate_rc",{"from":"alice","delegatees":["bob","carol","dave"],"max_rc":"1000","extensions":[]}]"#,
    );
    assert_eq!(cj.required_posting_auths, vec!["testAuthority".to_string()]);
}

// Active-auth path: pass `required_auths` instead of posting auths.
#[test]
fn authorizes_via_active_auth() {
    let f = foundation();

    let op = ResourceCreditsOperation::new()
        .delegate("alice", 500, vec!["bob".into()])
        .expect("delegate")
        .authorize(Vec::new(), vec!["alice".into()])
        .expect("authorize");

    let tx = fresh_tx(&*f).push_builder(&*f, Box::new(op)).expect("push_builder");
    let cj = extract_custom_json(&tx.transaction().operations[0]);
    assert_eq!(cj.required_auths, vec!["alice".to_string()]);
    assert!(cj.required_posting_auths.is_empty());
}

#[test]
fn rejects_empty_delegatees() {
    let result = ResourceCreditsOperation::new().delegate("alice", 1000, Vec::new());
    assert!(result.is_err(), "empty delegatees must error");
}

#[test]
fn rejects_negative_max_rc() {
    let result = ResourceCreditsOperation::new().delegate("alice", -1, vec!["bob".into()]);
    assert!(result.is_err(), "negative max_rc must error");
}

#[test]
fn rejects_authorize_with_no_authorities() {
    let result = ResourceCreditsOperation::new()
        .delegate("alice", 1000, vec!["bob".into()])
        .expect("delegate")
        .authorize(Vec::new(), Vec::new());
    assert!(result.is_err(), "authorize with no authorities must error");
}

// Staging without `authorize` must not produce any ops — TS clears the
// stage on `authorize` and `finalize` emits only the accumulated ops.
#[test]
fn unauthorized_stage_yields_no_ops() {
    let f = foundation();

    let op = ResourceCreditsOperation::new()
        .delegate("alice", 1000, vec!["bob".into()])
        .expect("delegate");

    let tx = fresh_tx(&*f).push_builder(&*f, Box::new(op)).expect("push_builder");
    assert!(tx.transaction().operations.is_empty());
}
