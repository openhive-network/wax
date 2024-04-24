import _m0 from "protobufjs/minimal.js";
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
 * @param {string} author - Account name, the author of the comment.
 * @param {string} permlink - The identifier of the comment.
 * @param {asset} max_accepted_payout - The maximum value of payout in HBD.
 *                                      Default value: max_accepted_payout = asset( 1000000000, HBD_SYMBOL ).
 *                                      The allowed value should be less than the default value.
 *                                      If max_accepted_payout = 0, then voters and authors will not receive the payout.
 * @param {number} percent_hbd - By default the author reward is paid 50% HP and 50 % HBD.
 *                               In some rare situations, instead of HBD, the Hive may be paid.
 *                               percent_hbd = HIVE_100_PERCENT means that 100 % of HBD part is paid in HBD.
 *                               A user may decide how many percent of HBD (from 50 %) they wants to receive in the HBD,
 *                               the rest will be paid out in HP.
 *                               Default value: percent_hbd = HIVE_100_PERCENT.
 *                               The allowed value should be less than the default value.
 *                               This is the only parameter that can be modified after the comment receives any vote.
 * @param {bool} allow_votes - The flag that allows to decide whether the comment may receive a vote.
 *                             Default value: allow_votes = true.
 * @param {bool} allow_curation_rewards - The flag that allows to decide whether the voters for the comment should
 *                                        receive the curation rewards. Rewards return to the reward fund.
 *                                        Default value: allow_curation_rewards = true.
 * @param {comment_options_extension} extensions - It may contain the list of the beneficiaries,
 *                                                 the accounts that should receive the author reward.
 *                                                 The list consists of the account name and the weight of the shares in the author reward.
 *                                                 If the sum of the weights is less than 100%,
 *                                                 the rest of the reward is received by the author.
 *                                                 It should be defined less than 128 accounts.
 *                                                 The allowed range of the weight is from 0 to 10000 (0 – 100%).
 *                                                 The beneficiaries should be listed in alphabetical order, no duplicates.
 */
