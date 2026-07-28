//! The tree-rewriting engine: the bottom-up walk applying registered match
//! rules to a `serde_json::Value` tree.
//!
//! Ports `rawDataParser` / `traverseTemplateValue` / `handleProperty` from
//! `ts/wasm/lib/detailed/formatters/{base,waxify}.ts`: a rule matching a
//! property replaces the object *containing* that property in the working
//! tree, while the pristine source stays untouched.

use serde_json::{Map, Value};

use super::options::WaxFormatterOptions;
use super::registry::{FormatContext, FormatterRegistry};

/// Formats `value` through the registered rules, returning the rewritten
/// tree. Mirrors TS `rawDataParser`.
///
/// NOTE: at the top level the FIRST match replaces the whole result and
/// ends the walk (TS returns from inside its key loop); nested containers
/// keep iterating and the LAST match wins — both quirks are preserved.
pub(crate) fn format_value(
    registry: &FormatterRegistry,
    options: &WaxFormatterOptions,
    value: &Value,
) -> Value {
    match value {
        Value::Object(map) => {
            let mut target = Value::Object(map.clone());
            for (key, child) in map {
                target[key] = format_child(registry, options, child);

                let matched =
                    handle_property(registry, options, value, &target, key);
                if let Some(result) = matched {
                    return result;
                }
            }

            target
        }
        Value::Array(items) => format_array(registry, options, items),
        other => other.clone(),
    }
}

/// Recursively formats one nested node, returning the node with its
/// children formatted plus the replacement produced by rules matching the
/// node's own properties (if any). Mirrors TS `traverseTemplateValue`.
fn transform(
    registry: &FormatterRegistry,
    options: &WaxFormatterOptions,
    node: &Value,
) -> (Value, Option<Value>) {
    match node {
        Value::Object(map) => transform_object(registry, options, node, map),
        Value::Array(items) => (format_array(registry, options, items), None),
        other => (other.clone(), None),
    }
}

/// Formats a nested object's children in place and collects the
/// replacement produced by rules matching its properties.
fn transform_object(
    registry: &FormatterRegistry,
    options: &WaxFormatterOptions,
    node: &Value,
    map: &Map<String, Value>,
) -> (Value, Option<Value>) {
    let mut target = Value::Object(map.clone());
    let mut replacement: Option<Value> = None;
    for (key, child) in map {
        target[key] = format_child(registry, options, child);

        let matched = handle_property(registry, options, node, &target, key);
        if let Some(result) = matched {
            store_replacement(&mut replacement, result);
        }
    }

    (target, replacement)
}

/// Formats one child node, collapsing a produced replacement into the
/// returned value.
fn format_child(
    registry: &FormatterRegistry,
    options: &WaxFormatterOptions,
    node: &Value,
) -> Value {
    let (target, replacement) = transform(registry, options, node);
    replacement.unwrap_or(target)
}

/// Formats array elements.
///
/// TS NOTE: TS walks arrays as objects with index keys; index-keyed
/// property matchers are not supported here, elements just recurse.
fn format_array(
    registry: &FormatterRegistry,
    options: &WaxFormatterOptions,
    items: &[Value],
) -> Value {
    Value::Array(
        items
            .iter()
            .map(|item| format_child(registry, options, item))
            .collect(),
    )
}

/// Applies a match result to the pending node replacement.
///
/// TS NOTE: the `Object.isExtensible(target[key])` gate — once a match
/// replaced the container with a primitive, later matches on sibling keys
/// are not applied.
fn store_replacement(replacement: &mut Option<Value>, result: Value) {
    let locked = matches!(replacement, Some(current) if !is_container(current));
    if !locked {
        *replacement = Some(result);
    }
}

/// Runs the matcher registered for `property` (if any) against the
/// containing `source` object. Mirrors TS `handleProperty`.
fn handle_property(
    registry: &FormatterRegistry,
    options: &WaxFormatterOptions,
    source: &Value,
    target: &Value,
    property: &str,
) -> Option<Value> {
    let matched = registry.matchers.get(property)?;
    let property_value = source.get(property)?;

    let format = matched
        .match_values
        .iter()
        .find(|(candidate, _)| candidate == property_value)
        .map(|(_, format)| format)
        .or(matched.default_formatter.as_ref())?;

    if matched.require_defined && property_value.is_null() {
        return None;
    }

    format(&FormatContext {
        options,
        source,
        target,
    })
}

fn is_container(value: &Value) -> bool {
    value.is_object() || value.is_array()
}
