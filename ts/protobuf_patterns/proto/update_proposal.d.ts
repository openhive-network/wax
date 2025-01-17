import { asset } from "./asset.js";
import { void_t } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface update_proposal_end_date {
    end_date: string;
}
export interface update_proposal_extension {
    void_t?: void_t | undefined;
    update_proposal_end_date?: update_proposal_end_date | undefined;
}
/**
 * A user who created the proposal may update it. A user may decrease {daily_pay},
 * change subject, permlink and {end_date} (using {extensions}).
 * In order to update the proposal parameters, all parameters should be entered.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/47_update_proposal.md?ref_type=heads
 */
export interface update_proposal {
    /** @param {number} proposal_id */
    proposal_id: string;
    /** @param {string} creator */
    creator: string;
    /** @param {asset} daily_pay */
    daily_pay: asset | undefined;
    /** @param {string} subject */
    subject: string;
    /** @param {string} permlinks */
    permlink: string;
    /** @param {update_proposal_extension} extensions */
    extensions: update_proposal_extension[];
}
export declare const update_proposal_end_date: {
    fromJSON(object: any): update_proposal_end_date;
    toJSON(message: update_proposal_end_date): unknown;
    create<I extends Exact<DeepPartial<update_proposal_end_date>, I>>(base?: I): update_proposal_end_date;
    fromPartial<I extends Exact<DeepPartial<update_proposal_end_date>, I>>(object: I): update_proposal_end_date;
};
export declare const update_proposal_extension: {
    fromJSON(object: any): update_proposal_extension;
    toJSON(message: update_proposal_extension): unknown;
    create<I extends Exact<DeepPartial<update_proposal_extension>, I>>(base?: I): update_proposal_extension;
    fromPartial<I extends Exact<DeepPartial<update_proposal_extension>, I>>(object: I): update_proposal_extension;
};
export declare const update_proposal: {
    fromJSON(object: any): update_proposal;
    toJSON(message: update_proposal): unknown;
    create<I extends Exact<DeepPartial<update_proposal>, I>>(base?: I): update_proposal;
    fromPartial<I extends Exact<DeepPartial<update_proposal>, I>>(object: I): update_proposal;
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
