import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation create_claimed_account_operation may be used by the user who has the token.
 * Pending claimed accounts (see claim_account_operation).
 * After executing the operation create_claimed_account_operation, a new account is created.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/23_create_claimed_account.md?ref_type=heads
 */
export interface create_claimed_account {
    /** @param {string} creator - An account who create a new account. */
    creator: string;
    /**
     * @param {string} new_account_name - Account name.
     *                                    Valid account name may consist of many parts separated by a dot,
     *                                    total may have up to 16 characters, parts have to start from a letter,
     *                                    may be followed by numbers, or “-“.
     */
    new_account_name: string;
    /** @param {authority} owner */
    owner: authority | undefined;
    /** @param {authority} active */
    active: authority | undefined;
    /** @param {authority} posting */
    posting: authority | undefined;
    /** @param {string} memo_key */
    memo_key: string;
    /** @param {string} json_metadata - Json string. */
    json_metadata: string;
    /** @param {future_extensions} extensions - Not currently used. */
    extensions: future_extensions[];
}
export declare const create_claimed_account: {
    fromJSON(object: any): create_claimed_account;
    toJSON(message: create_claimed_account): unknown;
    create<I extends Exact<DeepPartial<create_claimed_account>, I>>(base?: I): create_claimed_account;
    fromPartial<I extends Exact<DeepPartial<create_claimed_account>, I>>(object: I): create_claimed_account;
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
