import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * A user may upvote or downvote a post or a comment.
 *
 * A user has a voting power. The max voting power depends on HP.
 *
 * There are two manabars related to voting: Voting manabar and Downvoting manabar.
 * Voting and downvoting manabars are defined as a percentage of total vote weight.
 * Downvote manabar has 25% of the vote power weight and vote manabar has 100% of the vote power weight,
 * but a user downvote with the total vote weight (not 25 %, but 100%).
 *
 * When a user casts a vote, 1/50th of the remaining mana is used for a 100% vote.
 * The voting powers regenerate from 0 to 100% in 5 days (20% per day).
 *
 * If a voter casts another vote for the same post or comment before rewards are paid,
 * it counts as vote edit. Vote edit cancels all effects of previous vote and acts as completely new vote,
 * except mana used for previous vote is not returned.
 *
 * The author of the post or the comment may receive the reward,
 * the amount of the author's reward depends on the numbers and powers of the votes.
 * By default the author reward is paid 50% HP and 50 % HBD.
 *
 * A user who votes for the post or the comment may receive the curation reward. It is paid 100% HP. Its share depends on:
 * - voting power
 * - weight of the vote – a user may decide about the weight of the vote
 * - the time when they vote – the sooner you vote, the higher the share in the curation reward (the first 24 h
 *   the weight of the vote is 100% - early voting, next 48 hours the weight is divided by 2, then – till the 7th day - it is divided by 8)
 *
 * When a post or a comment receives a reward, it is divided between the author's reward and the curation reward.
 * The curation reward is shared among curators.
 *
 * The calculated reward should be more than 0.02 HBD to be paid, if it is less, it is not paid.
 *
 * A downvoting user doesn’t receive the curation reward.
 * Downvoting may affect the author of the comment's reputation when a user who downvotes has a higher reputation than the author.
 *
 * @param {string} voter - Account name.
 * @param {string} author - Account name, the author of the post or the comment.
 * @param {string} permlink - The identifier of the post or comment.
 * @param {number} weight - It defines how many percent of the non-used voting power a user wants to use.
 *                          Allowed values from -10000 (-100%) to 10000 (100%).
 *                          Downvotes: from -10000 (-100%) to 0.
 *                          Upvotes: from 0 to 10000 (100%).
 */
export interface vote {
    voter: string;
    author: string;
    permlink: string;
    weight: number;
}
export declare const vote: {
    encode(message: vote, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): vote;
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
