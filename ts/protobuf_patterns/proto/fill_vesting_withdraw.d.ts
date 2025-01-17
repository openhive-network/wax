import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to withdraw_vesting_operation and set_withdraw_vesting_route_operation.
 * Generated during block processing in batches for each active withdraw route (including implied
 * from_account(VESTS)->from_account(HIVE)) each time vesting withdrawal period passes.
 * Note: not generated for implied route when all funds were already distributed along explicit routes
 */
export interface fill_vesting_withdraw {
    /** @param {string} from_account - user that activated power down */
    from_account: string;
    /** @param {string} to_account - target of vesting route (potentially the same as from_account - receiver of deposited) */
    to_account: string;
    /** @param {asset} withdraw - (VESTS) source amount */
    withdrawn: asset | undefined;
    /** @param {asset} deposited - (HIVE or VESTS) [converted] target amount */
    deposited: asset | undefined;
}
export declare const fill_vesting_withdraw: {
    fromJSON(object: any): fill_vesting_withdraw;
    toJSON(message: fill_vesting_withdraw): unknown;
    create<I extends Exact<DeepPartial<fill_vesting_withdraw>, I>>(base?: I): fill_vesting_withdraw;
    fromPartial<I extends Exact<DeepPartial<fill_vesting_withdraw>, I>>(object: I): fill_vesting_withdraw;
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
