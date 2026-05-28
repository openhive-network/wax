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
    use wax::proto::{Vote, operation::Value};

    let f = foundation();

    // Build a minimal transaction so we have a known binary blob to feed
    // back through deserialize_transaction.
    let tx = f
        .create_transaction_with_tapos(
            "00000001feedfacedeadbeef00000000000000000000",
            "2026-05-15T12:00:00",
        )
        .expect("create_transaction_with_tapos")
        .push_operation(f.create_operation(Value::VoteOperation(Vote {
            voter: "alice".into(),
            author: "bob".into(),
            permlink: "p".into(),
            weight: 10_000,
        })));

    let hex = tx.to_binary_form(false).expect("to_binary_form");

    let json = f.deserialize_transaction(&hex).expect(
        "deserialize_transaction should succeed for hex from to_binary_form",
    );

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
const SAMPLE_TX_HEX: &str = "ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000";

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

// Shared with the legacy-path tests in tests/detailed/hive_base.rs — the same
// fixture also appears in ts/wasm/__tests__/assets/data.protocol.ts
// (`legacyApiTransaction`), so all three ports verify against the same bytes.
const LEGACY_TRANSACTION_JSON: &str = r#"{
    "ref_block_num": 1959,
    "ref_block_prefix": 3625727107,
    "expiration": "2023-11-09T22:01:24",
    "operations": [
        ["transfer", {
            "from": "oneplus7",
            "to": "kryptogames",
            "amount": "300.000 HIVE",
            "memo": "Roll under 50 4d434bd943616"
        }]
    ],
    "extensions": [],
    "signatures": []
}"#;

#[test]
fn create_transaction_from_legacy_json_returns_parsed_transaction() {
    let f = foundation();

    let tx = f
        .create_transaction_from_legacy_json(LEGACY_TRANSACTION_JSON)
        .expect("create_transaction_from_legacy_json should accept canonical legacy fixture");

    let ops = &tx.transaction().operations;
    assert_eq!(ops.len(), 1, "legacy fixture has exactly one transfer op");

    let transfer = match ops[0].value.as_ref().expect("op value present") {
        wax_core::proto::operation::Value::TransferOperation(t) => t,
        other => panic!("expected transfer_operation, got {other:?}"),
    };
    assert_eq!(transfer.from_account, "oneplus7");
    assert_eq!(transfer.to_account, "kryptogames");
}

#[test]
fn create_transaction_from_legacy_json_rejects_malformed_input() {
    let f = foundation();

    assert!(
        f.create_transaction_from_legacy_json("{ not valid legacy json")
            .is_err(),
        "malformed legacy JSON must surface as an error, not panic"
    );
}

// Shared with the tapos test above — exercises the same C++ path.
const TAPOS_BLOCK_ID: &str = "01020304ffeeddccbbaa99887766554433221100";
// Non-mainnet chain id so head_block_time is honored — mirrors the TS
// branch in Transaction's constructor that skips chainHeadBlockTime on
// mainnet to anchor expiration to the local clock.
const TESTNET_CHAIN_ID: &str =
    "00000000000000000000000000000000000000000000000000000000deadbeef";

#[test]
fn chain_reference_data_passes_absolute_expiration_through() {
    let f = foundation();

    let tx = f
        .create_transaction_with_chain_reference_data(
            TAPOS_BLOCK_ID,
            None,
            Some("2026-05-15T12:00:00"),
        )
        .expect("absolute expiration must be accepted");

    assert_eq!(tx.transaction().expiration, "2026-05-15T12:00:00");
    assert_eq!(tx.transaction().ref_block_num, 0x0304);
}

