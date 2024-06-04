export declare const protobufPackage = "hive.protocol.buffers";
/**
 * A user may vote for a witness directly using an operation:
 * account_witness_vote_operation or indirectly using the proxy - operation:  account_witness_proxy_operation.
 * All accounts with a Hive Power (also called Vesting Fund Shares or VESTS) can vote for up to 30 witnesses,
 * but you cannot vote twice for the same witnesses.
 * If a proxy is specified then all existing votes are removed.
 * Your vote power depends on your HP.
 * If the operation account_witness_vote_operation or account_witness_proxy_operation or update_proposal_votes_operation
 * is not executed in a HIVE_GOVERNANCE_VOTE_EXPIRATION_PERIOD, the votes are removed and the virtual operation:
 * expired_account_notification_operation is generated.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/12_account_witness_vote.md?ref_type=heads
 */
export interface account_witness_vote {
    /** @param {string} account */
    account: string;
    /** @param {string} witness - Witness account. */
    witness: string;
    /** @param {bool} approve - To vote for the witness, the approve = true. To remove the vote, the approve = false. */
    approve: boolean;
}
export declare const account_witness_vote: {
    fromJSON(object: any): account_witness_vote;
    toJSON(message: account_witness_vote): unknown;
    create<I extends {
        account?: string | undefined;
        witness?: string | undefined;
        approve?: boolean | undefined;
    } & {
        account?: string | undefined;
        witness?: string | undefined;
        approve?: boolean | undefined;
    } & { [K in Exclude<keyof I, keyof account_witness_vote>]: never; }>(base?: I | undefined): account_witness_vote;
    fromPartial<I_1 extends {
        account?: string | undefined;
        witness?: string | undefined;
        approve?: boolean | undefined;
    } & {
        account?: string | undefined;
        witness?: string | undefined;
        approve?: boolean | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof account_witness_vote>]: never; }>(object: I_1): account_witness_vote;
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
