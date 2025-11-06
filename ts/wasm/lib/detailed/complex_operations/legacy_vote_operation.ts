import type { TAccountName } from "../hive_apps_operations/index.js";
import type { operation, vote } from "../protocol.js";
import { OperationBase, type IOperationSink } from "../operation_base.js";
import { WaxError } from "../errors.js";
import { IHiveChainInterface } from "../interfaces.js";

const HIVE_PERCENT = 100;
const HIVE_100_PERCENT = 100 * HIVE_PERCENT;
const HIVE_100_PERCENT_BI = BigInt(HIVE_100_PERCENT);

export class LegacyVoteOperation extends OperationBase {
  public constructor(
    protected readonly voteOperation: vote
  ) {
    super();
  }

  /**
   * @internal
   */
  public finalize(_sink: IOperationSink): Iterable<operation> {
    return [{ vote_operation: this.voteOperation }];
  }

  public static async for(
    chain: IHiveChainInterface, voter: TAccountName, author: TAccountName, permlink: string, weightPercent: number = 100
  ): Promise<LegacyVoteOperation> {
    const hiveLegacyWeight = Math.round(weightPercent * HIVE_PERCENT);
    if (hiveLegacyWeight < -HIVE_100_PERCENT || hiveLegacyWeight > HIVE_100_PERCENT) {
      throw new WaxError(`Vote weight must be between -100% and 100%. Given: ${weightPercent}%`);
    }

    const [{ downvote_pool_percent }, { accounts: [voterAccountObject] }] = await Promise.all([
      chain.api.database_api.get_dynamic_global_properties({}),
      chain.api.database_api.find_accounts({ accounts: [voter] })
    ]);
    if (!voterAccountObject) {
      throw new WaxError(`Voter account not found: ${voter}`);
    }

    const { post_voting_power, downvote_manabar, voting_manabar } = voterAccountObject;

    // Calculate legacy mana that would be used
    let legacy_effective_mana = BigInt(voting_manabar.current_mana);

    // For downvotes in pre-HF28, we need to adjust the mana based on the downvote pool
    if (hiveLegacyWeight < 0 && downvote_pool_percent) {
      const downvoteManaWithPool = (BigInt(downvote_manabar.current_mana) * HIVE_100_PERCENT_BI) / BigInt(downvote_pool_percent);

      legacy_effective_mana = downvoteManaWithPool > legacy_effective_mana ? downvoteManaWithPool : legacy_effective_mana;
    }

    // Calculate mana that would be used in legacy system
    const absLegacyWeight = Math.abs(hiveLegacyWeight);
    const legacyManaAmount = legacy_effective_mana * BigInt(absLegacyWeight);

    const postVotingPower = BigInt(post_voting_power.amount);

    // Now calculate what weight in new system would use the same amount of mana
    const calculatedWeight = postVotingPower === 0n ? 0 : Number(legacyManaAmount / postVotingPower);

    // Preserve the original sign and ensure we stay within valid weight range
    const finalWeight = Math.min(
      Math.max(
        hiveLegacyWeight < 0 ? -calculatedWeight : calculatedWeight,
        -HIVE_100_PERCENT
      ),
      HIVE_100_PERCENT
    );

    if (weightPercent !== 0 && finalWeight === 0) {
      throw new WaxError(
        `Calculated new vote weight is 0, likely due to low voting power or vesting shares. Legacy weight requested: ${weightPercent}%.`
      );
    }

    return new LegacyVoteOperation({
      author,
      permlink,
      voter,
      weight: finalWeight
    });
  }
}
