import _m0 from "protobufjs/minimal.js";
import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation create_claimed_account_operation may be used by the user who has the token.
 * Pending claimed accounts (see claim_account_operation).
 * After executing the operation create_claimed_account_operation, a new account is created.
 *
 * @param {string} creator - An account who create a new account.
 * @param {string} new_account_name - Account name.
 *                                    Valid account name may consist of many parts separated by a dot,
 *                                    total may have up to 16 characters, parts have to start from a letter,
 *                                    may be followed by numbers, or “-“.
 * @param {authority} owner
 * @param {authority} active
 * @param {authority} posting
 * @param {string} memo_key
 * @param {string} json_metadata - Json string.
 * @param {future_extensions} extensions - Not currently used.
 */
export interface create_claimed_account {
    creator: string;
    new_account_name: string;
    owner: authority | undefined;
    active: authority | undefined;
    posting: authority | undefined;
    memo_key: string;
    json_metadata: string;
    extensions: future_extensions | undefined;
}
export declare const create_claimed_account: {
    encode(message: create_claimed_account, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): create_claimed_account;
    fromJSON(object: any): create_claimed_account;
    toJSON(message: create_claimed_account): unknown;
    create<I extends {
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
        extensions?: {
            void_t?: {} | undefined;
        } | undefined;
    } & {
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
        extensions?: ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_9 in Exclude<keyof I["extensions"]["void_t"], never>]: never; }) | undefined;
        } & { [K_10 in Exclude<keyof I["extensions"], "void_t">]: never; }) | undefined;
    } & { [K_11 in Exclude<keyof I, keyof create_claimed_account>]: never; }>(base?: I | undefined): create_claimed_account;
    fromPartial<I_1 extends {
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
        extensions?: {
            void_t?: {} | undefined;
        } | undefined;
    } & {
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
            } & { [K_12 in Exclude<keyof I_1["owner"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_13 in Exclude<keyof I_1["owner"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_14 in Exclude<keyof I_1["owner"], keyof authority>]: never; }) | undefined;
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
            } & { [K_15 in Exclude<keyof I_1["active"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_16 in Exclude<keyof I_1["active"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_17 in Exclude<keyof I_1["active"], keyof authority>]: never; }) | undefined;
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
            } & { [K_18 in Exclude<keyof I_1["posting"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_19 in Exclude<keyof I_1["posting"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_20 in Exclude<keyof I_1["posting"], keyof authority>]: never; }) | undefined;
        memo_key?: string | undefined;
        json_metadata?: string | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_21 in Exclude<keyof I_1["extensions"]["void_t"], never>]: never; }) | undefined;
        } & { [K_22 in Exclude<keyof I_1["extensions"], "void_t">]: never; }) | undefined;
    } & { [K_23 in Exclude<keyof I_1, keyof create_claimed_account>]: never; }>(object: I_1): create_claimed_account;
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
