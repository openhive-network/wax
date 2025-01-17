import { authority } from "./authority.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Operations account_update_operation and account_update2_operation share a limit of allowed updates of the owner authority:
 * two executions per 60 minutes (HIVE_OWNER_UPDATE_LIMIT) (meaning each of them can be executed twice or both can be executed once during that time period).
 * After 30 days (HIVE_OWNER_AUTH_RECOVERY_PERIOD) using the account recovery process to change the owner authority is no longer possible.
 * The operation account_update_operation allows changing authorities, it doesn’t allow changing the posting_json_metadata.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/10_account_update.md?ref_type=heads
 */
export interface account_update {
    /** @param {string} account - Account name, it cannot be updated. */
    account: string;
    /**
     * @param {authority} owner - In order to update the {owner}, the owner authority is required.
     *                            It may be changed 2 times per hour.
     *                            If a user provides a new authority, the old one will be deleted,
     *                            but the deleted authority may be used up to 30 days in the process of the recovery account.
     */
    owner?: authority | undefined;
    /**
     * @param {authority} active - In order to update the {active}, the active authority is required.
     *                             If a user provides a new authority, the old one will be deleted.
     */
    active?: authority | undefined;
    /**
     * @param {authority} posting - In order to update the {posting}, the active authority is required.
     *                              If a user provides a new authority, the old one will be deleted.
     */
    posting?: authority | undefined;
    /**
     * @param {string} memo_key - In order to update the {memo_key}, active authority is required.
     *                            If a user provides a new key, the old one will be deleted.
     */
    memo_key: string;
    /** @param {string} json_metadata - json_string; in order to update the {json_metadata}, the active authority is required. */
    json_metadata: string;
}
export declare const account_update: {
    fromJSON(object: any): account_update;
    toJSON(message: account_update): unknown;
    create<I extends Exact<DeepPartial<account_update>, I>>(base?: I): account_update;
    fromPartial<I extends Exact<DeepPartial<account_update>, I>>(object: I): account_update;
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
