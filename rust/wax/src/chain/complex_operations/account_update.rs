//! Online builder for account authority updates: fetches the account's
//! current authorities from the chain, exposes fluent per-role editing and
//! emits a single `account_update2_operation` carrying only the changed
//! roles.

use chrono::{DateTime, Duration, Utc};

use crate::core::proto;

use crate::base::models::authority::WaxAuthority;
use crate::base::models::basic::{AccountName, PublicKey};
use crate::base::result::ChainConfig;
use crate::chain::HiveChain;
use crate::chain::api::FindAccountsRequest;
use crate::chain::error::WaxChainError;
use crate::chain::internal::account_data::to_wax_authority;
use crate::{ComplexOperation, WaxError, WaxFoundation};

const HIVE_TEMP_ACCOUNT_KEY: &str = "HIVE_TEMP_ACCOUNT";
const HIVE_MAX_AUTHORITY_MEMBERSHIP_KEY: &str = "HIVE_MAX_AUTHORITY_MEMBERSHIP";
const HIVE_MAX_ACCOUNT_NAME_LENGTH_KEY: &str = "HIVE_MAX_ACCOUNT_NAME_LENGTH";
const HIVE_ADDRESS_PREFIX_KEY: &str = "HIVE_ADDRESS_PREFIX";
const HIVE_OWNER_UPDATE_LIMIT_KEY: &str = "HIVE_OWNER_UPDATE_LIMIT";

/// Used as the default weight for added authority entries and the default
/// weight threshold.
const DEFAULT_ACCOUNT_OR_KEY_WEIGHT: u32 = 1;

/// Used as the memo-key sentinel meaning "no memo key set".
const NULL_PUBLIC_KEY: &str = "STM1111111111111111111111111111111114T1Anm";

/// Online operation — automatically filled with the authority data fetched
/// from the chain API.
///
/// Simplifies the account authority update process by gathering the current
/// authority state from the blockchain and supplementing it with the
/// provided modifications: to add a single key to the active role, just add
/// the key — the other authorities are carried over unchanged.
///
/// Initialized with all of the supported roles for the given account by
/// [`Self::create_for`]; afterwards the roles are edited directly through
/// the public [`owner`](Self::owner) / [`active`](Self::active) /
/// [`posting`](Self::posting) / [`memo`](Self::memo) fields.
///
/// # Example
///
/// ```no_run
/// # async fn example(chain: &wax::HiveChain) -> Result<(), wax::WaxChainError> {
/// use wax::complex_operations::AccountAuthorityUpdateOperation;
///
/// let mut operation =
///     AccountAuthorityUpdateOperation::create_for(chain, "initminer")
///         .await?;
///
/// operation
///     .active
///     .add("STM5ZDPkbLuMLKSKGiuo5BFinviBK9jkAeWXLYchGuPUeVKzGbwz1", None)?;
/// operation
///     .memo
///     .set("STM6dNhJF7K7MnVvrf2uv7SPTFCdRDsDpq2vNVU1atu9Un5LcpKzs")?;
/// # Ok(())
/// # }
/// ```
#[derive(Debug, Clone)]
pub struct AccountAuthorityUpdateOperation {
    account: AccountName,
    max_authority_membership: u32,
    /// The owner role authority (its updates are rate-limited by the chain).
    pub owner: HiveRoleAuthority,
    /// The active role authority.
    pub active: HiveRoleAuthority,
    /// The posting role authority.
    pub posting: HiveRoleAuthority,
    /// The memo key role.
    pub memo: HiveRoleMemoKey,
}

