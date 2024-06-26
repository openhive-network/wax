import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation delegate_vesting_shares_operation allows to delegate an amount
 * of { vesting_shares } to an { delegatee } account. The { vesting_shares } are still owned by { delegator },
 * but the voting rights and resource credit are transferred.
 * A user may not delegate:
 * - the vesting shares that are already delegated
 * - the delegated vesting shares to him (a user does not own them)
 * - the vesting shares in the Power down process
 * - the already used voting shares for voting or downvoting
 * In order to remove the vesting shares delegation, the operation delegate_vesting_shares_operation
 * should be created with {vesting_shares = 0}. When a delegation is removed, the delegated vesting shares
 * are frozen for five days (HIVE_DELEGATION_RETURN_PERIOD_HF20) to prevent voting twice.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/40_delegate_vesting_shares.md?ref_type=heads
 */
export interface delegate_vesting_shares {
    /** @param {string} delegator - The account delegating vesting shares. */
    delegator: string;
    /** @param {string} delegatee - The account receiving vesting shares. */
    delegatee: string;
    /**
     * @param {asset} vesting_shares - The amount of vesting shares to be delegated.
     *                                 Minimal amount = 1/3 of the fee for creating a new account.
     */
    vesting_shares: asset | undefined;
}
export declare const delegate_vesting_shares: {
    fromJSON(object: any): delegate_vesting_shares;
    toJSON(message: delegate_vesting_shares): unknown;
    create<I extends {
        delegator?: string | undefined;
        delegatee?: string | undefined;
        vesting_shares?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        delegator?: string | undefined;
        delegatee?: string | undefined;
        vesting_shares?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["vesting_shares"], keyof asset>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof delegate_vesting_shares>]: never; }>(base?: I | undefined): delegate_vesting_shares;
    fromPartial<I_1 extends {
        delegator?: string | undefined;
        delegatee?: string | undefined;
        vesting_shares?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        delegator?: string | undefined;
        delegatee?: string | undefined;
        vesting_shares?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["vesting_shares"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof delegate_vesting_shares>]: never; }>(object: I_1): delegate_vesting_shares;
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
