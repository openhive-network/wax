import { asset } from "./asset.js";
import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/** Deprecated. */
export interface account_create_with_delegation {
    fee: asset | undefined;
    delegation: asset | undefined;
    creator: string;
    new_account_name: string;
    owner: authority | undefined;
    active: authority | undefined;
    posting: authority | undefined;
    memo_key: string;
    json_metadata: string;
    extensions: future_extensions[];
}
export declare const account_create_with_delegation: {
    fromJSON(object: any): account_create_with_delegation;
    toJSON(message: account_create_with_delegation): unknown;
    create<I extends {
        fee?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        delegation?: {
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
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
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
        delegation?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["delegation"], keyof asset>]: never; }) | undefined;
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
            } & { [K_2 in Exclude<keyof I["owner"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_3 in Exclude<keyof I["owner"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_4 in Exclude<keyof I["owner"], keyof authority>]: never; }) | undefined;
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
            } & { [K_5 in Exclude<keyof I["active"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_6 in Exclude<keyof I["active"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_7 in Exclude<keyof I["active"], keyof authority>]: never; }) | undefined;
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
            } & { [K_8 in Exclude<keyof I["posting"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_9 in Exclude<keyof I["posting"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_10 in Exclude<keyof I["posting"], keyof authority>]: never; }) | undefined;
        memo_key?: string | undefined;
        json_metadata?: string | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_11 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_12 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_13 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_14 in Exclude<keyof I, keyof account_create_with_delegation>]: never; }>(base?: I | undefined): account_create_with_delegation;
    fromPartial<I_1 extends {
        fee?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        delegation?: {
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
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        fee?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_15 in Exclude<keyof I_1["fee"], keyof asset>]: never; }) | undefined;
        delegation?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_16 in Exclude<keyof I_1["delegation"], keyof asset>]: never; }) | undefined;
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
            } & { [K_17 in Exclude<keyof I_1["owner"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_18 in Exclude<keyof I_1["owner"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_19 in Exclude<keyof I_1["owner"], keyof authority>]: never; }) | undefined;
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
            } & { [K_20 in Exclude<keyof I_1["active"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_21 in Exclude<keyof I_1["active"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_22 in Exclude<keyof I_1["active"], keyof authority>]: never; }) | undefined;
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
            } & { [K_23 in Exclude<keyof I_1["posting"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_24 in Exclude<keyof I_1["posting"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_25 in Exclude<keyof I_1["posting"], keyof authority>]: never; }) | undefined;
        memo_key?: string | undefined;
        json_metadata?: string | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_26 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_27 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_28 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_29 in Exclude<keyof I_1, keyof account_create_with_delegation>]: never; }>(object: I_1): account_create_with_delegation;
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
