import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Similar to convert_operation, this operation instructs the blockchain to convert HIVE to HBD.
 * The operation is performed after 3.5 days, but the owner gets HBD immediately.
 * The price risk is cushioned by extra HIVE (HIVE_COLLATERAL_RATIO = 200 % ).
 * After actual conversion takes place the excess HIVE is returned to the owner.
 *
 * @param {string} owner - Account name.
 * @param {number} requestid - The number is given by a user. Should be unique for a user.
 * @param {asset} amount - Amount > 0, have to be in Hive.
 */
export interface collateralized_convert {
    owner: string;
    requestid: number;
    amount: asset | undefined;
}
export declare const collateralized_convert: {
    encode(message: collateralized_convert, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): collateralized_convert;
    fromJSON(object: any): collateralized_convert;
    toJSON(message: collateralized_convert): unknown;
    create<I extends {
        owner?: string | undefined;
        requestid?: number | undefined;
        amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        owner?: string | undefined;
        requestid?: number | undefined;
        amount?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["amount"], keyof asset>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof collateralized_convert>]: never; }>(base?: I | undefined): collateralized_convert;
    fromPartial<I_1 extends {
        owner?: string | undefined;
        requestid?: number | undefined;
        amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        owner?: string | undefined;
        requestid?: number | undefined;
        amount?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["amount"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof collateralized_convert>]: never; }>(object: I_1): collateralized_convert;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
