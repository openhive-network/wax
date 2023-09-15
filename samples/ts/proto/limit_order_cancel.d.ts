import * as _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface limit_order_cancel {
    order: string;
    orderid: number;
}
export declare const limit_order_cancel: {
    encode(message: limit_order_cancel, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): limit_order_cancel;
    fromJSON(object: any): limit_order_cancel;
    toJSON(message: limit_order_cancel): unknown;
    create<I extends {
        order?: string | undefined;
        orderid?: number | undefined;
    } & {
        order?: string | undefined;
        orderid?: number | undefined;
    } & { [K in Exclude<keyof I, keyof limit_order_cancel>]: never; }>(base?: I | undefined): limit_order_cancel;
    fromPartial<I_1 extends {
        order?: string | undefined;
        orderid?: number | undefined;
    } & {
        order?: string | undefined;
        orderid?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof limit_order_cancel>]: never; }>(object: I_1): limit_order_cancel;
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
