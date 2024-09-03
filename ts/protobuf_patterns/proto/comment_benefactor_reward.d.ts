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
    create<I extends {
        benefactor?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        hbd_payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        hive_payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        vesting_payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        payout_must_be_claimed?: boolean | undefined;
    } & {
        benefactor?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        hbd_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["hbd_payout"], keyof asset>]: never; }) | undefined;
        hive_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["hive_payout"], keyof asset>]: never; }) | undefined;
        vesting_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I["vesting_payout"], keyof asset>]: never; }) | undefined;
        payout_must_be_claimed?: boolean | undefined;
    } & { [K_3 in Exclude<keyof I, keyof comment_benefactor_reward>]: never; }>(base?: I | undefined): comment_benefactor_reward;
    fromPartial<I_1 extends {
        benefactor?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        hbd_payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        hive_payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        vesting_payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        payout_must_be_claimed?: boolean | undefined;
    } & {
        benefactor?: string | undefined;
        author?: string | undefined;
        permlink?: string | undefined;
        hbd_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["hbd_payout"], keyof asset>]: never; }) | undefined;
        hive_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_5 in Exclude<keyof I_1["hive_payout"], keyof asset>]: never; }) | undefined;
        vesting_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_6 in Exclude<keyof I_1["vesting_payout"], keyof asset>]: never; }) | undefined;
        payout_must_be_claimed?: boolean | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof comment_benefactor_reward>]: never; }>(object: I_1): comment_benefactor_reward;
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
