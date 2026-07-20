//! Builder for a legacy-semantics vote: converts a pre-HF28 vote weight
//! percentage into the post-HF28 weight consuming the same mana, and emits a
//! plain vote operation.

use futures_util::future::try_join;

use crate::core::proto;

use crate::chain::HiveChain;
use crate::chain::api::{ApiManabar, FindAccountsRequest};
use crate::chain::error::WaxChainError;
use crate::{ComplexOperation, WaxError, WaxFoundation};

const HIVE_PERCENT: i32 = 100;
const HIVE_100_PERCENT: i32 = 100 * HIVE_PERCENT;

/// Represents a vote operation resolved from a legacy (pre-HF28) weight
/// percentage: the equivalent post-HF28 weight is computed from the voter's
/// on-chain mana state by [`Self::create_for`].
///
/// TS NOTE: mirrors `LegacyVoteOperation`
/// (`complex_operations/legacy_vote_operation.ts`); the TS static factory is
/// named `for`, which is a Rust keyword.
#[derive(Debug, Clone)]
pub struct LegacyVoteOperation {
    vote: proto::Vote,
}

impl LegacyVoteOperation {
    /// Creates the vote by fetching the voter's mana state and the dynamic
    /// global properties from the chain, then converting `weight_percent`
    /// (legacy semantics, `-100.0..=100.0`, `None` meaning `100.0`) into the
    /// post-HF28 weight consuming the same amount of mana.
    pub async fn create_for(
        chain: &HiveChain,
        voter: &str,
        author: &str,
        permlink: &str,
        weight_percent: impl Into<Option<f64>>,
    ) -> Result<Self, WaxChainError> {
        let weight_percent = weight_percent.into().unwrap_or(100.0);
        // NOTE: JS `Math.round` is `floor(x + 0.5)`, kept for parity (it
        // differs from `f64::round` on negative half-way values).
        let hive_legacy_weight =
            (weight_percent * f64::from(HIVE_PERCENT) + 0.5).floor() as i64;

        if hive_legacy_weight < -i64::from(HIVE_100_PERCENT)
            || hive_legacy_weight > i64::from(HIVE_100_PERCENT)
        {
            return Err(WaxError::new(format!(
                "Vote weight must be between -100% and 100%. \
                 Given: {weight_percent}%"
            ))
            .into());
        }

        let api = chain.api();
        let (properties, accounts) = try_join(
            api.database_api
                .get_dynamic_global_properties(Default::default()),
            api.database_api.find_accounts(FindAccountsRequest {
                accounts: vec![voter.to_string()],
                delayed_votes_active: None,
            }),
        )
        .await?;

        // TS NOTE: TS throws `Voter account not found: <voter>`; Rust reuses
        // the shared missing-accounts error.
        let voter_account =
            accounts.accounts.into_iter().next().ok_or_else(|| {
                WaxChainError::AccountsNotFound {
                    accounts: vec![voter.to_string()],
                }
            })?;

        let voting_mana = current_mana(&voter_account.voting_manabar)?;
        let downvote_mana = current_mana(&voter_account.downvote_manabar)?;
        let post_voting_power: i128 = voter_account
            .post_voting_power
            .amount
            .parse()
            .map_err(|_| {
                WaxError::new(format!(
                    "Cannot parse post_voting_power amount: {}",
                    voter_account.post_voting_power.amount
                ))
            })?;

        let final_weight = calculate_equivalent_weight(
            hive_legacy_weight as i32,
            voting_mana,
            downvote_mana,
            properties.downvote_pool_percent,
            post_voting_power,
        );

        if weight_percent != 0.0 && final_weight == 0 {
            return Err(WaxError::new(format!(
                "Calculated new vote weight is 0, likely due to low voting \
                 power or vesting shares. Legacy weight requested: \
                 {weight_percent}%."
            ))
            .into());
        }

        Ok(Self {
            vote: proto::Vote {
                voter: voter.to_string(),
                author: author.to_string(),
                permlink: permlink.to_string(),
                // NOTE: the proto field is `uint32` while the protocol value
                // is a signed int16; downvotes are stored in two's-complement
                // form (TS types the field as `number` and passes the
                // negative value directly). The C++ bridge reads the value
                // back through an i16 truncation, recovering the sign.
                weight: final_weight as u32,
            },
        })
    }

