// Rust port of `ts/wasm/__tests__/detailed/formatters.ts`.
//
// Tests appear in TS source order. Each Rust test has a `// TS line N`
// comment pointing back to the TS original. `formatter.display()` stands in
// for the TS `waxify` tagged template; the formatter is reached through the
// foundation (TS reaches the same instance through the chain, which derefs
// to the foundation here).
//
// TS NOTE: the two `matchInstanceOf`-dependent members do not port — rules
// compose only through JSON shape after serde serialization (see
// `formatters_diff.md`, gap #1): the traversal test replaces its
// `matchInstanceOf` handler with an equivalent property matcher, and the
// hive-apps instance-matching test is an `#[ignore]` stub.

use std::sync::atomic::{AtomicUsize, Ordering};

use serde_json::{Value, json};

use wax::hive_apps_operations::{
    CommunityOperation, CommunityProps, FollowOperation, HiveAppsOperation,
    ResourceCreditsOperation,
};
use wax::proto::{self, operation::Value as OperationValue};
use wax::{
    FormatContext, FoundationHandle, WaxFormatterOptions, hive_formatter,
};

use crate::common::{WaxTestCtx, wax_test};

const TAPOS: &str = "04c507a8c7fe5be96be64ce7c86855e1806cbde3";
const EXPIRATION: &str = "2023-11-09T21:51:27";

// data.protocol.ts: `naiAsset`.
fn nai_asset() -> Value {
    json!({ "amount": "300000", "precision": 3, "nai": "@@000000021" })
}

// data.protocol.ts: `transfer_operation` / `vote_operation`.
fn transfer_operation() -> Value {
    json!({
        "type": "transfer_operation",
        "value": {
            "from": "oneplus7",
            "to": "kryptogames",
            "amount": nai_asset(),
            "memo": "Roll under 50 4d434bd943616",
        }
    })
}

fn vote_operation() -> Value {
    json!({
        "type": "vote_operation",
        "value": {
            "voter": "otom",
            "author": "c0ff33a",
            "permlink": "ewxhnjbj",
            "weight": 2200,
        }
    })
}

// data.protocol.ts: `serialization_sensitive_transaction`.
fn sensitive_transaction() -> Value {
    json!({
        "ref_block_num": 1959,
        "ref_block_prefix": 3625727107u32,
        "expiration": "2023-11-09T22:01:24",
        "operations": [transfer_operation()],
        "extensions": [],
        "signatures": [],
    })
}

// data.protocol.ts: `serialization_sensitive_transaction_proto`.
fn sensitive_transaction_proto() -> proto::Transaction {
    proto::Transaction {
        ref_block_num: 1959,
        ref_block_prefix: 3625727107,
        expiration: "2023-11-09T22:01:24".into(),
        operations: vec![proto::Operation {
            value: Some(OperationValue::TransferOperation(proto::Transfer {
                from_account: "oneplus7".into(),
                to_account: "kryptogames".into(),
                amount: proto::Asset {
                    amount: "300000".into(),
                    precision: 3,
                    nai: "@@000000021".into(),
                },
                memo: "Roll under 50 4d434bd943616".into(),
            })),
        }],
        extensions: vec![],
        signatures: vec![],
    }
}

// data.protocol.ts: `serializedWitnessSetProperties`. The packed hex values
// are kept on one line, verbatim from the TS fixture — splitting them is a
// corruption hazard.
#[rustfmt::skip]
fn serialized_witness_set_properties() -> Value {
    json!({
        "type": "witness_set_properties_operation",
        "value": {
            "owner": "gtg",
            "props": [
                ["account_creation_fee", "88130000000000002320bcbe"],
                ["account_subsidy_budget", "e8030000"],
                ["account_subsidy_decay", "e8030000"],
                ["hbd_exchange_rate", "e8030000000000000320bcbee8030000000000002320bcbe"],
                ["hbd_interest_rate", "e803"],
                ["key", "3553544d355271564241564e703575664d4365745174764c474c4a6f37756e58396e7943424d4d7254585257513969315a7a7a697a68"],
                ["maximum_block_size", "e8030000"],
                ["new_signing_key", "3553544d365471534a61533161526a367036795a456f35786963583762764c6872666456716935546f4e724b78485533465242456457"],
                ["url", "0f68747470733a2f2f686976652e696f"],
            ]
        }
    })
}

