import type { TAccountName } from "../custom_jsons";
import type { asset } from "../../protocol";
import { recurrent_transfer } from "../../proto/recurrent_transfer.js";
import { IBuiltHiveAppsOperation, OperationBuilder } from "../operation_builder.js";

export class RecurrentTransferBuilder extends OperationBuilder {
  protected readonly recurrentTransfer: recurrent_transfer;

  public constructor(from: TAccountName, to: TAccountName, amount: asset, memo: string = "", recurrence: number = 0, executions: number = 0) {
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
   * @internal
   */
  public override build(): IBuiltHiveAppsOperation {
    this.push({ recurrent_transfer: this.recurrentTransfer });

    return this.builtOperations;
  }
}

export class RecurrentTransferPairIdBuilder extends RecurrentTransferBuilder {
  public constructor(from: TAccountName, to: TAccountName, pairId: number, memo: string = "", recurrence: number = 0, executions: number = 0) {
    super(from, to, {} as asset, memo, recurrence, executions);

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

  /**
   * Removes recurrent transfer with the previously set pair id
   *
   * @returns {RecurrentTransferPairIdBuilder} itself
   */
  public generateRemoval(): RecurrentTransferPairIdBuilder {
    this.requireApi();

    this.recurrentTransfer.amount = { ...this.api!.ASSETS.HIVE, amount: "0" };

    return this;
  }
}
