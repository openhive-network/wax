export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to governance voting: account_witness_vote_operation, account_witness_proxy_operation and update_proposal_votes_operation.
 * Generated during block processing when user did not cast any governance vote for very long time. Such user is considered not
 * interested in governance and therefore his previous votes are nullified.
 */
export interface expired_account_notification {
    /** @param {string} account - user whose governance votes were nullified */
    account: string;
}
export declare const expired_account_notification: {
    fromJSON(object: any): expired_account_notification;
    toJSON(message: expired_account_notification): unknown;
    create<I extends Exact<DeepPartial<expired_account_notification>, I>>(base?: I): expired_account_notification;
    fromPartial<I extends Exact<DeepPartial<expired_account_notification>, I>>(object: I): expired_account_notification;
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
