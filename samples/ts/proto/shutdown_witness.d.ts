export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing.
 * Generated during block processing when witness is removed from active witnesses after it was detected he have missed
 * all blocks scheduled for him for last day. No longer active after HF20.
 * @see producer_missed_operation
 *
 * @param {string} owner - witness that was shut down
 */
export interface shutdown_witness {
    owner: string;
}
export declare const shutdown_witness: {
    fromJSON(object: any): shutdown_witness;
    toJSON(message: shutdown_witness): unknown;
    create<I extends {
        owner?: string | undefined;
    } & {
        owner?: string | undefined;
    } & { [K in Exclude<keyof I, "owner">]: never; }>(base?: I | undefined): shutdown_witness;
    fromPartial<I_1 extends {
        owner?: string | undefined;
    } & {
        owner?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, "owner">]: never; }>(object: I_1): shutdown_witness;
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
