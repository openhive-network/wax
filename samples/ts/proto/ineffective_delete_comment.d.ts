import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to delete_comment_operation.
 * Generated when delete_comment_operation was executed but ignored.
 * Note: prior to HF19 it was possible to execute delete on comment that had net positive votes. Such operation was ignored.
 * This is the moment this vop is generated.
 *
 * @param {string} author - author of attempted-delete comment
 * @param {string} permlink - permlink of attempted-delete comment
 */
export interface ineffective_delete_comment {
    author: string;
    permlink: string;
}
export declare const ineffective_delete_comment: {
    encode(message: ineffective_delete_comment, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): ineffective_delete_comment;
    fromJSON(object: any): ineffective_delete_comment;
    toJSON(message: ineffective_delete_comment): unknown;
    create<I extends {
        author?: string | undefined;
        permlink?: string | undefined;
    } & {
        author?: string | undefined;
        permlink?: string | undefined;
    } & { [K in Exclude<keyof I, keyof ineffective_delete_comment>]: never; }>(base?: I | undefined): ineffective_delete_comment;
    fromPartial<I_1 extends {
        author?: string | undefined;
        permlink?: string | undefined;
    } & {
        author?: string | undefined;
        permlink?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof ineffective_delete_comment>]: never; }>(object: I_1): ineffective_delete_comment;
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
