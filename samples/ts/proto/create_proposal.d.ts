import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * There is a Decentralized Hive Fund (DHF) on the Hive.
 * Users may submit proposals for funding and if the proposal receives enough votes, it will be funded.
 * In order to create a proposal user should create a post first and then marked it as
 * a proposal with the operation create_proposal_operation.
 * User defines when the proposal starts and ends and how many funds need to realize it.
 * The creating proposal costs 10 HBD and additionally 1 HBD for each day over 60 days. The fee goes back to DHF.
 * Every hour all active proposals are processed and taking into consideration a current number of votes payments are done.
 * Accounts can create/remove votes anytime.
 *
 * @param {string} creator
 * @param {string} receiver
 * @param {string} start_date
 * @param {string} end_date
 * @param {asset} daily_pay
 * @param {string} subject
 * @param {string} permlink
 * @param {future_extensions} extensions
 */
export interface create_proposal {
    creator: string;
    receiver: string;
    start_date: string;
    end_date: string;
    daily_pay: asset | undefined;
    subject: string;
    permlink: string;
    extensions: future_extensions[];
}
export declare const create_proposal: {
    encode(message: create_proposal, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): create_proposal;
    fromJSON(object: any): create_proposal;
    toJSON(message: create_proposal): unknown;
    create<I extends {
        creator?: string | undefined;
        receiver?: string | undefined;
        start_date?: string | undefined;
        end_date?: string | undefined;
        daily_pay?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        subject?: string | undefined;
        permlink?: string | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        creator?: string | undefined;
        receiver?: string | undefined;
        start_date?: string | undefined;
        end_date?: string | undefined;
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
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_1 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_2 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_3 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_4 in Exclude<keyof I, keyof create_proposal>]: never; }>(base?: I | undefined): create_proposal;
    fromPartial<I_1 extends {
        creator?: string | undefined;
        receiver?: string | undefined;
        start_date?: string | undefined;
        end_date?: string | undefined;
        daily_pay?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        subject?: string | undefined;
        permlink?: string | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        creator?: string | undefined;
        receiver?: string | undefined;
        start_date?: string | undefined;
        end_date?: string | undefined;
        daily_pay?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_5 in Exclude<keyof I_1["daily_pay"], keyof asset>]: never; }) | undefined;
        subject?: string | undefined;
        permlink?: string | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_6 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_7 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_8 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_9 in Exclude<keyof I_1, keyof create_proposal>]: never; }>(object: I_1): create_proposal;
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
