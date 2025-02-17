import type { TPublicKey } from "@hiveio/beekeeper";
import { authority } from "../../../../protocol.js";
import { TAccountName } from "../../../../hive_apps_operations/index.js";
import { WaxError } from "../../../../errors.js";
import { LevelBase } from "../../level_base.js";

export class HiveRoleAuthorityDefinition<TRole extends string> extends LevelBase<TRole> {
  public constructor(
    role: TRole,
    private readonly ensureCanUpdate: (level: TRole) => void = () => {},
  ) {
    super(role);
  }

  private HIVE_MAX_ACCOUNT_NAME_LENGTH!: number;

  private HIVE_ADDRESS_PREFIX!: string;

  private authority!: authority;

  private previousAuthority!: authority;

  public reset(): void {
    this.authority = structuredClone(this.previousAuthority);
  }

  /**
   * Checks if the authority has changed since the last update.
   *
   * This check does not rely on previous {@link add}, {@link remove} etc. calls, but rather on deep comparison of the authority object.
   */
  public get changed(): boolean {
    if (this.previousAuthority.weight_threshold !== this.authority.weight_threshold)
      return true;

    const accountKeys = Object.keys(this.authority.account_auths);
    const previousAccountKeys = Object.keys(this.previousAuthority.account_auths);

    if (accountKeys.length !== previousAccountKeys.length)
      return true;

    for (let i = 0; i < accountKeys.length; ++i)
      if (accountKeys[i] !== previousAccountKeys[i] || this.authority.account_auths[accountKeys[i]] !== this.previousAuthority.account_auths[previousAccountKeys[i]])
        return true;

    const keyKeys = Object.keys(this.authority.key_auths);
    const previouskeyKeys = Object.keys(this.previousAuthority.key_auths);

    if (keyKeys.length !== previouskeyKeys.length)
      return true;

    for (let i = 0; i < keyKeys.length; ++i)
      if (keyKeys[i] !== previouskeyKeys[i] || this.authority.key_auths[keyKeys[i]] !== this.previousAuthority.key_auths[previouskeyKeys[i]])
        return true;

    return false;
  }

  public init(maxAccountNameLength: number, hiveAddressPrefix: string, authority: authority) {
    this.authority = authority;
    this.previousAuthority = structuredClone(authority);
    this.HIVE_MAX_ACCOUNT_NAME_LENGTH = maxAccountNameLength;
    this.HIVE_ADDRESS_PREFIX = hiveAddressPrefix;
  }

  public get value(): Readonly<authority> {
    return this.authority;
  }

  protected addToRole(accountOrKey: TPublicKey | TAccountName, weight: number): void {
    if (accountOrKey.startsWith(this.HIVE_ADDRESS_PREFIX)) {
      this.authority.key_auths[accountOrKey] = weight;
    } else if (accountOrKey.length <= this.HIVE_MAX_ACCOUNT_NAME_LENGTH) {
      this.authority.account_auths[accountOrKey] = weight;
    } else {
      throw new WaxError("Invalid account or key");
    }
  }

  protected removeFromRole(accountOrKey: TPublicKey | TAccountName): void {
    if (accountOrKey.startsWith(this.HIVE_ADDRESS_PREFIX)) {
      if(this.authority.key_auths[accountOrKey])
        delete this.authority.key_auths[accountOrKey];
    } else if (accountOrKey.length <= this.HIVE_MAX_ACCOUNT_NAME_LENGTH) {
      if(this.authority.account_auths[accountOrKey])
        delete this.authority.account_auths[accountOrKey];
    } else {
      throw new WaxError("Invalid account or key");
    }
  }

  protected ensureValidAccountOrKey(accountOrKey: TPublicKey | TAccountName): void {
    if (!accountOrKey.startsWith(this.HIVE_ADDRESS_PREFIX) && accountOrKey.length > this.HIVE_MAX_ACCOUNT_NAME_LENGTH)
      throw new WaxError("Invalid account or key");
  }

