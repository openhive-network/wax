import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Using the operation decline_voting_rights_operation, a user may decide to decline
 * their voting rights – for content, witnesses and proposals.
 * Additionally, a user cannot set a proxy (operation account_witness_proxy_operation).
 * The operation is done with a HIVE_OWNER_AUTH_RECOVERY_PERIOD day delay.
 * After HIVE_OWNER_AUTH_RECOVERY_PERIOD days it is irreversible.
 * During HIVE_OWNER_AUTH_RECOVERY_PERIOD days after creation, the operation may be canceled
 * using the operation declive_voting_rights_operation with {decline = false}.
 *
 * @param {string} account - Account name.
 * @param {bool} decline
 */
export interface decline_voting_rights {
    account: string;
    decline: boolean;
}
export declare const decline_voting_rights: {
    encode(message: decline_voting_rights, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): decline_voting_rights;
    fromJSON(object: any): decline_voting_rights;
    toJSON(message: decline_voting_rights): unknown;
    create<I extends {
        account?: string | undefined;
        decline?: boolean | undefined;
    } & {
        account?: string | undefined;
        decline?: boolean | undefined;
    } & { [K in Exclude<keyof I, keyof decline_voting_rights>]: never; }>(base?: I | undefined): decline_voting_rights;
    fromPartial<I_1 extends {
        account?: string | undefined;
        decline?: boolean | undefined;
    } & {
        account?: string | undefined;
        decline?: boolean | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof decline_voting_rights>]: never; }>(object: I_1): decline_voting_rights;
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