#[test]
fn chain_reference_data_resolves_offset_against_head_block_time_on_testnet() {
    use wax::models::basic::HiveDateTime;
    let f = create_wax_foundation(WaxOptions {
        chain_id: TESTNET_CHAIN_ID.to_string(),
    });
    let head = HiveDateTime::parse("2026-05-15T12:00:00")
        .expect("static HiveDateTime literal");

    let tx_min = f
        .create_transaction_with_chain_reference_data(
            TAPOS_BLOCK_ID,
            Some(head),
            Some("+1m"),
        )
        .expect("`+1m` offset must resolve");
    assert_eq!(tx_min.transaction().expiration, "2026-05-15T12:01:00");

    let tx_hour = f
        .create_transaction_with_chain_reference_data(
            TAPOS_BLOCK_ID,
            Some(head),
            Some("+1h"),
        )
        .expect("`+1h` offset must resolve");
    assert_eq!(tx_hour.transaction().expiration, "2026-05-15T13:00:00");

    let tx_sec = f
        .create_transaction_with_chain_reference_data(
            TAPOS_BLOCK_ID,
            Some(head),
            Some("+30s"),
        )
        .expect("`+30s` offset must resolve");
    assert_eq!(tx_sec.transaction().expiration, "2026-05-15T12:00:30");
}

#[test]
fn chain_reference_data_ignores_head_block_time_on_mainnet() {
    // On mainnet, head_block_time must NOT influence the expiration — the
    // foundation anchors to the local clock instead. Asserting "expiration
    // doesn't match the head_block_time-derived value" is enough; we don't
    // pin a precise wall-clock window because tests run on slow shared CI.
    use wax::models::basic::HiveDateTime;
    let f = foundation();
    let head = HiveDateTime::parse("2020-01-01T00:00:00")
        .expect("static HiveDateTime literal");

    let tx = f
        .create_transaction_with_chain_reference_data(
            TAPOS_BLOCK_ID,
            Some(head),
            Some("+1m"),
        )
        .expect("offset must resolve against local clock");

    assert_ne!(
        tx.transaction().expiration,
        "2020-01-01T00:01:00",
        "mainnet expiration must not be anchored to caller-supplied head_block_time"
    );
}

#[test]
fn chain_reference_data_defaults_expiration_to_one_minute() {
    let f = foundation();

    let tx = f
        .create_transaction_with_chain_reference_data(
            TAPOS_BLOCK_ID,
            None,
            None,
        )
        .expect("default expiration path must succeed");

    let exp = &tx.transaction().expiration;
    assert!(
        !exp.is_empty() && exp.contains('T'),
        "default expiration must be a hive-formatted timestamp, got: {exp}"
    );
}

#[test]
fn chain_reference_data_rejects_malformed_offset() {
    let f = foundation();

    assert!(
        f.create_transaction_with_chain_reference_data(
            TAPOS_BLOCK_ID,
            None,
            Some("+")
        )
        .is_err(),
        "bare `+` must error — no digits"
    );
    assert!(
        f.create_transaction_with_chain_reference_data(
            TAPOS_BLOCK_ID,
            None,
            Some("+10x")
        )
        .is_err(),
        "unknown suffix must error"
    );
}

// Shared `vote_operation` fixture from ts/wasm/__tests__/assets/data.protocol.ts —
// reusing it keeps the Rust port verifying against the same bytes the TS suite does.
fn sample_vote_operation() -> wax_core::proto::Operation {
    use wax_core::proto::{Vote, operation::Value};
    wax_core::proto::Operation {
        value: Some(Value::VoteOperation(Vote {
            voter: "otom".into(),
            author: "c0ff33a".into(),
            permlink: "ewxhnjbj".into(),
            weight: 2200,
        })),
    }
}

#[test]
fn operation_get_impacted_accounts_returns_voter_and_author() {
    let f = foundation();
    let op = sample_vote_operation();

    let impacted = f
        .operation_get_impacted_accounts(&op)
        .expect("operation_get_impacted_accounts");

    // TS asserts the same order: ["c0ff33a", "otom"] (author, then voter).
    assert_eq!(impacted, vec!["c0ff33a".to_string(), "otom".to_string()]);
}

