import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to hardfork 1.
 * Generated for every account with nonzero vesting balance.
 * Note: due to too small precision of VESTS asset it was increased by 6 digits, meaning all underlying
 * amounts had to be multiplied by million.s
 */
export interface vesting_shares_split {
    /** @param {string} owner - affected account (source of vesting_shares_before_split and receiver of vesting_shares_after_split) */
    owner: string;
    /** @param {asset} vesting_shares_before_split - (VESTS) balance before split */
    vesting_shares_before_split: asset | undefined;
    /** @param {asset} vesting_shares_after_split - (VESTS) balance after split */
    vesting_shares_after_split: asset | undefined;
}
export declare const vesting_shares_split: {
    fromJSON(object: any): vesting_shares_split;
    toJSON(message: vesting_shares_split): unknown;
    create<I extends {
        owner?: string | undefined;
        vesting_shares_before_split?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        vesting_shares_after_split?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        owner?: string | undefined;
        vesting_shares_before_split?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["vesting_shares_before_split"], keyof asset>]: never; }) | undefined;
        vesting_shares_after_split?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["vesting_shares_after_split"], keyof asset>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof vesting_shares_split>]: never; }>(base?: I | undefined): vesting_shares_split;
    fromPartial<I_1 extends {
        owner?: string | undefined;
        vesting_shares_before_split?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        vesting_shares_after_split?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        owner?: string | undefined;
        vesting_shares_before_split?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["vesting_shares_before_split"], keyof asset>]: never; }) | undefined;
        vesting_shares_after_split?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["vesting_shares_after_split"], keyof asset>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof vesting_shares_split>]: never; }>(object: I_1): vesting_shares_split;
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
