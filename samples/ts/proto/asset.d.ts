import * as _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface asset {
    amount: string;
    precision: number;
    nai: string;
}
export declare const asset: {
    encode(message: asset, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): asset;
    fromJSON(object: any): asset;
    toJSON(message: asset): unknown;
    create<I extends {
        amount?: string | undefined;
        precision?: number | undefined;
        nai?: string | undefined;
    } & {
        amount?: string | undefined;
        precision?: number | undefined;
        nai?: string | undefined;
    } & { [K in Exclude<keyof I, keyof asset>]: never; }>(base?: I | undefined): asset;
    fromPartial<I_1 extends {
        amount?: string | undefined;
        precision?: number | undefined;
        nai?: string | undefined;
    } & {
        amount?: string | undefined;
        precision?: number | undefined;
        nai?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof asset>]: never; }>(object: I_1): asset;
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
