use std::sync::Arc;

use serde::Serialize;
use serde_json::{Value, json};

use crate::base::result::WitnessSetPropertiesProps;
use crate::{WaxFoundation, create_wax_foundation, hive_formatter, proto};

use super::*;

fn foundation() -> WaxFoundation {
    create_wax_foundation(None)
}

fn hive(amount: &str) -> Value {
    json!({ "amount": amount, "precision": 3, "nai": "@@000000021" })
}

// ---------------------------------------------------------------- defaults

#[test]
fn formats_nai_assets_with_the_default_rule() {
    let foundation = foundation();
    let formatter = foundation.formatter();

    let formatted = formatter.format(&hive("1100")).unwrap();

    assert_eq!(formatted, json!("1.100 HIVE"));
}

#[test]
fn formats_nested_assets_and_leaves_the_rest() {
    let foundation = foundation();
    let formatter = foundation.formatter();

    let formatted = formatter
        .format(&json!({ "name": "alice", "balance": hive("1100") }))
        .unwrap();

    assert_eq!(
        formatted,
        json!({ "name": "alice", "balance": "1.100 HIVE" })
    );
}

#[test]
fn groups_large_asset_amounts() {
    let foundation = foundation();
    let formatter = foundation.formatter();

    let formatted = formatter.format(&hive("100000000100")).unwrap();

    assert_eq!(formatted, json!("100,000,000.100 HIVE"));
}

#[test]
fn asset_options_disable_each_formatting_step() {
    let foundation = foundation();
    let formatter = foundation.formatter();

    let as_nai = formatter.extend_options(WaxFormatterOptions {
        asset: AssetFormatterOptions {
            display_as_nai: true,
            ..Default::default()
        },
        ..Default::default()
    });
    assert_eq!(as_nai.format(&hive("1100")).unwrap(), hive("1100"));

    let bare = formatter.extend_options(WaxFormatterOptions {
        asset: AssetFormatterOptions {
            append_token_name: false,
            format_amount: false,
            ..Default::default()
        },
        ..Default::default()
    });
    assert_eq!(bare.format(&hive("1100")).unwrap(), json!("1.100"));
}

#[test]
fn formats_transactions_as_their_id() {
    let foundation = foundation();
    let mut tx = foundation
        .create_transaction_with_tapos(&"00".repeat(20), "2023-08-01T12:00:00")
        .unwrap();
    tx.push_operation(foundation.create_operation(
        proto::operation::Value::VoteOperation(proto::Vote {
            voter: "alice".into(),
            author: "bob".into(),
            permlink: "post".into(),
            weight: 100,
        }),
    ));
    let id = tx.id().unwrap();

    let formatter = foundation.formatter();

    // API form: `{type, value}` operation envelopes.
    let api_json = tx.to_api_json().unwrap();
    assert_eq!(formatter.format(&api_json).unwrap(), json!(id.clone()));

    // Proto form: operations keyed by their oneof name.
    let proto_json = serde_json::to_value(tx.transaction()).unwrap();
    assert_eq!(formatter.format(&proto_json).unwrap(), json!(id));

    // Disabled → the transaction object passes through.
    let disabled = formatter.extend_options(WaxFormatterOptions {
        transaction: TransactionFormatterOptions {
            display_as_id: false,
        },
        ..Default::default()
    });
    assert!(disabled.format(&api_json).unwrap().is_object());
}

#[test]
fn decodes_rc_delegations() {
    let foundation = foundation();
    let formatter = foundation.formatter();

    let operation = json!({
        "id": "rc",
        "json": r#"["delegate_rc",{"from":"alice","delegatees":["bob","carol"],"max_rc":"5000000000"}]"#,
        "required_auths": [],
        "required_posting_auths": ["alice"],
    });

    assert_eq!(
        formatter.format(&operation).unwrap(),
        json!({
            "from": "alice",
            "rc": {
                "amount": "5000000000",
                "precision": 6,
                "nai": "@@000000037",
            },
            "delegatees": ["bob", "carol"],
        })
    );
}

#[test]
fn decodes_community_operations() {
    let foundation = foundation();
    let formatter = foundation.formatter();

    let operation = json!({
        "id": "community",
        "json": r#"["subscribe",{"community":"hive-111111"}]"#,
        "required_auths": [],
        "required_posting_auths": ["alice"],
    });

    assert_eq!(
        formatter.format(&operation).unwrap(),
        json!({
            "accounts": ["alice"],
            "community": "hive-111111",
            "data": { "action": "subscribe" },
        })
    );
}

