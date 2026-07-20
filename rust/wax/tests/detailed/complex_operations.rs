// Rust port of `ts/wasm/__tests__/detailed/complex_operations.ts`.
//
// Tests appear in TS source order. Each Rust test has a `// TS line N` comment
// pointing back to the TS original.
//
// `to_api()` / `to_legacy_api()` route through the same C++ serialization as
// the TS `toApi()` / `toLegacyApi()`, so the JSON shapes are asserted
// byte-for-byte — the only deliberate divergence is the comment `app` tag,
// which is `wax/{CARGO_PKG_VERSION}` here instead of TS's `@hiveio/wax/...`.

use serde_json::json;

use wax::complex_operations::{
    BeneficiaryRoute, BlogPostOperation, CommentFormat,
    DefineRecurrentTransferOperation, HbdExchangeRate,
    RecurrentTransferRemovalOperation, ReplyOperation, UpdateProposalOperation,
    WitnessSetPropertiesOperation,
};
use wax::models::asset::{NaiAsset, NaiAssetConvertible};
use wax::models::basic::HiveDateTime;
use wax::proto::{self, operation::Value as OperationValue};
use wax::{
    AccountAuthorityUpdateOperation, HiveChain, Transaction, create_hive_chain,
};

use crate::common::{WaxTestCtx, wax_test};

const TAPOS: &str = "04c507a8c7fe5be96be64ce7c86855e1806cbde3";
const EXPIRATION: &str = "2023-11-09T21:51:27";

// TS uses `${npm_package_name}/${npm_package_version}` for the `app` tag; the
// Rust comment builders use `{CARGO_PKG_NAME}/{CARGO_PKG_VERSION}` instead.
const APP: &str =
    concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION"));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn fresh_tx(ctx: &WaxTestCtx) -> Transaction {
    ctx.base
        .create_transaction_with_tapos(TAPOS, EXPIRATION)
        .expect("create_transaction_with_tapos")
}

fn hive_sat(ctx: &WaxTestCtx, amount: i64) -> NaiAsset {
    ctx.base.hive_satoshis(amount).expect("hive_satoshis")
}

fn hbd_sat(ctx: &WaxTestCtx, amount: i64) -> NaiAsset {
    ctx.base.hbd_satoshis(amount).expect("hbd_satoshis")
}

/// Builds the HBD asset `{ amount, precision: 3, nai: @@000000013 }` — the
/// explicit JSON-shaped asset some TS tests pass inline.
fn hbd_asset(amount: &str) -> NaiAsset {
    NaiAsset {
        amount: amount.into(),
        precision: 3,
        nai: "@@000000013".into(),
    }
}

/// Builds the HIVE asset `{ amount, precision: 3, nai: @@000000021 }`.
fn hive_asset(amount: &str) -> NaiAsset {
    NaiAsset {
        amount: amount.into(),
        precision: 3,
        nai: "@@000000021".into(),
    }
}

fn api_op0(tx: &Transaction) -> serde_json::Value {
    tx.to_api_json().expect("to_api_json")["operations"][0].clone()
}

fn api_ops(tx: &Transaction) -> serde_json::Value {
    tx.to_api_json().expect("to_api_json")["operations"].clone()
}

fn legacy_value(tx: &Transaction) -> serde_json::Value {
    serde_json::from_str(&tx.to_legacy_api().expect("to_legacy_api"))
        .expect("parse legacy json")
}

/// Base witness builder with only the required `owner` / signing key set; the
/// optional props are filled per-test.
fn witness(owner: &str, signing_key: &str) -> WitnessSetPropertiesOperation {
    WitnessSetPropertiesOperation {
        owner: owner.into(),
        witness_signing_key: signing_key.into(),
        new_signing_key: None,
        account_creation_fee: None,
        url: None,
        hbd_exchange_rate: None,
        maximum_block_size: None,
        hbd_interest_rate: None,
        account_subsidy_budget: None,
        account_subsidy_decay: None,
    }
}

// ---------------------------------------------------------------------------
// WitnessSetPropertiesOperation
// ---------------------------------------------------------------------------

// TS line 10: "Should be able to initialize pushOperation on
// WitnessSetPropertiesOperation with basic witness_set_properties_operation".
#[test]
fn witness_set_properties_basic() {
    wax_test(None, |ctx| {
        let mut op = witness(
            "gtg",
            "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh",
        );
        op.new_signing_key = Some(
            "STM6TqSJaS1aRj6p6yZEo5xicX7bvLhrfdVqi5ToNrKxHU3FRBEdW".into(),
        );
        op.account_creation_fee =
            Some(NaiAssetConvertible::Asset(hive_sat(ctx, 5000)));
        op.account_subsidy_budget = Some(1000);
        op.account_subsidy_decay = Some(1000);
        op.hbd_exchange_rate = Some(HbdExchangeRate {
            base: NaiAssetConvertible::Asset(hbd_sat(ctx, 1000)),
            quote: NaiAssetConvertible::Asset(hive_sat(ctx, 1000)),
        });
        op.hbd_interest_rate = Some(1000);
        op.maximum_block_size = Some(1000);
        op.url = Some("https://hive.io".into());

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        assert_eq!(
            api_op0(&tx),
            json!({
                "type": "witness_set_properties_operation",
                "value": {
                    "extensions": [],
                    "owner": "gtg",
                    "props": [
                        ["account_creation_fee", "88130000000000002320bcbe"],
                        ["account_subsidy_budget", "e8030000"],
                        ["account_subsidy_decay", "e8030000"],
                        ["hbd_exchange_rate", "e8030000000000000320bcbee8030000000000002320bcbe"],
                        ["hbd_interest_rate", "e803"],
                        ["key", "02472d6eb6d691b6de8b103b51ebdf4e128a523946d8cd03d6ded91b1497ee2e83"],
                        ["maximum_block_size", "e8030000"],
                        ["new_signing_key", "02cf69b1f999d133ebbe178a8b4bbf4da356b264dfdc843b1c740378bff8f65b33"],
                        ["url", "0f68747470733a2f2f686976652e696f"]
                    ]
                }
            })
        );
    });
}

