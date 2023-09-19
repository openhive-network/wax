import * as _m0 from "protobufjs/minimal.js";
import { comment } from "./comment.js";
import { limit_order_cancel } from "./limit_order_cancel.js";
import { recurrent_transfer } from "./recurrent_transfer.js";
import { vote } from "./vote.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface operation {
    comment?: comment | undefined;
    vote?: vote | undefined;
    limit_order_cancel?: limit_order_cancel | undefined;
    recurrent_transfer?: recurrent_transfer | undefined;
}
export interface transaction {
    operations: operation[];
}
export declare const operation: {
    encode(message: operation, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): operation;
    fromJSON(object: any): operation;
    toJSON(message: operation): unknown;
    create<I extends {
        comment?: {
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } | undefined;
        vote?: {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } | undefined;
        limit_order_cancel?: {
            order?: string | undefined;
            orderid?: number | undefined;
        } | undefined;
        recurrent_transfer?: {
            _from?: string | undefined;
            to?: string | undefined;
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
        } & { [K in Exclude<keyof I["comment"], keyof comment>]: never; }) | undefined;
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
        } & { [K_1 in Exclude<keyof I["vote"], keyof vote>]: never; }) | undefined;
        limit_order_cancel?: ({
            order?: string | undefined;
            orderid?: number | undefined;
        } & {
            order?: string | undefined;
            orderid?: number | undefined;
        } & { [K_2 in Exclude<keyof I["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
        recurrent_transfer?: ({
            _from?: string | undefined;
            to?: string | undefined;
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
            _from?: string | undefined;
            to?: string | undefined;
            amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_3 in Exclude<keyof I["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                void_t?: ({} & {} & { [K_4 in Exclude<keyof I["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                recurrent_transfer_pair_id?: ({
                    pair_id?: number | undefined;
                } & {
                    pair_id?: number | undefined;
                } & { [K_5 in Exclude<keyof I["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
            } & { [K_6 in Exclude<keyof I["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_7 in Exclude<keyof I["recurrent_transfer"]["extensions"], keyof {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_8 in Exclude<keyof I["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
    } & { [K_9 in Exclude<keyof I, keyof operation>]: never; }>(base?: I | undefined): operation;
    fromPartial<I_1 extends {
        comment?: {
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } | undefined;
        vote?: {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } | undefined;
        limit_order_cancel?: {
            order?: string | undefined;
            orderid?: number | undefined;
        } | undefined;
        recurrent_transfer?: {
            _from?: string | undefined;
            to?: string | undefined;
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
        } & { [K_10 in Exclude<keyof I_1["comment"], keyof comment>]: never; }) | undefined;
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
        } & { [K_11 in Exclude<keyof I_1["vote"], keyof vote>]: never; }) | undefined;
        limit_order_cancel?: ({
            order?: string | undefined;
            orderid?: number | undefined;
        } & {
            order?: string | undefined;
            orderid?: number | undefined;
        } & { [K_12 in Exclude<keyof I_1["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
        recurrent_transfer?: ({
            _from?: string | undefined;
            to?: string | undefined;
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
            _from?: string | undefined;
            to?: string | undefined;
            amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_13 in Exclude<keyof I_1["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                void_t?: ({} & {} & { [K_14 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                recurrent_transfer_pair_id?: ({
                    pair_id?: number | undefined;
                } & {
                    pair_id?: number | undefined;
                } & { [K_15 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
            } & { [K_16 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_17 in Exclude<keyof I_1["recurrent_transfer"]["extensions"], keyof {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_18 in Exclude<keyof I_1["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
    } & { [K_19 in Exclude<keyof I_1, keyof operation>]: never; }>(object: I_1): operation;
};
export declare const transaction: {
    encode(message: transaction, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): transaction;
    fromJSON(object: any): transaction;
    toJSON(message: transaction): unknown;
    create<I extends {
        operations?: {
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            recurrent_transfer?: {
                _from?: string | undefined;
                to?: string | undefined;
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
    } & {
        operations?: ({
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            recurrent_transfer?: {
                _from?: string | undefined;
                to?: string | undefined;
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
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            recurrent_transfer?: {
                _from?: string | undefined;
                to?: string | undefined;
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
            } & { [K in Exclude<keyof I["operations"][number]["comment"], keyof comment>]: never; }) | undefined;
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
            } & { [K_1 in Exclude<keyof I["operations"][number]["vote"], keyof vote>]: never; }) | undefined;
            limit_order_cancel?: ({
                order?: string | undefined;
                orderid?: number | undefined;
            } & {
                order?: string | undefined;
                orderid?: number | undefined;
            } & { [K_2 in Exclude<keyof I["operations"][number]["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
            recurrent_transfer?: ({
                _from?: string | undefined;
                to?: string | undefined;
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
                _from?: string | undefined;
                to?: string | undefined;
                amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_3 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                    void_t?: ({} & {} & { [K_4 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                    recurrent_transfer_pair_id?: ({
                        pair_id?: number | undefined;
                    } & {
                        pair_id?: number | undefined;
                    } & { [K_5 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
                } & { [K_6 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_7 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"], keyof {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_8 in Exclude<keyof I["operations"][number]["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
        } & { [K_9 in Exclude<keyof I["operations"][number], keyof operation>]: never; })[] & { [K_10 in Exclude<keyof I["operations"], keyof {
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            recurrent_transfer?: {
                _from?: string | undefined;
                to?: string | undefined;
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
    } & { [K_11 in Exclude<keyof I, "operations">]: never; }>(base?: I | undefined): transaction;
    fromPartial<I_1 extends {
        operations?: {
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            recurrent_transfer?: {
                _from?: string | undefined;
                to?: string | undefined;
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
    } & {
        operations?: ({
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            recurrent_transfer?: {
                _from?: string | undefined;
                to?: string | undefined;
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
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            recurrent_transfer?: {
                _from?: string | undefined;
                to?: string | undefined;
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
            } & { [K_12 in Exclude<keyof I_1["operations"][number]["comment"], keyof comment>]: never; }) | undefined;
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
            } & { [K_13 in Exclude<keyof I_1["operations"][number]["vote"], keyof vote>]: never; }) | undefined;
            limit_order_cancel?: ({
                order?: string | undefined;
                orderid?: number | undefined;
            } & {
                order?: string | undefined;
                orderid?: number | undefined;
            } & { [K_14 in Exclude<keyof I_1["operations"][number]["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
            recurrent_transfer?: ({
                _from?: string | undefined;
                to?: string | undefined;
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
                _from?: string | undefined;
                to?: string | undefined;
                amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_15 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                    void_t?: ({} & {} & { [K_16 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                    recurrent_transfer_pair_id?: ({
                        pair_id?: number | undefined;
                    } & {
                        pair_id?: number | undefined;
                    } & { [K_17 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
                } & { [K_18 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_19 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"], keyof {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_20 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
        } & { [K_21 in Exclude<keyof I_1["operations"][number], keyof operation>]: never; })[] & { [K_22 in Exclude<keyof I_1["operations"], keyof {
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            recurrent_transfer?: {
                _from?: string | undefined;
                to?: string | undefined;
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
    } & { [K_23 in Exclude<keyof I_1, "operations">]: never; }>(object: I_1): transaction;
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