#[test]
fn decodes_follow_and_reblog_operations() {
    let foundation = foundation();
    let formatter = foundation.formatter();

    let reblog = json!({
        "id": "follow",
        "json": r#"["reblog",{"account":"alice","author":"bob","permlink":"post"}]"#,
        "required_auths": [],
        "required_posting_auths": ["alice"],
    });
    assert_eq!(
        formatter.format(&reblog).unwrap(),
        json!({ "account": "alice", "author": "bob", "permlink": "post" })
    );

    let follow = json!({
        "id": "follow",
        "json": r#"["follow",{"follower":"alice","following":"bob","what":["blog"]}]"#,
        "required_auths": [],
        "required_posting_auths": ["alice"],
    });
    assert_eq!(
        formatter.format(&follow).unwrap(),
        json!({ "action": "blog", "follower": "alice", "following": ["bob"] })
    );
}

#[test]
fn malformed_custom_json_passes_through() {
    let foundation = foundation();
    let formatter = foundation.formatter();

    let operation = json!({
        "id": "rc",
        "json": "not json",
        "required_auths": [],
        "required_posting_auths": ["alice"],
    });

    assert_eq!(formatter.format(&operation).unwrap(), operation);
}

#[test]
fn deserializes_witness_props_in_both_wire_forms() {
    let foundation = foundation();
    let props = foundation
        .serialize_witness_props(&WitnessSetPropertiesProps {
            key: "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh"
                .to_string(),
            new_signing_key: None,
            account_creation_fee: None,
            url: Some("https://example.com".to_string()),
            hbd_exchange_rate: None,
            maximum_block_size: Some(65_536),
            hbd_interest_rate: None,
            account_subsidy_budget: None,
            account_subsidy_decay: None,
        })
        .unwrap();
    let expected = json!({
        "extensions": [],
        "owner": "alice",
        "props": {
            "key": "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh",
            "url": "https://example.com",
            "maximum_block_size": 65_536,
        },
    });

    let formatter = foundation.formatter();

    // Protobuf form: `name → hex` map.
    let map_form = json!({
        "owner": "alice",
        "props": props,
        "extensions": [],
    });
    assert_eq!(formatter.format(&map_form).unwrap(), expected);

    // API form: `[name, hex]` pairs.
    let pairs: Vec<(&String, &String)> = props.iter().collect();
    let pair_form = json!({
        "owner": "alice",
        "props": pairs,
        "extensions": [],
    });
    assert_eq!(formatter.format(&pair_form).unwrap(), expected);

    // No `owner` → not a witness_set_properties carrier.
    let unrelated = json!({ "props": props });
    assert_eq!(formatter.format(&unrelated).unwrap(), unrelated);
}

// -------------------------------------------------------- display + number

#[test]
fn display_renders_strings_verbatim_and_objects_as_json() {
    let foundation = foundation();
    let formatter = foundation.formatter();

    let text = formatter.display(&hive("1100")).unwrap();
    assert_eq!(text.to_string(), "1.100 HIVE");

    let object = formatter.display(&json!({ "a": 1 })).unwrap();
    assert_eq!(object.to_string(), r#"{"a":1}"#);
}

#[test]
fn formats_numbers_like_the_ts_helper() {
    let foundation = foundation();
    let formatter = foundation.formatter();

    assert_eq!(formatter.format_number("1234567", None), "1,234,567");
    assert_eq!(formatter.format_number("1234.5", 3), "1,234.500");
    assert_eq!(formatter.format_number("-1234.567", 2), "-1,234.56");
    assert_eq!(formatter.format_number("0.5", 0), "0");
    assert_eq!(formatter.format_number("007", None), "7");
    assert_eq!(formatter.format_number("12", 2), "12.00");
    assert_eq!(formatter.format_number(42, None), "42");
    assert_eq!(formatter.format_number(f64::NAN, 3), "0.000");
    // NOTE: TS throws from `BigInt` here; the Rust port passes through.
    assert_eq!(formatter.format_number("abc", None), "abc");
}

// ------------------------------------------------------------------ extend

#[derive(Default)]
struct UppercaseVoters;

#[hive_formatter]
impl UppercaseVoters {
    /// Replaces any object carrying a `voter` property.
    #[format]
    fn voter(&self, _ctx: &FormatContext<'_>, source: Value) -> Option<String> {
        Some(format!(
            "@{}",
            source.get("voter")?.as_str()?.to_uppercase()
        ))
    }
}

struct WaxAware {
    wax: FoundationHandle,
}

#[hive_formatter]
impl WaxAware {
    fn new(wax: FoundationHandle) -> Self {
        Self { wax }
    }

    /// Matches the camelCase property a snake_case method cannot spell.
    #[format(rename = "myCustomProp")]
    fn my_custom_prop(
        &self,
        _ctx: &FormatContext<'_>,
        source: Value,
    ) -> Option<String> {
        Some(format!(
            "v{}: {}",
            self.wax.get_version(),
            source.get("myCustomProp")?
        ))
    }

    /// Fires only on `kind == 2`, and only when `note` is not null.
    #[format(match_property = "kind", match_value = 2, require_defined)]
    fn kind_two(
        &self,
        _ctx: &FormatContext<'_>,
        _source: Value,
    ) -> Option<&'static str> {
        Some("second kind")
    }
}

