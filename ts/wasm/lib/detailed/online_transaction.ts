import { DEFAULT_WAX_OPTIONS } from "./base";
import { HiveChainApi, TChainReferenceData } from "./chain_api";
import { OperationBase } from "./operation_base";
import { Transaction, TTransactionRequiredAuthorities } from "./transaction";
import type { authority, account_create, account_create_with_delegation, comment, create_claimed_account, recurrent_transfer, transfer, transfer_from_savings, transfer_to_savings, account_update2, account_update } from "./protocol";
import { OperationVisitor } from "./visitor";

import type { IOnlineTransaction, ITransaction, TPublicKey, TTimestamp } from "./interfaces";
import { operation } from "./protocol";
import { TAccountName } from "./hive_apps_operations";
import type { IVerifyAuthorityTrace } from "./verify_authority_trace_interface";

import { AccountAuthorityCachingProvider } from "./util/account_authority_caching_provider";
import { convertAuthorityTrace } from "./verify_authority_trace";
import type { TSignature } from "@hiveio/beekeeper";
import { authority_verification_trace, MapStringUInt16, required_authority_collection, wax_authority } from "../build_wasm/wax.common";

type TAuthorityHolder = {
  owner?: authority, /// unfortunetely protobuf defs have optional values allowed on defined authority levels
  active?: authority,
  posting?: authority
};

const MAX_ACCOUNTS_PER_CALL = 100;
type TAuthorityEntriesCollection = { [key: string]: number };

/**
 * Helper operation visitor class, perforiming on-chain verification in a way specific to given operation type.
 */
class OnChainOperationValidator extends OperationVisitor {
  private readonly privateKeyScannerData: Map<TAccountName, string[]> = new Map();
  private readonly accountsToCheckExists = new Set<string>();
  private processedOperation!: operation;
  public constructor(private readonly chain: HiveChainApi) {
    super();
  }

  public async validate(operations: operation[]) {
    for(const op of operations) {
      this.processedOperation = op;
      this.accept(op);
    }

    await this.processSecurityLeakScannerData();
    await this.processChangedAuthorityData();
    await this.ensureAccountsExist();
  }

  public override comment(op: comment): void {
    this.collectKeyLeakScannerData(op.body, op.permlink);
  }

  public override transfer(op: transfer): void {
    this.collectKeyLeakScannerData(op.memo);
  }

  public override transfer_to_savings(op: transfer_to_savings): void {
    this.collectKeyLeakScannerData(op.memo);
  }

  public override transfer_from_savings(op: transfer_from_savings): void {
    this.collectKeyLeakScannerData(op.memo);
  }

  public override recurrent_transfer(op: recurrent_transfer): void {
    this.collectKeyLeakScannerData(op.memo);
  }

  public override account_create(op: account_create): void {
    this.collectModifiedAuthorityData(op.creator, op);
  }

  public override account_create_with_delegation(op: account_create_with_delegation): void {
    this.collectModifiedAuthorityData(op.creator, op);
  }

  public override create_claimed_account(op: create_claimed_account): void {
    this.collectModifiedAuthorityData(op.creator, op);
  }

  public override account_update(op: account_update): void {
    this.collectModifiedAuthorityData(op.account, op);
  }

  public async account_update2(op: account_update2): Promise<void> {
    this.collectModifiedAuthorityData(op.account, op);

    this.collectOnlineAccounts(op.account, op);
  }

  private async ensureAccountsExist(): Promise<void> {
    const accountsToCheck = Array.from(this.accountsToCheckExists);

    for(let i = 0; i < accountsToCheck.length; i += MAX_ACCOUNTS_PER_CALL) {
      const slice = accountsToCheck.slice(i, i + MAX_ACCOUNTS_PER_CALL);

      // We use rc_api.find_rc_accounts instead of database_api.find_accounts, because rc api responds with less data, which results in faster response time, having same functionality
      const { rc_accounts: rcAccounts } = await this.chain.api.rc_api.find_rc_accounts({ accounts: slice });

      if (rcAccounts.length !== slice.length) {
        const missingAccounts = slice.filter(account => !rcAccounts.some(rcAccount => rcAccount.account === account));

        throw new Error(`Accounts "${missingAccounts.join('", "')}" do not exist!`);
      }
    }
  }

  private collectKeyLeakScannerData(...contents: string[]): void {
    const impactedAccounts = this.chain.operationGetImpactedAccounts(this.processedOperation);

    for(const account of impactedAccounts) {
      const collectedStrings = this.privateKeyScannerData.get(account);
      if(collectedStrings !== undefined)
        this.privateKeyScannerData.set(account, collectedStrings.concat(contents));
      else
        this.privateKeyScannerData.set(account, contents);
    }
  }

  private async processSecurityLeakScannerData(): Promise<void> {
    const inputAccounts = this.privateKeyScannerData.keys();
    const accountAuthorities = await this.chain.collectAccountAuthorities(true, ...Array.from(inputAccounts));

    /// TODO: Maybe it would be worth to try create a promise for each call and spawn them asynchronuously

    for(const [accountName, [authorities, memo_key]] of accountAuthorities) {
      const collectedTexts = this.privateKeyScannerData.get(accountName)!;
      for(const text of collectedTexts) {
        this.chain.scanForMatchingPrivateKeys(text, accountName, authorities, memo_key);
      }
    }
  }

