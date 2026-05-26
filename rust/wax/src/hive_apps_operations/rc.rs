//! Builder for the Resource Credits "hive apps" operation.
//!
//! Mirrors `ResourceCreditsOperation` from
//! `ts/wasm/lib/detailed/hive_apps_operations/rc.ts` and Python
//! `wax/wax/hive_apps_operations/rc.py`. Builds one `custom_json_operation`
//! per `authorize` call from any staged `delegate_rc` entries, with `id="rc"`.
//!
//! Lives under `complex_operations` rather than its own `hive_apps_operations`
//! module per the precedent set in `formatters::data` — the parser side is
//! already there.

use serde::Serialize;
use wax_core::proto;

use crate::WaxError;
use crate::foundation::WaxFoundation;
use crate::interfaces::OperationBuilder;
use crate::models::basic::AccountName;

const OPERATION_ID: &str = "rc";
const DELEGATE_RC_TAG: &str = "delegate_rc";

/// Body of a single staged `delegate_rc` entry. Field order matters — the
/// JSON output is wire-compared against the TS `JSON.stringify` shape in
/// `ts/wasm/__tests__/detailed/custom_jsons.ts`:
/// `{"from":...,"delegatees":[...],"max_rc":"...","extensions":[]}`.
///
/// `max_rc` is intentionally a `String`: the on-chain JSON serializer uses
/// the `as_int64` directive, which accepts (and the TS implementation emits)
/// the value as a quoted decimal string to survive any non-int64-safe
/// downstream parser. The TS factory carries a comment about this.
#[derive(Debug, Clone, Serialize)]
struct DelegateRcBody {
    from: AccountName,
    delegatees: Vec<AccountName>,
    max_rc: String,
    extensions: Vec<serde_json::Value>,
}

/// Fluent builder for `custom_json_operation` with `id="rc"`.
///
/// Stage entries with [`Self::delegate`] / [`Self::remove_delegation`], then
/// commit them with [`Self::authorize`] (one `custom_json_operation` is
/// produced per `authorize` call, carrying every entry staged since the
/// previous `authorize`). The builder can be reused across multiple
/// `delegate → authorize` cycles before being pushed onto a transaction.
#[derive(Debug, Clone, Default)]
pub struct ResourceCreditsOperation {
    staged: Vec<DelegateRcBody>,
    authorized: Vec<proto::CustomJson>,
}

impl ResourceCreditsOperation {
    pub fn new() -> Self {
        Self::default()
    }

    /// Stage a `delegate_rc` entry. `delegatees` must contain at least one
    /// account — the TS/Python signatures enforce this by requiring a primary
    /// `delegatee` parameter plus a variadic tail; Rust folds both into a
    /// single `Vec` and rejects empties at runtime.
    ///
    /// `max_rc` must be non-negative; the chain rejects negative delegations.
    pub fn delegate(
        mut self,
        working_account: impl Into<AccountName>,
        max_rc: i64,
        delegatees: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        if delegatees.is_empty() {
            return Err(WaxError::new("delegatees must contain at least one account"));
        }
        if max_rc < 0 {
            return Err(WaxError::new("max_rc must be non-negative"));
        }
        self.staged.push(DelegateRcBody {
            from: working_account.into(),
            delegatees,
            max_rc: max_rc.to_string(),
            extensions: Vec::new(),
        });
        Ok(self)
    }

    /// Sugar for [`Self::delegate`] with `max_rc = 0`, matching the
    /// TS / Python `removeDelegation` / `remove_delegation` helpers.
    pub fn remove_delegation(
        self,
        working_account: impl Into<AccountName>,
        delegatees: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        self.delegate(working_account, 0, delegatees)
    }

    /// Commit all currently-staged entries as a `custom_json_operation`
    /// carrying the given authorities. Drains the stage so the builder can
    /// be reused for a fresh delegate/authorize cycle.
    ///
    /// At least one of `required_posting_auths` or `required_auths` must be
    /// non-empty — the TS implementation throws `Missing authority` in the
    /// same condition.
    pub fn authorize(
        mut self,
        required_posting_auths: Vec<AccountName>,
        required_auths: Vec<AccountName>,
    ) -> Result<Self, WaxError> {
        if required_posting_auths.is_empty() && required_auths.is_empty() {
            return Err(WaxError::new("Missing authority"));
        }

        for entry in self.staged.drain(..) {
            // Wire form is `[tag, body]` — a heterogenous JSON array,
            // matching TS `JSON.stringify(["delegate_rc", body])`.
            let payload = (DELEGATE_RC_TAG, entry);
            let json = serde_json::to_string(&payload)
                .map_err(|e| WaxError::new(format!("failed to serialize delegate_rc: {e}")))?;

            self.authorized.push(proto::CustomJson {
                id: OPERATION_ID.into(),
                json,
                required_auths: required_auths.clone(),
                required_posting_auths: required_posting_auths.clone(),
            });
        }

        Ok(self)
    }
}

impl OperationBuilder for ResourceCreditsOperation {
    fn finalize(
        self,
        _foundation: &dyn WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        Ok(self
            .authorized
            .into_iter()
            .map(|cj| proto::Operation {
                value: Some(proto::operation::Value::CustomJsonOperation(cj)),
            })
            .collect())
    }
}
