import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Using operation remove_proposal_operation, a user may remove proposals specified by given IDs.
 *
 * Description https://gitlab.syncad.com/hive/hive/-/blob/develop/doc/devs/operations/46_remove_proposal.md?ref_type=heads
 */
export interface remove_proposal {
    /** @param {string} proposal_owner */
    proposal_owner: string;
    /** @param {number} proposal_ids */
    proposal_ids: string[];
    /** @param {future_extensions} extensions */
    extensions: future_extensions[];
}
export declare const remove_proposal: {
    fromJSON(object: any): remove_proposal;
    toJSON(message: remove_proposal): unknown;
    create<I extends {
        proposal_owner?: string | undefined;
        proposal_ids?: string[] | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        proposal_owner?: string | undefined;
        proposal_ids?: (string[] & string[] & { [K in Exclude<keyof I["proposal_ids"], keyof string[]>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_1 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_2 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_3 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_4 in Exclude<keyof I, keyof remove_proposal>]: never; }>(base?: I | undefined): remove_proposal;
    fromPartial<I_1 extends {
        proposal_owner?: string | undefined;
        proposal_ids?: string[] | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        proposal_owner?: string | undefined;
        proposal_ids?: (string[] & string[] & { [K_5 in Exclude<keyof I_1["proposal_ids"], keyof string[]>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_6 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_7 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_8 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_9 in Exclude<keyof I_1, keyof remove_proposal>]: never; }>(object: I_1): remove_proposal;
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
