import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation change_recovery_account_operation allows a user to update their recovery account.
 * It is important to keep it actual, because only a recovery account may create a request
 * account recovery in case of compromised the owner authority.
 * By default the recovery account is set to the account creator or it is empty if it was created by temp account or mined.
 * In order to cancel the change_recovery_account_operation, the operation change_recovery_account_operation,
 * the operation should be created with {new_recovery_account} set to the old one.
 * The operation is done with a 30 days (HIVE_OWNER_AUTH_RECOVERY_PERIOD) delay.
 *
 * @param {string} account_to_recover
 * @param {string} new_recovery_account
 * @param {future_extensions} extensions
 */
export interface change_recovery_account {
    account_to_recover: string;
    new_recovery_account: string;
    extensions: future_extensions[];
}
export declare const change_recovery_account: {
    fromJSON(object: any): change_recovery_account;
    toJSON(message: change_recovery_account): unknown;
    create<I extends {
        account_to_recover?: string | undefined;
        new_recovery_account?: string | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        account_to_recover?: string | undefined;
        new_recovery_account?: string | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_1 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_2 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I, keyof change_recovery_account>]: never; }>(base?: I | undefined): change_recovery_account;
    fromPartial<I_1 extends {
        account_to_recover?: string | undefined;
        new_recovery_account?: string | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        account_to_recover?: string | undefined;
        new_recovery_account?: string | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_4 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_5 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_6 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof change_recovery_account>]: never; }>(object: I_1): change_recovery_account;
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
