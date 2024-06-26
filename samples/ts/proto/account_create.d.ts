import { asset } from "./asset.js";
import { authority } from "./authority.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * A new account may be created only by an existing account.
 * The account that creates a new account pays a fee.
 * The fee amount is set by the witnesses.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/09_account_create.md?ref_type=heads&plain=0&blame=1#2-parameters
 */
export interface account_create {
    /** @param {asset} fee - Paid by creator. The witnesses decide the amount of the fee. Now, it is 3 HIVE. */
    fee: asset | undefined;
    /** @param {string} creator - An account that creates a new account. */
    creator: string;
    /**
     * @param {string} new_account_name - Valid account name may consist of many parts separated by a dot,
     *                                  total may have up to 16 characters, parts have to start from a letter,
     *                                  may be followed by numbers, or '-'.
     */
    new_account_name: string;
    /** @param {authority} owner */
    owner: authority | undefined;
    /** @param {authority} active */
    active: authority | undefined;
    /** @param {authority} posting */
    posting: authority | undefined;
    /** @param {string} memo_key - Not authority, public memo key. */
    memo_key: string;
    /** @param {string} json_metadata */
    json_metadata: string;
}
export declare const account_create: {
    fromJSON(object: any): account_create;
    toJSON(message: account_create): unknown;
    create<I extends {
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
        } & { [K in Exclude<keyof I["fee"], keyof asset>]: never; }) | undefined;
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
            } & { [K_1 in Exclude<keyof I["owner"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_2 in Exclude<keyof I["owner"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_3 in Exclude<keyof I["owner"], keyof authority>]: never; }) | undefined;
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
            } & { [K_4 in Exclude<keyof I["active"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_5 in Exclude<keyof I["active"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_6 in Exclude<keyof I["active"], keyof authority>]: never; }) | undefined;
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
            } & { [K_7 in Exclude<keyof I["posting"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_8 in Exclude<keyof I["posting"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_9 in Exclude<keyof I["posting"], keyof authority>]: never; }) | undefined;
        memo_key?: string | undefined;
        json_metadata?: string | undefined;
    } & { [K_10 in Exclude<keyof I, keyof account_create>]: never; }>(base?: I | undefined): account_create;
    fromPartial<I_1 extends {
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
        } & { [K_11 in Exclude<keyof I_1["fee"], keyof asset>]: never; }) | undefined;
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
    } & { [K_21 in Exclude<keyof I_1, keyof account_create>]: never; }>(object: I_1): account_create;
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
