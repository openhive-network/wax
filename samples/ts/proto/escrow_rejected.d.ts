import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to escrow_approve_operation and escrow_transfer_operation.
 * Generated when pending escrow transfer is cancelled and user that initiated it receives all the funds back.
 * It can happen with explicit rejection with use of first operation. Can also happen during block processing when either
 * agent or to account failed to approve before ratification deadline.
 * @see escrow_approved
 */
export interface escrow_rejected {
    /** @param {string} from_account - user that initiated escrow transfer (receiver of all the funds) */
    from_account: string;
    /** @param {string} to_account - user that was target of cancelled escrow transfer */
    to_account: string;
    /** @param {string} agent - user that was designated as agent of cancelled escrow transfer */
    agent: string;
    /** @param {number} escrow_id - id of cancelled escrow transfer */
    escrow_id: number;
    /** @param {asset} hbd_amount - (HBD) funds from cancelled escrow transfer (same amount as in escrow_transfer_operation) */
    hbd_amount: asset | undefined;
    /** @param {asset} hive_amount - (HIVE) funds from cancelled escrow transfer (same amount as in escrow_transfer_operation) */
    hive_amount: asset | undefined;
    /** @param {asset} fee - (HIVE of HBD) fee from cancelled escrow transfer (same amount as in escrow_transfer_operation) */
    fee: asset | undefined;
}
export declare const escrow_rejected: {
    fromJSON(object: any): escrow_rejected;
    toJSON(message: escrow_rejected): unknown;
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
    } & { [K_3 in Exclude<keyof I, keyof escrow_rejected>]: never; }>(base?: I | undefined): escrow_rejected;
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
    } & { [K_7 in Exclude<keyof I_1, keyof escrow_rejected>]: never; }>(object: I_1): escrow_rejected;
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
