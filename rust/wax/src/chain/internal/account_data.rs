//! Chain-backed account and witness authority lookups feeding the online
//! transaction checks.
//!
//! TS NOTE: ports `transformApiAuthority`, `collectAccountAuthorities` and
//! `collectWitnessSigningKeys` from `ts/wasm/lib/detailed/chain_api.ts`.

use std::collections::{HashMap, HashSet};

use crate::chain::api::{
    ApiAuthority, DefaultHiveApi, FindAccountsRequest, FindWitnessesRequest,
};
use crate::chain::error::WaxChainError;
use crate::models::authority::{Authorities, WaxAuthority};
use crate::models::basic::{AccountName, PublicKey};

/// Converts a database-API authority (entries as `[name, weight]` pairs) into
/// its protocol form (entries as maps).
pub(crate) fn to_wax_authority(authority: ApiAuthority) -> WaxAuthority {
    WaxAuthority {
        weight_threshold: authority.weight_threshold,
        account_auths: to_auth_map(authority.account_auths),
        key_auths: to_auth_map(authority.key_auths),
    }
}

fn to_auth_map(entries: Vec<(String, u16)>) -> HashMap<String, u32> {
    entries
        .into_iter()
        .map(|(name, weight)| (name, u32::from(weight)))
        .collect()
}

/// Fetches the role authorities and memo key of the given accounts. With
/// `throw_if_missing`, errors if any account is unknown to the chain;
/// otherwise unknown accounts are simply absent from the result.
pub(crate) async fn collect_account_authorities(
    api: &DefaultHiveApi,
    throw_if_missing: bool,
    accounts: &[AccountName],
) -> Result<HashMap<AccountName, (Authorities, PublicKey)>, WaxChainError> {
    if accounts.is_empty() {
        return Ok(HashMap::new());
    }

    let response = api
        .database_api
        .find_accounts(FindAccountsRequest {
            accounts: accounts.to_vec(),
            delayed_votes_active: Some(true),
        })
        .await?;

    if throw_if_missing && response.accounts.len() != accounts.len() {
        return Err(WaxChainError::AccountsNotFound {
            accounts: missing_names(
                accounts,
                response.accounts.iter().map(|account| &account.name),
            ),
        });
    }

    Ok(response
        .accounts
        .into_iter()
        .map(|account| {
            let authorities = Authorities {
                owner: Some(to_wax_authority(account.owner)),
                active: Some(to_wax_authority(account.active)),
                posting: Some(to_wax_authority(account.posting)),
            };
            (account.name, (authorities, account.memo_key))
        })
        .collect())
}

/// Fetches the signing key of the given witnesses. With `throw_if_missing`,
/// errors if any witness is unknown to the chain; otherwise unknown witnesses
/// are simply absent from the result.
pub(crate) async fn collect_witness_signing_keys(
    api: &DefaultHiveApi,
    throw_if_missing: bool,
    witnesses: &[AccountName],
) -> Result<HashMap<AccountName, PublicKey>, WaxChainError> {
    if witnesses.is_empty() {
        return Ok(HashMap::new());
    }

    let response = api
        .database_api
        .find_witnesses(FindWitnessesRequest {
            owners: witnesses.to_vec(),
            delayed_votes_active: true,
        })
        .await?;

    if throw_if_missing && response.witnesses.len() != witnesses.len() {
        return Err(WaxChainError::WitnessesNotFound {
            witnesses: missing_names(
                witnesses,
                response.witnesses.iter().map(|witness| &witness.owner),
            ),
        });
    }

    Ok(response
        .witnesses
        .into_iter()
        .map(|witness| (witness.owner, witness.signing_key))
        .collect())
}

fn missing_names<'a>(
    requested: &[AccountName],
    found: impl Iterator<Item = &'a AccountName>,
) -> Vec<AccountName> {
    let found: HashSet<&AccountName> = found.collect();

    requested
        .iter()
        .filter(|name| !found.contains(name))
        .cloned()
        .collect()
}
