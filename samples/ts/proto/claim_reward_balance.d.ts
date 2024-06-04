import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * An operation claim_reward_balance_operation is used to transfer previously collected
 * author and/or curation rewards from sub balance for the reward to regular balances.
 * Rewards expressed in Hive and HBD are transferred to liquid balances, rewards in HP increase vesting balance.
 * When claimed, HP rewards are immediately active towards governance voting power (compare with transfer_to_vesting_operation).
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/39_claim_reward_balance.md?ref_type=heads
 */
export interface claim_reward_balance {
    /** @param {string} account - Account name. */
    account: string;
    /** @param {asset} reward_hive - The amount of Hive reward to be transferred to liquid balance. */
    reward_hive: asset | undefined;
    /** @param {asset} reward_hbd - The amount of HBD reward to be transferred to liquid balance */
    reward_hbd: asset | undefined;
    /** @param {asset} reward_vests - The amount of HP reward to be transferred to vesting balance. */
    reward_vests: asset | undefined;
}
export declare const claim_reward_balance: {
    fromJSON(object: any): claim_reward_balance;
    toJSON(message: claim_reward_balance): unknown;
    create<I extends {
        account?: string | undefined;
        reward_hive?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        reward_hbd?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        reward_vests?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        account?: string | undefined;
        reward_hive?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["reward_hive"], keyof asset>]: never; }) | undefined;
        reward_hbd?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["reward_hbd"], keyof asset>]: never; }) | undefined;
        reward_vests?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I["reward_vests"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I, keyof claim_reward_balance>]: never; }>(base?: I | undefined): claim_reward_balance;
    fromPartial<I_1 extends {
        account?: string | undefined;
        reward_hive?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        reward_hbd?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        reward_vests?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        account?: string | undefined;
        reward_hive?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["reward_hive"], keyof asset>]: never; }) | undefined;
        reward_hbd?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_5 in Exclude<keyof I_1["reward_hbd"], keyof asset>]: never; }) | undefined;
        reward_vests?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_6 in Exclude<keyof I_1["reward_vests"], keyof asset>]: never; }) | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof claim_reward_balance>]: never; }>(object: I_1): claim_reward_balance;
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