// TS line 77: "Should be able to use WitnessSetPropertiesOperation with url
// witness property".
#[test]
fn witness_set_properties_url_only() {
    wax_test(None, |ctx| {
        let mut op = witness(
            "therealwolf",
            "STM8kPZiPjyWBjmZVMEPW4Qh2BspKuvKMBjvh9dxpZL7Kv2MGBYzC",
        );
        op.url = Some(
            "https://steemit.com/steem/@therealwolf/witness-application-therealwolf-updated"
                .into(),
        );

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        assert_eq!(
            api_op0(&tx),
            json!({
                "type": "witness_set_properties_operation",
                "value": {
                    "extensions": [],
                    "owner": "therealwolf",
                    "props": [
                        ["key", "03fc648d2ac16432f354acc1fe010a3c6567380e4939644deb7a74c6ebbe67da56"],
                        ["url", "4e68747470733a2f2f737465656d69742e636f6d2f737465656d2f407468657265616c776f6c662f7769746e6573732d6170706c69636174696f6e2d7468657265616c776f6c662d75706461746564"]
                    ]
                }
            })
        );
    });
}

// TS line 109: "Should be able to use WitnessSetPropertiesOperation with budget
// and account fee witness properties".
#[test]
fn witness_set_properties_budget_and_fee() {
    wax_test(None, |ctx| {
        let mut op = witness(
            "therealwolf",
            "STM8kPZiPjyWBjmZVMEPW4Qh2BspKuvKMBjvh9dxpZL7Kv2MGBYzC",
        );
        op.account_creation_fee =
            Some(NaiAssetConvertible::Asset(hive_asset("3000")));
        op.account_subsidy_budget = Some(700);

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        assert_eq!(
            api_op0(&tx),
            json!({
                "type": "witness_set_properties_operation",
                "value": {
                    "extensions": [],
                    "owner": "therealwolf",
                    "props": [
                        ["account_creation_fee", "b80b0000000000002320bcbe"],
                        ["account_subsidy_budget", "bc020000"],
                        ["key", "03fc648d2ac16432f354acc1fe010a3c6567380e4939644deb7a74c6ebbe67da56"]
                    ]
                }
            })
        );
    });
}

// TS line 146: "Should be able to use WitnessSetPropertiesOperation with deacy
// and budget witness properties".
#[test]
fn witness_set_properties_decay_and_budget() {
    wax_test(None, |ctx| {
        let mut op = witness(
            "emrebeyler",
            "STM5ShFW6UPxDRyjG4mVWYiwVWTzkmfL2k7zYoamWz2yJLpEkycju",
        );
        op.account_subsidy_budget = Some(1);
        op.account_subsidy_decay = Some(64);

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        assert_eq!(
            api_op0(&tx),
            json!({
                "type": "witness_set_properties_operation",
                "value": {
                    "extensions": [],
                    "owner": "emrebeyler",
                    "props": [
                        ["account_subsidy_budget", "01000000"],
                        ["account_subsidy_decay", "40000000"],
                        ["key", "0249202c30b95aec7506ab719fd602256922b9ca86cc31e01499c4c6339c7292a3"]
                    ]
                }
            })
        );
    });
}

// TS line 183: "Should be able to use WitnessSetPropertiesOperation with hbd
// exchange rate witness property".
#[test]
fn witness_set_properties_hbd_exchange_rate() {
    wax_test(None, |ctx| {
        let mut op = witness(
            "ctrpch",
            "STM5oxZMtLbjgnsZVY2XUi58wriYCF1KUNedCzut4ogNEA19GhbiU",
        );
        op.hbd_exchange_rate = Some(HbdExchangeRate {
            base: NaiAssetConvertible::Asset(hbd_sat(ctx, 424)),
            quote: NaiAssetConvertible::Asset(hive_sat(ctx, 1000)),
        });

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        assert_eq!(
            api_op0(&tx),
            json!({
                "type": "witness_set_properties_operation",
                "value": {
                    "extensions": [],
                    "owner": "ctrpch",
                    "props": [
                        ["hbd_exchange_rate", "a8010000000000000320bcbee8030000000000002320bcbe"],
                        ["key", "0279687479456e2f03ca19adab071ba333acb765f83402357e71f5cd8c49bee21b"]
                    ]
                }
            })
        );
    });
}