#[test]
fn operation_binary_view_metadata_returns_binary_and_offsets() {
    use wax::result::BinaryViewNode;

    let f = foundation();
    let op = sample_vote_operation();

    let view = f
        .operation_binary_view_metadata(&op, true)
        .expect("operation_binary_view_metadata");

    // Operation binary for this vote: type tag (`00` = vote_operation),
    // then length-prefixed voter / author / permlink and little-endian
    // weight 2200 (0x0898).
    assert_eq!(
        view.binary,
        "00046f746f6d076330666633336108657778686e6a626a9808"
    );
    assert!(
        !view.offsets.is_empty(),
        "binary view must contain at least one root offset node"
    );

    // First root node should be the vote operation envelope/key; sanity check
    // that the tree walker produced *something* with a key, not an empty stub.
    let key = match &view.offsets[0] {
        BinaryViewNode::Scalar { key, .. }
        | BinaryViewNode::Array { key, .. }
        | BinaryViewNode::Object { key, .. } => key,
    };
    assert!(!key.is_empty(), "root offset node must carry a key");
}

#[test]
fn get_public_key_from_signature_recovers_known_signer() {
    // Fixture from python/wax/tests/base_api/test_transaction_processing.py:
    // signing the digest below with private key
    // 5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT yields this
    // canonical signature and recovers the matching STM-form public key.
    let digest =
        "d07a8509795ff7c6f33ab7d6f4da24044e8f5833f0dffcd357bf21ba5e4db1d9"
            .to_string();
    let signature = "1f7c6eb7a30681d77606a1491be2869e8112fee5241ec13cea5c7b4f54edc8d1\
                     45269172f88359bb190fb26b362c81ccdf02bb56eb1d09daea3a381e5580e52f58"
        .to_string();
    let expected = "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh";

    let f = foundation();
    let recovered = f
        .get_public_key_from_signature(&digest, &signature)
        .expect("get_public_key_from_signature");

    assert_eq!(recovered, expected);
}

#[test]
fn get_public_key_from_signature_rejects_invalid_signature() {
    let f = foundation();

    assert!(
        f.get_public_key_from_signature(
            &"not-hex".to_string(),
            &"not-hex".to_string()
        )
        .is_err(),
        "non-hex inputs must surface as a Result error"
    );
}

