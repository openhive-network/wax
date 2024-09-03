import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This operation is part of the recovery account process (more information in request_account_recovery).
 * After creating by recovery account the operation request_account_recovery,
 * the user has HIVE_ACCOUNT_RECOVERY_REQUEST_EXPIRATION_PERIOD hours to respond using
 * operation recover_account_operation and set a new owner authority.
 * The operation recover_account_operation has to be signed using the two owner authorities,
 * the old one (maybe compromised) and the new one (see request_account_recovery).
 * There must be at least 60 minutes (HIVE_OWNER_UPDATE_LIMIT) between executions of operation recover_account_operation.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/25_recover_account.md?ref_type=heads
 */
export interface recover_account {
    /** @param {string} account_to_recover - The account to be recovered. */
    account_to_recover: string;
    /** @param {authority} new_owner_authority - The new owner authority as specified in the request account recovery operation. */
    new_owner_authority: authority | undefined;
    /**
     * @param {authority} recent_owner_authority - A previous owner's authority, may be compromised.
     *                                             If the operation change_recovery_account_operation was generated,
     *                                             it has not been yet 30 days since its creation.
     */
    recent_owner_authority: authority | undefined;
    /** @param {future_extensions} extensions - Not currently used. */
    extensions: future_extensions[];
}
export declare const recover_account: {
    fromJSON(object: any): recover_account;
    toJSON(message: recover_account): unknown;
    create<I extends {
        account_to_recover?: string | undefined;
        new_owner_authority?: {
            weight_threshold?: number | undefined;
            account_auths?: {
                [x: string]: number | undefined;
            } | undefined;
            key_auths?: {
                [x: string]: number | undefined;
            } | undefined;
        } | undefined;
        recent_owner_authority?: {
            weight_threshold?: number | undefined;
            account_auths?: {
                [x: string]: number | undefined;
            } | undefined;
            key_auths?: {
                [x: string]: number | undefined;
            } | undefined;
        } | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        account_to_recover?: string | undefined;
        new_owner_authority?: ({
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
            } & { [K in Exclude<keyof I["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_1 in Exclude<keyof I["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_2 in Exclude<keyof I["new_owner_authority"], keyof authority>]: never; }) | undefined;
        recent_owner_authority?: ({
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
            } & { [K_3 in Exclude<keyof I["recent_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_4 in Exclude<keyof I["recent_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_5 in Exclude<keyof I["recent_owner_authority"], keyof authority>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_6 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_7 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_8 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_9 in Exclude<keyof I, keyof recover_account>]: never; }>(base?: I | undefined): recover_account;
    fromPartial<I_1 extends {
        account_to_recover?: string | undefined;
        new_owner_authority?: {
            weight_threshold?: number | undefined;
            account_auths?: {
                [x: string]: number | undefined;
            } | undefined;
            key_auths?: {
                [x: string]: number | undefined;
            } | undefined;
        } | undefined;
        recent_owner_authority?: {
            weight_threshold?: number | undefined;
            account_auths?: {
                [x: string]: number | undefined;
            } | undefined;
            key_auths?: {
                [x: string]: number | undefined;
            } | undefined;
        } | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        account_to_recover?: string | undefined;
        new_owner_authority?: ({
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
            } & { [K_10 in Exclude<keyof I_1["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_11 in Exclude<keyof I_1["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_12 in Exclude<keyof I_1["new_owner_authority"], keyof authority>]: never; }) | undefined;
        recent_owner_authority?: ({
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
            } & { [K_13 in Exclude<keyof I_1["recent_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
            key_auths?: ({
                [x: string]: number | undefined;
            } & {
                [x: string]: number | undefined;
            } & { [K_14 in Exclude<keyof I_1["recent_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
        } & { [K_15 in Exclude<keyof I_1["recent_owner_authority"], keyof authority>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_16 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_17 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_18 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_19 in Exclude<keyof I_1, keyof recover_account>]: never; }>(object: I_1): recover_account;
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
