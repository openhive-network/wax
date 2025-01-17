export declare const protobufPackage = "hive.protocol.buffers";
export interface authority {
    weight_threshold: number;
    account_auths: {
        [key: string]: number;
    };
    key_auths: {
        [key: string]: number;
    };
}
export interface authority_AccountAuthsEntry {
    key: string;
    value: number;
}
export interface authority_KeyAuthsEntry {
    key: string;
    value: number;
}
export declare const authority: {
    fromJSON(object: any): authority;
    toJSON(message: authority): unknown;
    create<I extends Exact<DeepPartial<authority>, I>>(base?: I): authority;
    fromPartial<I extends Exact<DeepPartial<authority>, I>>(object: I): authority;
};
export declare const authority_AccountAuthsEntry: {
    fromJSON(object: any): authority_AccountAuthsEntry;
    toJSON(message: authority_AccountAuthsEntry): unknown;
    create<I extends Exact<DeepPartial<authority_AccountAuthsEntry>, I>>(base?: I): authority_AccountAuthsEntry;
    fromPartial<I extends Exact<DeepPartial<authority_AccountAuthsEntry>, I>>(object: I): authority_AccountAuthsEntry;
};
export declare const authority_KeyAuthsEntry: {
    fromJSON(object: any): authority_KeyAuthsEntry;
    toJSON(message: authority_KeyAuthsEntry): unknown;
    create<I extends Exact<DeepPartial<authority_KeyAuthsEntry>, I>>(base?: I): authority_KeyAuthsEntry;
    fromPartial<I extends Exact<DeepPartial<authority_KeyAuthsEntry>, I>>(object: I): authority_KeyAuthsEntry;
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
