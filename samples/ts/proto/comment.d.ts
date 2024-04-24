import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Using comment operation a user may create a post or a comment.
 * From the blockchain point of view, it is the same operation – always comment.
 * If a comment has no parent, it is a post.
 * The parent of the comment may be a post or a comment.
 * Users may comment their own comments.
 *
 * @param {string} parent_author - Account name, the author of the commented post or comment.
 *                                 If the operation creates a post, it is empty.
 *                                 It cannot be modified.
 * @param {string} parent_permlink - The identifier of the commented post or comment.
 *                                   When a user creates a post, it may contain the identifier of the community
 *                                   (e.g. hive-174695) or main tag (e.g. travel).
 *                                   It cannot be modified.
 * @param {string} author - Account name, the author of the post or the comment.
 *                          It cannot be modified.
 * @param {string} permlink - Unique to the author, the identifier of the post or comment.
 *                            It cannot be modified.
 * @param {string} title - The title of the submitted post, in case of the comment, is often empty.
 *                         It may be modified.
 * @param {string} body - The content of the post or the comment.
 *                        It may be modified.
 * @param {string} json_metadata - There is no blockchain validation on json_metadata,
 *                                 but the structure has been established by the community.
 *                                 From the blockchain point of view it is a json file.
 *                                 For the second layer, the following keys may be used:
 *                                 - app, e.g. peakd/2023.2.3
 *                                 - format, e.g. markdown
 *                                 - tags, e.g. photography
 *                                 - users
 *                                 - images
 */
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
    decode(input: _m0.Reader | Uint8Array, length?: number): comment;
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
