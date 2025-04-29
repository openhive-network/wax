export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation escrow_approve_operation is used to approve the escrow.
 * The approval should be done by { to } and by the { agent }.
 * The escrow approval is irreversible.
 * If { agent } or { to } haven’t approved the escrow before the { ratification_deadline} or either
 * of them explicitly rejected the escrow, the escrow is rejected.
 * If {agent} and {to} have approved the escrow, the {fee} is transferred from temporary balance to {agent} account.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/31_escrow_approve.md?ref_type=heads
 */
export interface escrow_approve {
    /** @param {string} from_account - Account name. */
    from: string;
    /** @param {string} to_account - Account name. */
    to: string;
    /** @param {string} agent - Account name. */
    agent: string;
    /** @param {string} who - Account name. Either {to} or {agent}. */
    who: string;
    /** @param {number} escrow_id - Escrow identifier. */
    escrow_id: number;
    /** @param {bool} approve - approve = true; (approve = false explicitly rejects the escrow) */
    approve: boolean;
}
export declare const escrow_approve: {
    fromJSON(object: any): escrow_approve;
    toJSON(message: escrow_approve): unknown;
    create<I extends Exact<DeepPartial<escrow_approve>, I>>(base?: I): escrow_approve;
    fromPartial<I extends Exact<DeepPartial<escrow_approve>, I>>(object: I): escrow_approve;
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
