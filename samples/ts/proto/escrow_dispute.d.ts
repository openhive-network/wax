export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation  escrow_dispute_operation is used to raise the dispute. It may be used by { from } or { to } accounts.
 * If there is a dispute, only {agent} may release the funds.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/28_escrow_dispute.md?ref_type=heads
 */
export interface escrow_dispute {
    /** @param {string} from_account - Account name. */
    from_account: string;
    /** @param {string} to_account - Account name. */
    to_account: string;
    /** @param {string} agent - Account name. */
    agent: string;
    /** @param {string} who - Account name. Either {to} or {agent}. */
    who: string;
    /** @param {number} escrow_id - Escrow identifier. */
    escrow_id: number;
}
export declare const escrow_dispute: {
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