// TS line 215: "Should be able to use WitnessSetPropertiesOperation with all
// the specific witness properties".
#[test]
fn witness_set_properties_all_properties() {
    wax_test(None, |ctx| {
        let mut op = witness(
            "guiltyparties",
            "STM5oxZMtLbjgnsZVY2XUi58wriYCF1KUNedCzut4ogNEA19GhbiU",
        );
        op.account_creation_fee =
            Some(NaiAssetConvertible::Asset(hive_asset("3000")));
        op.account_subsidy_budget = Some(10000);
        op.account_subsidy_decay = Some(3307750);
        op.hbd_exchange_rate = Some(HbdExchangeRate {
            base: NaiAssetConvertible::Asset(hbd_sat(ctx, 867)),
            quote: NaiAssetConvertible::Asset(hive_sat(ctx, 1002)),
        });
        op.hbd_interest_rate = Some(0);
        op.maximum_block_size = Some(65536);
        op.new_signing_key = Some(
            "STM7FGmbPEooM5xbME7F2WUG41zGAh6WPzvHMQvTfABEHKfyuGUu7".into(),
        );
        op.url = Some("https://guiltyparties.com".into());

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        assert_eq!(
            api_op0(&tx),
            json!({
                "type": "witness_set_properties_operation",
                "value": {
                    "extensions": [],
                    "owner": "guiltyparties",
                    "props": [
                        ["account_creation_fee", "b80b0000000000002320bcbe"],
                        ["account_subsidy_budget", "10270000"],
                        ["account_subsidy_decay", "e6783200"],
                        ["hbd_exchange_rate", "63030000000000000320bcbeea030000000000002320bcbe"],
                        ["hbd_interest_rate", "0000"],
                        ["key", "0279687479456e2f03ca19adab071ba333acb765f83402357e71f5cd8c49bee21b"],
                        ["maximum_block_size", "00000100"],
                        ["new_signing_key", "033695262a25cd5646f7875db0536db3f1b3439d7c86274ec56cce01d91ab6611b"],
                        ["url", "1968747470733a2f2f6775696c7479706172746965732e636f6d"]
                    ]
                }
            })
        );
    });
}

// ---------------------------------------------------------------------------
// DefineRecurrentTransferOperation / RecurrentTransferRemovalOperation
// ---------------------------------------------------------------------------

// TS line 282: "Should be able to initialize pushOperations on
// DefineRecurrentTransferOperation with basic recurrent_transfer_operation".
#[test]
fn recurrent_transfer_basic() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(
            &ctx.base,
            DefineRecurrentTransferOperation {
                from_account: "alice".into(),
                to_account: "bob".into(),
                amount: NaiAssetConvertible::Asset(hbd_asset("100")),
                recurrence: Some(24),
                executions: Some(2),
                memo: Some("thanks for the service".into()),
                pair_id: None,
            },
        )
        .expect("push_complex_operation");

        assert_eq!(
            api_op0(&tx),
            json!({
                "type": "recurrent_transfer_operation",
                "value": {
                    "extensions": [],
                    "amount": { "amount": "100", "nai": "@@000000013", "precision": 3 },
                    "executions": 2,
                    "from": "alice",
                    "memo": "thanks for the service",
                    "recurrence": 24,
                    "to": "bob"
                }
            })
        );
    });
}

// TS line 316: "Should be able to add base recurrent_transfer_pair_id extension
// using DefineRecurrentTransferOperation".
#[test]
fn recurrent_transfer_with_pair_id() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(
            &ctx.base,
            DefineRecurrentTransferOperation {
                from_account: "alice".into(),
                to_account: "bob".into(),
                pair_id: Some(123),
                amount: NaiAssetConvertible::Asset(hive_asset("100")),
                memo: Some("monthly subscription".into()),
                recurrence: Some(24),
                executions: Some(2),
            },
        )
        .expect("push_complex_operation");

        assert_eq!(
            api_op0(&tx),
            json!({
                "type": "recurrent_transfer_operation",
                "value": {
                    "amount": { "amount": "100", "nai": "@@000000021", "precision": 3 },
                    "executions": 2,
                    "extensions": [{
                        "type": "recurrent_transfer_pair_id",
                        "value": { "pair_id": 123 }
                    }],
                    "from": "alice",
                    "memo": "monthly subscription",
                    "recurrence": 24,
                    "to": "bob"
                }
            })
        );
    });
}

// TS line 356: "Properly initialized API should allow generation of a removal
// operation".
#[test]
fn recurrent_transfer_removal() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(
            &ctx.base,
            RecurrentTransferRemovalOperation {
                from_account: "grace".into(),
                to_account: "henry".into(),
                pair_id: Some(143),
            },
        )
        .expect("push_complex_operation");

        assert_eq!(
            api_op0(&tx),
            json!({
                "type": "recurrent_transfer_operation",
                "value": {
                    "from": "grace",
                    "to": "henry",
                    "amount": { "amount": "0", "precision": 3, "nai": "@@000000021" },
                    "memo": "",
                    "recurrence": 24,
                    "executions": 2,
                    "extensions": [{
                        "type": "recurrent_transfer_pair_id",
                        "value": { "pair_id": 143 }
                    }]
                }
            })
        );
    });
}

// ---------------------------------------------------------------------------
// UpdateProposalOperation
// ---------------------------------------------------------------------------

// TS line 383: "Should initialize update proposal with mandatory fields only".
//
// TS NOTE: TS passes `proposalId: "123"` (a string) and coerces it; the Rust
// builder takes `proposal_id: i64` directly.
#[test]
fn update_proposal_mandatory_fields() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(
            &ctx.base,
            UpdateProposalOperation {
                proposal_id: 123,
                creator: "alice".into(),
                daily_pay: NaiAssetConvertible::Asset(hbd_asset("1000")),
                subject: "Improve UI Design".into(),
                permlink: "improve-ui".into(),
                end_date: None,
            },
        )
        .expect("push_complex_operation");

        assert_eq!(
            api_op0(&tx),
            json!({
                "type": "update_proposal_operation",
                "value": {
                    "extensions": [],
                    "creator": "alice",
                    "daily_pay": { "amount": "1000", "nai": "@@000000013", "precision": 3 },
                    "permlink": "improve-ui",
                    "proposal_id": 123,
                    "subject": "Improve UI Design"
                }
            })
        );
    });
}

