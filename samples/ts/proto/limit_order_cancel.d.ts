export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Cancels an order (limit_order_create_operation or limit_order_create2_operation)
 * and returns the balance to the owner.
 *
 * @param {string} owner
 * @param {number} orderid - The request_id provided by a user during creating a limit_order_create_operation
 *                           or limit_order_create2_operation.
 */
export interface limit_order_cancel {
    owner: string;
    orderid: number;
}
export declare const limit_order_cancel: {
    fromJSON(object: any): limit_order_cancel;
    toJSON(message: limit_order_cancel): unknown;
    create<I extends {
        owner?: string | undefined;
        orderid?: number | undefined;
    } & {
        owner?: string | undefined;
        orderid?: number | undefined;
    } & { [K in Exclude<keyof I, keyof limit_order_cancel>]: never; }>(base?: I | undefined): limit_order_cancel;
    fromPartial<I_1 extends {
        owner?: string | undefined;
        orderid?: number | undefined;
    } & {
        owner?: string | undefined;
        orderid?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof limit_order_cancel>]: never; }>(object: I_1): limit_order_cancel;
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
