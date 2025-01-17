import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to limit_order_create_operation and limit_order_create2_operation.
 * Generated during one of above operations when order on internal market is partially or fully matched
 * (each match generates separate vop).
 */
export interface fill_order {
    /** @param {string} current_owner - user that recently created order (taker - receiver of open_pays) */
    current_owner: string;
    /** @param {number} current_orderid - id of fresh order */
    current_orderid: number;
    /** @param {asset} current_pays - (HIVE or HBD) amount paid to open_owner */
    current_pays: asset | undefined;
    /** @param {string} open_owner - user that had his order on the market (maker - receiver of current_pays) */
    open_owner: string;
    /** @param {number} open_orderid - id of waiting order */
    open_orderid: number;
    /** @param {asset} open_pays - (HBD or HIVE) amount paid to current_owner */
    open_pays: asset | undefined;
}
export declare const fill_order: {
    fromJSON(object: any): fill_order;
    toJSON(message: fill_order): unknown;
    create<I extends Exact<DeepPartial<fill_order>, I>>(base?: I): fill_order;
    fromPartial<I extends Exact<DeepPartial<fill_order>, I>>(object: I): fill_order;
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
