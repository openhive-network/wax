import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This operation converts Hive Power (also called Vesting Fund Shares or VESTS) into HIVE.
 * At any given point in time an account can be withdrawing from their vesting shares.
 * A user may change the number of shares they wish to cash out at any time between 0 and their total vesting stake.
 * After applying this operation, vesting_shares will be withdrawn at a rate of vesting_shares/13 per week for 13 weeks
 * starting one week after this operation is included in the blockchain.
 * This operation is not valid if a user has no vesting shares.
 * There can be only one withdraw_vesting_operation  processed at the same time.
 * If a user wants to stop withdraw_vesting_operation, they should create an operation withdraw_vesting_operation with amount =0.
 * If a user creates a new withdraw_vesting_operation when the old one is still processed,
 * then the old withdraw_vesting_operation will be canceled and a new one will be processed.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/04_withdraw_vesting.md?ref_type=heads
 */
export interface withdraw_vesting {
    /** @param {string} account - The account the funds are coming from. */
    account: string;
    /** @param {asset} vesting_shares - Amount of VESTS (HP) */
    vesting_shares: asset | undefined;
}
export declare const withdraw_vesting: {
    fromJSON(object: any): withdraw_vesting;
    toJSON(message: withdraw_vesting): unknown;
    create<I extends {
        account?: string | undefined;
        vesting_shares?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        account?: string | undefined;
        vesting_shares?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["vesting_shares"], keyof asset>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof withdraw_vesting>]: never; }>(base?: I | undefined): withdraw_vesting;
    fromPartial<I_1 extends {
        account?: string | undefined;
        vesting_shares?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        account?: string | undefined;
        vesting_shares?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["vesting_shares"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof withdraw_vesting>]: never; }>(object: I_1): withdraw_vesting;
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
