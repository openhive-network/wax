import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to hardfork 23 (HIVE inception hardfork).
 * Generated for every account that did not receive HIVE airdrop.
 *
 * @param {string} account - account excluded from airdrop (source of amounts for airdrop)
 * @param {string} treasury - treasury that received airdrop instead of account (receiver of funds)
 * @param {string} other_affected_accounts - delegatees that lost delegations from account - filled before pre notification
 * @param {asset} hbd_transferred - (HBD) part of airdrop to treasury (sourced from various HBD balances on account)
 * @param {asset} hive_transferred - (HIVE) part of airdrop to treasury (sourced from various HIVE balances on account)
 * @param {asset} vests_converted - (VESTS) sum of all sources of VESTS on account
 * @param {asset} total_hive_from_vests - (HIVE) part of airdrop to treasury (sourced from conversion of vests_converted)
 */
export interface hardfork_hive {
    account: string;
    treasury: string;
    other_affected_accounts: string[];
    hbd_transferred: asset | undefined;
    hive_transferred: asset | undefined;
    vests_converted: asset | undefined;
    total_hive_from_vests: asset | undefined;
}
export declare const hardfork_hive: {
    encode(message: hardfork_hive, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): hardfork_hive;
    fromJSON(object: any): hardfork_hive;
    toJSON(message: hardfork_hive): unknown;
    create<I extends {
        account?: string | undefined;
        treasury?: string | undefined;
        other_affected_accounts?: string[] | undefined;
        hbd_transferred?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        hive_transferred?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        vests_converted?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        total_hive_from_vests?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        account?: string | undefined;
        treasury?: string | undefined;
        other_affected_accounts?: (string[] & string[] & { [K in Exclude<keyof I["other_affected_accounts"], keyof string[]>]: never; }) | undefined;
        hbd_transferred?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["hbd_transferred"], keyof asset>]: never; }) | undefined;
        hive_transferred?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I["hive_transferred"], keyof asset>]: never; }) | undefined;
        vests_converted?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I["vests_converted"], keyof asset>]: never; }) | undefined;
        total_hive_from_vests?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I["total_hive_from_vests"], keyof asset>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I, keyof hardfork_hive>]: never; }>(base?: I | undefined): hardfork_hive;
    fromPartial<I_1 extends {
        account?: string | undefined;
        treasury?: string | undefined;
        other_affected_accounts?: string[] | undefined;
        hbd_transferred?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        hive_transferred?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        vests_converted?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        total_hive_from_vests?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        account?: string | undefined;
        treasury?: string | undefined;
        other_affected_accounts?: (string[] & string[] & { [K_6 in Exclude<keyof I_1["other_affected_accounts"], keyof string[]>]: never; }) | undefined;
        hbd_transferred?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_7 in Exclude<keyof I_1["hbd_transferred"], keyof asset>]: never; }) | undefined;
        hive_transferred?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_8 in Exclude<keyof I_1["hive_transferred"], keyof asset>]: never; }) | undefined;
        vests_converted?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_9 in Exclude<keyof I_1["vests_converted"], keyof asset>]: never; }) | undefined;
        total_hive_from_vests?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_10 in Exclude<keyof I_1["total_hive_from_vests"], keyof asset>]: never; }) | undefined;
    } & { [K_11 in Exclude<keyof I_1, keyof hardfork_hive>]: never; }>(object: I_1): hardfork_hive;
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
