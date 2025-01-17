import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to recurrent_transfer_operation.
 * Generated during block processing instead of fill_recurrent_transfer_operation when there is not enought funds on from account.
 * Note: failed transfers are not automatically repeated.
 * Note: if too many consecutive transfers fail, whole recurrent transfer operation is discontinued.
 * @see fill_recurrent_transfer
 */
export interface failed_recurrent_transfer {
    /** @param {string} from_account - user that initiated the transfer (source of amount that has not enough balance to cover it) */
    from_account: string;
    /** @param {string} to_account - user that is target of transfer (would be receiver of amount, but no transfer actually happened) */
    to_account: string;
    /** @param {asset} amount - (HIVE of HBD) amount that was scheduled for transferred in current iteration but failed */
    amount: asset | undefined;
    /** @param {string} memo - memo attached to the transfer */
    memo: string;
    /** @param {number} consecutive_failures - number of failed iterations */
    consecutive_failures: number;
    /** @param {number} remaining_executions - number of remaining pending transfers */
    remaining_executions: number;
    /** @param {bool} deleted - true if whole recurrent transfer was discontinued due to too many consecutive failures */
    deleted: boolean;
}
export declare const failed_recurrent_transfer: {
    fromJSON(object: any): failed_recurrent_transfer;
    toJSON(message: failed_recurrent_transfer): unknown;
    create<I extends Exact<DeepPartial<failed_recurrent_transfer>, I>>(base?: I): failed_recurrent_transfer;
    fromPartial<I extends Exact<DeepPartial<failed_recurrent_transfer>, I>>(object: I): failed_recurrent_transfer;
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