    /// Returns the resolved vote payload.
    pub fn vote(&self) -> &proto::Vote {
        &self.vote
    }
}

impl ComplexOperation for LegacyVoteOperation {
    fn finalize(
        self,
        _foundation: &WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        Ok(vec![proto::Operation {
            value: Some(proto::operation::Value::VoteOperation(self.vote)),
        }])
    }
}

/// Calculates the post-HF28 weight that consumes the same mana as
/// `hive_legacy_weight` (legacy semantics, basis points) would have,
/// preserving its sign and clamping to `±HIVE_100_PERCENT`.
fn calculate_equivalent_weight(
    hive_legacy_weight: i32,
    voting_mana: i64,
    downvote_mana: i64,
    downvote_pool_percent: u16,
    post_voting_power: i128,
) -> i32 {
    let mut legacy_effective_mana = i128::from(voting_mana);

    // For downvotes in pre-HF28, the mana is adjusted by the downvote pool.
    if hive_legacy_weight < 0 && downvote_pool_percent != 0 {
        let downvote_mana_with_pool = i128::from(downvote_mana)
            * i128::from(HIVE_100_PERCENT)
            / i128::from(downvote_pool_percent);

        legacy_effective_mana =
            legacy_effective_mana.max(downvote_mana_with_pool);
    }

    // Mana that would be used in the legacy system.
    let legacy_mana_amount =
        legacy_effective_mana * i128::from(hive_legacy_weight.unsigned_abs());

    // Weight that would use the same amount of mana in the new system.
    let calculated_weight = if post_voting_power == 0 {
        0
    } else {
        legacy_mana_amount / post_voting_power
    };

    let signed_weight = if hive_legacy_weight < 0 {
        -calculated_weight
    } else {
        calculated_weight
    };

    signed_weight
        .clamp(-i128::from(HIVE_100_PERCENT), i128::from(HIVE_100_PERCENT))
        as i32
}

fn current_mana(manabar: &ApiManabar) -> Result<i64, WaxError> {
    manabar.current_mana.as_i64().ok_or_else(|| {
        WaxError::new("Manabar current_mana is not a valid integer")
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    const MANA: i64 = 323_542_936_294_746;

    #[test]
    fn full_upvote_with_mana_equal_to_post_voting_power_is_full_weight() {
        let weight = calculate_equivalent_weight(
            HIVE_100_PERCENT,
            MANA,
            MANA / 4,
            2500,
            i128::from(MANA),
        );

        assert_eq!(weight, HIVE_100_PERCENT);
    }

    #[test]
    fn half_depleted_mana_halves_the_weight() {
        let weight = calculate_equivalent_weight(
            HIVE_100_PERCENT,
            MANA / 2,
            MANA / 8,
            2500,
            i128::from(MANA),
        );

        assert_eq!(weight, HIVE_100_PERCENT / 2);
    }

    #[test]
    fn full_downvote_uses_the_pool_adjusted_downvote_mana() {
        // A full downvote pool (25% of the voting mana at a 2500 pool
        // percent) scales back up to the full voting mana.
        let weight = calculate_equivalent_weight(
            -HIVE_100_PERCENT,
            MANA,
            MANA / 4,
            2500,
            i128::from(MANA),
        );

        assert_eq!(weight, -HIVE_100_PERCENT);
    }

    #[test]
    fn downvote_without_pool_falls_back_to_voting_mana() {
        let weight = calculate_equivalent_weight(
            -HIVE_100_PERCENT / 2,
            MANA,
            0,
            0,
            i128::from(MANA),
        );

        assert_eq!(weight, -HIVE_100_PERCENT / 2);
    }

    #[test]
    fn weight_is_clamped_when_mana_exceeds_post_voting_power() {
        let weight = calculate_equivalent_weight(
            HIVE_100_PERCENT,
            MANA,
            MANA / 4,
            2500,
            i128::from(MANA) / 2,
        );

        assert_eq!(weight, HIVE_100_PERCENT);
    }

    #[test]
    fn zero_post_voting_power_yields_zero_weight() {
        let weight =
            calculate_equivalent_weight(HIVE_100_PERCENT, MANA, MANA, 2500, 0);

        assert_eq!(weight, 0);
    }
}
