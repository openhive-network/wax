// Rust port of `ts/wasm/__tests__/detailed/hive_base.ts`.
//
// Tests appear in TS source order. Each Rust test has a `// TS line N` comment
// pointing back to the TS original. Tests that depend on Rust surface that
// hasn't been ported yet (signing / beekeeper, complex operation builders,
// key utilities, the `waxify` formatter, calculateAccountHp /
// calculateWitnessVotesHp) are kept as `#[ignore]` stubs so they remain
// visible in `cargo test` output.

use wax::models::asset::{NaiAsset, NaiAssetConvertible};
use wax::result::JsonPrice;
use wax::{Operation, RustOperation, Transaction};

use crate::common::wax_test;

// ---------------------------------------------------------------------------
// Shared fixtures mirroring ts/wasm/__tests__/assets/*.ts
// ---------------------------------------------------------------------------

// data.proto-protocol.ts: `protoVoteOp`
const VOTE_OPERATION_JSON: &str = r#"{
    "vote_operation": {
        "voter": "otom",
        "author": "c0ff33a",
        "permlink": "ewxhnjbj",
        "weight": 2200
    }
}"#;

// data.protocol.ts: `naiAsset` ({ amount: "300000", precision: 3, nai: HIVE })
fn nai_asset() -> NaiAsset {
    NaiAsset {
        amount: "300000".into(),
        precision: 3,
        nai: "@@000000021".into(),
    }
}

// data.protocol.ts: `transaction` — API JSON shape (`{type, value}` envelope).
// Matches TS's `createTransactionFromJson` and Python's
// `create_transaction_from_json` input contract.
const TRANSACTION_JSON: &str = r#"{
    "ref_block_num": 34559,
    "ref_block_prefix": 1271006404,
    "expiration": "2021-12-13T11:31:33",
    "operations": [
        {
            "type": "vote_operation",
            "value": {
                "voter": "otom",
                "author": "c0ff33a",
                "permlink": "ewxhnjbj",
                "weight": 2200
            }
        }
    ],
    "extensions": [],
    "signatures": []
}"#;

// data.protocol.ts: `legacyApiTransaction`
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

// Convenience: Rust has no `createTransactionFromLegacyJson` shortcut, so
// every legacy-path test goes through this two-step bridge — mirrors what TS
// and Python do internally (`cpp_legacy_tx_to_json` → `from_api`).
fn create_transaction_from_legacy_json(
    ctx: &crate::common::WaxTestCtx,
    legacy_json: &str,
) -> wax::RustTransaction {
    let api_json = ctx
        .base
        .legacy_transaction_to_json(legacy_json)
        .expect("legacy_transaction_to_json");
    ctx.base
        .create_transaction_from_json(&api_json)
        .expect("create_transaction_from_json")
}

