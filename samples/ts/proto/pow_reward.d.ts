import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to pow_operation and pow2_operation.
 * Generated every time one of above operations is executed (up to HF16).
 * Note: pow2_operation could be executed up to HF17 but mining rewards were stopped after HF16.
 */
export interface pow_reward {
    /** @param {string} worker - (potentially new) witness that calculated PoW (receiver of reward) */
    worker: string;
    /** @param {asset} reward - (VESTS or HIVE) reward for work (HIVE only during first 30 days after genesis) */
    reward: asset | undefined;
}
export declare const pow_reward: {
    fromJSON(object: any): pow_reward;
    toJSON(message: pow_reward): unknown;
    create<I extends {
        worker?: string | undefined;
        reward?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        worker?: string | undefined;
        reward?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["reward"], keyof asset>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof pow_reward>]: never; }>(base?: I | undefined): pow_reward;
    fromPartial<I_1 extends {
        worker?: string | undefined;
        reward?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        worker?: string | undefined;
        reward?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["reward"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof pow_reward>]: never; }>(object: I_1): pow_reward;
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