// TS line 411: "Should add endDate in update proposal when provided".
#[test]
fn update_proposal_with_end_date() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(
            &ctx.base,
            UpdateProposalOperation {
                proposal_id: 123,
                creator: "alice".into(),
                daily_pay: NaiAssetConvertible::Asset(hbd_asset("1000")),
                subject: "Improve UI Design".into(),
                permlink: "improve-ui".into(),
                end_date: Some(
                    HiveDateTime::parse("2023-03-14T00:00:00").unwrap(),
                ),
            },
        )
        .expect("push_complex_operation");

        assert_eq!(
            api_op0(&tx),
            json!({
                "type": "update_proposal_operation",
                "value": {
                    "creator": "alice",
                    "daily_pay": { "amount": "1000", "nai": "@@000000013", "precision": 3 },
                    "extensions": [{
                        "type": "update_proposal_end_date",
                        "value": { "end_date": "2023-03-14T00:00:00" }
                    }],
                    "permlink": "improve-ui",
                    "proposal_id": 123,
                    "subject": "Improve UI Design"
                }
            })
        );
    });
}

// TS line 445: "Should handle edge case in update proposal where endDate is
// given as timestamp".
//
// TS NOTE: TS accepts `endDate` as an epoch-millis number and coerces it to a
// datetime (`1678917600000` → `2023-03-15T22:00:00`). The Rust builder takes a
// `HiveDateTime` directly, so we pass the already-resolved value; the coercion
// itself is a TS-only input convenience with no Rust counterpart.
#[test]
fn update_proposal_with_timestamp_end_date() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(
            &ctx.base,
            UpdateProposalOperation {
                proposal_id: 123,
                creator: "alice".into(),
                daily_pay: NaiAssetConvertible::Asset(hbd_asset("1000")),
                subject: "Improve UI Design".into(),
                permlink: "improve-ui".into(),
                end_date: Some(
                    HiveDateTime::parse("2023-03-15T22:00:00").unwrap(),
                ),
            },
        )
        .expect("push_complex_operation");

        assert_eq!(
            api_op0(&tx),
            json!({
                "type": "update_proposal_operation",
                "value": {
                    "creator": "alice",
                    "daily_pay": { "amount": "1000", "nai": "@@000000013", "precision": 3 },
                    "extensions": [{
                        "type": "update_proposal_end_date",
                        "value": { "end_date": "2023-03-15T22:00:00" }
                    }],
                    "permlink": "improve-ui",
                    "proposal_id": 123,
                    "subject": "Improve UI Design"
                }
            })
        );
    });
}

// ---------------------------------------------------------------------------
// Legacy API conversion
// ---------------------------------------------------------------------------

// TS line 479: "Should add extensions using DefineRecurrentTransferOperation
// and convert to legacy api".
#[test]
fn recurrent_transfer_removal_to_legacy_api() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(
            &ctx.base,
            RecurrentTransferRemovalOperation {
                from_account: "alice".into(),
                to_account: "bob".into(),
                pair_id: Some(50),
            },
        )
        .expect("push_complex_operation");

        assert_eq!(
            legacy_value(&tx)["operations"][0],
            json!([
                "recurrent_transfer",
                {
                    "amount": "0.000 HIVE",
                    "executions": 2,
                    "extensions": [[1, { "pair_id": 50 }]],
                    "from": "alice",
                    "memo": "",
                    "recurrence": 24,
                    "to": "bob"
                }
            ])
        );
    });
}

// TS line 511: "Should be able to convert transaction to legacy api wih endDate
// property".
#[test]
fn update_proposal_to_legacy_api() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(
            &ctx.base,
            UpdateProposalOperation {
                proposal_id: 123,
                creator: "alice".into(),
                daily_pay: NaiAssetConvertible::Asset(hbd_asset("1000")),
                subject: "Improve UI Design".into(),
                permlink: "improve-ui".into(),
                end_date: Some(
                    HiveDateTime::parse("2023-03-14T00:00:00").unwrap(),
                ),
            },
        )
        .expect("push_complex_operation");

        assert_eq!(
            legacy_value(&tx)["operations"][0],
            json!([
                "update_proposal",
                {
                    "creator": "alice",
                    "daily_pay": "1.000 HBD",
                    "extensions": [[1, { "end_date": "2023-03-14T00:00:00" }]],
                    "permlink": "improve-ui",
                    "proposal_id": 123,
                    "subject": "Improve UI Design"
                }
            ])
        );
    });
}

