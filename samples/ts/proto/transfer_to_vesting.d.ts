import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation is also called Staking.
 * This operation converts Hive into Hive Power (also called Vesting Fund Shares  or VESTS) at the current exchange rate.
 * The conversion may be done between the same account or to another account.
 * The more HP (Hive Power) the account has, the more:
 * a.       Governance voting power (for witnesses and proposals) has
 * b.       Social voting power has (indirectly affects Increase curation rewards)
 * c.       Resource Credit has
 *
 * @param {string} from_account - The account the funds are coming from.
 * @param {string} to_account - The account the funds are going to. If null, then the same as 'from_account'.
 * @param {asset} amount - Must be HIVE, amount > 0.
 */
export interface transfer_to_vesting {
    from_account: string;
    to_account: string;
    amount: asset | undefined;
}
export declare const transfer_to_vesting: {
    encode(message: transfer_to_vesting, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): transfer_to_vesting;
    fromJSON(object: any): transfer_to_vesting;
    toJSON(message: transfer_to_vesting): unknown;
    create<I extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
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
    } & { [K_1 in Exclude<keyof I, keyof transfer_to_vesting>]: never; }>(base?: I | undefined): transfer_to_vesting;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
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
    } & { [K_3 in Exclude<keyof I_1, keyof transfer_to_vesting>]: never; }>(object: I_1): transfer_to_vesting;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
