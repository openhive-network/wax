import { operation, limit_order_cancel, vote, comment, recurrent_transfer } from "./protocol.js";

export type TOperationVisitor<R = void> = {
  [K in keyof Required<operation>]?: (op: Required<operation>[K]) => R;
};

// https://github.com/Microsoft/TypeScript/issues/8306#issuecomment-1636697326
declare const _: unique symbol;
type NoOverride = { [_]: typeof _; };

export class OperationVisitor<R = void> implements TOperationVisitor<R> {
  /**
   * You should not override this method
   */
  readonly accept = (op: operation): NoOverride & (R | void) => {
    const key = Object.keys(op).filter((key: string) => typeof op[key] !== 'undefined')[0] as (keyof operation | undefined);

    if(typeof key !== 'undefined')
      return this[key]?.(op[key] as any) as (NoOverride & R);
  };

  limit_order_cancel?(op: limit_order_cancel): R;
  vote?(op: vote): R;
  comment?(op: comment): R;
  recurrent_transfer?(op: recurrent_transfer): R;
}