// TS line 545: "Should be able to convert transaction for post with
// beneficiares to legacy api".
#[test]
fn reply_with_beneficiaries_to_legacy_api() {
    wax_test(None, |ctx| {
        let op = ReplyOperation {
            parent_author: "guest4test".into(),
            parent_permlink: "spam".into(),
            author: "gtg".into(),
            title: Some("Post with beneficiares".into()),
            body: "Post with beneficiaries".into(),
            permlink: Some("post-with-beneficiaries".into()),
            tags: vec!["spam".into()],
            beneficiaries: vec![BeneficiaryRoute {
                account: "guest4test7".into(),
                weight: 40,
            }],
            description: Some("Post with beneficiaries".into()),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata = format!(
            r#"{{"format":"markdown+html","app":"{APP}","tags":["spam"],"description":"Post with beneficiaries"}}"#
        );

        assert_eq!(
            legacy_value(&tx),
            json!({
                "ref_block_num": 1960,
                "ref_block_prefix": 3_915_120_327_u64,
                "expiration": "2023-11-09T21:51:27",
                "operations": [
                    [
                        "comment",
                        {
                            "parent_author": "guest4test",
                            "parent_permlink": "spam",
                            "author": "gtg",
                            "permlink": "post-with-beneficiaries",
                            "title": "Post with beneficiares",
                            "body": "Post with beneficiaries",
                            "json_metadata": json_metadata
                        }
                    ],
                    [
                        "comment_options",
                        {
                            "author": "gtg",
                            "permlink": "post-with-beneficiaries",
                            "max_accepted_payout": "1000000.000 HBD",
                            "percent_hbd": 10000,
                            "allow_votes": true,
                            "allow_curation_rewards": true,
                            "extensions": [
                                [0, { "beneficiaries": [{ "account": "guest4test7", "weight": 40 }] }]
                            ]
                        }
                    ]
                ],
                "extensions": [],
                "signatures": []
            })
        );
    });
}

// ---------------------------------------------------------------------------
// ReplyOperation
// ---------------------------------------------------------------------------

// TS line 601: "Should be able to set percent HBD in ReplyOperation".
#[test]
fn reply_set_percent_hbd() {
    wax_test(None, |ctx| {
        let op = ReplyOperation {
            parent_author: "guest4test".into(),
            parent_permlink: "spam".into(),
            author: "gtg".into(),
            title: Some("set-percent".into()),
            body: "Set percent".into(),
            permlink: Some("set-percent".into()),
            tags: vec!["spam".into()],
            percent_hbd: Some(20),
            description: Some("Set percent".into()),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata = format!(
            r#"{{"format":"markdown+html","app":"{APP}","tags":["spam"],"description":"Set percent"}}"#
        );

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Set percent",
                        "json_metadata": json_metadata,
                        "parent_author": "guest4test",
                        "parent_permlink": "spam",
                        "permlink": "set-percent",
                        "title": "set-percent"
                    }
                },
                {
                    "type": "comment_options_operation",
                    "value": {
                        "allow_curation_rewards": true,
                        "allow_votes": true,
                        "author": "gtg",
                        "extensions": [],
                        "max_accepted_payout": { "amount": "1000000000", "nai": "@@000000013", "precision": 3 },
                        "percent_hbd": 20,
                        "permlink": "set-percent"
                    }
                }
            ])
        );
    });
}

// TS line 648: "Should be able to push images in ReplyBuiler".
#[test]
fn reply_push_images() {
    wax_test(None, |ctx| {
        let op = ReplyOperation {
            parent_author: "guest4test".into(),
            parent_permlink: "spam".into(),
            author: "gtg".into(),
            title: Some("push-images".into()),
            body: "Push images".into(),
            permlink: Some("push-images".into()),
            tags: vec!["spam".into()],
            images: vec!["test2.png".into(), "test.png".into()],
            description: Some("Push Images".into()),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata = format!(
            r#"{{"format":"markdown+html","app":"{APP}","tags":["spam"],"image":["test2.png","test.png"],"description":"Push Images"}}"#
        );

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Push images",
                        "json_metadata": json_metadata,
                        "parent_author": "guest4test",
                        "parent_permlink": "spam",
                        "permlink": "push-images",
                        "title": "push-images"
                    }
                }
            ])
        );
    });
}

// ---------------------------------------------------------------------------
// BlogPostOperation
// ---------------------------------------------------------------------------

// TS line 683: "Should be able to set category in BlogPostOperation".
#[test]
fn blog_post_set_category() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "Post with category".into(),
            body: "Post with category".into(),
            permlink: Some("post-with-category".into()),
            tags: vec!["spam".into()],
            description: Some("Post with category".into()),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata = format!(
            r#"{{"format":"markdown+html","app":"{APP}","tags":["spam"],"description":"Post with category"}}"#
        );

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Post with category",
                        "json_metadata": json_metadata,
                        "parent_author": "",
                        "parent_permlink": "test-category",
                        "permlink": "post-with-category",
                        "title": "Post with category"
                    }
                }
            ])
        );
    });
}

// TS line 716: "Should be able to set alternative author in BlogPostOperation".
#[test]
fn blog_post_alternative_author() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "Set alternative author".into(),
            body: "Set alternative author".into(),
            permlink: Some("set-alternative-author".into()),
            alternative_author: Some("initminer".into()),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata = format!(
            r#"{{"format":"markdown+html","app":"{APP}","author":"initminer"}}"#
        );

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Set alternative author",
                        "json_metadata": json_metadata,
                        "parent_author": "",
                        "parent_permlink": "test-category",
                        "permlink": "set-alternative-author",
                        "title": "Set alternative author"
                    }
                }
            ])
        );
    });
}

// TS line 748: "Should be able to push links in BlogPostOperation".
#[test]
fn blog_post_push_links() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "Push links".into(),
            body: "Push links".into(),
            permlink: Some("push-links".into()),
            links: vec![
                "https://test.com".into(),
                "https://test2.com".into(),
                "http://test3.com".into(),
            ],
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata = format!(
            r#"{{"format":"markdown+html","app":"{APP}","links":["https://test.com","https://test2.com","http://test3.com"]}}"#
        );

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Push links",
                        "json_metadata": json_metadata,
                        "parent_author": "",
                        "parent_permlink": "test-category",
                        "permlink": "push-links",
                        "title": "Push links"
                    }
                }
            ])
        );
    });
}

