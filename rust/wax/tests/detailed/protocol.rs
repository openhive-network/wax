// Rust port of `ts/wasm/__tests__/detailed/protocol.ts`.
//
// Tests appear in TS source order. Each Rust test has a `// TS line N` comment
// pointing back to the TS original. The empty-variant validation test adapts
// to Rust's eager C++ op-handle construction (TS defers the failure to
// validate time); see its own note.
//
// TS NOTE: TS line 30 ("Should be able to print author in C++ JS val handle")
// exercises the embind JS-value bridge and has no Rust counterpart — the
// cxx bridge passes typed structs, not JS handles.

use std::collections::HashMap;

use chrono::{DateTime, Utc};
use rust_decimal::Decimal;

use wax::models::HiveDateTime;
use wax::models::NaiAsset;
use wax::proto::{
    AccountCreate, Asset, Authority, Operation as ProtoOperation,
    Transaction as ProtoTransaction, Transfer, Vote, operation::Value,
};
use wax::result::{BinaryViewNode, JsonPrice, WitnessSetPropertiesProps};
use wax::{Manabar, WaxOptions};

use crate::common::wax_test;

// ---------------------------------------------------------------------------
// Fixtures mirroring ts/wasm/__tests__/assets/data.protocol.ts
// and data.proto-protocol.ts
// ---------------------------------------------------------------------------

// data.protocol.ts: `transaction` (API-shape, vote on c0ff33a/ewxhnjbj).
const TRANSACTION_API_JSON: &str = r#"{
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

// data.proto-protocol.ts: `protoTx` — same transaction in proto-shape JSON.
const TRANSACTION_PROTO_JSON: &str = r#"{
    "ref_block_num": 34559,
    "ref_block_prefix": 1271006404,
    "expiration": "2021-12-13T11:31:33",
    "operations": [
        {
            "vote_operation": {
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

// data.protocol.ts: `serialization_sensitive_transaction` — block 80021416,
// trx_id 7f34699e9eea49d1bcc10c88f96e38897839ece3. Single transfer op.
const SERIALIZATION_SENSITIVE_TRANSACTION_API_JSON: &str = r#"{
    "ref_block_num": 1959,
    "ref_block_prefix": 3625727107,
    "expiration": "2023-11-09T22:01:24",
    "operations": [
        {
            "type": "transfer_operation",
            "value": {
                "from": "oneplus7",
                "to": "kryptogames",
                "amount": { "amount": "300000", "precision": 3, "nai": "@@000000021" },
                "memo": "Roll under 50 4d434bd943616"
            }
        }
    ],
    "extensions": [],
    "signatures": []
}"#;

// data.protocol.ts: `required_authorities_transaction` — vote with `void_t`
// extension. Used by the binary-view + required-authorities tests.
const REQUIRED_AUTHORITIES_TRANSACTION_API_JSON: &str = r#"{
    "ref_block_num": 19260,
    "ref_block_prefix": 2140466769,
    "expiration": "2016-09-15T19:47:33",
    "operations": [
        {
            "type": "vote_operation",
            "value": {
                "voter": "taoteh1221",
                "author": "ozchartart",
                "permlink": "usdsteem-btc-daily-poloniex-bittrex-technical-analysis-market-report-update-46-glass-half-full-but-the-bottle-s-left-empty-sept",
                "weight": 10000
            }
        }
    ],
    "extensions": [ {"type": "void_t", "value": {}} ],
    "signatures": [
        "202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8b37d3fb3"
    ]
}"#;

// Mainnet block 85'418'673. Vote on macchiata/revitalizing-... by esecholo.
const MAINNET_VOTE_TRANSACTION_API_JSON: &str = r#"{
    "expiration": "2024-05-15T13:04:16",
    "extensions": [],
    "operations": [
        {
            "type": "vote_operation",
            "value": {
                "author": "macchiata",
                "permlink": "revitalizing-tropical-living-spaces-where-pets-and-human-coexist",
                "voter": "esecholo",
                "weight": 10000
            }
        }
    ],
    "ref_block_num": 25263,
    "ref_block_prefix": 1797793300,
    "signatures": [
        "1f31829d3166d9da185f3f33d804596944515c21f21c0c12618bbd442357ae94873ec4770763453ddd14ebc09eabfe4163b68e85d43b2a4057f1da767bc1ea91bf"
    ]
}"#;

// Same transaction in proto shape for to_api round-trip tests.
const MAINNET_VOTE_TRANSACTION_PROTO_JSON: &str = r#"{
    "expiration": "2024-05-15T13:04:16",
    "extensions": [],
    "operations": [
        {
            "vote_operation": {
                "author": "macchiata",
                "permlink": "revitalizing-tropical-living-spaces-where-pets-and-human-coexist",
                "voter": "esecholo",
                "weight": 10000
            }
        }
    ],
    "ref_block_num": 25263,
    "ref_block_prefix": 1797793300,
    "signatures": [
        "1f31829d3166d9da185f3f33d804596944515c21f21c0c12618bbd442357ae94873ec4770763453ddd14ebc09eabfe4163b68e85d43b2a4057f1da767bc1ea91bf"
    ]
}"#;

// Mainnet block 95'448'326. account_create_operation creating uid39111864.
// API shape: key_auths are arrays-of-pairs.
const MAINNET_ACCOUNT_CREATE_TRANSACTION_API_JSON: &str = r#"{
    "ref_block_num": 27909,
    "ref_block_prefix": 3930921467,
    "extensions": [],
    "expiration": "2025-04-29T10:17:31",
    "operations": [
        {
            "type": "account_create_operation",
            "value": {
                "fee": { "nai": "@@000000021", "amount": "3000", "precision": 3 },
                "owner": {
                    "key_auths": [ ["STM6DPSYYtmKJ1uq5KVdobMSbqSLAN3x8AWKACjoJ18kt1Zm1mxnp", 1] ],
                    "account_auths": [],
                    "weight_threshold": 1
                },
                "active": {
                    "key_auths": [ ["STM6m6dt3qPDf4H3jQc3BLy91msyV4udzb5Qxjd48jUSDDAWAo682", 1] ],
                    "account_auths": [],
                    "weight_threshold": 1
                },
                "creator": "creatorofhivewal",
                "posting": {
                    "key_auths": [ ["STM5JicVMtvU8aYHDTU986DBNqvFL2Cy1TPFUHgrV8iHyZaoub7Qh", 1] ],
                    "account_auths": [],
                    "weight_threshold": 1
                },
                "memo_key": "STM849LXW2sJxVPvuNdLvDkKXLBY1gnCxz7hGj2bix358MdPNQkbF",
                "json_metadata": "{}",
                "new_account_name": "uid39111864"
            }
        }
    ],
    "signatures": [
        "2009d17b3abb7197652a43e70e767f10032721fc250671eec02b14873be74c9b812b9b246f24ee6623ecbf9ba115b2cc8c8c45a4ea3574de94c5006870d6d550bf"
    ]
}"#;

// Helpers ------------------------------------------------------------------

/// `at(seconds)` — Unix-timestamp → `HiveDateTime` (UTC). Mirrors the
/// manabar tests' helper; needed because the TS manabar APIs accept `0`
/// directly as `head_block_time`.
fn at(seconds: i64) -> HiveDateTime {
    HiveDateTime::from(
        DateTime::<Utc>::from_timestamp(seconds, 0).expect("valid timestamp"),
    )
}

