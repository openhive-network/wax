import type { TAccountName } from "../custom_jsons";
import type { asset } from "../../protocol";
import { recurrent_transfer } from "../../proto/recurrent_transfer.js";
import { IBuiltHiveAppsOperation, OperationBuilder } from "../operation_builder.js";

export class RecurrentTransferBuilder extends OperationBuilder {
  protected readonly recurrentTransfer: recurrent_transfer;

  public constructor(from: TAccountName, to: TAccountName, amount: asset, memo: string = "", recurrence: number = 24, executions: number = 2) {
    super();

    this.recurrentTransfer = recurrent_transfer.fromPartial({
      from_account: from,
      to_account: to,
      amount,
      executions,
      recurrence,
      memo
    });
  }

  /**
   * Removes recurrent transfer with the previously set pair id
   *
   * @returns {this} itself
   */
  public generateRemoval(): this {
    this.recurrentTransfer.amount = { ...this.api.ASSETS.HIVE, amount: "0" };

    return this;
  }

  /**
   * @internal
   */
  public override build(): IBuiltHiveAppsOperation {
    this.push({ recurrent_transfer: this.recurrentTransfer });

    return this.builtOperations;
  }
}

export class RecurrentTransferPairIdBuilder extends RecurrentTransferBuilder {
  public constructor(from: TAccountName, to: TAccountName, pairId: number, amount?: asset | undefined, memo: string = "", recurrence: number = 24, executions: number = 2) {
    super(from, to, amount as asset, memo, recurrence, executions);

    if (amount === undefined)
      this.generateRemoval();

    if(typeof pairId === "number")
      this.addPairId(pairId);
  }

  /**
   * Adds pair id to the recurrent transfer
   *
   * @param {number} pairId Pair id to add to the recurrent transfer
   *
   * @returns {RecurrentTransferPairIdBuilder} itself
   */
  private addPairId(pairId: number): RecurrentTransferPairIdBuilder {
    this.recurrentTransfer.extensions.push({
      recurrent_transfer_pair_id: {
        pair_id: pairId
      }
    });

    return this;
  }
}