#[test]
fn set_expiration_updates_both_handle_and_proto_state() {
    let f = foundation();
    let mut tx = f
        .create_transaction_with_tapos(
            "00000001feedfacedeadbeef00000000000000000000",
            "2026-05-15T12:00:00",
        )
        .expect("create_transaction_with_tapos");

    let new_expiration = "2026-12-31T23:59:00";
    tx.set_expiration(new_expiration).expect("set_expiration");

    // Proto mirror is updated...
    assert_eq!(tx.transaction().expiration, new_expiration);
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
    let custom =
        "00000000000000000000000000000000000000000000000000000000deadbeef";
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
    let cfg = f
        .config()
        .expect("config should succeed for mainnet chain id");

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
    let new_chain =
        "00000000000000000000000000000000000000000000000000000000deadbeef";

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

// Fixtures shared with python/wax/tests/protocol/test_check_memo_for_private_keys.py,
// so the Rust + Python ports verify against the same private/public key pairs.
mod scan_text_for_matching_private_keys {
    use super::foundation;
    use std::collections::HashMap;
    use wax::models::authority::{Authorities, WaxAuthority};

    const ACCOUNT: &str = "alice";

    const OWNER_PRIVATE: &str =
        "5Kcb526wim2obMPFQVJcAVbtkWJkFYo746afCLU5cMGttD9cYGw";
    const ACTIVE_PRIVATE: &str =
        "5Jj2jixMhsR2R1oriWchsQYimH1XyGo4N9s6iB7J3uHyNeq3Ge5";
    const POSTING_PRIVATE: &str =
        "5JhEUJADWcRq3rEP7eWxAHmd8yrigfPhi4DXFPr442AavFEgjXX";
    const MEMO_PRIVATE: &str =
        "5KZEKVcSF1t2JhbZHNm1PQ3yoxDxRJGK9UWTQdeZw136vXpHTsj";

    const OWNER_PUBLIC: &str =
        "STM5v3682EzJbJmxUiACzLdtNP3AYYYSATC5AszYpb2Ve3riBnevN";
    const ACTIVE_PUBLIC: &str =
        "STM7599MhAJN4hkBLp7JHvqMVRMb9X1rnfpbc23LJs7HjQgkAi7ea";
    const POSTING_PUBLIC: &str =
        "STM5h6ivYuxwA6KTQYHBoZihbou8MsjahP4CgtmG5owtpxQYeyyh3";
    const MEMO_PUBLIC: &str =
        "STM65g4T6xwpy9tE8PeQaBfqgpWXUHshUjSTpnu2MwUiftdbZ8c3x";

    const IMPORTED_PRIVATE: &str =
        "5JZhZRpYjWYm3jKsz5JEpPDG38Dn9JzhXTFg7gwrpgiLVKuH13B";
    const IMPORTED_PUBLIC: &str =
        "STM8fZEprWbZPauKhypTWsaZunyzhVpauB6xkUJZJXVEvkNzpS2ue";

    fn role_authority(public_key: &str) -> WaxAuthority {
        let mut key_auths = HashMap::new();
        key_auths.insert(public_key.to_string(), 1);
        WaxAuthority {
            weight_threshold: 1,
            account_auths: HashMap::new(),
            key_auths,
        }
    }

    fn authorities() -> Authorities {
        Authorities {
            owner: Some(role_authority(OWNER_PUBLIC)),
            active: Some(role_authority(ACTIVE_PUBLIC)),
            posting: Some(role_authority(POSTING_PUBLIC)),
        }
    }

    fn assert_leak(content: &str, expected_role: &str) {
        let f = foundation();
        let err = f
            .scan_text_for_matching_private_keys(
                content,
                ACCOUNT,
                &authorities(),
                &MEMO_PUBLIC.to_string(),
                &[IMPORTED_PUBLIC.to_string()],
            )
            .expect_err("private key leak must surface as an error");
        let msg = err.to_string();
        assert!(
            msg.contains("Detected private key leak"),
            "error must carry the C++ leak diagnostic, got: {msg}"
        );
        assert!(
            msg.contains(&format!("\"authority_role\":\"{expected_role}\"")),
            "error must mention authority_role={expected_role}, got: {msg}"
        );
        assert!(
            msg.contains(&format!("\"account\":\"{ACCOUNT}\"")),
            "error must mention account={ACCOUNT}, got: {msg}"
        );
    }

    #[test]
    fn detects_owner_private_key_in_content() {
        assert_leak(OWNER_PRIVATE, "owner");
    }

    #[test]
    fn detects_active_private_key_in_content() {
        assert_leak(ACTIVE_PRIVATE, "active");
    }

    #[test]
    fn detects_posting_private_key_in_content() {
        assert_leak(POSTING_PRIVATE, "posting");
    }

    #[test]
    fn detects_memo_private_key_in_content() {
        assert_leak(MEMO_PRIVATE, "memo");
    }

    #[test]
    fn detects_imported_private_key_in_content() {
        assert_leak(IMPORTED_PRIVATE, "imported");
    }

    #[test]
    fn clean_text_returns_ok() {
        let f = foundation();
        let result = f.scan_text_for_matching_private_keys(
            "just a regular memo with no keys inside",
            ACCOUNT,
            &authorities(),
            &MEMO_PUBLIC.to_string(),
            &[IMPORTED_PUBLIC.to_string()],
        );
        assert!(result.is_ok(), "clean content must not produce an error");
    }

    #[test]
    fn accepts_no_other_keys() {
        let f = foundation();
        // Same memo private key still trips the memo-role check even with no
        // imported keys supplied — matches Python's default `other_keys = []`.
        let err = f
            .scan_text_for_matching_private_keys(
                MEMO_PRIVATE,
                ACCOUNT,
                &authorities(),
                &MEMO_PUBLIC.to_string(),
                &[],
            )
            .expect_err(
                "memo private key with empty other_keys must still error",
            );
        assert!(err.to_string().contains("\"authority_role\":\"memo\""));
    }
}