// TS line 780: "Should fail to set invalid asset in max accepted payout in
// BlogPostOperation". `max_accepted_payout` only accepts HBD; a HIVE asset is
// rejected at finalize-time.
#[test]
fn blog_post_invalid_max_accepted_payout_asset() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "Set max accepted payout".into(),
            body: "Set max accepted payout".into(),
            permlink: Some("set-max-accepted-payout".into()),
            max_accepted_payout: Some(NaiAssetConvertible::Asset(hive_sat(
                ctx, 100,
            ))),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        let result = tx.push_complex_operation(&ctx.base, op);
        assert!(
            result.is_err(),
            "max_accepted_payout must be HBD; HIVE should be rejected"
        );
    });
}

// TS line 797: "Should be able to set max accepted payout in BlogPostOperation".
#[test]
fn blog_post_max_accepted_payout() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "Set max accepted payout".into(),
            body: "Set max accepted payout".into(),
            permlink: Some("set-max-accepted-payout".into()),
            max_accepted_payout: Some(NaiAssetConvertible::Asset(hbd_sat(
                ctx, 100,
            ))),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata =
            format!(r#"{{"format":"markdown+html","app":"{APP}"}}"#);

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Set max accepted payout",
                        "json_metadata": json_metadata,
                        "parent_author": "",
                        "parent_permlink": "test-category",
                        "permlink": "set-max-accepted-payout",
                        "title": "Set max accepted payout"
                    }
                },
                {
                    "type": "comment_options_operation",
                    "value": {
                        "allow_curation_rewards": true,
                        "allow_votes": true,
                        "extensions": [],
                        "author": "gtg",
                        "max_accepted_payout": { "amount": "100", "nai": "@@000000013", "precision": 3 },
                        "percent_hbd": 10000,
                        "permlink": "set-max-accepted-payout"
                    }
                }
            ])
        );
    });
}

// TS line 841: "Should be able to set max accepted payout (as number) in
// BlogPostOperation".
//
// TS NOTE: TS accepts `maxAcceptedPayout: 100` (a bare number) and treats it as
// 100 HBD satoshis. The Rust builder takes a `NaiAssetConvertible`, so this
// collapses to the same asset as the previous test; kept for TS parity.
#[test]
fn blog_post_max_accepted_payout_as_number() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "Set max accepted payout".into(),
            body: "Set max accepted payout".into(),
            permlink: Some("set-max-accepted-payout".into()),
            max_accepted_payout: Some(NaiAssetConvertible::Asset(hbd_sat(
                ctx, 100,
            ))),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata =
            format!(r#"{{"format":"markdown+html","app":"{APP}"}}"#);

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Set max accepted payout",
                        "json_metadata": json_metadata,
                        "parent_author": "",
                        "parent_permlink": "test-category",
                        "permlink": "set-max-accepted-payout",
                        "title": "Set max accepted payout"
                    }
                },
                {
                    "type": "comment_options_operation",
                    "value": {
                        "allow_curation_rewards": true,
                        "allow_votes": true,
                        "author": "gtg",
                        "extensions": [],
                        "max_accepted_payout": { "amount": "100", "nai": "@@000000013", "precision": 3 },
                        "percent_hbd": 10000,
                        "permlink": "set-max-accepted-payout"
                    }
                }
            ])
        );
    });
}

// TS line 885: "Should be able to set allow curation rewards in
// BlogPostOperation".
#[test]
fn blog_post_allow_curation_rewards() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "Set allow curation rewards".into(),
            body: "Set allow curation rewards".into(),
            permlink: Some("set-allow-curation-rewards".into()),
            allow_curation_rewards: Some(false),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata =
            format!(r#"{{"format":"markdown+html","app":"{APP}"}}"#);

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Set allow curation rewards",
                        "json_metadata": json_metadata,
                        "parent_author": "",
                        "parent_permlink": "test-category",
                        "permlink": "set-allow-curation-rewards",
                        "title": "Set allow curation rewards"
                    }
                },
                {
                    "type": "comment_options_operation",
                    "value": {
                        "allow_curation_rewards": false,
                        "allow_votes": true,
                        "author": "gtg",
                        "extensions": [],
                        "max_accepted_payout": { "amount": "1000000000", "nai": "@@000000013", "precision": 3 },
                        "percent_hbd": 10000,
                        "permlink": "set-allow-curation-rewards"
                    }
                }
            ])
        );
    });
}

// TS line 929: "Should be able to set allow votes in BlogPostOperation".
#[test]
fn blog_post_allow_votes_false() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "Set allow votes".into(),
            body: "Set allow votes".into(),
            permlink: Some("set-allow-votes".into()),
            allow_votes: Some(false),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata =
            format!(r#"{{"format":"markdown+html","app":"{APP}"}}"#);

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Set allow votes",
                        "json_metadata": json_metadata,
                        "parent_author": "",
                        "parent_permlink": "test-category",
                        "permlink": "set-allow-votes",
                        "title": "Set allow votes"
                    }
                },
                {
                    "type": "comment_options_operation",
                    "value": {
                        "allow_curation_rewards": true,
                        "allow_votes": false,
                        "author": "gtg",
                        "extensions": [],
                        "max_accepted_payout": { "amount": "1000000000", "nai": "@@000000013", "precision": 3 },
                        "percent_hbd": 10000,
                        "permlink": "set-allow-votes"
                    }
                }
            ])
        );
    });
}

