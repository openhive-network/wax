import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hive/beekeeper";
import type { ITransactionBuilder, TBlockHash, TTimestamp, TTransactionId } from "../interfaces";

import { transaction, operation } from "../protocol.js";
import { WaxBaseApi } from "./base_api.js";

export class TransactionBuilder implements ITransactionBuilder {
  private target: transaction;

  private taposRefer(hex: TBlockHash): { ref_block_num: number; ref_block_prefix: number } {
    return this.api.proto.cpp_get_tapos_data(hex);
  }

  public constructor(
    public readonly api: WaxBaseApi,
    taposBlockId: TBlockHash,
    expirationTime: TTimestamp
  ) {
    const tapos = this.taposRefer(taposBlockId);

    this.target = {
      ref_block_num: tapos.ref_block_num,
      ref_block_prefix: tapos.ref_block_prefix,
      expiration: new Date(expirationTime).toISOString().slice(0, -5),
      extensions: [],
      operations: [],
      signatures: []
    };
  }

  public toString(): string {
    return JSON.stringify(transaction.toJSON(this.target));
  }

  public push(op: operation): ITransactionBuilder {
    this.target.operations.push(op);

    return this;
  }

  public get sigDigest(): string {
    const tx = this.toString();

    const sigDigest: string = this.api.extract(this.api.proto.cpp_calculate_sig_digest(tx, this.api.chainId));

    return sigDigest;
  }

  public get id(): TTransactionId {
    const tx = this.toString();

    const transactionId: string = this.api.extract(this.api.proto.cpp_calculate_transaction_id(tx));

    return transactionId;
  }

  public validate(): void {
    const tx = this.toString();

    this.api.extract(this.api.proto.cpp_validate_transaction(tx));
  }

  public sign(wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): string {
    const signed = wallet.signDigest(publicKey, this.sigDigest);

    this.target.signatures.push(signed);

    return signed;
  }

  public build(wallet?: IBeekeeperUnlockedWallet, publicKey?: TPublicKey): transaction {
    if(typeof wallet !== 'undefined' && typeof publicKey !== 'undefined')
      this.sign(wallet, publicKey);

    return this.target;
  }
}
