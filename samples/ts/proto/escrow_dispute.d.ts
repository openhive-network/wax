import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation  escrow_dispute_operation is used to raise the dispute. It may be used by { from } or { to } accounts.
 * If there is a dispute, only {agent} may release the funds.
 *
 * @param {string} from_account - Account name.
 * @param {string} to_account - Account name.
 * @param {string} agent - Account name.
 * @param {string} who - Account name. Either {to} or {agent}.
 * @param {number} escrow_id - Escrow identifier.
 */
export interface escrow_dispute {
    from_account: string;
    to_account: string;
    agent: string;
    who: string;
    escrow_id: number;
}
export declare const escrow_dispute: {
    encode(message: escrow_dispute, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): escrow_dispute;
    fromJSON(object: any): escrow_dispute;
    toJSON(message: escrow_dispute): unknown;
    create<I extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        who?: string | undefined;
        escrow_id?: number | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        who?: string | undefined;
        escrow_id?: number | undefined;
    } & { [K in Exclude<keyof I, keyof escrow_dispute>]: never; }>(base?: I | undefined): escrow_dispute;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        who?: string | undefined;
        escrow_id?: number | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        who?: string | undefined;
        escrow_id?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof escrow_dispute>]: never; }>(object: I_1): escrow_dispute;
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
