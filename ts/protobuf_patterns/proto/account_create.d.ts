import { asset } from "./asset.js";
import { authority } from "./authority.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * A new account may be created only by an existing account.
 * The account that creates a new account pays a fee.
 * The fee amount is set by the witnesses.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/09_account_create.md?ref_type=heads&plain=0&blame=1#2-parameters
 */
export interface account_create {
    /** @param {asset} fee - Paid by creator. The witnesses decide the amount of the fee. Now, it is 3 HIVE. */
    fee: asset | undefined;
    /** @param {string} creator - An account that creates a new account. */
    creator: string;
    /**
     * @param {string} new_account_name - Valid account name may consist of many parts separated by a dot,
     *                                  total may have up to 16 characters, parts have to start from a letter,
     *                                  may be followed by numbers, or '-'.
     */
    new_account_name: string;
    /** @param {authority} owner */
    owner: authority | undefined;
    /** @param {authority} active */
    active: authority | undefined;
    /** @param {authority} posting */
    posting: authority | undefined;
    /** @param {string} memo_key - Not authority, public memo key. */
    memo_key: string;
    /** @param {string} json_metadata */
    json_metadata: string;
}
export declare const account_create: {
    fromJSON(object: any): account_create;
    toJSON(message: account_create): unknown;
    create<I extends Exact<DeepPartial<account_create>, I>>(base?: I): account_create;
    fromPartial<I extends Exact<DeepPartial<account_create>, I>>(object: I): account_create;
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
