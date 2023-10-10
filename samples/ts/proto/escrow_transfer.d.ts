import _m0 from "protobufjs/minimal.js";
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
 * @param {string} from_account - Account name.
 * @param {string} to_account - Account name.
 * @param {string} agent - Account name.
 * @param {number} escrow_id - It is defined by the sender. It should be unique for { from }.
 * @param {asset} hbd_amount - Escrow amount.
 * @param {asset} hive_amount - Escrow amount.
 * @param {asset} fee - The fee amount depends on the agent. The fee is paid to the agent when approved.
 * @param {string} ratification_deadline - Time for approval for { to } and { agent }.
 *                                         If the escrow is not approved till { ratification_deadline },
 *                                         it will be rejected and all funds returned to { from }.
 * @param {string} escrow_expiration - See description of escrow_release_operation.
 * @param {string} json_meta - json string.
 */
export interface escrow_transfer {
    from_account: string;
    to_account: string;
    agent: string;
    escrow_id: number;
    hbd_amount: asset | undefined;
    hive_amount: asset | undefined;
    fee: asset | undefined;
    ratification_deadline: string;
    escrow_expiration: string;
    json_meta: string;
}
export declare const escrow_transfer: {
    encode(message: escrow_transfer, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): escrow_transfer;
    fromJSON(object: any): escrow_transfer;
    toJSON(message: escrow_transfer): unknown;
    create<I extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        escrow_id?: number | undefined;
        hbd_amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        hive_amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        fee?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        ratification_deadline?: string | undefined;
        escrow_expiration?: string | undefined;
        json_meta?: string | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        escrow_id?: number | undefined;
        hbd_amount?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["hbd_amount"], keyof asset>]: never; }) | undefined;
        hive_amount?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["hive_amount"], keyof asset>]: never; }) | undefined;
        fee?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I["fee"], keyof asset>]: never; }) | undefined;
        ratification_deadline?: string | undefined;
        escrow_expiration?: string | undefined;
        json_meta?: string | undefined;
    } & { [K_3 in Exclude<keyof I, keyof escrow_transfer>]: never; }>(base?: I | undefined): escrow_transfer;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        escrow_id?: number | undefined;
        hbd_amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        hive_amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        fee?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        ratification_deadline?: string | undefined;
        escrow_expiration?: string | undefined;
        json_meta?: string | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        escrow_id?: number | undefined;
        hbd_amount?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["hbd_amount"], keyof asset>]: never; }) | undefined;
        hive_amount?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_5 in Exclude<keyof I_1["hive_amount"], keyof asset>]: never; }) | undefined;
        fee?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_6 in Exclude<keyof I_1["fee"], keyof asset>]: never; }) | undefined;
        ratification_deadline?: string | undefined;
        escrow_expiration?: string | undefined;
        json_meta?: string | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof escrow_transfer>]: never; }>(object: I_1): escrow_transfer;
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
