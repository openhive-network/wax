import { DEFAULT_WAX_OPTIONS } from "./base";
import { HiveChainApi, TChainReferenceData } from "./chain_api";
import { OperationBase } from "./operation_base";
import { Transaction } from "./transaction";
import type { authority, account_create, account_create_with_delegation, comment, create_claimed_account, recurrent_transfer, transfer, transfer_from_savings, transfer_to_savings, account_update2, account_update } from "../protocol";
import { OperationVisitor } from "../visitor";

import { IOnlineTransaction, TTimestamp } from "../interfaces";
import { operation } from "../protocol";
import type { TAccountName } from "./hive_apps_operations";
import type { IVerifyAuthorityTrace } from "../verify_authority_trace_interface";
import { WaxError} from "../errors";

type TAuthorityHolder = {
  owner?: authority, /// unfortunetely protobuf defs have optional values allowed on defined authority levels
  active?: authority,
  posting?: authority
};

/**
 * Helper operation visitor class, perforiming on-chain verification in a way specific to given operation type.
 */
class OnChainOperationValidator extends OperationVisitor {
  private readonly privateKeyScannerData: Map<TAccountName, string[]> = new Map();
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

  public override account_update2(op: account_update2): void {
    this.collectModifiedAuthorityData(op.account, op);
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
    const accountAuthorities = await this.chain.collectAccountAuthorities(...Array.from(inputAccounts));

    /// TODO: Maybe it would be worth to try create a promise for each call and spawn them asynchronuously

    for(const [accountName, [authorities, memo_key]] of accountAuthorities) {
      const collectedTexts = this.privateKeyScannerData.get(accountName)!;
      for(const text of collectedTexts) {
        this.chain.scanForMatchingPrivateKeys(text, accountName, authorities, memo_key);
      }
    }
  }

  private collectModifiedAuthorityData(_:TAccountName, __: TAuthorityHolder): void {
    /// TODO: implement actual collection
  }

  private async processChangedAuthorityData(): Promise<void> {
    /// TODO: implement actual checks
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
    super(chain, chainReferenceData.head_block_id, expirationRefTime, expirationTime ?? "+1m");
  }
    
  public override pushOperation(op: operation | OperationBase): OnlineTransaction {
    super.pushOperation(op);
    return this;
  }

  public async generateAuthorityVerificationTrace(): Promise<IVerifyAuthorityTrace> {
    const finalTransaction = this.transaction;

    if(finalTransaction.signatures.length === 0)
      throw new WaxError("Transaction is not signed yet");

    throw new WaxError("Not implemented yet");
  }

  public async performOnChainVerification(): Promise<void> {
    const finalTransaction = this.transaction;

    const validator = new OnChainOperationValidator(this.chain);

    await validator.validate(finalTransaction.operations);
  }


};
