import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * A user may vote for proposals directly using an operation: update_proposal_votes_operation,
 * or indirectly using the proxy - operation:  account_witness_proxy_operation.
 * A user may vote for proposals submitted by the other users.
 * By voting for the proposal, a user may select which proposals should be funded.
 * A user may vote for as many proposals as they wants, but you cannot vote twice for the same proposal.
 * If a proxy is specified then all existing votes are deactivated. When the proxy is removed, the votes will be activated.
 * Your vote power depends on your HP.
 * If the operation account_witness_vote_operation or account_witness_proxy_operation or update_proposal_votes_operation
 * is not executed in HIVE_GOVERNANCE_VOTE_EXPIRATION_PERIOD, the votes are removed and the virtual operation:
 * expired_account_notification_operation is generated.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/45_update_proposal_votes.md?ref_type=heads
 */
export interface update_proposal_votes {
    /** @param {string} voter - Account name. */
    voter: string;
    /** @param {number} proposal_ids - IDs of proposals to vote for/against. Nonexisting IDs are ignored. */
    proposal_ids: string[];
    /**
     * @param {bool} approve - To vote for the proposal, the approve = true.
     *                         To remove the vote, the approve = false.
     */
    approve: boolean;
    /** @param {future_extensions} extensions */
    extensions: future_extensions[];
}
export declare const update_proposal_votes: {
    fromJSON(object: any): update_proposal_votes;
    toJSON(message: update_proposal_votes): unknown;
    create<I extends Exact<DeepPartial<update_proposal_votes>, I>>(base?: I): update_proposal_votes;
    fromPartial<I extends Exact<DeepPartial<update_proposal_votes>, I>>(object: I): update_proposal_votes;
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
