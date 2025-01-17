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
    create<I extends Exact<DeepPartial<return_vesting_delegation>, I>>(base?: I): return_vesting_delegation;
    fromPartial<I extends Exact<DeepPartial<return_vesting_delegation>, I>>(object: I): return_vesting_delegation;
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