// TS line 973: "Using blockchain defaults in comment_options should skip this
// operation". Setting `allow_votes: true` (the chain default) leaves the
// computed options equal to the default, so the options op is suppressed.
#[test]
fn blog_post_blockchain_default_skips_options() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "Set allow votes".into(),
            body: "Set allow votes".into(),
            permlink: Some("set-allow-votes".into()),
            allow_votes: Some(true),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata =
            format!(r#"{{"format":"markdown+html","app":"{APP}"}}"#);

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Set allow votes",
                        "json_metadata": json_metadata,
                        "parent_author": "",
                        "parent_permlink": "test-category",
                        "permlink": "set-allow-votes",
                        "title": "Set allow votes"
                    }
                }
            ])
        );
    });
}

// TS line 1006: "Should be able to set format in BlogPostOperation".
#[test]
fn blog_post_set_format() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "Set format".into(),
            body: "Set format".into(),
            permlink: Some("set-format".into()),
            format: Some(CommentFormat::Markdown),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata = format!(r#"{{"format":"markdown","app":"{APP}"}}"#);

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Set format",
                        "json_metadata": json_metadata,
                        "parent_author": "",
                        "parent_permlink": "test-category",
                        "permlink": "set-format",
                        "title": "Set format"
                    }
                }
            ])
        );
    });
}

// TS line 1038: "Should be able to set explicit app in BlogPostOperation".
#[test]
fn blog_post_explicit_app() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "Set format".into(),
            body: "Set format".into(),
            permlink: Some("set-format".into()),
            json_metadata: vec![("app".into(), json!("thebest.blog@13.13"))],
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata =
            r#"{"format":"markdown+html","app":"thebest.blog@13.13"}"#;

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Set format",
                        "json_metadata": json_metadata,
                        "parent_author": "",
                        "parent_permlink": "test-category",
                        "permlink": "set-format",
                        "title": "Set format"
                    }
                }
            ])
        );
    });
}

// No direct TS counterpart: arbitrary `json_metadata` entries merge with the
// TS constructor precedence — user entries override the `format` default and
// keep their insertion position, typed `tags` merge (deduplicated) into the
// user-supplied array, and the default `app` tag is appended after the user
// entries, exactly like `Object.assign` in the TS builder.
#[test]
fn blog_post_arbitrary_json_metadata() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "Custom metadata".into(),
            body: "Custom metadata".into(),
            permlink: Some("custom-metadata".into()),
            tags: vec!["spam".into(), "photo".into()],
            json_metadata: vec![
                ("format".into(), json!("html")),
                ("canonical_url".into(), json!("https://example.com/post")),
                ("tags".into(), json!(["photo"])),
            ],
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata = format!(
            r#"{{"format":"html","canonical_url":"https://example.com/post","tags":["photo","spam"],"app":"{APP}"}}"#
        );

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "Custom metadata",
                        "json_metadata": json_metadata,
                        "parent_author": "",
                        "parent_permlink": "test-category",
                        "permlink": "custom-metadata",
                        "title": "Custom metadata"
                    }
                }
            ])
        );
    });
}

// TS line 1070: "Should be able to push and set multiple properites".
#[test]
fn blog_post_multiple_properties() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "push and set multiple properites".into(),
            body: "push and set multiple properites".into(),
            permlink: Some("push-and-set-multiple-properites".into()),
            allow_votes: Some(false),
            images: vec!["test.png".into()],
            links: vec!["https://test.com".into()],
            tags: vec!["spam".into()],
            max_accepted_payout: Some(NaiAssetConvertible::Asset(hbd_sat(
                ctx, 100,
            ))),
            percent_hbd: Some(20),
            beneficiaries: vec![BeneficiaryRoute {
                account: "guest4test7".into(),
                weight: 40,
            }],
            description: Some("Push links, images, tags, set allow votes, set max accepted payout, set percent HBD, add beneficiaries".into()),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        let json_metadata = format!(
            r#"{{"format":"markdown+html","app":"{APP}","tags":["spam"],"image":["test.png"],"links":["https://test.com"],"description":"Push links, images, tags, set allow votes, set max accepted payout, set percent HBD, add beneficiaries"}}"#
        );

        assert_eq!(
            api_ops(&tx),
            json!([
                {
                    "type": "comment_operation",
                    "value": {
                        "author": "gtg",
                        "body": "push and set multiple properites",
                        "json_metadata": json_metadata,
                        "parent_author": "",
                        "parent_permlink": "test-category",
                        "permlink": "push-and-set-multiple-properites",
                        "title": "push and set multiple properites"
                    }
                },
                {
                    "type": "comment_options_operation",
                    "value": {
                        "allow_curation_rewards": true,
                        "allow_votes": false,
                        "author": "gtg",
                        "extensions": [
                            {
                                "type": "comment_payout_beneficiaries",
                                "value": {
                                    "beneficiaries": [{ "account": "guest4test7", "weight": 40 }]
                                }
                            }
                        ],
                        "max_accepted_payout": { "amount": "100", "nai": "@@000000013", "precision": 3 },
                        "percent_hbd": 20,
                        "permlink": "push-and-set-multiple-properites"
                    }
                }
            ])
        );
    });
}

// TS line 1133: "Should be able to retriev number of custom operations that
// will be push into the Transaction".
#[test]
fn blog_post_operation_count() {
    wax_test(None, |ctx| {
        let op = BlogPostOperation {
            category: "test-category".into(),
            author: "gtg".into(),
            title: "build transaction".into(),
            body: "build transaction".into(),
            permlink: Some("build-transaction".into()),
            description: Some("build transaction".into()),
            ..Default::default()
        };

        let mut tx = fresh_tx(ctx);
        tx.push_complex_operation(&ctx.base, op)
            .expect("push_complex_operation");

        assert_eq!(tx.transaction().operations.len(), 1);
    });
}