// data.protocol.ts: `realSerializedWitnessSetProperties`.
#[rustfmt::skip]
fn real_serialized_witness_set_properties() -> Value {
    json!({
        "type": "witness_set_properties_operation",
        "value": {
            "owner": "igormuba",
            "props": [
                ["hbd_exchange_rate", "11010000000000000353424400000000e80300000000000003535445454d0000"],
                ["key", "029072da2e84ebd6eb520f944db3d1af718500b0f1ddf60e11e986f990acddd524"]
            ],
            "extensions": []
        }
    })
}

fn fresh_tx(ctx: &WaxTestCtx) -> wax::Transaction {
    ctx.base
        .create_transaction_with_tapos(TAPOS, EXPIRATION)
        .expect("create_transaction_with_tapos")
}

// TS line 15: "Should traverse from bottom to top of the object using
// default formatters from hive chain interface".
//
// TS NOTE: the TS `bottomKey3` handler matches `ExampleClassMatch` through
// `matchInstanceOf`; instances do not survive serialization, so the Rust
// handler matches the `bottomKey3` property instead — same call site in the
// walk, same container semantics, same traversal position (counter 5).
#[derive(Default)]
struct TraverseCustomFormatter {
    counter: AtomicUsize,
}

#[hive_formatter]
impl TraverseCustomFormatter {
    fn step(&self) -> usize {
        self.counter.fetch_add(1, Ordering::SeqCst) + 1
    }

    fn source_object() -> Value {
        json!({
            "nestedKey1": {
                "nestedKey2": { "bottomKey1": "123" },
                "nestedKey3": { "bottomKey2": "123" },
                "nestedKey4": { "bottomKey3": { "a": "hello" } },
            }
        })
    }

    #[format(match_property = "bottomKey1")]
    fn bottom_key1_handler(
        &self,
        ctx: &FormatContext<'_>,
        _source: Value,
    ) -> Option<Value> {
        assert_eq!(self.step(), 1);

        let expected = &Self::source_object()["nestedKey1"]["nestedKey2"];
        assert_eq!(ctx.source, expected);
        assert_eq!(ctx.target, expected);

        Some(json!(123))
    }

    #[format(match_property = "nestedKey2")]
    fn nested_key2_handler(
        &self,
        ctx: &FormatContext<'_>,
        _source: Value,
    ) -> Option<Value> {
        assert_eq!(self.step(), 2);

        assert_eq!(ctx.source, &Self::source_object()["nestedKey1"]);
        assert_eq!(
            ctx.target,
            &json!({
                "nestedKey2": 123,
                "nestedKey3": { "bottomKey2": "123" },
                "nestedKey4": { "bottomKey3": { "a": "hello" } },
            })
        );

        None // Do not change anything
    }

    #[format(match_property = "bottomKey2")]
    fn bottom_key2_handler(
        &self,
        ctx: &FormatContext<'_>,
        _source: Value,
    ) -> Option<Value> {
        assert_eq!(self.step(), 3);

        let expected = &Self::source_object()["nestedKey1"]["nestedKey3"];
        assert_eq!(ctx.source, expected);
        assert_eq!(ctx.target, expected);

        Some(json!(true))
    }

    #[format(match_property = "nestedKey3")]
    fn nested_key3_handler(
        &self,
        ctx: &FormatContext<'_>,
        _source: Value,
    ) -> Option<Value> {
        assert_eq!(self.step(), 4);

        assert_eq!(ctx.source, &Self::source_object()["nestedKey1"]);
        assert_eq!(
            ctx.target,
            &json!({
                "nestedKey2": 123,
                "nestedKey3": true,
                "nestedKey4": { "bottomKey3": { "a": "hello" } },
            })
        );

        None
    }

