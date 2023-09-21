import * as _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
import { void_t } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface recurrent_transfer_pair_id {
    pair_id: number;
}
export interface recurrent_transfer_extension {
    void_t?: void_t | undefined;
    recurrent_transfer_pair_id?: recurrent_transfer_pair_id | undefined;
}
export interface recurrent_transfer {
    from_account: string;
    to_account: string;
    amount: asset | undefined;
    memo: string;
    recurrence: number;
    executions: number;
    extensions: recurrent_transfer_extension[];
}
export declare const recurrent_transfer_pair_id: {
    encode(message: recurrent_transfer_pair_id, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): recurrent_transfer_pair_id;
    fromJSON(object: any): recurrent_transfer_pair_id;
    toJSON(message: recurrent_transfer_pair_id): unknown;
    create<I extends {
        pair_id?: number | undefined;
    } & {
        pair_id?: number | undefined;
    } & { [K in Exclude<keyof I, "pair_id">]: never; }>(base?: I | undefined): recurrent_transfer_pair_id;
    fromPartial<I_1 extends {
        pair_id?: number | undefined;
    } & {
        pair_id?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, "pair_id">]: never; }>(object: I_1): recurrent_transfer_pair_id;
};
export declare const recurrent_transfer_extension: {
    encode(message: recurrent_transfer_extension, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): recurrent_transfer_extension;
    fromJSON(object: any): recurrent_transfer_extension;
    toJSON(message: recurrent_transfer_extension): unknown;
    create<I extends {
        void_t?: {} | undefined;
        recurrent_transfer_pair_id?: {
            pair_id?: number | undefined;
        } | undefined;
    } & {
        void_t?: ({} & {} & { [K in Exclude<keyof I["void_t"], never>]: never; }) | undefined;
        recurrent_transfer_pair_id?: ({
            pair_id?: number | undefined;
        } & {
            pair_id?: number | undefined;
        } & { [K_1 in Exclude<keyof I["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof recurrent_transfer_extension>]: never; }>(base?: I | undefined): recurrent_transfer_extension;
    fromPartial<I_1 extends {
        void_t?: {} | undefined;
        recurrent_transfer_pair_id?: {
            pair_id?: number | undefined;
        } | undefined;
    } & {
        void_t?: ({} & {} & { [K_3 in Exclude<keyof I_1["void_t"], never>]: never; }) | undefined;
        recurrent_transfer_pair_id?: ({
            pair_id?: number | undefined;
        } & {
            pair_id?: number | undefined;
        } & { [K_4 in Exclude<keyof I_1["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof recurrent_transfer_extension>]: never; }>(object: I_1): recurrent_transfer_extension;
};
export declare const recurrent_transfer: {
    encode(message: recurrent_transfer, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): recurrent_transfer;
    fromJSON(object: any): recurrent_transfer;
    toJSON(message: recurrent_transfer): unknown;
    create<I extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        memo?: string | undefined;
        recurrence?: number | undefined;
        executions?: number | undefined;
        extensions?: {
            void_t?: {} | undefined;
            recurrent_transfer_pair_id?: {
                pair_id?: number | undefined;
            } | undefined;
        }[] | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["amount"], keyof asset>]: never; }) | undefined;
        memo?: string | undefined;
        recurrence?: number | undefined;
        executions?: number | undefined;
        extensions?: ({
            void_t?: {} | undefined;
            recurrent_transfer_pair_id?: {
                pair_id?: number | undefined;
            } | undefined;
        }[] & ({
            void_t?: {} | undefined;
            recurrent_transfer_pair_id?: {
                pair_id?: number | undefined;
            } | undefined;
        } & {
            void_t?: ({} & {} & { [K_1 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
            recurrent_transfer_pair_id?: ({
                pair_id?: number | undefined;
            } & {
                pair_id?: number | undefined;
            } & { [K_2 in Exclude<keyof I["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
        } & { [K_3 in Exclude<keyof I["extensions"][number], keyof recurrent_transfer_extension>]: never; })[] & { [K_4 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
            recurrent_transfer_pair_id?: {
                pair_id?: number | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I, keyof recurrent_transfer>]: never; }>(base?: I | undefined): recurrent_transfer;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        memo?: string | undefined;
        recurrence?: number | undefined;
        executions?: number | undefined;
        extensions?: {
            void_t?: {} | undefined;
            recurrent_transfer_pair_id?: {
                pair_id?: number | undefined;
            } | undefined;
        }[] | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        amount?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_6 in Exclude<keyof I_1["amount"], keyof asset>]: never; }) | undefined;
        memo?: string | undefined;
        recurrence?: number | undefined;
        executions?: number | undefined;
        extensions?: ({
            void_t?: {} | undefined;
            recurrent_transfer_pair_id?: {
                pair_id?: number | undefined;
            } | undefined;
        }[] & ({
            void_t?: {} | undefined;
            recurrent_transfer_pair_id?: {
                pair_id?: number | undefined;
            } | undefined;
        } & {
            void_t?: ({} & {} & { [K_7 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
            recurrent_transfer_pair_id?: ({
                pair_id?: number | undefined;
            } & {
                pair_id?: number | undefined;
            } & { [K_8 in Exclude<keyof I_1["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
        } & { [K_9 in Exclude<keyof I_1["extensions"][number], keyof recurrent_transfer_extension>]: never; })[] & { [K_10 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
            recurrent_transfer_pair_id?: {
                pair_id?: number | undefined;
            } | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_11 in Exclude<keyof I_1, keyof recurrent_transfer>]: never; }>(object: I_1): recurrent_transfer;
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
