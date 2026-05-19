// Smoke tests for the methods that `rust/wax` newly exposes on
// `WaxFoundation` after wax_core's 6cd3af55 wired up the underlying FFI.
// Aim: validate the end-to-end shape (FFI types translate correctly into the
// wax-level types), not exhaustive C++ behavior — that lives next to
// `wax_core`.

use wax::constants::MAINNET_CHAIN_ID;
use wax::models::asset::NaiAsset;
use wax::{WaxFoundation, create_wax_foundation};

const HIVE_NAI: &str = "@@000000021";
const HBD_NAI: &str = "@@000000013";
const VESTS_NAI: &str = "@@000000037";
const ASSET_PRECISION: u32 = 3;
const VESTS_PRECISION: u32 = 6;

fn foundation() -> Box<dyn WaxFoundation> {
    create_wax_foundation(None)
}

#[test]
fn hive_satoshis_returns_typed_nai_asset() {
    let f = foundation();

    let asset = f.hive_satoshis(1_234).expect("hive_satoshis");

    assert_eq!(
        asset,
        NaiAsset {
            amount: "1234".into(),
            precision: ASSET_PRECISION,
            nai: HIVE_NAI.into(),
        }
    );
}

#[test]
fn hbd_satoshis_returns_typed_nai_asset() {
    let f = foundation();

    let asset = f.hbd_satoshis(42).expect("hbd_satoshis");

    assert_eq!(asset.nai, HBD_NAI);
    assert_eq!(asset.precision, ASSET_PRECISION);
    assert_eq!(asset.amount, "42");
}

#[test]
fn vests_satoshis_returns_six_decimal_asset() {
    let f = foundation();

    let asset = f.vests_satoshis(1_000_000).expect("vests_satoshis");

    assert_eq!(asset.nai, VESTS_NAI);
    assert_eq!(asset.precision, VESTS_PRECISION);
    assert_eq!(asset.amount, "1000000");
}

#[test]
fn is_valid_account_name_accepts_real_account() {
    let f = foundation();

    assert!(f.is_valid_account_name("alice"));
}

#[test]
fn is_valid_account_name_rejects_uppercase() {
    let f = foundation();

    // Hive account names are constrained to lowercase; this is the kind of
    // basic rule the C++ validator catches.
    assert!(!f.is_valid_account_name("Alice"));
}

#[test]
fn is_valid_account_name_rejects_empty() {
    let f = foundation();

    assert!(!f.is_valid_account_name(""));
}

#[test]
fn get_tapos_data_returns_block_components() {
    let f = foundation();
    // Valid block id: 20-byte hex; first 4 bytes are the big-endian block
    // number, the rest are arbitrary hash bytes. Using number 0x01020304
    // (16_909_060) lets us check we got back a sane ref_block_num (low 16
    // bits of block_number).
    let block_id = "01020304ffeeddccbbaa99887766554433221100";

    let data = f.get_tapos_data(block_id).expect("tapos");

    assert_eq!(data.ref_block_num, 0x0304);
    // The prefix is derived from later bytes of the hash; we only assert
    // it's non-zero (zero would mean the C++ side never ran).
    assert_ne!(data.ref_block_prefix, 0);
}

#[test]
fn get_tapos_data_rejects_invalid_block_id() {
    let f = foundation();

    assert!(
        f.get_tapos_data("not-hex").is_err(),
        "non-hex block id must produce an error"
    );
}

#[test]
fn deserialize_transaction_round_trips_through_binary() {
    use cxx::UniquePtr;
    use std::sync::OnceLock;
    use wax::Transaction;
    use wax_core::ffi::{new_rust_protocol, rust_protocol};
    use wax_core::proto::{Vote, operation::Value};
    use wax_core::{RustOperation, RustTransaction};

    struct SyncProtocol(UniquePtr<rust_protocol>);
    unsafe impl Sync for SyncProtocol {}
    unsafe impl Send for SyncProtocol {}
    static TEST_PROTOCOL: OnceLock<SyncProtocol> = OnceLock::new();
    let protocol = TEST_PROTOCOL
        .get_or_init(|| SyncProtocol(new_rust_protocol()))
        .0
        .as_ref()
        .expect("new_rust_protocol returned null");

    // Build a minimal transaction so we have a known binary blob to feed
    // back through deserialize_transaction.
    let tx = RustTransaction::new(
        protocol,
        MAINNET_CHAIN_ID,
        1,
        0xfeed_face,
        "2026-05-15T12:00:00",
        Vec::new(),
    )
    .push_operation(RustOperation::new(
        protocol,
        Value::VoteOperation(Vote {
            voter: "alice".into(),
            author: "bob".into(),
            permlink: "p".into(),
            weight: 10_000,
        }),
    ));

    let hex = tx.to_binary_form(false).expect("to_binary_form");

    let f = foundation();
    let json = f
        .deserialize_transaction(&hex)
        .expect("deserialize_transaction should succeed for hex from to_binary_form");

    assert!(json.contains("vote_operation"), "missing op type: {json}");
    assert!(
        json.contains("\"voter\":\"alice\""),
        "missing voter: {json}"
    );
}

#[test]
fn deserialize_transaction_rejects_bad_hex() {
    let f = foundation();

    assert!(
        f.deserialize_transaction(&"not-hex".to_string()).is_err(),
        "non-hex blob must error"
    );
}

#[test]
fn set_expiration_updates_both_handle_and_proto_state() {
    use cxx::UniquePtr;
    use std::sync::OnceLock;
    use wax::Transaction;
    use wax_core::RustTransaction;
    use wax_core::ffi::{new_rust_protocol, rust_protocol};

    struct SyncProtocol(UniquePtr<rust_protocol>);
    unsafe impl Sync for SyncProtocol {}
    unsafe impl Send for SyncProtocol {}
    static TEST_PROTOCOL: OnceLock<SyncProtocol> = OnceLock::new();
    let protocol = TEST_PROTOCOL
        .get_or_init(|| SyncProtocol(new_rust_protocol()))
        .0
        .as_ref()
        .expect("new_rust_protocol returned null");

    let mut tx = RustTransaction::new(
        protocol,
        MAINNET_CHAIN_ID,
        1,
        0xfeed_face,
        "2026-05-15T12:00:00",
        Vec::new(),
    );

    let new_expiration = "2026-12-31T23:59:00";
    tx.set_expiration(new_expiration).expect("set_expiration");

    // Proto mirror is updated...
    assert_eq!(tx.proto().expiration, new_expiration);
    // ...and the underlying handle reflects the change too (visible via JSON).
    let json = tx.to_api().expect("to_api");
    assert!(
        json.contains(new_expiration),
        "to_api should reflect new expiration: {json}"
    );
}
