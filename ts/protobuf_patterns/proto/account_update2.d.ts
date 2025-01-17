import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * There are two operations that allow updating an account data: account_update_operation and account_update2_operation.
 * Operations account_update_operation and account_update2_operation share a limit of allowed updates
 * of the owner authority  - two executions per 60 minutes (HIVE_OWNER_UPDATE_LIMIT) - meaning each of them
 * can be executed twice or both can be executed once during that time period.
 * After 30 days (HIVE_OWNER_AUTH_RECOVERY_PERIOD) using the account recovery process to change the owner authority is no longer possible.
 * The operation allows to update authority, json_metadata and the posting_json_metadata.
 * Depending on what the user wants to change, a different authority has to be used.
 * Each authority (owner, active, posting, memo_key) consists of:
 * - weight_threshold
 * - key or account name with its weight
 * The authority may have more than one key and more than one assigned account name.
 *
 * @example Example 1:
 * The posting authority:
 * weight_threshold = 1
 * 'first_key', weight = 1
 * 'second_key', weight = 1
 * 'account_name_1', weight = 1
 * The above settings mean that a user with 'first_key', a user with 'second_key' or a user 'account_name_1'
 * may post on behalf of this account.
 *
 * @example Example 2:
 * The posting authority:
 * weight_threshold = 2
 * 'first_key', weight = 1
 * 'second_key', weight = 1
 * 'account_name_1', weight = 1
 * The above settings mean that at least two signatures are needed to post on behalf of this account.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/43_account_update2.md?ref_type=heads
 */
export interface account_update2 {
    /** @param {string} account - Account name, it cannot be updated. */
    account: string;
    /**
     * @param {authority} owner - Optional. In order to update the {owner}, the owner authority is required.
     *                            It may be changed 2 times per hour.
     *                            If a user provides a new authority, the old one will be deleted.
     */
    owner?: authority | undefined;
    /**
     * @param {authority} active - Optional. In order to update the {active}, the active authority is required.
     *                             If a user provides a new authority, the old one will be deleted.
     */
    active?: authority | undefined;
    /**
     * @param {authority} posting - Optional. In order to update the {posting}, the active authority is required.
     *                              If a user provides a new authority, the old one will be deleted.
     */
    posting?: authority | undefined;
    /**
     * @param {string} memo_key - Optional. In order to update the {memo_key}, the active authority is required.
     *                            If a user provides a new key, the old one will be deleted.
     */
    memo_key?: string | undefined;
    /** @param {string} json_metadata - json_string; In order to update the {json_metadata}, the active authority is required. */
    json_metadata: string;
    /**
     * @param {string} posting_json_metadata - json_string; In order to update the { posting_json_metadata },
     *                                         the posting authority is required.
     */
    posting_json_metadata: string;
    /** @param {future_extensions} extensions */
    extensions: future_extensions[];
}
export declare const account_update2: {
    fromJSON(object: any): account_update2;
    toJSON(message: account_update2): unknown;
    create<I extends Exact<DeepPartial<account_update2>, I>>(base?: I): account_update2;
    fromPartial<I extends Exact<DeepPartial<account_update2>, I>>(object: I): account_update2;
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