impl AccountAuthorityUpdateOperation {
    /// Creates the operation with all supported roles pre-initialized from
    /// the given account's on-chain authority state.
    pub async fn create_for(
        chain: &HiveChain,
        account: &str,
    ) -> Result<Self, WaxChainError> {
        let config = chain.config().map_err(WaxChainError::from)?;

        if config.get(HIVE_TEMP_ACCOUNT_KEY).map(String::as_str)
            == Some(account)
        {
            return Err(WaxError::new(
                "Cannot edit temporary account authority in hive category",
            )
            .into());
        }

        let max_authority_membership: u32 =
            parse_config_number(&config, HIVE_MAX_AUTHORITY_MEMBERSHIP_KEY)?;
        let max_account_name_length: usize =
            parse_config_number(&config, HIVE_MAX_ACCOUNT_NAME_LENGTH_KEY)?;
        let owner_update_limit_us: i64 =
            parse_config_number(&config, HIVE_OWNER_UPDATE_LIMIT_KEY)?;
        let address_prefix =
            config_value(&config, HIVE_ADDRESS_PREFIX_KEY)?.to_string();

        let response = chain
            .api()
            .database_api
            .find_accounts(FindAccountsRequest {
                accounts: vec![account.to_string()],
                delayed_votes_active: Some(true),
            })
            .await?;

        let chain_account =
            response.accounts.into_iter().next().ok_or_else(|| {
                WaxChainError::AccountsNotFound {
                    accounts: vec![account.to_string()],
                }
            })?;

        let owner_update_guard = OwnerUpdateGuard {
            last_owner_update: chain_account.last_owner_update.inner(),
            previous_owner_update: chain_account.previous_owner_update.inner(),
            limit: Duration::microseconds(owner_update_limit_us),
        };

        Ok(Self {
            account: chain_account.name,
            max_authority_membership,
            owner: HiveRoleAuthority::new(
                HiveRole::Owner,
                max_account_name_length,
                address_prefix.clone(),
                Some(owner_update_guard),
                to_wax_authority(chain_account.owner),
            ),
            active: HiveRoleAuthority::new(
                HiveRole::Active,
                max_account_name_length,
                address_prefix.clone(),
                None,
                to_wax_authority(chain_account.active),
            ),
            posting: HiveRoleAuthority::new(
                HiveRole::Posting,
                max_account_name_length,
                address_prefix.clone(),
                None,
                to_wax_authority(chain_account.posting),
            ),
            memo: HiveRoleMemoKey::new(address_prefix, chain_account.memo_key),
        })
    }

    /// Returns the account this operation edits.
    pub fn account(&self) -> &str {
        &self.account
    }

    /// Enforces the requirement for **owner** role authorization when
    /// modifying **active** or **posting** roles.
    ///
    /// **HF 28** introduces stricter matching between the authority role
    /// required by a given operation and the role used to authorize the
    /// transaction.
    /// - Since modifying **active** or **posting** roles requires **active**
    ///   authority at the time of transaction signing, the pre-HF28
    ///   behavior — which allowed signing with the **owner** key — will be
    ///   **disallowed**.
    /// - This change may pose difficulties for users who have lost their
    ///   active keys and attempt to use their owner key to set a new one.
    /// - To address this, the function allows the inclusion — within the
    ///   `account_update2_operation` generated internally — of elements that
    ///   enforce the **owner** role requirement, specifically through an
    ///   ineffective change of the owner authority to the same value
    ///   currently recorded on-chain.
    pub fn enforce_owner_role_authorisation(&mut self) {
        self.owner.enforce_modifications();
    }

    /// Checks if any authority has changed since initialization, i.e.
    /// whether finalizing this operation would emit anything.
    pub fn is_effective(&self) -> bool {
        self.owner.changed()
            || self.active.changed()
            || self.posting.changed()
            || self.memo.changed()
    }

    /// Returns every role of the built-in hive category at once, for edits
    /// spanning multiple roles.
    pub fn hive(&mut self) -> HiveRoles<'_> {
        HiveRoles {
            owner: &mut self.owner,
            active: &mut self.active,
            posting: &mut self.posting,
            memo: &mut self.memo,
        }
    }
}

/// Represents mutable access to every role of the built-in hive category of
/// an [`AccountAuthorityUpdateOperation`], returned by
/// [`AccountAuthorityUpdateOperation::hive`].
#[derive(Debug)]
pub struct HiveRoles<'a> {
    /// The owner role authority.
    pub owner: &'a mut HiveRoleAuthority,
    /// The active role authority.
    pub active: &'a mut HiveRoleAuthority,
    /// The posting role authority.
    pub posting: &'a mut HiveRoleAuthority,
    /// The memo key role.
    pub memo: &'a mut HiveRoleMemoKey,
}

