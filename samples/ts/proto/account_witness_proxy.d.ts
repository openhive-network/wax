import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * A user may vote for a witness or proposal directly (using an operation: account_witness_vote_operation or update_proposal_votes_operation)
 * or indirectly (using the proxy - operation:  account_witness_proxy_operation).
 * If a user sets a proxy, the witness votes are removed and the proposal votes are deactivated.
 * If a user removes a proxy, there are no witness votes and the proposal votes are activated.
 * Settings proxy means that a user wants to cede a decision on which witnesses to vote for to an account indicated as {proxy}.
 * {proxy} will also vote for proposals in the name of {account}.
 * If the operation account_witness_vote_operation or account_witness_proxy_operation or update_proposal_votes_operation is not executed
 * in HIVE_GOVERNANCE_VOTE_EXPIRATION_PERIOD, the votes are removed and the virtual operation:
 * expired_account_notification_operation is generated.
 * If the proxy was set and now it is removed, the additionally the virtual operation: proxy_cleared_operation is generated.
 *
 * @param {string} account
 * @param {string} proxy - Account name. To remove the proxy, the parameter should be set empty.
 *                         Only one proxy may be set for an account.
 */
export interface account_witness_proxy {
    account: string;
    proxy: string;
}
export declare const account_witness_proxy: {
    encode(message: account_witness_proxy, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): account_witness_proxy;
    fromJSON(object: any): account_witness_proxy;
    toJSON(message: account_witness_proxy): unknown;
    create<I extends {
        account?: string | undefined;
        proxy?: string | undefined;
    } & {
        account?: string | undefined;
        proxy?: string | undefined;
    } & { [K in Exclude<keyof I, keyof account_witness_proxy>]: never; }>(base?: I | undefined): account_witness_proxy;
    fromPartial<I_1 extends {
        account?: string | undefined;
        proxy?: string | undefined;
    } & {
        account?: string | undefined;
        proxy?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof account_witness_proxy>]: never; }>(object: I_1): account_witness_proxy;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
declare type KeysOfUnion<T> = T extends T ? keyof T : never;
export declare type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
