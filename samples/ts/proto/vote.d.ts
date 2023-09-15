import * as _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface vote {
    voter: string;
    author: string;
    permlink: string;
    weight: number;
}
export declare const vote: {
    encode(message: vote, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): vote;
    fromJSON(object: any): vote;
    toJSON(message: vote): unknown;
    create<I extends {
        voter?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        weight?: number | undefined;
    } & {
        voter?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        weight?: number | undefined;
    } & { [K in Exclude<keyof I, keyof vote>]: never; }>(base?: I | undefined): vote;
    fromPartial<I_1 extends {
        voter?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        weight?: number | undefined;
    } & {
        voter?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        weight?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof vote>]: never; }>(object: I_1): vote;
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
