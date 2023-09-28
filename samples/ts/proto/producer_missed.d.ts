import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing.
 * Generated during block processing when witness failed to produce his block on time.
 * @see shutdown_witness
 *
 * @param {string} producer - witness that failed to produce his block on time
 */
export interface producer_missed {
    producer: string;
}
export declare const producer_missed: {
    encode(message: producer_missed, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): producer_missed;
    fromJSON(object: any): producer_missed;
    toJSON(message: producer_missed): unknown;
    create<I extends {
        producer?: string | undefined;
    } & {
        producer?: string | undefined;
    } & { [K in Exclude<keyof I, "producer">]: never; }>(base?: I | undefined): producer_missed;
    fromPartial<I_1 extends {
        producer?: string | undefined;
    } & {
        producer?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, "producer">]: never; }>(object: I_1): producer_missed;
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
