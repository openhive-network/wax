import { WaxError } from '../../errors.js';
import Long from 'long';
import { OperationBuilder } from '../operation_builder.js';

export type TAccountName = string;

export abstract class HiveAppsOperationsBuilder<ChildT extends HiveAppsOperationsBuilder<any, BodyT>, BodyT extends object = object> extends OperationBuilder {
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

  /**
   * Authorizes the currently staged hive apps operation, commits it to the {@link BuiltHiveAppsOperation} instance and clears the stage
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
      this.push({
        custom_json: {
          id: this.id,
          // XXX: We have to believe the node's fc JSON serializer with as_int64 directive, which allows stringified numbers
          // This may be a temporary solution that can be replaced by writing our custom JSON stringifier with nested object iteration:
          json: JSON.stringify(body, (_key: string, value: any) => value instanceof Long ? value.toString() : value),
          required_auths: auths,
          required_posting_auths: postingAuths
        }
      });

    this.body.splice(0);

    return this as unknown as ChildT;
  }
}
