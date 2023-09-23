import _m0 from "protobufjs/minimal.js";
import { price } from "./price.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This is an operation for witnesses.
 * The witnesses publish the exchange rate between Hive and HBD.
 * Only the exchange rate published by the top 20 witnesses is used to define the exchange rate.
 *
 * @param {string} publisher - The witness.
 * @param {price} exchange_rate - How many HBD the 1 Hive should cost
 *                                Example: "base":"0.345 HBD","quote":"1.000 HIVE"
 */
export interface feed_publish {
    publisher: string;
    exchange_rate: price | undefined;
}
export declare const feed_publish: {
    encode(message: feed_publish, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): feed_publish;
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
            } & { [K in Exclude<keyof I["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
            quote?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_1 in Exclude<keyof I["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
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
            } & { [K_4 in Exclude<keyof I_1["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
            quote?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_5 in Exclude<keyof I_1["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_6 in Exclude<keyof I_1["exchange_rate"], keyof price>]: never; }) | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof feed_publish>]: never; }>(object: I_1): feed_publish;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
declare type KeysOfUnion<T> = T extends T ? keyof T : never;
export declare type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
