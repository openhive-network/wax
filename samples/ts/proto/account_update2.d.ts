import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * There are two operations that allow updating an account data: account_update_operation and account_update2_operation.
 * Operations account_update_operation and account_update2_operation share a limit of allowed updates
 * of the owner authority  - two executions per 60 minutes (HIVE_OWNER_UPDATE_LIMIT) - meaning each of them
 * can be executed twice or both can be executed once during that time period.
 * After 30 days (HIVE_OWNER_AUTH_RECOVERY_PERIOD) using the account recovery process to change the owner authority is no longer possible.
 * The operation allows to update authority, json_metadata and the posting_json_metadata.
 * Depending on what the user wants to change, a different authority has to be used.
 * Each authority (owner, active, posting, memo_key) consists of:
 * - weight_threshold
 * - key or account name with its weight
 * The authority may have more than one key and more than one assigned account name.
 *
 * @example Example 1:
 * The posting authority:
 * weight_threshold = 1
 * 'first_key', weight = 1
 * 'second_key', weight = 1
 * 'account_name_1', weight = 1
 * The above settings mean that a user with 'first_key', a user with 'second_key' or a user 'account_name_1'
 * may post on behalf of this account.
 *
 * @example Example 2:
 * The posting authority:
 * weight_threshold = 2
 * 'first_key', weight = 1
 * 'second_key', weight = 1
 * 'account_name_1', weight = 1
 * The above settings mean that at least two signatures are needed to post on behalf of this account.
 *
 * @param {string} account - Account name, it cannot be updated.
 * @param {authority} owner - Optional. In order to update the {owner}, the owner authority is required.
 *                            It may be changed 2 times per hour.
 *                            If a user provides a new authority, the old one will be deleted.
 * @param {authority} active - Optional. In order to update the {active}, the active authority is required.
 *                             If a user provides a new authority, the old one will be deleted.
 * @param {authority} posting - Optional. In order to update the {posting}, the active authority is required.
 *                              If a user provides a new authority, the old one will be deleted.
 * @param {string} memo_key - Optional. In order to update the {memo_key}, the active authority is required.
 *                            If a user provides a new key, the old one will be deleted.
 * @param {string} json_metadata - json_string; In order to update the {json_metadata}, the active authority is required.
 * @param {string} posting_json_metadata - json_string; In order to update the { posting_json_metadata },
 *                                         the posting authority is required.
 * @param {future_extensions} extensions
 */
export interface account_update2 {
    account: string;
    owner?: authority | undefined;
    active?: authority | undefined;
    posting?: authority | undefined;
    memo_key?: string | undefined;
    json_metadata: string;
    posting_json_metadata: string;
    extensions: future_extensions[];
}
export declare const account_update2: {
    fromJSON(object: any): account_update2;
    toJSON(message: account_update2): unknown;
    create<I extends {
        account?: string | undefined;
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
        posting_json_metadata?: string | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        account?: string | undefined;
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
            } & { [K in Exclude<keyof I["owner"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_1 in Exclude<keyof I["owner"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_2 in Exclude<keyof I["owner"], keyof authority>]: never; }) | undefined;
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
            } & { [K_3 in Exclude<keyof I["active"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_4 in Exclude<keyof I["active"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_5 in Exclude<keyof I["active"], keyof authority>]: never; }) | undefined;
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
            } & { [K_6 in Exclude<keyof I["posting"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_7 in Exclude<keyof I["posting"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_8 in Exclude<keyof I["posting"], keyof authority>]: never; }) | undefined;
        memo_key?: string | undefined;
        json_metadata?: string | undefined;
        posting_json_metadata?: string | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_9 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_10 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_11 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_12 in Exclude<keyof I, keyof account_update2>]: never; }>(base?: I | undefined): account_update2;
    fromPartial<I_1 extends {
        account?: string | undefined;
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
        posting_json_metadata?: string | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        account?: string | undefined;
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
            } & { [K_13 in Exclude<keyof I_1["owner"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_14 in Exclude<keyof I_1["owner"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_15 in Exclude<keyof I_1["owner"], keyof authority>]: never; }) | undefined;
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
            } & { [K_16 in Exclude<keyof I_1["active"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_17 in Exclude<keyof I_1["active"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_18 in Exclude<keyof I_1["active"], keyof authority>]: never; }) | undefined;
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
            } & { [K_19 in Exclude<keyof I_1["posting"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_20 in Exclude<keyof I_1["posting"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_21 in Exclude<keyof I_1["posting"], keyof authority>]: never; }) | undefined;
        memo_key?: string | undefined;
        json_metadata?: string | undefined;
        posting_json_metadata?: string | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_22 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_23 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_24 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_25 in Exclude<keyof I_1, keyof account_update2>]: never; }>(object: I_1): account_update2;
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
