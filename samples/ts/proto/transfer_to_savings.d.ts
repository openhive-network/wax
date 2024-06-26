import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * A user can place Hive and Hive Dollars into savings balances.
 * Funds can be withdrawn from these balances after a three day delay.
 * Keeping funds on the savings balance mitigates loss from hacked and compromised accounts.
 * The maximum amount a user can lose instantaneously is the sum of what they hold in liquid balances.
 * Assuming an account can be recovered quickly, loss in such situations can be kept to a minimum
 * Additionally for keeping Hive Dollars on the savings balance, the interests are calculated.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/32_transfer_to_savings.md?ref_type=heads
 */
export interface transfer_to_savings {
    /** @param {string} from_account - The account the funds are coming from. */
    from_account: string;
    /**
     * @param {string} to_account - The account the funds are going to.
     *                              The funds may be transferred to someone else savings balance.
     */
    to_account: string;
    /** @param {asset} amount - The allowed currency: HIVE and HBD, amount > 0. */
    amount: asset | undefined;
    /** @param {string} memo - Have to be UTF8, must be shorter than 2048. */
    memo: string;
}
export declare const transfer_to_savings: {
    fromJSON(object: any): transfer_to_savings;
    toJSON(message: transfer_to_savings): unknown;
    create<I extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        memo?: string | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["amount"], keyof asset>]: never; }) | undefined;
        memo?: string | undefined;
    } & { [K_1 in Exclude<keyof I, keyof transfer_to_savings>]: never; }>(base?: I | undefined): transfer_to_savings;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        memo?: string | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["amount"], keyof asset>]: never; }) | undefined;
        memo?: string | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof transfer_to_savings>]: never; }>(object: I_1): transfer_to_savings;
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
