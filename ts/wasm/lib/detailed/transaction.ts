import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hiveio/beekeeper";
import type { IBinaryViewNode, IBinaryViewOutputData, IEncryptingTransaction, ITransaction, TBlockHash, THexString, TTimestamp, TTransactionId } from "../interfaces";

import { authority, transaction, type operation } from "../protocol.js";
import { WaxBaseApi } from "./base_api.js";
import { calculateExpiration } from "./util/expiration_parser.js";
import { OperationBase } from "./operation_base";
import { EEncryptionType, EncryptionVisitor } from "./encryption_visitor.js";
import { WaxError } from "../errors.js";
import type { ApiTransaction } from "./api";
import { safeWasmCall } from "./util/wasm_errors";
import type { TAccountName } from "./hive_apps_operations";
import type { binary_data_node, VectorBinaryDataNode } from "../wax_module.js";

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

export class Transaction implements ITransaction, IEncryptingTransaction {
  private target: transaction;

  private expirationTime?: TTimestamp;

  private taposRefer(hex: TBlockHash): { ref_block_num: number; ref_block_prefix: number } {
    return safeWasmCall(() => this.api.proto.cpp_get_tapos_data(hex));
  }

  private indexKeeper: Array<TIndexKeeperNode> = [];

  public constructor(
    public readonly api: WaxBaseApi,
    taposBlockId: TBlockHash | string | transaction,
    expirationTime?: TTimestamp) {
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

  public get impactedAccounts(): Set<TAccountName> {
    return this.api.transactionGetImpactedAccounts(this.target);
  }

  private calculateSignerPublicKeys(calculatedSigDigest: string): Array<THexString> {
    const keys: Array<THexString> = [];
    for(const sig of this.target.signatures)
      keys.push(this.api.getPublicKeyFromSignature(calculatedSigDigest, sig));

    return keys;
  }

  public get binaryViewMetadata(): IBinaryViewOutputData {
    const binaryData = safeWasmCall(() => this.api.proto.cpp_generate_binary_transaction_metadata(this.toString()));

    const parseChildren = (data: VectorBinaryDataNode) => {
      const offsets: Array<Partial<binary_data_node>> = [];

      for(let i = 0; i < data.size(); ++i) {
        const node = data.get(i) as binary_data_node;

        offsets.push({
          key: node.key as string,
          type: node.type as string,
          offset: node.offset,
          size: node.size,
          value: (node.value as string).length === 0 ? undefined : node.value as string,
          length: node.type === "array" ? node.length : undefined,
          children: node.type === "scalar" ? undefined : parseChildren(node.children) as any
        });
      }

      return offsets;
    };

    return {
      binary: binaryData.binary as string,
      offsets: parseChildren(binaryData.offsets) as IBinaryViewNode[]
    };
  }

  public get signatureKeys(): Array<THexString> {
    return this.calculateSignerPublicKeys(this.sigDigest);
  }

  public get legacy_signatureKeys(): Array<THexString> {
    return this.calculateSignerPublicKeys(this.legacy_sigDigest);
  }

  public static fromApi(api: WaxBaseApi, transactionObject: string | object): Transaction {
    const transactionStringified = typeof transactionObject === 'string' ? transactionObject : JSON.stringify(transactionObject);

    const protoData = safeWasmCall(() => api.proto.cpp_api_to_proto(transactionStringified));

    const serialized = api.extract(protoData);

    const tx = transaction.fromJSON(JSON.parse(serialized));

    return new Transaction(api, tx);
  }

  public toApi(): string {
    const apiData = safeWasmCall(() => this.api.proto.cpp_proto_to_api(this.toString()));

    const serialized = this.api.extract(apiData);

    return serialized;
  }

  public toApiJson(): ApiTransaction {
    return JSON.parse(this.toApi());
  }

  public toBinaryForm(): THexString {
    const conversionResult = safeWasmCall(() => this.api.proto.cpp_serialize_transaction(this.toString()));

    const serialized = this.api.extract(conversionResult);

    return serialized;
  }

  public toLegacyApi(): string {
    const apiData = safeWasmCall(() => this.api.proto.cpp_proto_to_legacy_api(this.toString()));

    const serialized = this.api.extract(apiData);

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

    const sigDigest = safeWasmCall(() => this.api.proto.cpp_calculate_sig_digest(tx, this.api.chainId));

    return this.api.extract(sigDigest);
  }

  public get legacy_sigDigest(): string {
    const tx = this.toString();

    const legacySigDigest = safeWasmCall(() => this.api.proto.cpp_calculate_legacy_sig_digest(tx, this.api.chainId));

    return this.api.extract(legacySigDigest);
  }

  public get id(): TTransactionId {
    const tx = this.toString();

    const transactionId = safeWasmCall(() => this.api.proto.cpp_calculate_transaction_id(tx));

    return this.api.extract(transactionId);
  }

  public get legacy_id(): TTransactionId {
    const tx = this.toString();

    const legacyTransactionId = safeWasmCall(() => this.api.proto.cpp_calculate_legacy_transaction_id(tx));

    return this.api.extract(legacyTransactionId);
  }

  public get requiredAuthorities(): TTransactionRequiredAuthorities {
    const tx = this.toString();

    const posting: Set<string> = new Set();
    const active: Set<string> = new Set();
    const owner: Set<string> = new Set();
    const other: Array<authority> = [];

    const res = safeWasmCall(() => this.api.proto.cpp_collect_transaction_required_authorities(tx));

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
    const tx = this.toString();

    const validationResult = safeWasmCall(() => this.api.proto.cpp_validate_transaction(tx));

    this.api.extract(validationResult);
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
    this.validate();

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

  public get transaction(): transaction {
    this.flushTransaction();

    return this.target;
  }
}
