import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to limit_order_create_operation and limit_order_create2_operation.
 * Generated during block processing to indicate reward paid to the market makers on internal HIVE<->HBD market.
 * No longer active after HF12.
 * @see fill_order_operation
 *
 * @param {string} owner - market maker (receiver of payout)
 * @param {asset} payout - (HIVE) reward for provided liquidity
 */
export interface liquidity_reward {
    owner: string;
    payout: asset | undefined;
}
export declare const liquidity_reward: {
    encode(message: liquidity_reward, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): liquidity_reward;
    fromJSON(object: any): liquidity_reward;
    toJSON(message: liquidity_reward): unknown;
    create<I extends {
        owner?: string | undefined;
        payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        owner?: string | undefined;
        payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["payout"], keyof asset>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof liquidity_reward>]: never; }>(base?: I | undefined): liquidity_reward;
    fromPartial<I_1 extends {
        owner?: string | undefined;
        payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        owner?: string | undefined;
        payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["payout"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof liquidity_reward>]: never; }>(object: I_1): liquidity_reward;
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
