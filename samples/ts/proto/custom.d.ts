import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * There are the following custom operations: custom_operation, custom_json_operation and custom_binary (currently is disabled).
 * The operation: custom_operation provides a generic way to add higher level protocols on top of witness consensus operations.
 *
 * @param {string} required_auths
 * @param {number} id
 * @param {string} data
 */
export interface custom {
    required_auths: string[];
    id: number;
    data: string;
}
export declare const custom: {
    encode(message: custom, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): custom;
    fromJSON(object: any): custom;
    toJSON(message: custom): unknown;
    create<I extends {
        required_auths?: string[] | undefined;
        id?: number | undefined;
        data?: string | undefined;
    } & {
        required_auths?: (string[] & string[] & { [K in Exclude<keyof I["required_auths"], keyof string[]>]: never; }) | undefined;
        id?: number | undefined;
        data?: string | undefined;
    } & { [K_1 in Exclude<keyof I, keyof custom>]: never; }>(base?: I | undefined): custom;
    fromPartial<I_1 extends {
        required_auths?: string[] | undefined;
        id?: number | undefined;
        data?: string | undefined;
    } & {
        required_auths?: (string[] & string[] & { [K_2 in Exclude<keyof I_1["required_auths"], keyof string[]>]: never; }) | undefined;
        id?: number | undefined;
        data?: string | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof custom>]: never; }>(object: I_1): custom;
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
