import _m0 from "protobufjs/minimal.js";
import { account_create } from "./account_create.js";
import { account_update } from "./account_update.js";
import { account_witness_proxy } from "./account_witness_proxy.js";
import { account_witness_vote } from "./account_witness_vote.js";
import { comment } from "./comment.js";
import { convert } from "./convert.js";
import { custom } from "./custom.js";
import { feed_publish } from "./feed_publish.js";
import { future_extensions } from "./future_extensions.js";
import { limit_order_cancel } from "./limit_order_cancel.js";
import { limit_order_create } from "./limit_order_create.js";
import { recurrent_transfer } from "./recurrent_transfer.js";
import { transfer } from "./transfer.js";
import { transfer_to_vesting } from "./transfer_to_vesting.js";
import { vote } from "./vote.js";
import { withdraw_vesting } from "./withdraw_vesting.js";
import { witness_block_approve } from "./witness_block_approve.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * NOTE: do not change the order of any operations prior to the virtual operations
 * or it will trigger a hardfork.
 */
export interface operation {
    vote?: vote | undefined;
    comment?: comment | undefined;
    transfer?: transfer | undefined;
    transfer_to_vesting?: transfer_to_vesting | undefined;
    withdraw_vesting?: withdraw_vesting | undefined;
    limit_order_create?: limit_order_create | undefined;
    limit_order_cancel?: limit_order_cancel | undefined;
    feed_publish?: feed_publish | undefined;
    convert?: convert | undefined;
    account_create?: account_create | undefined;
    account_update?: account_update | undefined;
    account_witness_vote?: account_witness_vote | undefined;
    account_witness_proxy?: account_witness_proxy | undefined;
    custom?: custom | undefined;
    witness_block_approve?: witness_block_approve | undefined;
    recurrent_transfer?: recurrent_transfer | undefined;
}
export interface transaction {
    ref_block_num: number;
    ref_block_prefix: number;
    expiration: string;
    operations: operation[];
    extensions: future_extensions[];
}
export declare const operation: {
    encode(message: operation, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): operation;
    fromJSON(object: any): operation;
    toJSON(message: operation): unknown;
    create<I extends {
        vote?: {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } | undefined;
        comment?: {
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } | undefined;
        transfer?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
        } | undefined;
        transfer_to_vesting?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        withdraw_vesting?: {
            account?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        limit_order_create?: {
            owner?: string | undefined;
            orderid?: number | undefined;
            amount_to_sell?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            min_to_receive?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            fill_or_kill?: boolean | undefined;
            expiration?: string | undefined;
        } | undefined;
        limit_order_cancel?: {
            order?: string | undefined;
            orderid?: number | undefined;
        } | undefined;
        feed_publish?: {
            publisher?: string | undefined;
            exchange_rate?: {
                base?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                quote?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
        convert?: {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        account_create?: {
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            creator?: string | undefined;
            new_account_name?: string | undefined;
            owner?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            active?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            posting?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } | undefined;
        account_update?: {
            account?: string | undefined;
            owner?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            active?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            posting?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } | undefined;
        account_witness_vote?: {
            account?: string | undefined;
            witness?: string | undefined;
            approve?: boolean | undefined;
        } | undefined;
        account_witness_proxy?: {
            account?: string | undefined;
            proxy?: string | undefined;
        } | undefined;
        custom?: {
            required_auths?: string[] | undefined;
            id?: number | undefined;
            data?: string | undefined;
        } | undefined;
        witness_block_approve?: {
            witness?: string | undefined;
            block_id?: string | undefined;
        } | undefined;
        recurrent_transfer?: {
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
        } | undefined;
    } & {
        vote?: ({
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } & {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } & { [K in Exclude<keyof I["vote"], keyof vote>]: never; }) | undefined;
        comment?: ({
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } & {
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_1 in Exclude<keyof I["comment"], keyof comment>]: never; }) | undefined;
        transfer?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
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
            } & { [K_2 in Exclude<keyof I["transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_3 in Exclude<keyof I["transfer"], keyof transfer>]: never; }) | undefined;
        transfer_to_vesting?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
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
            } & { [K_4 in Exclude<keyof I["transfer_to_vesting"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_5 in Exclude<keyof I["transfer_to_vesting"], keyof transfer_to_vesting>]: never; }) | undefined;
        withdraw_vesting?: ({
            account?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            account?: string | undefined;
            vesting_shares?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_6 in Exclude<keyof I["withdraw_vesting"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_7 in Exclude<keyof I["withdraw_vesting"], keyof withdraw_vesting>]: never; }) | undefined;
        limit_order_create?: ({
            owner?: string | undefined;
            orderid?: number | undefined;
            amount_to_sell?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            min_to_receive?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            fill_or_kill?: boolean | undefined;
            expiration?: string | undefined;
        } & {
            owner?: string | undefined;
            orderid?: number | undefined;
            amount_to_sell?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_8 in Exclude<keyof I["limit_order_create"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
            min_to_receive?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_9 in Exclude<keyof I["limit_order_create"]["min_to_receive"], keyof import("./asset").asset>]: never; }) | undefined;
            fill_or_kill?: boolean | undefined;
            expiration?: string | undefined;
        } & { [K_10 in Exclude<keyof I["limit_order_create"], keyof limit_order_create>]: never; }) | undefined;
        limit_order_cancel?: ({
            order?: string | undefined;
            orderid?: number | undefined;
        } & {
            order?: string | undefined;
            orderid?: number | undefined;
        } & { [K_11 in Exclude<keyof I["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
        feed_publish?: ({
            publisher?: string | undefined;
            exchange_rate?: {
                base?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                quote?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
        } & {
            publisher?: string | undefined;
            exchange_rate?: ({
                base?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                quote?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } & {
                base?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_12 in Exclude<keyof I["feed_publish"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                quote?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_13 in Exclude<keyof I["feed_publish"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_14 in Exclude<keyof I["feed_publish"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
        } & { [K_15 in Exclude<keyof I["feed_publish"], keyof feed_publish>]: never; }) | undefined;
        convert?: ({
            owner?: string | undefined;
            requestid?: number | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_16 in Exclude<keyof I["convert"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_17 in Exclude<keyof I["convert"], keyof convert>]: never; }) | undefined;
        account_create?: ({
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            creator?: string | undefined;
            new_account_name?: string | undefined;
            owner?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            active?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            posting?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & {
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_18 in Exclude<keyof I["account_create"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            creator?: string | undefined;
            new_account_name?: string | undefined;
            owner?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_19 in Exclude<keyof I["account_create"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_20 in Exclude<keyof I["account_create"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_21 in Exclude<keyof I["account_create"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
            active?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_22 in Exclude<keyof I["account_create"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_23 in Exclude<keyof I["account_create"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_24 in Exclude<keyof I["account_create"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
            posting?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_25 in Exclude<keyof I["account_create"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_26 in Exclude<keyof I["account_create"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_27 in Exclude<keyof I["account_create"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_28 in Exclude<keyof I["account_create"], keyof account_create>]: never; }) | undefined;
        account_update?: ({
            account?: string | undefined;
            owner?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            active?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            posting?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & {
            account?: string | undefined;
            owner?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_29 in Exclude<keyof I["account_update"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_30 in Exclude<keyof I["account_update"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_31 in Exclude<keyof I["account_update"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
            active?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_32 in Exclude<keyof I["account_update"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_33 in Exclude<keyof I["account_update"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_34 in Exclude<keyof I["account_update"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
            posting?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_35 in Exclude<keyof I["account_update"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_36 in Exclude<keyof I["account_update"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_37 in Exclude<keyof I["account_update"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_38 in Exclude<keyof I["account_update"], keyof account_update>]: never; }) | undefined;
        account_witness_vote?: ({
            account?: string | undefined;
            witness?: string | undefined;
            approve?: boolean | undefined;
        } & {
            account?: string | undefined;
            witness?: string | undefined;
            approve?: boolean | undefined;
        } & { [K_39 in Exclude<keyof I["account_witness_vote"], keyof account_witness_vote>]: never; }) | undefined;
        account_witness_proxy?: ({
            account?: string | undefined;
            proxy?: string | undefined;
        } & {
            account?: string | undefined;
            proxy?: string | undefined;
        } & { [K_40 in Exclude<keyof I["account_witness_proxy"], keyof account_witness_proxy>]: never; }) | undefined;
        custom?: ({
            required_auths?: string[] | undefined;
            id?: number | undefined;
            data?: string | undefined;
        } & {
            required_auths?: (string[] & string[] & { [K_41 in Exclude<keyof I["custom"]["required_auths"], keyof string[]>]: never; }) | undefined;
            id?: number | undefined;
            data?: string | undefined;
        } & { [K_42 in Exclude<keyof I["custom"], keyof custom>]: never; }) | undefined;
        witness_block_approve?: ({
            witness?: string | undefined;
            block_id?: string | undefined;
        } & {
            witness?: string | undefined;
            block_id?: string | undefined;
        } & { [K_43 in Exclude<keyof I["witness_block_approve"], keyof witness_block_approve>]: never; }) | undefined;
        recurrent_transfer?: ({
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
            } & { [K_44 in Exclude<keyof I["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                void_t?: ({} & {} & { [K_45 in Exclude<keyof I["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                recurrent_transfer_pair_id?: ({
                    pair_id?: number | undefined;
                } & {
                    pair_id?: number | undefined;
                } & { [K_46 in Exclude<keyof I["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
            } & { [K_47 in Exclude<keyof I["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_48 in Exclude<keyof I["recurrent_transfer"]["extensions"], keyof {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_49 in Exclude<keyof I["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
    } & { [K_50 in Exclude<keyof I, keyof operation>]: never; }>(base?: I | undefined): operation;
    fromPartial<I_1 extends {
        vote?: {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } | undefined;
        comment?: {
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } | undefined;
        transfer?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
        } | undefined;
        transfer_to_vesting?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        withdraw_vesting?: {
            account?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        limit_order_create?: {
            owner?: string | undefined;
            orderid?: number | undefined;
            amount_to_sell?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            min_to_receive?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            fill_or_kill?: boolean | undefined;
            expiration?: string | undefined;
        } | undefined;
        limit_order_cancel?: {
            order?: string | undefined;
            orderid?: number | undefined;
        } | undefined;
        feed_publish?: {
            publisher?: string | undefined;
            exchange_rate?: {
                base?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                quote?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
        convert?: {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        account_create?: {
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            creator?: string | undefined;
            new_account_name?: string | undefined;
            owner?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            active?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            posting?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } | undefined;
        account_update?: {
            account?: string | undefined;
            owner?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            active?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            posting?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } | undefined;
        account_witness_vote?: {
            account?: string | undefined;
            witness?: string | undefined;
            approve?: boolean | undefined;
        } | undefined;
        account_witness_proxy?: {
            account?: string | undefined;
            proxy?: string | undefined;
        } | undefined;
        custom?: {
            required_auths?: string[] | undefined;
            id?: number | undefined;
            data?: string | undefined;
        } | undefined;
        witness_block_approve?: {
            witness?: string | undefined;
            block_id?: string | undefined;
        } | undefined;
        recurrent_transfer?: {
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
        } | undefined;
    } & {
        vote?: ({
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } & {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: number | undefined;
        } & { [K_51 in Exclude<keyof I_1["vote"], keyof vote>]: never; }) | undefined;
        comment?: ({
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } & {
            parent_author?: string | undefined;
            parent_permlink?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            title?: string | undefined;
            body?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_52 in Exclude<keyof I_1["comment"], keyof comment>]: never; }) | undefined;
        transfer?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
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
            } & { [K_53 in Exclude<keyof I_1["transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_54 in Exclude<keyof I_1["transfer"], keyof transfer>]: never; }) | undefined;
        transfer_to_vesting?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
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
            } & { [K_55 in Exclude<keyof I_1["transfer_to_vesting"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_56 in Exclude<keyof I_1["transfer_to_vesting"], keyof transfer_to_vesting>]: never; }) | undefined;
        withdraw_vesting?: ({
            account?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            account?: string | undefined;
            vesting_shares?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_57 in Exclude<keyof I_1["withdraw_vesting"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_58 in Exclude<keyof I_1["withdraw_vesting"], keyof withdraw_vesting>]: never; }) | undefined;
        limit_order_create?: ({
            owner?: string | undefined;
            orderid?: number | undefined;
            amount_to_sell?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            min_to_receive?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            fill_or_kill?: boolean | undefined;
            expiration?: string | undefined;
        } & {
            owner?: string | undefined;
            orderid?: number | undefined;
            amount_to_sell?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_59 in Exclude<keyof I_1["limit_order_create"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
            min_to_receive?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_60 in Exclude<keyof I_1["limit_order_create"]["min_to_receive"], keyof import("./asset").asset>]: never; }) | undefined;
            fill_or_kill?: boolean | undefined;
            expiration?: string | undefined;
        } & { [K_61 in Exclude<keyof I_1["limit_order_create"], keyof limit_order_create>]: never; }) | undefined;
        limit_order_cancel?: ({
            order?: string | undefined;
            orderid?: number | undefined;
        } & {
            order?: string | undefined;
            orderid?: number | undefined;
        } & { [K_62 in Exclude<keyof I_1["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
        feed_publish?: ({
            publisher?: string | undefined;
            exchange_rate?: {
                base?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                quote?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
        } & {
            publisher?: string | undefined;
            exchange_rate?: ({
                base?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                quote?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } & {
                base?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_63 in Exclude<keyof I_1["feed_publish"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                quote?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_64 in Exclude<keyof I_1["feed_publish"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_65 in Exclude<keyof I_1["feed_publish"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
        } & { [K_66 in Exclude<keyof I_1["feed_publish"], keyof feed_publish>]: never; }) | undefined;
        convert?: ({
            owner?: string | undefined;
            requestid?: number | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_67 in Exclude<keyof I_1["convert"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_68 in Exclude<keyof I_1["convert"], keyof convert>]: never; }) | undefined;
        account_create?: ({
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            creator?: string | undefined;
            new_account_name?: string | undefined;
            owner?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            active?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            posting?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & {
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_69 in Exclude<keyof I_1["account_create"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            creator?: string | undefined;
            new_account_name?: string | undefined;
            owner?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_70 in Exclude<keyof I_1["account_create"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_71 in Exclude<keyof I_1["account_create"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_72 in Exclude<keyof I_1["account_create"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
            active?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_73 in Exclude<keyof I_1["account_create"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_74 in Exclude<keyof I_1["account_create"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_75 in Exclude<keyof I_1["account_create"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
            posting?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_76 in Exclude<keyof I_1["account_create"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_77 in Exclude<keyof I_1["account_create"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_78 in Exclude<keyof I_1["account_create"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_79 in Exclude<keyof I_1["account_create"], keyof account_create>]: never; }) | undefined;
        account_update?: ({
            account?: string | undefined;
            owner?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            active?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            posting?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & {
            account?: string | undefined;
            owner?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_80 in Exclude<keyof I_1["account_update"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_81 in Exclude<keyof I_1["account_update"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_82 in Exclude<keyof I_1["account_update"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
            active?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_83 in Exclude<keyof I_1["account_update"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_84 in Exclude<keyof I_1["account_update"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_85 in Exclude<keyof I_1["account_update"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
            posting?: ({
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } & {
                weight_threshold?: number | undefined;
                account_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_86 in Exclude<keyof I_1["account_update"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_87 in Exclude<keyof I_1["account_update"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_88 in Exclude<keyof I_1["account_update"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_89 in Exclude<keyof I_1["account_update"], keyof account_update>]: never; }) | undefined;
        account_witness_vote?: ({
            account?: string | undefined;
            witness?: string | undefined;
            approve?: boolean | undefined;
        } & {
            account?: string | undefined;
            witness?: string | undefined;
            approve?: boolean | undefined;
        } & { [K_90 in Exclude<keyof I_1["account_witness_vote"], keyof account_witness_vote>]: never; }) | undefined;
        account_witness_proxy?: ({
            account?: string | undefined;
            proxy?: string | undefined;
        } & {
            account?: string | undefined;
            proxy?: string | undefined;
        } & { [K_91 in Exclude<keyof I_1["account_witness_proxy"], keyof account_witness_proxy>]: never; }) | undefined;
        custom?: ({
            required_auths?: string[] | undefined;
            id?: number | undefined;
            data?: string | undefined;
        } & {
            required_auths?: (string[] & string[] & { [K_92 in Exclude<keyof I_1["custom"]["required_auths"], keyof string[]>]: never; }) | undefined;
            id?: number | undefined;
            data?: string | undefined;
        } & { [K_93 in Exclude<keyof I_1["custom"], keyof custom>]: never; }) | undefined;
        witness_block_approve?: ({
            witness?: string | undefined;
            block_id?: string | undefined;
        } & {
            witness?: string | undefined;
            block_id?: string | undefined;
        } & { [K_94 in Exclude<keyof I_1["witness_block_approve"], keyof witness_block_approve>]: never; }) | undefined;
        recurrent_transfer?: ({
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
            } & { [K_95 in Exclude<keyof I_1["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                void_t?: ({} & {} & { [K_96 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                recurrent_transfer_pair_id?: ({
                    pair_id?: number | undefined;
                } & {
                    pair_id?: number | undefined;
                } & { [K_97 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
            } & { [K_98 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_99 in Exclude<keyof I_1["recurrent_transfer"]["extensions"], keyof {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_100 in Exclude<keyof I_1["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
    } & { [K_101 in Exclude<keyof I_1, keyof operation>]: never; }>(object: I_1): operation;
};
export declare const transaction: {
    encode(message: transaction, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): transaction;
    fromJSON(object: any): transaction;
    toJSON(message: transaction): unknown;
    create<I extends {
        ref_block_num?: number | undefined;
        ref_block_prefix?: number | undefined;
        expiration?: string | undefined;
        operations?: {
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_to_vesting?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            withdraw_vesting?: {
                account?: string | undefined;
                vesting_shares?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            limit_order_create?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                min_to_receive?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            feed_publish?: {
                publisher?: string | undefined;
                exchange_rate?: {
                    base?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                    quote?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
            convert?: {
                owner?: string | undefined;
                requestid?: number | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_update?: {
                account?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_witness_vote?: {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } | undefined;
            account_witness_proxy?: {
                account?: string | undefined;
                proxy?: string | undefined;
            } | undefined;
            custom?: {
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } | undefined;
            witness_block_approve?: {
                witness?: string | undefined;
                block_id?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
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
            } | undefined;
        }[] | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        ref_block_num?: number | undefined;
        ref_block_prefix?: number | undefined;
        expiration?: string | undefined;
        operations?: ({
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_to_vesting?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            withdraw_vesting?: {
                account?: string | undefined;
                vesting_shares?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            limit_order_create?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                min_to_receive?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            feed_publish?: {
                publisher?: string | undefined;
                exchange_rate?: {
                    base?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                    quote?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
            convert?: {
                owner?: string | undefined;
                requestid?: number | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_update?: {
                account?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_witness_vote?: {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } | undefined;
            account_witness_proxy?: {
                account?: string | undefined;
                proxy?: string | undefined;
            } | undefined;
            custom?: {
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } | undefined;
            witness_block_approve?: {
                witness?: string | undefined;
                block_id?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
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
            } | undefined;
        }[] & ({
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_to_vesting?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            withdraw_vesting?: {
                account?: string | undefined;
                vesting_shares?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            limit_order_create?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                min_to_receive?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            feed_publish?: {
                publisher?: string | undefined;
                exchange_rate?: {
                    base?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                    quote?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
            convert?: {
                owner?: string | undefined;
                requestid?: number | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_update?: {
                account?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_witness_vote?: {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } | undefined;
            account_witness_proxy?: {
                account?: string | undefined;
                proxy?: string | undefined;
            } | undefined;
            custom?: {
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } | undefined;
            witness_block_approve?: {
                witness?: string | undefined;
                block_id?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
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
            } | undefined;
        } & {
            vote?: ({
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } & {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } & { [K in Exclude<keyof I["operations"][number]["vote"], keyof vote>]: never; }) | undefined;
            comment?: ({
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } & {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_1 in Exclude<keyof I["operations"][number]["comment"], keyof comment>]: never; }) | undefined;
            transfer?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
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
                } & { [K_2 in Exclude<keyof I["operations"][number]["transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_3 in Exclude<keyof I["operations"][number]["transfer"], keyof transfer>]: never; }) | undefined;
            transfer_to_vesting?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
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
                } & { [K_4 in Exclude<keyof I["operations"][number]["transfer_to_vesting"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_5 in Exclude<keyof I["operations"][number]["transfer_to_vesting"], keyof transfer_to_vesting>]: never; }) | undefined;
            withdraw_vesting?: ({
                account?: string | undefined;
                vesting_shares?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } & {
                account?: string | undefined;
                vesting_shares?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_6 in Exclude<keyof I["operations"][number]["withdraw_vesting"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_7 in Exclude<keyof I["operations"][number]["withdraw_vesting"], keyof withdraw_vesting>]: never; }) | undefined;
            limit_order_create?: ({
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                min_to_receive?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } & {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_8 in Exclude<keyof I["operations"][number]["limit_order_create"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
                min_to_receive?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_9 in Exclude<keyof I["operations"][number]["limit_order_create"]["min_to_receive"], keyof import("./asset").asset>]: never; }) | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } & { [K_10 in Exclude<keyof I["operations"][number]["limit_order_create"], keyof limit_order_create>]: never; }) | undefined;
            limit_order_cancel?: ({
                order?: string | undefined;
                orderid?: number | undefined;
            } & {
                order?: string | undefined;
                orderid?: number | undefined;
            } & { [K_11 in Exclude<keyof I["operations"][number]["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
            feed_publish?: ({
                publisher?: string | undefined;
                exchange_rate?: {
                    base?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                    quote?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                publisher?: string | undefined;
                exchange_rate?: ({
                    base?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                    quote?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                } & {
                    base?: ({
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & { [K_12 in Exclude<keyof I["operations"][number]["feed_publish"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                    quote?: ({
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & { [K_13 in Exclude<keyof I["operations"][number]["feed_publish"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
                } & { [K_14 in Exclude<keyof I["operations"][number]["feed_publish"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
            } & { [K_15 in Exclude<keyof I["operations"][number]["feed_publish"], keyof feed_publish>]: never; }) | undefined;
            convert?: ({
                owner?: string | undefined;
                requestid?: number | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } & {
                owner?: string | undefined;
                requestid?: number | undefined;
                amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_16 in Exclude<keyof I["operations"][number]["convert"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_17 in Exclude<keyof I["operations"][number]["convert"], keyof convert>]: never; }) | undefined;
            account_create?: ({
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & {
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_18 in Exclude<keyof I["operations"][number]["account_create"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_19 in Exclude<keyof I["operations"][number]["account_create"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_20 in Exclude<keyof I["operations"][number]["account_create"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_21 in Exclude<keyof I["operations"][number]["account_create"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
                active?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_22 in Exclude<keyof I["operations"][number]["account_create"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_23 in Exclude<keyof I["operations"][number]["account_create"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_24 in Exclude<keyof I["operations"][number]["account_create"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
                posting?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_25 in Exclude<keyof I["operations"][number]["account_create"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_26 in Exclude<keyof I["operations"][number]["account_create"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_27 in Exclude<keyof I["operations"][number]["account_create"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_28 in Exclude<keyof I["operations"][number]["account_create"], keyof account_create>]: never; }) | undefined;
            account_update?: ({
                account?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & {
                account?: string | undefined;
                owner?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_29 in Exclude<keyof I["operations"][number]["account_update"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_30 in Exclude<keyof I["operations"][number]["account_update"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_31 in Exclude<keyof I["operations"][number]["account_update"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
                active?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_32 in Exclude<keyof I["operations"][number]["account_update"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_33 in Exclude<keyof I["operations"][number]["account_update"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_34 in Exclude<keyof I["operations"][number]["account_update"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
                posting?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_35 in Exclude<keyof I["operations"][number]["account_update"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_36 in Exclude<keyof I["operations"][number]["account_update"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_37 in Exclude<keyof I["operations"][number]["account_update"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_38 in Exclude<keyof I["operations"][number]["account_update"], keyof account_update>]: never; }) | undefined;
            account_witness_vote?: ({
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } & {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } & { [K_39 in Exclude<keyof I["operations"][number]["account_witness_vote"], keyof account_witness_vote>]: never; }) | undefined;
            account_witness_proxy?: ({
                account?: string | undefined;
                proxy?: string | undefined;
            } & {
                account?: string | undefined;
                proxy?: string | undefined;
            } & { [K_40 in Exclude<keyof I["operations"][number]["account_witness_proxy"], keyof account_witness_proxy>]: never; }) | undefined;
            custom?: ({
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } & {
                required_auths?: (string[] & string[] & { [K_41 in Exclude<keyof I["operations"][number]["custom"]["required_auths"], keyof string[]>]: never; }) | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } & { [K_42 in Exclude<keyof I["operations"][number]["custom"], keyof custom>]: never; }) | undefined;
            witness_block_approve?: ({
                witness?: string | undefined;
                block_id?: string | undefined;
            } & {
                witness?: string | undefined;
                block_id?: string | undefined;
            } & { [K_43 in Exclude<keyof I["operations"][number]["witness_block_approve"], keyof witness_block_approve>]: never; }) | undefined;
            recurrent_transfer?: ({
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
                } & { [K_44 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                    void_t?: ({} & {} & { [K_45 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                    recurrent_transfer_pair_id?: ({
                        pair_id?: number | undefined;
                    } & {
                        pair_id?: number | undefined;
                    } & { [K_46 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
                } & { [K_47 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_48 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"], keyof {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_49 in Exclude<keyof I["operations"][number]["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
        } & { [K_50 in Exclude<keyof I["operations"][number], keyof operation>]: never; })[] & { [K_51 in Exclude<keyof I["operations"], keyof {
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_to_vesting?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            withdraw_vesting?: {
                account?: string | undefined;
                vesting_shares?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            limit_order_create?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                min_to_receive?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            feed_publish?: {
                publisher?: string | undefined;
                exchange_rate?: {
                    base?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                    quote?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
            convert?: {
                owner?: string | undefined;
                requestid?: number | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_update?: {
                account?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_witness_vote?: {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } | undefined;
            account_witness_proxy?: {
                account?: string | undefined;
                proxy?: string | undefined;
            } | undefined;
            custom?: {
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } | undefined;
            witness_block_approve?: {
                witness?: string | undefined;
                block_id?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
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
            } | undefined;
        }[]>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_52 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_53 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_54 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_55 in Exclude<keyof I, keyof transaction>]: never; }>(base?: I | undefined): transaction;
    fromPartial<I_1 extends {
        ref_block_num?: number | undefined;
        ref_block_prefix?: number | undefined;
        expiration?: string | undefined;
        operations?: {
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_to_vesting?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            withdraw_vesting?: {
                account?: string | undefined;
                vesting_shares?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            limit_order_create?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                min_to_receive?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            feed_publish?: {
                publisher?: string | undefined;
                exchange_rate?: {
                    base?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                    quote?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
            convert?: {
                owner?: string | undefined;
                requestid?: number | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_update?: {
                account?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_witness_vote?: {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } | undefined;
            account_witness_proxy?: {
                account?: string | undefined;
                proxy?: string | undefined;
            } | undefined;
            custom?: {
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } | undefined;
            witness_block_approve?: {
                witness?: string | undefined;
                block_id?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
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
            } | undefined;
        }[] | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
    } & {
        ref_block_num?: number | undefined;
        ref_block_prefix?: number | undefined;
        expiration?: string | undefined;
        operations?: ({
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_to_vesting?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            withdraw_vesting?: {
                account?: string | undefined;
                vesting_shares?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            limit_order_create?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                min_to_receive?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            feed_publish?: {
                publisher?: string | undefined;
                exchange_rate?: {
                    base?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                    quote?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
            convert?: {
                owner?: string | undefined;
                requestid?: number | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_update?: {
                account?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_witness_vote?: {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } | undefined;
            account_witness_proxy?: {
                account?: string | undefined;
                proxy?: string | undefined;
            } | undefined;
            custom?: {
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } | undefined;
            witness_block_approve?: {
                witness?: string | undefined;
                block_id?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
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
            } | undefined;
        }[] & ({
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_to_vesting?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            withdraw_vesting?: {
                account?: string | undefined;
                vesting_shares?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            limit_order_create?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                min_to_receive?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            feed_publish?: {
                publisher?: string | undefined;
                exchange_rate?: {
                    base?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                    quote?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
            convert?: {
                owner?: string | undefined;
                requestid?: number | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_update?: {
                account?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_witness_vote?: {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } | undefined;
            account_witness_proxy?: {
                account?: string | undefined;
                proxy?: string | undefined;
            } | undefined;
            custom?: {
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } | undefined;
            witness_block_approve?: {
                witness?: string | undefined;
                block_id?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
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
            } | undefined;
        } & {
            vote?: ({
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } & {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } & { [K_56 in Exclude<keyof I_1["operations"][number]["vote"], keyof vote>]: never; }) | undefined;
            comment?: ({
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } & {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_57 in Exclude<keyof I_1["operations"][number]["comment"], keyof comment>]: never; }) | undefined;
            transfer?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
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
                } & { [K_58 in Exclude<keyof I_1["operations"][number]["transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_59 in Exclude<keyof I_1["operations"][number]["transfer"], keyof transfer>]: never; }) | undefined;
            transfer_to_vesting?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
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
                } & { [K_60 in Exclude<keyof I_1["operations"][number]["transfer_to_vesting"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_61 in Exclude<keyof I_1["operations"][number]["transfer_to_vesting"], keyof transfer_to_vesting>]: never; }) | undefined;
            withdraw_vesting?: ({
                account?: string | undefined;
                vesting_shares?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } & {
                account?: string | undefined;
                vesting_shares?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_62 in Exclude<keyof I_1["operations"][number]["withdraw_vesting"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_63 in Exclude<keyof I_1["operations"][number]["withdraw_vesting"], keyof withdraw_vesting>]: never; }) | undefined;
            limit_order_create?: ({
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                min_to_receive?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } & {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_64 in Exclude<keyof I_1["operations"][number]["limit_order_create"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
                min_to_receive?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_65 in Exclude<keyof I_1["operations"][number]["limit_order_create"]["min_to_receive"], keyof import("./asset").asset>]: never; }) | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } & { [K_66 in Exclude<keyof I_1["operations"][number]["limit_order_create"], keyof limit_order_create>]: never; }) | undefined;
            limit_order_cancel?: ({
                order?: string | undefined;
                orderid?: number | undefined;
            } & {
                order?: string | undefined;
                orderid?: number | undefined;
            } & { [K_67 in Exclude<keyof I_1["operations"][number]["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
            feed_publish?: ({
                publisher?: string | undefined;
                exchange_rate?: {
                    base?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                    quote?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                publisher?: string | undefined;
                exchange_rate?: ({
                    base?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                    quote?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                } & {
                    base?: ({
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & { [K_68 in Exclude<keyof I_1["operations"][number]["feed_publish"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                    quote?: ({
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & { [K_69 in Exclude<keyof I_1["operations"][number]["feed_publish"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
                } & { [K_70 in Exclude<keyof I_1["operations"][number]["feed_publish"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
            } & { [K_71 in Exclude<keyof I_1["operations"][number]["feed_publish"], keyof feed_publish>]: never; }) | undefined;
            convert?: ({
                owner?: string | undefined;
                requestid?: number | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } & {
                owner?: string | undefined;
                requestid?: number | undefined;
                amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_72 in Exclude<keyof I_1["operations"][number]["convert"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_73 in Exclude<keyof I_1["operations"][number]["convert"], keyof convert>]: never; }) | undefined;
            account_create?: ({
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & {
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_74 in Exclude<keyof I_1["operations"][number]["account_create"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_75 in Exclude<keyof I_1["operations"][number]["account_create"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_76 in Exclude<keyof I_1["operations"][number]["account_create"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_77 in Exclude<keyof I_1["operations"][number]["account_create"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
                active?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_78 in Exclude<keyof I_1["operations"][number]["account_create"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_79 in Exclude<keyof I_1["operations"][number]["account_create"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_80 in Exclude<keyof I_1["operations"][number]["account_create"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
                posting?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_81 in Exclude<keyof I_1["operations"][number]["account_create"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_82 in Exclude<keyof I_1["operations"][number]["account_create"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_83 in Exclude<keyof I_1["operations"][number]["account_create"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_84 in Exclude<keyof I_1["operations"][number]["account_create"], keyof account_create>]: never; }) | undefined;
            account_update?: ({
                account?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & {
                account?: string | undefined;
                owner?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_85 in Exclude<keyof I_1["operations"][number]["account_update"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_86 in Exclude<keyof I_1["operations"][number]["account_update"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_87 in Exclude<keyof I_1["operations"][number]["account_update"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
                active?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_88 in Exclude<keyof I_1["operations"][number]["account_update"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_89 in Exclude<keyof I_1["operations"][number]["account_update"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_90 in Exclude<keyof I_1["operations"][number]["account_update"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
                posting?: ({
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } & {
                    weight_threshold?: number | undefined;
                    account_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_91 in Exclude<keyof I_1["operations"][number]["account_update"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_92 in Exclude<keyof I_1["operations"][number]["account_update"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_93 in Exclude<keyof I_1["operations"][number]["account_update"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_94 in Exclude<keyof I_1["operations"][number]["account_update"], keyof account_update>]: never; }) | undefined;
            account_witness_vote?: ({
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } & {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } & { [K_95 in Exclude<keyof I_1["operations"][number]["account_witness_vote"], keyof account_witness_vote>]: never; }) | undefined;
            account_witness_proxy?: ({
                account?: string | undefined;
                proxy?: string | undefined;
            } & {
                account?: string | undefined;
                proxy?: string | undefined;
            } & { [K_96 in Exclude<keyof I_1["operations"][number]["account_witness_proxy"], keyof account_witness_proxy>]: never; }) | undefined;
            custom?: ({
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } & {
                required_auths?: (string[] & string[] & { [K_97 in Exclude<keyof I_1["operations"][number]["custom"]["required_auths"], keyof string[]>]: never; }) | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } & { [K_98 in Exclude<keyof I_1["operations"][number]["custom"], keyof custom>]: never; }) | undefined;
            witness_block_approve?: ({
                witness?: string | undefined;
                block_id?: string | undefined;
            } & {
                witness?: string | undefined;
                block_id?: string | undefined;
            } & { [K_99 in Exclude<keyof I_1["operations"][number]["witness_block_approve"], keyof witness_block_approve>]: never; }) | undefined;
            recurrent_transfer?: ({
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
                } & { [K_100 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                    void_t?: ({} & {} & { [K_101 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                    recurrent_transfer_pair_id?: ({
                        pair_id?: number | undefined;
                    } & {
                        pair_id?: number | undefined;
                    } & { [K_102 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
                } & { [K_103 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_104 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"], keyof {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_105 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
        } & { [K_106 in Exclude<keyof I_1["operations"][number], keyof operation>]: never; })[] & { [K_107 in Exclude<keyof I_1["operations"], keyof {
            vote?: {
                voter?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                weight?: number | undefined;
            } | undefined;
            comment?: {
                parent_author?: string | undefined;
                parent_permlink?: string | undefined;
                author?: string | undefined;
                permlink?: string | undefined;
                title?: string | undefined;
                body?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            transfer?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_to_vesting?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            withdraw_vesting?: {
                account?: string | undefined;
                vesting_shares?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            limit_order_create?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                min_to_receive?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } | undefined;
            limit_order_cancel?: {
                order?: string | undefined;
                orderid?: number | undefined;
            } | undefined;
            feed_publish?: {
                publisher?: string | undefined;
                exchange_rate?: {
                    base?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                    quote?: {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } | undefined;
                } | undefined;
            } | undefined;
            convert?: {
                owner?: string | undefined;
                requestid?: number | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            account_create?: {
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                creator?: string | undefined;
                new_account_name?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_update?: {
                account?: string | undefined;
                owner?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                active?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                posting?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } | undefined;
            account_witness_vote?: {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } | undefined;
            account_witness_proxy?: {
                account?: string | undefined;
                proxy?: string | undefined;
            } | undefined;
            custom?: {
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } | undefined;
            witness_block_approve?: {
                witness?: string | undefined;
                block_id?: string | undefined;
            } | undefined;
            recurrent_transfer?: {
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
            } | undefined;
        }[]>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_108 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_109 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_110 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_111 in Exclude<keyof I_1, keyof transaction>]: never; }>(object: I_1): transaction;
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
