import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to collateralized_convert_operation.
 * Generated every time above operation is executed. Contains amount of HBD received right when the transfer actually happens.
 * @see fill_collateralized_convert_request
 */
export interface collateralized_convert_immediate_conversion {
    /** @param {string} owner - user that requested conversion (receiver of hbd_out) */
    owner: string;
    /** @param {number} requested - id of the conversion request */
    requestid: number;
    /** @param {asset} hbd_out - (HBD) funds after conversion */
    hbd_out: asset | undefined;
}
export declare const collateralized_convert_immediate_conversion: {
    fromJSON(object: any): collateralized_convert_immediate_conversion;
    toJSON(message: collateralized_convert_immediate_conversion): unknown;
    create<I extends Exact<DeepPartial<collateralized_convert_immediate_conversion>, I>>(base?: I): collateralized_convert_immediate_conversion;
    fromPartial<I extends Exact<DeepPartial<collateralized_convert_immediate_conversion>, I>>(object: I): collateralized_convert_immediate_conversion;
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