    #[format(match_property = "bottomKey3")]
    fn bottom_key3_handler(
        &self,
        ctx: &FormatContext<'_>,
        source: Value,
    ) -> Option<Value> {
        assert_eq!(self.step(), 5);

        let expected = &Self::source_object()["nestedKey1"]["nestedKey4"];
        assert_eq!(ctx.source, expected);
        assert_eq!(ctx.target, expected);

        Some(source["bottomKey3"]["a"].clone())
    }

    #[format(match_property = "nestedKey4")]
    fn nested_key4_handler(
        &self,
        ctx: &FormatContext<'_>,
        _source: Value,
    ) -> Option<Value> {
        assert_eq!(self.step(), 6);

        assert_eq!(ctx.source, &Self::source_object()["nestedKey1"]);
        assert_eq!(
            ctx.target,
            &json!({
                "nestedKey2": 123,
                "nestedKey3": true,
                "nestedKey4": "hello",
            })
        );

        Some(json!([
            ctx.target["nestedKey2"],
            ctx.target["nestedKey3"],
            ctx.target["nestedKey4"],
        ]))
    }

    #[format(match_property = "nestedKey1")]
    fn nested_key1_handler(
        &self,
        ctx: &FormatContext<'_>,
        _source: Value,
    ) -> Option<Value> {
        assert_eq!(self.step(), 7);

        assert_eq!(ctx.source, &Self::source_object());
        assert_eq!(ctx.target, &json!({ "nestedKey1": [123, true, "hello"] }));

        let rendered = serde_json::to_string(&ctx.target["nestedKey1"])
            .expect("nestedKey1 serialization");

        Some(Value::String(rendered))
    }
}

