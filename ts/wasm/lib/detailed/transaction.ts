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
import { IEncryptionProvider, ILegacyEncryptionProvider, ILegacySignatureProvider, IOnlineEncryptionProvider, IOnlineSignatureProviderSignDigest, IOnlineSignatureProviderSignTransaction, ISignatureProviderSignDigest, ISignatureProviderSignTransaction } from "./extensions/signatures";
import { structuredClone } from "./shims/structuredclone.js";

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
  protected target: transaction;

  private taposRefer(hex: TBlockHash): { ref_block_num: number; ref_block_prefix: number } {
    return safeWasmCall(() => this.api.proto.cpp_get_tapos_data(hex));
  }

  protected indexKeeper: Array<TIndexKeeperNode> = [];

  public constructor(
    public readonly api: WaxBaseApi,
    taposBlockId: TBlockHash | string | transaction,
    private chainHeadBlockTime?: Date,
    private readonly expirationTime: TTimestamp = "+1m") {
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

  private getBinaryViewMetadataImpl(isHf26Serialization: boolean, stripSignatureContainer: boolean = false): IBinaryViewOutputData {
    const binaryData = safeWasmCall(() => this.api.proto.cpp_generate_binary_transaction_metadata(this.toString(), isHf26Serialization, stripSignatureContainer));

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

  public toBinaryForm(stripSignatureContainer: boolean = false): THexString {
    const conversionResult = safeWasmCall(() => this.api.proto.cpp_serialize_transaction(this.toString(), stripSignatureContainer));

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

    this.target.operations.push(...builtOps);

    return this;
  }

  public pushOperation(op: operation | OperationBase): this {
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
    const expiration = calculateExpiration(this.expirationTime, this.chainHeadBlockTime);

    this.target.expiration = expiration.toISOString().slice(0, -5);
  }

  public decrypt(provider: IEncryptionProvider): transaction;
  public decrypt(provider: ILegacyEncryptionProvider): transaction;
  public decrypt(provider: IOnlineEncryptionProvider): Promise<transaction>;
  public decrypt(provider: IEncryptionProvider | ILegacyEncryptionProvider | IOnlineEncryptionProvider): transaction | Promise<transaction> {
    if ("isOnline" in provider && provider.isOnline) {
      return new Promise(async(resolve, reject) => {
        try {
          const visitor = new EncryptionVisitor(EEncryptionType.DECRYPT, (data: string) => {
            if(data.startsWith('#'))
              return this.api.decrypt(provider as IOnlineEncryptionProvider, data)

            return data;
          });

          for(const op of this.target.operations)
            await visitor.accept(op);

          resolve(this.target);
        } catch(error) {
          reject(error);
        }
      });
    }

    const visitor = new EncryptionVisitor(EEncryptionType.DECRYPT, (data: string) => {
      if(data.startsWith('#'))
        return this.api.decrypt(provider as IEncryptionProvider, data)

      return data;
    });

    for(const op of this.target.operations)
      visitor.accept(op);

    return this.target;
  }

  private encryptOperations(provider: IEncryptionProvider): void {
    for(const index of this.indexKeeper)
      for(let i = index.begin; i < (index.end ?? this.target.operations.length); ++i) {
        const visitor = new EncryptionVisitor(EEncryptionType.ENCRYPT, (data: string) => {
          return this.api.encrypt(provider as any, data, index.mainEncryptionKey, index.otherEncryptionKey, this.target.ref_block_prefix);
        });

        visitor.accept(this.target.operations[i]);
      }
  }

  private async encryptOperationsAsync(provider: IOnlineEncryptionProvider): Promise<void> {
    for(const index of this.indexKeeper)
      for(let i = index.begin; i < (index.end ?? this.target.operations.length); ++i) {
        const visitor = new EncryptionVisitor(EEncryptionType.ENCRYPT, (data: string) => {
          return this.api.encrypt(provider as any, data, index.mainEncryptionKey, index.otherEncryptionKey, this.target.ref_block_prefix);
        });

        await visitor.accept(this.target.operations[i]);
      }
  }

  public sign(provider: ISignatureProviderSignTransaction): void;
  public sign(provider: ISignatureProviderSignTransaction & IEncryptionProvider): void;
  public sign(provider: ISignatureProviderSignDigest, publicKey: TPublicKey): THexString;
  public sign(provider: ISignatureProviderSignDigest & IEncryptionProvider, publicKey: TPublicKey): THexString;
  public sign(provider: ILegacySignatureProvider & ILegacyEncryptionProvider, publicKey: TPublicKey): THexString;
  public sign(provider: IOnlineSignatureProviderSignTransaction): Promise<void>;
  public sign(provider: IOnlineSignatureProviderSignTransaction & IOnlineEncryptionProvider): Promise<void>;
  public sign(provider: IOnlineSignatureProviderSignDigest, publicKey: TPublicKey): Promise<THexString>;
  public sign(provider: IOnlineSignatureProviderSignDigest & IOnlineEncryptionProvider, publicKey: TPublicKey): Promise<THexString>;
  public sign(signature: THexString): THexString;
  public sign(providerOrSignature: (
    ISignatureProviderSignTransaction | (ISignatureProviderSignTransaction & IEncryptionProvider) | ISignatureProviderSignDigest | (ISignatureProviderSignDigest & IEncryptionProvider) | (ILegacySignatureProvider & ILegacyEncryptionProvider) | IOnlineSignatureProviderSignTransaction | (IOnlineSignatureProviderSignTransaction & IOnlineEncryptionProvider) | IOnlineSignatureProviderSignDigest | (IOnlineSignatureProviderSignDigest & IOnlineEncryptionProvider)
    ) | THexString, publicKey?: TPublicKey): void | Promise<void> | Promise<THexString> | THexString {
    this.validate();

    if (typeof providerOrSignature === 'string') {
      this.target.signatures.push(providerOrSignature);
      return providerOrSignature;
    }

    this.flushTransaction();

    // Allow online signature providers even if transactions were created offline
    if ("isOnline" in providerOrSignature && providerOrSignature.isOnline) {
      return new Promise(async(resolve, reject) => {
        try {
          if (this.indexKeeper.length > 0) {
            if ("encryptData" in providerOrSignature)
              await this.encryptOperationsAsync(providerOrSignature as IOnlineEncryptionProvider);
            else
              throw new WaxError("Encryption provider is required for operations encryption");
          }

          if (publicKey === undefined)
            return resolve(await (providerOrSignature as IOnlineSignatureProviderSignTransaction).signTransaction(this));

          const sig = await (providerOrSignature as IOnlineSignatureProviderSignDigest).signDigest(publicKey, this.sigDigest);

          this.target.signatures.push(sig);

          resolve(sig);
        } catch(error) {
          reject(error);
        }
      }) as any;
    }

    if (this.indexKeeper.length > 0) {
      if ("encryptData" in providerOrSignature)
        this.encryptOperations(providerOrSignature as IEncryptionProvider);
      else
        throw new WaxError("Encryption provider is required for operations encryption");
    }

    if (publicKey === undefined)
      return (providerOrSignature as ISignatureProviderSignTransaction).signTransaction(this as ITransaction);

    const sig = (providerOrSignature as ISignatureProviderSignDigest).signDigest(publicKey, this.sigDigest);

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
