import { comment, custom_json, recurrent_transfer, transfer, transfer_from_savings, transfer_to_savings } from "../protocol.js";
import { OperationVisitor } from "../visitor.js";

export type TEncryptFn = (data: string) => string;

export enum EEncryptionType {
  ENCRYPT,
  DECRYPT
}

export class EncryptionVisitor extends OperationVisitor {
  public constructor(
    private readonly encryptionType: EEncryptionType,
    private readonly cryptographicFunction: TEncryptFn) {
    super()
  }

  public comment(op: comment): void {
    op.body = this.cryptographicFunction(op.body);
  }

  public transfer(op: transfer): void {
    op.memo = this.cryptographicFunction(op.memo);
  }

  private static readonly CustomJsonEncryptionKey = "encrypted";

  public custom_json(op: custom_json): void {
    if(this.encryptionType === EEncryptionType.ENCRYPT)
      op.json = JSON.stringify({ [EncryptionVisitor.CustomJsonEncryptionKey]: this.cryptographicFunction(op.json) });
    else {
      const json = JSON.parse(op.json);

      if(EncryptionVisitor.CustomJsonEncryptionKey in json)
        op.json = this.cryptographicFunction(json[EncryptionVisitor.CustomJsonEncryptionKey]);
    }
  }

  public transfer_to_savings(op: transfer_to_savings): void {
    op.memo = this.cryptographicFunction(op.memo);
  }

  public transfer_from_savings(op: transfer_from_savings): void {
    op.memo = this.cryptographicFunction(op.memo);
  }

  public recurrent_transfer(op: recurrent_transfer): void {
    op.memo = this.cryptographicFunction(op.memo);
  }

  // custom(op: custom): void {}
}