  protected getTuple(accountOrKey: TPublicKey | TAccountName): ([string, number]) | void {
    if (accountOrKey.startsWith(this.HIVE_ADDRESS_PREFIX)) {
      if(this.authority.key_auths[accountOrKey])
        return [accountOrKey, this.authority.key_auths[accountOrKey]];
    } else if (accountOrKey.length <= this.HIVE_MAX_ACCOUNT_NAME_LENGTH) {
      if(this.authority.account_auths[accountOrKey])
        return [accountOrKey, this.authority.account_auths[accountOrKey]];
    }
  }

  /**
   * Adds an account or key to the currently selected role with specified weight.
   * If the account or key already exists, its weight is updated.
   *
   * @note If you want to change the role, you need to call {@link withRole} method first.
   * @param {TPublicKey | TAccountName} accountOrKey Account or key to be added to the currently selected role.
   * @param {?number} weight Account or key weight in the authority. Default is 1.
   * @returns itself
   */
  public add(accountOrKey: TPublicKey | TAccountName, weight: number = 1): this {
    this.ensureCanUpdate(this.level);

    this.addToRole(accountOrKey, weight);

    return this;
  }

  /**
   * Replaces the account or key with a new one in the currently selected role or changes the weight of the existing account or key.
   *
   * @note If you want to change the role, you need to call {@link withRole} method first.
   * @param {TPublicKey | TAccountName} accountOrKey Account or key to be added to the currently selected role.
   * @param {number} weight Account or key weight in the authority.
   * @param {(TPublicKey | TAccountName)} newKeyOrAccount Account or key to replace the old one. If not provided, the account or key is not replaced, but weight is changed.
   * @returns itself
   */
  public replace(accountOrKey: TPublicKey | TAccountName, weight: number, newKeyOrAccount: TPublicKey | TAccountName = accountOrKey): this {
    this.ensureCanUpdate(this.level);

    if (accountOrKey !== newKeyOrAccount) {
      this.ensureValidAccountOrKey(newKeyOrAccount);

      this.remove(accountOrKey);
    }
    this.addToRole(newKeyOrAccount, weight);

    return this;
  }

  /**
   * Removes given account or key from the currently selected role.
   * Does nothing if the account or key is not present.
   *
   * @param {TPublicKey | TAccountName} accountOrKey Account or key to be removed from the currently selected role.
   * @returns itself
   */
  public remove(accountOrKey: TPublicKey | TAccountName): this {
    this.ensureCanUpdate(this.level);

    this.removeFromRole(accountOrKey);

    return this;
  }

  /**
   * Checks if the account or key is present in the currently selected role.
   *
   * @param {TPublicKey | TAccountName} accountOrKey Account or key to be checked.
   * @param {?number} weight Account or key weight in the authority. If provided, the weight is checked as well.
   * @returns {boolean} Either true or false depending on whether the account or key is present in the currently selected role.
   */
  public has(accountOrKey: TPublicKey | TAccountName, weight?: number): boolean {
    const tuple = this.getTuple(accountOrKey);

    if (weight !== undefined && tuple) {
      if (tuple[1] !== weight)
        return false;
    }

    return !!tuple;
  }

  /**
   * Sets weigth treshold for the currently selected role.
   *
   * @param {?number} treshold weight treshold for the currently selected role. Defaults to 1.
   * @returns itself
   */
  public setTreshold(treshold: number = 1): this {
    this.ensureCanUpdate(this.level);

    this.authority.weight_threshold = treshold;

    return this;
  }

  /**
   * Clears the currently selected role making it null authority. See {@link isNullAuthority} method.
   *
   * @returns itself
   */
  public clear(): this {
    this.ensureCanUpdate(this.level);

    this.authority.account_auths = {};
    this.authority.key_auths = {};
    this.authority.weight_threshold = 1;

    return this;
  }

  /**
   * Checks if the currently selected role is null - everyone can access your account - no account nor key authorities.
   *
   * @returns {boolean} Either true or false depending on whether the authority is null or not.
   */
  public get isNullAuthority(): boolean {
    return Object.keys(this.authority.account_auths).length === 0 && Object.keys(this.authority.key_auths).length === 0;
  }
}
