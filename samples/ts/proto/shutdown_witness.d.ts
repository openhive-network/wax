import _m0 from "protobufjs/minimal.js";
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
    encode(message: shutdown_witness, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): shutdown_witness;
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