impl ComplexOperation for AccountAuthorityUpdateOperation {
    fn finalize(
        self,
        _foundation: &WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let this = self;
        if !this.is_effective() {
            return Err(WaxError::new(
                "No operations updating account authority generated",
            ));
        }

        let owner =
            changed_authority(&this.owner, this.max_authority_membership)?;
        let active =
            changed_authority(&this.active, this.max_authority_membership)?;
        let posting =
            changed_authority(&this.posting, this.max_authority_membership)?;

        let memo_key = (this.memo.changed() && this.memo.is_set())
            .then(|| this.memo.value().to_string());

        Ok(vec![proto::Operation {
            value: Some(proto::operation::Value::AccountUpdate2Operation(
                proto::AccountUpdate2 {
                    account: this.account,
                    owner,
                    active,
                    posting,
                    memo_key,
                    json_metadata: String::new(),
                    posting_json_metadata: String::new(),
                    extensions: Vec::new(),
                },
            )),
        }])
    }
}

/// Represents a Hive authority role level.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum HiveRole {
    Owner,
    Active,
    Posting,
}

impl HiveRole {
    /// Returns the role's lowercase protocol name.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Owner => "owner",
            Self::Active => "active",
            Self::Posting => "posting",
        }
    }

    fn capitalized(self) -> &'static str {
        match self {
            Self::Owner => "Owner",
            Self::Active => "Active",
            Self::Posting => "Posting",
        }
    }
}

/// Represents a single editable authority role (owner / active / posting):
/// the on-chain snapshot plus the pending modifications.
#[derive(Debug, Clone)]
pub struct HiveRoleAuthority {
    role: HiveRole,
    max_account_name_length: usize,
    address_prefix: String,
    // Only the owner role carries the rate-limit guard.
    owner_update_guard: Option<OwnerUpdateGuard>,
    authority: WaxAuthority,
    previous_authority: WaxAuthority,
    enforced_modifications: bool,
}

impl HiveRoleAuthority {
    fn new(
        role: HiveRole,
        max_account_name_length: usize,
        address_prefix: String,
        owner_update_guard: Option<OwnerUpdateGuard>,
        authority: WaxAuthority,
    ) -> Self {
        Self {
            role,
            max_account_name_length,
            address_prefix,
            owner_update_guard,
            previous_authority: authority.clone(),
            authority,
            enforced_modifications: false,
        }
    }

    /// Returns the role level this authority edits.
    pub fn role(&self) -> HiveRole {
        self.role
    }

    /// Returns the current (possibly modified) authority value.
    pub fn value(&self) -> &WaxAuthority {
        &self.authority
    }

    /// Checks if the authority has changed since initialization, by value
    /// comparison against the on-chain snapshot.
    pub fn changed(&self) -> bool {
        self.enforced_modifications || self.authority != self.previous_authority
    }

    /// Once called, marks the role as modified, effectively pushing its
    /// (possibly identical) definition into the final operation.
    pub fn enforce_modifications(&mut self) {
        self.enforced_modifications = true;
    }

    /// Resets the role to its on-chain state.
    pub fn reset(&mut self) {
        self.authority = self.previous_authority.clone();
        self.enforced_modifications = false;
    }

    /// Checks if the role is a null authority — no account nor key entries,
    /// meaning everyone can access the account.
    pub fn is_null_authority(&self) -> bool {
        self.authority.account_auths.is_empty()
            && self.authority.key_auths.is_empty()
    }

    /// Adds an account or key to the role with the given weight (`None`
    /// meaning 1). If the account or key already exists, its weight is
    /// updated.
    pub fn add(
        &mut self,
        account_or_key: &str,
        weight: impl Into<Option<u32>>,
    ) -> Result<&mut Self, WaxError> {
        self.ensure_can_update()?;
        self.add_to_role(
            account_or_key,
            weight.into().unwrap_or(DEFAULT_ACCOUNT_OR_KEY_WEIGHT),
        )?;

        Ok(self)
    }

