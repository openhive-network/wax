import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to convert_operation.
 * Generated during block processing after conversion delay passes and HBD is converted to HIVE.
 */
export interface fill_convert_request {
    /** @param {string} owner - User that requested conversion (receiver of amount_out). */
    owner: string;
    /** @param {number} requestid - id of the request. */
    requestid: number;
    /** @param {asset} amount_in - (HBD) source of conversion. */
    amount_in: asset | undefined;
    /** @param {asset} amount_out - (HIVE) effect of conversion. */
    amount_out: asset | undefined;
}
export declare const fill_convert_request: {
    fromJSON(object: any): fill_convert_request;
    toJSON(message: fill_convert_request): unknown;
    create<I extends Exact<DeepPartial<fill_convert_request>, I>>(base?: I): fill_convert_request;
    fromPartial<I extends Exact<DeepPartial<fill_convert_request>, I>>(object: I): fill_convert_request;
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