#[test]
fn traverses_from_bottom_to_top_of_the_object() {
    wax_test(None, |ctx| {
        let formatter =
            ctx.base.formatter().extend::<TraverseCustomFormatter>();

        let formatted = formatter
            .format(&TraverseCustomFormatter::source_object())
            .expect("format");

        assert_eq!(formatted, json!(r#"[123,true,"hello"]"#));
    });
}

// TS line 117: "Should be able to format numbers using default formatters
// from hive chain interface". The TS `locales: "en-US"` maps onto the
// default `NumberSeparators`; the TS `BigInt` input form maps onto `i128`.
#[test]
fn formats_numbers_with_the_default_formatter() {
    wax_test(None, |ctx| {
        let formatter = ctx.base.formatter();

        let formatted = [
            formatter.format_number(76543212345678i64, 3),
            formatter.format_number(76543212345678i64, 2),
            formatter.format_number(76543212345678i64, 0),
            formatter.format_number(76543212345678i64, None),
            formatter.format_number(76543212345678i128, 3),
            formatter.format_number(76543212345678i128, 2),
            formatter.format_number(76543212345678i128, 0),
            formatter.format_number(76543212345678i128, None),
            formatter.format_number("76543212345678", 3),
            formatter.format_number("76543212345678", 2),
            formatter.format_number("76543212345678", 0),
            formatter.format_number("76543212345678", None),
            formatter.format_number("765432123.4567", 3),
            formatter.format_number("765432123.4567", 2),
            formatter.format_number("765432123.4567", 0),
            formatter.format_number("765432123.4567", None),
            formatter.format_number("-76543212.3456", 3),
            formatter.format_number("-76543212.3456", 2),
            formatter.format_number("-76543212.3456", 0),
            formatter.format_number("-76543212.3456", None),
            formatter.format_number("0.3456", 3),
            formatter.format_number("0.3456", 2),
            formatter.format_number("0.3456", 0),
            formatter.format_number("0.3456", None),
            formatter.format_number("0.1", 3),
            formatter.format_number("0.1", 2),
            formatter.format_number("0.1", 0),
            formatter.format_number("0.1", None),
            formatter.format_number("0", 3),
            formatter.format_number("0", 2),
            formatter.format_number("0", 0),
            formatter.format_number("0", None),
            formatter.format_number(f64::NAN, 3),
            formatter.format_number(f64::NAN, 2),
            formatter.format_number(f64::NAN, 0),
            formatter.format_number(f64::NAN, None),
        ];

        assert_eq!(
            formatted,
            [
                "76,543,212,345,678.000",
                "76,543,212,345,678.00",
                "76,543,212,345,678",
                "76,543,212,345,678",
                "76,543,212,345,678.000",
                "76,543,212,345,678.00",
                "76,543,212,345,678",
                "76,543,212,345,678",
                "76,543,212,345,678.000",
                "76,543,212,345,678.00",
                "76,543,212,345,678",
                "76,543,212,345,678",
                "765,432,123.456",
                "765,432,123.45",
                "765,432,123",
                "765,432,123.4567",
                "-76,543,212.345",
                "-76,543,212.34",
                "-76,543,212",
                "-76,543,212.3456",
                "0.345",
                "0.34",
                "0",
                "0.3456",
                "0.100",
                "0.10",
                "0",
                "0.1",
                "0.000",
                "0.00",
                "0",
                "0",
                "0.000",
                "0.00",
                "0",
                "0",
            ]
        );
    });
}

// TS line 199: "Should be able to format witness set properties operation
// using default formatters from hive chain interface (MAINNET)".
#[test]
fn formats_real_witness_set_properties() {
    wax_test(None, |ctx| {
        let formatted = ctx
            .base
            .formatter()
            .format(&real_serialized_witness_set_properties())
            .expect("format");

        let owner = formatted["value"]["owner"].as_str().expect("owner");
        let key = formatted["value"]["props"]["key"].as_str().expect("key");

        assert_eq!(
            format!("{owner} specified a key: {key}"),
            "igormuba specified a key: \
             STM5z76mjZJnTZHHZjgnFxFadTb1ztc6R7EuDgCzd6dNiv6ETB2tj"
        );
    });
}

// TS line 209: "Should be able to format witness set properties operation
// using default formatters from hive chain interface".
#[test]
fn formats_witness_set_properties() {
    wax_test(None, |ctx| {
        let formatted = ctx
            .base
            .formatter()
            .format(&serialized_witness_set_properties())
            .expect("format");

        let owner = formatted["value"]["owner"].as_str().expect("owner");
        let new_signing_key = formatted["value"]["props"]["new_signing_key"]
            .as_str()
            .expect("new_signing_key");

        assert_eq!(
            format!("{owner} set new signing key to {new_signing_key}"),
            "gtg set new signing key to \
             STM2nf9tLEWSdisd5pjocs2odhD3PvsnJTfMmK7Gm2Z2x8CvpXs1WC"
        );
    });
}

// TS line 219: "Should be able to format asset using default formatters
// from hive chain interface".
#[test]
fn formats_asset_through_display() {
    wax_test(None, |ctx| {
        let rendered =
            ctx.base.formatter().display(&nai_asset()).expect("display");

        assert_eq!(format!("Amount: {rendered}"), "Amount: 300.000 HIVE");
    });
}

// TS line 227: "Should be able to format asset using default formatters
// from hive chain interface nad keep the original object immutable".
#[test]
fn formats_asset_keeping_the_input_immutable() {
    wax_test(None, |ctx| {
        let input = json!({ "naiAsset": nai_asset() });

        let output = ctx.base.formatter().format(&input).expect("format");

        assert_eq!(input, json!({ "naiAsset": nai_asset() }));
        assert_eq!(output, json!({ "naiAsset": "300.000 HIVE" }));
    });
}

// TS line 241: "Should be able to format transaction using default
// formatters from hive chain interface".
#[test]
fn formats_transaction_as_its_id() {
    wax_test(None, |ctx| {
        let rendered = ctx
            .base
            .formatter()
            .display(&sensitive_transaction())
            .expect("display");

        assert_eq!(
            format!("Tx: #{rendered}"),
            "Tx: #3725c81634f152011e2043eb7119911b953d4267"
        );
    });
}

// TS line 251: "Should be able to format protobuf transaction using default
// formatters from hive chain interface".
#[test]
fn formats_protobuf_transaction_as_its_id() {
    wax_test(None, |ctx| {
        let rendered = ctx
            .base
            .formatter()
            .display(&sensitive_transaction_proto())
            .expect("display");

        assert_eq!(
            format!("Tx: #{rendered}"),
            "Tx: #3725c81634f152011e2043eb7119911b953d4267"
        );
    });
}

// TS line 259: "Should be able to extend formatter with custom options from
// hive chain interface".
#[test]
fn extends_formatter_with_custom_options() {
    wax_test(None, |ctx| {
        let formatter = ctx.base.formatter().extend_options(
            WaxFormatterOptions::default().with_transaction_as_id(false),
        );

        let formatted =
            formatter.format(&sensitive_transaction()).expect("format");

        assert_eq!(
            formatted,
            json!({
                "ref_block_num": 1959,
                "ref_block_prefix": 3625727107u32,
                "expiration": "2023-11-09T22:01:24",
                "operations": [{
                    "type": "transfer_operation",
                    "value": {
                        "from": "oneplus7",
                        "to": "kryptogames",
                        "amount": "300.000 HIVE", // !! Amount formatted
                        "memo": "Roll under 50 4d434bd943616",
                    }
                }],
                "extensions": [],
                "signatures": [],
            })
        );
    });
}

// TS line 290: "Should be able to retrieve account from the API and format
// it using default formatter from the hive chain interface".
//
// TS NOTE: TS fetches the raw account through the mocked
// `database_api.find_accounts`; the transport surface is covered by
// `extend_api.rs`, so this port embeds the raw response and keeps the
// formatting assertion (`initminerAccountApi` in `data.protocol.ts`) 1:1.
#[test]
fn formats_api_account() {
    wax_test(None, |ctx| {
        let auth = json!({
            "account_auths": [],
            "key_auths": [
                ["STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX", 1]
            ],
            "weight_threshold": 1,
        });
        let hive = |amount: &str| json!({ "amount": amount, "precision": 3, "nai": "@@000000021" });
        let hbd = |amount: &str| json!({ "amount": amount, "precision": 3, "nai": "@@000000013" });
        let vests = |amount: &str| json!({ "amount": amount, "precision": 6, "nai": "@@000000037" });

        let mut account = json!({
            "active": auth,
            "balance": hive("6"),
            "can_vote": true,
            "comment_count": 0,
            "created": "2016-03-24T16:00:00",
            "curation_rewards": 0,
            "delayed_votes": [],
            "delegated_vesting_shares": vests("0"),
            "downvote_manabar": { "current_mana": 0, "last_update_time": 0 },
            "governance_vote_expiration_ts": "1969-12-31T23:59:59",
            "hbd_balance": hbd("2"),
            "hbd_last_interest_payment": "1970-01-01T00:00:00",
            "hbd_seconds": "0",
            "hbd_seconds_last_update": "2016-08-11T09:57:42",
            "id": 3,
            "is_smt": false,
            "json_metadata": "",
            "last_account_recovery": "1970-01-01T00:00:00",
            "last_account_update": "1970-01-01T00:00:00",
            "last_owner_update": "1970-01-01T00:00:00",
            "last_post": "1970-01-01T00:00:00",
            "last_post_edit": "1970-01-01T00:00:00",
            "last_root_post": "1970-01-01T00:00:00",
            "last_vote_time": "1970-01-01T00:00:00",
            "lifetime_vote_count": 0,
            "memo_key": "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX",
            "mined": true,
            "name": "initminer",
            "next_vesting_withdrawal": "1969-12-31T23:59:59",
            "open_recurrent_transfers": 0,
            "owner": auth,
            "pending_claimed_accounts": 0,
            "pending_transfers": 0,
            "post_bandwidth": 0,
            "post_count": 0,
            "post_voting_power": vests("1000000000000"),
            "posting": auth,
            "posting_json_metadata": "",
            "posting_rewards": 0,
            "previous_owner_update": "1970-01-01T00:00:00",
            "proxied_vsf_votes": [0, 0, 0, 0],
            "proxy": "",
            "received_vesting_shares": vests("0"),
            "recovery_account": "",
            "reset_account": "null",
            "reward_hbd_balance": hbd("0"),
            "reward_hive_balance": hive("0"),
            "reward_vesting_balance": vests("0"),
            "reward_vesting_hive": hive("0"),
            "savings_balance": hive("0"),
            "savings_hbd_balance": hbd("0"),
            "savings_hbd_last_interest_payment": "1970-01-01T00:00:00",
            "savings_hbd_seconds": "0",
            "savings_hbd_seconds_last_update": "1970-01-01T00:00:00",
            "savings_withdraw_requests": 0,
            "to_withdraw": 0,
            "vesting_shares": vests("1000000000000"),
            "vesting_withdraw_rate": vests("0"),
            "voting_manabar": { "current_mana": 0, "last_update_time": 0 },
            "withdraw_routes": 0,
            "withdrawn": 0,
            "witnesses_voted_for": 0,
        });

        let formatted = ctx.base.formatter().format(&account).expect("format");

        // data.protocol.ts `initminerAccountApi`: the raw account with every
        // asset formatted.
        for (field, rendered) in [
            ("balance", "0.006 HIVE"),
            ("delegated_vesting_shares", "0.000000 VESTS"),
            ("hbd_balance", "0.002 HBD"),
            ("post_voting_power", "1,000,000.000000 VESTS"),
            ("received_vesting_shares", "0.000000 VESTS"),
            ("reward_hbd_balance", "0.000 HBD"),
            ("reward_hive_balance", "0.000 HIVE"),
            ("reward_vesting_balance", "0.000000 VESTS"),
            ("reward_vesting_hive", "0.000 HIVE"),
            ("savings_balance", "0.000 HIVE"),
            ("savings_hbd_balance", "0.000 HBD"),
            ("vesting_shares", "1,000,000.000000 VESTS"),
            ("vesting_withdraw_rate", "0.000000 VESTS"),
        ] {
            account[field] = json!(rendered);
        }
        assert_eq!(formatted, account);
    });
}

// TS line 302: "Should be able to format custom JSON rc delegation
// operation using default formatter from the hive chain interface".
#[test]
fn formats_rc_delegation_custom_jsons() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        let rc = ResourceCreditsOperation::new()
            .delegate(
                "initminer",
                4_127_361_273,
                vec!["gtg".into(), "null".into()],
            )
            .expect("delegate")
            .remove_delegation("initminer", vec!["null".into()])
            .expect("remove_delegation")
            .authorize(vec!["initminer".into()], vec![])
            .expect("authorize");
        tx.push_complex_operation(&ctx.base, rc)
            .expect("push_complex_operation");

        let formatted = ctx
            .base
            .formatter()
            .format(&tx.transaction().operations)
            .expect("format");

        let rc_asset = |amount: &str| json!({ "amount": amount, "precision": 6, "nai": "@@000000037" });
        assert_eq!(
            formatted,
            json!([
                {
                    "custom_json_operation": {
                        "from": "initminer",
                        "rc": rc_asset("4127361273"),
                        "delegatees": ["gtg", "null"],
                    }
                },
                {
                    "custom_json_operation": {
                        "from": "initminer",
                        "rc": rc_asset("0"),
                        "delegatees": ["null"],
                    }
                },
            ])
        );
    });
}

