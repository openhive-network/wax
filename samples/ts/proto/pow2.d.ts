import _m0 from "protobufjs/minimal.js";
import { legacy_chain_properties } from "./legacy_chain_properties.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface pow2_input {
    worker_account: string;
    prev_block: string;
    nonce: string;
}
export interface pow2_pow {
    input: pow2_input | undefined;
    pow_summary: number;
}
export interface equihash_proof {
    n: number;
    k: number;
    seed: string;
    inputs: number[];
}
export interface equihash_pow {
    input: pow2_input | undefined;
    proof: equihash_proof | undefined;
    prev_block: string;
    pow_summary: number;
}
export interface pow2_work {
    pow2?: pow2_pow | undefined;
    equihash_pow?: equihash_pow | undefined;
}
export interface pow2 {
    work: pow2_work | undefined;
    new_owner_key: string;
    props: legacy_chain_properties | undefined;
}
export declare const pow2_input: {
    encode(message: pow2_input, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): pow2_input;
    fromJSON(object: any): pow2_input;
    toJSON(message: pow2_input): unknown;
    create<I extends {
        worker_account?: string | undefined;
        prev_block?: string | undefined;
        nonce?: string | undefined;
    } & {
        worker_account?: string | undefined;
        prev_block?: string | undefined;
        nonce?: string | undefined;
    } & { [K in Exclude<keyof I, keyof pow2_input>]: never; }>(base?: I | undefined): pow2_input;
    fromPartial<I_1 extends {
        worker_account?: string | undefined;
        prev_block?: string | undefined;
        nonce?: string | undefined;
    } & {
        worker_account?: string | undefined;
        prev_block?: string | undefined;
        nonce?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof pow2_input>]: never; }>(object: I_1): pow2_input;
};
export declare const pow2_pow: {
    encode(message: pow2_pow, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): pow2_pow;
    fromJSON(object: any): pow2_pow;
    toJSON(message: pow2_pow): unknown;
    create<I extends {
        input?: {
            worker_account?: string | undefined;
            prev_block?: string | undefined;
            nonce?: string | undefined;
        } | undefined;
        pow_summary?: number | undefined;
    } & {
        input?: ({
            worker_account?: string | undefined;
            prev_block?: string | undefined;
            nonce?: string | undefined;
        } & {
            worker_account?: string | undefined;
            prev_block?: string | undefined;
            nonce?: string | undefined;
        } & { [K in Exclude<keyof I["input"], keyof pow2_input>]: never; }) | undefined;
        pow_summary?: number | undefined;
    } & { [K_1 in Exclude<keyof I, keyof pow2_pow>]: never; }>(base?: I | undefined): pow2_pow;
    fromPartial<I_1 extends {
        input?: {
            worker_account?: string | undefined;
            prev_block?: string | undefined;
            nonce?: string | undefined;
        } | undefined;
        pow_summary?: number | undefined;
    } & {
        input?: ({
            worker_account?: string | undefined;
            prev_block?: string | undefined;
            nonce?: string | undefined;
        } & {
            worker_account?: string | undefined;
            prev_block?: string | undefined;
            nonce?: string | undefined;
        } & { [K_2 in Exclude<keyof I_1["input"], keyof pow2_input>]: never; }) | undefined;
        pow_summary?: number | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof pow2_pow>]: never; }>(object: I_1): pow2_pow;
};
export declare const equihash_proof: {
    encode(message: equihash_proof, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): equihash_proof;
    fromJSON(object: any): equihash_proof;
    toJSON(message: equihash_proof): unknown;
    create<I extends {
        n?: number | undefined;
        k?: number | undefined;
        seed?: string | undefined;
        inputs?: number[] | undefined;
    } & {
        n?: number | undefined;
        k?: number | undefined;
        seed?: string | undefined;
        inputs?: (number[] & number[] & { [K in Exclude<keyof I["inputs"], keyof number[]>]: never; }) | undefined;
    } & { [K_1 in Exclude<keyof I, keyof equihash_proof>]: never; }>(base?: I | undefined): equihash_proof;
    fromPartial<I_1 extends {
        n?: number | undefined;
        k?: number | undefined;
        seed?: string | undefined;
        inputs?: number[] | undefined;
    } & {
        n?: number | undefined;
        k?: number | undefined;
        seed?: string | undefined;
        inputs?: (number[] & number[] & { [K_2 in Exclude<keyof I_1["inputs"], keyof number[]>]: never; }) | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof equihash_proof>]: never; }>(object: I_1): equihash_proof;
};
export declare const equihash_pow: {
    encode(message: equihash_pow, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): equihash_pow;
    fromJSON(object: any): equihash_pow;
    toJSON(message: equihash_pow): unknown;
    create<I extends {
        input?: {
            worker_account?: string | undefined;
            prev_block?: string | undefined;
            nonce?: string | undefined;
        } | undefined;
        proof?: {
            n?: number | undefined;
            k?: number | undefined;
            seed?: string | undefined;
            inputs?: number[] | undefined;
        } | undefined;
        prev_block?: string | undefined;
        pow_summary?: number | undefined;
    } & {
        input?: ({
            worker_account?: string | undefined;
            prev_block?: string | undefined;
            nonce?: string | undefined;
        } & {
            worker_account?: string | undefined;
            prev_block?: string | undefined;
            nonce?: string | undefined;
        } & { [K in Exclude<keyof I["input"], keyof pow2_input>]: never; }) | undefined;
        proof?: ({
            n?: number | undefined;
            k?: number | undefined;
            seed?: string | undefined;
            inputs?: number[] | undefined;
        } & {
            n?: number | undefined;
            k?: number | undefined;
            seed?: string | undefined;
            inputs?: (number[] & number[] & { [K_1 in Exclude<keyof I["proof"]["inputs"], keyof number[]>]: never; }) | undefined;
        } & { [K_2 in Exclude<keyof I["proof"], keyof equihash_proof>]: never; }) | undefined;
        prev_block?: string | undefined;
        pow_summary?: number | undefined;
    } & { [K_3 in Exclude<keyof I, keyof equihash_pow>]: never; }>(base?: I | undefined): equihash_pow;
    fromPartial<I_1 extends {
        input?: {
            worker_account?: string | undefined;
            prev_block?: string | undefined;
            nonce?: string | undefined;
        } | undefined;
        proof?: {
            n?: number | undefined;
            k?: number | undefined;
            seed?: string | undefined;
            inputs?: number[] | undefined;
        } | undefined;
        prev_block?: string | undefined;
        pow_summary?: number | undefined;
    } & {
        input?: ({
            worker_account?: string | undefined;
            prev_block?: string | undefined;
            nonce?: string | undefined;
        } & {
            worker_account?: string | undefined;
            prev_block?: string | undefined;
            nonce?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["input"], keyof pow2_input>]: never; }) | undefined;
        proof?: ({
            n?: number | undefined;
            k?: number | undefined;
            seed?: string | undefined;
            inputs?: number[] | undefined;
        } & {
            n?: number | undefined;
            k?: number | undefined;
            seed?: string | undefined;
            inputs?: (number[] & number[] & { [K_5 in Exclude<keyof I_1["proof"]["inputs"], keyof number[]>]: never; }) | undefined;
        } & { [K_6 in Exclude<keyof I_1["proof"], keyof equihash_proof>]: never; }) | undefined;
        prev_block?: string | undefined;
        pow_summary?: number | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof equihash_pow>]: never; }>(object: I_1): equihash_pow;
};
export declare const pow2_work: {
    encode(message: pow2_work, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): pow2_work;
    fromJSON(object: any): pow2_work;
    toJSON(message: pow2_work): unknown;
    create<I extends {
        pow2?: {
            input?: {
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } | undefined;
            pow_summary?: number | undefined;
        } | undefined;
        equihash_pow?: {
            input?: {
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } | undefined;
            proof?: {
                n?: number | undefined;
                k?: number | undefined;
                seed?: string | undefined;
                inputs?: number[] | undefined;
            } | undefined;
            prev_block?: string | undefined;
            pow_summary?: number | undefined;
        } | undefined;
    } & {
        pow2?: ({
            input?: {
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } | undefined;
            pow_summary?: number | undefined;
        } & {
            input?: ({
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } & {
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } & { [K in Exclude<keyof I["pow2"]["input"], keyof pow2_input>]: never; }) | undefined;
            pow_summary?: number | undefined;
        } & { [K_1 in Exclude<keyof I["pow2"], keyof pow2_pow>]: never; }) | undefined;
        equihash_pow?: ({
            input?: {
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } | undefined;
            proof?: {
                n?: number | undefined;
                k?: number | undefined;
                seed?: string | undefined;
                inputs?: number[] | undefined;
            } | undefined;
            prev_block?: string | undefined;
            pow_summary?: number | undefined;
        } & {
            input?: ({
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } & {
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } & { [K_2 in Exclude<keyof I["equihash_pow"]["input"], keyof pow2_input>]: never; }) | undefined;
            proof?: ({
                n?: number | undefined;
                k?: number | undefined;
                seed?: string | undefined;
                inputs?: number[] | undefined;
            } & {
                n?: number | undefined;
                k?: number | undefined;
                seed?: string | undefined;
                inputs?: (number[] & number[] & { [K_3 in Exclude<keyof I["equihash_pow"]["proof"]["inputs"], keyof number[]>]: never; }) | undefined;
            } & { [K_4 in Exclude<keyof I["equihash_pow"]["proof"], keyof equihash_proof>]: never; }) | undefined;
            prev_block?: string | undefined;
            pow_summary?: number | undefined;
        } & { [K_5 in Exclude<keyof I["equihash_pow"], keyof equihash_pow>]: never; }) | undefined;
    } & { [K_6 in Exclude<keyof I, keyof pow2_work>]: never; }>(base?: I | undefined): pow2_work;
    fromPartial<I_1 extends {
        pow2?: {
            input?: {
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } | undefined;
            pow_summary?: number | undefined;
        } | undefined;
        equihash_pow?: {
            input?: {
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } | undefined;
            proof?: {
                n?: number | undefined;
                k?: number | undefined;
                seed?: string | undefined;
                inputs?: number[] | undefined;
            } | undefined;
            prev_block?: string | undefined;
            pow_summary?: number | undefined;
        } | undefined;
    } & {
        pow2?: ({
            input?: {
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } | undefined;
            pow_summary?: number | undefined;
        } & {
            input?: ({
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } & {
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } & { [K_7 in Exclude<keyof I_1["pow2"]["input"], keyof pow2_input>]: never; }) | undefined;
            pow_summary?: number | undefined;
        } & { [K_8 in Exclude<keyof I_1["pow2"], keyof pow2_pow>]: never; }) | undefined;
        equihash_pow?: ({
            input?: {
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } | undefined;
            proof?: {
                n?: number | undefined;
                k?: number | undefined;
                seed?: string | undefined;
                inputs?: number[] | undefined;
            } | undefined;
            prev_block?: string | undefined;
            pow_summary?: number | undefined;
        } & {
            input?: ({
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } & {
                worker_account?: string | undefined;
                prev_block?: string | undefined;
                nonce?: string | undefined;
            } & { [K_9 in Exclude<keyof I_1["equihash_pow"]["input"], keyof pow2_input>]: never; }) | undefined;
            proof?: ({
                n?: number | undefined;
                k?: number | undefined;
                seed?: string | undefined;
                inputs?: number[] | undefined;
            } & {
                n?: number | undefined;
                k?: number | undefined;
                seed?: string | undefined;
                inputs?: (number[] & number[] & { [K_10 in Exclude<keyof I_1["equihash_pow"]["proof"]["inputs"], keyof number[]>]: never; }) | undefined;
            } & { [K_11 in Exclude<keyof I_1["equihash_pow"]["proof"], keyof equihash_proof>]: never; }) | undefined;
            prev_block?: string | undefined;
            pow_summary?: number | undefined;
        } & { [K_12 in Exclude<keyof I_1["equihash_pow"], keyof equihash_pow>]: never; }) | undefined;
    } & { [K_13 in Exclude<keyof I_1, keyof pow2_work>]: never; }>(object: I_1): pow2_work;
};
export declare const pow2: {
    encode(message: pow2, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): pow2;
    fromJSON(object: any): pow2;
    toJSON(message: pow2): unknown;
    create<I extends {
        work?: {
            pow2?: {
                input?: {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } | undefined;
                pow_summary?: number | undefined;
            } | undefined;
            equihash_pow?: {
                input?: {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } | undefined;
                proof?: {
                    n?: number | undefined;
                    k?: number | undefined;
                    seed?: string | undefined;
                    inputs?: number[] | undefined;
                } | undefined;
                prev_block?: string | undefined;
                pow_summary?: number | undefined;
            } | undefined;
        } | undefined;
        new_owner_key?: string | undefined;
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
        work?: ({
            pow2?: {
                input?: {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } | undefined;
                pow_summary?: number | undefined;
            } | undefined;
            equihash_pow?: {
                input?: {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } | undefined;
                proof?: {
                    n?: number | undefined;
                    k?: number | undefined;
                    seed?: string | undefined;
                    inputs?: number[] | undefined;
                } | undefined;
                prev_block?: string | undefined;
                pow_summary?: number | undefined;
            } | undefined;
        } & {
            pow2?: ({
                input?: {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } | undefined;
                pow_summary?: number | undefined;
            } & {
                input?: ({
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } & {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } & { [K in Exclude<keyof I["work"]["pow2"]["input"], keyof pow2_input>]: never; }) | undefined;
                pow_summary?: number | undefined;
            } & { [K_1 in Exclude<keyof I["work"]["pow2"], keyof pow2_pow>]: never; }) | undefined;
            equihash_pow?: ({
                input?: {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } | undefined;
                proof?: {
                    n?: number | undefined;
                    k?: number | undefined;
                    seed?: string | undefined;
                    inputs?: number[] | undefined;
                } | undefined;
                prev_block?: string | undefined;
                pow_summary?: number | undefined;
            } & {
                input?: ({
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } & {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } & { [K_2 in Exclude<keyof I["work"]["equihash_pow"]["input"], keyof pow2_input>]: never; }) | undefined;
                proof?: ({
                    n?: number | undefined;
                    k?: number | undefined;
                    seed?: string | undefined;
                    inputs?: number[] | undefined;
                } & {
                    n?: number | undefined;
                    k?: number | undefined;
                    seed?: string | undefined;
                    inputs?: (number[] & number[] & { [K_3 in Exclude<keyof I["work"]["equihash_pow"]["proof"]["inputs"], keyof number[]>]: never; }) | undefined;
                } & { [K_4 in Exclude<keyof I["work"]["equihash_pow"]["proof"], keyof equihash_proof>]: never; }) | undefined;
                prev_block?: string | undefined;
                pow_summary?: number | undefined;
            } & { [K_5 in Exclude<keyof I["work"]["equihash_pow"], keyof equihash_pow>]: never; }) | undefined;
        } & { [K_6 in Exclude<keyof I["work"], keyof pow2_work>]: never; }) | undefined;
        new_owner_key?: string | undefined;
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
            } & { [K_7 in Exclude<keyof I["props"]["account_creation_fee"], keyof import("./asset").asset>]: never; }) | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } & { [K_8 in Exclude<keyof I["props"], keyof legacy_chain_properties>]: never; }) | undefined;
    } & { [K_9 in Exclude<keyof I, keyof pow2>]: never; }>(base?: I | undefined): pow2;
    fromPartial<I_1 extends {
        work?: {
            pow2?: {
                input?: {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } | undefined;
                pow_summary?: number | undefined;
            } | undefined;
            equihash_pow?: {
                input?: {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } | undefined;
                proof?: {
                    n?: number | undefined;
                    k?: number | undefined;
                    seed?: string | undefined;
                    inputs?: number[] | undefined;
                } | undefined;
                prev_block?: string | undefined;
                pow_summary?: number | undefined;
            } | undefined;
        } | undefined;
        new_owner_key?: string | undefined;
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
        work?: ({
            pow2?: {
                input?: {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } | undefined;
                pow_summary?: number | undefined;
            } | undefined;
            equihash_pow?: {
                input?: {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } | undefined;
                proof?: {
                    n?: number | undefined;
                    k?: number | undefined;
                    seed?: string | undefined;
                    inputs?: number[] | undefined;
                } | undefined;
                prev_block?: string | undefined;
                pow_summary?: number | undefined;
            } | undefined;
        } & {
            pow2?: ({
                input?: {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } | undefined;
                pow_summary?: number | undefined;
            } & {
                input?: ({
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } & {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } & { [K_10 in Exclude<keyof I_1["work"]["pow2"]["input"], keyof pow2_input>]: never; }) | undefined;
                pow_summary?: number | undefined;
            } & { [K_11 in Exclude<keyof I_1["work"]["pow2"], keyof pow2_pow>]: never; }) | undefined;
            equihash_pow?: ({
                input?: {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } | undefined;
                proof?: {
                    n?: number | undefined;
                    k?: number | undefined;
                    seed?: string | undefined;
                    inputs?: number[] | undefined;
                } | undefined;
                prev_block?: string | undefined;
                pow_summary?: number | undefined;
            } & {
                input?: ({
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } & {
                    worker_account?: string | undefined;
                    prev_block?: string | undefined;
                    nonce?: string | undefined;
                } & { [K_12 in Exclude<keyof I_1["work"]["equihash_pow"]["input"], keyof pow2_input>]: never; }) | undefined;
                proof?: ({
                    n?: number | undefined;
                    k?: number | undefined;
                    seed?: string | undefined;
                    inputs?: number[] | undefined;
                } & {
                    n?: number | undefined;
                    k?: number | undefined;
                    seed?: string | undefined;
                    inputs?: (number[] & number[] & { [K_13 in Exclude<keyof I_1["work"]["equihash_pow"]["proof"]["inputs"], keyof number[]>]: never; }) | undefined;
                } & { [K_14 in Exclude<keyof I_1["work"]["equihash_pow"]["proof"], keyof equihash_proof>]: never; }) | undefined;
                prev_block?: string | undefined;
                pow_summary?: number | undefined;
            } & { [K_15 in Exclude<keyof I_1["work"]["equihash_pow"], keyof equihash_pow>]: never; }) | undefined;
        } & { [K_16 in Exclude<keyof I_1["work"], keyof pow2_work>]: never; }) | undefined;
        new_owner_key?: string | undefined;
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
            } & { [K_17 in Exclude<keyof I_1["props"]["account_creation_fee"], keyof import("./asset").asset>]: never; }) | undefined;
            maximum_block_size?: number | undefined;
            hbd_interest_rate?: number | undefined;
        } & { [K_18 in Exclude<keyof I_1["props"], keyof legacy_chain_properties>]: never; }) | undefined;
    } & { [K_19 in Exclude<keyof I_1, keyof pow2>]: never; }>(object: I_1): pow2;
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
