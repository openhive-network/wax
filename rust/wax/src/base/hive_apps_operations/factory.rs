//! Shared base for "hive apps" custom-JSON operation builders.
//!
//! Mirrors the abstract `HiveAppsOperation` class from
//! `ts/wasm/lib/detailed/hive_apps_operations/factory.ts`. Rust expresses
//! the same "inherited" `authorize` / `finalize` plumbing via a base struct
//! (`HiveAppsOperationBase`) embedded by each concrete builder, plus a
//! trait (`HiveAppsOperation`) with a default `authorize` implementation.

use crate::core::proto;

use crate::WaxError;
use crate::base::models::basic::AccountName;

/// Represents the shared state for any "hive apps" custom-JSON operation
/// builder: the on-wire `id`, the in-progress (yet-to-be-authorized) body
/// entries, and the authorized [`proto::CustomJson`] ops.
///
/// TS NOTE: mirrors the field set of the abstract `HiveAppsOperation`
/// class. `body` is `pub(crate)` — the Rust analogue of TS `protected` —
/// so concrete builders in this crate push staged entries onto it
/// directly, the way TS subclasses do (`this.body.push([...])`). Each entry
/// stages its body pre-serialized: the builders serialize typed structs
/// whose field order matches the TS insertion order, keeping the payload
/// bytes identical to `JSON.stringify` (`serde_json`'s `Value` would
/// reorder keys alphabetically).
#[derive(Debug, Clone)]
pub struct HiveAppsOperationBase {
    id: &'static str,
    pub(crate) body: Vec<(&'static str, String)>,
    ops: Vec<proto::CustomJson>,
}

impl HiveAppsOperationBase {
    /// Constructs a new base bound to the given on-wire `id`
    /// (`follow`, `community`, `rc`, ...).
    pub fn new(id: &'static str) -> Self {
        Self {
            id,
            body: Vec::new(),
            ops: Vec::new(),
        }
    }

    /// Commits every currently-staged entry as its own
    /// [`proto::CustomJson`] carrying the given authorities, then drains
    /// the stage so the builder can be reused.
    ///
    /// TS NOTE: matches `HiveAppsOperation.authorize` in factory.ts — at
    /// least one of the two authority lists must be non-empty.
    pub fn authorize(
        &mut self,
        required_posting_auths: Vec<AccountName>,
        required_auths: Vec<AccountName>,
    ) -> Result<(), WaxError> {
        if required_posting_auths.is_empty() && required_auths.is_empty() {
            return Err(WaxError::MissingAuthority);
        }

        for (action, body) in self.body.drain(..) {
            // Wire form is `[tag, body]` — a heterogenous JSON array,
            // matching TS `JSON.stringify(body)` where `body = [action, data]`.
            // `body` is already valid JSON (serialized at stage time), so
            // composing the two fragments textually is escape-safe.
            let action_json = serde_json::to_string(action).map_err(|e| {
                WaxError::new(format!(
                    "failed to serialize hive-apps action: {e}"
                ))
            })?;
            let json = format!("[{action_json},{body}]");

            self.ops.push(proto::CustomJson {
                id: self.id.into(),
                json,
                required_auths: required_auths.clone(),
                required_posting_auths: required_posting_auths.clone(),
            });
        }

        Ok(())
    }

    /// Wraps every authorized [`proto::CustomJson`] in a
    /// [`proto::Operation`] for handoff to a transaction.
    pub fn finalize(self) -> Vec<proto::Operation> {
        self.ops
            .into_iter()
            .map(|cj| proto::Operation {
                value: Some(proto::operation::Value::CustomJsonOperation(cj)),
            })
            .collect()
    }
}

/// Provides the chaining `authorize` method (with a default
/// implementation) for any builder that embeds a [`HiveAppsOperationBase`].
/// Import this trait to call `.authorize(...)` on a concrete builder.
///
/// TS NOTE: mirrors the public surface of the abstract `HiveAppsOperation`
/// class. Rust composes shared state via a base struct + trait instead of
/// TS-style class inheritance.
pub trait HiveAppsOperation: Sized {
    /// Mutable access to the embedded base — drives the default
    /// `authorize` implementation.
    fn base_mut(&mut self) -> &mut HiveAppsOperationBase;

    /// Commits every currently-staged entry as its own
    /// `custom_json_operation` carrying the given authorities.
    fn authorize(
        mut self,
        required_posting_auths: Vec<AccountName>,
        required_auths: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.base_mut()
            .authorize(required_posting_auths, required_auths)?;
        Ok(self)
    }
}
