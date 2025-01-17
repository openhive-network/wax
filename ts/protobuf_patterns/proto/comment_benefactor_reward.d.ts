import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to comment_operation and comment_options_operation.
 * Generated during block processing after cashout time passes and comment is eligible for rewards (nonzero reward).
 * Note: the reward is a fragment of the author portion of comment reward depending on share assigned to benefactor
 * in comment options (can be zero due to rounding).
 * @see author_reward
 */
export interface comment_benefactor_reward {
    /** @param {string} benefactor - user assigned to receive share of author reward (receiver of payouts) */
    benefactor: string;
    /** @param {string} author - author of the comment */
    author: string;
    /** @param {string} permlink - permlink of the comment */
    permlink: string;
    /** @param {asset} hbd_payout - (HBD) part of reward */
    hbd_payout: asset | undefined;
    /** @param {asset} hive_payout - (HIVE) part of reward */
    hive_payout: asset | undefined;
    /** @param {asset} vesting_payout - (VESTS) part of reward */
    vesting_payout: asset | undefined;
    /** @param {bool} payout_must_be_claimed - true if payouts require use of claim_reward_balance_operation */
    payout_must_be_claimed: boolean;
}
export declare const comment_benefactor_reward: {
    fromJSON(object: any): comment_benefactor_reward;
    toJSON(message: comment_benefactor_reward): unknown;
    create<I extends Exact<DeepPartial<comment_benefactor_reward>, I>>(base?: I): comment_benefactor_reward;
    fromPartial<I extends Exact<DeepPartial<comment_benefactor_reward>, I>>(object: I): comment_benefactor_reward;
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
