import { asset } from "./asset.js";
import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Deprecated.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/41_account_create_with_delegation.md?ref_type=heads
 */
export interface account_create_with_delegation {
    fee: asset | undefined;
    delegation: asset | undefined;
    creator: string;
    new_account_name: string;
    owner: authority | undefined;
    active: authority | undefined;
    posting: authority | undefined;
    memo_key: string;
    json_metadata: string;
    extensions: future_extensions[];
}
export declare const account_create_with_delegation: {
    fromJSON(object: any): account_create_with_delegation;
    toJSON(message: account_create_with_delegation): unknown;
    create<I extends Exact<DeepPartial<account_create_with_delegation>, I>>(base?: I): account_create_with_delegation;
    fromPartial<I extends Exact<DeepPartial<account_create_with_delegation>, I>>(object: I): account_create_with_delegation;
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
