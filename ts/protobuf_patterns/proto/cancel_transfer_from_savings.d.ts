export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Funds withdrawals from the savings can be canceled at any time before it is executed.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/34_cancel_transfer_from_savings.md?ref_type=heads
 */
export interface cancel_transfer_from_savings {
    /** @param {string} from_account */
    from: string;
    /** @param {number} request_id */
    request_id: number;
}
export declare const cancel_transfer_from_savings: {
    fromJSON(object: any): cancel_transfer_from_savings;
    toJSON(message: cancel_transfer_from_savings): unknown;
    create<I extends Exact<DeepPartial<cancel_transfer_from_savings>, I>>(base?: I): cancel_transfer_from_savings;
    fromPartial<I extends Exact<DeepPartial<cancel_transfer_from_savings>, I>>(object: I): cancel_transfer_from_savings;
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
