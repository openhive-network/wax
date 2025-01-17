import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to recurrent_transfer_operation.
 * Generated during block processing starting in the block that included above operation and then after every period
 * set in the operation until all transfers are executed, too many fail due to shortfall of funds or the transfer is cancelled.
 * Note: in case of accumulation of very big amount of recurrent transfers to be executed in particular block, some
 * are going to be postponed to next block(s) and so will be generation of this vop.
 * @see failed_recurrent_transfer
 */
export interface fill_recurrent_transfer {
    /** @param {string} from_account - user that initiated the transfer (source of amount) */
    from_account: string;
    /** @param {string} to_account - user that is target of transfer (receiver of amount) */
    to_account: string;
    /** @param {asset} amount - (HIVE of HBD) amount transferred in current iteration */
    amount: asset | undefined;
    /** @param {string} memo - memo attached to the transfer */
    memo: string;
    /** @param {number} remaining_executions - number of remaining pending transferss */
    remaining_executions: number;
}
export declare const fill_recurrent_transfer: {
    fromJSON(object: any): fill_recurrent_transfer;
    toJSON(message: fill_recurrent_transfer): unknown;
    create<I extends Exact<DeepPartial<fill_recurrent_transfer>, I>>(base?: I): fill_recurrent_transfer;
    fromPartial<I extends Exact<DeepPartial<fill_recurrent_transfer>, I>>(object: I): fill_recurrent_transfer;
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
