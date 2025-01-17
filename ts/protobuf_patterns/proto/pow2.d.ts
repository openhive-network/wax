import { legacy_chain_properties } from "./legacy_chain_properties.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface pow2_input {
    worker_account: string;
    prev_block: string;
    nonce: string;
}
export interface pow2_pow {
    input: pow2_input | undefined;
    pow_summary: number;
}
export interface equihash_proof {
    n: number;
    k: number;
    seed: string;
    inputs: number[];
}
export interface equihash_pow {
    input: pow2_input | undefined;
    proof: equihash_proof | undefined;
    prev_block: string;
    pow_summary: number;
}
export interface pow2_work {
    pow2?: pow2_pow | undefined;
    equihash_pow?: equihash_pow | undefined;
}
export interface pow2 {
    work: pow2_work | undefined;
    new_owner_key?: string | undefined;
    props: legacy_chain_properties | undefined;
}
export declare const pow2_input: {
    fromJSON(object: any): pow2_input;
    toJSON(message: pow2_input): unknown;
    create<I extends Exact<DeepPartial<pow2_input>, I>>(base?: I): pow2_input;
    fromPartial<I extends Exact<DeepPartial<pow2_input>, I>>(object: I): pow2_input;
};
export declare const pow2_pow: {
    fromJSON(object: any): pow2_pow;
    toJSON(message: pow2_pow): unknown;
    create<I extends Exact<DeepPartial<pow2_pow>, I>>(base?: I): pow2_pow;
    fromPartial<I extends Exact<DeepPartial<pow2_pow>, I>>(object: I): pow2_pow;
};
export declare const equihash_proof: {
    fromJSON(object: any): equihash_proof;
    toJSON(message: equihash_proof): unknown;
    create<I extends Exact<DeepPartial<equihash_proof>, I>>(base?: I): equihash_proof;
    fromPartial<I extends Exact<DeepPartial<equihash_proof>, I>>(object: I): equihash_proof;
};
export declare const equihash_pow: {
    fromJSON(object: any): equihash_pow;
    toJSON(message: equihash_pow): unknown;
    create<I extends Exact<DeepPartial<equihash_pow>, I>>(base?: I): equihash_pow;
    fromPartial<I extends Exact<DeepPartial<equihash_pow>, I>>(object: I): equihash_pow;
};
export declare const pow2_work: {
    fromJSON(object: any): pow2_work;
    toJSON(message: pow2_work): unknown;
    create<I extends Exact<DeepPartial<pow2_work>, I>>(base?: I): pow2_work;
    fromPartial<I extends Exact<DeepPartial<pow2_work>, I>>(object: I): pow2_work;
};
export declare const pow2: {
    fromJSON(object: any): pow2;
    toJSON(message: pow2): unknown;
    create<I extends Exact<DeepPartial<pow2>, I>>(base?: I): pow2;
    fromPartial<I extends Exact<DeepPartial<pow2>, I>>(object: I): pow2;
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
