export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing.
 * Generated during block processing every time new hardfork is activated. Many related vops can follow.
 */
export interface hardfork {
    /** @param {number} hardfork_id - number of hardfork */
    hardfork_id: number;
}
export declare const hardfork: {
    fromJSON(object: any): hardfork;
    toJSON(message: hardfork): unknown;
    create<I extends {
        hardfork_id?: number | undefined;
    } & {
        hardfork_id?: number | undefined;
    } & { [K in Exclude<keyof I, "hardfork_id">]: never; }>(base?: I | undefined): hardfork;
    fromPartial<I_1 extends {
        hardfork_id?: number | undefined;
    } & {
        hardfork_id?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, "hardfork_id">]: never; }>(object: I_1): hardfork;
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
