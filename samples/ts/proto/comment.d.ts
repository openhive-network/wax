import * as _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface comment {
    parent_author: string;
    parent_permlink: string;
    author: string;
    permlink: string;
    title: string;
    body: string;
    json_metadata: string;
}
export declare const comment: {
    encode(message: comment, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): comment;
    fromJSON(object: any): comment;
    toJSON(message: comment): unknown;
    create<I extends {
        parent_author?: string | undefined;
        parent_permlink?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        title?: string | undefined;
        body?: string | undefined;
        json_metadata?: string | undefined;
    } & {
        parent_author?: string | undefined;
        parent_permlink?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        title?: string | undefined;
        body?: string | undefined;
        json_metadata?: string | undefined;
    } & { [K in Exclude<keyof I, keyof comment>]: never; }>(base?: I | undefined): comment;
    fromPartial<I_1 extends {
        parent_author?: string | undefined;
        parent_permlink?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        title?: string | undefined;
        body?: string | undefined;
        json_metadata?: string | undefined;
    } & {
        parent_author?: string | undefined;
        parent_permlink?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        title?: string | undefined;
        body?: string | undefined;
        json_metadata?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof comment>]: never; }>(object: I_1): comment;
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
