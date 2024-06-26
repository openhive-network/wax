import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This operation creates a limit order and matches it against existing open orders.
 * It allows to sell Hive and buy HBD or sell HBD and buy Hive.
 * It is a way for a user to declare they want to sell {amount_to_sell} Hive/HBD for at least {min_to_receive} HBD/Hive.
 * The user may be a taker (if a user creates an order and the order matches some order(s))
 * or a maker (if a user creates an order and the order doesn’t match and the order is waiting for a match on the market).
 * If there is a partial match, a user may be a taker and maker for the same order.
 * If a taker creates an order for all orders on the market the order(s) that are the best deal for the taker are matched.
 * If there are two orders with the same price, the older one is matched.
 * The operation is used by the markets see: https://wallet.hive.blog/market
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/05_limit_order_create.md?ref_type=heads
 */
export interface limit_order_create {
    /** @param {string} owner */
    owner: string;
    /** @param {number} orderid - an ID assigned by owner, must be unique. */
    orderid: number;
    /** @param {asset} amount_to_sell */
    amount_to_sell: asset | undefined;
    /** @param {asset} min_to_receive */
    min_to_receive: asset | undefined;
    /**
     * @param {bool} fill_or_kill - If fill_or_kill = true, then the operation is executed immediately or it fails
     *                              (the operation is not added to the block).
     *                              If fill_or_kill = false, then the order is valid till 'expiration'.
     */
    fill_or_kill: boolean;
    /** @param {string} expiration */
    expiration: string;
}
export declare const limit_order_create: {
    fromJSON(object: any): limit_order_create;
    toJSON(message: limit_order_create): unknown;
    create<I extends {
        owner?: string | undefined;
        orderid?: number | undefined;
        amount_to_sell?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        min_to_receive?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        fill_or_kill?: boolean | undefined;
        expiration?: string | undefined;
    } & {
        owner?: string | undefined;
        orderid?: number | undefined;
        amount_to_sell?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["amount_to_sell"], keyof asset>]: never; }) | undefined;
        min_to_receive?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["min_to_receive"], keyof asset>]: never; }) | undefined;
        fill_or_kill?: boolean | undefined;
        expiration?: string | undefined;
    } & { [K_2 in Exclude<keyof I, keyof limit_order_create>]: never; }>(base?: I | undefined): limit_order_create;
    fromPartial<I_1 extends {
        owner?: string | undefined;
        orderid?: number | undefined;
        amount_to_sell?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        min_to_receive?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        fill_or_kill?: boolean | undefined;
        expiration?: string | undefined;
    } & {
        owner?: string | undefined;
        orderid?: number | undefined;
        amount_to_sell?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["amount_to_sell"], keyof asset>]: never; }) | undefined;
        min_to_receive?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["min_to_receive"], keyof asset>]: never; }) | undefined;
        fill_or_kill?: boolean | undefined;
        expiration?: string | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof limit_order_create>]: never; }>(object: I_1): limit_order_create;
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
