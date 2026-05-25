// Smoke tests for the methods that `rust/wax` newly exposes on
// `WaxFoundation` after wax_core's 6cd3af55 wired up the underlying FFI.
// Aim: validate the end-to-end shape (FFI types translate correctly into the
// wax-level types), not exhaustive C++ behavior — that lives next to
// `wax_core`.

use wax::constants::MAINNET_CHAIN_ID;
use wax::models::asset::NaiAsset;
use wax::{WaxFoundation, WaxOptions, create_wax_foundation};

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

// Mirrors the TS canonical example
// (`convertTransactionFromBinaryForm` test in hive_base.ts): the hex below is
// the wire form of the API JSON also asserted in TS, so reusing it keeps the
// two ports verifying against the same fixture.
const SAMPLE_TX_HEX: &str =
    "ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000";

fn sample_tx_api_json() -> serde_json::Value {
    serde_json::json!({
        "ref_block_num": 34559u32,
        "ref_block_prefix": 1271006404u32,
        "expiration": "2021-12-13T11:31:33",
        "operations": [{
            "type": "vote_operation",
            "value": {
                "voter": "otom",
                "author": "c0ff33a",
                "permlink": "ewxhnjbj",
                "weight": 2200,
            }
        }],
        "extensions": [],
        "signatures": [],
    })
}

#[test]
fn convert_transaction_to_binary_form_matches_known_hex() {
    let f = foundation();

    let hex = f
        .convert_transaction_to_binary_form(&sample_tx_api_json(), false)
        .expect("convert_transaction_to_binary_form");

    assert_eq!(hex, SAMPLE_TX_HEX);
}

#[test]
fn convert_transaction_from_binary_form_returns_api_json_object() {
    let f = foundation();

    let value = f
        .convert_transaction_from_binary_form(&SAMPLE_TX_HEX.to_string())
        .expect("convert_transaction_from_binary_form");

    assert_eq!(value, sample_tx_api_json());
}

#[test]
fn convert_transaction_round_trips_hex_to_value_to_hex() {
    let f = foundation();

    let value = f
        .convert_transaction_from_binary_form(&SAMPLE_TX_HEX.to_string())
        .expect("convert_transaction_from_binary_form");
    let hex = f
        .convert_transaction_to_binary_form(&value, false)
        .expect("convert_transaction_to_binary_form");

    assert_eq!(hex, SAMPLE_TX_HEX);
}

#[test]
fn convert_transaction_from_binary_form_rejects_bad_hex() {
    let f = foundation();

    assert!(
        f.convert_transaction_from_binary_form(&"not-hex".to_string())
            .is_err(),
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

#[test]
fn chain_id_returns_value_from_options() {
    let f = foundation();
    assert_eq!(f.chain_id(), MAINNET_CHAIN_ID);
}

#[test]
fn chain_id_reflects_custom_options() {
    let custom = "00000000000000000000000000000000000000000000000000000000deadbeef";
    let f = create_wax_foundation(WaxOptions {
        chain_id: custom.to_string(),
    });
    assert_eq!(f.chain_id(), custom);
}

#[test]
fn get_version_matches_cargo_pkg_version() {
    let f = foundation();
    assert_eq!(f.get_version(), env!("CARGO_PKG_VERSION"));
}

#[test]
fn config_returns_known_protocol_constants() {
    let f = foundation();
    let cfg = f.config().expect("config should succeed for mainnet chain id");

    // These keys are well-known and stable across hived builds; their exact
    // values aren't asserted (they can drift with hardforks), only presence
    // and string shape.
    for required in [
        "HIVE_ADDRESS_PREFIX",
        "HIVE_CHAIN_ID",
        "HIVE_SYMBOL",
        "HBD_SYMBOL",
        "VESTS_SYMBOL",
    ] {
        assert!(
            cfg.contains_key(required),
            "config missing expected key {required}: keys={:?}",
            cfg.keys().collect::<Vec<_>>()
        );
    }
    assert_eq!(
        cfg.get("HIVE_CHAIN_ID").map(String::as_str),
        Some(MAINNET_CHAIN_ID),
        "HIVE_CHAIN_ID in config should round-trip to the configured chain_id"
    );
}

#[test]
fn config_is_cached_across_calls() {
    let f = foundation();
    let a = f.config().expect("first config");
    let b = f.config().expect("second config");
    assert_eq!(a, b, "repeated config() calls must produce identical maps");
}

#[test]
fn address_prefix_is_stm_on_mainnet() {
    let f = foundation();
    let prefix = f.address_prefix().expect("address_prefix");
    assert_eq!(prefix, "STM");
}

#[test]
fn address_prefix_fails_for_chain_id_without_address_prefix() {
    // hived's get_config rejects non-32-byte chain ids before producing the
    // map, so a malformed chain_id surfaces an error via config() rather than
    // a missing HIVE_ADDRESS_PREFIX entry. Either way, address_prefix must be
    // a Result and not silently produce empty.
    let f = create_wax_foundation(WaxOptions {
        chain_id: "not-hex".to_string(),
    });
    assert!(
        f.address_prefix().is_err(),
        "malformed chain_id must surface as an error from address_prefix"
    );
}

#[test]
fn assets_returns_zero_amount_templates_for_each_symbol() {
    let f = foundation();
    let a = f.assets().expect("assets");

    assert_eq!(a.hive.nai, HIVE_NAI);
    assert_eq!(a.hive.precision, ASSET_PRECISION);
    assert_eq!(a.hive.amount, "0");

    assert_eq!(a.hbd.nai, HBD_NAI);
    assert_eq!(a.hbd.precision, ASSET_PRECISION);
    assert_eq!(a.hbd.amount, "0");

    assert_eq!(a.vests.nai, VESTS_NAI);
    assert_eq!(a.vests.precision, VESTS_PRECISION);
    assert_eq!(a.vests.amount, "0");
}

#[test]
fn assets_is_cached_across_calls() {
    let f = foundation();
    let a = f.assets().expect("first assets");
    let b = f.assets().expect("second assets");
    assert_eq!(
        a, b,
        "repeated assets() calls must produce identical templates"
    );
}

#[test]
fn extend_config_produces_foundation_with_new_chain_id() {
    let base = foundation();
    let new_chain = "00000000000000000000000000000000000000000000000000000000deadbeef";

    let extended = base.extend_config(new_chain);

    assert_eq!(
        base.chain_id(),
        MAINNET_CHAIN_ID,
        "extend_config must not mutate the original foundation"
    );
    assert_eq!(
        extended.chain_id(),
        new_chain,
        "extended foundation must report the overridden chain id"
    );
}
