import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to recurrent_transfer_operation.
 * Generated during block processing instead of fill_recurrent_transfer_operation when there is not enought funds on from account.
 * Note: failed transfers are not automatically repeated.
 * Note: if too many consecutive transfers fail, whole recurrent transfer operation is discontinued.
 * @see fill_recurrent_transfer
 *
 * @param {string} from_account - user that initiated the transfer (source of amount that has not enough balance to cover it)
 * @param {string} to_account - user that is target of transfer (would be receiver of amount, but no transfer actually happened)
 * @param {asset} amount - (HIVE of HBD) amount that was scheduled for transferred in current iteration but failed
 * @param {string} memo - memo attached to the transfer
 * @param {number} consecutive_failures - number of failed iterations
 * @param {number} remaining_executions - number of remaining pending transfers
 * @param {bool} deleted - true if whole recurrent transfer was discontinued due to too many consecutive failures
 */
export interface failed_recurrent_transfer {
    from_account: string;
    to_account: string;
    amount: asset | undefined;
    memo: string;
    consecutive_failures: number;
    remaining_executions: number;
    deleted: boolean;
}
export declare const failed_recurrent_transfer: {
    fromJSON(object: any): failed_recurrent_transfer;
    toJSON(message: failed_recurrent_transfer): unknown;
    create<I extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        memo?: string | undefined;
        consecutive_failures?: number | undefined;
        remaining_executions?: number | undefined;
        deleted?: boolean | undefined;
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
        consecutive_failures?: number | undefined;
        remaining_executions?: number | undefined;
        deleted?: boolean | undefined;
    } & { [K_1 in Exclude<keyof I, keyof failed_recurrent_transfer>]: never; }>(base?: I | undefined): failed_recurrent_transfer;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        memo?: string | undefined;
        consecutive_failures?: number | undefined;
        remaining_executions?: number | undefined;
        deleted?: boolean | undefined;
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
        consecutive_failures?: number | undefined;
        remaining_executions?: number | undefined;
        deleted?: boolean | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof failed_recurrent_transfer>]: never; }>(object: I_1): failed_recurrent_transfer;
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
