import { legacy_chain_properties } from "./legacy_chain_properties.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface pow_work {
    worker: string;
    input: string;
    signature: string;
    work: string;
}
export interface pow {
    worker_account: string;
    block_id: string;
    nonce: string;
    work: pow_work | undefined;
    props: legacy_chain_properties | undefined;
}
export declare const pow_work: {
    fromJSON(object: any): pow_work;
    toJSON(message: pow_work): unknown;
    create<I extends {
        worker?: string | undefined;
        input?: string | undefined;
        signature?: string | undefined;
        work?: string | undefined;
    } & {
        worker?: string | undefined;
        input?: string | undefined;
        signature?: string | undefined;
        work?: string | undefined;
    } & { [K in Exclude<keyof I, keyof pow_work>]: never; }>(base?: I | undefined): pow_work;
    fromPartial<I_1 extends {
        worker?: string | undefined;
        input?: string | undefined;
        signature?: string | undefined;
        work?: string | undefined;
    } & {
        worker?: string | undefined;
        input?: string | undefined;
        signature?: string | undefined;
        work?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof pow_work>]: never; }>(object: I_1): pow_work;
};
export declare const pow: {
    fromJSON(object: any): pow;
    toJSON(message: pow): unknown;
    create<I extends {
        worker_account?: string | undefined;
        block_id?: string | undefined;
        nonce?: string | undefined;
        work?: {
            worker?: string | undefined;
            input?: string | undefined;
            signature?: string | undefined;
            work?: string | undefined;
        } | undefined;
        props?: {
            account_creation_fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } | undefined;
    } & {
        worker_account?: string | undefined;
        block_id?: string | undefined;
        nonce?: string | undefined;
        work?: ({
            worker?: string | undefined;
            input?: string | undefined;
            signature?: string | undefined;
            work?: string | undefined;
        } & {
            worker?: string | undefined;
            input?: string | undefined;
            signature?: string | undefined;
            work?: string | undefined;
        } & { [K in Exclude<keyof I["work"], keyof pow_work>]: never; }) | undefined;
        props?: ({
            account_creation_fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } & {
            account_creation_fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_1 in Exclude<keyof I["props"]["account_creation_fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } & { [K_2 in Exclude<keyof I["props"], keyof legacy_chain_properties>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I, keyof pow>]: never; }>(base?: I | undefined): pow;
    fromPartial<I_1 extends {
        worker_account?: string | undefined;
        block_id?: string | undefined;
        nonce?: string | undefined;
        work?: {
            worker?: string | undefined;
            input?: string | undefined;
            signature?: string | undefined;
            work?: string | undefined;
        } | undefined;
        props?: {
            account_creation_fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } | undefined;
    } & {
        worker_account?: string | undefined;
        block_id?: string | undefined;
        nonce?: string | undefined;
        work?: ({
            worker?: string | undefined;
            input?: string | undefined;
            signature?: string | undefined;
            work?: string | undefined;
        } & {
            worker?: string | undefined;
            input?: string | undefined;
            signature?: string | undefined;
            work?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["work"], keyof pow_work>]: never; }) | undefined;
        props?: ({
            account_creation_fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } & {
            account_creation_fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_5 in Exclude<keyof I_1["props"]["account_creation_fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } & { [K_6 in Exclude<keyof I_1["props"], keyof legacy_chain_properties>]: never; }) | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof pow>]: never; }>(object: I_1): pow;
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