// Build a witness_set_properties payload matching `witness_properties` in
// `data.protocol.ts`. Used by the witness-props serialization tests.
fn witness_properties() -> WitnessSetPropertiesProps {
    WitnessSetPropertiesProps {
        key: "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh".into(),
        new_signing_key: Some(
            "STM6TqSJaS1aRj6p6yZEo5xicX7bvLhrfdVqi5ToNrKxHU3FRBEdW".into(),
        ),
        account_creation_fee: Some(NaiAsset {
            amount: "5000".into(),
            precision: 3,
            nai: "@@000000021".into(),
        }),
        url: Some("https://hive.io".into()),
        hbd_exchange_rate: Some(JsonPrice {
            base: NaiAsset {
                amount: "100".into(),
                precision: 3,
                nai: "@@000000013".into(),
            },
            quote: NaiAsset {
                amount: "100".into(),
                precision: 3,
                nai: "@@000000021".into(),
            },
        }),
        maximum_block_size: Some(131072),
        hbd_interest_rate: Some(1000),
        account_subsidy_budget: Some(797),
        account_subsidy_decay: Some(347321),
    }
}

// ---------------------------------------------------------------------------
// Tests (TS source order)
// ---------------------------------------------------------------------------

// TS line 40: "Should be able to convert to protobuf" (vote operation).
// The TS test mutates the input object via `cpp_tx_api_to_proto`. Rust's
// equivalent is `create_transaction_from_json` (which calls the same C++
// converter under the hood) — compare the produced proto whole-object
// against the TS-expected shape.
#[test]
fn convert_api_to_protobuf_vote_operation() {
    wax_test(None, |ctx| {
        let tx = ctx
            .base
            .create_transaction_from_json(MAINNET_VOTE_TRANSACTION_API_JSON)
            .expect("create_transaction_from_json");

        assert_eq!(
            tx.transaction(),
            &ProtoTransaction {
                ref_block_num: 25263,
                ref_block_prefix: 1797793300,
                expiration: "2024-05-15T13:04:16".into(),
                extensions: vec![],
                operations: vec![ProtoOperation {
                    value: Some(Value::VoteOperation(Vote {
                        author: "macchiata".into(),
                        permlink: "revitalizing-tropical-living-spaces-where-pets-and-human-coexist".into(),
                        voter: "esecholo".into(),
                        weight: 10000,
                    })),
                }],
                signatures: vec![
                    "1f31829d3166d9da185f3f33d804596944515c21f21c0c12618bbd442357ae94873ec4770763453ddd14ebc09eabfe4163b68e85d43b2a4057f1da767bc1ea91bf".into(),
                ],
            }
        );
    });
}

// TS line 95: "Should be able to convert to protobuf - proper authority object
// serialization". Verifies that an `account_create_operation` with
// array-of-pair `key_auths` (API shape) parses into proto with map-shape
// key_auths.
fn authority_with_single_key(key: &str) -> Authority {
    Authority {
        weight_threshold: 1,
        account_auths: HashMap::new(),
        key_auths: HashMap::from([(key.into(), 1)]),
    }
}

#[test]
fn convert_api_to_protobuf_account_create_authority_serialization() {
    wax_test(None, |ctx| {
        let tx = ctx
            .base
            .create_transaction_from_json(
                MAINNET_ACCOUNT_CREATE_TRANSACTION_API_JSON,
            )
            .expect("create_transaction_from_json");

        assert_eq!(
            tx.transaction(),
            &ProtoTransaction {
                ref_block_num: 27909,
                ref_block_prefix: 3930921467,
                extensions: vec![],
                expiration: "2025-04-29T10:17:31".into(),
                operations: vec![ProtoOperation {
                    value: Some(Value::AccountCreateOperation(AccountCreate {
                        fee: Asset {
                            nai: "@@000000021".into(),
                            amount: "3000".into(),
                            precision: 3,
                        },
                        owner: authority_with_single_key(
                            "STM6DPSYYtmKJ1uq5KVdobMSbqSLAN3x8AWKACjoJ18kt1Zm1mxnp",
                        ),
                        active: authority_with_single_key(
                            "STM6m6dt3qPDf4H3jQc3BLy91msyV4udzb5Qxjd48jUSDDAWAo682",
                        ),
                        posting: authority_with_single_key(
                            "STM5JicVMtvU8aYHDTU986DBNqvFL2Cy1TPFUHgrV8iHyZaoub7Qh",
                        ),
                        creator: "creatorofhivewal".into(),
                        memo_key: "STM849LXW2sJxVPvuNdLvDkKXLBY1gnCxz7hGj2bix358MdPNQkbF".into(),
                        json_metadata: "{}".into(),
                        new_account_name: "uid39111864".into(),
                    })),
                }],
                signatures: vec![
                    "2009d17b3abb7197652a43e70e767f10032721fc250671eec02b14873be74c9b812b9b246f24ee6623ecbf9ba115b2cc8c8c45a4ea3574de94c5006870d6d550bf".into(),
                ],
            }
        );
    });
}

// TS line 211: "Should be able to convert to api" (vote operation).
// Rust equivalent: parse proto-shape JSON via `create_transaction_from_proto_json`,
// then call `to_api()` and compare the parsed JSON whole-object against the
// TS-expected shape.
#[test]
fn convert_protobuf_to_api_vote_operation() {
    wax_test(None, |ctx| {
        let tx = ctx
            .base
            .create_transaction_from_proto_json(
                MAINNET_VOTE_TRANSACTION_PROTO_JSON,
            )
            .expect("create_transaction_from_proto_json");

        let api_json = tx.to_api().expect("to_api");
        let parsed: serde_json::Value =
            serde_json::from_str(&api_json).expect("valid JSON");

        assert_eq!(
            parsed,
            serde_json::json!({
                "expiration": "2024-05-15T13:04:16",
                "extensions": [],
                "operations": [{
                    "type": "vote_operation",
                    "value": {
                        "author": "macchiata",
                        "permlink": "revitalizing-tropical-living-spaces-where-pets-and-human-coexist",
                        "voter": "esecholo",
                        "weight": 10000,
                    }
                }],
                "ref_block_num": 25263,
                "ref_block_prefix": 1797793300,
                "signatures": [
                    "1f31829d3166d9da185f3f33d804596944515c21f21c0c12618bbd442357ae94873ec4770763453ddd14ebc09eabfe4163b68e85d43b2a4057f1da767bc1ea91bf"
                ],
            })
        );
    });
}

