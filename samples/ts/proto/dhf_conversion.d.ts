import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to specific case of transfer_operation and to block processing.
 * When user transferred HIVE to treasury the amount is immediately converted to HBD and this vops is generated.
 * Also generated during block processing every day during daily proposal maintenance.
 * Note: portion of HIVE on treasury balance is converted to HBD and thus increases funds available for proposals.
 */
export interface dhf_conversion {
    /** @param {string} treasury - treasury (source of hive_amount_in and receiver of hbd_amount_out) */
    treasury: string;
    /** @param {asset} hive_amount_in - (HIVE) source of conversion */
    hive_amount_in: asset | undefined;
    /** @param {asset} hbd_amount_out - (HBD) effect of conversion */
    hbd_amount_out: asset | undefined;
}
export declare const dhf_conversion: {
    fromJSON(object: any): dhf_conversion;
    toJSON(message: dhf_conversion): unknown;
    create<I extends {
        treasury?: string | undefined;
        hive_amount_in?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        hbd_amount_out?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        treasury?: string | undefined;
        hive_amount_in?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["hive_amount_in"], keyof asset>]: never; }) | undefined;
        hbd_amount_out?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["hbd_amount_out"], keyof asset>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof dhf_conversion>]: never; }>(base?: I | undefined): dhf_conversion;
    fromPartial<I_1 extends {
        treasury?: string | undefined;
        hive_amount_in?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        hbd_amount_out?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        treasury?: string | undefined;
        hive_amount_in?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["hive_amount_in"], keyof asset>]: never; }) | undefined;
        hbd_amount_out?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["hbd_amount_out"], keyof asset>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof dhf_conversion>]: never; }>(object: I_1): dhf_conversion;
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
