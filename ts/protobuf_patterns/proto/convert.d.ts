import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This operation instructs the blockchain to start a conversion of HBD to Hive.
 * The funds are deposited after 3.5 days.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/08_convert.md?ref_type=heads
 */
export interface convert {
    /** @param {string} owner - Account name. */
    owner: string;
    /** @param {number} requestid - The number is given by a user. Should be unique for a user. */
    requestid: number;
    /** @param {asset} amount - Amount > 0, have to be in HBD. */
    amount: asset | undefined;
}
export declare const convert: {
    fromJSON(object: any): convert;
    toJSON(message: convert): unknown;
    create<I extends Exact<DeepPartial<convert>, I>>(base?: I): convert;
    fromPartial<I extends Exact<DeepPartial<convert>, I>>(object: I): convert;
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
