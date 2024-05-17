import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing.
 * Generated during block processing potentially every block, but only if there is nonzero transfer. Transfer occurs
 * if there are assets on OBSOLETE_TREASURY_ACCOUNT ('steem.dao'). They are consolidated from all balances (per asset
 * type) and moved to NEW_HIVE_TREASURY_ACCOUNT ('hive.fund').
 *
 * @param {asset} total_moved - (HIVE, VESTS or HBD) funds moved from old to new treasury
 */
export interface consolidate_treasury_balance {
    total_moved: asset[];
}
export declare const consolidate_treasury_balance: {
    fromJSON(object: any): consolidate_treasury_balance;
    toJSON(message: consolidate_treasury_balance): unknown;
    create<I extends {
        total_moved?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        }[] | undefined;
    } & {
        total_moved?: ({
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
        } & { [K in Exclude<keyof I["total_moved"][number], keyof asset>]: never; })[] & { [K_1 in Exclude<keyof I["total_moved"], keyof {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, "total_moved">]: never; }>(base?: I | undefined): consolidate_treasury_balance;
    fromPartial<I_1 extends {
        total_moved?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        }[] | undefined;
    } & {
        total_moved?: ({
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
        } & { [K_3 in Exclude<keyof I_1["total_moved"][number], keyof asset>]: never; })[] & { [K_4 in Exclude<keyof I_1["total_moved"], keyof {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, "total_moved">]: never; }>(object: I_1): consolidate_treasury_balance;
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
