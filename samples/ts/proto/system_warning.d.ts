import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing or selected operations.
 * Generated every time something occurs that would normally be only visible to node operators in their logs
 * but might be interesting to general HIVE community. Such vops can be observed on account history of 'initminer'.
 * Currently the following generate system warnings:
 *  - unknown type of witness during block processing [should probably be FC_ASSERT]
 *    indicates some problem in the code
 *  - shortfall of collateral during finalization of HIVE->HBD conversion (@see fill_collateralized_convert_request_operation)
 *    the community covers the difference in form of tiny amount of extra inflation
 *  - artificial correction of internal price of HIVE due to hitting of HBD hard cap limit
 *    every operation that involves conversion from HBD to HIVE will give output amount that is smaller than real world value
 *  - noncanonical fee symbol used by witness [should disappear if it never happened as suggested by TODO message]
 *  - witnesses changed maximum block size
 *
 * @param {string} message - warning message
 */
export interface system_warning {
    message: string;
}
export declare const system_warning: {
    encode(message: system_warning, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): system_warning;
    fromJSON(object: any): system_warning;
    toJSON(message: system_warning): unknown;
    create<I extends {
        message?: string | undefined;
    } & {
        message?: string | undefined;
    } & { [K in Exclude<keyof I, "message">]: never; }>(base?: I | undefined): system_warning;
    fromPartial<I_1 extends {
        message?: string | undefined;
    } & {
        message?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, "message">]: never; }>(object: I_1): system_warning;
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