export interface comment_options {
    author: string;
    permlink: string;
    max_accepted_payout: asset | undefined;
    percent_hbd: number;
    allow_votes: boolean;
    allow_curation_rewards: boolean;
    extensions: comment_options_extension[];
}
export declare const beneficiary_route_type: {
    encode(message: beneficiary_route_type, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): beneficiary_route_type;
    fromJSON(object: any): beneficiary_route_type;
    toJSON(message: beneficiary_route_type): unknown;
    create<I extends {
        account?: string | undefined;
        weight?: number | undefined;
    } & {
        account?: string | undefined;
        weight?: number | undefined;
    } & { [K in Exclude<keyof I, keyof beneficiary_route_type>]: never; }>(base?: I | undefined): beneficiary_route_type;
    fromPartial<I_1 extends {
        account?: string | undefined;
        weight?: number | undefined;
    } & {
        account?: string | undefined;
        weight?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof beneficiary_route_type>]: never; }>(object: I_1): beneficiary_route_type;
};
export declare const comment_payout_beneficiaries: {
    encode(message: comment_payout_beneficiaries, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): comment_payout_beneficiaries;
    fromJSON(object: any): comment_payout_beneficiaries;
    toJSON(message: comment_payout_beneficiaries): unknown;
    create<I extends {
        beneficiaries?: {
            account?: string | undefined;
            weight?: number | undefined;
        }[] | undefined;
    } & {
        beneficiaries?: ({
            account?: string | undefined;
            weight?: number | undefined;
        }[] & ({
            account?: string | undefined;
            weight?: number | undefined;
        } & {
            account?: string | undefined;
            weight?: number | undefined;
        } & { [K in Exclude<keyof I["beneficiaries"][number], keyof beneficiary_route_type>]: never; })[] & { [K_1 in Exclude<keyof I["beneficiaries"], keyof {
            account?: string | undefined;
            weight?: number | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, "beneficiaries">]: never; }>(base?: I | undefined): comment_payout_beneficiaries;
    fromPartial<I_1 extends {
        beneficiaries?: {
            account?: string | undefined;
            weight?: number | undefined;
        }[] | undefined;
    } & {
        beneficiaries?: ({
            account?: string | undefined;
            weight?: number | undefined;
        }[] & ({
            account?: string | undefined;
            weight?: number | undefined;
        } & {
            account?: string | undefined;
            weight?: number | undefined;
        } & { [K_3 in Exclude<keyof I_1["beneficiaries"][number], keyof beneficiary_route_type>]: never; })[] & { [K_4 in Exclude<keyof I_1["beneficiaries"], keyof {
            account?: string | undefined;
            weight?: number | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, "beneficiaries">]: never; }>(object: I_1): comment_payout_beneficiaries;
};
export declare const comment_options_extension: {
    encode(message: comment_options_extension, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): comment_options_extension;
    fromJSON(object: any): comment_options_extension;
    toJSON(message: comment_options_extension): unknown;
    create<I extends {
        comment_payout_beneficiaries?: {
            beneficiaries?: {
                account?: string | undefined;
                weight?: number | undefined;
            }[] | undefined;
        } | undefined;
    } & {
        comment_payout_beneficiaries?: ({
            beneficiaries?: {
                account?: string | undefined;
                weight?: number | undefined;
            }[] | undefined;
        } & {
            beneficiaries?: ({
                account?: string | undefined;
                weight?: number | undefined;
            }[] & ({
                account?: string | undefined;
                weight?: number | undefined;
            } & {
                account?: string | undefined;
                weight?: number | undefined;
            } & { [K in Exclude<keyof I["comment_payout_beneficiaries"]["beneficiaries"][number], keyof beneficiary_route_type>]: never; })[] & { [K_1 in Exclude<keyof I["comment_payout_beneficiaries"]["beneficiaries"], keyof {
                account?: string | undefined;
                weight?: number | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_2 in Exclude<keyof I["comment_payout_beneficiaries"], "beneficiaries">]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I, "comment_payout_beneficiaries">]: never; }>(base?: I | undefined): comment_options_extension;
    fromPartial<I_1 extends {
        comment_payout_beneficiaries?: {
            beneficiaries?: {
                account?: string | undefined;
                weight?: number | undefined;
            }[] | undefined;
        } | undefined;
    } & {
        comment_payout_beneficiaries?: ({
            beneficiaries?: {
                account?: string | undefined;
                weight?: number | undefined;
            }[] | undefined;
        } & {
            beneficiaries?: ({
                account?: string | undefined;
                weight?: number | undefined;
            }[] & ({
                account?: string | undefined;
                weight?: number | undefined;
            } & {
                account?: string | undefined;
                weight?: number | undefined;
            } & { [K_4 in Exclude<keyof I_1["comment_payout_beneficiaries"]["beneficiaries"][number], keyof beneficiary_route_type>]: never; })[] & { [K_5 in Exclude<keyof I_1["comment_payout_beneficiaries"]["beneficiaries"], keyof {
                account?: string | undefined;
                weight?: number | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_6 in Exclude<keyof I_1["comment_payout_beneficiaries"], "beneficiaries">]: never; }) | undefined;
    } & { [K_7 in Exclude<keyof I_1, "comment_payout_beneficiaries">]: never; }>(object: I_1): comment_options_extension;
};
export declare const comment_options: {
    encode(message: comment_options, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): comment_options;
    fromJSON(object: any): comment_options;
    toJSON(message: comment_options): unknown;
    create<I extends {
        author?: string | undefined;
        permlink?: string | undefined;
        max_accepted_payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        percent_hbd?: number | undefined;
        allow_votes?: boolean | undefined;
        allow_curation_rewards?: boolean | undefined;
        extensions?: {
            comment_payout_beneficiaries?: {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } | undefined;
        }[] | undefined;
    } & {
        author?: string | undefined;
        permlink?: string | undefined;
        max_accepted_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["max_accepted_payout"], keyof asset>]: never; }) | undefined;
        percent_hbd?: number | undefined;
        allow_votes?: boolean | undefined;
        allow_curation_rewards?: boolean | undefined;
        extensions?: ({
            comment_payout_beneficiaries?: {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } | undefined;
        }[] & ({
            comment_payout_beneficiaries?: {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } | undefined;
        } & {
            comment_payout_beneficiaries?: ({
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } & {
                beneficiaries?: ({
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] & ({
                    account?: string | undefined;
                    weight?: number | undefined;
                } & {
                    account?: string | undefined;
                    weight?: number | undefined;
                } & { [K_1 in Exclude<keyof I["extensions"][number]["comment_payout_beneficiaries"]["beneficiaries"][number], keyof beneficiary_route_type>]: never; })[] & { [K_2 in Exclude<keyof I["extensions"][number]["comment_payout_beneficiaries"]["beneficiaries"], keyof {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_3 in Exclude<keyof I["extensions"][number]["comment_payout_beneficiaries"], "beneficiaries">]: never; }) | undefined;
        } & { [K_4 in Exclude<keyof I["extensions"][number], "comment_payout_beneficiaries">]: never; })[] & { [K_5 in Exclude<keyof I["extensions"], keyof {
            comment_payout_beneficiaries?: {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_6 in Exclude<keyof I, keyof comment_options>]: never; }>(base?: I | undefined): comment_options;
    fromPartial<I_1 extends {
        author?: string | undefined;
        permlink?: string | undefined;
        max_accepted_payout?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        percent_hbd?: number | undefined;
        allow_votes?: boolean | undefined;
        allow_curation_rewards?: boolean | undefined;
        extensions?: {
            comment_payout_beneficiaries?: {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } | undefined;
        }[] | undefined;
    } & {
        author?: string | undefined;
        permlink?: string | undefined;
        max_accepted_payout?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_7 in Exclude<keyof I_1["max_accepted_payout"], keyof asset>]: never; }) | undefined;
        percent_hbd?: number | undefined;
        allow_votes?: boolean | undefined;
        allow_curation_rewards?: boolean | undefined;
        extensions?: ({
            comment_payout_beneficiaries?: {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } | undefined;
        }[] & ({
            comment_payout_beneficiaries?: {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } | undefined;
        } & {
            comment_payout_beneficiaries?: ({
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } & {
                beneficiaries?: ({
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] & ({
                    account?: string | undefined;
                    weight?: number | undefined;
                } & {
                    account?: string | undefined;
                    weight?: number | undefined;
                } & { [K_8 in Exclude<keyof I_1["extensions"][number]["comment_payout_beneficiaries"]["beneficiaries"][number], keyof beneficiary_route_type>]: never; })[] & { [K_9 in Exclude<keyof I_1["extensions"][number]["comment_payout_beneficiaries"]["beneficiaries"], keyof {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_10 in Exclude<keyof I_1["extensions"][number]["comment_payout_beneficiaries"], "beneficiaries">]: never; }) | undefined;
        } & { [K_11 in Exclude<keyof I_1["extensions"][number], "comment_payout_beneficiaries">]: never; })[] & { [K_12 in Exclude<keyof I_1["extensions"], keyof {
            comment_payout_beneficiaries?: {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_13 in Exclude<keyof I_1, keyof comment_options>]: never; }>(object: I_1): comment_options;
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
