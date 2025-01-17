import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to comment_operation and comment_vote_operation.
 * Generated during block processing after cashout time passes and comment is eligible for rewards (nonzero reward).
 * Note: the reward is a fragment of curators' portion of comment reward depending on share of particular curator in overall
 * curation power for the comment. Only generated when nonzero.
 */
export interface curation_reward {
    /** @param {string} curator - user that curated the comment (receiver of reward) */
    curator: string;
    /** @param {asset} reward - (VESTS) curation reward */
    reward: asset | undefined;
    /** @param {string} author - author of curated comment */
    author: string;
    /** @param {string} permlink - permlink of curated comment */
    permlink: string;
    /** @param {bool} payout_must_be_claimed - true if payouts require use of claim_reward_balance_operation */
    payout_must_be_claimed: boolean;
}
export declare const curation_reward: {
    fromJSON(object: any): curation_reward;
    toJSON(message: curation_reward): unknown;
    create<I extends Exact<DeepPartial<curation_reward>, I>>(base?: I): curation_reward;
    fromPartial<I extends Exact<DeepPartial<curation_reward>, I>>(object: I): curation_reward;
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
