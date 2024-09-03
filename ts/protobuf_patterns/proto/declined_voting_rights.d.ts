export declare const protobufPackage = "hive.protocol.buffers";
/**
 * It's related to `decline_voting_rights_operation` and generated after `HIVE_OWNER_AUTH_RECOVERY_PERIOD` interval.
 * Then some actions are done and after that `declined_voting_rights_operation` is created.
 */
export interface declined_voting_rights {
    /** @param {string} account - user who decided to decline his voting rights */
    account: string;
}
export declare const declined_voting_rights: {
    fromJSON(object: any): declined_voting_rights;
    toJSON(message: declined_voting_rights): unknown;
    create<I extends {
        account?: string | undefined;
    } & {
        account?: string | undefined;
    } & { [K in Exclude<keyof I, "account">]: never; }>(base?: I | undefined): declined_voting_rights;
    fromPartial<I_1 extends {
        account?: string | undefined;
    } & {
        account?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, "account">]: never; }>(object: I_1): declined_voting_rights;
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
