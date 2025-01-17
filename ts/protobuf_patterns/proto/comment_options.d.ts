import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface beneficiary_route_type {
    account: string;
    weight: number;
}
export interface comment_payout_beneficiaries {
    beneficiaries: beneficiary_route_type[];
}
export interface comment_options_extension {
    comment_payout_beneficiaries?: comment_payout_beneficiaries | undefined;
}
/**
 * The operation comment_options_operation allows to set properties regarding payouts,
 * rewards or beneficiaries (using {extensions}) for comments.
 * If the operation: comment_options_operation is done by one of the frontends,
 * it is usually in the same transaction with the operation: comment_operation.
 * If a comment has received any votes, only the parameter {percent_hbd} may be changed.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/19_comment_options.md?ref_type=heads
 */
export interface comment_options {
    /** @param {string} author - Account name, the author of the comment. */
    author: string;
    permlink: string;
    /**
     * @param {asset} max_accepted_payout - The maximum value of payout in HBD.
     *                                      Default value: max_accepted_payout = asset( 1000000000, HBD_SYMBOL ).
     *                                      The allowed value should be less than the default value.
     *                                      If max_accepted_payout = 0, then voters and authors will not receive the payout.
     */
    max_accepted_payout: asset | undefined;
    /**
     * @param {number} percent_hbd - By default the author reward is paid 50% HP and 50 % HBD.
     *                               In some rare situations, instead of HBD, the Hive may be paid.
     *                               percent_hbd = HIVE_100_PERCENT means that 100 % of HBD part is paid in HBD.
     *                               A user may decide how many percent of HBD (from 50 %) they wants to receive in the HBD,
     *                               the rest will be paid out in HP.
     *                               Default value: percent_hbd = HIVE_100_PERCENT.
     *                               The allowed value should be less than the default value.
     *                               This is the only parameter that can be modified after the comment receives any vote.
     */
    percent_hbd: number;
    /**
     * @param {bool} allow_votes - The flag that allows to decide whether the comment may receive a vote.
     *                             Default value: allow_votes = true.
     */
    allow_votes: boolean;
    /**
     * @param {bool} allow_curation_rewards - The flag that allows to decide whether the voters for the comment should
     *                                        receive the curation rewards. Rewards return to the reward fund.
     *                                        Default value: allow_curation_rewards = true.
     */
    allow_curation_rewards: boolean;
    /**
     * @param {comment_options_extension} extensions - It may contain the list of the beneficiaries,
     *                                                 the accounts that should receive the author reward.
     *                                                 The list consists of the account name and the weight of the shares in the author reward.
     *                                                 If the sum of the weights is less than 100%,
     *                                                 the rest of the reward is received by the author.
     *                                                 It should be defined less than 128 accounts.
     *                                                 The allowed range of the weight is from 0 to 10000 (0 – 100%).
     *                                                 The beneficiaries should be listed in alphabetical order, no duplicates.
     */
    extensions: comment_options_extension[];
}
export declare const beneficiary_route_type: {
    fromJSON(object: any): beneficiary_route_type;
    toJSON(message: beneficiary_route_type): unknown;
    create<I extends Exact<DeepPartial<beneficiary_route_type>, I>>(base?: I): beneficiary_route_type;
    fromPartial<I extends Exact<DeepPartial<beneficiary_route_type>, I>>(object: I): beneficiary_route_type;
};
export declare const comment_payout_beneficiaries: {
    fromJSON(object: any): comment_payout_beneficiaries;
    toJSON(message: comment_payout_beneficiaries): unknown;
    create<I extends Exact<DeepPartial<comment_payout_beneficiaries>, I>>(base?: I): comment_payout_beneficiaries;
    fromPartial<I extends Exact<DeepPartial<comment_payout_beneficiaries>, I>>(object: I): comment_payout_beneficiaries;
};
export declare const comment_options_extension: {
    fromJSON(object: any): comment_options_extension;
    toJSON(message: comment_options_extension): unknown;
    create<I extends Exact<DeepPartial<comment_options_extension>, I>>(base?: I): comment_options_extension;
    fromPartial<I extends Exact<DeepPartial<comment_options_extension>, I>>(object: I): comment_options_extension;
};
export declare const comment_options: {
    fromJSON(object: any): comment_options;
    toJSON(message: comment_options): unknown;
    create<I extends Exact<DeepPartial<comment_options>, I>>(base?: I): comment_options;
    fromPartial<I extends Exact<DeepPartial<comment_options>, I>>(object: I): comment_options;
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
