//! The default wax formatting rules, registered on every
//! [`WaxFormatter`](super::formatter::WaxFormatter) unless
//! `create_default_formatters` is disabled.
//!
//! Ports `DefaultFormatters` from
//! `ts/wasm/lib/detailed/formatters/default_formatters.ts`. The hive-apps
//! rules are thin display wrappers over the decode parsers in
//! `base/hive_apps_operations` (see `formatters.md`, "Decode split").
//!
//! NOTE: where the TS rules let a malformed payload throw out of `waxify`
//! (assets, transactions), the Rust rules skip and leave the node
//! unchanged instead.

use std::collections::HashMap;
use std::sync::Arc;

use serde::Serialize;
use serde::de::DeserializeOwned;
use serde_json::{Value, json};

use crate::base::hive_apps_operations::{
    CommunityOperationData, FollowOperationData, ReblogOperationData,
    ResourceCreditsOperationData,
};
use crate::base::models::asset::NaiAsset;
use crate::core::proto;

use super::formatter::{FoundationHandle, format_number_with};
use super::registry::{
    CustomFormatter, FormatContext, FormatterRegistry, MatchRule,
};

/// Provides the default wax formatting rules: NAI assets, transactions as
/// ids, hive-apps `custom_json` payloads and witness properties.
pub struct DefaultFormatters {
    wax: FoundationHandle,
}

impl CustomFormatter for DefaultFormatters {
    fn create(wax: FoundationHandle) -> Self {
        Self { wax }
    }

    fn register(self: &Arc<Self>, registry: &mut FormatterRegistry) {
        self.bind(registry, MatchRule::property("nai"), Self::format_asset);
        self.bind(
            registry,
            MatchRule::property("operations"),
            Self::format_transaction,
        );
        self.bind(
            registry,
            MatchRule::property("props"),
            Self::format_witness_props,
        );

        registry.register(
            MatchRule::property_value("id", "rc"),
            |_ctx: &FormatContext<'_>, source: proto::CustomJson| {
                ResourceCreditsOperationData::try_from(&source).ok()
            },
        );
        registry.register(
            MatchRule::property_value("id", "community"),
            |_ctx: &FormatContext<'_>, source: proto::CustomJson| {
                CommunityOperationData::try_from(&source).ok()
            },
        );
        registry.register(
            MatchRule::property_value("id", "follow"),
            |_ctx: &FormatContext<'_>, source: proto::CustomJson| {
                // Try the reblog shape first, then the follow shape.
                let reblog = ReblogOperationData::try_from(&source)
                    .ok()
                    .and_then(|data| serde_json::to_value(data).ok());

                reblog.or_else(|| {
                    FollowOperationData::try_from(&source)
                        .ok()
                        .and_then(|data| serde_json::to_value(data).ok())
                })
            },
        );
    }
}

impl DefaultFormatters {
    /// Registers `method` bound to this instance — the closure step
    /// `#[hive_formatter]` generates, done by hand for the built-in rules.
    fn bind<T, R>(
        self: &Arc<Self>,
        registry: &mut FormatterRegistry,
        rule: MatchRule,
        method: fn(&Self, &FormatContext<'_>, T) -> Option<R>,
    ) where
        T: DeserializeOwned + 'static,
        R: Serialize + 'static,
    {
        let this = Arc::clone(self);
        registry.register(rule, move |ctx: &FormatContext<'_>, source| {
            method(&this, ctx, source)
        });
    }

    /// TS `assetFormatter`: renders a NAI asset in its human-readable form,
    /// honoring the asset options.
    fn format_asset(
        &self,
        ctx: &FormatContext<'_>,
        source: NaiAsset,
    ) -> Option<Value> {
        // NAI mode: leave the raw asset object in place.
        if ctx.options.asset.display_as_nai {
            return None;
        }

        let data = self.wax.get_asset(&source).ok()?;
        let amount = if ctx.options.asset.format_amount {
            format_number_with(
                &data.amount,
                None,
                &ctx.options.asset.separators,
            )
        } else {
            data.amount
        };

        if ctx.options.asset.append_token_name {
            return Some(Value::String(format!("{amount} {}", data.symbol)));
        }

        Some(Value::String(amount))
    }

    /// TS `transactionFormatter`: replaces a transaction object (API or
    /// proto shape) with its transaction id.
    fn format_transaction(
        &self,
        ctx: &FormatContext<'_>,
        source: Value,
    ) -> Option<Value> {
        if !ctx.options.transaction.display_as_id {
            return None;
        }

        let operations = source.get("operations")?.as_array()?;
        let extensions = source.get("extensions").and_then(Value::as_array);
        // The API form carries `{type, value}` envelopes on the first
        // operation or extension.
        let api_form = operations
            .first()
            .is_some_and(|op| op.get("type").is_some())
            || extensions.is_some_and(|extensions| {
                extensions
                    .first()
                    .is_some_and(|extension| extension.get("type").is_some())
            });

        let transaction = if api_form {
            self.wax
                .create_transaction_from_json(&source.to_string())
                .ok()?
        } else {
            let transaction =
                serde_json::from_value::<proto::Transaction>(source).ok()?;
            self.wax.create_transaction_from_proto(transaction).ok()?
        };

        Some(Value::String(transaction.id().ok()?))
    }

    /// TS `witnessSetPropertiesPropsFormatter`: rewrites a
    /// `witness_set_properties` operation with its packed props
    /// deserialized into structured values.
    fn format_witness_props(
        &self,
        _ctx: &FormatContext<'_>,
        source: Value,
    ) -> Option<Value> {
        // Objects without `owner` are not witness_set_properties carriers.
        let owner = source.get("owner")?;

        let mut props: HashMap<String, String> = HashMap::new();
        match source.get("props")? {
            // API form: an array of `[name, hex]` pairs.
            Value::Array(entries) => {
                for entry in entries {
                    let pair = entry.as_array()?;
                    props.insert(
                        pair.first()?.as_str()?.to_string(),
                        pair.get(1)?.as_str()?.to_string(),
                    );
                }
            }
            // Protobuf form: a `name → hex` map.
            Value::Object(entries) => {
                for (name, packed) in entries {
                    props.insert(name.clone(), packed.as_str()?.to_string());
                }
            }
            _ => return None,
        }

        let deserialized = self.wax.deserialize_witness_props(&props).ok()?;

        Some(json!({
            "extensions": source.get("extensions").cloned()
                .unwrap_or_else(|| json!([])),
            "owner": owner,
            "props": serde_json::to_value(deserialized).ok()?,
        }))
    }
}
