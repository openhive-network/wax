import type { IBinaryViewNode, IBinaryViewOutputData, IEncryptingTransaction, ITransaction, TBlockHash, THexString, TPublicKey, TTimestamp, TTransactionId } from "./interfaces";

import { authority, transaction, type operation } from "./protocol.js";
import { WaxBaseApi } from "./base_api.js";
import { calculateExpiration } from "./util/expiration_parser.js";
import { OperationBase } from "./operation_base";
import { EEncryptionType, EncryptionVisitor } from "./encryption_visitor.js";
import { WaxError } from "./errors.js";
import type { ApiTransaction } from "./api";
import type { TAccountName } from "./hive_apps_operations";
import { IOnlineEncryptionProvider, ISignatureProvider } from "./extensions/signatures";
import { structuredClone } from "./shims/structuredclone.js";
import type { transaction_handle } from "../build_wasm/wax.common";
import { DEFAULT_WAX_OPTIONS } from "./base";

type TIndexBeginEncryption = {
  mainEncryptionKey: TPublicKey;
  otherEncryptionKey: TPublicKey;
  begin: number;
  end?: number;
};

type TIndexEndEncryption = TIndexBeginEncryption & {
  end: number;
};

type TIndexKeeperNode = TIndexBeginEncryption | TIndexEndEncryption;

export type TTransactionRequiredAuthorities = {
  posting: Set<string>;
  active: Set<string>;
  owner: Set<string>;
  other: Array<authority>;
}

interface ICommonTransactionOptions {
  headBlockTime?: Date;
  chainId?: string;
  expirationTime?: TTimestamp;
}

export type TransactionOptions = (ICommonTransactionOptions & {
  taposBlockId: TBlockHash;
}) | (ICommonTransactionOptions & {
  protoTransaction: transaction;
});

export class Transaction implements ITransaction, IEncryptingTransaction<ITransaction> {
  protected target: transaction;
  protected txHandle: transaction_handle;

  private chainHeadBlockTime?: Date;
  protected chainId: string;
  private expirationTime: TTimestamp;

