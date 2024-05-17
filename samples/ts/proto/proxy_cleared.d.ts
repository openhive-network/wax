export declare const protobufPackage = "hive.protocol.buffers";
/**
 * There are 4 cases( 4 operations ) that can generate `proxy_cleared_operation` virtual operation:
 *
 * `account_witness_proxy_operation`:
 * A vop `proxy_cleared_operation` is created in the same block.
 * We want to set a proxy, but an old proxy exists:
 * 1) {"type":"proxy_cleared_operation","value":{"account":"ACCOUNT","proxy":"OLD-PROXY-ACCOUNT-NAME"}}
 * We don't want to set a proxy:
 * 2) {"type":"proxy_cleared_operation","value":{"account":"ACCOUNT","proxy":"OLD-PROXY-ACCOUNT-NAME"}}
 *
 * `decline_voting_rights_operation`:
 * A vop `proxy_cleared_operation` is generated automatically after `HIVE_OWNER_AUTH_RECOVERY_PERIOD` time ( 30 days ).
 * 3) {"type":"proxy_cleared_operation","value":{"account":"ACCOUNT","proxy":"OLD-PROXY-ACCOUNT-NAME"}}
 *
 * `update_proposal_votes_operation`, `account_witness_proxy_operation`, `account_witness_vote_operation`:
 * After HF25 a vop `proxy_cleared_operation` is generated automatically after `HIVE_GOVERNANCE_VOTE_EXPIRATION_PERIOD` time ( 365 days ).
 * 4) {"type":"proxy_cleared_operation","value":{"account":"ACCOUNT","proxy":"OLD-PROXY-ACCOUNT-NAME"}}
 *
 * @param {string} account - user that sets/unsets a proxy
 * @param {string} proxy - proxy user that facilitates voting on witnesses
 */
export interface proxy_cleared {
    account: string;
    proxy: string;
}
export declare const proxy_cleared: {
    fromJSON(object: any): proxy_cleared;
    toJSON(message: proxy_cleared): unknown;
    create<I extends {
        account?: string | undefined;
        proxy?: string | undefined;
    } & {
        account?: string | undefined;
        proxy?: string | undefined;
    } & { [K in Exclude<keyof I, keyof proxy_cleared>]: never; }>(base?: I | undefined): proxy_cleared;
    fromPartial<I_1 extends {
        account?: string | undefined;
        proxy?: string | undefined;
    } & {
        account?: string | undefined;
        proxy?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof proxy_cleared>]: never; }>(object: I_1): proxy_cleared;
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
