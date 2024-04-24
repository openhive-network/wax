import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
import { price } from "./price.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This operation creates a limit order and matches it against existing open orders.
 * It is similar to limit_order_create except it serializes the price rather than calculating it from other fields.
 * It allows to sell Hive and buy HBD or sell HBD and buy Hive.
 * It is a way for a user to declare they wants to sell {amount_to_sell} Hive/HBD for at least {exchange_rate}  per HBD/Hive.
 *
 * @param {string} owner
 * @param {number} orderid - an ID assigned by owner, must be unique.
 * @param {asset} amount_to_sell
 * @param {bool} fill_or_kill - If fill_or_kill = true, then the operation is executed immediately
 *                              or it fails (the operation is not added to the block).
 *                              If fill_or_kill = false, then the order is valid till {expiration}.
 * @param {price} exchange_rate
 * @param {string} expiration
 */
export interface limit_order_create2 {
    owner: string;
    orderid: number;
    amount_to_sell: asset | undefined;
    fill_or_kill: boolean;
    exchange_rate: price | undefined;
    expiration: string;
}
export declare const limit_order_create2: {
    encode(message: limit_order_create2, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): limit_order_create2;
    fromJSON(object: any): limit_order_create2;
    toJSON(message: limit_order_create2): unknown;
    create<I extends {
        owner?: string | undefined;
        orderid?: number | undefined;
        amount_to_sell?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        fill_or_kill?: boolean | undefined;
        exchange_rate?: {
            base?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            quote?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        expiration?: string | undefined;
    } & {
        owner?: string | undefined;
        orderid?: number | undefined;
        amount_to_sell?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["amount_to_sell"], keyof asset>]: never; }) | undefined;
        fill_or_kill?: boolean | undefined;
        exchange_rate?: ({
            base?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            quote?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            base?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_1 in Exclude<keyof I["exchange_rate"]["base"], keyof asset>]: never; }) | undefined;
            quote?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_2 in Exclude<keyof I["exchange_rate"]["quote"], keyof asset>]: never; }) | undefined;
        } & { [K_3 in Exclude<keyof I["exchange_rate"], keyof price>]: never; }) | undefined;
        expiration?: string | undefined;
    } & { [K_4 in Exclude<keyof I, keyof limit_order_create2>]: never; }>(base?: I | undefined): limit_order_create2;
    fromPartial<I_1 extends {
        owner?: string | undefined;
        orderid?: number | undefined;
        amount_to_sell?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        fill_or_kill?: boolean | undefined;
        exchange_rate?: {
            base?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            quote?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        expiration?: string | undefined;
    } & {
        owner?: string | undefined;
        orderid?: number | undefined;
        amount_to_sell?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_5 in Exclude<keyof I_1["amount_to_sell"], keyof asset>]: never; }) | undefined;
        fill_or_kill?: boolean | undefined;
        exchange_rate?: ({
            base?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            quote?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            base?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_6 in Exclude<keyof I_1["exchange_rate"]["base"], keyof asset>]: never; }) | undefined;
            quote?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_7 in Exclude<keyof I_1["exchange_rate"]["quote"], keyof asset>]: never; }) | undefined;
        } & { [K_8 in Exclude<keyof I_1["exchange_rate"], keyof price>]: never; }) | undefined;
        expiration?: string | undefined;
    } & { [K_9 in Exclude<keyof I_1, keyof limit_order_create2>]: never; }>(object: I_1): limit_order_create2;
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
