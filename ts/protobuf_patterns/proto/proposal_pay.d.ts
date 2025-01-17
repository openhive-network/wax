import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to create_proposal_operation.
 * Generated during block processing during proposal maintenance in batches
 * for each proposal that is chosen and receives funding.
 */
export interface proposal_pay {
    /** @param {number} proposal_id - id of chosen proposal */
    proposal_id: number;
    /** @param {string} receiver - account designated to receive funding (receiver of payment) */
    receiver: string;
    /** @param {string} payer - treasury account, source of payment */
    payer: string;
    /** @param {asset} payment - (HBD) paid amount */
    payment: asset | undefined;
}
export declare const proposal_pay: {
    fromJSON(object: any): proposal_pay;
    toJSON(message: proposal_pay): unknown;
    create<I extends Exact<DeepPartial<proposal_pay>, I>>(base?: I): proposal_pay;
    fromPartial<I extends Exact<DeepPartial<proposal_pay>, I>>(object: I): proposal_pay;
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
