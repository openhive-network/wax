import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to collateralized_convert_operation.
 * Generated during block processing after conversion delay passes and HIVE is finally converted to HBD.
 * Note: HBD is transferred immediately during execution of above operation, this vop is generated after actual
 * price of conversion becomes known.
 * @see collateralized_convert_immediate_conversion
 */
export interface fill_collateralized_convert_request {
    /** @param {string} owner - user that requested conversion (receiver of excess_collateral) */
    owner: string;
    /** @param {number} requestid - id of the request */
    requestid: number;
    /** @param {asset} amount_in - (HIVE) source of conversion (part of collateral) */
    amount_in: asset | undefined;
    /** @param {asset} amount_out - (HBD) result of conversion (already transferred to owner when request was made) */
    amount_out: asset | undefined;
    /** @param {asset} excess_collateral - (HIVE) unused part of collateral returned to owner */
    excess_collateral: asset | undefined;
}
export declare const fill_collateralized_convert_request: {
    fromJSON(object: any): fill_collateralized_convert_request;
    toJSON(message: fill_collateralized_convert_request): unknown;
    create<I extends Exact<DeepPartial<fill_collateralized_convert_request>, I>>(base?: I): fill_collateralized_convert_request;
    fromPartial<I extends Exact<DeepPartial<fill_collateralized_convert_request>, I>>(object: I): fill_collateralized_convert_request;
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
