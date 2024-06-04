import { price } from "./price.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This is an operation for witnesses.
 * The witnesses publish the exchange rate between Hive and HBD.
 * Only the exchange rate published by the top 20 witnesses is used to define the exchange rate.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/07_feed_publish.md?ref_type=heads
 */
export interface feed_publish {
    /** @param {string} publisher - The witness. */
    publisher: string;
    /**
     * @param {price} exchange_rate - How many HBD the 1 Hive should cost
     *                                Example: "base":"0.345 HBD","quote":"1.000 HIVE"
     */
    exchange_rate: price | undefined;
}
export declare const feed_publish: {
    fromJSON(object: any): feed_publish;
    toJSON(message: feed_publish): unknown;
    create<I extends {
        publisher?: string | undefined;
        exchange_rate?: {
            base?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            quote?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
    } & {
        publisher?: string | undefined;
        exchange_rate?: ({
            base?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            quote?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            base?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K in Exclude<keyof I["exchange_rate"]["base"], keyof import("./asset.js").asset>]: never; }) | undefined;
            quote?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_1 in Exclude<keyof I["exchange_rate"]["quote"], keyof import("./asset.js").asset>]: never; }) | undefined;
        } & { [K_2 in Exclude<keyof I["exchange_rate"], keyof price>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I, keyof feed_publish>]: never; }>(base?: I | undefined): feed_publish;
    fromPartial<I_1 extends {
        publisher?: string | undefined;
        exchange_rate?: {
            base?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            quote?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
    } & {
        publisher?: string | undefined;
        exchange_rate?: ({
            base?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            quote?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            base?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_4 in Exclude<keyof I_1["exchange_rate"]["base"], keyof import("./asset.js").asset>]: never; }) | undefined;
            quote?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_5 in Exclude<keyof I_1["exchange_rate"]["quote"], keyof import("./asset.js").asset>]: never; }) | undefined;
        } & { [K_6 in Exclude<keyof I_1["exchange_rate"], keyof price>]: never; }) | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof feed_publish>]: never; }>(object: I_1): feed_publish;
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
