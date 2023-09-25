import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation escrow_approve_operation is used to approve the escrow.
 * The approval should be done by { to } and by the { agent }.
 * The escrow approval is irreversible.
 * If { agent } or { to } haven’t approved the escrow before the { ratification_deadline} or either
 * of them explicitly rejected the escrow, the escrow is rejected.
 * If {agent} and {to} have approved the escrow, the {fee} is transferred from temporary balance to {agent} account.
 *
 * @param {string} from_account - Account name.
 * @param {string} to_account - Account name.
 * @param {string} agent - Account name.
 * @param {string} who - Account name. Either {to} or {agent}.
 * @param {number} escrow_id - Escrow identifier.
 * @param {bool} approve - approve = true; (approve = false explicitly rejects the escrow)
 */
export interface escrow_approve {
    from_account: string;
    to_account: string;
    agent: string;
    who: string;
    escrow_id: number;
    approve: boolean;
}
export declare const escrow_approve: {
    encode(message: escrow_approve, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): escrow_approve;
    fromJSON(object: any): escrow_approve;
    toJSON(message: escrow_approve): unknown;
    create<I extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        who?: string | undefined;
        escrow_id?: number | undefined;
        approve?: boolean | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        who?: string | undefined;
        escrow_id?: number | undefined;
        approve?: boolean | undefined;
    } & { [K in Exclude<keyof I, keyof escrow_approve>]: never; }>(base?: I | undefined): escrow_approve;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        who?: string | undefined;
        escrow_id?: number | undefined;
        approve?: boolean | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        who?: string | undefined;
        escrow_id?: number | undefined;
        approve?: boolean | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof escrow_approve>]: never; }>(object: I_1): escrow_approve;
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
