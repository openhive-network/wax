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
    create<I extends Exact<DeepPartial<liquidity_reward>, I>>(base?: I): liquidity_reward;
    fromPartial<I extends Exact<DeepPartial<liquidity_reward>, I>>(object: I): liquidity_reward;
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
