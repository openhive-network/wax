import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation delegate_rc_operation sets the amount of resource credits (RC) that { from } delegates
 * to each account listed in { delegatees }. Only RC is delegated - the vesting shares (HP), their voting power
 * and governance rights stay with { from }. If there is no delegation yet, a new one is created, if there is,
 * it is increased or decreased to { max_rc }; { max_rc } = 0 removes the delegation.
 * Since HF 26 the operation can be embedded in custom_json_operation with id "rc", since HF 29 it can also be
 * used as a regular operation. Account history shows effective embedded delegations as delegate_rc_operation
 * placed right after their custom_json_operation.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/37_delegate_rc.md?ref_type=heads
 */
export interface delegate_rc {
    /** @param {string} from_account - The account delegating RC. */
    from: string;
    /** @param {string} delegatees - Accounts receiving RC (up to 100, without { from }). */
    delegatees: string[];
    /**
     * @param {number} max_rc - The amount of RC delegated to each of { delegatees }. 0 removes the delegation.
     *                          Otherwise it has to be at least 1/3 of the fee for creating a new account (expressed in VESTS).
     */
    max_rc: string;
    /** @param {future_extensions} extensions */
    extensions: future_extensions[];
}
export declare const delegate_rc: {
    fromJSON(object: any): delegate_rc;
    toJSON(message: delegate_rc): unknown;
    create<I extends Exact<DeepPartial<delegate_rc>, I>>(base?: I): delegate_rc;
    fromPartial<I extends Exact<DeepPartial<delegate_rc>, I>>(object: I): delegate_rc;
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
