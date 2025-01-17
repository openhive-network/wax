import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to vote_operation.
 * Generated every time vote is cast for the first time or edited, but only as long as it is effective, that is,
 * the target comment was not yet cashed out.
 */
export interface effective_comment_vote {
    /** @param {string} voter - account that casts a vote */
    voter: string;
    /** @param {string} author - author of comment voted on */
    author: string;
    /** @param {string} permlink - permlink of comment voted on */
    permlink: string;
    /** @param {number} weight - weight of vote depending on when vote was cast and with what power */
    weight: string;
    /** @param {number} rshares - power of the vote */
    rshares: string;
    /** @param {number} total_vote_weight - sum of all vote weights on the target comment in the moment of casting current vote */
    total_vote_weight: string;
    /** @param {asset} pending_payout - (HBD) estimated reward on target comment; supplemented by AH RocksDB plugin */
    pending_payout: asset | undefined;
}
export declare const effective_comment_vote: {
    fromJSON(object: any): effective_comment_vote;
    toJSON(message: effective_comment_vote): unknown;
    create<I extends Exact<DeepPartial<effective_comment_vote>, I>>(base?: I): effective_comment_vote;
    fromPartial<I extends Exact<DeepPartial<effective_comment_vote>, I>>(object: I): effective_comment_vote;
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
