import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface void_t {
}
export interface future_extensions {
    void_t?: void_t | undefined;
}
export declare const void_t: {
    encode(_: void_t, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): void_t;
    fromJSON(_: any): void_t;
    toJSON(_: void_t): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): void_t;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): void_t;
};
export declare const future_extensions: {
    encode(message: future_extensions, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): future_extensions;
    fromJSON(object: any): future_extensions;
    toJSON(message: future_extensions): unknown;
    create<I extends {
        void_t?: {} | undefined;
    } & {
        void_t?: ({} & {} & { [K in Exclude<keyof I["void_t"], never>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, "void_t">]: never; }>(base?: I | undefined): future_extensions;
    fromPartial<I_1 extends {
        void_t?: {} | undefined;
    } & {
        void_t?: ({} & {} & { [K_2 in Exclude<keyof I_1["void_t"], never>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, "void_t">]: never; }>(object: I_1): future_extensions;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
declare type KeysOfUnion<T> = T extends T ? keyof T : never;
export declare type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