// TS line 343: "Should be able to format custom JSON community operation
// using default formatter from the hive chain interface".
#[test]
fn formats_community_custom_jsons() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        let community = CommunityOperation::new()
            .flag_post("mycomm", "gtg", "first-post", "note")
            .mute_post("mycomm", "gtg", "first-post", "note")
            .pin_post("mycomm", "gtg", "first-post")
            .subscribe("mycomm")
            .unmute_post("mycomm", "gtg", "first-post", "note")
            .unpin_post("mycomm", "gtg", "first-post")
            .unsubscribe("mycomm")
            .set_user_title("mycomm", "gtg", "first-post")
            .update_props(
                "mycomm",
                CommunityProps {
                    title: "Custom title".into(),
                    ..Default::default()
                },
            )
            .authorize(vec!["gtg".into()], vec![])
            .expect("authorize");
        tx.push_complex_operation(&ctx.base, community)
            .expect("push_complex_operation");

        let formatted = ctx
            .base
            .formatter()
            .format(&tx.transaction().operations)
            .expect("format");

        let entry = |data: Value| {
            json!({
                "custom_json_operation": {
                    "accounts": ["gtg"],
                    "community": "mycomm",
                    "data": data,
                }
            })
        };
        let post_action = |action: &str, notes: Option<&str>| match notes {
            Some(notes) => json!({
                "action": action,
                "account": "gtg",
                "permlink": "first-post",
                "notes": notes,
            }),
            None => json!({
                "action": action,
                "account": "gtg",
                "permlink": "first-post",
            }),
        };

        assert_eq!(
            formatted,
            json!([
                entry(post_action("flagPost", Some("note"))),
                entry(post_action("mutePost", Some("note"))),
                entry(post_action("pinPost", None)),
                entry(json!({ "action": "subscribe" })),
                entry(post_action("unmutePost", Some("note"))),
                entry(post_action("unpinPost", None)),
                entry(json!({ "action": "unsubscribe" })),
                entry(json!({
                    "action": "setUserTitle",
                    "account": "gtg",
                    "title": "first-post",
                })),
                entry(json!({
                    "action": "updateProps",
                    "props": {
                        "about": "",
                        "description": "",
                        "title": "Custom title",
                        "flag_text": "",
                        "is_nsfw": false,
                        "lang": "en",
                    },
                })),
            ])
        );
    });
}

