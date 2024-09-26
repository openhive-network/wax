import type { TAccountName } from "../hive_apps_operations/index.js";
import type { asset, operation } from "../../protocol.js";
import { recurrent_transfer } from "../../proto/recurrent_transfer.js";
import { OperationBase, type IOperationSink } from "../operation_base.js";
import { WaxError } from "../../errors.js";
import { EAssetName, type WaxBaseApi } from "../base_api.js";

export interface IRecurrentTransferBaseData {
  /**
   * Account to transfer asset from.
   */
  from: TAccountName;
  /**
   * Account to transfer asset to. Cannot set a transfer to yourself.
   */
  to: TAccountName;
  /**
   * Since HF 28, if user has more than one recurrent transfer to the same receiver
   * or if user creates the recurrent transfer using pairId, user has to specify the pairId
   * in order to update or remove the defined recurrent transfer. 
   *
   * @default 0
   */
  pairId?: number;
}

export interface IRecurrentTransferData extends IRecurrentTransferBaseData {
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

export interface IRecurrentTransferRemovalOperationData extends IRecurrentTransferBaseData { }

class RecurrentTransferOperationBase extends OperationBase {
  protected readonly recurrentTransfer: recurrent_transfer;

  /**
   * @internal
   */
  public finalize(sink: IOperationSink): Iterable<operation> {
    (sink.api as WaxBaseApi).assertAssetSymbol([EAssetName.HBD, EAssetName.HIVE], this.recurrentTransfer.amount as asset);

    return [{ recurrent_transfer: this.recurrentTransfer }];
  }

  public constructor(data: Partial<IRecurrentTransferData>) {
    super();

    this.recurrentTransfer = recurrent_transfer.fromPartial({
      from_account: data.from,
      to_account: data.to,
      amount: data.amount,
      executions: data.executions ?? 2,
      recurrence: data.recurrence ?? 24,
      memo: data.memo ?? ""
    });

    if (data.pairId !== undefined && data.pairId !== 0)
      this.recurrentTransfer.extensions.push({
        recurrent_transfer_pair_id: {
          pair_id: data.pairId
        }
      });
  }
}

export class DefineRecurrentTransferOperation extends RecurrentTransferOperationBase {
  /**
   * Creates/updates a recurrent transfer in the currency Hive or HBD.
    * Since HF 28, if user has more than one recurrent transfer to the same receiver
    * or if user creates the recurrent transfer using pairId in the extensions,
    * user has to specify the pairId in order to update the defined recurrent transfer.
    *
    * Amount cannot be 0 when defining / updating recurrent transfer.
    *
    * If there is already a recurrent transfer matching 'from' and 'to', the recurrent transfer will be replaced, but:
    * - If the 'recurrence' is not changed, the next execution will be according to “old definition”
    * - If the 'recurrence' is changed, then the next execution will be “update date” + 'recurrence' there is no execution on the update date.
    * - Up to HF28 there can be only one recurrent transfer for sender 'from' and receiver 'to'.
    *   Since H28 users may define more recurrent transfers to the same sender and receiver using pair_id in the 'executions'.
    * - The one account may define up to 255 recurrent transfers to other accounts.
    * - The execution date of the last transfer should be no more than 730 days in the future.
   */
  public constructor(data: IRecurrentTransferData) {
    super(data);

    // Removal operation passes amount data which is undefined
    if (data.amount.amount === "0")
      throw new WaxError("Amount must be greater than 0");
  }
}

export class RecurrentTransferRemovalOperation extends RecurrentTransferOperationBase {
  /**
   * @internal
   */
  public finalize(sink: IOperationSink): Iterable<operation> {
    if (this.recurrentTransfer.amount === undefined)
      this.recurrentTransfer.amount = { ...sink.api.ASSETS.HIVE, amount: "0" };

    return super.finalize(sink);
  }

  /**
   * Removes a recurrent transfer in the currency Hive or HBD.
   * Since HF 28, if user has more than one recurrent transfer to the same receiver
   * or if user creates the recurrent transfer using pair_id in the extensions,
   * user has to specify the pair_id in order to remove the defined recurrent transfer.
   * When invoking this operation, the virtual operation fill_recurrent_transfer_operation is not generated
   */
  public constructor(data: IRecurrentTransferRemovalOperationData) {
    super(data);
  }
}