// ---------------------------------------------------------------------------
// AccountAuthorityUpdateOperation
// ---------------------------------------------------------------------------
//
// Like the TS originals (run through the async `waxTest.dynamic` harness),
// these tests fetch the accounts' real authority state from the live mainnet
// chain; only building the operation is exercised — nothing is broadcast.

/// The well-known initminer owner key the TS assertions pin.
const INITMINER_PUBLIC_KEY: &str =
    "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX";

/// A mainnet chain plus the authority-update operation pre-initialized from
/// the given account's live on-chain state.
async fn authority_update_op(
    account: &str,
) -> (HiveChain, AccountAuthorityUpdateOperation) {
    let chain = create_hive_chain(None).unwrap();
    let op = AccountAuthorityUpdateOperation::create_for(&chain, account)
        .await
        .expect("create_for");

    (chain, op)
}

fn tapos_tx(chain: &HiveChain) -> Transaction {
    chain
        .create_transaction_with_tapos(TAPOS, EXPIRATION)
        .expect("create_transaction_with_tapos")
}

/// Pushes the operation and returns the transaction's single
/// `account_update2_operation` — the TS `tx.transaction.operations[0]`.
fn pushed_account_update2(
    chain: &HiveChain,
    op: AccountAuthorityUpdateOperation,
) -> proto::AccountUpdate2 {
    let mut tx = tapos_tx(chain);
    tx.push_complex_operation(chain, op)
        .expect("push_complex_operation");

    let operations = &tx.transaction().operations;
    assert_eq!(operations.len(), 1);

    match &operations[0].value {
        Some(OperationValue::AccountUpdate2Operation(update)) => update.clone(),
        other => panic!("expected account_update2_operation, got {other:?}"),
    }
}

// TS line 1152: "Should be able to create simple account authority update
// operation for gtg".
#[tokio::test]
async fn account_authority_update_for_gtg() {
    let (chain, mut op) = authority_update_op("gtg").await;

    // Virtually add gtg to active authority - can't have circular authority -
    // we just need it for tests.
    op.active.add("gtg", 0).unwrap();

    let update = pushed_account_update2(&chain, op);

    assert_eq!(update.account, "gtg");
    let active = update.active.as_ref().expect("active must be present");
    assert_eq!(active.account_auths.get("gtg"), Some(&0));
}

// TS line 1172: "Should be able to create simple account authority update
// operation for guest4test - no enforced Owner authority".
#[tokio::test]
async fn account_authority_update_no_enforced_owner() {
    let (chain, mut op) = authority_update_op("guest4test").await;

    op.active.add("guest4test1", None).unwrap();

    let update = pushed_account_update2(&chain, op);

    assert_eq!(update.account, "guest4test");
    let active = update.active.as_ref().expect("active must be present");
    assert_eq!(active.account_auths.get("guest4test1"), Some(&1));
    assert!(update.owner.is_none());
}

// TS line 1194: "Should be able to create simple account authority update
// operation for guest4test - enforced Owner authority".
#[tokio::test]
async fn account_authority_update_enforced_owner() {
    let (chain, mut op) = authority_update_op("guest4test").await;

    op.active.add("guest4test1", None).unwrap();
    op.enforce_owner_role_authorisation();

    let update = pushed_account_update2(&chain, op);

    assert_eq!(update.account, "guest4test");
    let active = update.active.as_ref().expect("active must be present");
    assert_eq!(active.account_auths.get("guest4test1"), Some(&1));
    assert!(update.owner.is_some());
}

// TS line 1219: "Should be able to remove owner key for initminer".
#[tokio::test]
async fn account_authority_update_remove_owner_key() {
    let (chain, mut op) = authority_update_op("initminer").await;

    // TS reads `Object.keys(...)[0]`; initminer has a single owner key.
    let owner_key = op
        .owner
        .value()
        .key_auths
        .keys()
        .next()
        .expect("owner key")
        .clone();
    op.owner.remove(&owner_key).unwrap();

    let update = pushed_account_update2(&chain, op);

    assert_eq!(update.account, "initminer");
    let owner = update.owner.as_ref().expect("owner must be present");
    assert!(!owner.key_auths.contains_key(INITMINER_PUBLIC_KEY));
}

// TS line 1243: "Should be able to replace initminer owner key with gtg
// account".
#[tokio::test]
async fn account_authority_update_replace_owner_key_with_account() {
    let (chain, mut op) = authority_update_op("initminer").await;

    let owner_key = op
        .owner
        .value()
        .key_auths
        .keys()
        .next()
        .expect("owner key")
        .clone();
    op.owner.replace(&owner_key, 1, Some("gtg")).unwrap();

    let update = pushed_account_update2(&chain, op);

    assert_eq!(update.account, "initminer");
    let owner = update.owner.as_ref().expect("owner must be present");
    assert!(!owner.key_auths.contains_key(INITMINER_PUBLIC_KEY));
    assert_eq!(owner.account_auths.get("gtg"), Some(&1));
}

// TS line 1267: "Should be able to replace initminer owner key weight".
#[tokio::test]
async fn account_authority_update_replace_owner_key_weight() {
    let (chain, mut op) = authority_update_op("initminer").await;

    let owner_key = op
        .owner
        .value()
        .key_auths
        .keys()
        .next()
        .expect("owner key")
        .clone();
    op.owner.replace(&owner_key, 2, None).unwrap();

    let update = pushed_account_update2(&chain, op);

    assert_eq!(update.account, "initminer");
    let owner = update.owner.as_ref().expect("owner must be present");
    assert_eq!(owner.key_auths.get(INITMINER_PUBLIC_KEY), Some(&2));
}