  private taposRefer(hex: TBlockHash): { ref_block_num: number; ref_block_prefix: number } {
    return this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_get_tapos_data(hex));
  }

  private indexKeeper: Array<TIndexKeeperNode> = [];

  public constructor(public readonly api: WaxBaseApi, transactionOptions: TransactionOptions) {
    this.expirationTime = transactionOptions.expirationTime ?? "+1m";
    this.chainId = transactionOptions.chainId ?? this.api.chainId;

    /** Let's use a head block time as expiration reference time for other chains than mainnet. For mainnet realtime is best to eliminate potential API node time screw
     *  For other (testing) chains it simplifies APPs rapid prototyping on deployments being mirrornet specific.
    */
    if(this.chainId !== DEFAULT_WAX_OPTIONS.chainId)
      this.chainHeadBlockTime = transactionOptions.headBlockTime;

    if("protoTransaction" in transactionOptions) {
      this.target = structuredClone(transactionOptions.protoTransaction);
      this.txHandle = api.wasmManager.safeWasmCall(() => api.protocol.cpp_create_transaction_handle(this.target, true));

      return;
    }

    const tapos = this.taposRefer(transactionOptions.taposBlockId);

    this.target = {
      ref_block_num: tapos.ref_block_num,
      ref_block_prefix: tapos.ref_block_prefix,
      expiration: '',
      extensions: [],
      operations: [],
      signatures: []
    };
    this.txHandle = this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_create_transaction_handle(this.target, true));
  }

  public get impactedAccounts(): Set<TAccountName> {
    const vector = this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_impacted_accounts(this.txHandle));
    const resultingSet = new Set<TAccountName>();
    for(let i = 0; i < vector.size(); ++i)
      resultingSet.add(vector.get(i) as TAccountName);

    return resultingSet;
  }

  private calculateSignerPublicKeys(isHf26: boolean): Array<THexString> {
    const vector = this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_signature_keys(this.txHandle, this.chainId, isHf26));
    const result: Array<THexString> = [];
    for(let i = 0; i < vector.size(); ++i)
      result.push(vector.get(i) as TAccountName);

    return result;
  }

  private getBinaryViewMetadataImpl(isHf26Serialization: boolean, stripSignatureContainer: boolean = false): IBinaryViewOutputData {
    this.flushTransaction();

    const binaryData = this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_binary(this.txHandle, isHf26Serialization, stripSignatureContainer));

    return {
      binary: binaryData.binary as string,
      offsets: this.api.parseBinaryMetadataChildren(binaryData.offsets) as IBinaryViewNode[]
    };
  }

  public get binaryViewMetadata(): IBinaryViewOutputData {
    return this.getBinaryViewMetadataImpl(true);
  }

  public get legacy_binaryViewMetadata(): IBinaryViewOutputData {
    return this.getBinaryViewMetadataImpl(false);
  }

  public get signatureKeys(): Array<THexString> {
    return this.calculateSignerPublicKeys(true);
  }

  public get legacy_signatureKeys(): Array<THexString> {
    return this.calculateSignerPublicKeys(false);
  }

  public static fromApi(api: WaxBaseApi, transactionData: string | object): Transaction {
    const transactionObject = typeof transactionData === 'string' ? JSON.parse(transactionData) : structuredClone(transactionData);

    api.wasmManager.safeWasmCall(() => api.protocol.cpp_tx_api_to_proto(transactionObject));

    return new Transaction(api, { protoTransaction: transactionObject });
  }

  public toApi(): string {
    return this.toString();
  }

  public toApiJson(): ApiTransaction {
    this.flushTransaction();
    const tx = structuredClone(this.target);
    this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_proto_to_api(tx));
    return tx;
  }

  public toBinaryForm(stripSignatureContainer: boolean = false): THexString {
    this.flushTransaction();

    return this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_to_binary(this.txHandle, true, stripSignatureContainer));
  }

  public toLegacyApi(): string {
    this.flushTransaction();

    return this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_to_legacy_json(this.txHandle));
  }

  private flushTransaction(): void {
    // Sign can be called before build, so ensure that we are applying the expiration time only once
    if(this.target.expiration.length === 0)
      this.applyExpiration();
  }

  public toString(): string {
    this.flushTransaction();

    return this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_to_json(this.txHandle));
  }

  public startEncrypt(mainEncryptionKey: TPublicKey, otherEncryptionKey?: TPublicKey): this & IEncryptingTransaction<this> {
    this.indexKeeper.push({ mainEncryptionKey, otherEncryptionKey: otherEncryptionKey ?? mainEncryptionKey, begin: this.target.operations.length });

    return this as IEncryptingTransaction<this> & this;
  }

  public async performOperationEncryption(provider: IOnlineEncryptionProvider): Promise<void> {
    // As a part of migration from old beekeeper #sign API to new encryption providers API,
    // instead of modifying the encryption visitor, we will iterate over the operations
    // to collect data to encrypt, and then iterate over the operations again to apply the encryption

    // Note: After migration is done, we should optimize this to only iterate once with awaits and remove legacy data

    const encryptionPromises: Array<Promise<string>> = [];
    for(const index of this.indexKeeper)
      for(let i = index.begin; i < (index.end ?? this.target.operations.length); ++i) {
        const visitor = new EncryptionVisitor(EEncryptionType.ENCRYPT, (data: string) => {
          encryptionPromises.push(
            provider.encryptData(data, index.mainEncryptionKey)
          );

          return "";
        });

        visitor.accept(this.target.operations[i]);
      }

    const encryptedData = await Promise.all(encryptionPromises);

    for(const index of this.indexKeeper)
      for(let i = index.begin; i < (index.end ?? this.target.operations.length); ++i) {
        const visitor = new EncryptionVisitor(EEncryptionType.ENCRYPT, () => encryptedData.shift()!);

        visitor.accept(this.target.operations[i]);
      }

    // XXX: Optimize this maybe
    this.txHandle = this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_create_transaction_handle(this.target, true));
    this.indexKeeper = [];
  }

  public stopEncrypt(): Transaction {
    const index = this.indexKeeper.at(-1);
    if(index === undefined)
      throw new WaxError("Mismatch in index types - stopEncrypt called before startEncrypt");

    if (index.end !== undefined)
      throw new WaxError(`Encryption on operation index: #${index.begin} for key: "${index.mainEncryptionKey}" already closed`);

    index.end = this.target.operations.length;

    return this;
  }

  private pushOperationWithHandle(op: operation): void {
      this.target.operations.push(op);
      const opHandle = this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_create_operation_handle(op, true));
      this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_add_operation(this.txHandle, opHandle));
  }

  private produceOperations(complexOperation: OperationBase): Transaction {
    const builtOps = complexOperation.finalize(this);

    for(const op of builtOps)
      this.pushOperationWithHandle(op);

    return this;
  }

  public pushOperation(op: operation | OperationBase): this {
    if ("finalize" in op) // Complex operation (to be built)
      this.produceOperations(op);
    else // Standard raw-object operation
      this.pushOperationWithHandle(op);

    return this;
  }

  public get sigDigest(): string {
    this.flushTransaction();

    return this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_sig_digest(this.txHandle, this.chainId, true));
  }

  public get legacy_sigDigest(): string {
    this.flushTransaction();

    return this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_sig_digest(this.txHandle, this.chainId, false));
  }

  public get id(): TTransactionId {
    this.flushTransaction();

    return this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_id(this.txHandle, true));
  }

  public get legacy_id(): TTransactionId {
    this.flushTransaction();

    return this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_id(this.txHandle, false));
  }

  public get requiredAuthorities(): TTransactionRequiredAuthorities {
    const posting: Set<string> = new Set();
    const active: Set<string> = new Set();
    const owner: Set<string> = new Set();
    const other: Array<authority> = [];

    const res = this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_required_authorities(this.txHandle));

    for(let i = 0; i < res.posting_accounts.size(); i++)
      posting.add(res.posting_accounts.get(i) as string);

    for(let i = 0; i < res.active_accounts.size(); i++)
      active.add(res.active_accounts.get(i) as string);

    for(let i = 0; i < res.owner_accounts.size(); i++)
      owner.add(res.owner_accounts.get(i) as string);

    for(let i = 0; i < res.other_authorities.size(); ++i) {
      const auth = res.other_authorities.get(i);

      const otherAuthToPush: authority = {
        weight_threshold: auth!.weight_threshold,
        account_auths: {},
        key_auths: {}
      };

      const accountAuthsKeys = auth!.account_auths.keys();
      for(let j = 0; j < accountAuthsKeys.size(); ++j) {
        const accAuthKey = accountAuthsKeys!.get(j);
        const retrievedAccAuth = auth!.account_auths.get(accAuthKey as string);

        otherAuthToPush.account_auths[accAuthKey as string] = retrievedAccAuth as number;
      }

      const keyAuthsKeys = auth!.key_auths.keys();
      for(let j = 0; j < keyAuthsKeys.size(); ++j) {
        const keyAuthKey = keyAuthsKeys!.get(j);
        const retrievedKeyAuth = auth!.key_auths.get(keyAuthKey as string);

        otherAuthToPush.key_auths[keyAuthKey as string] = retrievedKeyAuth as number;
      }

      other.push(otherAuthToPush);
    }

    return {
      posting,
      active,
      owner,
      other
    };
  }

  public validate(): void {
    this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_validate(this.txHandle));
  }

  protected applyExpiration(): void {
    const expiration = calculateExpiration(this.expirationTime, this.chainHeadBlockTime);

    this.target.expiration = expiration.toISOString().slice(0, -5);
    this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_set_expiration(this.txHandle, this.target.expiration));
  }

  public decrypt(wallet: ISignatureProvider): transaction {
    const visitor = new EncryptionVisitor(EEncryptionType.DECRYPT, (data: string) => {
      if(data.startsWith('#'))
        return this.api.decrypt(wallet, data)

      return data;
    });

    for(const op of this.target.operations)
      visitor.accept(op);

    // XXX: Optimize this maybe
    this.api.wasmManager.safeWasmCall(() => this.txHandle = this.api.protocol.cpp_create_transaction_handle(this.target, true));

    return this.target;
  }

  private encryptOperations(wallet: ISignatureProvider): void {
    for(const index of this.indexKeeper)
      for(let i = index.begin; i < (index.end ?? this.target.operations.length); ++i) {
        const visitor = new EncryptionVisitor(EEncryptionType.ENCRYPT, (data: string) => {
          return this.api.encrypt(wallet, data, index.mainEncryptionKey, index.otherEncryptionKey, this.target.ref_block_prefix);
        });

        visitor.accept(this.target.operations[i]);
      }

    // XXX: Optimize this maybe
    this.txHandle = this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_create_transaction_handle(this.target, true));
    this.indexKeeper = [];
  }

  private signWithHandle(signature: THexString): void {
    this.target.signatures.push(signature);
    this.api.wasmManager.safeWasmCall(() => this.api.protocol.cpp_tx_add_signature(this.txHandle, signature));
  }

  /**
   * @deprecated
   */
  public sign(provider: ISignatureProvider, publicKey: TPublicKey): THexString {
    this.validate();

    this.flushTransaction();
    this.encryptOperations(provider);

    const sig = provider.signDigest(publicKey as TPublicKey, this.sigDigest);

    this.signWithHandle(sig);

    return sig;
  }

  public addSignature(signature: THexString): this {
    this.validate();

    this.signWithHandle(signature);

    return this;
  }

  public isSigned(): boolean {
    return this.target.signatures.length > 0;
  }

  public get transaction(): transaction {
    this.flushTransaction();

    return this.target;
  }
}
