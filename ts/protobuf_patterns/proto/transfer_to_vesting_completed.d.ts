import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to transfer_to_vesting_operation.
 * Generated every time above operation is executed. Supplements it with amount of VESTS received.
 * Note: power up immediately increases mana regeneration and vote power for comments, but there is a grace period before
 * it activates as governance vote power.
 * @see delayed_voting
 */
export interface transfer_to_vesting_completed {
    /** @param {string} from_account - account that executed power up (source of hive_vested) */
    from_account: string;
    /** @param {string} to_account - account that gets power up (receiver of vesting_shares_received) */
    to_account: string;
    /** @param {asset} hive_vested - (HIVE) liquid funds being turned into VESTS */
    hive_vested: asset | undefined;
    /** @param {asset} vesting_shares_received - (VESTS) result of power up */
    vesting_shares_received: asset | undefined;
}
export declare const transfer_to_vesting_completed: {
    fromJSON(object: any): transfer_to_vesting_completed;
    toJSON(message: transfer_to_vesting_completed): unknown;
    create<I extends Exact<DeepPartial<transfer_to_vesting_completed>, I>>(base?: I): transfer_to_vesting_completed;
    fromPartial<I extends Exact<DeepPartial<transfer_to_vesting_completed>, I>>(object: I): transfer_to_vesting_completed;
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
