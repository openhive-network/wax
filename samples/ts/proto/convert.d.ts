import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This operation instructs the blockchain to start a conversion of HBD to Hive.
 * The funds are deposited after 3.5 days.
 *
 * @param {string} owner - Account name.
 * @param {number} requestid - The number is given by a user. Should be unique for a user.
 * @param {asset} amount - Amount > 0, have to be in HBD.
 */
export interface convert {
    owner: string;
    requestid: number;
    amount: asset | undefined;
}
export declare const convert: {
    encode(message: convert, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): convert;
    fromJSON(object: any): convert;
    toJSON(message: convert): unknown;
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
    } & { [K_1 in Exclude<keyof I, keyof convert>]: never; }>(base?: I | undefined): convert;
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
    } & { [K_3 in Exclude<keyof I_1, keyof convert>]: never; }>(object: I_1): convert;
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
