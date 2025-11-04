import { operation } from "../protocol.js";
import type { TAccountName } from "../hive_apps_operations/index.js";
import { OperationBase, IOperationSink } from "../operation_base.js";
import type { IHiveChainInterface } from "../interfaces.js";
import { HiveAccountCategory } from "./role_classes/categories/hive_authority/index.js";
import { RoleCategoryBase } from "./role_classes/role_category_base.js";
import { WaxError } from "../errors.js";

export type { THiveRoles, HiveAccountCategory, HiveRoleAuthorityDefinition, HiveRoleMemoKeyDefinition } from "./role_classes/categories/hive_authority/index.js";

// Here are all of the role categories. They are automatically parsed. Add new categories here
export const AuthorityRoleCategories = [
  HiveAccountCategory
] as const satisfies Readonly<Array<(new () => RoleCategoryBase<any>)>>;

export type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends
  (k: infer I) => void ? I : never;

export type TRolesStruct = UnionToIntersection<InstanceType<typeof AuthorityRoleCategories[number]>["authorities"]>;
export type TRole = keyof TRolesStruct;

export type TRoleContainerNames = InstanceType<typeof AuthorityRoleCategories[number]>["category"];

export type TRoleKeyToValueMap = {
  [K in keyof TRolesStruct]: Omit<TRolesStruct[K], 'init' | 'enforceModifications'>
};

export type TRoleContainerKeyToValueMap = {
  [C in InstanceType<typeof AuthorityRoleCategories[number]> as C["category"]]: {
    [K in keyof C["authorities"]]: Omit<C["authorities"][K], 'init' | 'enforceModifications'>
  }[keyof C["authorities"]];
};

/**
 * Online operation - it is automatically filled in with the data acquired from the chain API.
 *
 * The purpose of this operation is to simplify account authority update process by automatic gathering current authority data
 * from blockchain and then supplementing them by provided action methods. Operation is designed to support different authority categories
 * (right now is implemented Hive builtin authority).
 *
 * It is initialized with all of the supported roles for the given account using {@link AccountAuthorityUpdateOperation.createFor} automatically, so
 * for example: If you want to add a single key to the active level of the account, you can just add the key, without worrying about your other key authorities.
 *
 * After initialization, you can use the {@link AccountAuthorityUpdateOperation.role} method to retrieve the role instance for the given role level.
 *
 * @example
 * ```ts
 * const operation = await AccountAuthorityUpdateOperation.createFor(myChain, "initminer");
 *
 * const active = operation.role("active");
 * active.add(myKey);
 *
 * const memo = operation.role("memo");
 * memo.set(myKey);
 * ```
 */
export class AccountAuthorityUpdateOperation extends OperationBase {
  private constructor(
    private readonly instancesPerContainerName: Map<TRoleContainerNames, RoleCategoryBase<any>>,
    private readonly instancesPerRoleName: Map<TRole, RoleCategoryBase<any>>
  ) {
    super();
  }

  /**
   * Creates an instance of AccountAuthorityUpdateOperation with all supported roles pre-initialized for the given account.
   *
   * @param {IHiveChainInterface} chain chain interface required for online user roles parsing
   * @param {TAccountName} account account we will operate on
   * @returns {Promise<AccountAuthorityUpdateOperation>} initialized account authority update operation
   */
  public static async createFor(chain: IHiveChainInterface, account: TAccountName): Promise<AccountAuthorityUpdateOperation> {
    const roles = new Map<TRole, RoleCategoryBase<any>>();
    const instances = new Map(AuthorityRoleCategories.map(role => {
      const container = new role();

      return [container.category, container];
    }));

    for (const roleClass of instances.values()) {
      await roleClass.init(chain, account);

      for (const roleName in roleClass.authorities)
        roles.set(roleName as TRole, roleClass);
    }

    return new AccountAuthorityUpdateOperation(instances, roles);
  }

  /**
   * Enforces the requirement for **owner** role authorization when modifying **active** or **posting** roles.
   * 
   * **HF 28** introduces stricter matching between the authority role required by a given operation and the role used to authorize the transaction.
   * - Since modifying **active** or **posting** roles requires **active** authority at the time of transaction signing, the pre-HF28 behavior — which allowed signing with the **owner** key — will be **disallowed**.  
   * - This change may pose difficulties for users who have lost their active keys and attempt to use their owner key to set a new one.  
   * - To address this, the function allows the inclusion — within the `account_update2_operation` generated internally — of elements that enforce the **owner** role requirement, specifically through an ineffective change of the owner authority to the same value currently recorded on-chain.
   */
  public enforceOwnerRoleAuthorisation(): void {
    const roleInstance = this.instancesPerRoleName.get("owner")!;
    const ownerRole = roleInstance.authorities["owner"];
    ownerRole.enforceModifications()
  }

  /**
   * Returns the role instance for the given role level.
   *
   * @param {KRole} level role level to retrieve
   * @returns Role class instance for the given role level
   */
  public role<KRole extends TRole>(level: KRole): TRoleKeyToValueMap[KRole] {
    const roleInstance = this.instancesPerRoleName.get(level);

    if (!roleInstance)
      throw new Error(`Role level ${level} is not initialized`);

    return roleInstance.authorities[level];
  }

  /**
   * Returns all of the roles for the given role category.
   *
   * Note: You can differentiate between different role categories by using the `level` property
   *
   * @param {KRoleContainer} category role category to retrieve
   * @returns Iterable of all roles for the given role category
   *
   * @example
   * ```ts
   * for(const role of operation.roles("hive"))
   *   if (role.level === "memo")
   *     role.set(myKey);
   *   else
   *     role.add(myKey);
   * ```
   */
  public roles<KRoleContainer extends keyof TRoleContainerKeyToValueMap>(category: KRoleContainer): Iterable<TRoleContainerKeyToValueMap[KRoleContainer]> {
    const roleInstance = this.instancesPerContainerName.get(category);

    if (!roleInstance)
      throw new Error(`Role category ${category} is not initialized`);

    return Object.values(roleInstance.authorities);
  }

  /**
   * Checks if the authority has changed since the last update and it is possible to transmit this operation (any changes applied)
   */
  public get isEffective(): boolean {
    let effective = false;

    for (const role of this.instancesPerContainerName.values())
      effective ||= role.changed;

    return effective;
  }

  /**
   * @internal
   */
  public finalize(sink: IOperationSink): Iterable<operation> {
    const operations: operation[] = [];

    for (const role of this.instancesPerContainerName.values())
      operations.push(...role.finalize(sink));

    if (operations.length === 0)
      throw new WaxError("No operations updating account authority generated");

    return operations;
  }
}
