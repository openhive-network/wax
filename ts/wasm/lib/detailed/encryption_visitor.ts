import { comment, custom_json, recurrent_transfer, transfer, transfer_from_savings, transfer_to_savings } from "./protocol.js";
import { OperationVisitor } from "./visitor.js";

export type TEncryptFn<TRet extends void | Promise<void>> = (data: string) => (TRet extends void ? string : Promise<string>);

export enum EEncryptionType {
  ENCRYPT,
  DECRYPT
}

export class EncryptionVisitor<TRet extends void | Promise<void>> extends OperationVisitor<TRet> {
  public constructor(
    private readonly encryptionType: EEncryptionType,
    private readonly cryptographicFunction: TEncryptFn<TRet>) {
    super()
  }

  public comment(op: comment): TRet {
    const result = this.cryptographicFunction(op.body);
    if (result instanceof Promise)
      return result.then(body => { op.body = body; }) as TRet;
    else
      op.body = result;

    return undefined as TRet;
  }

  public transfer(op: transfer): TRet {
    const result = this.cryptographicFunction(op.memo);
    if (result instanceof Promise)
      return result.then(memo => { op.memo = memo; }) as TRet;
    else
      op.memo = result;

    return undefined as TRet;
  }

  private static readonly CustomJsonEncryptionKey = "encrypted";

  public custom_json(op: custom_json): TRet {
    if(this.encryptionType === EEncryptionType.ENCRYPT) {
      const result = this.cryptographicFunction(op.json);

      if (result instanceof Promise)
        return result.then(json => { op.json = JSON.stringify({ [EncryptionVisitor.CustomJsonEncryptionKey]: json }) }) as TRet;
      else
        op.json = JSON.stringify({ [EncryptionVisitor.CustomJsonEncryptionKey]: result });
    } else {
      const json = JSON.parse(op.json);

      if(EncryptionVisitor.CustomJsonEncryptionKey in json) {
        const result = this.cryptographicFunction(json[EncryptionVisitor.CustomJsonEncryptionKey]);
        if (result instanceof Promise)
          return result.then(json => { op.json[EncryptionVisitor.CustomJsonEncryptionKey] = json }) as TRet;
        else
          op.json = result;
      }
    }

    return undefined as TRet;
  }

  public transfer_to_savings(op: transfer_to_savings): TRet {
    const result = this.cryptographicFunction(op.memo);
    if (result instanceof Promise)
      return result.then(memo => { op.memo = memo; }) as TRet;
    else
      op.memo = result;

    return undefined as TRet;
  }

  public transfer_from_savings(op: transfer_from_savings): TRet {
    const result = this.cryptographicFunction(op.memo);
    if (result instanceof Promise)
      return result.then(memo => { op.memo = memo; }) as TRet;
    else
      op.memo = result;

    return undefined as TRet;
  }

  public recurrent_transfer(op: recurrent_transfer): TRet {
    const result = this.cryptographicFunction(op.memo);
    if (result instanceof Promise)
      return result.then(memo => { op.memo = memo; }) as TRet;
    else
      op.memo = result;

    return undefined as TRet;
  }

  // custom(op: custom): void {}
}