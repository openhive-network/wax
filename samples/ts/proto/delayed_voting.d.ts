import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to transfer_to_vesting_operation.
 * Generated during block processing every time part of fairly fresh VESTS becomes active part of governance vote for the account.
 * Note: after account receives new VESTS there is a grace period before those VESTS are accounted for when
 * it comes to governance vote power. This vop is generated at the end of that period.
 *
 * @param {string} voter - account with fairly fresh VESTS
 * @param {number} votes - (VESTS satoshi) new governance vote power that just activated for voter
 */
export interface delayed_voting {
    voter: string;
    votes: string;
}
export declare const delayed_voting: {
    encode(message: delayed_voting, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): delayed_voting;
    fromJSON(object: any): delayed_voting;
    toJSON(message: delayed_voting): unknown;
    create<I extends {
        voter?: string | undefined;
        votes?: string | undefined;
    } & {
        voter?: string | undefined;
        votes?: string | undefined;
    } & { [K in Exclude<keyof I, keyof delayed_voting>]: never; }>(base?: I | undefined): delayed_voting;
    fromPartial<I_1 extends {
        voter?: string | undefined;
        votes?: string | undefined;
    } & {
        voter?: string | undefined;
        votes?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof delayed_voting>]: never; }>(object: I_1): delayed_voting;
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