#[test]
fn extends_with_macro_generated_formatters() {
    let foundation = foundation();
    let formatter = foundation.formatter().extend::<UppercaseVoters>();

    let vote = json!({ "voter": "alice", "author": "bob", "weight": 1 });
    assert_eq!(formatter.format(&vote).unwrap(), json!("@ALICE"));

    // The base formatter is unaffected (extend is immutable).
    assert_eq!(foundation.formatter().format(&vote).unwrap(), vote);
}

// The README example's access path: the formatter is reachable on a chain
// through its foundation `Deref`.
#[test]
fn formatter_is_reachable_through_a_chain() {
    let chain = crate::create_hive_chain(None).unwrap();
    let formatter = chain.formatter().extend::<UppercaseVoters>();

    assert_eq!(
        formatter.format(&json!({ "voter": "x" })).unwrap(),
        json!("@X")
    );
}

#[test]
fn macro_supports_new_rename_match_value_and_require_defined() {
    let foundation = foundation();
    let formatter = foundation.formatter().extend::<WaxAware>();

    let renamed = formatter
        .format(&json!({ "myCustomProp": 12_542 }))
        .unwrap();
    assert_eq!(
        renamed,
        json!(format!("v{}: 12542", foundation.get_version()))
    );

    assert_eq!(
        formatter.format(&json!({ "kind": 2 })).unwrap(),
        json!("second kind")
    );
    let other_kind = json!({ "kind": 3 });
    assert_eq!(formatter.format(&other_kind).unwrap(), other_kind);
    let null_kind = json!({ "kind": null });
    assert_eq!(formatter.format(&null_kind).unwrap(), null_kind);
}

#[derive(Default)]
struct NaiOverride;

#[hive_formatter]
impl NaiOverride {
    /// Overrides the default asset rule.
    #[format]
    fn nai(
        &self,
        _ctx: &FormatContext<'_>,
        _source: Value,
    ) -> Option<&'static str> {
        Some("<asset>")
    }
}

#[test]
fn extension_rules_override_the_defaults() {
    let foundation = foundation();
    let formatter = foundation.formatter().extend::<NaiOverride>();

    assert_eq!(formatter.format(&hive("1100")).unwrap(), json!("<asset>"));
}

#[test]
fn options_builder_configures_derived_formatters() {
    let foundation = foundation();
    let formatter = foundation.formatter().extend_options(
        WaxFormatterOptions::default()
            .with_separators(".", ",")
            .with_append_token_name(false),
    );

    assert_eq!(
        formatter.format(&hive("100000000100")).unwrap(),
        json!("100.000.000,100")
    );

    // Deriving from the current options keeps earlier settings as the base.
    let with_token = formatter.extend_options(
        formatter.options().clone().with_append_token_name(true),
    );
    assert_eq!(
        with_token.format(&hive("1100")).unwrap(),
        json!("1,100 HIVE")
    );

    let as_nai = formatter
        .extend_options(formatter.options().clone().with_display_as_nai(true));
    assert_eq!(as_nai.format(&hive("1100")).unwrap(), hive("1100"));

    let raw = WaxFormatter::new(
        Arc::new(create_wax_foundation(None)),
        WaxFormatterOptions::default().with_default_formatters(false),
    );
    assert_eq!(raw.format(&hive("1100")).unwrap(), hive("1100"));
}

#[test]
fn disabling_default_formatters_leaves_data_untouched() {
    let formatter = WaxFormatter::new(
        Arc::new(create_wax_foundation(None)),
        WaxFormatterOptions {
            create_default_formatters: false,
            ..Default::default()
        },
    );

    assert_eq!(formatter.format(&hive("1100")).unwrap(), hive("1100"));
}

// --------------------------------------------------------- instance rules

#[derive(Serialize)]
struct Tagged(u32);

struct TaggedFormatter;

impl CustomFormatter for TaggedFormatter {
    fn create(_wax: FoundationHandle) -> Self {
        Self
    }

    fn register(self: &Arc<Self>, registry: &mut FormatterRegistry) {
        registry.register_instance(
            |_options: &WaxFormatterOptions, value: &Tagged| {
                Some(format!("tagged:{}", value.0))
            },
        );
    }
}

#[test]
fn instance_rules_match_the_typed_root_input() {
    let foundation = foundation();
    let formatter = foundation.formatter().extend::<TaggedFormatter>();

    assert_eq!(formatter.format(&Tagged(7)).unwrap(), json!("tagged:7"));
    // Other types fall through to the tree walk.
    assert_eq!(formatter.format(&json!(7)).unwrap(), json!(7));
}
