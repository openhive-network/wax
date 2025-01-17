import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing.
 * Generated during block processing every block for current witness.
 */
export interface producer_reward {
    /** @param {string} producer - witness (receiver of vesting_shares) */
    producer: string;
    /** @param {asset} vesting_shares - (VESTS or HIVE) reward for block production (HIVE only during first 30 days after genesis) */
    vesting_shares: asset | undefined;
}
export declare const producer_reward: {
    fromJSON(object: any): producer_reward;
    toJSON(message: producer_reward): unknown;
    create<I extends Exact<DeepPartial<producer_reward>, I>>(base?: I): producer_reward;
    fromPartial<I extends Exact<DeepPartial<producer_reward>, I>>(object: I): producer_reward;
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
