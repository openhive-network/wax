import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to convert_operation.
 * Generated during block processing after conversion delay passes and HBD is converted to HIVE.
 *
 * @param {string} owner - User that requested conversion (receiver of amount_out).
 * @param {number} requestid - id of the request.
 * @param {asset} amount_in - (HBD) source of conversion.
 * @param {asset} amount_out - (HIVE) effect of conversion.
 */
export interface fill_convert_request {
    owner: string;
    requestid: number;
    amount_in: asset | undefined;
    amount_out: asset | undefined;
}
export declare const fill_convert_request: {
    fromJSON(object: any): fill_convert_request;
    toJSON(message: fill_convert_request): unknown;
    create<I extends {
        owner?: string | undefined;
        requestid?: number | undefined;
        amount_in?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        amount_out?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        owner?: string | undefined;
        requestid?: number | undefined;
        amount_in?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["amount_in"], keyof asset>]: never; }) | undefined;
        amount_out?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["amount_out"], keyof asset>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof fill_convert_request>]: never; }>(base?: I | undefined): fill_convert_request;
    fromPartial<I_1 extends {
        owner?: string | undefined;
        requestid?: number | undefined;
        amount_in?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        amount_out?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        owner?: string | undefined;
        requestid?: number | undefined;
        amount_in?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["amount_in"], keyof asset>]: never; }) | undefined;
        amount_out?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["amount_out"], keyof asset>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof fill_convert_request>]: never; }>(object: I_1): fill_convert_request;
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
