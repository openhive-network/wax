import type { custom_json, operation } from '../../protocol';
import type { ITransactionBuilder } from '../../interfaces';
import { WaxError } from '../../errors.js';

export type TAccountName = string;

export class HiveAppsOperation {
  /**
   * @internal
   */
  public readonly customJsonContainer: Array<{ custom_json: custom_json }> = [];

  /**
   * @internal
   */
  public push(op: custom_json): HiveAppsOperation {
    this.customJsonContainer.push({ custom_json: op });

    return this;
  }

  /**
   * Flushes (pushes) the staged operations to the given container
   *
   * @param {Array<operation>} ops operations array to flush the hive apps operations to
   */
  public flushOperations(ops: Array<operation>): void {
    ops.push(...this.customJsonContainer);
  }
}

export abstract class HiveAppsOperationsBuilder<ChildT extends HiveAppsOperationsBuilder<any, BodyT>, BodyT extends object = object> {
  /**
   * Object body to stringify in the final hive apps operation form - <i>Stage</i>
   *
   * @type {BodyT}
   */
  protected body: BodyT = {} as BodyT;

  /**
   * Id of your custom hive apps operation
   *
   * @type {string}
   */
  protected readonly abstract id: string;

  private readonly builtCustomJsons: HiveAppsOperation = new HiveAppsOperation();

  /**
   * Authorizes the currently staged hive apps operation, commits it to the {@link HiveAppsOperation} instance and clears the stage
   *
   * @param {string[] | string} requiredPostingAuths required posting authorities (can be an account name)
   * @param {?string[]} requiredAuths required authorities (defaults to the empty array)
   *
   * @returns {ChildT} itself
   */
  public authorize(requiredPostingAuths: string[] | string, requiredAuths: string[] = []): ChildT {
    const postingAuths = typeof requiredPostingAuths === "string" ? [ requiredPostingAuths ] : requiredPostingAuths;
    const auths = typeof requiredAuths === "undefined" ? [] : requiredAuths;

    if(auths.length === 0 && postingAuths.length === 0)
      throw new WaxError("Missing authority");

    this.builtCustomJsons.push({
      id: this.id,
      json: JSON.stringify(this.body),
      required_auths: auths,
      required_posting_auths: postingAuths
    });

    this.body = {} as BodyT;

    return this as unknown as ChildT;
  }

  /**
   * Marks the current set of the hive apps operations as ready push
   *
   * @returns {HiveAppsOperation} instance of the hive apps operation class that you can pass to the {@link ITransactionBuilder.push}
   */
  public build(): HiveAppsOperation {
    return this.builtCustomJsons;
  }
}
