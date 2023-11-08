import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Funds withdrawals from the savings can be canceled at any time before it is executed.
 *
 * @param {string} from_account
 * @param {number} request_id
 */
export interface cancel_transfer_from_savings {
    from_account: string;
    request_id: number;
}
export declare const cancel_transfer_from_savings: {
    encode(message: cancel_transfer_from_savings, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): cancel_transfer_from_savings;
    fromJSON(object: any): cancel_transfer_from_savings;
    toJSON(message: cancel_transfer_from_savings): unknown;
    create<I extends {
        from_account?: string | undefined;
        request_id?: number | undefined;
    } & {
        from_account?: string | undefined;
        request_id?: number | undefined;
    } & { [K in Exclude<keyof I, keyof cancel_transfer_from_savings>]: never; }>(base?: I | undefined): cancel_transfer_from_savings;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        request_id?: number | undefined;
    } & {
        from_account?: string | undefined;
        request_id?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof cancel_transfer_from_savings>]: never; }>(object: I_1): cancel_transfer_from_savings;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
