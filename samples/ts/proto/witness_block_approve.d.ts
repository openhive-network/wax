import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This is an operation for witnesses.
 * This operation is used in the process of block_validity_vote
 * (see https://hive.blog/hive-139531/@blocktrades/one-block-irreversibility-for-delegated-proof-of-stake-dpos).
 *
 * @param {string} witness
 * @param {string} block_id
 */
export interface witness_block_approve {
    witness: string;
    block_id: string;
}
export declare const witness_block_approve: {
    encode(message: witness_block_approve, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): witness_block_approve;
    fromJSON(object: any): witness_block_approve;
    toJSON(message: witness_block_approve): unknown;
    create<I extends {
        witness?: string | undefined;
        block_id?: string | undefined;
    } & {
        witness?: string | undefined;
        block_id?: string | undefined;
    } & { [K in Exclude<keyof I, keyof witness_block_approve>]: never; }>(base?: I | undefined): witness_block_approve;
    fromPartial<I_1 extends {
        witness?: string | undefined;
        block_id?: string | undefined;
    } & {
        witness?: string | undefined;
        block_id?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof witness_block_approve>]: never; }>(object: I_1): witness_block_approve;
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
