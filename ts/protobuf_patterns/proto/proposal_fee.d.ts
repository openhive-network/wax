import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to create_proposal_operation.
 * Generated every time above operation is executed. Supplements it with paid fee.
 */
export interface proposal_fee {
    /** @param {string} creator - user that created proposal (source of fee) */
    creator: string;
    /** @param {string} treasury - treasury account (receiver of fee) */
    treasury: string;
    /** @param {number} proposal_id - id of proposal */
    proposal_id: number;
    /** @param {asset} fee - (HBD) amount paid for proposal [should actually be part of create_proposal_operation but it's too late now] */
    fee: asset | undefined;
}
export declare const proposal_fee: {
    fromJSON(object: any): proposal_fee;
    toJSON(message: proposal_fee): unknown;
    create<I extends Exact<DeepPartial<proposal_fee>, I>>(base?: I): proposal_fee;
    fromPartial<I extends Exact<DeepPartial<proposal_fee>, I>>(object: I): proposal_fee;
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