// TS line 266: "Should be able to convert to api - proper authority object
// serialization". account_create round-tripped from proto-shape JSON. The
// resulting API JSON has key_auths back in array-of-pair form.
#[test]
fn convert_protobuf_to_api_account_create_authority_serialization() {
    wax_test(None, |ctx| {
        // Proto-shape: key_auths is a map of string → uint32.
        let proto_json = r#"{
            "ref_block_num": 27909,
            "ref_block_prefix": 3930921467,
            "extensions": [],
            "expiration": "2025-04-29T10:17:31",
            "operations": [
                {
                    "account_create_operation": {
                        "fee": { "nai": "@@000000021", "amount": "3000", "precision": 3 },
                        "owner": {
                            "key_auths": { "STM6DPSYYtmKJ1uq5KVdobMSbqSLAN3x8AWKACjoJ18kt1Zm1mxnp": 1 },
                            "account_auths": {},
                            "weight_threshold": 1
                        },
                        "active": {
                            "key_auths": { "STM6m6dt3qPDf4H3jQc3BLy91msyV4udzb5Qxjd48jUSDDAWAo682": 1 },
                            "account_auths": {},
                            "weight_threshold": 1
                        },
                        "creator": "creatorofhivewal",
                        "posting": {
                            "key_auths": { "STM5JicVMtvU8aYHDTU986DBNqvFL2Cy1TPFUHgrV8iHyZaoub7Qh": 1 },
                            "account_auths": {},
                            "weight_threshold": 1
                        },
                        "memo_key": "STM849LXW2sJxVPvuNdLvDkKXLBY1gnCxz7hGj2bix358MdPNQkbF",
                        "json_metadata": "{}",
                        "new_account_name": "uid39111864"
                    }
                }
            ],
            "signatures": [
                "2009d17b3abb7197652a43e70e767f10032721fc250671eec02b14873be74c9b812b9b246f24ee6623ecbf9ba115b2cc8c8c45a4ea3574de94c5006870d6d550bf"
            ]
        }"#;

        let tx = ctx
            .base
            .create_transaction_from_proto_json(proto_json)
            .expect("create_transaction_from_proto_json");

        let api_json = tx.to_api().expect("to_api");
        let parsed: serde_json::Value =
            serde_json::from_str(&api_json).expect("valid JSON");

        assert_eq!(
            parsed,
            serde_json::json!({
                "ref_block_num": 27909,
                "ref_block_prefix": 3930921467_u32,
                "extensions": [],
                "expiration": "2025-04-29T10:17:31",
                "operations": [{
                    "type": "account_create_operation",
                    "value": {
                        "fee": { "nai": "@@000000021", "amount": "3000", "precision": 3 },
                        "owner": {
                            "key_auths": [
                                ["STM6DPSYYtmKJ1uq5KVdobMSbqSLAN3x8AWKACjoJ18kt1Zm1mxnp", 1]
                            ],
                            "account_auths": [],
                            "weight_threshold": 1
                        },
                        "active": {
                            "key_auths": [
                                ["STM6m6dt3qPDf4H3jQc3BLy91msyV4udzb5Qxjd48jUSDDAWAo682", 1]
                            ],
                            "account_auths": [],
                            "weight_threshold": 1
                        },
                        "creator": "creatorofhivewal",
                        "posting": {
                            "key_auths": [
                                ["STM5JicVMtvU8aYHDTU986DBNqvFL2Cy1TPFUHgrV8iHyZaoub7Qh", 1]
                            ],
                            "account_auths": [],
                            "weight_threshold": 1
                        },
                        "memo_key": "STM849LXW2sJxVPvuNdLvDkKXLBY1gnCxz7hGj2bix358MdPNQkbF",
                        "json_metadata": "{}",
                        "new_account_name": "uid39111864"
                    }
                }],
                "signatures": [
                    "2009d17b3abb7197652a43e70e767f10032721fc250671eec02b14873be74c9b812b9b246f24ee6623ecbf9ba115b2cc8c8c45a4ea3574de94c5006870d6d550bf"
                ],
            })
        );
    });
}

// TS line 382: "Should be able to create WASM handle for transaction".
// Build the mainnet vote transaction; assert tx.id() matches the on-chain id.
#[test]
fn create_transaction_handle_mainnet_vote() {
    wax_test(None, |ctx| {
        let tx = ctx
            .base
            .create_transaction_from_json(MAINNET_VOTE_TRANSACTION_API_JSON)
            .expect("create_transaction_from_json");
        let id = tx.id().expect("tx.id()");
        assert_eq!(id, "430e93622775d13cf39877239e4675123ff9fbd5");
    });
}

// TS line 423: "Should be able to create WasmTransaction - proper authority
// object serialization". account_create transaction; assert legacy id.
#[test]
fn create_transaction_handle_mainnet_account_create() {
    wax_test(None, |ctx| {
        let tx = ctx
            .base
            .create_transaction_from_json(
                MAINNET_ACCOUNT_CREATE_TRANSACTION_API_JSON,
            )
            .expect("create_transaction_from_json");
        let id = tx.legacy_id().expect("tx.legacy_id()");
        assert_eq!(id, "a27dc780a12d9a3e3a0e290208f04bc2c618f11e");
    });
}

// TS line 499: "Should be able to create WasmTransaction from scratch".
// Build via create_transaction_from_proto, push_operation, set_expiration, add_signature;
// assert id matches the mainnet block.
#[test]
fn create_transaction_from_scratch_matches_mainnet_vote() {
    wax_test(None, |ctx| {
        let mut tx = ctx
            .base
            .create_transaction_from_proto(ProtoTransaction {
                ref_block_num: 25263,
                ref_block_prefix: 1797793300,
                expiration: String::new(),
                operations: Vec::new(),
                extensions: Vec::new(),
                signatures: Vec::new(),
            })
            .expect("create_transaction_from_proto");

        let op = ctx.base.create_operation(Value::VoteOperation(Vote {
            author: "macchiata".into(),
            permlink: "revitalizing-tropical-living-spaces-where-pets-and-human-coexist".into(),
            voter: "esecholo".into(),
            weight: 10000,
        }));
        tx.push_operation(op);
        tx.set_expiration("2024-05-15T13:04:16")
            .expect("set_expiration");
        tx.add_signature("1f31829d3166d9da185f3f33d804596944515c21f21c0c12618bbd442357ae94873ec4770763453ddd14ebc09eabfe4163b68e85d43b2a4057f1da767bc1ea91bf")
            .expect("add_signature");

        let id = tx.id().expect("tx.id()");
        assert_eq!(id, "430e93622775d13cf39877239e4675123ff9fbd5");
    });
}

// TS line 545: "Should be able to generate random private key".
// The key is random, so (matching TS `toHaveLength(51)`) we only assert the
// WIF length rather than an exact value.
#[test]
fn generate_random_private_key() {
    wax_test(None, |ctx| {
        let wif = ctx
            .base
            .generate_private_key()
            .expect("generate_private_key");
        assert_eq!(wif.len(), 51);
    });
}

// TS line 553: "Should be able to convert between raw private key -> WIF
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

// TS line 561: "Should be able to convert between raw compressed public key
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
        assert_eq!(
            wif,
            "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4"
        );
    });
}

// TS line 569: "Should be able to convert between raw uncompressed public key
// -> WIF formats".
#[test]
fn convert_raw_uncompressed_public_key_to_wif() {
    wax_test(None, |ctx| {
        let wif = ctx
            .base
            .convert_raw_public_key_to_wif(
                &"04be643d4c424ac7cf2f3cf51dd048773cbdcee30b111adb30d89c27668c5017051a9cc2866c479818522ffd2b4a3d7a5a64d1b98c968f8f6ea2ef6745a637eb92".into(),
            )
            .expect("convert_raw_public_key_to_wif (uncompressed)");
        assert_eq!(
            wif,
            "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4"
        );
    });
}

