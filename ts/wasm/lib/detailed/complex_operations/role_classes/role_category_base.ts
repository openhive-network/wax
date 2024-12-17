import { IHiveChainInterface } from "../../../interfaces.js";
import { operation } from "../../../protocol.js";
import { TAccountName } from "../../hive_apps_operations/index.js";
import { IOperationSink } from "../../operation_base.js";
import { LevelBase } from "./level_base.js";

/**
 * When you create a new role category, you should extend this class.
 *
 * {@link RoleCategoryBase.authorities} should be initialized in the {@link RoleCategoryBase.init} function.
 * After initializing, Account update operation iterates over all of the levels included in the authorities object,
 * deducing the level names based on the key names.
 */
export abstract class RoleCategoryBase<AuthType extends Record<string, LevelBase<any>>> {
  public authorities!: Readonly<AuthType>;

  /**
   * Category name. It should be unique and marked `as const` for proper type narrowing
   * (See: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
   */
  public abstract category: string;

  /**
   * This function is responsible for gathering authority types for the given account.
   * It should return an object with keys as role names and values as authority objects.
   * Keys you return will have an impact on the role types supported by the account authority update operation
   */
  public abstract init(chain: IHiveChainInterface, account: TAccountName): Promise<void>;
  /**
   * This function should return an array of operations that will modify the user account roles.
   */
  public abstract finalize(sink: IOperationSink): operation[];

  /**
   * Indicates if any of the authority levels has changed since the last update.
   */
  public abstract get changed(): boolean;
}
