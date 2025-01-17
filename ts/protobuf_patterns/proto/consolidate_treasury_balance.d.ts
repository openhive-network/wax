import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing.
 * Generated during block processing potentially every block, but only if there is nonzero transfer. Transfer occurs
 * if there are assets on OBSOLETE_TREASURY_ACCOUNT ('steem.dao'). They are consolidated from all balances (per asset
 * type) and moved to NEW_HIVE_TREASURY_ACCOUNT ('hive.fund').
 */
export interface consolidate_treasury_balance {
    /** @param {asset} total_moved - (HIVE, VESTS or HBD) funds moved from old to new treasury */
    total_moved: asset[];
}
export declare const consolidate_treasury_balance: {
    fromJSON(object: any): consolidate_treasury_balance;
    toJSON(message: consolidate_treasury_balance): unknown;
    create<I extends Exact<DeepPartial<consolidate_treasury_balance>, I>>(base?: I): consolidate_treasury_balance;
    fromPartial<I extends Exact<DeepPartial<consolidate_treasury_balance>, I>>(object: I): consolidate_treasury_balance;
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
