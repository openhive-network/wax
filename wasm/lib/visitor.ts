import { operation, limit_order_cancel, vote, comment, recurrent_transfer } from "./protocol.js";

type UnionAsReturnTypes<T> = T extends never ? never : () => T;

type UnionToIntersection<U> = 
(
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void ? I : never;


type Transform<T> = Omit<T, "$case"> [ keyof Omit<T, "$case"> ];

type GetLastOfUnion<T> =
  UnionToIntersection<UnionAsReturnTypes<T>> extends () => infer W
    ? W
    : never
    ;

    type TransformUnionRecursive<T, R = Transform<GetLastOfUnion<T>> > =
    UnionToIntersection<UnionAsReturnTypes<T>> extends () => infer W
      ? TransformUnionRecursive<Exclude<T, W>, Transform<W> | R>
      : R;
  
type HiveOperation = TransformUnionRecursive<Required<operation>["value"]>;

let v : vote = vote.create({voter: "AAA"});
let any_op : HiveOperation;

any_op=v;

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
