import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to recurrent_transfer_operation.
 * Generated during block processing starting in the block that included above operation and then after every period
 * set in the operation until all transfers are executed, too many fail due to shortfall of funds or the transfer is cancelled.
 * Note: in case of accumulation of very big amount of recurrent transfers to be executed in particular block, some
 * are going to be postponed to next block(s) and so will be generation of this vop.
 * @see failed_recurrent_transfer
 *
 * @param {string} from_account - user that initiated the transfer (source of amount)
 * @param {string} to_account - user that is target of transfer (receiver of amount)
 * @param {asset} amount - (HIVE of HBD) amount transferred in current iteration
 * @param {string} memo - memo attached to the transfer
 * @param {number} remaining_executions - number of remaining pending transfers
 */
export interface fill_recurrent_transfer {
    from_account: string;
    to_account: string;
    amount: asset | undefined;
    memo: string;
    remaining_executions: number;
}
export declare const fill_recurrent_transfer: {
    encode(message: fill_recurrent_transfer, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): fill_recurrent_transfer;
    fromJSON(object: any): fill_recurrent_transfer;
    toJSON(message: fill_recurrent_transfer): unknown;
    create<I extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        memo?: string | undefined;
        remaining_executions?: number | undefined;
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
        remaining_executions?: number | undefined;
    } & { [K_1 in Exclude<keyof I, keyof fill_recurrent_transfer>]: never; }>(base?: I | undefined): fill_recurrent_transfer;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        memo?: string | undefined;
        remaining_executions?: number | undefined;
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
        remaining_executions?: number | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof fill_recurrent_transfer>]: never; }>(object: I_1): fill_recurrent_transfer;
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
