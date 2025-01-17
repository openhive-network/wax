import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to hardfork 23 (HIVE inception hardfork).
 * Generated for every account that did not receive HIVE airdrop.
 */
export interface hardfork_hive {
    /** @param {string} account - account excluded from airdrop (source of amounts for airdrop) */
    account: string;
    /** @param {string} treasury - treasury that received airdrop instead of account (receiver of funds) */
    treasury: string;
    /** @param {string} other_affected_accounts - delegatees that lost delegations from account - filled before pre notification */
    other_affected_accounts: string[];
    /** @param {asset} hbd_transferred - (HBD) part of airdrop to treasury (sourced from various HBD balances on account) */
    hbd_transferred: asset | undefined;
    /** @param {asset} hive_transferred - (HIVE) part of airdrop to treasury (sourced from various HIVE balances on account) */
    hive_transferred: asset | undefined;
    /** @param {asset} vests_converted - (VESTS) sum of all sources of VESTS on account */
    vests_converted: asset | undefined;
    /** @param {asset} total_hive_from_vests - (HIVE) part of airdrop to treasury (sourced from conversion of vests_converted) */
    total_hive_from_vests: asset | undefined;
}
export declare const hardfork_hive: {
    fromJSON(object: any): hardfork_hive;
    toJSON(message: hardfork_hive): unknown;
    create<I extends Exact<DeepPartial<hardfork_hive>, I>>(base?: I): hardfork_hive;
    fromPartial<I extends Exact<DeepPartial<hardfork_hive>, I>>(object: I): hardfork_hive;
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
