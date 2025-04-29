import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to transfer_from_savings_operation.
 * Generated during block processing after savings withdraw time has passed and requested amount
 * was transfered from savings to liquid balance.
 */
export interface fill_transfer_from_savings {
    /** @param {string} from_account - user that initiated transfer from savings */
    from: string;
    /** @param {string} to_account - user that was specified to receive funds (receiver of amount) */
    to: string;
    /** @param {asset} amount - (HIVE or HBD) funds transfered from savings */
    amount: asset | undefined;
    /** @param {number} request_id - id of transfer request */
    request_id: number;
    /** @param {string} memo - memo attached to transfer request */
    memo: string;
}
export declare const fill_transfer_from_savings: {
    fromJSON(object: any): fill_transfer_from_savings;
    toJSON(message: fill_transfer_from_savings): unknown;
    create<I extends Exact<DeepPartial<fill_transfer_from_savings>, I>>(base?: I): fill_transfer_from_savings;
    fromPartial<I extends Exact<DeepPartial<fill_transfer_from_savings>, I>>(object: I): fill_transfer_from_savings;
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
