import type { custom_json } from '../../protocol';
import type { ITransactionBuilder } from '../../interfaces';
import type { TransactionBuilder } from '../transaction_builder';

import { WaxError } from '../../errors.js';
import Long from 'long';

export type TAccountName = string;

export interface IHiveAppsOperation {
  /**
   * Retrieves number of custom operations in the container that will be pushed into the TransactionBuilder
   *
   * @type {number}
   */
  length: number;
}

export class HiveAppsOperation implements IHiveAppsOperation {
  /**
   * @internal
   */
  public readonly customJsonContainer: Array<{ custom_json: custom_json }> = [];

  public get length(): number {
    return this.customJsonContainer.length;
  }

  /**
   * @internal
   */
  public push(op: custom_json): HiveAppsOperation {
    this.customJsonContainer.push({ custom_json: op });

    return this;
  }

  /**
   * Flushes (pushes) the staged operations to the TransactionBuilder
   *
   * @param {TransactionBuilder} tx transaction builder instance
   *
   * @internal
   */
  public flushOperations(tx: TransactionBuilder): void {
    this.customJsonContainer.forEach(tx.push.bind(tx));
  }
}

export abstract class HiveAppsOperationsBuilder<ChildT extends HiveAppsOperationsBuilder<any, BodyT>, BodyT extends object = object> {
  /**
   * Object bodies to stringify in the final hive apps operation form - <i>Stage</i>
   *
   * @type {Array<BodyT>}
   */
  protected body: Array<BodyT> = [];

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

    for(const body of this.body)
      this.builtCustomJsons.push({
        id: this.id,
        // XXX: We have to believe the node's fc JSON serializer with as_int64 directive, which allows stringified numbers
        // This may be a temporary solution that can be replaced by writing our custom JSON stringifier with nested object iteration:
        json: JSON.stringify(body, (_key: string, value: any) => value instanceof Long ? value.toString() : value),
        required_auths: auths,
        required_posting_auths: postingAuths
      });

    this.body.splice(0);

    return this as unknown as ChildT;
  }

  /**
   * Marks the current set of the hive apps operations as ready push
   *
   * @returns {IHiveAppsOperation} instance of the hive apps operation class that you can pass to the {@link ITransactionBuilder.push}
   */
  public build(): IHiveAppsOperation {
    return this.builtCustomJsons;
  }
}
