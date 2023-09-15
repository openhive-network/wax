import * as _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
import { authority } from "./authority.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface account_create {
    fee: asset | undefined;
    creator: string;
    new_account_name: string;
    owner: authority | undefined;
    memo_key: string;
    json_metadata: string;
}
export declare const account_create: {
    encode(message: account_create, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): account_create;
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
        memo_key?: string | undefined;
        json_metadata?: string | undefined;
    } & { [K_4 in Exclude<keyof I, keyof account_create>]: never; }>(base?: I | undefined): account_create;
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
        } & { [K_5 in Exclude<keyof I_1["fee"], keyof asset>]: never; }) | undefined;
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
            } & { [K_6 in Exclude<keyof I_1["owner"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_7 in Exclude<keyof I_1["owner"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_8 in Exclude<keyof I_1["owner"], keyof authority>]: never; }) | undefined;
        memo_key?: string | undefined;
        json_metadata?: string | undefined;
    } & { [K_9 in Exclude<keyof I_1, keyof account_create>]: never; }>(object: I_1): account_create;
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
