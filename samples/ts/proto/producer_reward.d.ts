import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing.
 * Generated during block processing every block for current witness.
 *
 * @param {string} producer - witness (receiver of vesting_shares)
 * @param {asset} vesting_shares - (VESTS or HIVE) reward for block production (HIVE only during first 30 days after genesis)
 */
export interface producer_reward {
    producer: string;
    vesting_shares: asset | undefined;
}
export declare const producer_reward: {
    encode(message: producer_reward, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): producer_reward;
    fromJSON(object: any): producer_reward;
    toJSON(message: producer_reward): unknown;
    create<I extends {
        producer?: string | undefined;
        vesting_shares?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        producer?: string | undefined;
        vesting_shares?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["vesting_shares"], keyof asset>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof producer_reward>]: never; }>(base?: I | undefined): producer_reward;
    fromPartial<I_1 extends {
        producer?: string | undefined;
        vesting_shares?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        producer?: string | undefined;
        vesting_shares?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["vesting_shares"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof producer_reward>]: never; }>(object: I_1): producer_reward;
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
