import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to comment_operation.
 * Generated during block processing after cashout time passes even if there are no rewards.
 * Note: prior to HF17 comment could have multiple cashout windows.
 *
 * @param {string} author - author of comment
 * @param {string} permlink - permlink of comment
 */
export interface comment_payout_update {
    author: string;
    permlink: string;
}
export declare const comment_payout_update: {
    encode(message: comment_payout_update, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): comment_payout_update;
    fromJSON(object: any): comment_payout_update;
    toJSON(message: comment_payout_update): unknown;
    create<I extends {
        author?: string | undefined;
        permlink?: string | undefined;
    } & {
        author?: string | undefined;
        permlink?: string | undefined;
    } & { [K in Exclude<keyof I, keyof comment_payout_update>]: never; }>(base?: I | undefined): comment_payout_update;
    fromPartial<I_1 extends {
        author?: string | undefined;
        permlink?: string | undefined;
    } & {
        author?: string | undefined;
        permlink?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof comment_payout_update>]: never; }>(object: I_1): comment_payout_update;
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
