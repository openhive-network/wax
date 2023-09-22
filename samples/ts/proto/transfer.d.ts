import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * @brief Transfers any liquid asset (nonvesting) from one account to another.
 *
 * Transfer funds from 'from_account' to 'to_account'. HIVE and HBD can be transferred.
 * Memo for the transaction can be encrypted if message is started with '#'.
 * Private Memo Key must already be in the wallet for encrypted memo to work.
 *
 * @param {string} from_account - The account the funds are coming from.
 * @param {string} to_account - The account the funds are going to.
 * @param {asset} amount - The amount of asset to transfer from @ref from_account to @ref to_account, the allowed currency: HIVE and HBD.
 * @param {string} memo - The memo is plain-text, any encryption on the memo is up to a higher level protocol, must be shorter than 2048.
 */
export interface transfer {
    from_account: string;
    to_account: string;
    amount: asset | undefined;
    memo: string;
}
export declare const transfer: {
    encode(message: transfer, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): transfer;
    fromJSON(object: any): transfer;
    toJSON(message: transfer): unknown;
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
    } & { [K_1 in Exclude<keyof I, keyof transfer>]: never; }>(base?: I | undefined): transfer;
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
    } & { [K_3 in Exclude<keyof I_1, keyof transfer>]: never; }>(object: I_1): transfer;
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
