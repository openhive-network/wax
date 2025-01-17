export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation custom_json_operation works similar as custom_operation,
 * but it is designed to be human readable/developer friendly.
 * The custom_json_operation is larger than custom_operation or custom_binary, that is why it costs more RC.
 * It should be signed as required in { required_auths } or { required_posting_auths }.
 * The examples of custom_json_operation:
 * - reblog
 * - muted
 * - pinned
 * - follow
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/18_custom_json.md?ref_type=heads
 */
export interface custom_json {
    /** @param {string} required_auths */
    required_auths: string[];
    /** @param {string} required_posting_auths */
    required_posting_auths: string[];
    /** @param {string} id - Must be less than 32 characters long. */
    id: string;
    /** @param {string} json - Must be a proper utf8 JSON string. */
    json: string;
}
export declare const custom_json: {
    fromJSON(object: any): custom_json;
    toJSON(message: custom_json): unknown;
    create<I extends Exact<DeepPartial<custom_json>, I>>(base?: I): custom_json;
    fromPartial<I extends Exact<DeepPartial<custom_json>, I>>(object: I): custom_json;
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
