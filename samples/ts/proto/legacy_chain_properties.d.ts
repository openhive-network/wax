import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Witnesses must vote on how to set certain chain properties to ensure a smooth
 * and well functioning network.  Any time owner is in the active set of witnesses these
 * properties will be used to control the blockchain configuration.
 */
export interface legacy_chain_properties {
    /**
     * @param {asset} account_creation_fee - This fee, paid in HIVE, is converted into VESTS for the new account.
     *                                       Accounts without vesting shares cannot earn usage rations and therefore are powerless.
     *                                       This minimum fee requires all accounts to have some kind of commitment
     *                                       to the network that includes the ability to vote and make transactions.
     */
    account_creation_fee: asset | undefined;
    /** @param {number} maximum_block_size - This witnesses vote for the maximum_block_size which is used by the network to tune rate limiting and capacity. */
    maximum_block_size: number;
    /** @param {number} hbd_interest_rate */
    hbd_interest_rate: number;
}
export declare const legacy_chain_properties: {
    fromJSON(object: any): legacy_chain_properties;
    toJSON(message: legacy_chain_properties): unknown;
    create<I extends {
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
        } & { [K in Exclude<keyof I["account_creation_fee"], keyof asset>]: never; }) | undefined;
        maximum_block_size?: number | undefined;
        hbd_interest_rate?: number | undefined;
    } & { [K_1 in Exclude<keyof I, keyof legacy_chain_properties>]: never; }>(base?: I | undefined): legacy_chain_properties;
    fromPartial<I_1 extends {
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
        } & { [K_2 in Exclude<keyof I_1["account_creation_fee"], keyof asset>]: never; }) | undefined;
        maximum_block_size?: number | undefined;
        hbd_interest_rate?: number | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof legacy_chain_properties>]: never; }>(object: I_1): legacy_chain_properties;
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
