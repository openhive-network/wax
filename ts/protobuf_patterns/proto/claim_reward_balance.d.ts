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
    create<I extends Exact<DeepPartial<claim_reward_balance>, I>>(base?: I): claim_reward_balance;
    fromPartial<I extends Exact<DeepPartial<claim_reward_balance>, I>>(object: I): claim_reward_balance;
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
