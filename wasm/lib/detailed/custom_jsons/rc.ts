import type { NaiAsset } from "../index";
import { HiveAppsOperation, TAccountName } from './factory.js';
import Long from 'long';

export class ResourceCreditsOperationData {
  public constructor(
    public readonly from: TAccountName,
    public readonly rc: NaiAsset,
    public readonly delegatees: Array<TAccountName>
  ) {}
}

export class ResourceCreditsOperation extends HiveAppsOperation<ResourceCreditsOperation> {
  protected readonly id = "rc";

  /**
   * Delegates resource credits to given account(s)
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                Also it will be the account which delegates resource credits (aka from)
   * @param {string | number | Long} maxRc maximum resource credits delegated (must pe non-negative value)
   * @param {TAccountName} delegatee target account to delegate. Remember you cannot delegate to yourself!
   * @param {TAccountName[]} otherDelegatees optional list of other target accounts to delegate.
   *                                         In the standard node configuration there may be 100 delegatees at most.
   *
   * @returns {ResourceCreditsOperation} itself
   */
  public delegate(workingAccount: TAccountName, maxRc: string | number | Long, delegatee: TAccountName, ...otherDelegatees: TAccountName[]): ResourceCreditsOperation {
    const delegatees = [ delegatee, ...otherDelegatees ];

    this.body.push([
      "delegate_rc",
      {
        from: workingAccount,
        delegatees,
        max_rc: Long.fromValue(maxRc),
        extensions: []
      }
    ]);

    return this;
  }

  /**
   * Removes resource credits delegation from given account(s)
   *
   * @param {string} workingAccount The account which has to authorize transaction.
   *                                Also it will be the account which delegated resource credits in the past (aka from)
   * @param {TAccountName} delegatee target account to remove the delegation from.
   * @param {TAccountName[]} otherDelegatees optional list of other target accounts to remove the delegation from.
   *
   * @returns {ResourceCreditsOperation} itself
   */
  public removeDelegation(workingAccount: TAccountName, delegatee: TAccountName, ...otherDelegatees: TAccountName[]): ResourceCreditsOperation {
    return this.delegate(workingAccount, 0, delegatee, ...otherDelegatees);
  }
}
