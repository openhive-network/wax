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
 * @param {number} proposal_id
 * @param {string} creator
 * @param {asset} daily_pay
 * @param {string} subject
 * @param {string} permlink
 * @param {update_proposal_extension} extensions
 */
export interface update_proposal {
    proposal_id: string;
    creator: string;
    daily_pay: asset | undefined;
    subject: string;
    permlink: string;
    extensions: update_proposal_extension[];
}
export declare const update_proposal_end_date: {
    fromJSON(object: any): update_proposal_end_date;
    toJSON(message: update_proposal_end_date): unknown;
    create<I extends {
        end_date?: string | undefined;
    } & {
        end_date?: string | undefined;
    } & { [K in Exclude<keyof I, "end_date">]: never; }>(base?: I | undefined): update_proposal_end_date;
    fromPartial<I_1 extends {
        end_date?: string | undefined;
    } & {
        end_date?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, "end_date">]: never; }>(object: I_1): update_proposal_end_date;
};
export declare const update_proposal_extension: {
    fromJSON(object: any): update_proposal_extension;
    toJSON(message: update_proposal_extension): unknown;
    create<I extends {
        void_t?: {} | undefined;
        update_proposal_end_date?: {
            end_date?: string | undefined;
        } | undefined;
    } & {
        void_t?: ({} & {} & { [K in Exclude<keyof I["void_t"], never>]: never; }) | undefined;
        update_proposal_end_date?: ({
            end_date?: string | undefined;
        } & {
            end_date?: string | undefined;
        } & { [K_1 in Exclude<keyof I["update_proposal_end_date"], "end_date">]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof update_proposal_extension>]: never; }>(base?: I | undefined): update_proposal_extension;
    fromPartial<I_1 extends {
        void_t?: {} | undefined;
        update_proposal_end_date?: {
            end_date?: string | undefined;
        } | undefined;
    } & {
        void_t?: ({} & {} & { [K_3 in Exclude<keyof I_1["void_t"], never>]: never; }) | undefined;
        update_proposal_end_date?: ({
            end_date?: string | undefined;
        } & {
            end_date?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["update_proposal_end_date"], "end_date">]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof update_proposal_extension>]: never; }>(object: I_1): update_proposal_extension;
};
export declare const update_proposal: {
    fromJSON(object: any): update_proposal;
    toJSON(message: update_proposal): unknown;
    create<I extends {
        proposal_id?: string | undefined;
        creator?: string | undefined;
        daily_pay?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        subject?: string | undefined;
        permlink?: string | undefined;
        extensions?: {
            void_t?: {} | undefined;
            update_proposal_end_date?: {
                end_date?: string | undefined;
            } | undefined;
        }[] | undefined;
    } & {
        proposal_id?: string | undefined;
        creator?: string | undefined;
        daily_pay?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["daily_pay"], keyof asset>]: never; }) | undefined;
        subject?: string | undefined;
        permlink?: string | undefined;
        extensions?: ({
            void_t?: {} | undefined;
            update_proposal_end_date?: {
                end_date?: string | undefined;
            } | undefined;
        }[] & ({
            void_t?: {} | undefined;
            update_proposal_end_date?: {
                end_date?: string | undefined;
            } | undefined;
        } & {
            void_t?: ({} & {} & { [K_1 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
            update_proposal_end_date?: ({
                end_date?: string | undefined;
            } & {
                end_date?: string | undefined;
            } & { [K_2 in Exclude<keyof I["extensions"][number]["update_proposal_end_date"], "end_date">]: never; }) | undefined;
        } & { [K_3 in Exclude<keyof I["extensions"][number], keyof update_proposal_extension>]: never; })[] & { [K_4 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
            update_proposal_end_date?: {
                end_date?: string | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I, keyof update_proposal>]: never; }>(base?: I | undefined): update_proposal;
    fromPartial<I_1 extends {
        proposal_id?: string | undefined;
        creator?: string | undefined;
        daily_pay?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        subject?: string | undefined;
        permlink?: string | undefined;
        extensions?: {
            void_t?: {} | undefined;
            update_proposal_end_date?: {
                end_date?: string | undefined;
            } | undefined;
        }[] | undefined;
    } & {
        proposal_id?: string | undefined;
        creator?: string | undefined;
        daily_pay?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_6 in Exclude<keyof I_1["daily_pay"], keyof asset>]: never; }) | undefined;
        subject?: string | undefined;
        permlink?: string | undefined;
        extensions?: ({
            void_t?: {} | undefined;
            update_proposal_end_date?: {
                end_date?: string | undefined;
            } | undefined;
        }[] & ({
            void_t?: {} | undefined;
            update_proposal_end_date?: {
                end_date?: string | undefined;
            } | undefined;
        } & {
            void_t?: ({} & {} & { [K_7 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
            update_proposal_end_date?: ({
                end_date?: string | undefined;
            } & {
                end_date?: string | undefined;
            } & { [K_8 in Exclude<keyof I_1["extensions"][number]["update_proposal_end_date"], "end_date">]: never; }) | undefined;
        } & { [K_9 in Exclude<keyof I_1["extensions"][number], keyof update_proposal_extension>]: never; })[] & { [K_10 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
            update_proposal_end_date?: {
                end_date?: string | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_11 in Exclude<keyof I_1, keyof update_proposal>]: never; }>(object: I_1): update_proposal;
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
