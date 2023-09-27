import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * A user may create a new account using a pair of operations: claim_account_operation and create_claimed_account_operation.
 * After the operation claim_account_operation a user receives a token:
 * pending claimed accounts and later (using operation create_claimed_account_operation) a user may create a new account.
 * After executing the operation claim_account_operation, a new account is not created.
 *
 * @param {string} creator - Account name.
 * @param {asset} fee - The amount of fee for creating a new account is decided by the witnesses.
 *                      It may be paid in HIVE or in the Recourse Credit (RC).
 *                      If a user wants to pay a fee in RC, it should be set {fee= 0}.
 * @param {future_extensions} extensions - Not currently used.
 */
export interface claim_account {
    creator: string;
    fee: asset | undefined;
    extensions: future_extensions[];
}
export declare const claim_account: {
    encode(message: claim_account, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): claim_account;
    fromJSON(object: any): claim_account;
    toJSON(message: claim_account): unknown;
    create<I extends {
        creator?: string | undefined;
        fee?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        creator?: string | undefined;
        fee?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["fee"], keyof asset>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_1 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_2 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_3 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_4 in Exclude<keyof I, keyof claim_account>]: never; }>(base?: I | undefined): claim_account;
    fromPartial<I_1 extends {
        creator?: string | undefined;
        fee?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        creator?: string | undefined;
        fee?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_5 in Exclude<keyof I_1["fee"], keyof asset>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_6 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_7 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_8 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_9 in Exclude<keyof I_1, keyof claim_account>]: never; }>(object: I_1): claim_account;
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