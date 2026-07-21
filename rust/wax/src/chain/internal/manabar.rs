//! Per-account manabar argument assembly for the online manabar accessors.
//!
//! TS NOTE: ports `getManabarDataArguments` and its `EManabarType`-driven
//! account/RC selection from `ts/wasm/lib/detailed/chain_api.ts`.

use crate::WaxError;
use crate::models::basic::HiveDateTime;
use crate::models::enums::EManabarType;

use crate::chain::api::{
    ApiManabar, DefaultHiveApi, FindAccountsRequest, FindRcAccountsRequest,
    NumberOrString,
};
use crate::chain::error::WaxChainError;

/// TS NOTE: `ONE_HUNDRED_PERCENT` (`base_api.ts`) — 100% in Hive basis
/// points, used to scale an account's vote power to the downvote pool share.
const ONE_HUNDRED_PERCENT: i64 = 10_000;

/// Represents the inputs of the offline manabar calculators
/// ([`crate::WaxFoundation::calculate_current_manabar_value`] /
/// [`crate::WaxFoundation::calculate_manabar_full_regeneration_time`]),
/// assembled from the chain state of one account.
pub(crate) struct ManabarArguments {
    pub(crate) head_block_time: HiveDateTime,
    pub(crate) max_mana: i64,
    pub(crate) current_mana: i64,
    pub(crate) last_update_time: u32,
}

/// Fetches the dynamic global properties plus the account (or RC) state
/// backing `manabar_type` and assembles the calculator arguments.
pub(crate) async fn manabar_arguments(
    api: &DefaultHiveApi,
    account: &str,
    manabar_type: EManabarType,
) -> Result<ManabarArguments, WaxChainError> {
    let properties = api
        .database_api
        .get_dynamic_global_properties(Default::default())
        .await?;

    let (manabar, max_mana) = match manabar_type {
        EManabarType::Rc => rc_manabar(api, account).await?,
        EManabarType::Upvote | EManabarType::Downvote => {
            vote_manabar(
                api,
                account,
                manabar_type,
                properties.downvote_pool_percent,
            )
            .await?
        }
    };

    Ok(ManabarArguments {
        head_block_time: properties.time,
        max_mana,
        current_mana: mana_value(&manabar.current_mana, "current_mana")?,
        last_update_time: manabar.last_update_time,
    })
}

/// Fetches the RC manabar and maximum RC of `account`.
async fn rc_manabar(
    api: &DefaultHiveApi,
    account: &str,
) -> Result<(ApiManabar, i64), WaxChainError> {
    let response = api
        .rc_api
        .find_rc_accounts(FindRcAccountsRequest {
            accounts: vec![account.to_string()],
        })
        .await?;

    let Some(rc_account) = response.rc_accounts.into_iter().next() else {
        return Err(missing(account));
    };
    let max_mana = mana_value(&rc_account.max_rc, "max_rc")?;

    Ok((rc_account.rc_manabar, max_mana))
}

/// Fetches the upvote or downvote manabar of `account`, with the maximum
/// derived from the account's vote power (scaled to the downvote pool share
/// for [`EManabarType::Downvote`]).
async fn vote_manabar(
    api: &DefaultHiveApi,
    account: &str,
    manabar_type: EManabarType,
    downvote_pool_percent: u16,
) -> Result<(ApiManabar, i64), WaxChainError> {
    let response = api
        .database_api
        .find_accounts(FindAccountsRequest {
            accounts: vec![account.to_string()],
            delayed_votes_active: Some(true),
        })
        .await?;

    let Some(api_account) = response.accounts.into_iter().next() else {
        return Err(missing(account));
    };

    // NOTE: TS converts through `BigInt(...)`, which throws on a malformed
    // amount; the explicit parse mirrors that guard.
    let vote_power: i64 =
        api_account.post_voting_power.amount.parse().map_err(|_| {
            invalid_field(
                "post_voting_power",
                &api_account.post_voting_power.amount,
            )
        })?;

    match manabar_type {
        EManabarType::Upvote => Ok((api_account.voting_manabar, vote_power)),
        _ => {
            // TS NOTE: the branch mirrors TS — dividing first keeps huge vote
            // powers in range (TS relies on BigInt's unbounded range, Rust on
            // `i64` never being pushed past `i64::MAX / ONE_HUNDRED_PERCENT`).
            let downvote_pool_percent = i64::from(downvote_pool_percent);
            let max_mana =
                if vote_power / ONE_HUNDRED_PERCENT > ONE_HUNDRED_PERCENT {
                    (vote_power / ONE_HUNDRED_PERCENT) * downvote_pool_percent
                } else {
                    (vote_power * downvote_pool_percent) / ONE_HUNDRED_PERCENT
                };

            Ok((api_account.downvote_manabar, max_mana))
        }
    }
}

/// Converts a wire manabar value into `i64`.
///
/// NOTE: TS coerces through `Number(...)`/`BigInt(...)`, which yield `NaN` /
/// throw on malformed values; the explicit conversion mirrors that guard.
fn mana_value(
    value: &NumberOrString,
    field: &str,
) -> Result<i64, WaxChainError> {
    value.as_i64().ok_or_else(|| match value {
        NumberOrString::Number(number) => {
            invalid_field(field, &number.to_string())
        }
        NumberOrString::String(string) => invalid_field(field, string),
    })
}

fn invalid_field(field: &str, value: &str) -> WaxChainError {
    WaxError::new(format!(
        "Invalid {field} value in the API response: \"{value}\""
    ))
    .into()
}

fn missing(account: &str) -> WaxChainError {
    WaxChainError::AccountsNotFound {
        accounts: vec![account.to_string()],
    }
}
