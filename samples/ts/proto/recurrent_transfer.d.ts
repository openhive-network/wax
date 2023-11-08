import _m0 from "protobufjs/minimal.js";
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
/**
 * Creates/updates/removes a recurrent transfer in the currency Hive or HBD.
 * Since HF 28, if user has more than one recurrent transfer to the same receiver
 * or if user creates the recurrent transfer using pair_id in the extensions,
 * user has to specify the pair_id in order to update or remove the defined recurrent transfer.
 * - If amount is set to 0, the recurrent transfer will be deleted and the virtual operation
 *   fill_recurrent_transfer_operation is not generated
 * - If there is already a recurrent transfer matching 'from' and 'to', the recurrent transfer will be replaced, but:
 * - If the 'recurrence' is not changed, the next execution will be according to “old definition”
 * - If the 'recurrence' is changed, then the next execution will be “update date” + 'recurrence' there is no execution on the update date.
 * - Up to HF28 there can be only one recurrent transfer for sender 'from' and receiver 'to'.
 *   Since H28 users may define more recurrent transfers to the same sender and receiver using pair_id in the 'executions'.
 * - The one account may define up to 255 recurrent transfers to other accounts.
 * - The execution date of the last transfer should be no more than 730 days in the future.
 *
 * @param {string} from_account
 * @param {string} to_account - Account to transfer asset to. Cannot set a transfer to yourself.
 * @param {asset} amount - The amount of asset to transfer from @ref from to @ref to.
 *                         If the recurrent transfer failed 10 (HIVE_MAX_CONSECUTIVE_RECURRENT_TRANSFER_FAILURES)
 *                         times because of the lack of funds, the recurrent transfer will be deleted.
 *                         Allowed currency: Hive and HBD.
 * @param {string} memo - must be shorter than 2048.
 * @param {number} recurrence - How often will the payment be triggered, unit: hours.
 *                              The first transfer is executed immediately.
 *                              The minimum value of the parameter is 24 h.
 * @param {number} executions - How many times the recurrent payment will be executed.
 *                              Executions must be at least 2, if you set executions to 1 the recurrent transfer will not be executed.
 * @param {recurrent_transfer_extension} extensions - Extensions. Since HF 28 it may contain the 'pair_id'.
 *                                                    It allows to define more than one recurrent transfer from sender to the same receiver 'to'.
 *                                                    Default value 'pair_id=0'.
 */
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
    decode(input: _m0.Reader | Uint8Array, length?: number): recurrent_transfer_pair_id;
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
    decode(input: _m0.Reader | Uint8Array, length?: number): recurrent_transfer_extension;
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
    decode(input: _m0.Reader | Uint8Array, length?: number): recurrent_transfer;
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
