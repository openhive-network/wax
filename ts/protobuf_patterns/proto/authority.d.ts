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
    create<I extends {
        weight_threshold?: number | undefined;
        account_auths?: {
            [x: string]: number | undefined;
        } | undefined;
        key_auths?: {
            [x: string]: number | undefined;
        } | undefined;
    } & {
        weight_threshold?: number | undefined;
        account_auths?: ({
            [x: string]: number | undefined;
        } & {
            [x: string]: number | undefined;
        } & { [K in Exclude<keyof I["account_auths"], string | number>]: never; }) | undefined;
        key_auths?: ({
            [x: string]: number | undefined;
        } & {
            [x: string]: number | undefined;
        } & { [K_1 in Exclude<keyof I["key_auths"], string | number>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof authority>]: never; }>(base?: I | undefined): authority;
    fromPartial<I_1 extends {
        weight_threshold?: number | undefined;
        account_auths?: {
            [x: string]: number | undefined;
        } | undefined;
        key_auths?: {
            [x: string]: number | undefined;
        } | undefined;
    } & {
        weight_threshold?: number | undefined;
        account_auths?: ({
            [x: string]: number | undefined;
        } & {
            [x: string]: number | undefined;
        } & { [K_3 in Exclude<keyof I_1["account_auths"], string | number>]: never; }) | undefined;
        key_auths?: ({
            [x: string]: number | undefined;
        } & {
            [x: string]: number | undefined;
        } & { [K_4 in Exclude<keyof I_1["key_auths"], string | number>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof authority>]: never; }>(object: I_1): authority;
};
export declare const authority_AccountAuthsEntry: {
    fromJSON(object: any): authority_AccountAuthsEntry;
    toJSON(message: authority_AccountAuthsEntry): unknown;
    create<I extends {
        key?: string | undefined;
        value?: number | undefined;
    } & {
        key?: string | undefined;
        value?: number | undefined;
    } & { [K in Exclude<keyof I, keyof authority_AccountAuthsEntry>]: never; }>(base?: I | undefined): authority_AccountAuthsEntry;
    fromPartial<I_1 extends {
        key?: string | undefined;
        value?: number | undefined;
    } & {
        key?: string | undefined;
        value?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof authority_AccountAuthsEntry>]: never; }>(object: I_1): authority_AccountAuthsEntry;
};
export declare const authority_KeyAuthsEntry: {
    fromJSON(object: any): authority_KeyAuthsEntry;
    toJSON(message: authority_KeyAuthsEntry): unknown;
    create<I extends {
        key?: string | undefined;
        value?: number | undefined;
    } & {
        key?: string | undefined;
        value?: number | undefined;
    } & { [K in Exclude<keyof I, keyof authority_KeyAuthsEntry>]: never; }>(base?: I | undefined): authority_KeyAuthsEntry;
    fromPartial<I_1 extends {
        key?: string | undefined;
        value?: number | undefined;
    } & {
        key?: string | undefined;
        value?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof authority_KeyAuthsEntry>]: never; }>(object: I_1): authority_KeyAuthsEntry;
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
