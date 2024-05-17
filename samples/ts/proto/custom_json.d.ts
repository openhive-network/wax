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
 * @param {string} required_auths
 * @param {string} required_posting_auths
 * @param {string} id - Must be less than 32 characters long.
 * @param {string} json - Must be a proper utf8 JSON string.
 */
export interface custom_json {
    required_auths: string[];
    required_posting_auths: string[];
    id: string;
    json: string;
}
export declare const custom_json: {
    fromJSON(object: any): custom_json;
    toJSON(message: custom_json): unknown;
    create<I extends {
        required_auths?: string[] | undefined;
        required_posting_auths?: string[] | undefined;
        id?: string | undefined;
        json?: string | undefined;
    } & {
        required_auths?: (string[] & string[] & { [K in Exclude<keyof I["required_auths"], keyof string[]>]: never; }) | undefined;
        required_posting_auths?: (string[] & string[] & { [K_1 in Exclude<keyof I["required_posting_auths"], keyof string[]>]: never; }) | undefined;
        id?: string | undefined;
        json?: string | undefined;
    } & { [K_2 in Exclude<keyof I, keyof custom_json>]: never; }>(base?: I | undefined): custom_json;
    fromPartial<I_1 extends {
        required_auths?: string[] | undefined;
        required_posting_auths?: string[] | undefined;
        id?: string | undefined;
        json?: string | undefined;
    } & {
        required_auths?: (string[] & string[] & { [K_3 in Exclude<keyof I_1["required_auths"], keyof string[]>]: never; }) | undefined;
        required_posting_auths?: (string[] & string[] & { [K_4 in Exclude<keyof I_1["required_posting_auths"], keyof string[]>]: never; }) | undefined;
        id?: string | undefined;
        json?: string | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof custom_json>]: never; }>(object: I_1): custom_json;
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
