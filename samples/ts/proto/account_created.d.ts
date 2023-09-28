import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to all acts of account creation, that is, creation of genesis accounts as well as operations:
 * account_create_operation, account_create_with_delegation_operation, pow_operation, pow2_operation and create_claimed_account_operation.
 * Generated every time one of above operations results in creation of new account (account is always created except for pow/pow2).
 * Note: vops for genesis accounts are generated at the start of block #1.
 *
 * @param {string} new_account_name - newly created account (receiver of initial_vesting_shares)
 * @param {string} creator - account that initiated new account creation (genesis and mined accounts are their own creators)
 * @param {asset} initial_vesting_shares - (VESTS) amount of initial vesting on new account (converted from creation fee prior to HF20)
 * @param {asset} initial_delegation - (VESTS) amount of extra voting power on new account due to delegation
 */
export interface account_created {
    new_account_name: string;
    creator: string;
    initial_vesting_shares: asset | undefined;
    initial_delegation: asset | undefined;
}
export declare const account_created: {
    encode(message: account_created, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): account_created;
    fromJSON(object: any): account_created;
    toJSON(message: account_created): unknown;
    create<I extends {
        new_account_name?: string | undefined;
        creator?: string | undefined;
        initial_vesting_shares?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        initial_delegation?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        new_account_name?: string | undefined;
        creator?: string | undefined;
        initial_vesting_shares?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["initial_vesting_shares"], keyof asset>]: never; }) | undefined;
        initial_delegation?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["initial_delegation"], keyof asset>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof account_created>]: never; }>(base?: I | undefined): account_created;
    fromPartial<I_1 extends {
        new_account_name?: string | undefined;
        creator?: string | undefined;
        initial_vesting_shares?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        initial_delegation?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        new_account_name?: string | undefined;
        creator?: string | undefined;
        initial_vesting_shares?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["initial_vesting_shares"], keyof asset>]: never; }) | undefined;
        initial_delegation?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["initial_delegation"], keyof asset>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof account_created>]: never; }>(object: I_1): account_created;
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