// TS line 577: "Should be able to convert between WIF public key -> raw
// compressed formats".
#[test]
fn convert_wif_public_key_to_raw() {
    wax_test(None, |ctx| {
        let raw = ctx
            .base
            .convert_wif_public_key_to_raw(
                &"STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4".into(),
            )
            .expect("convert_wif_public_key_to_raw");
        assert_eq!(
            raw,
            "02be643d4c424ac7cf2f3cf51dd048773cbdcee30b111adb30d89c27668c501705"
        );
    });
}

// ---------------------------------------------------------------------------
// BinaryViewNode fixtures mirroring ts/wasm/__tests__/assets/data.binary.ts.
// The C++ producer is shared with the WASM build, so these expected offset
// trees match byte-for-byte. Object nodes always carry an empty `value`;
// arrays carry a `"Length: N"` summary string.
// ---------------------------------------------------------------------------

fn scalar(key: &str, offset: u32, size: u32, value: &str) -> BinaryViewNode {
    BinaryViewNode::Scalar {
        key: key.into(),
        offset,
        size,
        value: value.into(),
    }
}

fn array(
    key: &str,
    offset: u32,
    size: u32,
    length: u32,
    children: Vec<BinaryViewNode>,
) -> BinaryViewNode {
    BinaryViewNode::Array {
        key: key.into(),
        offset,
        size,
        length,
        value: format!("Length: {length}"),
        children,
    }
}

fn object(
    key: &str,
    offset: u32,
    size: u32,
    children: Vec<BinaryViewNode>,
) -> BinaryViewNode {
    BinaryViewNode::Object {
        key: key.into(),
        offset,
        size,
        value: String::new(),
        children,
    }
}

// data.binary.ts: `binaryDataHf26Vote`.
fn binary_data_hf26_vote() -> Vec<BinaryViewNode> {
    vec![
        scalar("ref_block_num", 0, 2, "19260"),
        scalar("ref_block_prefix", 2, 4, "2140466769"),
        scalar("expiration", 6, 4, "2016-09-15T19:47:33"),
        array(
            "operations",
            10,
            154,
            1,
            vec![object(
                "0",
                11,
                153,
                vec![
                    scalar("type", 11, 1, "vote_operation"),
                    object(
                        "value",
                        12,
                        152,
                        vec![
                            scalar("voter", 12, 11, "taoteh1221"),
                            scalar("author", 23, 11, "ozchartart"),
                            scalar(
                                "permlink",
                                34,
                                128,
                                "usdsteem-btc-daily-poloniex-bittrex-technical-analysis-market-report-update-46-glass-half-full-but-the-bottle-s-left-empty-sept",
                            ),
                            scalar("weight", 162, 2, "10000"),
                        ],
                    ),
                ],
            )],
        ),
        array(
            "extensions",
            164,
            2,
            1,
            vec![object(
                "0",
                165,
                1,
                vec![
                    scalar("type", 165, 1, "void_t"),
                    object("value", 166, 0, vec![]),
                ],
            )],
        ),
        array(
            "signatures",
            166,
            66,
            1,
            vec![scalar(
                "0",
                167,
                65,
                "202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8b37d3fb3",
            )],
        ),
    ]
}

// data.binary.ts: `binaryDataHf26TransferOperationBase(offset)` — the transfer
// op subtree, reused both standalone and nested inside the transaction tree.
fn binary_data_hf26_transfer_operation(offset: u32) -> Vec<BinaryViewNode> {
    vec![
        scalar("type", offset, 1, "transfer_operation"),
        object(
            "value",
            1 + offset,
            61,
            vec![
                scalar("from", 1 + offset, 9, "oneplus7"),
                scalar("to", 10 + offset, 12, "kryptogames"),
                object(
                    "amount",
                    22 + offset,
                    12,
                    vec![
                        object(
                            "amount",
                            22 + offset,
                            8,
                            vec![scalar("value", 22 + offset, 8, "300000")],
                        ),
                        scalar("symbol", 30 + offset, 4, "@@000000021"),
                    ],
                ),
                scalar("memo", 34 + offset, 28, "Roll under 50 4d434bd943616"),
            ],
        ),
    ]
}

// data.binary.ts: `binaryDataHf26Transfer`.
fn binary_data_hf26_transfer() -> Vec<BinaryViewNode> {
    vec![
        scalar("ref_block_num", 0, 2, "1959"),
        scalar("ref_block_prefix", 2, 4, "3625727107"),
        scalar("expiration", 6, 4, "2023-11-09T22:01:24"),
        array(
            "operations",
            10,
            63,
            1,
            vec![object("0", 11, 62, binary_data_hf26_transfer_operation(11))],
        ),
        array("extensions", 73, 1, 0, vec![]),
        array("signatures", 74, 1, 0, vec![]),
    ]
}

// data.binary.ts: `binaryDataLegacyTransferOperationBase(offset)`.
fn binary_data_legacy_transfer_operation(offset: u32) -> Vec<BinaryViewNode> {
    vec![
        scalar("type", offset, 1, "transfer_operation"),
        object(
            "value",
            1 + offset,
            65,
            vec![
                scalar("from", 1 + offset, 9, "oneplus7"),
                scalar("to", 10 + offset, 12, "kryptogames"),
                object(
                    "amount",
                    22 + offset,
                    16,
                    vec![
                        object(
                            "amount",
                            22 + offset,
                            8,
                            vec![scalar("value", 22 + offset, 8, "300000")],
                        ),
                        scalar("symbol", 30 + offset, 8, "STEEM"),
                    ],
                ),
                scalar("memo", 38 + offset, 28, "Roll under 50 4d434bd943616"),
            ],
        ),
    ]
}

// data.binary.ts: `binaryDataLegacyTransfer`.
fn binary_data_legacy_transfer() -> Vec<BinaryViewNode> {
    vec![
        scalar("ref_block_num", 0, 2, "1959"),
        scalar("ref_block_prefix", 2, 4, "3625727107"),
        scalar("expiration", 6, 4, "2023-11-09T22:01:24"),
        array(
            "operations",
            10,
            67,
            1,
            vec![object(
                "0",
                11,
                66,
                binary_data_legacy_transfer_operation(11),
            )],
        ),
        array("extensions", 77, 1, 0, vec![]),
        array("signatures", 78, 1, 0, vec![]),
    ]
}

// data.protocol.ts: `transfer_operation` — proto-shape transfer op the
// operation-level binary tests serialize on its own.
fn transfer_operation() -> ProtoOperation {
    ProtoOperation {
        value: Some(Value::TransferOperation(Transfer {
            from_account: "oneplus7".into(),
            to_account: "kryptogames".into(),
            amount: Asset {
                amount: "300000".into(),
                precision: 3,
                nai: "@@000000021".into(),
            },
            memo: "Roll under 50 4d434bd943616".into(),
        })),
    }
}

// TS line 585: "Should be able to generate binary metadata information - tx
// with vote operation".
#[test]
fn binary_metadata_vote_transaction_hf26() {
    wax_test(None, |ctx| {
        let view = ctx
            .base
            .create_transaction_from_json(
                REQUIRED_AUTHORITIES_TRANSACTION_API_JSON,
            )
            .expect("create_transaction_from_json")
            .binary_view_metadata()
            .expect("binary_view_metadata");

        assert_eq!(
            view.binary,
            "3c4b51ee947fd5fada5701000a74616f746568313232310a6f7a63686172746172747f757364737465656d2d6274632d6461696c792d706f6c6f6e6965782d626974747265782d746563686e6963616c2d616e616c797369732d6d61726b65742d7265706f72742d7570646174652d34362d676c6173732d68616c662d66756c6c2d6275742d7468652d626f74746c652d732d6c6566742d656d7074792d736570741027010001202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8b37d3fb3"
        );
        assert_eq!(view.offsets, binary_data_hf26_vote());
    });
}

