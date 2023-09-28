import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to limit_order_create_operation and limit_order_create2_operation.
 * Generated during one of above operations when order on internal market is partially or fully matched
 * (each match generates separate vop).
 *
 * @param {string} current_owner - user that recently created order (taker - receiver of open_pays)
 * @param {number} current_orderid - id of fresh order
 * @param {asset} current_pays - (HIVE or HBD) amount paid to open_owner
 * @param {string} open_owner - user that had his order on the market (maker - receiver of current_pays)
 * @param {number} open_orderid - id of waiting order
 * @param {asset} open_pays - (HBD or HIVE) amount paid to current_owner
 */
export interface fill_order {
    current_owner: string;
    current_orderid: number;
    current_pays: asset | undefined;
    open_owner: string;
    open_orderid: number;
    open_pays: asset | undefined;
}
export declare const fill_order: {
    encode(message: fill_order, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): fill_order;
    fromJSON(object: any): fill_order;
    toJSON(message: fill_order): unknown;
    create<I extends {
        current_owner?: string | undefined;
        current_orderid?: number | undefined;
        current_pays?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        open_owner?: string | undefined;
        open_orderid?: number | undefined;
        open_pays?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        current_owner?: string | undefined;
        current_orderid?: number | undefined;
        current_pays?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["current_pays"], keyof asset>]: never; }) | undefined;
        open_owner?: string | undefined;
        open_orderid?: number | undefined;
        open_pays?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["open_pays"], keyof asset>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof fill_order>]: never; }>(base?: I | undefined): fill_order;
    fromPartial<I_1 extends {
        current_owner?: string | undefined;
        current_orderid?: number | undefined;
        current_pays?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        open_owner?: string | undefined;
        open_orderid?: number | undefined;
        open_pays?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        current_owner?: string | undefined;
        current_orderid?: number | undefined;
        current_pays?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["current_pays"], keyof asset>]: never; }) | undefined;
        open_owner?: string | undefined;
        open_orderid?: number | undefined;
        open_pays?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["open_pays"], keyof asset>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof fill_order>]: never; }>(object: I_1): fill_order;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
declare type KeysOfUnion<T> = T extends T ? keyof T : never;
export declare type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
