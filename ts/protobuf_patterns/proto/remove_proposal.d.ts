import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Using operation remove_proposal_operation, a user may remove proposals specified by given IDs.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/46_remove_proposal.md?ref_type=heads
 */
export interface remove_proposal {
    /** @param {string} proposal_owner */
    proposal_owner: string;
    /** @param {number} proposal_ids */
    proposal_ids: string[];
    /** @param {future_extensions} extensions */
    extensions: future_extensions[];
}
export declare const remove_proposal: {
    fromJSON(object: any): remove_proposal;
    toJSON(message: remove_proposal): unknown;
    create<I extends Exact<DeepPartial<remove_proposal>, I>>(base?: I): remove_proposal;
    fromPartial<I extends Exact<DeepPartial<remove_proposal>, I>>(object: I): remove_proposal;
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