// TS line 496: "Should be able to format custom JSON follow operation using
// default formatter from the hive chain interface".
#[test]
fn formats_follow_custom_jsons() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        let follow = FollowOperation::new()
            .follow_blacklist_blog(
                "initminer",
                vec!["gtg".into(), "null".into()],
            )
            .expect("follow_blacklist_blog")
            .follow_muted_blog("initminer", vec!["gtg".into()])
            .expect("follow_muted_blog")
            .reset_all_blog("initminer", vec!["gtg".into(), "null".into()])
            .expect("reset_all_blog")
            .reset_blacklist_blog("initminer", vec!["gtg".into()])
            .expect("reset_blacklist_blog")
            .reset_follow_blacklist_blog(
                "initminer",
                vec!["gtg".into(), "null".into()],
            )
            .expect("reset_follow_blacklist_blog")
            .reset_follow_muted_blog("initminer", vec!["gtg".into()])
            .expect("reset_follow_muted_blog")
            .unblacklist_blog("initminer", vec!["gtg".into(), "null".into()])
            .expect("unblacklist_blog")
            .unfollow_blacklist_blog("initminer", vec!["gtg".into()])
            .expect("unfollow_blacklist_blog")
            .unfollow_blog("initminer", vec!["gtg".into(), "null".into()])
            .expect("unfollow_blog")
            .unfollow_muted_blog("initminer", vec!["gtg".into()])
            .expect("unfollow_muted_blog")
            .reblog("initminer", "gtg", "first-post")
            .authorize(vec!["initminer".into()], vec![])
            .expect("authorize");
        tx.push_complex_operation(&ctx.base, follow)
            .expect("push_complex_operation");

        let formatted = ctx
            .base
            .formatter()
            .format(&tx.transaction().operations)
            .expect("format");

        let follow_entry = |action: &str, following: Value| {
            json!({
                "custom_json_operation": {
                    "action": action,
                    "follower": "initminer",
                    "following": following,
                }
            })
        };

        assert_eq!(
            formatted,
            json!([
                follow_entry("follow_blacklist", json!(["gtg", "null"])),
                follow_entry("follow_muted", json!(["gtg"])),
                follow_entry("reset_all_lists", json!(["gtg", "null"])),
                follow_entry("reset_blacklist", json!(["gtg"])),
                follow_entry("reset_follow_blacklist", json!(["gtg", "null"])),
                follow_entry("reset_follow_muted_list", json!(["gtg"])),
                follow_entry("unblacklist", json!(["gtg", "null"])),
                follow_entry("unfollow_blacklist", json!(["gtg"])),
                follow_entry("", json!(["gtg", "null"])),
                follow_entry("unfollow_muted", json!(["gtg"])),
                json!({
                    "custom_json_operation": {
                        "account": "initminer",
                        "author": "gtg",
                        "permlink": "first-post",
                    }
                }),
            ])
        );
    });
}

