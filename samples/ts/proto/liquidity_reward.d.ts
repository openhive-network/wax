import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to limit_order_create_operation and limit_order_create2_operation.
 * Generated during block processing to indicate reward paid to the market makers on internal HIVE<->HBD market.
 * No longer active after HF12.
 * @see fill_order_operation
 */
export interface liquidity_reward {
    /** @param {string} owner - market maker (receiver of payout) */
    owner: string;
    /** @param {asset} payout - (HIVE) reward for provided liquidity */
    payout: asset | undefined;
}
export declare const liquidity_reward: {
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