// TS line 601: "Should be able to generate binary metadata information using
// hf26 pack type - tx with transfer".
#[test]
fn binary_metadata_transfer_transaction_hf26() {
    wax_test(None, |ctx| {
        let view = ctx
            .base
            .create_transaction_from_json(
                SERIALIZATION_SENSITIVE_TRANSACTION_API_JSON,
            )
            .expect("create_transaction_from_json")
            .binary_view_metadata()
            .expect("binary_view_metadata");

        assert_eq!(
            view.binary,
            "a70783341cd8b4564d650102086f6e65706c7573370b6b727970746f67616d6573e0930400000000002320bcbe1b526f6c6c20756e64657220353020346434333462643934333631360000"
        );
        assert_eq!(view.offsets, binary_data_hf26_transfer());
    });
}

// TS line 618: "Should be able to generate binary metadata information using
// legacy pack type - tx with transfer".
#[test]
fn binary_metadata_transfer_transaction_legacy() {
    wax_test(None, |ctx| {
        let view = ctx
            .base
            .create_transaction_from_json(
                SERIALIZATION_SENSITIVE_TRANSACTION_API_JSON,
            )
            .expect("create_transaction_from_json")
            .legacy_binary_view_metadata()
            .expect("legacy_binary_view_metadata");

        assert_eq!(
            view.binary,
            "a70783341cd8b4564d650102086f6e65706c7573370b6b727970746f67616d6573e09304000000000003535445454d00001b526f6c6c20756e64657220353020346434333462643934333631360000"
        );
        assert_eq!(view.offsets, binary_data_legacy_transfer());
    });
}

// TS line 634: "Should be able to generate binary metadata information using
// hf26 pack type - single transfer operation".
#[test]
fn binary_metadata_transfer_operation_hf26() {
    wax_test(None, |ctx| {
        let view = ctx
            .base
            .operation_binary_view_metadata(&transfer_operation(), true)
            .expect("operation_binary_view_metadata");

        assert_eq!(
            view.binary,
            "02086f6e65706c7573370b6b727970746f67616d6573e0930400000000002320bcbe1b526f6c6c20756e6465722035302034643433346264393433363136"
        );
        assert_eq!(view.offsets, binary_data_hf26_transfer_operation(0));
    });
}

// TS line 652: "Should be able to generate binary metadata information using
// legacy pack type - single transfer operation".
#[test]
fn binary_metadata_transfer_operation_legacy() {
    wax_test(None, |ctx| {
        let view = ctx
            .base
            .operation_binary_view_metadata(&transfer_operation(), false)
            .expect("operation_binary_view_metadata");

        assert_eq!(
            view.binary,
            "02086f6e65706c7573370b6b727970746f67616d6573e09304000000000003535445454d00001b526f6c6c20756e6465722035302034643433346264393433363136"
        );
        assert_eq!(view.offsets, binary_data_legacy_transfer_operation(0));
    });
}

// TS line 670: "Should be able to generate random private key using password".
#[test]
fn generate_private_key_password_based() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .get_private_key_from_password(
                "gtg",
                "active",
                "verysecurepassword",
            )
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

// TS line 679: "Should be able to suggest brain key".
#[test]
fn suggest_brain_key() {
    wax_test(None, |ctx| {
        let result = ctx.base.suggest_brain_key().expect("suggest_brain_key");
        assert_eq!(result.associated_public_key.len(), 53);
        assert!(!result.brain_key.is_empty());
        assert_eq!(result.wif_private_key.len(), 51);
    });
}

// TS line 689: "Should be able to calculate public key".
#[test]
fn calculate_public_key() {
    wax_test(None, |ctx| {
        let public_key = ctx
            .base
            .calculate_public_key(
                "5J89tdX8b1wQJHcqDMDVn1UwvtiYFK53PQEgG5gL5oCEk83Us12",
            )
            .expect("calculate_public_key");
        assert_eq!(
            public_key,
            "STM6JswFatSixhR9AMUP38rtpMVAagTvxGYu7d8i2JUK1QZDkPbH3"
        );
    });
}

// TS line 697: "Should be able to calculate the transaction id".
#[test]
fn calculate_transaction_id_hf26() {
    wax_test(None, |ctx| {
        let id = ctx
            .base
            .create_transaction_from_json(TRANSACTION_API_JSON)
            .expect("create_transaction_from_json")
            .id()
            .expect("tx.id()");
        assert_eq!(id, "da8ca54c9c3acad06915ae9d93988c367f5cd164");
    });
}

// TS line 706: "Should be able to calculate the legacy transaction id of the
// serialization sensitive transaction".
#[test]
fn calculate_legacy_transaction_id_serialization_sensitive() {
    wax_test(None, |ctx| {
        let id = ctx
            .base
            .create_transaction_from_json(
                SERIALIZATION_SENSITIVE_TRANSACTION_API_JSON,
            )
            .expect("create_transaction_from_json")
            .legacy_id()
            .expect("legacy_id");
        assert_eq!(id, "7f34699e9eea49d1bcc10c88f96e38897839ece3");
    });
}

// TS line 715: "Should be able to calculate the HF26 transaction id of the
// serialization sensitive transaction".
#[test]
fn calculate_hf26_transaction_id_serialization_sensitive() {
    wax_test(None, |ctx| {
        let id = ctx
            .base
            .create_transaction_from_json(
                SERIALIZATION_SENSITIVE_TRANSACTION_API_JSON,
            )
            .expect("create_transaction_from_json")
            .id()
            .expect("id");
        assert_eq!(id, "3725c81634f152011e2043eb7119911b953d4267");
    });
}

// TS line 724: "Should be able to serialize the transaction".
#[test]
fn serialize_transaction_not_stripped() {
    wax_test(None, |ctx| {
        let hex = ctx
            .base
            .create_transaction_from_json(TRANSACTION_API_JSON)
            .expect("create_transaction_from_json")
            .to_binary_form(false)
            .expect("to_binary_form");
        assert_eq!(
            hex,
            "ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000"
        );
    });
}

// TS line 733: "Should be able to serialize the (stripped) transaction".
#[test]
fn serialize_transaction_stripped() {
    wax_test(None, |ctx| {
        let hex = ctx
            .base
            .create_transaction_from_json(TRANSACTION_API_JSON)
            .expect("create_transaction_from_json")
            .to_binary_form(true)
            .expect("to_binary_form(strip)");
        assert_eq!(
            hex,
            "ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a980800"
        );
    });
}

// TS line 744: "Should be able to calculate sig digest of the transaction".
//
// TS passes an arbitrary chain_id ("beeab0de…") directly to `cpp_tx_sig_digest`.
// The Rust `sig_digest()` is bound to the foundation's chain_id, so we build
// the foundation with the test chain_id explicitly.
#[test]
fn sig_digest_hf26_with_test_chain_id() {
    let opts = WaxOptions {
        chain_id:
            "beeab0de00000000000000000000000000000000000000000000000000000000"
                .into(),
    };
    wax_test(opts, |ctx| {
        let digest = ctx
            .base
            .create_transaction_from_json(TRANSACTION_API_JSON)
            .expect("create_transaction_from_json")
            .sig_digest()
            .expect("sig_digest");
        assert_eq!(
            digest,
            "1394412814ea3e444f65c46f075e15b9b82e6bea9241319b02743a8e593219e1"
        );
    });
}

