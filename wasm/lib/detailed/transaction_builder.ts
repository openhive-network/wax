import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hiveio/beekeeper";
import type { IEncryptingTransaction, ITransaction, TBlockHash, THexString, TTimestamp, TTransactionId } from "../interfaces";

import { transaction, type operation } from "../protocol.js";
import { WaxBaseApi } from "./base_api.js";
import { calculateExpiration } from "./util/expiration_parser.js";
import { OperationBase } from "./operation_builder";
import { EEncryptionType, EncryptionVisitor } from "./encryption_visitor.js";
import { WaxError } from "../errors.js";

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

export class Transaction implements ITransaction, IEncryptingTransaction {
  private target: transaction;

  private expirationTime?: TTimestamp;

  private taposRefer(hex: TBlockHash): { ref_block_num: number; ref_block_prefix: number } {
    return this.api.proto.cpp_get_tapos_data(hex);
  }

  private indexKeeper: Array<TIndexKeeperNode> = [];

  public constructor(
    public readonly api: WaxBaseApi,
    taposBlockId: TBlockHash | string | transaction,
    expirationTime?: TTimestamp
  ) {
    if(typeof taposBlockId === 'object') {
      this.target = structuredClone(taposBlockId as transaction);

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

    this.expirationTime = expirationTime as TTimestamp;
  }

  private calculateSignerPublicKeys(calculatedSigDigest: string): Array<THexString> {
    const keys: Array<THexString> = [];
    for(const sig of this.target.signatures)
      keys.push(this.api.getPublicKeyFromSignature(calculatedSigDigest, sig));

    return keys;
  }

  public get signatureKeys(): Array<THexString> {
    return this.calculateSignerPublicKeys(this.sigDigest);
  }

  public get legacy_signatureKeys(): Array<THexString> {
    return this.calculateSignerPublicKeys(this.legacy_sigDigest);
  }

  public static fromApi(api: WaxBaseApi, transactionObject: string | object): Transaction {
    if(typeof transactionObject === 'object')
      transactionObject = JSON.stringify(transactionObject);

    const serialized = api.extract(api.proto.cpp_api_to_proto(transactionObject));

    const tx = transaction.fromJSON(JSON.parse(serialized));

    return new Transaction(api, tx);
  }

  public toApi(): string {
    const serialized = this.api.extract(this.api.proto.cpp_proto_to_api(this.toString()));

    return serialized;
  }

  public toApiJson(): object {
    return JSON.parse(this.toApi());
  }

  public toLegacyApi(): string {
    const serialized = this.api.extract(this.api.proto.cpp_proto_to_legacy_api(this.toString()));

    return serialized;
  }

  private flushTransaction(): void {
    // Sign can be called before build, so ensure that we are applying the expiration time only once
    if(this.target.expiration.length === 0)
      this.applyExpiration();
  }

  public toString(): string {
    this.flushTransaction();

    return JSON.stringify(transaction.toJSON(this.target));
  }

  public startEncrypt(mainEncryptionKey: TPublicKey, otherEncryptionKey?: TPublicKey): Transaction {
    this.indexKeeper.push({ mainEncryptionKey, otherEncryptionKey: otherEncryptionKey ?? mainEncryptionKey, begin: this.target.operations.length });

    return this;
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

    this.target.operations.push(...builtOps);

    return this;
  }

  public pushOperation(op: operation | OperationBase): Transaction {
    if ("finalize" in op) // Complex operation (to be built)
      this.produceOperations(op);
    else // Standard raw-object operation
      this.target.operations.push(op);

    return this;
  }

  public get sigDigest(): string {
    const tx = this.toString();

    const sigDigest: string = this.api.extract(this.api.proto.cpp_calculate_sig_digest(tx, this.api.chainId));

    return sigDigest;
  }

  public get legacy_sigDigest(): string {
    const tx = this.toString();

    const sigDigest: string = this.api.extract(this.api.proto.cpp_calculate_legacy_sig_digest(tx, this.api.chainId));

    return sigDigest;
  }

  public get id(): TTransactionId {
    const tx = this.toString();

    const transactionId: string = this.api.extract(this.api.proto.cpp_calculate_transaction_id(tx));

    return transactionId;
  }

  public get legacy_id(): TTransactionId {
    const tx = this.toString();

    const transactionId: string = this.api.extract(this.api.proto.cpp_calculate_legacy_transaction_id(tx));

    return transactionId;
  }

  public validate(): void {
    const tx = this.toString();

    this.api.extract(this.api.proto.cpp_validate_transaction(tx));
  }

  private applyExpiration(): void {
    const expiration = calculateExpiration(this.expirationTime);

    if(expiration instanceof Date)
      this.target.expiration = expiration.toISOString().slice(0, -5);
  }

  public decrypt(wallet: IBeekeeperUnlockedWallet): transaction {
    const visitor = new EncryptionVisitor(EEncryptionType.DECRYPT, (data: string) => {
      if(data.startsWith('#'))
        return this.api.decrypt(wallet, data)

      return data;
    });

    for(const op of this.target.operations)
      visitor.accept(op);

    return this.target;
  }

  private encryptOperations(wallet: IBeekeeperUnlockedWallet): void {
    for(const index of this.indexKeeper)
      for(let i = index.begin; i < (index.end ?? this.target.operations.length); ++i) {
        const visitor = new EncryptionVisitor(EEncryptionType.ENCRYPT, (data: string) => {
          return this.api.encrypt(wallet, data, index.mainEncryptionKey, index.otherEncryptionKey, this.target.ref_block_prefix);
        });

        visitor.accept(this.target.operations[i]);
      }
  }

  public sign(walletOrSignature: IBeekeeperUnlockedWallet | THexString, publicKey?: TPublicKey): THexString {
    if (typeof walletOrSignature === 'string') {

      this.target.signatures.push(walletOrSignature);
      return walletOrSignature;
    }

    this.flushTransaction();
    this.encryptOperations(walletOrSignature);

    const sig = walletOrSignature.signDigest(publicKey as TPublicKey, this.sigDigest);

    this.target.signatures.push(sig);

    return sig;
  }

  public isSigned(): boolean {
    return this.target.signatures.length > 0;
  }

  public build(walletOrSignature?: IBeekeeperUnlockedWallet | THexString, publicKey?: TPublicKey): transaction {
    if(typeof walletOrSignature === 'string')
      this.target.signatures.push(walletOrSignature);

    if(typeof walletOrSignature === 'object' && typeof publicKey !== 'undefined')
      this.sign(walletOrSignature, publicKey);
    else
      this.flushTransaction();

    return this.target;
  }

  public get transaction(): transaction {
    this.flushTransaction();

    return this.target;
  }
}
