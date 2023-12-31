import _m0 from "protobufjs/minimal.js";
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
 * @param {string} account
 * @param {string} witness - Witness account.
 * @param {bool} approve - To vote for the witness, the approve = true. To remove the vote, the approve = false.
 */
export interface account_witness_vote {
    account: string;
    witness: string;
    approve: boolean;
}
export declare const account_witness_vote: {
    encode(message: account_witness_vote, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): account_witness_vote;
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
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