    /// Replaces the account or key with a new one, or — when
    /// `new_account_or_key` is `None` — only changes the weight of the
    /// existing entry.
    pub fn replace<'a>(
        &mut self,
        account_or_key: &str,
        weight: u32,
        new_account_or_key: impl Into<Option<&'a str>>,
    ) -> Result<&mut Self, WaxError> {
        self.ensure_can_update()?;

        let new_account_or_key =
            new_account_or_key.into().unwrap_or(account_or_key);
        if account_or_key != new_account_or_key {
            self.ensure_valid_account_or_key(new_account_or_key)?;
            self.remove_from_role(account_or_key)?;
        }
        self.add_to_role(new_account_or_key, weight)?;

        Ok(self)
    }

    /// Removes the given account or key from the role. Does nothing if the
    /// account or key is not present.
    pub fn remove(
        &mut self,
        account_or_key: &str,
    ) -> Result<&mut Self, WaxError> {
        self.ensure_can_update()?;
        self.remove_from_role(account_or_key)?;

        Ok(self)
    }

    /// Checks if the account or key is present in the role (and, when
    /// `weight` is given, carries exactly that weight).
    pub fn has(
        &self,
        account_or_key: &str,
        weight: impl Into<Option<u32>>,
    ) -> bool {
        let entry = if self.is_public_key(account_or_key) {
            self.authority.key_auths.get(account_or_key)
        } else if self.is_account_name(account_or_key) {
            self.authority.account_auths.get(account_or_key)
        } else {
            None
        };

        match (entry, weight.into()) {
            (Some(actual), Some(expected)) => *actual == expected,
            (entry, None) => entry.is_some(),
            (None, Some(_)) => false,
        }
    }

    /// Sets the weight threshold for the role (`None` meaning 1).
    pub fn set_threshold(
        &mut self,
        threshold: impl Into<Option<u32>>,
    ) -> Result<&mut Self, WaxError> {
        self.ensure_can_update()?;
        self.authority.weight_threshold =
            threshold.into().unwrap_or(DEFAULT_ACCOUNT_OR_KEY_WEIGHT);

        Ok(self)
    }

    /// Clears the role, making it a null authority with threshold 1. See
    /// [`Self::is_null_authority`].
    pub fn clear(&mut self) -> Result<&mut Self, WaxError> {
        self.ensure_can_update()?;

        self.authority.account_auths.clear();
        self.authority.key_auths.clear();
        self.authority.weight_threshold = DEFAULT_ACCOUNT_OR_KEY_WEIGHT;

        Ok(self)
    }

    fn ensure_can_update(&self) -> Result<(), WaxError> {
        match &self.owner_update_guard {
            Some(guard) => guard.ensure_can_update(),
            None => Ok(()),
        }
    }

    fn is_public_key(&self, account_or_key: &str) -> bool {
        account_or_key.starts_with(&self.address_prefix)
    }

    fn is_account_name(&self, account_or_key: &str) -> bool {
        account_or_key.len() <= self.max_account_name_length
    }

    fn add_to_role(
        &mut self,
        account_or_key: &str,
        weight: u32,
    ) -> Result<(), WaxError> {
        if self.is_public_key(account_or_key) {
            self.authority
                .key_auths
                .insert(account_or_key.to_string(), weight);
        } else if self.is_account_name(account_or_key) {
            self.authority
                .account_auths
                .insert(account_or_key.to_string(), weight);
        } else {
            return Err(invalid_account_or_key());
        }

        Ok(())
    }

    fn remove_from_role(
        &mut self,
        account_or_key: &str,
    ) -> Result<(), WaxError> {
        if self.is_public_key(account_or_key) {
            self.authority.key_auths.remove(account_or_key);
        } else if self.is_account_name(account_or_key) {
            self.authority.account_auths.remove(account_or_key);
        } else {
            return Err(invalid_account_or_key());
        }

        Ok(())
    }

    fn ensure_valid_account_or_key(
        &self,
        account_or_key: &str,
    ) -> Result<(), WaxError> {
        if !self.is_public_key(account_or_key)
            && !self.is_account_name(account_or_key)
        {
            return Err(invalid_account_or_key());
        }

        Ok(())
    }
}

fn invalid_account_or_key() -> WaxError {
    WaxError::new("Invalid account or key")
}

/// Represents the editable memo key role.
#[derive(Debug, Clone)]
pub struct HiveRoleMemoKey {
    address_prefix: String,
    public_key: PublicKey,
    previous_public_key: PublicKey,
    enforced_modifications: bool,
}

impl HiveRoleMemoKey {
    fn new(address_prefix: String, public_key: PublicKey) -> Self {
        Self {
            address_prefix,
            previous_public_key: public_key.clone(),
            public_key,
            enforced_modifications: false,
        }
    }

    /// Returns the current (possibly modified) memo key.
    pub fn value(&self) -> &str {
        &self.public_key
    }

    /// Checks if the key has changed since initialization, by comparison
    /// against the on-chain value.
    pub fn changed(&self) -> bool {
        self.enforced_modifications
            || self.public_key != self.previous_public_key
    }

