import { comment, custom_json, recurrent_transfer, transfer, transfer_from_savings, transfer_to_savings } from "../protocol.js";
import { OperationVisitor } from "../visitor.js";

export type TEncryptFn = (data: string) => string;

export class EncryptionVisitor extends OperationVisitor {
  public constructor(
    private readonly encrypt: TEncryptFn
  ) {
    super()
  }

  public comment(op: comment): void {
    op.body = this.encrypt(op.body);
  }

  public transfer(op: transfer): void {
    op.memo = this.encrypt(op.memo);
  }

  public custom_json(op: custom_json): void {
    op.json = JSON.stringify({ encrypted: this.encrypt(op.json) });
  }

  public transfer_to_savings(op: transfer_to_savings): void {
    op.memo = this.encrypt(op.memo);
  }

  public transfer_from_savings(op: transfer_from_savings): void {
    op.memo = this.encrypt(op.memo);
  }

  public recurrent_transfer(op: recurrent_transfer): void {
    op.memo = this.encrypt(op.memo);
  }

  // custom(op: custom): void {}
}