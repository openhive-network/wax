import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to vote_operation.
 * Generated every time vote is cast for the first time or edited, but only as long as it is effective, that is,
 * the target comment was not yet cashed out.
 *
 * @param {string} voter - account that casts a vote
 * @param {string} author - author of comment voted on
 * @param {string} permlink - permlink of comment voted on
 * @param {number} weight - weight of vote depending on when vote was cast and with what power
 * @param {number} rshares - power of the vote
 * @param {number} total_vote_weight - sum of all vote weights on the target comment in the moment of casting current vote
 * @param {asset} pending_payout - (HBD) estimated reward on target comment; supplemented by AH RocksDB plugin
 */
export interface effective_comment_vote {
    voter: string;
    author: string;
    permlink: string;
    weight: string;
    rshares: string;
    total_vote_weight: string;
    pending_payout: asset | undefined;
}
export declare const effective_comment_vote: {
    fromJSON(object: any): effective_comment_vote;
    toJSON(message: effective_comment_vote): unknown;
    create<I extends {
        voter?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        weight?: string | undefined;
        rshares?: string | undefined;
        total_vote_weight?: string | undefined;
        pending_payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        voter?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        weight?: string | undefined;
        rshares?: string | undefined;
        total_vote_weight?: string | undefined;
        pending_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["pending_payout"], keyof asset>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof effective_comment_vote>]: never; }>(base?: I | undefined): effective_comment_vote;
    fromPartial<I_1 extends {
        voter?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        weight?: string | undefined;
        rshares?: string | undefined;
        total_vote_weight?: string | undefined;
        pending_payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        voter?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        weight?: string | undefined;
        rshares?: string | undefined;
        total_vote_weight?: string | undefined;
        pending_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["pending_payout"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof effective_comment_vote>]: never; }>(object: I_1): effective_comment_vote;
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
