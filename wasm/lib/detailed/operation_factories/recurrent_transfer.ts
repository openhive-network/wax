import type { TAccountName } from "../custom_jsons/index.js";
import type { asset, operation } from "../../protocol.js";
import { recurrent_transfer } from "../../proto/recurrent_transfer.js";
import { OperationBase, type IOperationSink } from "../operation_builder.js";

export interface IRecurrentTransferData {
  /**
   * Account to transfer asset from.
   */
  from: TAccountName;
  /**
   * Account to transfer asset to. Cannot set a transfer to yourself.
   */
  to: TAccountName;
  /**
   * The amount of asset to transfer.
   * Allowed assets: **HIVE** and **HBD**.
   */
  amount: asset;
  /**
   * Must be shorter than 2048 characters.
   *
   * @default ""
   */
  memo?: string;
  /**
   * How often will the payment be triggered, unit: hours.
   * The first transfer is executed immediately.
   * The minimum value of the parameter is 24 h.
   *
   * @default 24
   */
  recurrence?: number;
  /**
   * How many times the recurrent payment will be executed.
   * Executions must be at least 2, if you set executions to 1 the recurrent transfer will not be executed.
   *
   * @default 2
   */
  executions?: number;
}


export interface IRecurrentTransferPairIdData extends Omit<IRecurrentTransferData, 'amount'> {
  amount?: asset;
  pairId: number;
}

export class RecurrentTransferOperation extends OperationBase {
  protected readonly recurrentTransfer: recurrent_transfer;

  private requiresRemoval = false;

  /**
   * @internal
   */
  public finalize(sink: IOperationSink): Iterable<operation> {
    if (this.requiresRemoval)
      this.recurrentTransfer.amount = { ...sink.api.ASSETS.HIVE, amount: "0" };

    return [{ recurrent_transfer: this.recurrentTransfer }];
  }

  public constructor(data: IRecurrentTransferData | IRecurrentTransferPairIdData) {
    super();

    this.recurrentTransfer = recurrent_transfer.fromPartial({
      from_account: data.from,
      to_account: data.to,
      amount: "amount" in data ? data.amount : undefined,
      executions: data.executions ?? 2,
      recurrence: data.recurrence ?? 24,
      memo: data.memo ?? ""
    });

    if (data.amount === undefined)
      this.requiresRemoval = true;

    if("pairId" in data)
      this.recurrentTransfer.extensions.push({
        recurrent_transfer_pair_id: {
          pair_id: data.pairId
        }
      });
  }
}