  private collectModifiedAuthorityData(_: TAccountName, __: TAuthorityHolder): void {
    /// TODO: implement actual collection
  }

  private async processChangedAuthorityData(): Promise<void> {
    /// TODO: implement actual checks
  }

  private collectOnlineAccounts(accountName: TAccountName, authHolder: TAuthorityHolder): void {
    this.accountsToCheckExists.add(accountName);

    for(const authType of ["active", "posting", "owner"])
      if (authHolder[authType])
        for(const account in authHolder[authType].account_auths)
          this.accountsToCheckExists.add(account);
  }

};

/**
 * Extends standard Transaction implementation by ability to perform a verification step which requires a chain APIs access,
 */
export class OnlineTransaction extends Transaction implements IOnlineTransaction {

  public constructor(private readonly chain: HiveChainApi, chainReferenceData: TChainReferenceData, expirationTime?: TTimestamp) {
    /** Let's use a head block time as expiration reference time for other chains than mainnet. For mainnet realtime is best to eliminate potential API node time screw
     *  For other (testing) chains it simplifies APPs rapid prototyping on deployments being mirrornet specific.
    */
    const expirationRefTime = chain.chainId != DEFAULT_WAX_OPTIONS.chainId ? chainReferenceData.head_block_time : undefined;
    super(chain, chainReferenceData.head_block_id, expirationRefTime, expirationTime);
  }

  public override pushOperation(op: operation | OperationBase): OnlineTransaction {
    super.pushOperation(op);
    return this;
  }

  public async generateAuthorityVerificationTrace(useLegacySerialization: boolean = false, externalTx?: ITransaction): Promise<IVerifyAuthorityTrace> {
    const dataSource = externalTx ?? this;

    const signatures = dataSource.transaction.signatures;

    const requiredAuths = dataSource.requiredAuthorities;
    const signatureKeys = useLegacySerialization? dataSource.legacy_signatureKeys : dataSource.signatureKeys;

    const actualSignatureKeys = new this.api.wax.VectorString();
    for(const key of signatureKeys)
      actualSignatureKeys.push_back(key);

    const actualRequiredAuthorities = this.convertRequiredAuthorities(requiredAuths);

    const commonAccountSet = new Set(requiredAuths.active);
    for(const a of requiredAuths.posting)
      commonAccountSet.add(a);

    for(const a of requiredAuths.owner)
      commonAccountSet.add(a);

    const authorityCache = new AccountAuthorityCachingProvider(this.chain, commonAccountSet);

    const impl = this.api.wax.IAccountAuthorityProvider.implement(authorityCache);

    let receivedTrace: authority_verification_trace;

    do {
      /// Acquire data for each authority layer
      await authorityCache.acquireData();
      receivedTrace = this.api.protocol.cpp_trace_authority_verification(actualRequiredAuthorities, actualSignatureKeys, impl);
    }
    while(authorityCache.canContinue);

    const signatureKeyInfo: Map<TPublicKey, TSignature> = new Map();

    for(let i = 0; i < signatureKeys.length; ++i) {
      const key = signatureKeys[i];
      const signature = signatures[i];

      signatureKeyInfo.set(key, signature);
    }

    return convertAuthorityTrace(signatureKeyInfo, receivedTrace);
  }

  public async performOnChainVerification(): Promise<void> {
    const finalTransaction = this.transaction;

    const validator = new OnChainOperationValidator(this.chain);

    await validator.validate(finalTransaction.operations);
  }

  public convertRequiredAuthorities(requiredAuthorities: TTransactionRequiredAuthorities): required_authority_collection {
    const posting_accounts = new this.api.wax.VectorString();
    const active_accounts = new this.api.wax.VectorString()
    const owner_accounts = new this.api.wax.VectorString()
    const other_authorities = new this.api.wax.VectorWaxAuthority();

    for(const account of requiredAuthorities.posting)
      posting_accounts.push_back(account);

    for(const account of requiredAuthorities.active)
      active_accounts.push_back(account);

    for(const account of requiredAuthorities.owner)
      owner_accounts.push_back(account);

    const transformEntries = (entries: TAuthorityEntriesCollection, storage: MapStringUInt16): MapStringUInt16 => {
      Object.keys(entries).reduce((storage: MapStringUInt16, keyOrAccount: string): MapStringUInt16 => {
        storage.set(keyOrAccount, entries[keyOrAccount]);
      return storage;
      }, storage);

      return storage;
    }

    for(const a of requiredAuthorities.other) {
      const targetAuthority: wax_authority = {
        weight_threshold: a.weight_threshold,
        account_auths: transformEntries(a.account_auths, new this.api.wax.MapStringUInt16()),
        key_auths: transformEntries(a.key_auths, new this.api.wax.MapStringUInt16())
      };
      other_authorities.push_back(targetAuthority);
    }

    return {
      posting_accounts,
      active_accounts,
      owner_accounts,
      other_authorities
    };
  }

};
