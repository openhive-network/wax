import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hive/beekeeper";
import type { ITransactionBuilder, TBlockHash, THexString, TTimestamp, TTransactionId } from "../interfaces";

import { transaction, type operation, type asset, type recurrent_transfer, type update_proposal, comment } from "../protocol.js";
import { WaxBaseApi } from "./base_api.js";
import { calculateExpiration } from "./util/expiration_parser.js";
import { HiveAppsOperation, TAccountName } from "./custom_jsons/builder";
import { RootCommentBuilder, CommentBuilder, RecurrentTransferBuilder, RecurrentTransferPairIdBuilder, TArticleBuilder, UpdateProposalBuilder } from "./operation_factories";

export class TransactionBuilder implements ITransactionBuilder {
  private target: transaction;

  private expirationTime?: TTimestamp;

  private taposRefer(hex: TBlockHash): { ref_block_num: number; ref_block_prefix: number } {
    return this.api.proto.cpp_get_tapos_data(hex);
  }

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

  public static fromApi(api: WaxBaseApi, transactionObject: string | object): ITransactionBuilder {
    if(typeof transactionObject === 'object')
      transactionObject = JSON.stringify(transactionObject);

    const serialized = api.extract(api.proto.cpp_api_to_proto(transactionObject));

    const tx = transaction.fromJSON(JSON.parse(serialized));

    return new TransactionBuilder(api, tx);
  }

  public toApi(): string {
    this.finalize();

    const serialized = this.api.extract(this.api.proto.cpp_proto_to_api(this.toString()));

    return serialized;
  }

  public toLegacyApi(): string {
    this.finalize();

    const serialized = this.api.extract(this.api.proto.cpp_proto_to_legacy_api(this.toString()));

    return serialized;
  }

  private finalize(): void {
    // Sign can be called before build, so ensure that we are applying the expiration time only once
    if(this.target.expiration.length === 0)
      this.applyExpiration();
  }

  public toString(): string {
    this.finalize();

    return JSON.stringify(transaction.toJSON(this.target));
  }

  public push(op: operation | HiveAppsOperation): ITransactionBuilder {
    if("flushOperations" in op)
      op.flushOperations(this);
    else
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

  public pushRecurrentTransfer(
    from: TAccountName, to: TAccountName, amountOrPairId: asset | number, memo: string = "", recurrence: number = 0, executions: number = 0
  ): RecurrentTransferPairIdBuilder {
    const partialRecurrentTransferOp: Partial<recurrent_transfer> = {
      from_account: from,
      to_account: to,
      amount: typeof amountOrPairId === "object" ? amountOrPairId : undefined,
      executions,
      recurrence,
      memo
    };

    if(typeof amountOrPairId === "number")
      return new RecurrentTransferPairIdBuilder(this, partialRecurrentTransferOp, amountOrPairId);

    // JavaScript does not allow overriding functions, so we have to cast this class to a top-level class having all of the missing methods to match ITransactionBuilder interface
    return new RecurrentTransferBuilder(this, partialRecurrentTransferOp) as RecurrentTransferPairIdBuilder;
  }

  public pushUpdateProposal(
    proposalId: string | number, creator: TAccountName, dailyPay: asset, subject: string, permlink: string, endDate?: number | string | Date
  ): UpdateProposalBuilder {
    const updateProposalOp: Partial<update_proposal> = {
      proposal_id: proposalId.toString(),
      creator,
      daily_pay: dailyPay,
      subject,
      permlink
    };

    return new UpdateProposalBuilder(this, updateProposalOp, endDate);
  }

  public pushArticle(
    author: TAccountName, permlink: string, title: string, body: string, jsonMetadata: object = {}
  ): TArticleBuilder {
    const commentOp: Partial<comment> = {
      author,
      body,
      permlink,
      title,
      json_metadata: JSON.stringify(jsonMetadata)
    };

    return new RootCommentBuilder(this, commentOp);
  }

  public pushReply(
    parentAuthor: TAccountName, parentPermlink: string, author: TAccountName, body: string, jsonMetadata: object = {}, permlink?: string, title: string = ""
  ): CommentBuilder {
    const commentOp: Partial<comment> = {
      author,
      body,
      permlink: typeof permlink === "string" ? permlink : `re-${parentAuthor}-${Date.now()}`,
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      title,
      json_metadata: JSON.stringify(jsonMetadata)
    };

    return new CommentBuilder(this, commentOp);
  }

  private applyExpiration(): void {
    const expiration = calculateExpiration(this.expirationTime);

    if(expiration instanceof Date)
      this.target.expiration = expiration.toISOString().slice(0, -5);
  }

  public sign(wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): THexString {
    const sig = wallet.signDigest(publicKey as TPublicKey, this.sigDigest);

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
      this.finalize();

    return this.target;
  }
}
