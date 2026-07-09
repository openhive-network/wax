//! Rust counterparts to `python/wax/tests/base_api/test_witness_set_properties.py`.
//!
//! The serialized `props` map matches Python and TS byte-for-byte because
//! all three implementations ultimately call
//! `foundation::cpp_serialize_witness_set_properties`.
//!
//! Standalone test binary (no shared fixture) so it doesn't transitively
//! link against beekeeper like the `detailed` suite does.

use wax::complex_operations::{HbdExchangeRate, WitnessSetPropertiesOperation};
use wax::models::asset::NaiAssetConvertible;
use wax::{Transaction, WaxFoundation, create_wax_foundation};

fn foundation() -> Box<dyn WaxFoundation> {
    create_wax_foundation(None)
}

const TAPOS_BLOCK_ID: &str = "04c1c7a566fc0da66aee465714acee7346b48ac2";
const EXPIRATION: &str = "2023-11-09T21:51:27";

fn empty_tx(f: &dyn WaxFoundation) -> Box<dyn Transaction> {
    f.create_transaction_with_tapos(TAPOS_BLOCK_ID, EXPIRATION)
        .expect("create_transaction_with_tapos")
}

// Mirrors `test_witness_set_properties_with_decay_and_budget`.
#[test]
fn decay_and_budget() {
    let f = foundation();

    let tx = empty_tx(&*f)
        .push_builder(
            &*f,
            Box::new(WitnessSetPropertiesOperation {
                owner: "emrebeyler".into(),
                witness_signing_key:
                    "STM5ShFW6UPxDRyjG4mVWYiwVWTzkmfL2k7zYoamWz2yJLpEkycju"
                        .into(),
                new_signing_key: None,
                account_creation_fee: None,
                url: None,
                hbd_exchange_rate: None,
                maximum_block_size: None,
                hbd_interest_rate: None,
                account_subsidy_budget: Some(1),
                account_subsidy_decay: Some(64),
            }),
        )
        .expect("push_builder");

    let op = match &tx.transaction().operations[0].value {
        Some(wax::proto::operation::Value::WitnessSetPropertiesOperation(
            o,
        )) => o,
        other => {
            panic!("expected WitnessSetPropertiesOperation, got {other:?}")
        }
    };
    assert_eq!(op.owner, "emrebeyler");
    assert!(op.extensions.is_empty());
    assert_eq!(op.props.len(), 3);
    assert_eq!(
        op.props.get("account_subsidy_budget").map(String::as_str),
        Some("01000000")
    );
    assert_eq!(
        op.props.get("account_subsidy_decay").map(String::as_str),
        Some("40000000")
    );
    assert_eq!(
        op.props.get("key").map(String::as_str),
        Some(
            "0249202c30b95aec7506ab719fd602256922b9ca86cc31e01499c4c6339c7292a3"
        ),
    );
}

// Mirrors `test_witness_set_properties_with_url`.
#[test]
fn url_only() {
    let f = foundation();

    let tx = empty_tx(&*f)
        .push_builder(
            &*f,
            Box::new(WitnessSetPropertiesOperation {
                owner: "therealwolf".into(),
                witness_signing_key: "STM8kPZiPjyWBjmZVMEPW4Qh2BspKuvKMBjvh9dxpZL7Kv2MGBYzC"
                    .into(),
                new_signing_key: None,
                account_creation_fee: None,
                url: Some(
                    "https://steemit.com/steem/@therealwolf/witness-application-therealwolf-updated"
                        .into(),
                ),
                hbd_exchange_rate: None,
                maximum_block_size: None,
                hbd_interest_rate: None,
                account_subsidy_budget: None,
                account_subsidy_decay: None,
            }),
        )
        .expect("push_builder");

    let op = match &tx.transaction().operations[0].value {
        Some(wax::proto::operation::Value::WitnessSetPropertiesOperation(
            o,
        )) => o,
        other => {
            panic!("expected WitnessSetPropertiesOperation, got {other:?}")
        }
    };
    assert_eq!(op.props.len(), 2);
    assert_eq!(
        op.props.get("key").map(String::as_str),
        Some(
            "03fc648d2ac16432f354acc1fe010a3c6567380e4939644deb7a74c6ebbe67da56"
        ),
    );
    assert_eq!(
        op.props.get("url").map(String::as_str),
        Some(
            "4e68747470733a2f2f737465656d69742e636f6d2f737465656d2f407468657265616c776f6c662f7769746e6573732d6170706c69636174696f6e2d7468657265616c776f6c662d75706461746564"
        ),
    );
}

// Mirrors `test_witness_set_properties_with_exchange_rate` — exercises the
// HBD→base / HIVE→quote coercion path in finalize.
#[test]
fn with_exchange_rate() {
    let f = foundation();

    let base = f.hbd_satoshis(424).expect("hbd_satoshis");
    let quote = f.hive_satoshis(1000).expect("hive_satoshis");

    let tx = empty_tx(&*f)
        .push_builder(
            &*f,
            Box::new(WitnessSetPropertiesOperation {
                owner: "ctrpch".into(),
                witness_signing_key:
                    "STM5oxZMtLbjgnsZVY2XUi58wriYCF1KUNedCzut4ogNEA19GhbiU"
                        .into(),
                new_signing_key: None,
                account_creation_fee: None,
                url: None,
                hbd_exchange_rate: Some(HbdExchangeRate {
                    base: NaiAssetConvertible::Asset(base),
                    quote: NaiAssetConvertible::Asset(quote),
                }),
                maximum_block_size: None,
                hbd_interest_rate: None,
                account_subsidy_budget: None,
                account_subsidy_decay: None,
            }),
        )
        .expect("push_builder");

    let op = match &tx.transaction().operations[0].value {
        Some(wax::proto::operation::Value::WitnessSetPropertiesOperation(
            o,
        )) => o,
        other => {
            panic!("expected WitnessSetPropertiesOperation, got {other:?}")
        }
    };
    assert_eq!(op.props.len(), 2);
    assert_eq!(
        op.props.get("hbd_exchange_rate").map(String::as_str),
        Some("a8010000000000000320bcbee8030000000000002320bcbe"),
    );
}

// HBD where HIVE is required for `account_creation_fee` — coercion at
// finalize-time should surface a `WaxError`. Same pattern as the
// `invalid_asset_in_update_proposal_fails` test in the detailed suite.
#[test]
fn rejects_wrong_asset_symbol_for_creation_fee() {
    let f = foundation();
    let wrong = f.hbd_satoshis(3000).expect("hbd_satoshis");

    let result = empty_tx(&*f).push_builder(
        &*f,
        Box::new(WitnessSetPropertiesOperation {
            owner: "therealwolf".into(),
            witness_signing_key:
                "STM8kPZiPjyWBjmZVMEPW4Qh2BspKuvKMBjvh9dxpZL7Kv2MGBYzC".into(),
            new_signing_key: None,
            account_creation_fee: Some(NaiAssetConvertible::Asset(wrong)),
            url: None,
            hbd_exchange_rate: None,
            maximum_block_size: None,
            hbd_interest_rate: None,
            account_subsidy_budget: None,
            account_subsidy_decay: None,
        }),
    );
    assert!(
        result.is_err(),
        "expected push_builder to reject an HBD asset where HIVE is required"
    );
}
