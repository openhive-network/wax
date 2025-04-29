import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Funds withdrawals from the savings to an account take three days.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/33_transfer_from_savings.md?ref_type=heads
 */
export interface transfer_from_savings {
    /** @param {string} from_account - Account name. */
    from: string;
    /** @param {number} request_id - The number is given by a user. Should be unique for a user. */
    request_id: number;
    /** @param {string} to_account - Account name. */
    to: string;
    /** @param {asset} amount - The allowed currency: HIVE and HBD, amount > 0. */
    amount: asset | undefined;
    /** @param {string} memo - Have to be UTF8,  must be shorter than 2048. */
    memo: string;
}
export declare const transfer_from_savings: {
    fromJSON(object: any): transfer_from_savings;
    toJSON(message: transfer_from_savings): unknown;
    create<I extends Exact<DeepPartial<transfer_from_savings>, I>>(base?: I): transfer_from_savings;
    fromPartial<I extends Exact<DeepPartial<transfer_from_savings>, I>>(object: I): transfer_from_savings;
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
