import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing.
 * Generated during block processing potentially every block, but only if nonzero assets were burned. Triggered by removal of all
 * assets from 'null' account balances.
 *
 * @param {asset} total_cleared - (HIVE, VESTS or HBD) nonzero assets burned on 'null' account
 */
export interface clear_null_account_balance {
    total_cleared: asset[];
}
export declare const clear_null_account_balance: {
    fromJSON(object: any): clear_null_account_balance;
    toJSON(message: clear_null_account_balance): unknown;
    create<I extends {
        total_cleared?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        }[] | undefined;
    } & {
        total_cleared?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        }[] & ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["total_cleared"][number], keyof asset>]: never; })[] & { [K_1 in Exclude<keyof I["total_cleared"], keyof {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, "total_cleared">]: never; }>(base?: I | undefined): clear_null_account_balance;
    fromPartial<I_1 extends {
        total_cleared?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        }[] | undefined;
    } & {
        total_cleared?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        }[] & ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["total_cleared"][number], keyof asset>]: never; })[] & { [K_4 in Exclude<keyof I_1["total_cleared"], keyof {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, "total_cleared">]: never; }>(object: I_1): clear_null_account_balance;
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
