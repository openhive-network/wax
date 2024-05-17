import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to create_proposal_operation.
 * Generated during block processing during proposal maintenance in batches
 * for each proposal that is chosen and receives funding.
 *
 * @param {number} proposal_id - id of chosen proposal
 * @param {string} receiver - account designated to receive funding (receiver of payment)
 * @param {string} payer - treasury account, source of payment
 * @param {asset} payment - (HBD) paid amount
 */
export interface proposal_pay {
    proposal_id: number;
    receiver: string;
    payer: string;
    payment: asset | undefined;
}
export declare const proposal_pay: {
    fromJSON(object: any): proposal_pay;
    toJSON(message: proposal_pay): unknown;
    create<I extends {
        proposal_id?: number | undefined;
        receiver?: string | undefined;
        payer?: string | undefined;
        payment?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        proposal_id?: number | undefined;
        receiver?: string | undefined;
        payer?: string | undefined;
        payment?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["payment"], keyof asset>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof proposal_pay>]: never; }>(base?: I | undefined): proposal_pay;
    fromPartial<I_1 extends {
        proposal_id?: number | undefined;
        receiver?: string | undefined;
        payer?: string | undefined;
        payment?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        proposal_id?: number | undefined;
        receiver?: string | undefined;
        payer?: string | undefined;
        payment?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["payment"], keyof asset>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof proposal_pay>]: never; }>(object: I_1): proposal_pay;
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