// TS line 753: "Should be able to calculate legacy sig digest of the
// transaction".
#[test]
fn legacy_sig_digest_serialization_sensitive_with_test_chain_id() {
    let opts = WaxOptions {
        chain_id:
            "beeab0de00000000000000000000000000000000000000000000000000000000"
                .into(),
    };
    wax_test(opts, |ctx| {
        let digest = ctx
            .base
            .create_transaction_from_json(
                SERIALIZATION_SENSITIVE_TRANSACTION_API_JSON,
            )
            .expect("create_transaction_from_json")
            .legacy_sig_digest()
            .expect("legacy_sig_digest");
        assert_eq!(
            digest,
            "7fbd09ff2c3a90acfc59adce5abffdaa3fc95e33160c5ac237f0f4366f90e2fe"
        );
    });
}

// TS line 762: "Should be able to get required authorities for the
// transaction".
#[test]
fn required_authorities_for_vote_transaction() {
    use wax::models::RequiredAuthorities;

    wax_test(None, |ctx| {
        let auths = ctx
            .base
            .create_transaction_from_json(
                REQUIRED_AUTHORITIES_TRANSACTION_API_JSON,
            )
            .expect("create_transaction_from_json")
            .required_authorities()
            .expect("required_authorities");

        assert_eq!(
            auths,
            RequiredAuthorities {
                posting_accounts: vec!["taoteh1221".into()],
                active_accounts: vec![],
                owner_accounts: vec![],
                other_authorities: vec![],
            }
        );
    });
}

// TS line 793: "Should be able to get hive::protocol config".
// TS passes a custom chain_id ("beeab0de…") directly to
// `cpp_get_hive_protocol_config`. In Rust, `config()` is read off the
// foundation's chain_id, so we instantiate the foundation with that id.
#[test]
fn get_hive_protocol_config_known_constants() {
    let opts = WaxOptions {
        chain_id:
            "beeab0de00000000000000000000000000000000000000000000000000000000"
                .into(),
    };
    wax_test(opts, |ctx| {
        let cfg = ctx.base.config().expect("config");
        assert_eq!(
            cfg.get("HBD_SYMBOL").map(String::as_str),
            Some("@@000000013")
        );
        assert_eq!(
            cfg.get("HIVE_DEFAULT_ACCOUNT_SUBSIDY_DECAY")
                .map(String::as_str),
            Some("347321")
        );
        assert_eq!(
            cfg.get("HIVE_INIT_PUBLIC_KEY").map(String::as_str),
            Some("STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX")
        );
    });
}

// TS line 816: "Should not crash the program - transaction validation - but
// fail". Empty transaction (no operations) must fail validation, not crash.
#[test]
fn validate_empty_transaction_fails_without_panic() {
    wax_test(None, |ctx| {
        let tx = ctx
            .base
            .create_transaction_from_proto(ProtoTransaction {
                ref_block_num: 0,
                ref_block_prefix: 0,
                expiration: String::new(),
                operations: Vec::new(),
                extensions: Vec::new(),
                signatures: Vec::new(),
            })
            .expect("create_transaction_from_proto");
        assert!(
            tx.validate().is_err(),
            "validate() on an empty transaction must error"
        );
    });
}

// TS line 831: "Should not crash the program - operation validation - but
// fail". A default (no value) operation must fail without crashing.
//
// TS NOTE: the TS test drives the raw protocol FFI
// (`cpp_create_operation_handle` / `cpp_op_validate`) and asserts it throws, so
// we mirror that layer here rather than the high-level `Foundation` wrapper. An
// empty operation has no oneof set, so
// `rust_managed_object::get_underlying_sv_type` FC_ASSERTs (mirroring
// `emscripten_managed_object`); that surfaces through `safe_exception_wrapper`
// as a catchable `Err` — no panic/abort. (The
// `Foundation::create_operation_from_proto` wrapper `.expect()`s this same error
// and would panic; that is a wrapper-level concern, not what this protocol-layer
// test covers.)
#[test]
fn validate_empty_operation_fails_without_panic() {
    let protocol = wax::core::ffi::new_rust_protocol();

    let empty = ProtoOperation { value: None };
    let managed = wax::core::RustManagedObject::from_operation(&empty);

    assert!(
        protocol.cpp_create_operation_handle(managed, true).is_err(),
        "empty operation must fail, not panic"
    );
}
// TS line 838: "Should be able to validate example operation".
#[test]
fn validate_example_vote_operation() {
    wax_test(None, |ctx| {
        let op = ctx.base.create_operation(Value::VoteOperation(Vote {
            voter: "otom".into(),
            author: "c0ff33a".into(),
            permlink: "ewxhnjbj".into(),
            weight: 2200,
        }));
        op.validate().expect("vote op must validate");
    });
}

// TS line 845: "Should be able to get impacted accounts from example
// operation".
#[test]
fn impacted_accounts_from_vote_operation() {
    wax_test(None, |ctx| {
        let op = ctx.base.create_operation(Value::VoteOperation(Vote {
            voter: "otom".into(),
            author: "c0ff33a".into(),
            permlink: "ewxhnjbj".into(),
            weight: 2200,
        }));
        let impacted = op.impacted_accounts().expect("impacted_accounts");
        assert_eq!(impacted, vec!["c0ff33a".to_string(), "otom".to_string()]);
    });
}

// TS line 857: "Should be able to get impacted accounts from example
// transaction".
#[test]
fn impacted_accounts_from_vote_transaction() {
    wax_test(None, |ctx| {
        let tx = ctx
            .base
            .create_transaction_from_json(TRANSACTION_API_JSON)
            .expect("create_transaction_from_json");
        let impacted = tx.impacted_accounts().expect("impacted_accounts");
        assert_eq!(impacted, vec!["c0ff33a".to_string(), "otom".to_string()]);
    });
}

// TS line 869: "Should be able to validate example transaction".
#[test]
fn validate_example_transaction() {
    wax_test(None, |ctx| {
        let tx = ctx
            .base
            .create_transaction_from_json(TRANSACTION_API_JSON)
            .expect("create_transaction_from_json");
        tx.validate().expect("validate");
    });
}

// TS line 876: "Should be able to calculate manabar full regeneration time".
#[test]
fn manabar_full_regeneration_time_full() {
    wax_test(None, |ctx| {
        let t = ctx
            .base
            .calculate_manabar_full_regeneration_time(at(0), 100, 100, 0)
            .expect("calculate_manabar_full_regeneration_time");
        assert_eq!(t, 0);
    });
}

// TS line 884: "Should be able to calculate manabar full regeneration time
// (relaxed)".
#[test]
fn manabar_full_regeneration_time_full_relaxed() {
    wax_test(None, |ctx| {
        let t = ctx
            .base
            .calculate_manabar_full_regeneration_time(at(0), 100, 100, 10)
            .expect("calculate_manabar_full_regeneration_time");
        assert_eq!(t, 10);
    });
}

