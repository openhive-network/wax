import _m0 from "protobufjs/minimal.js";
import { future_extensions } from "./future_extensions.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * A user may vote for proposals directly using an operation: update_proposal_votes_operation,
 * or indirectly using the proxy - operation:  account_witness_proxy_operation.
 * A user may vote for proposals submitted by the other users.
 * By voting for the proposal, a user may select which proposals should be funded.
 * A user may vote for as many proposals as they wants, but you cannot vote twice for the same proposal.
 * If a proxy is specified then all existing votes are deactivated. When the proxy is removed, the votes will be activated.
 * Your vote power depends on your HP.
 * If the operation account_witness_vote_operation or account_witness_proxy_operation or update_proposal_votes_operation
 * is not executed in HIVE_GOVERNANCE_VOTE_EXPIRATION_PERIOD, the votes are removed and the virtual operation:
 * expired_account_notification_operation is generated.
 *
 * @param {string} voter - Account name.
 * @param {number} proposal_ids - IDs of proposals to vote for/against. Nonexisting IDs are ignored.
 * @param {bool} approve - To vote for the proposal, the approve = true.
 *                         To remove the vote, the approve = false.
 * @param {future_extensions} extensions
 */
export interface update_proposal_votes {
    voter: string;
    proposal_ids: string[];
    approve: boolean;
    extensions: future_extensions[];
}
export declare const update_proposal_votes: {
    encode(message: update_proposal_votes, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): update_proposal_votes;
    fromJSON(object: any): update_proposal_votes;
    toJSON(message: update_proposal_votes): unknown;
    create<I extends {
        voter?: string | undefined;
        proposal_ids?: string[] | undefined;
        approve?: boolean | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        voter?: string | undefined;
        proposal_ids?: (string[] & string[] & { [K in Exclude<keyof I["proposal_ids"], keyof string[]>]: never; }) | undefined;
        approve?: boolean | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_1 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_2 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_3 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_4 in Exclude<keyof I, keyof update_proposal_votes>]: never; }>(base?: I | undefined): update_proposal_votes;
    fromPartial<I_1 extends {
        voter?: string | undefined;
        proposal_ids?: string[] | undefined;
        approve?: boolean | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        voter?: string | undefined;
        proposal_ids?: (string[] & string[] & { [K_5 in Exclude<keyof I_1["proposal_ids"], keyof string[]>]: never; }) | undefined;
        approve?: boolean | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_6 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_7 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_8 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_9 in Exclude<keyof I_1, keyof update_proposal_votes>]: never; }>(object: I_1): update_proposal_votes;
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
