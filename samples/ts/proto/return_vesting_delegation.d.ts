import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to delegate_vesting_shares_operation.
 * Generated during block processing when process of returning removed or lowered vesting delegation is finished (after return period
 * passed) and delegator received back his vests.
 */
export interface return_vesting_delegation {
    /** @param {string} account - delegator (receiver of vesting_shares) */
    account: string;
    /** @param {asset} vesting_shares - (VESTS) returned delegation */
    vesting_shares: asset | undefined;
}
export declare const return_vesting_delegation: {
    fromJSON(object: any): return_vesting_delegation;
    toJSON(message: return_vesting_delegation): unknown;
    create<I extends {
        account?: string | undefined;
        vesting_shares?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        account?: string | undefined;
        vesting_shares?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["vesting_shares"], keyof asset>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof return_vesting_delegation>]: never; }>(base?: I | undefined): return_vesting_delegation;
    fromPartial<I_1 extends {
        account?: string | undefined;
        vesting_shares?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        account?: string | undefined;
        vesting_shares?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["vesting_shares"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof return_vesting_delegation>]: never; }>(object: I_1): return_vesting_delegation;
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