    /// Once called, marks the role as modified, effectively pushing its
    /// (possibly identical) definition into the final operation.
    pub fn enforce_modifications(&mut self) {
        self.enforced_modifications = true;
    }

    /// Resets the role to its on-chain state.
    pub fn reset(&mut self) {
        self.public_key = self.previous_public_key.clone();
        self.enforced_modifications = false;
    }

    /// Sets the provided public key as the account memo key.
    pub fn set(&mut self, public_key: &str) -> Result<&mut Self, WaxError> {
        if !public_key.starts_with(&self.address_prefix) {
            return Err(WaxError::new(
                "Invalid public key provided as memo key",
            ));
        }
        self.public_key = public_key.to_string();

        Ok(self)
    }

    /// Checks if the memo key is set to a real key rather than the null-key
    /// sentinel (`STM1111111111111111111111111111111114T1Anm`).
    pub fn is_set(&self) -> bool {
        self.public_key != NULL_PUBLIC_KEY
    }
}

/// Represents the owner-authority update history captured at initialization,
/// enforcing the chain's owner update rate limit client-side.
#[derive(Debug, Clone)]
struct OwnerUpdateGuard {
    last_owner_update: DateTime<Utc>,
    previous_owner_update: DateTime<Utc>,
    limit: Duration,
}

impl OwnerUpdateGuard {
    fn ensure_can_update(&self) -> Result<(), WaxError> {
        let now = Utc::now();
        let older_than_limit = |time: DateTime<Utc>| now - time > self.limit;

        if !older_than_limit(self.last_owner_update)
            && older_than_limit(self.previous_owner_update)
        {
            return Err(WaxError::new(
                "Owner authority cannot be updated due to owner authority \
                 update limit - twice an hour",
            ));
        }

        Ok(())
    }
}

/// Returns the role's authority when changed (validating that it can be
/// satisfied), or `None` to leave the role untouched on-chain.
fn changed_authority(
    role: &HiveRoleAuthority,
    max_authority_membership: u32,
) -> Result<Option<WaxAuthority>, WaxError> {
    if !role.changed() {
        return Ok(None);
    }

    ensure_authority_can_be_satisfied(
        role.role(),
        role.value(),
        max_authority_membership,
    )?;

    Ok(Some(role.value().clone()))
}

/// Validates the authority the way `hive_operations.cpp` -
/// `validate_auth_size` does: bounded membership, and either a null
/// authority or enough total weight to reach the threshold.
fn ensure_authority_can_be_satisfied(
    role: HiveRole,
    authority: &WaxAuthority,
    max_authority_membership: u32,
) -> Result<(), WaxError> {
    let total_auth_size =
        authority.account_auths.len() + authority.key_auths.len();

    if total_auth_size > max_authority_membership as usize {
        return Err(WaxError::new(format!(
            "Authority membership exceeded. Max: {max_authority_membership} \
             Current: {total_auth_size}"
        )));
    }

    if total_auth_size == 0 {
        return Ok(()); // Null authority - can be satisfied.
    }

    let total_weight: u64 = authority
        .account_auths
        .values()
        .chain(authority.key_auths.values())
        .map(|weight| u64::from(*weight))
        .sum();

    if total_weight < u64::from(authority.weight_threshold) {
        return Err(WaxError::new(format!(
            "{} authority cannot be ever satisfied due to insufficient \
             weight",
            role.capitalized()
        )));
    }

    Ok(())
}

fn config_value<'a>(
    config: &'a ChainConfig,
    key: &str,
) -> Result<&'a str, WaxError> {
    config.get(key).map(String::as_str).ok_or_else(|| {
        WaxError::new(format!("{key} missing from protocol config"))
    })
}

