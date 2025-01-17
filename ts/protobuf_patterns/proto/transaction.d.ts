import { future_extensions } from "./future_extensions.js";
import { operation } from "./operation.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface transaction {
    ref_block_num: number;
    ref_block_prefix: number;
    expiration: string;
    operations: operation[];
    extensions: future_extensions[];
    /** for signed_transaction */
    signatures: string[];
}
export declare const transaction: {
    fromJSON(object: any): transaction;
    toJSON(message: transaction): unknown;
    create<I extends Exact<DeepPartial<transaction>, I>>(base?: I): transaction;
    fromPartial<I extends Exact<DeepPartial<transaction>, I>>(object: I): transaction;
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
