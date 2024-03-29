import type { TransactionBuilder } from "../transaction_builder";
import type { ITransactionBuilder } from "../../interfaces";
import { recurrent_transfer } from "../../proto/recurrent_transfer.js";

export class RecurrentTransferBuilder<TChain = ITransactionBuilder> {
  protected readonly recurrentTransfer: recurrent_transfer;

  public constructor(protected readonly txBuilder: TransactionBuilder, recurrentTransferObject: Partial<recurrent_transfer>) {
    this.recurrentTransfer = recurrent_transfer.fromPartial(recurrentTransferObject);
  }

  /**
   * Pushes the prepared operation to the transaction builder operations and returns the transaction builder
   *
   * @returns {TChain} transaction builder object
   */
  public store(): TChain {
    this.txBuilder.push({ recurrent_transfer: this.recurrentTransfer });

    return this.txBuilder as TChain;
  }
}

export class RecurrentTransferPairIdBuilder<TChain = ITransactionBuilder> extends RecurrentTransferBuilder<TChain> {
  public constructor(txBuilder: TransactionBuilder, recurrentTransferObject: Partial<recurrent_transfer>, pairId?: number) {
    super(txBuilder, recurrentTransferObject);

    if(typeof pairId === "number")
      this.addPairId(pairId);
  }

  /**
   * Adds pair id to the recurrent transfer
   *
   * @param {number} pairId Pair id to add to the recurrent transfer
   *
   * @returns {RecurrentTransferPairIdBuilder<TChain>} itself
   */
  private addPairId(pairId: number): RecurrentTransferPairIdBuilder<TChain> {
    this.recurrentTransfer.extensions.push({
      recurrent_transfer_pair_id: {
        pair_id: pairId
      }
    });

    return this;
  }

  /**
   * Removes recurrent transfer with the previously set pair id
   *
   * @returns {RecurrentTransferPairIdBuilder<TChain>} itself
   */
  public generateRemoval(): RecurrentTransferPairIdBuilder<TChain> {
    this.recurrentTransfer.amount = { ...this.txBuilder.api.ASSETS.HIVE, amount: "0" };

    return this;
  }
}