fn hive_sat(ctx: &crate::common::WaxTestCtx, amount: i64) -> NaiAsset {
    ctx.base.hive_satoshis(amount).expect("hive_satoshis")
}
fn hbd_sat(ctx: &crate::common::WaxTestCtx, amount: i64) -> NaiAsset {
    ctx.base.hbd_satoshis(amount).expect("hbd_satoshis")
}
fn vests_sat(ctx: &crate::common::WaxTestCtx, amount: i64) -> NaiAsset {
    ctx.base.vests_satoshis(amount).expect("vests_satoshis")
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

// TS line 11: "Should be able to create TAPOS transaction using implicit
// expiration time".
// TODO: requires (a) a no-expiration overload of `create_transaction_with_tapos`
// (Rust's signature mandates an explicit expiration), and (b) signing via a
// wallet/signer — neither is ported to Rust yet.
#[test]
#[ignore = "needs implicit-expiration TaPoS overload and a Rust signer"]
fn tapos_with_implicit_expiration() {}

// TS line 49: "Should be able to convert HIVE to HBD - numbers".
#[test]
fn hive_to_hbd_numbers() {
    wax_test(None, |ctx| {
        let amount = hive_sat(ctx, 13_316_762_799);
        let base = hbd_sat(ctx, 171);
        let quote = hive_sat(ctx, 1_000);
        let result = ctx
            .base
            .hive_to_hbd(&amount, &base, &quote)
            .expect("hive_to_hbd");
        assert_eq!(
            result,
            NaiAsset {
                amount: "2277166438".into(),
                precision: 3,
                nai: "@@000000013".into(),
            }
        );
    });
}

// TS line 63: "Should be able to convert HIVE to HBD - NAIs".
#[test]
fn hive_to_hbd_with_nai_assets() {
    wax_test(None, |ctx| {
        let amount = hive_sat(ctx, 13_316_762_799_000);
        let base = hbd_sat(ctx, 171_000);
        let quote = hive_sat(ctx, 1_000_000);
        let result = ctx
            .base
            .hive_to_hbd(&amount, &base, &quote)
            .expect("hive_to_hbd");
        assert_eq!(
            result,
            NaiAsset {
                amount: "2277166438629".into(),
                precision: 3,
                nai: "@@000000013".into(),
            }
        );
    });
}

// TS line 78: "Should be able to validate valid account names".
#[test]
fn valid_account_name_is_accepted() {
    wax_test(None, |ctx| {
        assert!(ctx.base.is_valid_account_name("gtg"));
    });
}

// TS line 86: "Should be able to validate invalid account names".
#[test]
fn invalid_account_names_are_rejected() {
    wax_test(None, |ctx| {
        // Too short.
        assert!(!ctx.base.is_valid_account_name("g"));
        // Too long. The TS test reads HIVE_MAX_ACCOUNT_NAME_LENGTH from
        // `base.config`; Rust doesn't expose that config, so we use the
        // canonical mainnet value of 16.
        let too_long = "a".repeat(17);
        assert!(!ctx.base.is_valid_account_name(&too_long));
        // Invalid sequence.
        assert!(!ctx.base.is_valid_account_name("a..b"));
    });
}

// TS line 103: "Should be able to convert VESTS to HP (bug)".
// TODO: requires the `waxify` template-literal formatter to assert against
// strings like "4,044,780.037 HIVE". The underlying `vests_to_hp` calculation
// works; only the formatting layer is missing.
#[test]
#[ignore = "needs the `waxify` formatter"]
fn vests_to_hp_regression_with_waxify() {}

// TS line 148: "Should be able to generate negative HIVE asset".
#[test]
fn negative_hive_satoshis_asset() {
    wax_test(None, |ctx| {
        let asset = ctx.base.hive_satoshis(-300_000).expect("hive_satoshis");
        assert_eq!(
            asset,
            NaiAsset {
                amount: "-300000".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 160: "Should be able to generate negative HBD asset".
#[test]
fn negative_hbd_satoshis_asset() {
    wax_test(None, |ctx| {
        let asset = ctx.base.hbd_satoshis(-300_000).expect("hbd_satoshis");
        assert_eq!(
            asset,
            NaiAsset {
                amount: "-300000".into(),
                precision: 3,
                nai: "@@000000013".into(),
            }
        );
    });
}

// TS line 172: "Should be able to generate negative VESTS asset".
#[test]
fn negative_vests_satoshis_asset() {
    wax_test(None, |ctx| {
        let asset = ctx.base.vests_satoshis(-300_000_000).expect("vests_satoshis");
        assert_eq!(
            asset,
            NaiAsset {
                amount: "-300000000".into(),
                precision: 6,
                nai: "@@000000037".into(),
            }
        );
    });
}

// TS line 184: "Should be able to convert API asset to the proper negative
// HIVE asset data".
#[test]
fn get_asset_negative_hive() {
    wax_test(None, |ctx| {
        let mut asset = nai_asset();
        asset.amount = format!("-{}", asset.amount);
        let result = ctx.base.get_asset(&asset).expect("get_asset");
        assert_eq!(result.amount, "-300.000");
        assert_eq!(result.symbol, "HIVE");
    });
}

// TS line 197: "Should be able to convert API asset to the proper HIVE asset
// data".
#[test]
fn get_asset_positive_hive() {
    wax_test(None, |ctx| {
        let result = ctx.base.get_asset(&nai_asset()).expect("get_asset");
        assert_eq!(result.amount, "300.000");
        assert_eq!(result.symbol, "HIVE");
    });
}

// TS line 210: "Should be able to convert VESTS to HP".
#[test]
fn vests_to_hp_basic() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .vests_to_hp(&vests_sat(ctx, 10), &hive_sat(ctx, 1), &vests_sat(ctx, 10))
            .expect("vests_to_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "1".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 222: "Should be able to convert VESTS to HP using NaiAssets".
#[test]
fn vests_to_hp_using_nai_assets() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .vests_to_hp(
                &vests_sat(ctx, 10),
                &hive_sat(ctx, 10),
                &vests_sat(ctx, 10),
            )
            .expect("vests_to_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "10".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 234: "Should be able to convert VESTS to HP using mixed params".
// Rust requires NaiAsset everywhere — there's no raw-number overload — so
// this collapses to the same call as the previous test. Kept for TS parity.
#[test]
fn vests_to_hp_mixed_params() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .vests_to_hp(
                &vests_sat(ctx, 10),
                &hive_sat(ctx, 10),
                &vests_sat(ctx, 10),
            )
            .expect("vests_to_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "10".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 246: "Should be able to convert HBD to HIVE".
#[test]
fn hbd_to_hive_basic() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .hbd_to_hive(&hbd_sat(ctx, 10), &hbd_sat(ctx, 1), &hive_sat(ctx, 10))
            .expect("hbd_to_hive");
        assert_eq!(
            result,
            NaiAsset {
                amount: "100".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 258: "Should be able to convert HBD to HIVE using NaiAsset".
#[test]
fn hbd_to_hive_using_nai_assets() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .hbd_to_hive(&hbd_sat(ctx, 10), &hbd_sat(ctx, 1), &hive_sat(ctx, 10))
            .expect("hbd_to_hive");
        assert_eq!(
            result,
            NaiAsset {
                amount: "100".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 270: "Should be able to convert HBD to HIVE using mixed params".
// Same collapse as the vests_to_hp mixed case.
#[test]
fn hbd_to_hive_mixed_params() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .hbd_to_hive(&hbd_sat(ctx, 10), &hbd_sat(ctx, 1), &hive_sat(ctx, 10))
            .expect("hbd_to_hive");
        assert_eq!(
            result,
            NaiAsset {
                amount: "100".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 282: "Should be able to convert API asset to the proper custom
// asset data".
#[test]
fn get_asset_custom_nai() {
    wax_test(None, |ctx| {
        let asset = NaiAsset {
            amount: "300".into(),
            precision: 1,
            nai: "@@002137000".into(),
        };
        let result = ctx.base.get_asset(&asset).expect("get_asset");
        assert_eq!(result.amount, "30.0");
        assert_eq!(result.symbol, "@@002137000");
    });
}

// TS line 299: "Should be able to bidirectional convert api to proto using
// object interface". Feed API JSON in, get API JSON back, expect the second
// round to parse identically to the first.
#[test]
fn bidirectional_json_proto_round_trip() {
    wax_test(None, |ctx| {
        let first = ctx
            .base
            .create_transaction_from_json(TRANSACTION_JSON)
            .expect("create_transaction_from_json");
        let api_json = first.to_api().expect("to_api");

        let second = ctx
            .base
            .create_transaction_from_json(&api_json)
            .expect("create_transaction_from_json (round-trip)");

        assert_eq!(first.transaction(), second.transaction());
    });
}

// TS line 313: "Should be able to get impacted accounts from example api
// operation". The TS test calls `base.operationGetImpactedAccounts(op)` on a
// bare operation; the Rust equivalent is the `Operation` trait's
// `impacted_accounts` (impl'd on `RustOperation` in wax::internal::operation),
// which goes through the same C++ entry point (`cpp_op_impacted_accounts`).
//
// TS 313 and 321 differ only in fixture shape (api `{type, value}` vs proto
// `{vote_operation: {...}}`). In Rust both end up as the same proto after
// `from_json`, so the two tests share the same body but stay separate for TS
// traceability.
#[test]
fn operation_get_impacted_accounts_api() {
    wax_test(None, |_ctx| {
        let protocol = wax_core::ffi::new_rust_protocol();
        let op = RustOperation::from_json(protocol.as_ref().unwrap(), VOTE_OPERATION_JSON)
            .expect("from_json");
        let accounts = op.impacted_accounts().expect("impacted_accounts");
        assert_eq!(accounts, vec!["c0ff33a".to_string(), "otom".to_string()]);
    });
}

// TS line 321: "Should be able to get impacted accounts from example proto
// operation". Same body as the api-shape test — see the note above.
#[test]
fn operation_get_impacted_accounts_proto() {
    wax_test(None, |_ctx| {
        let protocol = wax_core::ffi::new_rust_protocol();
        let op = RustOperation::from_json(protocol.as_ref().unwrap(), VOTE_OPERATION_JSON)
            .expect("from_json");
        let accounts = op.impacted_accounts().expect("impacted_accounts");
        assert_eq!(accounts, vec!["c0ff33a".to_string(), "otom".to_string()]);
    });
}

// TS line 329: "Should be able to create and sign transaction using object
// interface". Ported without signing: we build, validate, and confirm the
// (unsigned) sig digest matches the TS-pinned value. The signature / signees
// half of the TS assertions can't run until a Rust signer lands.
#[test]
fn create_transaction_using_object_interface() {
    wax_test(None, |ctx| {
        let protocol = wax_core::ffi::new_rust_protocol();
        let op = RustOperation::from_json(protocol.as_ref().unwrap(), VOTE_OPERATION_JSON)
            .expect("operation json");

        let tx = ctx
            .base
            .create_transaction_with_tapos(
                "04c1c7a566fc0da66aee465714acee7346b48ac2",
                "2023-08-01T15:38:48",
            )
            .expect("create_transaction_with_tapos")
            .push_operation(op);

        tx.validate().expect("validate");

        let digest = tx.sig_digest().expect("sig_digest");
        assert_eq!(
            digest, "205c79e3d17211882b1a2ba8640ff208413d68cabdca892cf47e9a6ad46e63a1",
            "sig digest must match the value pinned by the TS suite"
        );

        let signees = tx.signature_keys().expect("signature_keys");
        assert!(
            signees.is_empty(),
            "unsigned transaction must yield no signature keys (signing TODO)"
        );
    });
}

// TS line 359: "Should be able to binary serialize signed transaction using
// object interface".
// TODO: all the pinned values (sig, digest, binHex) include signature bytes,
// and the second pushed op is a `DefineRecurrentTransferOperation` complex
// builder. Needs both a signer and the complex-op wrappers.
#[test]
#[ignore = "needs Rust signer + DefineRecurrentTransferOperation complex builder"]
fn binary_serialize_signed_transaction() {}

// TS line 396: "Should be able to convert transaction json to binary form".
#[test]
fn convert_transaction_json_to_binary_form() {
    wax_test(None, |ctx| {
        let hex = ctx
            .base
            .create_transaction_from_json(TRANSACTION_JSON)
            .expect("create_transaction_from_json")
            .to_binary_form(false)
            .expect("to_binary_form");
        assert_eq!(
            hex,
            "ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000"
        );
    });
}

// TS line 404: "Should not be able to convert transaction json to binary
// form because of invalid input type". The TS test uses `"type": "vote"`
// instead of `"vote_operation"`; the C++ visitor's static_variant case
// rejects unknown operation names.
#[test]
fn invalid_transaction_json_fails_to_parse() {
    wax_test(None, |ctx| {
        let bad = r#"{
            "expiration": "2021-12-13T11:31:33",
            "extensions": [],
            "operations": [{
                "type": "vote",
                "value": {
                    "author": "c0ff33a",
                    "permlink": "ewxhnjbj",
                    "voter": "otom",
                    "weight": 2200
                }
            }],
            "ref_block_num": 34559,
            "ref_block_prefix": 1271006404,
            "signatures": []
        }"#;
        let result = ctx.base.create_transaction_from_json(bad);
        assert!(
            result.is_err(),
            "transaction JSON with unknown operation type must be rejected"
        );
    });
}

// TS line 430: "Should be able to convert binary transaction to json form".
#[test]
fn convert_binary_transaction_to_json_form() {
    wax_test(None, |ctx| {
        // deserialize_transaction takes `&Hex` (= `&String`); bind first so
        // we can pass a borrow rather than a `&'static str`.
        let hex: String =
            "ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000".into();
        let json = ctx
            .base
            .deserialize_transaction(&hex)
            .expect("deserialize_transaction");
        // `deserialize_transaction` emits API JSON (via the C++ side), so
        // assertions follow the TS `{type, value}` shape.
        assert!(json.contains("\"type\":\"vote_operation\""));
        assert!(json.contains("\"voter\":\"otom\""));
        assert!(json.contains("\"author\":\"c0ff33a\""));
        assert!(json.contains("\"weight\":2200"));
        assert!(json.contains("\"ref_block_num\":34559"));
        assert!(json.contains("\"ref_block_prefix\":1271006404"));
        assert!(json.contains("\"expiration\":\"2021-12-13T11:31:33\""));
    });
}

// TS line 453: "Should be able to call convertTransactionToBinaryForm on
// object received from convertTransactionFromBinaryForm".
#[test]
fn binary_to_json_to_binary_round_trip() {
    wax_test(None, |ctx| {
        let hex: String =
            "ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000".into();
        let api_json = ctx
            .base
            .deserialize_transaction(&hex)
            .expect("deserialize_transaction");
        let rebuilt_hex = ctx
            .base
            .create_transaction_from_json(&api_json)
            .expect("create_transaction_from_json")
            .to_binary_form(false)
            .expect("to_binary_form");
        assert_eq!(rebuilt_hex, hex);
    });
}

// TS line 461: "Should be able to create a recurrent transfer with underlying
// extensions using transaction interface".
// TODO: needs `RecurrentTransferRemovalOperation` and
// `DefineRecurrentTransferOperation` complex-op builders.
#[test]
#[ignore = "needs RecurrentTransferRemovalOperation + DefineRecurrentTransferOperation builders"]
fn recurrent_transfer_with_extensions() {}

// TS line 510: "Should be able to create a recurrent transfer without any
// underlying extensions using transaction interface".
// TODO: same as above.
#[test]
#[ignore = "needs DefineRecurrentTransferOperation builder"]
fn recurrent_transfer_without_extensions() {}

// TS line 537: "Should fail when invalid asset is provided".
// TODO: needs `UpdateProposalOperation` complex-op builder (the TS test
// constructs one with the wrong asset symbol to trigger the validation).
#[test]
#[ignore = "needs UpdateProposalOperation builder"]
fn invalid_asset_in_update_proposal_fails() {}

// TS line 548: "Should be able to create an update proposal with underlying
// extensions using transaction interface".
// TODO: needs `UpdateProposalOperation` complex-op builder.
#[test]
#[ignore = "needs UpdateProposalOperation builder"]
fn update_proposal_with_extensions() {}

// TS line 592: "Should be able to create encrypted operations using
// transaction interface".
// TODO: needs a Rust signer (encryption is driven through the signer) and
// the `startEncrypt`/`stopEncrypt` transaction-builder methods.
#[test]
#[ignore = "needs Rust signer + start_encrypt/stop_encrypt transaction API"]
fn create_encrypted_operations() {}

// TS line 636: "Should be able to decrypt operations using transaction
// interface".
// TODO: same as above plus `Transaction::decrypt`.
#[test]
#[ignore = "needs Rust signer + start_encrypt/stop_encrypt + Transaction::decrypt"]
fn decrypt_operations() {}

// TS line 672: "Should be able to calculate account HP".
// TODO: needs `WaxFoundation::calculate_account_hp`. (TS exposes it as a
// distinct API; in C++ it's a thin wrapper over the vests/HP ratio.)
#[test]
fn calculate_account_hp_basic() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .calculate_account_hp(
                NaiAssetConvertible::Asset(vests_sat(ctx, 10)),
                NaiAssetConvertible::Asset(hive_sat(ctx, 10)),
                NaiAssetConvertible::Asset(vests_sat(ctx, 10)),
            )
            .expect("calculate_account_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "10".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 684: "Should be able to calculate account HP with mixed params".
// In TS one param is raw and one is `hiveSatoshis(...)`; Rust has no raw-number
// overload so both forms collapse to NaiAssets. Kept for TS parity.
#[test]
fn calculate_account_hp_mixed_params() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .calculate_account_hp(
                NaiAssetConvertible::Asset(vests_sat(ctx, 10)),
                NaiAssetConvertible::Asset(hive_sat(ctx, 10)),
                NaiAssetConvertible::Asset(vests_sat(ctx, 10)),
            )
            .expect("calculate_account_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "10".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 696: "Should be able to calculate witness votes HP".
#[test]
fn calculate_witness_votes_hp_basic() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .calculate_witness_votes_hp(
                NaiAssetConvertible::Asset(vests_sat(ctx, 10)),
                NaiAssetConvertible::Asset(hive_sat(ctx, 10)),
                NaiAssetConvertible::Asset(vests_sat(ctx, 10)),
            )
            .expect("calculate_witness_votes_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "10".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 708: "Should be able to calculate witness votes HP with mixed
// params". TS difference (raw vs hiveSatoshis on one arg) doesn't translate
// in Rust; kept for TS parity.
#[test]
fn calculate_witness_votes_hp_mixed_params() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .calculate_witness_votes_hp(
                NaiAssetConvertible::Asset(vests_sat(ctx, 10)),
                NaiAssetConvertible::Asset(hive_sat(ctx, 10)),
                NaiAssetConvertible::Asset(vests_sat(ctx, 10)),
            )
            .expect("calculate_witness_votes_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "10".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 720: "Should be able to calculate witness votes HP with big values
// (mainnet 5M)".
#[test]
fn calculate_witness_votes_hp_big_values() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .calculate_witness_votes_hp(
                NaiAssetConvertible::Asset(vests_sat(ctx, 147_408_633_689_698_596)),
                NaiAssetConvertible::Asset(hive_sat(ctx, 180_520_335_089)),
                NaiAssetConvertible::Asset(vests_sat(ctx, 304_505_804_867_506_145)),
            )
            .expect("calculate_witness_votes_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "87388337178".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 732: "Should be able to calculate witness votes HP with big values
// (mainnet 5M) - typed asset version". Same call as above in Rust — kept for
// TS parity.
#[test]
fn calculate_witness_votes_hp_big_values_typed() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .calculate_witness_votes_hp(
                NaiAssetConvertible::Asset(vests_sat(ctx, 147_408_633_689_698_596)),
                NaiAssetConvertible::Asset(hive_sat(ctx, 180_520_335_089)),
                NaiAssetConvertible::Asset(vests_sat(ctx, 304_505_804_867_506_145)),
            )
            .expect("calculate_witness_votes_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "87388337178".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 744: "Should be able to calculate account hp 1".
#[test]
fn calculate_account_hp_fixture_1() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .calculate_account_hp(
                NaiAssetConvertible::Asset(vests_sat(ctx, 1_100_000_000)),
                NaiAssetConvertible::Asset(hive_sat(ctx, 100_000)),
                NaiAssetConvertible::Asset(vests_sat(ctx, 100_000_000_000)),
            )
            .expect("calculate_account_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "1100".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 759: "Should be able to calculate account hp 2".
#[test]
fn calculate_account_hp_fixture_2() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .calculate_account_hp(
                NaiAssetConvertible::Asset(vests_sat(ctx, 2_268_225_009_295_472)),
                NaiAssetConvertible::Asset(hive_sat(ctx, 173_009_633_181)),
                NaiAssetConvertible::Asset(vests_sat(ctx, 300_729_442_281_783_339)),
            )
            .expect("calculate_account_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "1304909734".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 774: "Should be able to calculate witness votes hp 1".
#[test]
fn calculate_witness_votes_hp_fixture_1() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .calculate_witness_votes_hp(
                NaiAssetConvertible::Asset(vests_sat(ctx, 1_100_000_000)),
                NaiAssetConvertible::Asset(hive_sat(ctx, 100_000)),
                NaiAssetConvertible::Asset(vests_sat(ctx, 100_000_000_000)),
            )
            .expect("calculate_witness_votes_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "1100".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 789: "Should be able to calculate witness votes hp 2".
#[test]
fn calculate_witness_votes_hp_fixture_2() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .calculate_witness_votes_hp(
                NaiAssetConvertible::Asset(vests_sat(ctx, 142_103_996_686_715_320)),
                NaiAssetConvertible::Asset(hive_sat(ctx, 173_009_633_181)),
                NaiAssetConvertible::Asset(vests_sat(ctx, 300_729_442_281_783_339)),
            )
            .expect("calculate_witness_votes_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "81752422223".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 805: "Should be able to calculate witness votes HP with big values
// (mainnet 5M)-mixed param types". Same call as `_big_values` in Rust — kept
// for TS parity.
#[test]
fn calculate_witness_votes_hp_big_values_mixed() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .calculate_witness_votes_hp(
                NaiAssetConvertible::Asset(vests_sat(ctx, 147_408_633_689_698_596)),
                NaiAssetConvertible::Asset(hive_sat(ctx, 180_520_335_089)),
                NaiAssetConvertible::Asset(vests_sat(ctx, 304_505_804_867_506_145)),
            )
            .expect("calculate_witness_votes_hp");
        assert_eq!(
            result,
            NaiAsset {
                amount: "87388337178".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 817: "Should be able to calculate HP APR".
#[test]
fn calculate_hp_apr_basic() {
    wax_test(None, |ctx| {
        let apr = ctx
            .base
            .calculate_hp_apr(1_000_000, 1_500, &hive_sat(ctx, 10), &hive_sat(ctx, 10))
            .expect("calculate_hp_apr");
        // TS asserts the numeric `1.46`; the Rust API returns a string.
        assert_eq!(apr, "1.46");
    });
}

// TS line 825: "Should be able to calculate HP APR with mixed params". Same
// collapse — Rust takes NaiAsset for both, so this matches the previous test.
#[test]
fn calculate_hp_apr_mixed_params() {
    wax_test(None, |ctx| {
        let apr = ctx
            .base
            .calculate_hp_apr(1_000_000, 1_500, &hive_sat(ctx, 10), &hive_sat(ctx, 10))
            .expect("calculate_hp_apr");
        assert_eq!(apr, "1.46");
    });
}

// TS line 833: "Should be able to generate random private key using
// password".
#[test]
fn get_private_key_from_password() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .get_private_key_from_password("gtg", "active", "verysecurepassword")
            .expect("get_private_key_from_password");
        assert_eq!(
            result.associated_public_key,
            "STM6JswFatSixhR9AMUP38rtpMVAagTvxGYu7d8i2JUK1QZDkPbH3"
        );
        assert_eq!(
            result.wif_private_key,
            "5J89tdX8b1wQJHcqDMDVn1UwvtiYFK53PQEgG5gL5oCEk83Us12"
        );
    });
}

// TS line 842: "Should be able to suggest brain key".
// Output is randomized; only structural assertions are possible — matching
// the TS test which checks lengths and non-emptiness.
#[test]
fn suggest_brain_key() {
    wax_test(None, |ctx| {
        let result = ctx.base.suggest_brain_key().expect("suggest_brain_key");
        assert_eq!(result.associated_public_key.len(), 53);
        assert!(!result.brain_key.is_empty());
        assert_eq!(result.wif_private_key.len(), 51);
    });
}

// TS line 852: "Should be able to convert between raw private key -> WIF
// formats".
#[test]
fn convert_raw_private_key_to_wif() {
    wax_test(None, |ctx| {
        let wif = ctx
            .base
            .convert_raw_private_key_to_wif(
                &"48a9c812cafcd35eb761501768ba7e2eb9a238853548556c2c38431f51d63030".into(),
            )
            .expect("convert_raw_private_key_to_wif");
        assert_eq!(wif, "5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n");
    });
}

// TS line 860: "Should be able to convert between raw compressed public key
// -> WIF formats".
#[test]
fn convert_raw_compressed_public_key_to_wif() {
    wax_test(None, |ctx| {
        let wif = ctx
            .base
            .convert_raw_public_key_to_wif(
                &"02be643d4c424ac7cf2f3cf51dd048773cbdcee30b111adb30d89c27668c501705".into(),
            )
            .expect("convert_raw_public_key_to_wif (compressed)");
        assert_eq!(wif, "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4");
    });
}

// TS line 868: "Should be able to convert between raw uncompressed public
// key -> WIF formats". The C++ side auto-detects compressed vs uncompressed
// by hex length, so both call into the same trait method.
#[test]
fn convert_raw_uncompressed_public_key_to_wif() {
    wax_test(None, |ctx| {
        let wif = ctx
            .base
            .convert_raw_public_key_to_wif(
                &"04be643d4c424ac7cf2f3cf51dd048773cbdcee30b111adb30d89c27668c5017051a9cc2866c479818522ffd2b4a3d7a5a64d1b98c968f8f6ea2ef6745a637eb92"
                    .into(),
            )
            .expect("convert_raw_public_key_to_wif (uncompressed)");
        assert_eq!(wif, "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4");
    });
}

// TS line 876: "Should be able to estimate hive collateral".
#[test]
fn estimate_hive_collateral() {
    wax_test(None, |ctx| {
        let median = JsonPrice {
            base: hbd_sat(ctx, 201),
            quote: hive_sat(ctx, 1_000),
        };
        let minimum = JsonPrice {
            base: hbd_sat(ctx, 197),
            quote: hive_sat(ctx, 1_000),
        };
        let result = ctx
            .base
            .estimate_hive_collateral(&median, &minimum, &hbd_sat(ctx, 100_000))
            .expect("estimate_hive_collateral");
        assert_eq!(
            result,
            NaiAsset {
                amount: "1065988".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 888: "Should be able to estimate hbd interests".
#[test]
fn estimate_hbd_interest() {
    wax_test(None, |ctx| {
        // TS passes ISO timestamps; Rust takes Unix-seconds u32. The fixture
        // values come from the corresponding python test
        // (matches `estimate_hbd_interest_matches_python_fixture` in
        // tests/economics.rs).
        let result = ctx
            .base
            .estimate_hbd_interest(
                2_860_100_980_056_u128,
                1_764_165_933, // 2025-11-26T16:05:33 UTC
                &hbd_sat(ctx, 46_107_782),
                1_763_231_274, // 2025-11-15T20:27:54 UTC
                1_500,
            )
            .expect("estimate_hbd_interest");
        assert_eq!(
            result,
            NaiAsset {
                amount: "218584".into(),
                precision: 3,
                nai: "@@000000013".into(),
            }
        );
    });
}

// TS line 900: "Should be able to create transaction from legacy JSON
// format".
#[test]
fn create_transaction_from_legacy_json_parses_correctly() {
    wax_test(None, |ctx| {
        let tx = create_transaction_from_legacy_json(ctx, LEGACY_TRANSACTION_JSON);
        let ops = &tx.transaction().operations;
        assert_eq!(ops.len(), 1);

        let transfer = match ops[0].value.as_ref().expect("op value present") {
            wax::proto::operation::Value::TransferOperation(t) => t,
            other => panic!("expected transfer, got {other:?}"),
        };
        assert_eq!(transfer.from_account, "oneplus7");
        assert_eq!(transfer.to_account, "kryptogames");
    });
}

// TS line 921: "Should be able to convert legacy transaction to API JSON".
#[test]
fn legacy_transaction_to_api_json() {
    wax_test(None, |ctx| {
        let tx = create_transaction_from_legacy_json(ctx, LEGACY_TRANSACTION_JSON);
        let api_json = tx.to_api().expect("to_api");
        assert!(api_json.contains("\"type\":\"transfer_operation\""));
        assert!(api_json.contains("\"nai\":\"@@000000021\""));
    });
}

// TS line 943: "Should be able to validate legacy transaction".
#[test]
fn validate_legacy_transaction() {
    wax_test(None, |ctx| {
        let tx = create_transaction_from_legacy_json(ctx, LEGACY_TRANSACTION_JSON);
        tx.validate().expect("legacy transaction should validate");
    });
}

// TS line 952: "Should be able to get impacted accounts from legacy
// transaction".
#[test]
fn legacy_transaction_impacted_accounts() {
    wax_test(None, |ctx| {
        let tx = create_transaction_from_legacy_json(ctx, LEGACY_TRANSACTION_JSON);
        let accounts = tx.impacted_accounts().expect("impacted_accounts");
        assert!(accounts.iter().any(|a| a == "oneplus7"));
        assert!(accounts.iter().any(|a| a == "kryptogames"));
    });
}

// TS line 963: "Should be able to calculate transaction ID from legacy
// transaction". `tx.id` in TS is the HF26/modern transaction id, which is
// what's asserted here — the legacy source format only affects parsing,
// not which id flavour is computed.
#[test]
fn legacy_transaction_id() {
    wax_test(None, |ctx| {
        let tx = create_transaction_from_legacy_json(ctx, LEGACY_TRANSACTION_JSON);
        let id = tx.id().expect("id");
        assert_eq!(id, "3725c81634f152011e2043eb7119911b953d4267");
    });
}

// TS line 973: "Should be able to push operations to legacy transaction".
#[test]
fn push_operation_onto_legacy_transaction() {
    wax_test(None, |ctx| {
        let tx = create_transaction_from_legacy_json(ctx, LEGACY_TRANSACTION_JSON);
        let protocol = wax_core::ffi::new_rust_protocol();
        let extra = RustOperation::from_json(
            protocol.as_ref().unwrap(),
            r#"{
                "vote_operation": {
                    "voter": "alice",
                    "author": "bob",
                    "permlink": "test-post",
                    "weight": 10000
                }
            }"#,
        )
        .expect("operation json");
        let tx = tx.push_operation(extra);
        assert_eq!(tx.transaction().operations.len(), 2);
    });
}

// TS line 993: "Should handle legacy asset format conversion".
#[test]
fn legacy_asset_format_hive() {
    wax_test(None, |ctx| {
        let legacy = r#"{
            "ref_block_num": 1,
            "ref_block_prefix": 1,
            "expiration": "2023-11-09T22:01:24",
            "operations": [
                ["transfer", {
                    "from": "alice",
                    "to": "bob",
                    "amount": "100.500 HIVE",
                    "memo": "test"
                }]
            ],
            "extensions": [],
            "signatures": []
        }"#;
        let tx = create_transaction_from_legacy_json(ctx, legacy);
        let transfer = match tx.transaction().operations[0]
            .value
            .as_ref()
            .expect("op value")
        {
            wax::proto::operation::Value::TransferOperation(t) => t,
            other => panic!("expected transfer, got {other:?}"),
        };
        let asset = &transfer.amount;
        assert_eq!(asset.amount, "100500");
        assert_eq!(asset.nai, "@@000000021");
        assert_eq!(asset.precision, 3);
    });
}

// TS line 1028: "Should handle legacy HBD asset format".
#[test]
fn legacy_asset_format_hbd() {
    wax_test(None, |ctx| {
        let legacy = r#"{
            "ref_block_num": 1,
            "ref_block_prefix": 1,
            "expiration": "2023-11-09T22:01:24",
            "operations": [
                ["transfer", {
                    "from": "alice",
                    "to": "bob",
                    "amount": "50.000 HBD",
                    "memo": ""
                }]
            ],
            "extensions": [],
            "signatures": []
        }"#;
        let tx = create_transaction_from_legacy_json(ctx, legacy);
        let transfer = match tx.transaction().operations[0]
            .value
            .as_ref()
            .expect("op value")
        {
            wax::proto::operation::Value::TransferOperation(t) => t,
            other => panic!("expected transfer, got {other:?}"),
        };
        let asset = &transfer.amount;
        assert_eq!(asset.amount, "50000");
        assert_eq!(asset.nai, "@@000000013");
        assert_eq!(asset.precision, 3);
    });
}

// TS line 1063: "Should handle legacy operation with numeric type ID".
#[test]
fn legacy_operation_with_numeric_type_id() {
    wax_test(None, |ctx| {
        let legacy = r#"{
            "ref_block_num": 1,
            "ref_block_prefix": 1,
            "expiration": "2023-11-09T22:01:24",
            "operations": [
                [2, {
                    "from": "alice",
                    "to": "bob",
                    "amount": "1.000 HIVE",
                    "memo": ""
                }]
            ],
            "extensions": [],
            "signatures": []
        }"#;
        let tx = create_transaction_from_legacy_json(ctx, legacy);
        match tx.transaction().operations[0]
            .value
            .as_ref()
            .expect("op value")
        {
            wax::proto::operation::Value::TransferOperation(_) => {}
            other => panic!("expected transfer (op id 2), got {other:?}"),
        };
    });
}

// TS line 1089: "Should calculate public key from private key using wax API".
#[test]
fn calculate_public_key_from_private_key() {
    wax_test(None, |ctx| {
        let public_key = ctx
            .base
            .calculate_public_key("5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT")
            .expect("calculate_public_key");
        assert_eq!(
            public_key,
            "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh"
        );
    });
}

// TS line 1100: "Should throw error for invalid private key format using
// wax API".
#[test]
fn calculate_public_key_rejects_invalid_input() {
    wax_test(None, |ctx| {
        let err = ctx
            .base
            .calculate_public_key("invalid_key")
            .expect_err("calculate_public_key should reject malformed WIF");
        let _ = err.to_string();
    });
}
