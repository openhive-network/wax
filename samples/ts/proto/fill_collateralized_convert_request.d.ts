import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to collateralized_convert_operation.
 * Generated during block processing after conversion delay passes and HIVE is finally converted to HBD.
 * Note: HBD is transferred immediately during execution of above operation, this vop is generated after actual
 * price of conversion becomes known.
 * @see collateralized_convert_immediate_conversion
 *
 * @param {string} owner - user that requested conversion (receiver of excess_collateral)
 * @param {number} requestid - id of the request
 * @param {asset} amount_in - (HIVE) source of conversion (part of collateral)
 * @param {asset} amount_out - (HBD) result of conversion (already transferred to owner when request was made)
 * @param {asset} excess_collateral - (HIVE) unused part of collateral returned to owner
 */
export interface fill_collateralized_convert_request {
    owner: string;
    requestid: number;
    amount_in: asset | undefined;
    amount_out: asset | undefined;
    excess_collateral: asset | undefined;
}
export declare const fill_collateralized_convert_request: {
    encode(message: fill_collateralized_convert_request, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): fill_collateralized_convert_request;
    fromJSON(object: any): fill_collateralized_convert_request;
    toJSON(message: fill_collateralized_convert_request): unknown;
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
        excess_collateral?: {
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
        excess_collateral?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I["excess_collateral"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I, keyof fill_collateralized_convert_request>]: never; }>(base?: I | undefined): fill_collateralized_convert_request;
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
        excess_collateral?: {
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
        } & { [K_4 in Exclude<keyof I_1["amount_in"], keyof asset>]: never; }) | undefined;
        amount_out?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_5 in Exclude<keyof I_1["amount_out"], keyof asset>]: never; }) | undefined;
        excess_collateral?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_6 in Exclude<keyof I_1["excess_collateral"], keyof asset>]: never; }) | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof fill_collateralized_convert_request>]: never; }>(object: I_1): fill_collateralized_convert_request;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
