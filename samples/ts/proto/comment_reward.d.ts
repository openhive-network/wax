import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to comment_operation.
 * Generated during block processing after cashout time passes and comment is eligible for rewards (nonzero reward).
 * Note: for informational purposes only, shows summary of comment reward, does not indicate any transfers.
 * @see curation_reward_operation
 * @see comment_benefactor_reward_operation
 * @see author_reward_operation
 */
export interface comment_reward {
    /** @param {string} author - author of the comment */
    author: string;
    /** @param {string} permlink - permlink of the comment */
    permlink: string;
    /** @param {asset} payout - (HBD) total value of comment reward recalculated to HBD */
    payout: asset | undefined;
    /** @param {number} author_rewards - (HIVE satoshi) raw author reward (@see author_reward_operation) [is it needed?] */
    author_rewards: string;
    /** @param {asset} total_payout_value - (HBD) overall author reward (from multiple cashouts prior to HF17) recalculated to HBD [is it needed?] */
    total_payout_value: asset | undefined;
    /** @param {asset} curator_payout_value - (HBD) overall curation reward (from multiple cashouts prior to HF17) recalculated to HBD [is it needed?] */
    curator_payout_value: asset | undefined;
    /** @param {asset} beneficiary_payout_value - (HBD) overall beneficiary reward (from multiple cashouts prior to HF17) recalculated to HBD [is it needed?] */
    beneficiary_payout_value: asset | undefined;
}
export declare const comment_reward: {
    fromJSON(object: any): comment_reward;
    toJSON(message: comment_reward): unknown;
    create<I extends {
        author?: string | undefined;
        permlink?: string | undefined;
        payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        author_rewards?: string | undefined;
        total_payout_value?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        curator_payout_value?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        beneficiary_payout_value?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        author?: string | undefined;
        permlink?: string | undefined;
        payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["payout"], keyof asset>]: never; }) | undefined;
        author_rewards?: string | undefined;
        total_payout_value?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["total_payout_value"], keyof asset>]: never; }) | undefined;
        curator_payout_value?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I["curator_payout_value"], keyof asset>]: never; }) | undefined;
        beneficiary_payout_value?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I["beneficiary_payout_value"], keyof asset>]: never; }) | undefined;
    } & { [K_4 in Exclude<keyof I, keyof comment_reward>]: never; }>(base?: I | undefined): comment_reward;
    fromPartial<I_1 extends {
        author?: string | undefined;
        permlink?: string | undefined;
        payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        author_rewards?: string | undefined;
        total_payout_value?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        curator_payout_value?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        beneficiary_payout_value?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        author?: string | undefined;
        permlink?: string | undefined;
        payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_5 in Exclude<keyof I_1["payout"], keyof asset>]: never; }) | undefined;
        author_rewards?: string | undefined;
        total_payout_value?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_6 in Exclude<keyof I_1["total_payout_value"], keyof asset>]: never; }) | undefined;
        curator_payout_value?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_7 in Exclude<keyof I_1["curator_payout_value"], keyof asset>]: never; }) | undefined;
        beneficiary_payout_value?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_8 in Exclude<keyof I_1["beneficiary_payout_value"], keyof asset>]: never; }) | undefined;
    } & { [K_9 in Exclude<keyof I_1, keyof comment_reward>]: never; }>(object: I_1): comment_reward;
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
