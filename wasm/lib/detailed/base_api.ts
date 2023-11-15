import type { ITransactionBuilderConstructor, IWaxBaseInterface } from "../interfaces";
import type { MainModule, result } from "../wax_module";

import { WaxError } from '../errors.js';
import { TransactionBuilder } from "./transaction_builder.js";
import { proto_protocol } from "../wax_module.js";

export class WaxBaseApi implements IWaxBaseInterface {
  public proto: proto_protocol;

  public extract(res: result): string {
    if(res.value !== this.wax.error_code.ok)
      throw new WaxError(`Wax API error: "${String(res.exception_message as string)}"`);

    return res.content as string;
  }

  public constructor(
    public readonly wax: MainModule,
    public readonly chainId: string
  ) {
    this.proto = new wax.proto_protocol();
  }

  get TransactionBuilder(): ITransactionBuilderConstructor {
    return Object.assign(
      TransactionBuilder.bind(undefined, this),
      {
        fromApi: TransactionBuilder.fromApi.bind(undefined, this)
      }
    );
  }

  delete(): void {
    this.proto.delete();
  }
}