fn parse_config_number<T: std::str::FromStr>(
    config: &ChainConfig,
    key: &str,
) -> Result<T, WaxError> {
    config_value(config, key)?.parse().map_err(|_| {
        WaxError::new(format!("Protocol config {key} is not a valid number"))
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    const PREFIX: &str = "STM";
    const MAX_NAME_LENGTH: usize = 16;
    const KEY: &str = "STM5ZDPkbLuMLKSKGiuo5BFinviBK9jkAeWXLYchGuPUeVKzGbwz1";
    const OTHER_KEY: &str =
        "STM6dNhJF7K7MnVvrf2uv7SPTFCdRDsDpq2vNVU1atu9Un5LcpKzs";

    fn authority(
        accounts: &[(&str, u32)],
        keys: &[(&str, u32)],
    ) -> WaxAuthority {
        WaxAuthority {
            weight_threshold: 1,
            account_auths: accounts
                .iter()
                .map(|(name, weight)| (name.to_string(), *weight))
                .collect(),
            key_auths: keys
                .iter()
                .map(|(key, weight)| (key.to_string(), *weight))
                .collect(),
        }
    }

    fn role_for(role: HiveRole, initial: WaxAuthority) -> HiveRoleAuthority {
        HiveRoleAuthority::new(
            role,
            MAX_NAME_LENGTH,
            PREFIX.to_string(),
            None,
            initial,
        )
    }

    fn active_role(initial: WaxAuthority) -> HiveRoleAuthority {
        role_for(HiveRole::Active, initial)
    }

    fn owner_role_with_updates(
        last_minutes_ago: i64,
        previous_minutes_ago: i64,
    ) -> HiveRoleAuthority {
        let now = Utc::now();
        let guard = OwnerUpdateGuard {
            last_owner_update: now - Duration::minutes(last_minutes_ago),
            previous_owner_update: now
                - Duration::minutes(previous_minutes_ago),
            limit: Duration::minutes(60),
        };

        HiveRoleAuthority::new(
            HiveRole::Owner,
            MAX_NAME_LENGTH,
            PREFIX.to_string(),
            Some(guard),
            authority(&[], &[(KEY, 1)]),
        )
    }

    #[test]
    fn add_discriminates_keys_from_account_names() {
        let mut role = active_role(authority(&[], &[]));

        role.add(KEY, None).unwrap().add("alice", 2).unwrap();

        assert_eq!(role.value().key_auths.get(KEY), Some(&1));
        assert_eq!(role.value().account_auths.get("alice"), Some(&2));
        assert!(
            role.add("definitely-not-an-account-name", None).is_err(),
            "an over-long non-key entry should be rejected"
        );
    }

    #[test]
    fn changed_tracks_value_differences_not_call_history() {
        let mut role = active_role(authority(&[("alice", 1)], &[]));

        assert!(!role.changed());

        role.add(KEY, None).unwrap();

        assert!(role.changed());

        role.remove(KEY).unwrap();

        assert!(!role.changed(), "add followed by remove is not a change");
    }

    #[test]
    fn enforce_modifications_marks_unchanged_role_and_reset_clears_it() {
        let mut role = active_role(authority(&[], &[(KEY, 1)]));

        role.enforce_modifications();

        assert!(role.changed());

        role.reset();

        assert!(!role.changed());
    }

    #[test]
    fn replace_swaps_the_entry_and_keeps_the_weight() {
        let mut role = active_role(authority(&[], &[(KEY, 1)]));

        role.replace(KEY, 3, Some(OTHER_KEY)).unwrap();

        assert!(!role.has(KEY, None));
        assert!(role.has(OTHER_KEY, 3));

        role.replace(OTHER_KEY, 5, None).unwrap();

        assert!(role.has(OTHER_KEY, 5), "None target only changes weight");
    }

    #[test]
    fn has_checks_presence_and_optionally_weight() {
        let role = active_role(authority(&[("alice", 2)], &[]));

        assert!(role.has("alice", None));
        assert!(role.has("alice", 2));
        assert!(!role.has("alice", 1));
        assert!(!role.has("bob", None));
    }

    #[test]
    fn clear_makes_a_null_authority_with_default_threshold() {
        let mut role = active_role(authority(&[("alice", 1)], &[(KEY, 1)]));

        role.set_threshold(4).unwrap().clear().unwrap();

        assert!(role.is_null_authority());
        assert_eq!(role.value().weight_threshold, 1);
    }

    #[test]
    fn owner_updates_are_blocked_per_the_ported_rate_limit_condition() {
        // Last update within the limit, previous outside it: TS/Python (and
        // therefore this port) reject the update.
        let mut blocked = owner_role_with_updates(10, 120);

        assert!(blocked.add(OTHER_KEY, None).is_err());

        // Both updates outside the limit: allowed.
        let mut allowed = owner_role_with_updates(120, 240);

        assert!(allowed.add(OTHER_KEY, None).is_ok());

        let mut chain_would_reject = owner_role_with_updates(10, 20);

        assert!(chain_would_reject.add(OTHER_KEY, None).is_ok());
    }

    #[test]
    fn memo_key_validates_prefix_and_tracks_changes() {
        let mut memo =
            HiveRoleMemoKey::new(PREFIX.to_string(), KEY.to_string());

        assert!(!memo.changed());
        assert!(memo.is_set());
        assert!(memo.set("TST123").is_err());

        memo.set(OTHER_KEY).unwrap();

        assert!(memo.changed());

        memo.reset();

        assert_eq!(memo.value(), KEY);
        assert!(!memo.changed());
    }

    #[test]
    fn memo_key_null_sentinel_is_not_set() {
        let memo = HiveRoleMemoKey::new(
            PREFIX.to_string(),
            NULL_PUBLIC_KEY.to_string(),
        );

        assert!(!memo.is_set());
    }

    fn operation_for_finalize() -> AccountAuthorityUpdateOperation {
        AccountAuthorityUpdateOperation {
            account: "alice".to_string(),
            max_authority_membership: 40,
            owner: role_for(HiveRole::Owner, authority(&[], &[(KEY, 1)])),
            active: role_for(HiveRole::Active, authority(&[], &[(KEY, 1)])),
            posting: role_for(HiveRole::Posting, authority(&[], &[(KEY, 1)])),
            memo: HiveRoleMemoKey::new(PREFIX.to_string(), KEY.to_string()),
        }
    }

    fn extract_account_update2(
        operations: &[proto::Operation],
    ) -> &proto::AccountUpdate2 {
        assert_eq!(operations.len(), 1);
        match &operations[0].value {
            Some(proto::operation::Value::AccountUpdate2Operation(op)) => op,
            other => panic!("expected AccountUpdate2Operation, got {other:?}"),
        }
    }

    #[test]
    fn finalize_emits_only_the_changed_roles() {
        let foundation = crate::create_wax_foundation(None);
        let mut operation = operation_for_finalize();

        operation.active.add(OTHER_KEY, 2).unwrap();

        let operations = operation.finalize(&foundation).unwrap();
        let update = extract_account_update2(&operations);

        assert_eq!(update.account, "alice");
        assert!(update.owner.is_none());
        assert!(update.posting.is_none());
        assert!(update.memo_key.is_none());

        let active = update.active.as_ref().expect("active must be present");

        assert_eq!(active.key_auths.get(OTHER_KEY), Some(&2));
        assert_eq!(active.key_auths.get(KEY), Some(&1));
    }

    #[test]
    fn finalize_without_changes_is_an_error() {
        let foundation = crate::create_wax_foundation(None);

        assert!(operation_for_finalize().finalize(&foundation).is_err());
    }

    #[test]
    fn finalize_rejects_an_unsatisfiable_authority() {
        let foundation = crate::create_wax_foundation(None);
        let mut operation = operation_for_finalize();

        operation
            .posting
            .add(OTHER_KEY, 1)
            .unwrap()
            .set_threshold(10)
            .unwrap();

        let error = operation.finalize(&foundation).unwrap_err();

        assert!(
            error
                .to_string()
                .contains("Posting authority cannot be ever"),
            "unexpected error: {error}"
        );
    }

    #[test]
    fn finalize_rejects_membership_overflow() {
        let foundation = crate::create_wax_foundation(None);
        let mut operation = operation_for_finalize();
        operation.max_authority_membership = 2;

        operation
            .active
            .add("alice", None)
            .unwrap()
            .add("bob", None)
            .unwrap();

        let error = operation.finalize(&foundation).unwrap_err();

        assert!(
            error.to_string().contains("Authority membership exceeded"),
            "unexpected error: {error}"
        );
    }

    #[test]
    fn enforced_owner_authorisation_emits_the_unchanged_owner_authority() {
        let foundation = crate::create_wax_foundation(None);
        let mut operation = operation_for_finalize();

        operation.enforce_owner_role_authorisation();

        assert!(operation.is_effective());

        let operations = operation.finalize(&foundation).unwrap();
        let update = extract_account_update2(&operations);
        let owner = update.owner.as_ref().expect("owner must be present");

        assert_eq!(owner.key_auths.get(KEY), Some(&1));
    }
}
