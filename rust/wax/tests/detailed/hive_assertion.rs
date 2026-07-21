// Rust port of `ts/wasm/__tests__/detailed/hive_assertion.ts`.
//
// Tests appear in TS source order. Each Rust test has a `// TS line N` comment
// pointing back to the TS original.
//
// TS NOTE: TS wraps hive assert exceptions in a typed `WaxAssertionError`
// (category / raw / assertHash); the Rust `WaxError` carries the raw fc
// exception JSON as its message, so the tests parse that JSON and assert the
// same fields.
//
// TS NOTE: the TS fixture pins the pre-refactor assertion
// `is_asset_type( fee, HIVE_SYMBOL ) && "Account claiming fee must be HIVE"`
// (hash 14687464191050907756). The current hive submodule routes the check
// through `validate_asset_type` (`HIVE_PROTOCOL_ASSET_ASSERT_WITH_SUBJECT`),
// so the expression is `is_asset_type( asset, symbol)` (hash
// 7633970631494007356)
// with the human-readable reason carried in `data.context` instead.

use serde_json::Value;

use wax::proto::{self, operation::Value as OperationValue};

use crate::common::wax_test;

/// The invalid operation both TS tests validate: an account-claiming fee
/// expressed in HBD (must be HIVE).
fn invalid_claim_account() -> OperationValue {
    OperationValue::ClaimAccountOperation(proto::ClaimAccount {
        creator: "user123".into(),
        fee: proto::Asset {
            nai: "@@000000013".into(),
            amount: "1".into(),
            precision: 3,
        },
        extensions: Vec::new(),
    })
}

/// Parses the fc exception JSON carried by the validation error and returns
/// `(category, assertion_expression, assert_hash, context)`.
fn assertion_details(error: &str) -> (String, String, String, String) {
    let parsed: Value =
        serde_json::from_str(error).expect("assertion error is JSON");

    assert_eq!(parsed["name"], "assert_exception");

    (
        parsed["stack"][0]["data"]["category"]
            .as_str()
            .unwrap_or_default()
            .to_string(),
        parsed["extension"]["assertion_expression"]
            .as_str()
            .expect("assertion_expression")
            .to_string(),
        parsed["assert_hash"]
            .as_str()
            .expect("assert_hash")
            .to_string(),
        parsed["stack"][0]["data"]["context"]
            .as_str()
            .unwrap_or_default()
            .to_string(),
    )
}

// TS line 44: "Expecting assertion evaluating invalid operation" — the
// transaction-level validation path.
#[test]
fn assertion_evaluating_invalid_operation() {
    wax_test(None, |ctx| {
        let mut tx = ctx
            .base
            .create_transaction_with_tapos(
                "04c507a8c7fe5be96be64ce7c86855e1806cbde3",
                "2023-11-09T21:51:27",
            )
            .expect("create_transaction_with_tapos");
        tx.push_operation(ctx.base.create_operation(invalid_claim_account()));

        let error = tx.validate().expect_err("expected validation error");
        let (category, expression, hash, context) =
            assertion_details(&error.to_string());

        assert_eq!(category, "protocol");
        assert_eq!(expression, "is_asset_type( asset, symbol)");
        assert_eq!(hash, "7633970631494007356");
        assert_eq!(context, "Account claiming fee must be HIVE");
    });
}

// TS line 100: "Testing getExceptionMessage as wasmTest" — the raw
// operation-level protocol validation path.
#[test]
fn get_exception_message_from_operation_validation() {
    wax_test(None, |ctx| {
        let operation = ctx.base.create_operation(invalid_claim_account());

        let error =
            operation.validate().expect_err("expected validation error");
        let (category, expression, hash, context) =
            assertion_details(&error.to_string());

        assert_eq!(category, "protocol");
        assert_eq!(expression, "is_asset_type( asset, symbol)");
        assert_eq!(hash, "7633970631494007356");
        assert_eq!(context, "Account claiming fee must be HIVE");
    });
}
