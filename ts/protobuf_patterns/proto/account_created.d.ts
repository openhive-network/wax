import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to all acts of account creation, that is, creation of genesis accounts as well as operations:
 * account_create_operation, account_create_with_delegation_operation, pow_operation, pow2_operation and create_claimed_account_operation.
 * Generated every time one of above operations results in creation of new account (account is always created except for pow/pow2).
 * Note: vops for genesis accounts are generated at the start of block #1.
 */
export interface account_created {
    /** @param {string} new_account_name - newly created account (receiver of initial_vesting_shares) */
    new_account_name: string;
    /** @param {string} creator - account that initiated new account creation (genesis and mined accounts are their own creators) */
    creator: string;
    /** @param {asset} initial_vesting_shares - (VESTS) amount of initial vesting on new account (converted from creation fee prior to HF20) */
    initial_vesting_shares: asset | undefined;
    /** @param {asset} initial_delegation - (VESTS) amount of extra voting power on new account due to delegation */
    initial_delegation: asset | undefined;
}
export declare const account_created: {
    fromJSON(object: any): account_created;
    toJSON(message: account_created): unknown;
    create<I extends Exact<DeepPartial<account_created>, I>>(base?: I): account_created;
    fromPartial<I extends Exact<DeepPartial<account_created>, I>>(object: I): account_created;
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
