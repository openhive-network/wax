import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to hardfork 24.
 * Generated for every account that was excluded from HF23 airdrop but won appeal.
 * Note: the late airdrop did not apply properly since HIVE that the accounts should receive did not account for
 * HIVE from converted VESTS. [how was it resolved?]
 * @see hardfork_hive
 */
export interface hardfork_hive_restore {
    /** @param {string} account - account to receive late airdrop (receiver of funds) */
    account: string;
    /** @param {string} treasury - treasury, source of late airdrop */
    treasury: string;
    /** @param {asset} hbd_transferred - (HBD) part of airdrop (equals related hardfork_hive_operation.hbd_transferred) */
    hbd_transferred: asset | undefined;
    /** @param {asset} hive_transferred - (HIVE) part of airdrop (equals related hardfork_hive_operation.hive_transferred) */
    hive_transferred: asset | undefined;
}
export declare const hardfork_hive_restore: {
    fromJSON(object: any): hardfork_hive_restore;
    toJSON(message: hardfork_hive_restore): unknown;
    create<I extends {
        account?: string | undefined;
        treasury?: string | undefined;
        hbd_transferred?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        hive_transferred?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        account?: string | undefined;
        treasury?: string | undefined;
        hbd_transferred?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["hbd_transferred"], keyof asset>]: never; }) | undefined;
        hive_transferred?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["hive_transferred"], keyof asset>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof hardfork_hive_restore>]: never; }>(base?: I | undefined): hardfork_hive_restore;
    fromPartial<I_1 extends {
        account?: string | undefined;
        treasury?: string | undefined;
        hbd_transferred?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        hive_transferred?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        account?: string | undefined;
        treasury?: string | undefined;
        hbd_transferred?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["hbd_transferred"], keyof asset>]: never; }) | undefined;
        hive_transferred?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["hive_transferred"], keyof asset>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof hardfork_hive_restore>]: never; }>(object: I_1): hardfork_hive_restore;
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
