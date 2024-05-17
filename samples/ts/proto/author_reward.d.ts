import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to comment_operation.
 * Generated during block processing after cashout time passes and comment is eligible for rewards (nonzero reward).
 * Note: the reward is the author portion of comment reward lowered by the rewards distributed towards beneficiaries
 * (therefore it can be zero).
 * @see comment_benefactor_reward_operation
 *
 * @param {string} author - author of the comment (receiver of hbd_payout, hive_payout, vesting_payout)
 * @param {string} permlink - permlink of the comment
 * @param {asset} hbd_payout - (HBD) part of reward
 * @param {asset} hive_payout - (HIVE) part of reward
 * @param {asset} vesting_payout - (VESTS) part of reward
 * @param {asset} curators_vesting_payout - (VESTS) curators' portion of comment reward (@see curation_reward_operation)
 * @param {bool} payout_must_be_claimed - true if payouts require use of claim_reward_balance_operation
 */
export interface author_reward {
    author: string;
    permlink: string;
    hbd_payout: asset | undefined;
    hive_payout: asset | undefined;
    vesting_payout: asset | undefined;
    curators_vesting_payout: asset | undefined;
    payout_must_be_claimed: boolean;
}
export declare const author_reward: {
    fromJSON(object: any): author_reward;
    toJSON(message: author_reward): unknown;
    create<I extends {
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
        curators_vesting_payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        payout_must_be_claimed?: boolean | undefined;
    } & {
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
        curators_vesting_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I["curators_vesting_payout"], keyof asset>]: never; }) | undefined;
        payout_must_be_claimed?: boolean | undefined;
    } & { [K_4 in Exclude<keyof I, keyof author_reward>]: never; }>(base?: I | undefined): author_reward;
    fromPartial<I_1 extends {
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
        curators_vesting_payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        payout_must_be_claimed?: boolean | undefined;
    } & {
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
        } & { [K_5 in Exclude<keyof I_1["hbd_payout"], keyof asset>]: never; }) | undefined;
        hive_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_6 in Exclude<keyof I_1["hive_payout"], keyof asset>]: never; }) | undefined;
        vesting_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_7 in Exclude<keyof I_1["vesting_payout"], keyof asset>]: never; }) | undefined;
        curators_vesting_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_8 in Exclude<keyof I_1["curators_vesting_payout"], keyof asset>]: never; }) | undefined;
        payout_must_be_claimed?: boolean | undefined;
    } & { [K_9 in Exclude<keyof I_1, keyof author_reward>]: never; }>(object: I_1): author_reward;
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
