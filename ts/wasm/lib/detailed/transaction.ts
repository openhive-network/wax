import type { IBinaryViewNode, IBinaryViewOutputData, IEncryptingTransaction, ITransaction, TBlockHash, THexString, TPublicKey, TTimestamp, TTransactionId } from "./interfaces";

import { authority, transaction, type operation } from "./protocol.js";
import { WaxBaseApi } from "./base_api.js";
import { calculateExpiration } from "./util/expiration_parser.js";
import { OperationBase } from "./operation_base";
import { EEncryptionType, EncryptionVisitor } from "./encryption_visitor.js";
import { WaxError } from "./errors.js";
import type { ApiTransaction } from "./api";
import { safeWasmCall } from "./util/wasm_errors";
import type { TAccountName } from "./hive_apps_operations";
import { ISignatureProvider } from "./extensions/signatures";
import { structuredClone } from "./shims/structuredclone.js";
import { WasmTransaction } from '../build_wasm/wax.common';

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

export class Transaction implements ITransaction, IEncryptingTransaction<ITransaction> {
  private target: transaction;
  private wasmTransaction: WasmTransaction;

  private taposRefer(hex: TBlockHash): { ref_block_num: number; ref_block_prefix: number } {
    return safeWasmCall(() => this.api.proto.cpp_get_tapos_data(hex));
  }

  private indexKeeper: Array<TIndexKeeperNode> = [];

  public constructor(
    public readonly api: WaxBaseApi,
    taposBlockId: TBlockHash | string | transaction,
    private chainHeadBlockTime?: Date,
    private readonly expirationTime: TTimestamp = "+1m") {
    if(typeof taposBlockId === 'object') {
      this.target = structuredClone(taposBlockId as transaction);
      this.wasmTransaction = safeWasmCall(() => api.proto.cpp_create_wasm_transaction(this.target, true));

      return;
    }

    const tapos = this.taposRefer(taposBlockId);

    this.target = {
      ref_block_num: tapos.ref_block_num,
      ref_block_prefix: tapos.ref_block_prefix,
      expiration: '',
      extensions: [],
      operations: [],
      signatures: []
    };
    this.wasmTransaction = safeWasmCall(() => api.proto.cpp_create_wasm_transaction(this.target, true));
  }

  public get impactedAccounts(): Set<TAccountName> {
    const vector = safeWasmCall(() => this.wasmTransaction.impactedAccounts());
    const resultingSet = new Set<TAccountName>();
    for(let i = 0; i < vector.size(); ++i)
      resultingSet.add(vector.get(i) as TAccountName);

    return resultingSet;
  }

  private calculateSignerPublicKeys(isHf26: boolean): Array<THexString> {
    const vector = safeWasmCall(() => this.wasmTransaction.signatureKeys(this.api.chainId, isHf26));
    const result: Array<THexString> = [];
    for(let i = 0; i < vector.size(); ++i)
      result.push(vector.get(i) as TAccountName);

    return result;
  }

  private getBinaryViewMetadataImpl(isHf26Serialization: boolean, stripSignatureContainer: boolean = false): IBinaryViewOutputData {
    this.flushTransaction();

    const binaryData = safeWasmCall(() => this.wasmTransaction.binary(isHf26Serialization, stripSignatureContainer));

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

  public static fromApi(api: WaxBaseApi, transactionObject: string | object): Transaction {
    const transactionStringified = typeof transactionObject === 'string' ? JSON.parse(transactionObject) : structuredClone(transactionObject);

    safeWasmCall(() => api.proto.cpp_tx_api_to_proto(transactionStringified));

    return new Transaction(api, transactionStringified);
  }

  public toApi(): string {
    return this.toString();
  }

  public toApiJson(): ApiTransaction {
    this.flushTransaction();
    const tx = structuredClone(this.target);
    safeWasmCall(() => this.api.proto.cpp_tx_proto_to_api(tx));
    return tx;
  }

  public toBinaryForm(stripSignatureContainer: boolean = false): THexString {
    this.flushTransaction();

    return this.wasmTransaction.toBinary(true, stripSignatureContainer);
  }

  public toLegacyApi(): string {
    this.flushTransaction();

    return this.wasmTransaction.toLegacyString();
  }

  private flushTransaction(): void {
    // Sign can be called before build, so ensure that we are applying the expiration time only once
    if(this.target.expiration.length === 0)
      this.applyExpiration();
  }

  public toString(): string {
    this.flushTransaction();

    return this.wasmTransaction.toString();
  }

  public startEncrypt(mainEncryptionKey: TPublicKey, otherEncryptionKey?: TPublicKey): this & IEncryptingTransaction<this> {
    this.indexKeeper.push({ mainEncryptionKey, otherEncryptionKey: otherEncryptionKey ?? mainEncryptionKey, begin: this.target.operations.length });

    return this as IEncryptingTransaction<this> & this;
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

  private produceOperations(complexOperation: OperationBase): Transaction {
    const builtOps = complexOperation.finalize(this);

    for(const op of builtOps) {
      this.target.operations.push(op);
      this.wasmTransaction.push(op, true)
    }

    return this;
  }

  public pushOperation(op: operation | OperationBase): this {
    if ("finalize" in op) // Complex operation (to be built)
      this.produceOperations(op);
    else { // Standard raw-object operation
      this.target.operations.push(op);
      this.wasmTransaction.push(op, true);
    }

    return this;
  }

  public get sigDigest(): string {
    this.flushTransaction();

    return this.wasmTransaction.sigDigest(this.api.chainId, true);
  }

  public get legacy_sigDigest(): string {
    this.flushTransaction();

    return this.wasmTransaction.sigDigest(this.api.chainId, false);
  }

  public get id(): TTransactionId {
    this.flushTransaction();

    return this.wasmTransaction.id(true);
  }

  public get legacy_id(): TTransactionId {
    this.flushTransaction();

    return this.wasmTransaction.id(false);
  }

  public get requiredAuthorities(): TTransactionRequiredAuthorities {
    const posting: Set<string> = new Set();
    const active: Set<string> = new Set();
    const owner: Set<string> = new Set();
    const other: Array<authority> = [];

    const res = safeWasmCall(() => this.wasmTransaction.requiredAuthorities());

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
    safeWasmCall(() => this.wasmTransaction.validate());
  }

  private applyExpiration(): void {
    const expiration = calculateExpiration(this.expirationTime, this.chainHeadBlockTime);

    this.target.expiration = expiration.toISOString().slice(0, -5);
    this.wasmTransaction.setExpiration(this.target.expiration);
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
    this.wasmTransaction = safeWasmCall(() => this.api.proto.cpp_create_wasm_transaction(this.target, true));

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
    this.wasmTransaction = safeWasmCall(() => this.api.proto.cpp_create_wasm_transaction(this.target, true));
  }

  public sign(walletOrSignature: ISignatureProvider | THexString, publicKey?: TPublicKey): THexString {
    this.validate();

    if (typeof walletOrSignature === 'string') {

      this.target.signatures.push(walletOrSignature);
      this.wasmTransaction.sign(walletOrSignature);
      return walletOrSignature;
    }

    this.flushTransaction();
    this.encryptOperations(walletOrSignature);

    const sig = walletOrSignature.signDigest(publicKey as TPublicKey, this.sigDigest);

    this.target.signatures.push(sig);
    this.wasmTransaction.sign(sig);

    return sig;
  }

  public isSigned(): boolean {
    return this.target.signatures.length > 0;
  }

  public get transaction(): transaction {
    this.flushTransaction();

    return this.target;
  }
}