// TS line 892: "Should be able to calculate the current manabar value".
#[test]
fn manabar_current_value_full() {
    wax_test(None, |ctx| {
        let m = ctx
            .base
            .calculate_current_manabar_value(at(0), 100, 100, 0)
            .expect("calculate_current_manabar_value");
        assert_eq!(m.current_mana(), 100);
    });
}

// TS line 900: "Should be able to calculate the current manabar value
// (relaxed)".
#[test]
fn manabar_current_value_full_relaxed() {
    wax_test(None, |ctx| {
        let m = ctx
            .base
            .calculate_current_manabar_value(at(0), 100, 100, 10)
            .expect("calculate_current_manabar_value");
        assert_eq!(m.current_mana(), 100);
    });
}

// TS line 908: "Should be able to calculate the current manabar full
// regeneration time". (TS reuses `cpp_calculate_current_manabar_value` here;
// the assertion is the same as line 892.)
#[test]
fn manabar_current_value_dup_of_full() {
    wax_test(None, |ctx| {
        let m = ctx
            .base
            .calculate_current_manabar_value(at(0), 100, 100, 0)
            .expect("calculate_current_manabar_value");
        assert_eq!(m.current_mana(), 100);
    });
}

// TS line 916: "Should be able to create Hive in NAI form".
#[test]
fn create_hive_nai_small() {
    wax_test(None, |ctx| {
        let asset = ctx.base.hive_satoshis(10).expect("hive_satoshis");
        assert_eq!(
            asset,
            NaiAsset {
                amount: "10".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 928: "Should be able to create Hive in NAI form - large integer".
#[test]
fn create_hive_nai_large() {
    wax_test(None, |ctx| {
        let asset = ctx
            .base
            .hive_satoshis(10_000_000_000)
            .expect("hive_satoshis");
        assert_eq!(
            asset,
            NaiAsset {
                amount: "10000000000".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 940: "Should be able to create HBD in NAI form".
// TS uses `Number.MAX_SAFE_INTEGER + 1` (= 2**53). The Rust API takes i64
// directly with no precision loss, so we assert against that value.
#[test]
fn create_hbd_nai_large() {
    wax_test(None, |ctx| {
        let amount: i64 = 9_007_199_254_740_992; // 2**53
        let asset = ctx.base.hbd_satoshis(amount).expect("hbd_satoshis");
        assert_eq!(
            asset,
            NaiAsset {
                amount: amount.to_string(),
                precision: 3,
                nai: "@@000000013".into(),
            }
        );
    });
}

// TS line 952: "Should be able to create VESTS in NAI form".
// TS uses `Number.MIN_SAFE_INTEGER` (= -(2**53 - 1)).
#[test]
fn create_vests_nai_min_safe() {
    wax_test(None, |ctx| {
        let amount: i64 = -9_007_199_254_740_991; // -(2**53 - 1)
        let asset = ctx.base.vests_satoshis(amount).expect("vests_satoshis");
        assert_eq!(
            asset,
            NaiAsset {
                amount: amount.to_string(),
                precision: 6,
                nai: "@@000000037".into(),
            }
        );
    });
}

// TS line 964: "Should be able to create custom general asset in NAI form".
// The packed asset num 3_200_000_035 decodes to the HIVE symbol.
#[test]
fn create_general_asset_with_custom_nai() {
    wax_test(None, |ctx| {
        let asset = ctx
            .base
            .general_asset(3_200_000_035, 10)
            .expect("general_asset");
        assert_eq!(
            asset,
            NaiAsset {
                amount: "10".into(),
                precision: 3,
                nai: "@@000000021".into(),
            }
        );
    });
}

// TS line 976: "Should be able to calculate HP APR 1".
#[test]
fn calculate_hp_apr_fixture_1() {
    wax_test(None, |ctx| {
        let virtual_supply = ctx
            .base
            .hive_satoshis(530_656_835_180)
            .expect("hive_satoshis");
        let total_vesting_fund_hive = ctx
            .base
            .hive_satoshis(173_009_633_181)
            .expect("hive_satoshis");
        let apr = ctx
            .base
            .calculate_hp_apr(
                1_000_000,
                1_500,
                &virtual_supply,
                &total_vesting_fund_hive,
            )
            .expect("calculate_hp_apr");
        assert_eq!(apr, Decimal::new(448, 2));
    });
}

// TS line 986: "Should be able to calculate HP APR 2".
#[test]
fn calculate_hp_apr_fixture_2() {
    wax_test(None, |ctx| {
        let virtual_supply = ctx
            .base
            .hive_satoshis(530_656_835_180)
            .expect("hive_satoshis");
        let total_vesting_fund_hive = ctx
            .base
            .hive_satoshis(173_009_633_181)
            .expect("hive_satoshis");
        let apr = ctx
            .base
            .calculate_hp_apr(
                82_779_364,
                1_500,
                &virtual_supply,
                &total_vesting_fund_hive,
            )
            .expect("calculate_hp_apr");
        assert_eq!(apr, Decimal::new(297, 2));
    });
}

// TS line 996: "Should be able to calculate inflation rate for block 1_000_000".
#[test]
fn calculate_inflation_rate_block_1m() {
    wax_test(None, |ctx| {
        let rate = ctx
            .base
            .calculate_inflation_rate_for_block(1_000_000)
            .expect("calculate_inflation_rate_for_block");
        assert_eq!(rate, 974);
    });
}

// TS line 1004: "Should be able to calculate inflation rate for block 7_000_000".
#[test]
fn calculate_inflation_rate_block_7m() {
    wax_test(None, |ctx| {
        let rate = ctx
            .base
            .calculate_inflation_rate_for_block(7_000_000)
            .expect("calculate_inflation_rate_for_block");
        assert_eq!(rate, 950);
    });
}

// TS line 1012: "Should be able to calculate inflation rate for block 9_000_000".
#[test]
fn calculate_inflation_rate_block_9m() {
    wax_test(None, |ctx| {
        let rate = ctx
            .base
            .calculate_inflation_rate_for_block(9_000_000)
            .expect("calculate_inflation_rate_for_block");
        assert_eq!(rate, 942);
    });
}

// TS line 1020: "Should be able to serialize witness properties and retrieve
// serialized data".
#[test]
fn serialize_witness_set_properties_matches_fixture() {
    wax_test(None, |ctx| {
        let props = ctx
            .base
            .serialize_witness_props(&witness_properties())
            .expect("serialize_witness_props");

        assert_eq!(
            props,
            HashMap::from([
                ("account_creation_fee".into(), "88130000000000002320bcbe".into()),
                ("account_subsidy_budget".into(), "1d030000".into()),
                ("account_subsidy_decay".into(), "b94c0500".into()),
                ("hbd_exchange_rate".into(), "64000000000000000320bcbe64000000000000002320bcbe".into()),
                ("hbd_interest_rate".into(), "e803".into()),
                ("key".into(), "02472d6eb6d691b6de8b103b51ebdf4e128a523946d8cd03d6ded91b1497ee2e83".into()),
                ("maximum_block_size".into(), "00000200".into()),
                ("new_signing_key".into(), "02cf69b1f999d133ebbe178a8b4bbf4da356b264dfdc843b1c740378bff8f65b33".into()),
                ("url".into(), "0f68747470733a2f2f686976652e696f".into()),
            ])
        );
    });
}

// TS line 1051: "Should be able to serialize witness properties and then
// deserialize".
#[test]
fn deserialize_witness_set_properties_round_trip() {
    wax_test(None, |ctx| {
        let props = witness_properties();

        let serialized = ctx
            .base
            .serialize_witness_props(&props)
            .expect("serialize_witness_props");
        let deserialized = ctx
            .base
            .deserialize_witness_props(&serialized)
            .expect("deserialize_witness_props");

        assert_eq!(deserialized, props);
    });
}

// TS line 1063: "Should be able to estimate hive collateral".
#[test]
fn estimate_hive_collateral_known_fixture() {
    wax_test(None, |ctx| {
        let median = JsonPrice {
            base: ctx.base.hbd_satoshis(201).expect("hbd"),
            quote: ctx.base.hive_satoshis(1_000).expect("hive"),
        };
        let minimum = JsonPrice {
            base: ctx.base.hbd_satoshis(197).expect("hbd"),
            quote: ctx.base.hive_satoshis(1_000).expect("hive"),
        };
        let result = ctx
            .base
            .estimate_hive_collateral(
                &median,
                &minimum,
                &ctx.base.hbd_satoshis(100_000).expect("hbd"),
            )
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

// TS line 1086: "Should be able to evaluate hbd interest 1".
//
// TS:  hbd_seconds_low = 0xFFFFFFFFFFFFFFFF, hbd_seconds_hi = 0
//      → packed u128 = 0x0000_0000_0000_0000__FFFF_FFFF_FFFF_FFFF
#[test]
fn evaluate_hbd_interest_fixture_1() {
    wax_test(None, |ctx| {
        let result = ctx
            .base
            .estimate_hbd_interest(
                u64::MAX as u128,
                3_000_000,
                &ctx.base.hbd_satoshis(100_000_000_000).expect("hbd"),
                3_000_333,
                15,
            )
            .expect("estimate_hbd_interest");
        assert_eq!(
            result,
            NaiAsset {
                amount: "877412042".into(),
                precision: 3,
                nai: "@@000000013".into(),
            }
        );
    });
}

// TS line 1105: "Should be able to evaluate hbd interest 2".
//
// TS:  hbd_seconds_low = 0xFFFFFFFFFFFFFFFF, hbd_seconds_hi = 0xFF
//      → packed u128 = 0x0000_0000_0000_00FF__FFFF_FFFF_FFFF_FFFF
#[test]
fn evaluate_hbd_interest_fixture_2() {
    wax_test(None, |ctx| {
        let hbd_seconds: u128 = ((0xFF_u128) << 64) | (u64::MAX as u128);
        let result = ctx
            .base
            .estimate_hbd_interest(
                hbd_seconds,
                3_000_000,
                &ctx.base.hbd_satoshis(100_000_000).expect("hbd"),
                3_003_000,
                15,
            )
            .expect("estimate_hbd_interest");
        assert_eq!(
            result,
            NaiAsset {
                amount: "224617888250".into(),
                precision: 3,
                nai: "@@000000013".into(),
            }
        );
    });
}

// TS line 1124: "Should be able to convert api schema to proto schema without
// data loss - basic transaction". Parse API JSON, re-emit, parse again — the
// proto state must be identical.
#[test]
fn api_to_proto_basic_transaction_no_data_loss() {
    wax_test(None, |ctx| {
        let from_api = ctx
            .base
            .create_transaction_from_json(TRANSACTION_API_JSON)
            .expect("create_transaction_from_json (api)");

        let from_proto = ctx
            .base
            .create_transaction_from_proto_json(TRANSACTION_PROTO_JSON)
            .expect("create_transaction_from_proto_json");

        assert_eq!(from_api.transaction(), from_proto.transaction());
    });
}

// TS line 1134: "Should be able to convert proto schema to api schema without
// data loss - basic transaction".
#[test]
fn proto_to_api_basic_transaction_no_data_loss() {
    wax_test(None, |ctx| {
        let from_proto = ctx
            .base
            .create_transaction_from_proto_json(TRANSACTION_PROTO_JSON)
            .expect("create_transaction_from_proto_json");

        let api_json = from_proto.to_api().expect("to_api");

        // The emitted API JSON must equal the API fixture itself, like the
        // TS `expect(retVal).toEqual(JSON.parse(transaction))`.
        assert_eq!(
            serde_json::from_str::<serde_json::Value>(&api_json)
                .expect("parse emitted api json"),
            serde_json::from_str::<serde_json::Value>(TRANSACTION_API_JSON)
                .expect("parse api fixture"),
        );

        let re_parsed = ctx
            .base
            .create_transaction_from_json(&api_json)
            .expect("create_transaction_from_json (api)");

        // After api → proto round-trip, proto state must match the original.
        assert_eq!(from_proto.transaction(), re_parsed.transaction());
    });
}

// TS line 1144: "Should be able to perform multiple bidirectional conversion
// - basic transaction".
#[test]
fn multiple_bidirectional_conversion_basic_transaction() {
    wax_test(None, |ctx| {
        // proto → api1
        let from_proto = ctx
            .base
            .create_transaction_from_proto_json(TRANSACTION_PROTO_JSON)
            .expect("create_transaction_from_proto_json");
        let api1 = from_proto.to_api().expect("to_api 1");

        // api1 → proto → api2
        let api1_tx = ctx
            .base
            .create_transaction_from_json(&api1)
            .expect("create_transaction_from_json (api1)");
        let api2 = api1_tx.to_api().expect("to_api 2");

        // api1 and api2 are both API-shape JSON; structural equality after
        // parsing confirms idempotency.
        let v1: serde_json::Value =
            serde_json::from_str(&api1).expect("api1 JSON");
        let v2: serde_json::Value =
            serde_json::from_str(&api2).expect("api2 JSON");
        assert_eq!(v1, v2);
    });
}

// TS line 1166: "Should be able to validate basic transaction after
// transforming from api schema to proto schema".
#[test]
fn validate_after_api_to_proto_basic_transaction() {
    wax_test(None, |ctx| {
        ctx.base
            .create_transaction_from_json(TRANSACTION_API_JSON)
            .expect("create_transaction_from_json")
            .validate()
            .expect("validate after api → proto");
    });
}

// TS line 1179: "Should be able to validate basic transaction by the standard
// protocol after transforming from proto schema to api schema".
#[test]
fn validate_after_proto_to_api_basic_transaction() {
    wax_test(None, |ctx| {
        let from_proto = ctx
            .base
            .create_transaction_from_proto_json(TRANSACTION_PROTO_JSON)
            .expect("create_transaction_from_proto_json");

        let api_json = from_proto.to_api().expect("to_api");
        ctx.base
            .create_transaction_from_json(&api_json)
            .expect("create_transaction_from_json (api)")
            .validate()
            .expect("validate after proto → api");
    });
}

// ---------------------------------------------------------------------------
// Unused-import sentinels (kept so the imports above stay live even while
// some tests are #[ignore]'d).
// ---------------------------------------------------------------------------
#[allow(dead_code)]
fn _ensure_proto_types_are_used() -> (
    AccountCreate,
    Asset,
    Authority,
    ProtoTransaction,
    Transfer,
    Vote,
) {
    (
        AccountCreate::default(),
        Asset::default(),
        Authority::default(),
        ProtoTransaction::default(),
        Transfer::default(),
        Vote::default(),
    )
}
