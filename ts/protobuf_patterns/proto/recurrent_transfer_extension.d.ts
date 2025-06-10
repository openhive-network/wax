import { void_t } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface recurrent_transfer_pair_id {
    pair_id: number;
}
export interface recurrent_transfer_extension {
    void_t?: void_t | undefined;
    recurrent_transfer_pair_id?: recurrent_transfer_pair_id | undefined;
}
export declare const recurrent_transfer_pair_id: {
    fromJSON(object: any): recurrent_transfer_pair_id;
    toJSON(message: recurrent_transfer_pair_id): unknown;
    create<I extends Exact<DeepPartial<recurrent_transfer_pair_id>, I>>(base?: I): recurrent_transfer_pair_id;
    fromPartial<I extends Exact<DeepPartial<recurrent_transfer_pair_id>, I>>(object: I): recurrent_transfer_pair_id;
};
export declare const recurrent_transfer_extension: {
    fromJSON(object: any): recurrent_transfer_extension;
    toJSON(message: recurrent_transfer_extension): unknown;
    create<I extends Exact<DeepPartial<recurrent_transfer_extension>, I>>(base?: I): recurrent_transfer_extension;
    fromPartial<I extends Exact<DeepPartial<recurrent_transfer_extension>, I>>(object: I): recurrent_transfer_extension;
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
