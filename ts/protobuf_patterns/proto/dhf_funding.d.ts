import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to block processing.
 * Generated during block processing every proposal maintenance period.
 * Note: while the fund receives part of inflation every block, the amount is recorded aside and only when there are
 * proposal payouts (when new funds matter), there is generation of this vop.
 */
export interface dhf_funding {
    /** @param {string} treasury - treasury account (receiver of additional_funds) */
    treasury: string;
    /** @param {asset} additional_funds - (HBD) portion inflation accumulated since previous maintenance period */
    additional_funds: asset | undefined;
}
export declare const dhf_funding: {
    fromJSON(object: any): dhf_funding;
    toJSON(message: dhf_funding): unknown;
    create<I extends Exact<DeepPartial<dhf_funding>, I>>(base?: I): dhf_funding;
    fromPartial<I extends Exact<DeepPartial<dhf_funding>, I>>(object: I): dhf_funding;
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
