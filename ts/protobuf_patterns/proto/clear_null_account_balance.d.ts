import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing.
 * Generated during block processing potentially every block, but only if nonzero assets were burned. Triggered by removal of all
 * assets from 'null' account balances.
 */
export interface clear_null_account_balance {
    /** @param {asset} total_cleared - (HIVE, VESTS or HBD) nonzero assets burned on 'null' account */
    total_cleared: asset[];
}
export declare const clear_null_account_balance: {
    fromJSON(object: any): clear_null_account_balance;
    toJSON(message: clear_null_account_balance): unknown;
    create<I extends Exact<DeepPartial<clear_null_account_balance>, I>>(base?: I): clear_null_account_balance;
    fromPartial<I extends Exact<DeepPartial<clear_null_account_balance>, I>>(object: I): clear_null_account_balance;
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
