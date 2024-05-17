import { asset } from "./asset.js";
import { legacy_chain_properties } from "./legacy_chain_properties.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation witness_update_operation may be used to become a new witness or to update witness properties.
 * There are two operations that allow to update witness properties witness_update_operation and witness_set_properties_operation.
 * In order to update witness properties it is recommended to use witness_set_properties_operation.
 *
 * If a user wants to become a witness, the operation witness_update_operation should be created.
 * If the witness doesn’t want to be a witness any more, the operation witness_update_operation with empty { block_signing_key }
 * should be created.
 *
 * @param {string} owner - The witness who wants to update properties or a user who wants to become a witness.
 * @param {string} url - url to information about witness.
 * @param {string} block_signing_key - Public block signing key.
 * @param {legacy_chain_properties} props
 * @param {asset} fee - The asset is validated (the format should be correct and should be expressed in Hive),
 *                      but the fee is currently ignored.
 */
export interface witness_update {
    owner: string;
    url: string;
    block_signing_key: string;
    props: legacy_chain_properties | undefined;
    fee: asset | undefined;
}
export declare const witness_update: {
    fromJSON(object: any): witness_update;
    toJSON(message: witness_update): unknown;
    create<I extends {
        owner?: string | undefined;
        url?: string | undefined;
        block_signing_key?: string | undefined;
        props?: {
            account_creation_fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } | undefined;
        fee?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        owner?: string | undefined;
        url?: string | undefined;
        block_signing_key?: string | undefined;
        props?: ({
            account_creation_fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } & {
            account_creation_fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K in Exclude<keyof I["props"]["account_creation_fee"], keyof asset>]: never; }) | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } & { [K_1 in Exclude<keyof I["props"], keyof legacy_chain_properties>]: never; }) | undefined;
        fee?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I["fee"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I, keyof witness_update>]: never; }>(base?: I | undefined): witness_update;
    fromPartial<I_1 extends {
        owner?: string | undefined;
        url?: string | undefined;
        block_signing_key?: string | undefined;
        props?: {
            account_creation_fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } | undefined;
        fee?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        owner?: string | undefined;
        url?: string | undefined;
        block_signing_key?: string | undefined;
        props?: ({
            account_creation_fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } & {
            account_creation_fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_4 in Exclude<keyof I_1["props"]["account_creation_fee"], keyof asset>]: never; }) | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } & { [K_5 in Exclude<keyof I_1["props"], keyof legacy_chain_properties>]: never; }) | undefined;
        fee?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_6 in Exclude<keyof I_1["fee"], keyof asset>]: never; }) | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof witness_update>]: never; }>(object: I_1): witness_update;
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
