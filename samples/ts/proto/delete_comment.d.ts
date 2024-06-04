export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The post or comment may be deleted by the author. If the post or comment is deleted, the {permlink} may be reused.
 * The delete doesn’t mean that the comment is removed from the blockchain.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/17_delete_comment.md?ref_type=heads
 */
export interface delete_comment {
    /** @param {string} author - Account name, the author of the post or the comment. */
    author: string;
    /** @param {string} permlink - The identifier of the post or the comment. */
    permlink: string;
}
export declare const delete_comment: {
    fromJSON(object: any): delete_comment;
    toJSON(message: delete_comment): unknown;
    create<I extends {
        author?: string | undefined;
        permlink?: string | undefined;
    } & {
        author?: string | undefined;
        permlink?: string | undefined;
    } & { [K in Exclude<keyof I, keyof delete_comment>]: never; }>(base?: I | undefined): delete_comment;
    fromPartial<I_1 extends {
        author?: string | undefined;
        permlink?: string | undefined;
    } & {
        author?: string | undefined;
        permlink?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof delete_comment>]: never; }>(object: I_1): delete_comment;
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
