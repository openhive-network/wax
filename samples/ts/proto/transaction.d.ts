import * as _m0 from "protobufjs/minimal.js";
import { account_create } from "./account_create.js";
import { comment } from "./comment.js";
import { future_extensions } from "./future_extensions.js";
import { limit_order_cancel } from "./limit_order_cancel.js";
import { recurrent_transfer } from "./recurrent_transfer.js";
import { transfer } from "./transfer.js";
import { vote } from "./vote.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * NOTE: do not change the order of any operations prior to the virtual operations
 * or it will trigger a hardfork.
 */
export interface operation {
    vote?: vote | undefined;
    comment?: comment | undefined;
    transfer?: transfer | undefined;
    limit_order_cancel?: limit_order_cancel | undefined;
    account_create?: account_create | undefined;
    recurrent_transfer?: recurrent_transfer | undefined;
}
export interface transaction {
    ref_block_num: number;
    ref_block_prefix: number;
    expiration: string;
    operations: operation[];
    extensions: future_extensions[];
}
export declare const operation: {
    encode(message: operation, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): operation;
    fromJSON(object: any): operation;
    toJSON(message: operation): unknown;
    create<I extends {
        vote?: {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } | undefined;
        comment?: {
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } | undefined;
        transfer?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
        } | undefined;
        limit_order_cancel?: {
            order?: string | undefined;
            orderid?: number | undefined;
        } | undefined;
        account_create?: {
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            creator?: string | undefined;
            new_account_name?: string | undefined;
            owner?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            active?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            posting?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } | undefined;
        recurrent_transfer?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
            recurrence?: number | undefined;
            executions?: number | undefined;
            extensions?: {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[] | undefined;
        } | undefined;
    } & {
        vote?: ({
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } & {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } & { [K in Exclude<keyof I["vote"], keyof vote>]: never; }) | undefined;
        comment?: ({
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } & {
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_1 in Exclude<keyof I["comment"], keyof comment>]: never; }) | undefined;
        transfer?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_2 in Exclude<keyof I["transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_3 in Exclude<keyof I["transfer"], keyof transfer>]: never; }) | undefined;
        limit_order_cancel?: ({
            order?: string | undefined;
            orderid?: number | undefined;
        } & {
            order?: string | undefined;
            orderid?: number | undefined;
        } & { [K_4 in Exclude<keyof I["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
        account_create?: ({
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            creator?: string | undefined;
            new_account_name?: string | undefined;
            owner?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            active?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            posting?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & {
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_5 in Exclude<keyof I["account_create"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            creator?: string | undefined;
            new_account_name?: string | undefined;
            owner?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_6 in Exclude<keyof I["account_create"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_7 in Exclude<keyof I["account_create"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_8 in Exclude<keyof I["account_create"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
            active?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_9 in Exclude<keyof I["account_create"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_10 in Exclude<keyof I["account_create"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_11 in Exclude<keyof I["account_create"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
            posting?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_12 in Exclude<keyof I["account_create"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_13 in Exclude<keyof I["account_create"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_14 in Exclude<keyof I["account_create"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_15 in Exclude<keyof I["account_create"], keyof account_create>]: never; }) | undefined;
        recurrent_transfer?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
            recurrence?: number | undefined;
            executions?: number | undefined;
            extensions?: {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[] | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_16 in Exclude<keyof I["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
            recurrence?: number | undefined;
            executions?: number | undefined;
            extensions?: ({
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[] & ({
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            } & {
                void_t?: ({} & {} & { [K_17 in Exclude<keyof I["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                recurrent_transfer_pair_id?: ({
                    pair_id?: number | undefined;
                } & {
                    pair_id?: number | undefined;
                } & { [K_18 in Exclude<keyof I["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
            } & { [K_19 in Exclude<keyof I["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_20 in Exclude<keyof I["recurrent_transfer"]["extensions"], keyof {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_21 in Exclude<keyof I["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
    } & { [K_22 in Exclude<keyof I, keyof operation>]: never; }>(base?: I | undefined): operation;
    fromPartial<I_1 extends {
        vote?: {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } | undefined;
        comment?: {
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } | undefined;
        transfer?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
        } | undefined;
        limit_order_cancel?: {
            order?: string | undefined;
            orderid?: number | undefined;
        } | undefined;
        account_create?: {
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            creator?: string | undefined;
            new_account_name?: string | undefined;
            owner?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            active?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            posting?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } | undefined;
        recurrent_transfer?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
            recurrence?: number | undefined;
            executions?: number | undefined;
            extensions?: {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[] | undefined;
        } | undefined;
    } & {
        vote?: ({
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } & {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } & { [K_23 in Exclude<keyof I_1["vote"], keyof vote>]: never; }) | undefined;
        comment?: ({
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } & {
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_24 in Exclude<keyof I_1["comment"], keyof comment>]: never; }) | undefined;
        transfer?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_25 in Exclude<keyof I_1["transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_26 in Exclude<keyof I_1["transfer"], keyof transfer>]: never; }) | undefined;
        limit_order_cancel?: ({
            order?: string | undefined;
            orderid?: number | undefined;
        } & {
            order?: string | undefined;
            orderid?: number | undefined;
        } & { [K_27 in Exclude<keyof I_1["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
        account_create?: ({
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            creator?: string | undefined;
            new_account_name?: string | undefined;
            owner?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            active?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            posting?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & {
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_28 in Exclude<keyof I_1["account_create"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            creator?: string | undefined;
            new_account_name?: string | undefined;
            owner?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_29 in Exclude<keyof I_1["account_create"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_30 in Exclude<keyof I_1["account_create"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_31 in Exclude<keyof I_1["account_create"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
            active?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_32 in Exclude<keyof I_1["account_create"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_33 in Exclude<keyof I_1["account_create"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_34 in Exclude<keyof I_1["account_create"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
            posting?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_35 in Exclude<keyof I_1["account_create"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_36 in Exclude<keyof I_1["account_create"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_37 in Exclude<keyof I_1["account_create"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_38 in Exclude<keyof I_1["account_create"], keyof account_create>]: never; }) | undefined;
        recurrent_transfer?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
            recurrence?: number | undefined;
            executions?: number | undefined;
            extensions?: {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[] | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_39 in Exclude<keyof I_1["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
            recurrence?: number | undefined;
            executions?: number | undefined;
            extensions?: ({
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[] & ({
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            } & {
                void_t?: ({} & {} & { [K_40 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                recurrent_transfer_pair_id?: ({
                    pair_id?: number | undefined;
                } & {
                    pair_id?: number | undefined;
                } & { [K_41 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
            } & { [K_42 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_43 in Exclude<keyof I_1["recurrent_transfer"]["extensions"], keyof {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_44 in Exclude<keyof I_1["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
    } & { [K_45 in Exclude<keyof I_1, keyof operation>]: never; }>(object: I_1): operation;
};
export declare const transaction: {
    encode(message: transaction, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): transaction;
    fromJSON(object: any): transaction;
    toJSON(message: transaction): unknown;
    create<I extends {
        ref_block_num?: number | undefined;
        ref_block_prefix?: number | undefined;
        expiration?: string | undefined;
        operations?: {
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
                recurrence?: number | undefined;
                executions?: number | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[] | undefined;
            } | undefined;
        }[] | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        ref_block_num?: number | undefined;
        ref_block_prefix?: number | undefined;
        expiration?: string | undefined;
        operations?: ({
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
                recurrence?: number | undefined;
                executions?: number | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[] | undefined;
            } | undefined;
        }[] & ({
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
                recurrence?: number | undefined;
                executions?: number | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[] | undefined;
            } | undefined;
        } & {
            vote?: ({
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } & {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } & { [K in Exclude<keyof I["operations"][number]["vote"], keyof vote>]: never; }) | undefined;
            comment?: ({
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } & {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_1 in Exclude<keyof I["operations"][number]["comment"], keyof comment>]: never; }) | undefined;
            transfer?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } & {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_2 in Exclude<keyof I["operations"][number]["transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_3 in Exclude<keyof I["operations"][number]["transfer"], keyof transfer>]: never; }) | undefined;
            limit_order_cancel?: ({
                order?: string | undefined;
                orderid?: number | undefined;
            } & {
                order?: string | undefined;
                orderid?: number | undefined;
            } & { [K_4 in Exclude<keyof I["operations"][number]["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
            account_create?: ({
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & {
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_5 in Exclude<keyof I["operations"][number]["account_create"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_6 in Exclude<keyof I["operations"][number]["account_create"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_7 in Exclude<keyof I["operations"][number]["account_create"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_8 in Exclude<keyof I["operations"][number]["account_create"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
                active?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_9 in Exclude<keyof I["operations"][number]["account_create"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_10 in Exclude<keyof I["operations"][number]["account_create"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_11 in Exclude<keyof I["operations"][number]["account_create"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
                posting?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_12 in Exclude<keyof I["operations"][number]["account_create"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_13 in Exclude<keyof I["operations"][number]["account_create"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_14 in Exclude<keyof I["operations"][number]["account_create"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_15 in Exclude<keyof I["operations"][number]["account_create"], keyof account_create>]: never; }) | undefined;
            recurrent_transfer?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
                recurrence?: number | undefined;
                executions?: number | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[] | undefined;
            } & {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_16 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
                memo?: string | undefined;
                recurrence?: number | undefined;
                executions?: number | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                } & {
                    void_t?: ({} & {} & { [K_17 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                    recurrent_transfer_pair_id?: ({
                        pair_id?: number | undefined;
                    } & {
                        pair_id?: number | undefined;
                    } & { [K_18 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
                } & { [K_19 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_20 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"], keyof {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_21 in Exclude<keyof I["operations"][number]["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
        } & { [K_22 in Exclude<keyof I["operations"][number], keyof operation>]: never; })[] & { [K_23 in Exclude<keyof I["operations"], keyof {
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
                recurrence?: number | undefined;
                executions?: number | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[] | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_24 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_25 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_26 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_27 in Exclude<keyof I, keyof transaction>]: never; }>(base?: I | undefined): transaction;
    fromPartial<I_1 extends {
        ref_block_num?: number | undefined;
        ref_block_prefix?: number | undefined;
        expiration?: string | undefined;
        operations?: {
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
                recurrence?: number | undefined;
                executions?: number | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[] | undefined;
            } | undefined;
        }[] | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        ref_block_num?: number | undefined;
        ref_block_prefix?: number | undefined;
        expiration?: string | undefined;
        operations?: ({
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
                recurrence?: number | undefined;
                executions?: number | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[] | undefined;
            } | undefined;
        }[] & ({
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
                recurrence?: number | undefined;
                executions?: number | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[] | undefined;
            } | undefined;
        } & {
            vote?: ({
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } & {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } & { [K_28 in Exclude<keyof I_1["operations"][number]["vote"], keyof vote>]: never; }) | undefined;
            comment?: ({
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } & {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_29 in Exclude<keyof I_1["operations"][number]["comment"], keyof comment>]: never; }) | undefined;
            transfer?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } & {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_30 in Exclude<keyof I_1["operations"][number]["transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_31 in Exclude<keyof I_1["operations"][number]["transfer"], keyof transfer>]: never; }) | undefined;
            limit_order_cancel?: ({
                order?: string | undefined;
                orderid?: number | undefined;
            } & {
                order?: string | undefined;
                orderid?: number | undefined;
            } & { [K_32 in Exclude<keyof I_1["operations"][number]["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
            account_create?: ({
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & {
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_33 in Exclude<keyof I_1["operations"][number]["account_create"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_34 in Exclude<keyof I_1["operations"][number]["account_create"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_35 in Exclude<keyof I_1["operations"][number]["account_create"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_36 in Exclude<keyof I_1["operations"][number]["account_create"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
                active?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_37 in Exclude<keyof I_1["operations"][number]["account_create"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_38 in Exclude<keyof I_1["operations"][number]["account_create"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_39 in Exclude<keyof I_1["operations"][number]["account_create"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
                posting?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_40 in Exclude<keyof I_1["operations"][number]["account_create"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_41 in Exclude<keyof I_1["operations"][number]["account_create"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_42 in Exclude<keyof I_1["operations"][number]["account_create"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_43 in Exclude<keyof I_1["operations"][number]["account_create"], keyof account_create>]: never; }) | undefined;
            recurrent_transfer?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
                recurrence?: number | undefined;
                executions?: number | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[] | undefined;
            } & {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_44 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
                memo?: string | undefined;
                recurrence?: number | undefined;
                executions?: number | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                } & {
                    void_t?: ({} & {} & { [K_45 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                    recurrent_transfer_pair_id?: ({
                        pair_id?: number | undefined;
                    } & {
                        pair_id?: number | undefined;
                    } & { [K_46 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
                } & { [K_47 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_48 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"], keyof {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_49 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
        } & { [K_50 in Exclude<keyof I_1["operations"][number], keyof operation>]: never; })[] & { [K_51 in Exclude<keyof I_1["operations"], keyof {
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
                recurrence?: number | undefined;
                executions?: number | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[] | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_52 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_53 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_54 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_55 in Exclude<keyof I_1, keyof transaction>]: never; }>(object: I_1): transaction;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
declare type KeysOfUnion<T> = T extends T ? keyof T : never;
export declare type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
