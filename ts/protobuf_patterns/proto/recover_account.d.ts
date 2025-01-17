import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This operation is part of the recovery account process (more information in request_account_recovery).
 * After creating by recovery account the operation request_account_recovery,
 * the user has HIVE_ACCOUNT_RECOVERY_REQUEST_EXPIRATION_PERIOD hours to respond using
 * operation recover_account_operation and set a new owner authority.
 * The operation recover_account_operation has to be signed using the two owner authorities,
 * the old one (maybe compromised) and the new one (see request_account_recovery).
 * There must be at least 60 minutes (HIVE_OWNER_UPDATE_LIMIT) between executions of operation recover_account_operation.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/25_recover_account.md?ref_type=heads
 */
export interface recover_account {
    /** @param {string} account_to_recover - The account to be recovered. */
    account_to_recover: string;
    /** @param {authority} new_owner_authority - The new owner authority as specified in the request account recovery operation. */
    new_owner_authority: authority | undefined;
    /**
     * @param {authority} recent_owner_authority - A previous owner's authority, may be compromised.
     *                                             If the operation change_recovery_account_operation was generated,
     *                                             it has not been yet 30 days since its creation.
     */
    recent_owner_authority: authority | undefined;
    /** @param {future_extensions} extensions - Not currently used. */
    extensions: future_extensions[];
}
export declare const recover_account: {
    fromJSON(object: any): recover_account;
    toJSON(message: recover_account): unknown;
    create<I extends Exact<DeepPartial<recover_account>, I>>(base?: I): recover_account;
    fromPartial<I extends Exact<DeepPartial<recover_account>, I>>(object: I): recover_account;
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