// TS line 618: "Should be able to format values using custom formatters
// extended from hive chain interface".
#[derive(Default)]
struct MyFormatters;

#[hive_formatter]
impl MyFormatters {
    fn my_function(&self, value: i64) -> String {
        value.to_string()
    }

    #[format(rename = "myCustomProp")]
    fn my_custom_prop(
        &self,
        _ctx: &FormatContext<'_>,
        source: Value,
    ) -> Option<String> {
        Some(self.my_function(source.get("myCustomProp")?.as_i64()?))
    }
}

#[test]
fn formats_values_using_custom_formatters() {
    wax_test(None, |ctx| {
        let formatter = ctx.base.formatter().extend::<MyFormatters>();
        let data = json!({ "myCustomProp": 12542 });

        let rendered = formatter.display(&data).expect("display");

        assert_eq!(format!("MyData: {rendered}"), "MyData: 12542");
    });
}

// TS line 641: "Should be able to format values using custom formatters
// extended from hive chain interface and require defined values".
//
// TS NOTE: the TS fixture holds `undefined` property values, which JSON
// cannot express — `null` is the `require_defined` equivalent here.
#[derive(Default)]
struct RequireDefinedFormatters;

#[hive_formatter]
impl RequireDefinedFormatters {
    #[format(match_property = "requiredProperty", require_defined)]
    fn required_property_formatter(
        &self,
        _ctx: &FormatContext<'_>,
        _source: Value,
    ) -> Option<String> {
        panic!("This should not be called");
    }

