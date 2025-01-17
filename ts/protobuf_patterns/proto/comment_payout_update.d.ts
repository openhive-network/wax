export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to comment_operation.
 * Generated during block processing after cashout time passes even if there are no rewards.
 * Note: prior to HF17 comment could have multiple cashout windows.
 */
export interface comment_payout_update {
    /** @param {string} author - author of comment */
    author: string;
    /** @param {string} permlink - permlink of comment */
    permlink: string;
}
export declare const comment_payout_update: {
    fromJSON(object: any): comment_payout_update;
    toJSON(message: comment_payout_update): unknown;
    create<I extends Exact<DeepPartial<comment_payout_update>, I>>(base?: I): comment_payout_update;
    fromPartial<I extends Exact<DeepPartial<comment_payout_update>, I>>(object: I): comment_payout_update;
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
