export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to change_recovery_account_operation.
 * Generated during block processing after wait period for the recovery account change has passed and the change became active.
 */
export interface changed_recovery_account {
    /** @param {string} account - used that requested recovery accout change */
    account: string;
    /** @param {string} old_recovery_account - previous recovery account */
    old_recovery_account: string;
    /** @param {string} new_recovery_account - new recovery account */
    new_recovery_account: string;
}
export declare const changed_recovery_account: {
    fromJSON(object: any): changed_recovery_account;
    toJSON(message: changed_recovery_account): unknown;
    create<I extends {
        account?: string | undefined;
        old_recovery_account?: string | undefined;
        new_recovery_account?: string | undefined;
    } & {
        account?: string | undefined;
        old_recovery_account?: string | undefined;
        new_recovery_account?: string | undefined;
    } & { [K in Exclude<keyof I, keyof changed_recovery_account>]: never; }>(base?: I | undefined): changed_recovery_account;
    fromPartial<I_1 extends {
        account?: string | undefined;
        old_recovery_account?: string | undefined;
        new_recovery_account?: string | undefined;
    } & {
        account?: string | undefined;
        old_recovery_account?: string | undefined;
        new_recovery_account?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof changed_recovery_account>]: never; }>(object: I_1): changed_recovery_account;
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