    #[format(match_property = "undefinedProperty")]
    fn undefined_property_formatter(
        &self,
        _ctx: &FormatContext<'_>,
        source: Value,
    ) -> Option<&'static str> {
        source
            .get("undefinedProperty")?
            .is_null()
            .then_some("This should be called")
    }
}

#[test]
fn requires_defined_values_when_asked() {
    wax_test(None, |ctx| {
        let formatter =
            ctx.base.formatter().extend::<RequireDefinedFormatters>();
        let data = json!({
            "requiredProperty": null,
            "undefinedProperty": null,
        });

        let rendered = formatter.display(&data).expect("display");

        assert_eq!(
            format!("Result: {rendered}"),
            "Result: This should be called"
        );
    });
}

// TS line 667: "Should be able to match values on properties using custom
// formatters extended from hive chain interface".
struct OperationsFormatter {
    wax: FoundationHandle,
}

#[hive_formatter]
impl OperationsFormatter {
    fn new(wax: FoundationHandle) -> Self {
        Self { wax }
    }

    #[format(match_property = "type", match_value = "transfer_operation")]
    fn transfer_operation_formatter(
        &self,
        _ctx: &FormatContext<'_>,
        source: Value,
    ) -> Option<String> {
        let value = source.get("value")?;
        let amount = self.wax.formatter().display(value.get("amount")?).ok()?;

        Some(format!(
            "{} transferred {amount} to {}",
            value.get("from")?.as_str()?,
            value.get("to")?.as_str()?,
        ))
    }

    #[format(match_property = "type", match_value = "vote_operation")]
    fn vote_operation_formatter(
        &self,
        _ctx: &FormatContext<'_>,
        source: Value,
    ) -> Option<String> {
        let value = source.get("value")?;

        Some(format!(
            "{} voted on @{}/{}",
            value.get("voter")?.as_str()?,
            value.get("author")?.as_str()?,
            value.get("permlink")?.as_str()?,
        ))
    }
}

#[test]
fn matches_values_on_properties() {
    wax_test(None, |ctx| {
        let formatter = ctx.base.formatter().extend::<OperationsFormatter>();
        let ops = json!([transfer_operation(), vote_operation()]);

        let formatted = formatter.format(&ops).expect("format");

        assert_eq!(
            formatted,
            json!([
                "oneplus7 transferred 300.000 HIVE to kryptogames",
                "otom voted on @c0ff33a/ewxhnjbj",
            ])
        );
    });
}

// TS line 693: "Should be able to match instances of the hive apps
// operations using custom formatters extended from hive chain interface".
#[test]
#[ignore = "matchInstanceOf does not port: after serde serialization no \
            type identity is left in the tree, so rules cannot compose \
            through runtime types — see formatters_diff.md, gap #1"]
fn matches_instances_of_hive_apps_operations() {}
