import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to limit_order_cancel_operation, limit_order_create_operation or limit_order_create2_operation.
 * Generated every time existing limit order is cancelled. It happens on explicit call (first operation), or in rare case of
 * filling limit order (second or third operation) when, after filling most of it, remaining funds are too small (would round
 * to zero when sold). Finally also generated during block processing for orders that reached expiration time without being filled.
 * @see fill_order
 *
 * @param {string} seller - user that placed an order (receiver of amount_back)
 * @param {number} orderid - id of the order
 * @param {asset} amount_back - (HIVE or HBD) remaining funds from original order that were not traded until cancellation
 */
export interface limit_order_cancelled {
    seller: string;
    orderid: number;
    amount_back: asset | undefined;
}
export declare const limit_order_cancelled: {
    fromJSON(object: any): limit_order_cancelled;
    toJSON(message: limit_order_cancelled): unknown;
    create<I extends {
        seller?: string | undefined;
        orderid?: number | undefined;
        amount_back?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        seller?: string | undefined;
        orderid?: number | undefined;
        amount_back?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["amount_back"], keyof asset>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof limit_order_cancelled>]: never; }>(base?: I | undefined): limit_order_cancelled;
    fromPartial<I_1 extends {
        seller?: string | undefined;
        orderid?: number | undefined;
        amount_back?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        seller?: string | undefined;
        orderid?: number | undefined;
        amount_back?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["amount_back"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof limit_order_cancelled>]: never; }>(object: I_1): limit_order_cancelled;
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
