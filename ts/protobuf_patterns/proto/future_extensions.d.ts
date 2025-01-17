export declare const protobufPackage = "hive.protocol.buffers";
export interface void_t {
}
export interface future_extensions {
    void_t?: void_t | undefined;
}
export declare const void_t: {
    fromJSON(_: any): void_t;
    toJSON(_: void_t): unknown;
    create<I extends Exact<DeepPartial<void_t>, I>>(base?: I): void_t;
    fromPartial<I extends Exact<DeepPartial<void_t>, I>>(_: I): void_t;
};
export declare const future_extensions: {
    fromJSON(object: any): future_extensions;
    toJSON(message: future_extensions): unknown;
    create<I extends Exact<DeepPartial<future_extensions>, I>>(base?: I): future_extensions;
    fromPartial<I extends Exact<DeepPartial<future_extensions>, I>>(object: I): future_extensions;
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
