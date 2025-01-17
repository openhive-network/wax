import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * This is an operation for witnesses.
 * This is one of the two operations allowing to update witness properties (@see witness_update_operation).
 * The whole list of properties is available here:
 * https://gitlab.syncad.com/hive/hive/-/blob/master/doc/witness_parameters.md.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/42_witness_set_properties.md?ref_type=heads
 */
export interface witness_set_properties {
    /** @param {string} owner - Witness account name. */
    owner: string;
    /**
     * @param {map<string, string>} props - There are the following properties available in the {props}:
     *                                      account_creation_fee, account_subsidy_budget, account_subsidy_decay,
     *                                      maximum_block_size, hbd_interest_rate. hbd_exchange_rate, url and new_signing_key.
     */
    props: {
        [key: string]: string;
    };
    /** @param {future_extensions} extensions */
    extensions: future_extensions[];
}
export interface witness_set_properties_PropsEntry {
    key: string;
    value: string;
}
export declare const witness_set_properties: {
    fromJSON(object: any): witness_set_properties;
    toJSON(message: witness_set_properties): unknown;
    create<I extends Exact<DeepPartial<witness_set_properties>, I>>(base?: I): witness_set_properties;
    fromPartial<I extends Exact<DeepPartial<witness_set_properties>, I>>(object: I): witness_set_properties;
};
export declare const witness_set_properties_PropsEntry: {
    fromJSON(object: any): witness_set_properties_PropsEntry;
    toJSON(message: witness_set_properties_PropsEntry): unknown;
    create<I extends Exact<DeepPartial<witness_set_properties_PropsEntry>, I>>(base?: I): witness_set_properties_PropsEntry;
    fromPartial<I extends Exact<DeepPartial<witness_set_properties_PropsEntry>, I>>(object: I): witness_set_properties_PropsEntry;
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
