import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to change_recovery_account_operation.
 * Generated during block processing after wait period for the recovery account change has passed and the change became active.
 *
 * @param {string} account - used that requested recovery accout change
 * @param {string} old_recovery_account - previous recovery account
 * @param {string} new_recovery_account - new recovery account
 */
export interface changed_recovery_account {
    account: string;
    old_recovery_account: string;
    new_recovery_account: string;
}
export declare const changed_recovery_account: {
    encode(message: changed_recovery_account, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): changed_recovery_account;
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
