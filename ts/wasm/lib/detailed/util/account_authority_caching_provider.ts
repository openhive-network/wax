import {HiveChainApi, TAccountAuthorityCollection}  from "../chain_api";
import { TAccountName } from "../hive_apps_operations";
import type { IAccountAuthorityProvider, wax_authority, wax_authorities , ClassHandle } from "../../wax_module";
import type { TPublicKey } from "../interfaces";
import { WaxError } from "../errors";

/**
 * Helper class used during traced authority verification process.
 *
 * Usage flow:
 * 1. instantiate by passing chain (needed to fetch account authorities) and initial set of requested accounts
 * 2. call acquireData to fetch account authorities for requested accounts. This will clear current set of requested account names
 * 3. call a account verification tracer, which effectively will use implemented here IAccountAuthorityProvider, what would collect another set of requested account names.
 * 4. call canContinue() to check if there are any more accounts to fetch authorities for
 * @internal
 */
export class AccountAuthorityCachingProvider implements IAccountAuthorityProvider {
  private readonly cache: TAccountAuthorityCollection = new Map();
  private readonly witnessDataCache: Map<TAccountName, TPublicKey> = new Map();

  private readonly unknownAccounts: Set<TAccountName> = new Set();
  private readonly unknownWitnessAccounts: Set<TAccountName> = new Set();
  private readonly requestedWitnessAccounts: Set<TAccountName> = new Set();

  constructor(private readonly chain: HiveChainApi, private readonly requestedAccounts: Set<TAccountName> = new Set()) {
  }

  /**
   * Allows to collect data for set of requested accounts, being asked for authorities in previous round of getAccountAuthority calls.
   */
  public async acquireData(): Promise<void> {
    const accountAuthorities = await this.chain.collectAccountAuthorities(false, ...this.requestedAccounts);

    /// TODO: Use set operations to evaluate missing accounts (this.requestedAccounts - accountAuthorities.keys()).

    for(const [account, authorities] of accountAuthorities) {
      this.cache.set(account, authorities);
    }

    this.requestedAccounts.clear();

    const witnessData = await this.chain.collectWitnessSigningKeys(false, ...this.requestedWitnessAccounts);

    /// TODO: Use set operations to evaluate missing accounts (this.requestedWitnessAccounts - witnessData.keys()).

    for(const [account, publicKey] of witnessData)
      this.witnessDataCache.set(account, publicKey);

    this.requestedWitnessAccounts.clear();
  }

  public get canContinue(): boolean {
    return this.requestedAccounts.size > 0;
  }

  public getAccountAuthority(account: string): [wax_authorities, TPublicKey] | undefined {
    if(this.cache.has(account))
      return this.cache.get(account)!;

    if(this.unknownAccounts.has(account))
        return undefined;

    this.requestedAccounts.add(account);
    return undefined;
  }

  public getWitnessPublicKey(account: string): string|undefined {
    if(this.witnessDataCache.has(account))
      return this.witnessDataCache.get(account)!;

    if(this.unknownWitnessAccounts.has(account))
        return undefined;

    this.requestedWitnessAccounts.add(account);
    return undefined;
  }

};
