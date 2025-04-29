import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The escrow allows the account { from_account } to send money to an account { to_account }
 * only if the agreed terms will be fulfilled. In case of dispute { agent } may divide the funds
 * between { from } and { to }. The escrow lasts up to { escrow_expiration }.
 * When the escrow is created, the funds are transferred {from} to a temporary account.
 * The funds are on the temporary balance, till the operation escrow_release_operation is created.
 * To create an valid escrow:
 * 1. Sender { from } creates the escrow using the operation: escrow_transfer_operation indicated  { to } and { agent }.
 * 2. The { agent } and { to } have up to { ratification_deadline } for approving the escrow using operation: escrow_approve_operation.
 * If there is a dispute, the operation: escrow_dispute_operation should be used.
 * In case of the escrow releases, the operation: escrow_release_operation should be used.
 *
 * Descritpion https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/27_escrow_transfer.md?ref_type=heads
 */
export interface escrow_transfer {
    /** @param {string} from_account - Account name. */
    from: string;
    /** @param {string} to_account - Account name. */
    to: string;
    /** @param {string} agent - Account name. */
    agent: string;
    /** @param {number} escrow_id - It is defined by the sender. It should be unique for { from }. */
    escrow_id: number;
    /** @param {asset} hbd_amount - Escrow amount. */
    hbd_amount: asset | undefined;
    /** @param {asset} hive_amount - Escrow amount. */
    hive_amount: asset | undefined;
    /** @param {asset} fee - The fee amount depends on the agent. The fee is paid to the agent when approved. */
    fee: asset | undefined;
    /**
     * @param {string} ratification_deadline - Time for approval for { to } and { agent }.
     *                                         If the escrow is not approved till { ratification_deadline },
     *                                         it will be rejected and all funds returned to { from }.
     */
    ratification_deadline: string;
    /** @param {string} escrow_expiration - See description of escrow_release_operation. */
    escrow_expiration: string;
    /** @param {string} json_meta - json string. */
    json_meta: string;
}
export declare const escrow_transfer: {
    fromJSON(object: any): escrow_transfer;
    toJSON(message: escrow_transfer): unknown;
    create<I extends Exact<DeepPartial<escrow_transfer>, I>>(base?: I): escrow_transfer;
    fromPartial<I extends Exact<DeepPartial<escrow_transfer>, I>>(object: I): escrow_transfer;
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
