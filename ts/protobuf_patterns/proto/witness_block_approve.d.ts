export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This is an operation for witnesses.
 * This operation is used in the process of block_validity_vote
 * (see https://hive.blog/hive-139531/@blocktrades/one-block-irreversibility-for-delegated-proof-of-stake-dpos).
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/16_witness_block_approve.md?ref_type=heads
 */
export interface witness_block_approve {
    /** @param {string} witness */
    witness: string;
    /** @param {string} block_id */
    block_id: string;
}
export declare const witness_block_approve: {
    fromJSON(object: any): witness_block_approve;
    toJSON(message: witness_block_approve): unknown;
    create<I extends Exact<DeepPartial<witness_block_approve>, I>>(base?: I): witness_block_approve;
    fromPartial<I extends Exact<DeepPartial<witness_block_approve>, I>>(object: I): witness_block_approve;
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
