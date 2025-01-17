export declare const protobufPackage = "hive.protocol.buffers";
export interface asset {
    amount: string;
    precision: number;
    nai: string;
}
export declare const asset: {
    fromJSON(object: any): asset;
    toJSON(message: asset): unknown;
    create<I extends Exact<DeepPartial<asset>, I>>(base?: I): asset;
    fromPartial<I extends Exact<DeepPartial<asset>, I>>(object: I): asset;
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
