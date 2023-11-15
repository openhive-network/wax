import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hive/beekeeper";
import type { ITransactionBuilder, TBlockHash, TTimestamp, TTransactionId } from "../interfaces";

import { transaction, operation } from "../protocol.js";
import { WaxBaseApi } from "./base_api.js";
import { WaxError } from "../errors.js";

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
    // Allow creating transaction from raw proto JSON string
    if(typeof expirationTime === 'undefined' && typeof taposBlockId === 'string') {
      this.target = transaction.fromJSON(JSON.parse(taposBlockId as string));

      return;
    }

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

  public static fromApi(api: WaxBaseApi, transactionObject: string | object): ITransactionBuilder {
    if(typeof transactionObject === 'object')
      transactionObject = JSON.stringify(transactionObject);

    const serialized = api.extract(api.proto.cpp_api_to_proto(transactionObject));

    return new TransactionBuilder(api, serialized);
  }

  public toApi(): string {
    this.finalize();

    const serialized = this.api.extract(this.api.proto.cpp_proto_to_api(this.toString()));

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

  private applyExpiration(): void {
    // Transaction directly initialized from protobuf JSON or API. No expiration time given, so do not apply expiration time
    if(typeof this.expirationTime === 'undefined')
      return;

    let expiration: Date;
    if(typeof this.expirationTime === 'string' && this.expirationTime[0] === '+') {
      let mul = 1000;

       switch(this.expirationTime[this.expirationTime.length - 1])
       {
         case 'h':
           mul *= 60;
         case 'm':
           mul *= 60;
       }

       const num = Number.parseInt((/\d+/).exec(this.expirationTime)?.[0] as string);
      if(Number.isNaN(num))
        throw new WaxError("Invalid expiration time offset");

      expiration = new Date(Date.now() + (num * mul));
    } else {
      expiration = new Date(this.expirationTime);
    }

    this.target.expiration = expiration.toISOString().slice(0, -5);
  }

  public sign(wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): string {
    const signed = wallet.signDigest(publicKey, this.sigDigest);

    this.target.signatures.push(signed);

    return signed;
  }

  public build(wallet?: IBeekeeperUnlockedWallet, publicKey?: TPublicKey): transaction {
    if(typeof wallet !== 'undefined' && typeof publicKey !== 'undefined')
      this.sign(wallet, publicKey);
    else
      this.finalize();

    return this.target;
  }
}
