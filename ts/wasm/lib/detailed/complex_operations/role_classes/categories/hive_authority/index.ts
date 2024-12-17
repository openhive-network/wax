import { IHiveChainInterface } from "../../../../../interfaces.js";
import { authority, operation } from "../../../../../protocol.js";
import { TAccountName } from "../../../../hive_apps_operations/factory.js";
import { IOperationSink } from "../../../../operation_base.js";
import { RoleCategoryBase } from "../../role_category_base.js";
import { account_update2 } from '../../../../../proto/account_update2.js';
import { WaxError } from "../../../../../errors.js";
import { HiveRoleAuthorityDefinition } from "./hive_role_authority_definition.js";
import { HiveRoleMemoKeyDefinition } from "./hive_role_memo_key.js";

export type THiveRoles = {
  active: HiveRoleAuthorityDefinition<"active">;
  owner: HiveRoleAuthorityDefinition<"owner">;
  posting: HiveRoleAuthorityDefinition<"posting">;
  memo: HiveRoleMemoKeyDefinition;
}

export class HiveAccountCategory extends RoleCategoryBase<THiveRoles> {
  private account!: string;

  public category = "hive" as const;

  public constructor() {
    super();

    this.authorities = {
      active: new HiveRoleAuthorityDefinition("active"),
      posting: new HiveRoleAuthorityDefinition("posting"),
      owner: new HiveRoleAuthorityDefinition("owner"),
      memo: new HiveRoleMemoKeyDefinition()
    };
  }

  public async init(chain: IHiveChainInterface, account: TAccountName): Promise<void> {
    this.account = account;

    const { accounts: [chainAccount] } = await chain.api.database_api.find_accounts({ accounts: [account] });

    if (chainAccount === undefined)
      throw new WaxError(`Account ${account} not found on the chain`);

    const { active, posting, owner, memo_key: memoKey } = chainAccount;

    const transformEntries = (input: {"0": string; "1": number}[]) => Object.fromEntries(input.map(data => [data[0], data[1]]));

    this.authorities.active.init(Number.parseInt(chain.config.HIVE_MAX_ACCOUNT_NAME_LENGTH), chain.config.HIVE_ADDRESS_PREFIX, {
      weight_threshold: active.weight_threshold,
      account_auths: transformEntries(active.account_auths),
      key_auths: transformEntries(active.key_auths)
    });

    this.authorities.owner.init(Number.parseInt(chain.config.HIVE_MAX_ACCOUNT_NAME_LENGTH), chain.config.HIVE_ADDRESS_PREFIX, {
      weight_threshold: owner.weight_threshold,
      account_auths: transformEntries(owner.account_auths),
      key_auths: transformEntries(owner.key_auths)
    });

    this.authorities.posting.init(Number.parseInt(chain.config.HIVE_MAX_ACCOUNT_NAME_LENGTH), chain.config.HIVE_ADDRESS_PREFIX, {
      weight_threshold: posting.weight_threshold,
      account_auths: transformEntries(posting.account_auths),
      key_auths: transformEntries(posting.key_auths)
    });

    this.authorities.memo.init(chain.config.HIVE_ADDRESS_PREFIX, memoKey);
  }

  private canAuthorityBeSatisfied(auth: authority): boolean {
    if (Object.keys(auth.account_auths).length === 0 && Object.keys(auth.key_auths).length === 0)
      return true; // Null authority - can be satisfied

    const totalAccountAuthsWeight = Object.values(auth.account_auths).reduce((total, weight) => total + weight, 0);
    const totalKeyAuthsWeight = Object.values(auth.key_auths).reduce((total, weight) => total + weight, 0);

    // Check if the sum of all account_auths and key_auths weights is greater or equal to the required threshold
    if (totalAccountAuthsWeight + totalKeyAuthsWeight < auth.weight_threshold)
      return false;

    return true;
  }

  public finalize(_sink: IOperationSink): operation[] {
    const active = this.authorities.active.changed ? this.authorities.active.value : undefined;
    const posting = this.authorities.posting.changed ? this.authorities.posting.value : undefined;
    const owner = this.authorities.owner.changed ? this.authorities.owner.value : undefined;
    const memoKey = this.authorities.memo.changed ? this.authorities.memo.value : undefined;

    if (!active && !posting && !owner && !memoKey)
      return [];

    if (active && !this.canAuthorityBeSatisfied(active))
      throw new WaxError("Active authority cannot be ever satisfied due to insufficient weight");
    if (owner && !this.canAuthorityBeSatisfied(owner))
      throw new WaxError("Owner authority cannot be ever satisfied due to insufficient weight");
    if (posting && !this.canAuthorityBeSatisfied(posting))
      throw new WaxError("Posting authority cannot be ever satisfied due to insufficient weight");

    return [{
      account_update2: account_update2.fromPartial({
        account: this.account,
        active,
        owner,
        posting,
        memo_key: memoKey
      })
    }];
  }
}
