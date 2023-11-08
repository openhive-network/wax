import _m0 from "protobufjs/minimal.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This is an operation for witnesses.
 * This is one of the two operations allowing to update witness properties (@see witness_update_operation).
 * The whole list of properties is available here:
 * https://gitlab.syncad.com/hive/hive/-/blob/master/doc/witness_parameters.md.
 *
 * @param {string} owner - Witness account name.
 * @param {map<string, string>} props - There are the following properties available in the {props}:
 *                                      account_creation_fee, account_subsidy_budget, account_subsidy_decay,
 *                                      maximum_block_size, hbd_interest_rate. hbd_exchange_rate, url and new_signing_key.
 * @param {future_extensions} extensions
 */
export interface witness_set_properties {
    owner: string;
    props: {
        [key: string]: string;
    };
    extensions: future_extensions[];
}
export interface witness_set_properties_PropsEntry {
    key: string;
    value: string;
}
export declare const witness_set_properties: {
    encode(message: witness_set_properties, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): witness_set_properties;
    fromJSON(object: any): witness_set_properties;
    toJSON(message: witness_set_properties): unknown;
    create<I extends {
        owner?: string | undefined;
        props?: {
            [x: string]: string | undefined;
        } | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        owner?: string | undefined;
        props?: ({
            [x: string]: string | undefined;
        } & {
            [x: string]: string | undefined;
        } & { [K in Exclude<keyof I["props"], string | number>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_1 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_2 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_3 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_4 in Exclude<keyof I, keyof witness_set_properties>]: never; }>(base?: I | undefined): witness_set_properties;
    fromPartial<I_1 extends {
        owner?: string | undefined;
        props?: {
            [x: string]: string | undefined;
        } | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        owner?: string | undefined;
        props?: ({
            [x: string]: string | undefined;
        } & {
            [x: string]: string | undefined;
        } & { [K_5 in Exclude<keyof I_1["props"], string | number>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_6 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_7 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_8 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_9 in Exclude<keyof I_1, keyof witness_set_properties>]: never; }>(object: I_1): witness_set_properties;
};
export declare const witness_set_properties_PropsEntry: {
    encode(message: witness_set_properties_PropsEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): witness_set_properties_PropsEntry;
    fromJSON(object: any): witness_set_properties_PropsEntry;
    toJSON(message: witness_set_properties_PropsEntry): unknown;
    create<I extends {
        key?: string | undefined;
        value?: string | undefined;
    } & {
        key?: string | undefined;
        value?: string | undefined;
    } & { [K in Exclude<keyof I, keyof witness_set_properties_PropsEntry>]: never; }>(base?: I | undefined): witness_set_properties_PropsEntry;
    fromPartial<I_1 extends {
        key?: string | undefined;
        value?: string | undefined;
    } & {
        key?: string | undefined;
        value?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof witness_set_properties_PropsEntry>]: never; }>(object: I_1): witness_set_properties_PropsEntry;
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
