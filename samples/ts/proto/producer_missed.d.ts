export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing.
 * Generated during block processing when witness failed to produce his block on time.
 * @see shutdown_witness
 */
export interface producer_missed {
    /** @param {string} producer - witness that failed to produce his block on time */
    producer: string;
}
export declare const producer_missed: {
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
