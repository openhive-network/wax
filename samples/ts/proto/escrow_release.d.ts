import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation is used to release the funds of the escrow.
 * The escrow may be released by { from }, { to } or { agent } – depending on the following conditions:
 * If there is no dispute and escrow has not expired, either party can release funds to the other.
 * If escrow expires and there is no dispute, either party can release funds to either party.
 * If there is a dispute regardless of expiration, the agent can release funds to either party
 * following whichever agreement was in place between the parties.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/29_escrow_release.md?ref_type=heads
 */
export interface escrow_release {
    /** @param {string} from_account - Account name. */
    from_account: string;
    /** @param {string} to_account - Account name. */
    to_account: string;
    /** @param {string} agent - Account name. */
    agent: string;
    /** @param {string} who - The account that is attempting to release the funds. */
    who: string;
    /** @param {string} receiver - The account that should receive funds (might be {from}, might be {to}). */
    receiver: string;
    /** @param {number} escrow_id - Escrow indicator. */
    escrow_id: number;
    /** @param {asset} hbd_amount - The amount of HBD to release. */
    hbd_amount: asset | undefined;
    /** @param {asset} hive_amount - The amount of HIVE to release. */
    hive_amount: asset | undefined;
}
export declare const escrow_release: {
    fromJSON(object: any): escrow_release;
    toJSON(message: escrow_release): unknown;
    create<I extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        who?: string | undefined;
        receiver?: string | undefined;
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
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        who?: string | undefined;
        receiver?: string | undefined;
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
    } & { [K_2 in Exclude<keyof I, keyof escrow_release>]: never; }>(base?: I | undefined): escrow_release;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        who?: string | undefined;
        receiver?: string | undefined;
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
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        agent?: string | undefined;
        who?: string | undefined;
        receiver?: string | undefined;
        escrow_id?: number | undefined;
        hbd_amount?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["hbd_amount"], keyof asset>]: never; }) | undefined;
        hive_amount?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["hive_amount"], keyof asset>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof escrow_release>]: never; }>(object: I_1): escrow_release;
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
