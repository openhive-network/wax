import { legacy_chain_properties } from "./legacy_chain_properties.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface pow_work {
    worker: string;
    input: string;
    signature: string;
    work: string;
}
export interface pow {
    worker_account: string;
    block_id: string;
    nonce: string;
    work: pow_work | undefined;
    props: legacy_chain_properties | undefined;
}
export declare const pow_work: {
    fromJSON(object: any): pow_work;
    toJSON(message: pow_work): unknown;
    create<I extends Exact<DeepPartial<pow_work>, I>>(base?: I): pow_work;
    fromPartial<I extends Exact<DeepPartial<pow_work>, I>>(object: I): pow_work;
};
export declare const pow: {
    fromJSON(object: any): pow;
    toJSON(message: pow): unknown;
    create<I extends Exact<DeepPartial<pow>, I>>(base?: I): pow;
    fromPartial<I extends Exact<DeepPartial<pow>, I>>(object: I): pow;
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
