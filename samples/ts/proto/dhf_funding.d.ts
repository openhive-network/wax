import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing.
 * Generated during block processing every proposal maintenance period.
 * Note: while the fund receives part of inflation every block, the amount is recorded aside and only when there are
 * proposal payouts (when new funds matter), there is generation of this vop.
 *
 * @param {string} treasury - treasury account (receiver of additional_funds)
 * @param {asset} additional_funds - (HBD) portion inflation accumulated since previous maintenance period
 */
export interface dhf_funding {
    treasury: string;
    additional_funds: asset | undefined;
}
export declare const dhf_funding: {
    encode(message: dhf_funding, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): dhf_funding;
    fromJSON(object: any): dhf_funding;
    toJSON(message: dhf_funding): unknown;
    create<I extends {
        treasury?: string | undefined;
        additional_funds?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        treasury?: string | undefined;
        additional_funds?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["additional_funds"], keyof asset>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof dhf_funding>]: never; }>(base?: I | undefined): dhf_funding;
    fromPartial<I_1 extends {
        treasury?: string | undefined;
        additional_funds?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        treasury?: string | undefined;
        additional_funds?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["additional_funds"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof dhf_funding>]: never; }>(object: I_1): dhf_funding;
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
