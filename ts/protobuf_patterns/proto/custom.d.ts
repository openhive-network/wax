export declare const protobufPackage = "hive.protocol.buffers";
/**
 * There are the following custom operations: custom_operation, custom_json_operation and custom_binary (currently is disabled).
 * The operation: custom_operation provides a generic way to add higher level protocols on top of witness consensus operations.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/15_custom.md?ref_type=heads
 */
export interface custom {
    /** @param {string} required_auths */
    required_auths: string[];
    /** @param {number} id */
    id: number;
    /** @param {string} data */
    data: string;
}
export declare const custom: {
    fromJSON(object: any): custom;
    toJSON(message: custom): unknown;
    create<I extends Exact<DeepPartial<custom>, I>>(base?: I): custom;
    fromPartial<I extends Exact<DeepPartial<custom>, I>>(object: I): custom;
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
