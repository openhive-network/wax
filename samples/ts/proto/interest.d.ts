import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to any operation that modifies HBD liquid or savings balance (including block processing).
 * Generated when operation modified HBD balance and account received interest payment.
 * Interest is stored in related balance (liquid when liquid was modified, savings when savings was modified).
 * Note: since HF25 interest is not calculated nor paid on liquid balance.
 *
 * @param {string} owner - user that had his HBD balance modified (receiver of interest)
 * @param {asset} interest - (HBD) amount of interest paid
 * @param {bool} is_saved_into_hbd_balance - true when liquid balance was modified (not happening after HF25)
 */
export interface interest {
    owner: string;
    interest: asset | undefined;
    is_saved_into_hbd_balance: boolean;
}
export declare const interest: {
    encode(message: interest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): interest;
    fromJSON(object: any): interest;
    toJSON(message: interest): unknown;
    create<I extends {
        owner?: string | undefined;
        interest?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        is_saved_into_hbd_balance?: boolean | undefined;
    } & {
        owner?: string | undefined;
        interest?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["interest"], keyof asset>]: never; }) | undefined;
        is_saved_into_hbd_balance?: boolean | undefined;
    } & { [K_1 in Exclude<keyof I, keyof interest>]: never; }>(base?: I | undefined): interest;
    fromPartial<I_1 extends {
        owner?: string | undefined;
        interest?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        is_saved_into_hbd_balance?: boolean | undefined;
    } & {
        owner?: string | undefined;
        interest?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["interest"], keyof asset>]: never; }) | undefined;
        is_saved_into_hbd_balance?: boolean | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof interest>]: never; }>(object: I_1): interest;
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
