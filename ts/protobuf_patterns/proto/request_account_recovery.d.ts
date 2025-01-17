import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * In case of the compromised owner authority, a user may recover it.
 * There are two conditions that have to be fulfilled to do it:
 * 1. A user should have an actual recovery account.
 *    During an account creation, the account that created a new account is set as a recovery
 *    account by default, but it can be changed by the user (using operation change_recovery_account_operation).
 *    If the account was created by account temp, then a recovery account is empty and
 *    it is set as a top witness – it is not good a recovery account.
 *    Note: it takes HIVE_OWNER_AUTH_RECOVERY_PERIOD (30 days) after sending change_recovery_account_operation.
 *    for the new recovery agent to become active. During that period the previous agent remains active for the account.
 * 2. The compromised owner authority is still recent.
 *    Owner authority is considered recent and remains valid for the purpose of account recovery
 *    for HIVE_OWNER_AUTH_RECOVERY_PERIOD (30 days) after it was changed.
 *
 *    Note: look for account_update_operation or account_update2_operation in account history to see when its
 *    owner authority was compromised.
 *
 * The recovery account process.
 * Conditions:
 * 1. An account { account_to_recover } has an actual recovery account.
 * 2. An account { account_to_recover } realizes that someone may have access to its owner key and it is less
 *    than 30 days from generating an operation: change_recovery_account_operation.
 * Steps:
 * A user { account_to_recover } asks his recovery account { recovery_account } to create a request account recovery (outside the blockchain).
 * A recovery account { recovery_account } creates an operation:  request_account_recovery_operation with {new_owner_authority}.
 * A user { account_to_recover } creates an operation: recover_account_operation using { new_owner_authority} and
 * {recent_owner_authority} and signing with two signatures (the old one and the new one).
 * A user has HIVE_ACCOUNT_RECOVERY_REQUEST_EXPIRATION_PERIOD to generate this operation.
 *
 * In order to cancel a request, a user should create a new request with weight of authority =0.
 * The operation: request_account_recovery is valid HIVE_ACCOUNT_RECOVERY_REQUEST_EXPIRATION_PERIOD hours and
 * if after HIVE_ACCOUNT_RECOVERY_REQUEST_EXPIRATION_PERIOD  hours there is no response (operation: recover_account_operation) it is expired.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/24_request_account_recovery.md?ref_type=heads
 */
export interface request_account_recovery {
    /**
     * @param {string} recovery_account - The account that may create a request for account recovery.
     *                                    It is important to keep it actual.
     */
    recovery_account: string;
    /** @param {string} account_to_recover - The account to be recovered. */
    account_to_recover: string;
    /**
     * @param {authority} new_owner_authority - The new owner authority – the public, not private key.
     *                                          The new authority should be satisfiable.
     */
    new_owner_authority: authority | undefined;
    /** @param {future_extensions} extensions - Not currently used. */
    extensions: future_extensions[];
}
export declare const request_account_recovery: {
    fromJSON(object: any): request_account_recovery;
    toJSON(message: request_account_recovery): unknown;
    create<I extends Exact<DeepPartial<request_account_recovery>, I>>(base?: I): request_account_recovery;
    fromPartial<I extends Exact<DeepPartial<request_account_recovery>, I>>(object: I): request_account_recovery;
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
