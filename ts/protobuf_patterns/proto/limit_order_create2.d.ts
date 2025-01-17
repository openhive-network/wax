import { asset } from "./asset.js";
import { price } from "./price.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This operation creates a limit order and matches it against existing open orders.
 * It is similar to limit_order_create except it serializes the price rather than calculating it from other fields.
 * It allows to sell Hive and buy HBD or sell HBD and buy Hive.
 * It is a way for a user to declare they wants to sell {amount_to_sell} Hive/HBD for at least {exchange_rate}  per HBD/Hive.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/21_limit_order_create2.md?ref_type=heads
 */
export interface limit_order_create2 {
    /** @param {string} owner */
    owner: string;
    /** @param {number} orderid - an ID assigned by owner, must be unique. */
    orderid: number;
    /** @param {asset} amount_to_sell */
    amount_to_sell: asset | undefined;
    /**
     * @param {bool} fill_or_kill - If fill_or_kill = true, then the operation is executed immediately
     *                              or it fails (the operation is not added to the block).
     *                              If fill_or_kill = false, then the order is valid till {expiration}.
     */
    fill_or_kill: boolean;
    /** @param {price} exchange_rate */
    exchange_rate: price | undefined;
    /** @param {string} expiration */
    expiration: string;
}
export declare const limit_order_create2: {
    fromJSON(object: any): limit_order_create2;
    toJSON(message: limit_order_create2): unknown;
    create<I extends Exact<DeepPartial<limit_order_create2>, I>>(base?: I): limit_order_create2;
    fromPartial<I extends Exact<DeepPartial<limit_order_create2>, I>>(object: I): limit_order_create2;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
