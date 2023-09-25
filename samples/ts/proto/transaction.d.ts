import _m0 from "protobufjs/minimal.js";
import { account_create } from "./account_create.js";
import { account_update } from "./account_update.js";
import { account_witness_proxy } from "./account_witness_proxy.js";
import { account_witness_vote } from "./account_witness_vote.js";
import { cancel_transfer_from_savings } from "./cancel_transfer_from_savings.js";
import { change_recovery_account } from "./change_recovery_account.js";
import { claim_account } from "./claim_account.js";
import { comment } from "./comment.js";
import { comment_options } from "./comment_options.js";
import { convert } from "./convert.js";
import { create_claimed_account } from "./create_claimed_account.js";
import { custom } from "./custom.js";
import { custom_json } from "./custom_json.js";
import { decline_voting_rights } from "./decline_voting_rights.js";
import { delete_comment } from "./delete_comment.js";
import { escrow_approve } from "./escrow_approve.js";
import { escrow_dispute } from "./escrow_dispute.js";
import { escrow_release } from "./escrow_release.js";
import { escrow_transfer } from "./escrow_transfer.js";
import { feed_publish } from "./feed_publish.js";
import { future_extensions } from "./future_extensions.js";
import { limit_order_cancel } from "./limit_order_cancel.js";
import { limit_order_create } from "./limit_order_create.js";
import { limit_order_create2 } from "./limit_order_create2.js";
import { recover_account } from "./recover_account.js";
import { recurrent_transfer } from "./recurrent_transfer.js";
import { request_account_recovery } from "./request_account_recovery.js";
import { set_withdraw_vesting_route } from "./set_withdraw_vesting_route.js";
import { transfer } from "./transfer.js";
import { transfer_from_savings } from "./transfer_from_savings.js";
import { transfer_to_savings } from "./transfer_to_savings.js";
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
    delete_comment?: delete_comment | undefined;
    custom_json?: custom_json | undefined;
    comment_options?: comment_options | undefined;
    set_withdraw_vesting_route?: set_withdraw_vesting_route | undefined;
    limit_order_create2?: limit_order_create2 | undefined;
    claim_account?: claim_account | undefined;
    create_claimed_account?: create_claimed_account | undefined;
    request_account_recovery?: request_account_recovery | undefined;
    recover_account?: recover_account | undefined;
    change_recovery_account?: change_recovery_account | undefined;
    escrow_transfer?: escrow_transfer | undefined;
    escrow_dispute?: escrow_dispute | undefined;
    escrow_release?: escrow_release | undefined;
    escrow_approve?: escrow_approve | undefined;
    transfer_to_savings?: transfer_to_savings | undefined;
    transfer_from_savings?: transfer_from_savings | undefined;
    cancel_transfer_from_savings?: cancel_transfer_from_savings | undefined;
    decline_voting_rights?: decline_voting_rights | undefined;
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
        delete_comment?: {
            author?: string | undefined;
            permlink?: string | undefined;
        } | undefined;
        custom_json?: {
            required_auths?: string[] | undefined;
            required_posting_auths?: string[] | undefined;
            id?: string | undefined;
            json?: string | undefined;
        } | undefined;
        comment_options?: {
            author?: string | undefined;
            permlink?: string | undefined;
            max_accepted_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            percent_hbd?: number | undefined;
            allow_votes?: boolean | undefined;
            allow_curation_rewards?: boolean | undefined;
            extensions?: {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            }[] | undefined;
        } | undefined;
        set_withdraw_vesting_route?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            percent?: number | undefined;
            auto_vest?: boolean | undefined;
        } | undefined;
        limit_order_create2?: {
            owner?: string | undefined;
            orderid?: number | undefined;
            amount_to_sell?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            fill_or_kill?: boolean | undefined;
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
            expiration?: string | undefined;
        } | undefined;
        claim_account?: {
            creator?: string | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        create_claimed_account?: {
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
            extensions?: {
                void_t?: {} | undefined;
            } | undefined;
        } | undefined;
        request_account_recovery?: {
            recovery_account?: string | undefined;
            account_to_recover?: string | undefined;
            new_owner_authority?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        recover_account?: {
            account_to_recover?: string | undefined;
            new_owner_authority?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            recent_owner_authority?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        change_recovery_account?: {
            account_to_recover?: string | undefined;
            new_recovery_account?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        escrow_transfer?: {
            from_account?: string | undefined;
            to?: string | undefined;
            agent?: string | undefined;
            escrow_id?: number | undefined;
            hbd_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            ratification_deadline?: string | undefined;
            escrow_expiration?: string | undefined;
            json_meta?: string | undefined;
        } | undefined;
        escrow_dispute?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            escrow_id?: number | undefined;
        } | undefined;
        escrow_release?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            receiver?: string | undefined;
            escrow_id?: number | undefined;
            hbd_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        escrow_approve?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            escrow_id?: number | undefined;
            approve?: boolean | undefined;
        } | undefined;
        transfer_to_savings?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
        } | undefined;
        transfer_from_savings?: {
            from_account?: string | undefined;
            request_id?: number | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
        } | undefined;
        cancel_transfer_from_savings?: {
            from_account?: string | undefined;
            request_id?: number | undefined;
        } | undefined;
        decline_voting_rights?: {
            account?: string | undefined;
            decline?: boolean | undefined;
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
        delete_comment?: ({
            author?: string | undefined;
            permlink?: string | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
        } & { [K_44 in Exclude<keyof I["delete_comment"], keyof delete_comment>]: never; }) | undefined;
        custom_json?: ({
            required_auths?: string[] | undefined;
            required_posting_auths?: string[] | undefined;
            id?: string | undefined;
            json?: string | undefined;
        } & {
            required_auths?: (string[] & string[] & { [K_45 in Exclude<keyof I["custom_json"]["required_auths"], keyof string[]>]: never; }) | undefined;
            required_posting_auths?: (string[] & string[] & { [K_46 in Exclude<keyof I["custom_json"]["required_posting_auths"], keyof string[]>]: never; }) | undefined;
            id?: string | undefined;
            json?: string | undefined;
        } & { [K_47 in Exclude<keyof I["custom_json"], keyof custom_json>]: never; }) | undefined;
        comment_options?: ({
            author?: string | undefined;
            permlink?: string | undefined;
            max_accepted_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            percent_hbd?: number | undefined;
            allow_votes?: boolean | undefined;
            allow_curation_rewards?: boolean | undefined;
            extensions?: {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            }[] | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
            max_accepted_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_48 in Exclude<keyof I["comment_options"]["max_accepted_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            percent_hbd?: number | undefined;
            allow_votes?: boolean | undefined;
            allow_curation_rewards?: boolean | undefined;
            extensions?: ({
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            }[] & ({
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } & {
                beneficiaries?: ({
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] & ({
                    account?: string | undefined;
                    weight?: number | undefined;
                } & {
                    account?: string | undefined;
                    weight?: number | undefined;
                } & { [K_49 in Exclude<keyof I["comment_options"]["extensions"][number]["beneficiaries"][number], keyof import("./comment_options").beneficiary_route_type>]: never; })[] & { [K_50 in Exclude<keyof I["comment_options"]["extensions"][number]["beneficiaries"], keyof {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_51 in Exclude<keyof I["comment_options"]["extensions"][number], "beneficiaries">]: never; })[] & { [K_52 in Exclude<keyof I["comment_options"]["extensions"], keyof {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_53 in Exclude<keyof I["comment_options"], keyof comment_options>]: never; }) | undefined;
        set_withdraw_vesting_route?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            percent?: number | undefined;
            auto_vest?: boolean | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            percent?: number | undefined;
            auto_vest?: boolean | undefined;
        } & { [K_54 in Exclude<keyof I["set_withdraw_vesting_route"], keyof set_withdraw_vesting_route>]: never; }) | undefined;
        limit_order_create2?: ({
            owner?: string | undefined;
            orderid?: number | undefined;
            amount_to_sell?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            fill_or_kill?: boolean | undefined;
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
            } & { [K_55 in Exclude<keyof I["limit_order_create2"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
            fill_or_kill?: boolean | undefined;
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
                } & { [K_56 in Exclude<keyof I["limit_order_create2"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                quote?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_57 in Exclude<keyof I["limit_order_create2"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_58 in Exclude<keyof I["limit_order_create2"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
            expiration?: string | undefined;
        } & { [K_59 in Exclude<keyof I["limit_order_create2"], keyof limit_order_create2>]: never; }) | undefined;
        claim_account?: ({
            creator?: string | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            creator?: string | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_60 in Exclude<keyof I["claim_account"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_61 in Exclude<keyof I["claim_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_62 in Exclude<keyof I["claim_account"]["extensions"][number], "void_t">]: never; })[] & { [K_63 in Exclude<keyof I["claim_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_64 in Exclude<keyof I["claim_account"], keyof claim_account>]: never; }) | undefined;
        create_claimed_account?: ({
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
            extensions?: {
                void_t?: {} | undefined;
            } | undefined;
        } & {
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
                } & { [K_65 in Exclude<keyof I["create_claimed_account"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_66 in Exclude<keyof I["create_claimed_account"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_67 in Exclude<keyof I["create_claimed_account"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_68 in Exclude<keyof I["create_claimed_account"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_69 in Exclude<keyof I["create_claimed_account"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_70 in Exclude<keyof I["create_claimed_account"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_71 in Exclude<keyof I["create_claimed_account"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_72 in Exclude<keyof I["create_claimed_account"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_73 in Exclude<keyof I["create_claimed_account"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_74 in Exclude<keyof I["create_claimed_account"]["extensions"]["void_t"], never>]: never; }) | undefined;
            } & { [K_75 in Exclude<keyof I["create_claimed_account"]["extensions"], "void_t">]: never; }) | undefined;
        } & { [K_76 in Exclude<keyof I["create_claimed_account"], keyof create_claimed_account>]: never; }) | undefined;
        request_account_recovery?: ({
            recovery_account?: string | undefined;
            account_to_recover?: string | undefined;
            new_owner_authority?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            recovery_account?: string | undefined;
            account_to_recover?: string | undefined;
            new_owner_authority?: ({
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
                } & { [K_77 in Exclude<keyof I["request_account_recovery"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_78 in Exclude<keyof I["request_account_recovery"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_79 in Exclude<keyof I["request_account_recovery"]["new_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_80 in Exclude<keyof I["request_account_recovery"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_81 in Exclude<keyof I["request_account_recovery"]["extensions"][number], "void_t">]: never; })[] & { [K_82 in Exclude<keyof I["request_account_recovery"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_83 in Exclude<keyof I["request_account_recovery"], keyof request_account_recovery>]: never; }) | undefined;
        recover_account?: ({
            account_to_recover?: string | undefined;
            new_owner_authority?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            recent_owner_authority?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            account_to_recover?: string | undefined;
            new_owner_authority?: ({
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
                } & { [K_84 in Exclude<keyof I["recover_account"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_85 in Exclude<keyof I["recover_account"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_86 in Exclude<keyof I["recover_account"]["new_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
            recent_owner_authority?: ({
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
                } & { [K_87 in Exclude<keyof I["recover_account"]["recent_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_88 in Exclude<keyof I["recover_account"]["recent_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_89 in Exclude<keyof I["recover_account"]["recent_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_90 in Exclude<keyof I["recover_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_91 in Exclude<keyof I["recover_account"]["extensions"][number], "void_t">]: never; })[] & { [K_92 in Exclude<keyof I["recover_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_93 in Exclude<keyof I["recover_account"], keyof recover_account>]: never; }) | undefined;
        change_recovery_account?: ({
            account_to_recover?: string | undefined;
            new_recovery_account?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            account_to_recover?: string | undefined;
            new_recovery_account?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_94 in Exclude<keyof I["change_recovery_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_95 in Exclude<keyof I["change_recovery_account"]["extensions"][number], "void_t">]: never; })[] & { [K_96 in Exclude<keyof I["change_recovery_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_97 in Exclude<keyof I["change_recovery_account"], keyof change_recovery_account>]: never; }) | undefined;
        escrow_transfer?: ({
            from_account?: string | undefined;
            to?: string | undefined;
            agent?: string | undefined;
            escrow_id?: number | undefined;
            hbd_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            ratification_deadline?: string | undefined;
            escrow_expiration?: string | undefined;
            json_meta?: string | undefined;
        } & {
            from_account?: string | undefined;
            to?: string | undefined;
            agent?: string | undefined;
            escrow_id?: number | undefined;
            hbd_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_98 in Exclude<keyof I["escrow_transfer"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_99 in Exclude<keyof I["escrow_transfer"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_100 in Exclude<keyof I["escrow_transfer"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            ratification_deadline?: string | undefined;
            escrow_expiration?: string | undefined;
            json_meta?: string | undefined;
        } & { [K_101 in Exclude<keyof I["escrow_transfer"], keyof escrow_transfer>]: never; }) | undefined;
        escrow_dispute?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            escrow_id?: number | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            escrow_id?: number | undefined;
        } & { [K_102 in Exclude<keyof I["escrow_dispute"], keyof escrow_dispute>]: never; }) | undefined;
        escrow_release?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            receiver?: string | undefined;
            escrow_id?: number | undefined;
            hbd_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            receiver?: string | undefined;
            escrow_id?: number | undefined;
            hbd_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_103 in Exclude<keyof I["escrow_release"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_104 in Exclude<keyof I["escrow_release"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_105 in Exclude<keyof I["escrow_release"], keyof escrow_release>]: never; }) | undefined;
        escrow_approve?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            escrow_id?: number | undefined;
            approve?: boolean | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            escrow_id?: number | undefined;
            approve?: boolean | undefined;
        } & { [K_106 in Exclude<keyof I["escrow_approve"], keyof escrow_approve>]: never; }) | undefined;
        transfer_to_savings?: ({
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
            } & { [K_107 in Exclude<keyof I["transfer_to_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_108 in Exclude<keyof I["transfer_to_savings"], keyof transfer_to_savings>]: never; }) | undefined;
        transfer_from_savings?: ({
            from_account?: string | undefined;
            request_id?: number | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
        } & {
            from_account?: string | undefined;
            request_id?: number | undefined;
            to_account?: string | undefined;
            amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_109 in Exclude<keyof I["transfer_from_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_110 in Exclude<keyof I["transfer_from_savings"], keyof transfer_from_savings>]: never; }) | undefined;
        cancel_transfer_from_savings?: ({
            from_account?: string | undefined;
            request_id?: number | undefined;
        } & {
            from_account?: string | undefined;
            request_id?: number | undefined;
        } & { [K_111 in Exclude<keyof I["cancel_transfer_from_savings"], keyof cancel_transfer_from_savings>]: never; }) | undefined;
        decline_voting_rights?: ({
            account?: string | undefined;
            decline?: boolean | undefined;
        } & {
            account?: string | undefined;
            decline?: boolean | undefined;
        } & { [K_112 in Exclude<keyof I["decline_voting_rights"], keyof decline_voting_rights>]: never; }) | undefined;
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
            } & { [K_113 in Exclude<keyof I["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                void_t?: ({} & {} & { [K_114 in Exclude<keyof I["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                recurrent_transfer_pair_id?: ({
                    pair_id?: number | undefined;
                } & {
                    pair_id?: number | undefined;
                } & { [K_115 in Exclude<keyof I["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
            } & { [K_116 in Exclude<keyof I["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_117 in Exclude<keyof I["recurrent_transfer"]["extensions"], keyof {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_118 in Exclude<keyof I["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
    } & { [K_119 in Exclude<keyof I, keyof operation>]: never; }>(base?: I | undefined): operation;
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
        delete_comment?: {
            author?: string | undefined;
            permlink?: string | undefined;
        } | undefined;
        custom_json?: {
            required_auths?: string[] | undefined;
            required_posting_auths?: string[] | undefined;
            id?: string | undefined;
            json?: string | undefined;
        } | undefined;
        comment_options?: {
            author?: string | undefined;
            permlink?: string | undefined;
            max_accepted_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            percent_hbd?: number | undefined;
            allow_votes?: boolean | undefined;
            allow_curation_rewards?: boolean | undefined;
            extensions?: {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            }[] | undefined;
        } | undefined;
        set_withdraw_vesting_route?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            percent?: number | undefined;
            auto_vest?: boolean | undefined;
        } | undefined;
        limit_order_create2?: {
            owner?: string | undefined;
            orderid?: number | undefined;
            amount_to_sell?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            fill_or_kill?: boolean | undefined;
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
            expiration?: string | undefined;
        } | undefined;
        claim_account?: {
            creator?: string | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        create_claimed_account?: {
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
            extensions?: {
                void_t?: {} | undefined;
            } | undefined;
        } | undefined;
        request_account_recovery?: {
            recovery_account?: string | undefined;
            account_to_recover?: string | undefined;
            new_owner_authority?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        recover_account?: {
            account_to_recover?: string | undefined;
            new_owner_authority?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            recent_owner_authority?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        change_recovery_account?: {
            account_to_recover?: string | undefined;
            new_recovery_account?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        escrow_transfer?: {
            from_account?: string | undefined;
            to?: string | undefined;
            agent?: string | undefined;
            escrow_id?: number | undefined;
            hbd_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            ratification_deadline?: string | undefined;
            escrow_expiration?: string | undefined;
            json_meta?: string | undefined;
        } | undefined;
        escrow_dispute?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            escrow_id?: number | undefined;
        } | undefined;
        escrow_release?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            receiver?: string | undefined;
            escrow_id?: number | undefined;
            hbd_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        escrow_approve?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            escrow_id?: number | undefined;
            approve?: boolean | undefined;
        } | undefined;
        transfer_to_savings?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
        } | undefined;
        transfer_from_savings?: {
            from_account?: string | undefined;
            request_id?: number | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
        } | undefined;
        cancel_transfer_from_savings?: {
            from_account?: string | undefined;
            request_id?: number | undefined;
        } | undefined;
        decline_voting_rights?: {
            account?: string | undefined;
            decline?: boolean | undefined;
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
        } & { [K_120 in Exclude<keyof I_1["vote"], keyof vote>]: never; }) | undefined;
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
        } & { [K_121 in Exclude<keyof I_1["comment"], keyof comment>]: never; }) | undefined;
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
            } & { [K_122 in Exclude<keyof I_1["transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_123 in Exclude<keyof I_1["transfer"], keyof transfer>]: never; }) | undefined;
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
            } & { [K_124 in Exclude<keyof I_1["transfer_to_vesting"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_125 in Exclude<keyof I_1["transfer_to_vesting"], keyof transfer_to_vesting>]: never; }) | undefined;
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
            } & { [K_126 in Exclude<keyof I_1["withdraw_vesting"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_127 in Exclude<keyof I_1["withdraw_vesting"], keyof withdraw_vesting>]: never; }) | undefined;
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
            } & { [K_128 in Exclude<keyof I_1["limit_order_create"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
            min_to_receive?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_129 in Exclude<keyof I_1["limit_order_create"]["min_to_receive"], keyof import("./asset").asset>]: never; }) | undefined;
            fill_or_kill?: boolean | undefined;
            expiration?: string | undefined;
        } & { [K_130 in Exclude<keyof I_1["limit_order_create"], keyof limit_order_create>]: never; }) | undefined;
        limit_order_cancel?: ({
            order?: string | undefined;
            orderid?: number | undefined;
        } & {
            order?: string | undefined;
            orderid?: number | undefined;
        } & { [K_131 in Exclude<keyof I_1["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
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
                } & { [K_132 in Exclude<keyof I_1["feed_publish"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                quote?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_133 in Exclude<keyof I_1["feed_publish"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_134 in Exclude<keyof I_1["feed_publish"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
        } & { [K_135 in Exclude<keyof I_1["feed_publish"], keyof feed_publish>]: never; }) | undefined;
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
            } & { [K_136 in Exclude<keyof I_1["convert"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_137 in Exclude<keyof I_1["convert"], keyof convert>]: never; }) | undefined;
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
            } & { [K_138 in Exclude<keyof I_1["account_create"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
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
                } & { [K_139 in Exclude<keyof I_1["account_create"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_140 in Exclude<keyof I_1["account_create"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_141 in Exclude<keyof I_1["account_create"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_142 in Exclude<keyof I_1["account_create"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_143 in Exclude<keyof I_1["account_create"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_144 in Exclude<keyof I_1["account_create"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_145 in Exclude<keyof I_1["account_create"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_146 in Exclude<keyof I_1["account_create"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_147 in Exclude<keyof I_1["account_create"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_148 in Exclude<keyof I_1["account_create"], keyof account_create>]: never; }) | undefined;
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
                } & { [K_149 in Exclude<keyof I_1["account_update"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_150 in Exclude<keyof I_1["account_update"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_151 in Exclude<keyof I_1["account_update"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_152 in Exclude<keyof I_1["account_update"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_153 in Exclude<keyof I_1["account_update"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_154 in Exclude<keyof I_1["account_update"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_155 in Exclude<keyof I_1["account_update"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_156 in Exclude<keyof I_1["account_update"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_157 in Exclude<keyof I_1["account_update"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_158 in Exclude<keyof I_1["account_update"], keyof account_update>]: never; }) | undefined;
        account_witness_vote?: ({
            account?: string | undefined;
            witness?: string | undefined;
            approve?: boolean | undefined;
        } & {
            account?: string | undefined;
            witness?: string | undefined;
            approve?: boolean | undefined;
        } & { [K_159 in Exclude<keyof I_1["account_witness_vote"], keyof account_witness_vote>]: never; }) | undefined;
        account_witness_proxy?: ({
            account?: string | undefined;
            proxy?: string | undefined;
        } & {
            account?: string | undefined;
            proxy?: string | undefined;
        } & { [K_160 in Exclude<keyof I_1["account_witness_proxy"], keyof account_witness_proxy>]: never; }) | undefined;
        custom?: ({
            required_auths?: string[] | undefined;
            id?: number | undefined;
            data?: string | undefined;
        } & {
            required_auths?: (string[] & string[] & { [K_161 in Exclude<keyof I_1["custom"]["required_auths"], keyof string[]>]: never; }) | undefined;
            id?: number | undefined;
            data?: string | undefined;
        } & { [K_162 in Exclude<keyof I_1["custom"], keyof custom>]: never; }) | undefined;
        witness_block_approve?: ({
            witness?: string | undefined;
            block_id?: string | undefined;
        } & {
            witness?: string | undefined;
            block_id?: string | undefined;
        } & { [K_163 in Exclude<keyof I_1["witness_block_approve"], keyof witness_block_approve>]: never; }) | undefined;
        delete_comment?: ({
            author?: string | undefined;
            permlink?: string | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
        } & { [K_164 in Exclude<keyof I_1["delete_comment"], keyof delete_comment>]: never; }) | undefined;
        custom_json?: ({
            required_auths?: string[] | undefined;
            required_posting_auths?: string[] | undefined;
            id?: string | undefined;
            json?: string | undefined;
        } & {
            required_auths?: (string[] & string[] & { [K_165 in Exclude<keyof I_1["custom_json"]["required_auths"], keyof string[]>]: never; }) | undefined;
            required_posting_auths?: (string[] & string[] & { [K_166 in Exclude<keyof I_1["custom_json"]["required_posting_auths"], keyof string[]>]: never; }) | undefined;
            id?: string | undefined;
            json?: string | undefined;
        } & { [K_167 in Exclude<keyof I_1["custom_json"], keyof custom_json>]: never; }) | undefined;
        comment_options?: ({
            author?: string | undefined;
            permlink?: string | undefined;
            max_accepted_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            percent_hbd?: number | undefined;
            allow_votes?: boolean | undefined;
            allow_curation_rewards?: boolean | undefined;
            extensions?: {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            }[] | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
            max_accepted_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_168 in Exclude<keyof I_1["comment_options"]["max_accepted_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            percent_hbd?: number | undefined;
            allow_votes?: boolean | undefined;
            allow_curation_rewards?: boolean | undefined;
            extensions?: ({
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            }[] & ({
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } & {
                beneficiaries?: ({
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] & ({
                    account?: string | undefined;
                    weight?: number | undefined;
                } & {
                    account?: string | undefined;
                    weight?: number | undefined;
                } & { [K_169 in Exclude<keyof I_1["comment_options"]["extensions"][number]["beneficiaries"][number], keyof import("./comment_options").beneficiary_route_type>]: never; })[] & { [K_170 in Exclude<keyof I_1["comment_options"]["extensions"][number]["beneficiaries"], keyof {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_171 in Exclude<keyof I_1["comment_options"]["extensions"][number], "beneficiaries">]: never; })[] & { [K_172 in Exclude<keyof I_1["comment_options"]["extensions"], keyof {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_173 in Exclude<keyof I_1["comment_options"], keyof comment_options>]: never; }) | undefined;
        set_withdraw_vesting_route?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            percent?: number | undefined;
            auto_vest?: boolean | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            percent?: number | undefined;
            auto_vest?: boolean | undefined;
        } & { [K_174 in Exclude<keyof I_1["set_withdraw_vesting_route"], keyof set_withdraw_vesting_route>]: never; }) | undefined;
        limit_order_create2?: ({
            owner?: string | undefined;
            orderid?: number | undefined;
            amount_to_sell?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            fill_or_kill?: boolean | undefined;
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
            } & { [K_175 in Exclude<keyof I_1["limit_order_create2"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
            fill_or_kill?: boolean | undefined;
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
                } & { [K_176 in Exclude<keyof I_1["limit_order_create2"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                quote?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_177 in Exclude<keyof I_1["limit_order_create2"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_178 in Exclude<keyof I_1["limit_order_create2"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
            expiration?: string | undefined;
        } & { [K_179 in Exclude<keyof I_1["limit_order_create2"], keyof limit_order_create2>]: never; }) | undefined;
        claim_account?: ({
            creator?: string | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            creator?: string | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_180 in Exclude<keyof I_1["claim_account"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_181 in Exclude<keyof I_1["claim_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_182 in Exclude<keyof I_1["claim_account"]["extensions"][number], "void_t">]: never; })[] & { [K_183 in Exclude<keyof I_1["claim_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_184 in Exclude<keyof I_1["claim_account"], keyof claim_account>]: never; }) | undefined;
        create_claimed_account?: ({
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
            extensions?: {
                void_t?: {} | undefined;
            } | undefined;
        } & {
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
                } & { [K_185 in Exclude<keyof I_1["create_claimed_account"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_186 in Exclude<keyof I_1["create_claimed_account"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_187 in Exclude<keyof I_1["create_claimed_account"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_188 in Exclude<keyof I_1["create_claimed_account"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_189 in Exclude<keyof I_1["create_claimed_account"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_190 in Exclude<keyof I_1["create_claimed_account"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_191 in Exclude<keyof I_1["create_claimed_account"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_192 in Exclude<keyof I_1["create_claimed_account"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_193 in Exclude<keyof I_1["create_claimed_account"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_194 in Exclude<keyof I_1["create_claimed_account"]["extensions"]["void_t"], never>]: never; }) | undefined;
            } & { [K_195 in Exclude<keyof I_1["create_claimed_account"]["extensions"], "void_t">]: never; }) | undefined;
        } & { [K_196 in Exclude<keyof I_1["create_claimed_account"], keyof create_claimed_account>]: never; }) | undefined;
        request_account_recovery?: ({
            recovery_account?: string | undefined;
            account_to_recover?: string | undefined;
            new_owner_authority?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            recovery_account?: string | undefined;
            account_to_recover?: string | undefined;
            new_owner_authority?: ({
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
                } & { [K_197 in Exclude<keyof I_1["request_account_recovery"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_198 in Exclude<keyof I_1["request_account_recovery"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_199 in Exclude<keyof I_1["request_account_recovery"]["new_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_200 in Exclude<keyof I_1["request_account_recovery"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_201 in Exclude<keyof I_1["request_account_recovery"]["extensions"][number], "void_t">]: never; })[] & { [K_202 in Exclude<keyof I_1["request_account_recovery"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_203 in Exclude<keyof I_1["request_account_recovery"], keyof request_account_recovery>]: never; }) | undefined;
        recover_account?: ({
            account_to_recover?: string | undefined;
            new_owner_authority?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            recent_owner_authority?: {
                weight_threshold?: number | undefined;
                account_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
                key_auths?: {
                    [x: string]: number | undefined;
                } | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            account_to_recover?: string | undefined;
            new_owner_authority?: ({
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
                } & { [K_204 in Exclude<keyof I_1["recover_account"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_205 in Exclude<keyof I_1["recover_account"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_206 in Exclude<keyof I_1["recover_account"]["new_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
            recent_owner_authority?: ({
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
                } & { [K_207 in Exclude<keyof I_1["recover_account"]["recent_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_208 in Exclude<keyof I_1["recover_account"]["recent_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_209 in Exclude<keyof I_1["recover_account"]["recent_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_210 in Exclude<keyof I_1["recover_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_211 in Exclude<keyof I_1["recover_account"]["extensions"][number], "void_t">]: never; })[] & { [K_212 in Exclude<keyof I_1["recover_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_213 in Exclude<keyof I_1["recover_account"], keyof recover_account>]: never; }) | undefined;
        change_recovery_account?: ({
            account_to_recover?: string | undefined;
            new_recovery_account?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            account_to_recover?: string | undefined;
            new_recovery_account?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_214 in Exclude<keyof I_1["change_recovery_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_215 in Exclude<keyof I_1["change_recovery_account"]["extensions"][number], "void_t">]: never; })[] & { [K_216 in Exclude<keyof I_1["change_recovery_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_217 in Exclude<keyof I_1["change_recovery_account"], keyof change_recovery_account>]: never; }) | undefined;
        escrow_transfer?: ({
            from_account?: string | undefined;
            to?: string | undefined;
            agent?: string | undefined;
            escrow_id?: number | undefined;
            hbd_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            ratification_deadline?: string | undefined;
            escrow_expiration?: string | undefined;
            json_meta?: string | undefined;
        } & {
            from_account?: string | undefined;
            to?: string | undefined;
            agent?: string | undefined;
            escrow_id?: number | undefined;
            hbd_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_218 in Exclude<keyof I_1["escrow_transfer"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_219 in Exclude<keyof I_1["escrow_transfer"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_220 in Exclude<keyof I_1["escrow_transfer"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            ratification_deadline?: string | undefined;
            escrow_expiration?: string | undefined;
            json_meta?: string | undefined;
        } & { [K_221 in Exclude<keyof I_1["escrow_transfer"], keyof escrow_transfer>]: never; }) | undefined;
        escrow_dispute?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            escrow_id?: number | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            escrow_id?: number | undefined;
        } & { [K_222 in Exclude<keyof I_1["escrow_dispute"], keyof escrow_dispute>]: never; }) | undefined;
        escrow_release?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            receiver?: string | undefined;
            escrow_id?: number | undefined;
            hbd_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            receiver?: string | undefined;
            escrow_id?: number | undefined;
            hbd_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_223 in Exclude<keyof I_1["escrow_release"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_224 in Exclude<keyof I_1["escrow_release"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_225 in Exclude<keyof I_1["escrow_release"], keyof escrow_release>]: never; }) | undefined;
        escrow_approve?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            escrow_id?: number | undefined;
            approve?: boolean | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            who?: string | undefined;
            escrow_id?: number | undefined;
            approve?: boolean | undefined;
        } & { [K_226 in Exclude<keyof I_1["escrow_approve"], keyof escrow_approve>]: never; }) | undefined;
        transfer_to_savings?: ({
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
            } & { [K_227 in Exclude<keyof I_1["transfer_to_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_228 in Exclude<keyof I_1["transfer_to_savings"], keyof transfer_to_savings>]: never; }) | undefined;
        transfer_from_savings?: ({
            from_account?: string | undefined;
            request_id?: number | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
        } & {
            from_account?: string | undefined;
            request_id?: number | undefined;
            to_account?: string | undefined;
            amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_229 in Exclude<keyof I_1["transfer_from_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_230 in Exclude<keyof I_1["transfer_from_savings"], keyof transfer_from_savings>]: never; }) | undefined;
        cancel_transfer_from_savings?: ({
            from_account?: string | undefined;
            request_id?: number | undefined;
        } & {
            from_account?: string | undefined;
            request_id?: number | undefined;
        } & { [K_231 in Exclude<keyof I_1["cancel_transfer_from_savings"], keyof cancel_transfer_from_savings>]: never; }) | undefined;
        decline_voting_rights?: ({
            account?: string | undefined;
            decline?: boolean | undefined;
        } & {
            account?: string | undefined;
            decline?: boolean | undefined;
        } & { [K_232 in Exclude<keyof I_1["decline_voting_rights"], keyof decline_voting_rights>]: never; }) | undefined;
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
            } & { [K_233 in Exclude<keyof I_1["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                void_t?: ({} & {} & { [K_234 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                recurrent_transfer_pair_id?: ({
                    pair_id?: number | undefined;
                } & {
                    pair_id?: number | undefined;
                } & { [K_235 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
            } & { [K_236 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_237 in Exclude<keyof I_1["recurrent_transfer"]["extensions"], keyof {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_238 in Exclude<keyof I_1["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
    } & { [K_239 in Exclude<keyof I_1, keyof operation>]: never; }>(object: I_1): operation;
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
            delete_comment?: {
                author?: string | undefined;
                permlink?: string | undefined;
            } | undefined;
            custom_json?: {
                required_auths?: string[] | undefined;
                required_posting_auths?: string[] | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } | undefined;
            comment_options?: {
                author?: string | undefined;
                permlink?: string | undefined;
                max_accepted_payout?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: {
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
            } | undefined;
            set_withdraw_vesting_route?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                percent?: number | undefined;
                auto_vest?: boolean | undefined;
            } | undefined;
            limit_order_create2?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
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
                expiration?: string | undefined;
            } | undefined;
            claim_account?: {
                creator?: string | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            create_claimed_account?: {
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
                extensions?: {
                    void_t?: {} | undefined;
                } | undefined;
            } | undefined;
            request_account_recovery?: {
                recovery_account?: string | undefined;
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            recover_account?: {
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                recent_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            change_recovery_account?: {
                account_to_recover?: string | undefined;
                new_recovery_account?: string | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            escrow_transfer?: {
                from_account?: string | undefined;
                to?: string | undefined;
                agent?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } | undefined;
            escrow_dispute?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
            } | undefined;
            escrow_release?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                receiver?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            escrow_approve?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
                approve?: boolean | undefined;
            } | undefined;
            transfer_to_savings?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            cancel_transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
            } | undefined;
            decline_voting_rights?: {
                account?: string | undefined;
                decline?: boolean | undefined;
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
            delete_comment?: {
                author?: string | undefined;
                permlink?: string | undefined;
            } | undefined;
            custom_json?: {
                required_auths?: string[] | undefined;
                required_posting_auths?: string[] | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } | undefined;
            comment_options?: {
                author?: string | undefined;
                permlink?: string | undefined;
                max_accepted_payout?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: {
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
            } | undefined;
            set_withdraw_vesting_route?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                percent?: number | undefined;
                auto_vest?: boolean | undefined;
            } | undefined;
            limit_order_create2?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
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
                expiration?: string | undefined;
            } | undefined;
            claim_account?: {
                creator?: string | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            create_claimed_account?: {
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
                extensions?: {
                    void_t?: {} | undefined;
                } | undefined;
            } | undefined;
            request_account_recovery?: {
                recovery_account?: string | undefined;
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            recover_account?: {
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                recent_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            change_recovery_account?: {
                account_to_recover?: string | undefined;
                new_recovery_account?: string | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            escrow_transfer?: {
                from_account?: string | undefined;
                to?: string | undefined;
                agent?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } | undefined;
            escrow_dispute?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
            } | undefined;
            escrow_release?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                receiver?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            escrow_approve?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
                approve?: boolean | undefined;
            } | undefined;
            transfer_to_savings?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            cancel_transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
            } | undefined;
            decline_voting_rights?: {
                account?: string | undefined;
                decline?: boolean | undefined;
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
            delete_comment?: {
                author?: string | undefined;
                permlink?: string | undefined;
            } | undefined;
            custom_json?: {
                required_auths?: string[] | undefined;
                required_posting_auths?: string[] | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } | undefined;
            comment_options?: {
                author?: string | undefined;
                permlink?: string | undefined;
                max_accepted_payout?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: {
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
            } | undefined;
            set_withdraw_vesting_route?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                percent?: number | undefined;
                auto_vest?: boolean | undefined;
            } | undefined;
            limit_order_create2?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
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
                expiration?: string | undefined;
            } | undefined;
            claim_account?: {
                creator?: string | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            create_claimed_account?: {
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
                extensions?: {
                    void_t?: {} | undefined;
                } | undefined;
            } | undefined;
            request_account_recovery?: {
                recovery_account?: string | undefined;
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            recover_account?: {
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                recent_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            change_recovery_account?: {
                account_to_recover?: string | undefined;
                new_recovery_account?: string | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            escrow_transfer?: {
                from_account?: string | undefined;
                to?: string | undefined;
                agent?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } | undefined;
            escrow_dispute?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
            } | undefined;
            escrow_release?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                receiver?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            escrow_approve?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
                approve?: boolean | undefined;
            } | undefined;
            transfer_to_savings?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            cancel_transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
            } | undefined;
            decline_voting_rights?: {
                account?: string | undefined;
                decline?: boolean | undefined;
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
            delete_comment?: ({
                author?: string | undefined;
                permlink?: string | undefined;
            } & {
                author?: string | undefined;
                permlink?: string | undefined;
            } & { [K_44 in Exclude<keyof I["operations"][number]["delete_comment"], keyof delete_comment>]: never; }) | undefined;
            custom_json?: ({
                required_auths?: string[] | undefined;
                required_posting_auths?: string[] | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } & {
                required_auths?: (string[] & string[] & { [K_45 in Exclude<keyof I["operations"][number]["custom_json"]["required_auths"], keyof string[]>]: never; }) | undefined;
                required_posting_auths?: (string[] & string[] & { [K_46 in Exclude<keyof I["operations"][number]["custom_json"]["required_posting_auths"], keyof string[]>]: never; }) | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } & { [K_47 in Exclude<keyof I["operations"][number]["custom_json"], keyof custom_json>]: never; }) | undefined;
            comment_options?: ({
                author?: string | undefined;
                permlink?: string | undefined;
                max_accepted_payout?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: {
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
            } & {
                author?: string | undefined;
                permlink?: string | undefined;
                max_accepted_payout?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_48 in Exclude<keyof I["operations"][number]["comment_options"]["max_accepted_payout"], keyof import("./asset").asset>]: never; }) | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: ({
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[] & ({
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                } & {
                    beneficiaries?: ({
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] & ({
                        account?: string | undefined;
                        weight?: number | undefined;
                    } & {
                        account?: string | undefined;
                        weight?: number | undefined;
                    } & { [K_49 in Exclude<keyof I["operations"][number]["comment_options"]["extensions"][number]["beneficiaries"][number], keyof import("./comment_options").beneficiary_route_type>]: never; })[] & { [K_50 in Exclude<keyof I["operations"][number]["comment_options"]["extensions"][number]["beneficiaries"], keyof {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[]>]: never; }) | undefined;
                } & { [K_51 in Exclude<keyof I["operations"][number]["comment_options"]["extensions"][number], "beneficiaries">]: never; })[] & { [K_52 in Exclude<keyof I["operations"][number]["comment_options"]["extensions"], keyof {
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_53 in Exclude<keyof I["operations"][number]["comment_options"], keyof comment_options>]: never; }) | undefined;
            set_withdraw_vesting_route?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                percent?: number | undefined;
                auto_vest?: boolean | undefined;
            } & {
                from_account?: string | undefined;
                to_account?: string | undefined;
                percent?: number | undefined;
                auto_vest?: boolean | undefined;
            } & { [K_54 in Exclude<keyof I["operations"][number]["set_withdraw_vesting_route"], keyof set_withdraw_vesting_route>]: never; }) | undefined;
            limit_order_create2?: ({
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
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
                } & { [K_55 in Exclude<keyof I["operations"][number]["limit_order_create2"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
                fill_or_kill?: boolean | undefined;
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
                    } & { [K_56 in Exclude<keyof I["operations"][number]["limit_order_create2"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                    quote?: ({
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & { [K_57 in Exclude<keyof I["operations"][number]["limit_order_create2"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
                } & { [K_58 in Exclude<keyof I["operations"][number]["limit_order_create2"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
                expiration?: string | undefined;
            } & { [K_59 in Exclude<keyof I["operations"][number]["limit_order_create2"], keyof limit_order_create2>]: never; }) | undefined;
            claim_account?: ({
                creator?: string | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } & {
                creator?: string | undefined;
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_60 in Exclude<keyof I["operations"][number]["claim_account"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_61 in Exclude<keyof I["operations"][number]["claim_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_62 in Exclude<keyof I["operations"][number]["claim_account"]["extensions"][number], "void_t">]: never; })[] & { [K_63 in Exclude<keyof I["operations"][number]["claim_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_64 in Exclude<keyof I["operations"][number]["claim_account"], keyof claim_account>]: never; }) | undefined;
            create_claimed_account?: ({
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
                extensions?: {
                    void_t?: {} | undefined;
                } | undefined;
            } & {
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
                    } & { [K_65 in Exclude<keyof I["operations"][number]["create_claimed_account"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_66 in Exclude<keyof I["operations"][number]["create_claimed_account"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_67 in Exclude<keyof I["operations"][number]["create_claimed_account"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                    } & { [K_68 in Exclude<keyof I["operations"][number]["create_claimed_account"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_69 in Exclude<keyof I["operations"][number]["create_claimed_account"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_70 in Exclude<keyof I["operations"][number]["create_claimed_account"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                    } & { [K_71 in Exclude<keyof I["operations"][number]["create_claimed_account"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_72 in Exclude<keyof I["operations"][number]["create_claimed_account"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_73 in Exclude<keyof I["operations"][number]["create_claimed_account"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_74 in Exclude<keyof I["operations"][number]["create_claimed_account"]["extensions"]["void_t"], never>]: never; }) | undefined;
                } & { [K_75 in Exclude<keyof I["operations"][number]["create_claimed_account"]["extensions"], "void_t">]: never; }) | undefined;
            } & { [K_76 in Exclude<keyof I["operations"][number]["create_claimed_account"], keyof create_claimed_account>]: never; }) | undefined;
            request_account_recovery?: ({
                recovery_account?: string | undefined;
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } & {
                recovery_account?: string | undefined;
                account_to_recover?: string | undefined;
                new_owner_authority?: ({
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
                    } & { [K_77 in Exclude<keyof I["operations"][number]["request_account_recovery"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_78 in Exclude<keyof I["operations"][number]["request_account_recovery"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_79 in Exclude<keyof I["operations"][number]["request_account_recovery"]["new_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_80 in Exclude<keyof I["operations"][number]["request_account_recovery"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_81 in Exclude<keyof I["operations"][number]["request_account_recovery"]["extensions"][number], "void_t">]: never; })[] & { [K_82 in Exclude<keyof I["operations"][number]["request_account_recovery"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_83 in Exclude<keyof I["operations"][number]["request_account_recovery"], keyof request_account_recovery>]: never; }) | undefined;
            recover_account?: ({
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                recent_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } & {
                account_to_recover?: string | undefined;
                new_owner_authority?: ({
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
                    } & { [K_84 in Exclude<keyof I["operations"][number]["recover_account"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_85 in Exclude<keyof I["operations"][number]["recover_account"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_86 in Exclude<keyof I["operations"][number]["recover_account"]["new_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
                recent_owner_authority?: ({
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
                    } & { [K_87 in Exclude<keyof I["operations"][number]["recover_account"]["recent_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_88 in Exclude<keyof I["operations"][number]["recover_account"]["recent_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_89 in Exclude<keyof I["operations"][number]["recover_account"]["recent_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_90 in Exclude<keyof I["operations"][number]["recover_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_91 in Exclude<keyof I["operations"][number]["recover_account"]["extensions"][number], "void_t">]: never; })[] & { [K_92 in Exclude<keyof I["operations"][number]["recover_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_93 in Exclude<keyof I["operations"][number]["recover_account"], keyof recover_account>]: never; }) | undefined;
            change_recovery_account?: ({
                account_to_recover?: string | undefined;
                new_recovery_account?: string | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } & {
                account_to_recover?: string | undefined;
                new_recovery_account?: string | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_94 in Exclude<keyof I["operations"][number]["change_recovery_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_95 in Exclude<keyof I["operations"][number]["change_recovery_account"]["extensions"][number], "void_t">]: never; })[] & { [K_96 in Exclude<keyof I["operations"][number]["change_recovery_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_97 in Exclude<keyof I["operations"][number]["change_recovery_account"], keyof change_recovery_account>]: never; }) | undefined;
            escrow_transfer?: ({
                from_account?: string | undefined;
                to?: string | undefined;
                agent?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } & {
                from_account?: string | undefined;
                to?: string | undefined;
                agent?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_98 in Exclude<keyof I["operations"][number]["escrow_transfer"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
                hive_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_99 in Exclude<keyof I["operations"][number]["escrow_transfer"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_100 in Exclude<keyof I["operations"][number]["escrow_transfer"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } & { [K_101 in Exclude<keyof I["operations"][number]["escrow_transfer"], keyof escrow_transfer>]: never; }) | undefined;
            escrow_dispute?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
            } & {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
            } & { [K_102 in Exclude<keyof I["operations"][number]["escrow_dispute"], keyof escrow_dispute>]: never; }) | undefined;
            escrow_release?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                receiver?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } & {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                receiver?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_103 in Exclude<keyof I["operations"][number]["escrow_release"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
                hive_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_104 in Exclude<keyof I["operations"][number]["escrow_release"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_105 in Exclude<keyof I["operations"][number]["escrow_release"], keyof escrow_release>]: never; }) | undefined;
            escrow_approve?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
                approve?: boolean | undefined;
            } & {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
                approve?: boolean | undefined;
            } & { [K_106 in Exclude<keyof I["operations"][number]["escrow_approve"], keyof escrow_approve>]: never; }) | undefined;
            transfer_to_savings?: ({
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
                } & { [K_107 in Exclude<keyof I["operations"][number]["transfer_to_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_108 in Exclude<keyof I["operations"][number]["transfer_to_savings"], keyof transfer_to_savings>]: never; }) | undefined;
            transfer_from_savings?: ({
                from_account?: string | undefined;
                request_id?: number | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } & {
                from_account?: string | undefined;
                request_id?: number | undefined;
                to_account?: string | undefined;
                amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_109 in Exclude<keyof I["operations"][number]["transfer_from_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_110 in Exclude<keyof I["operations"][number]["transfer_from_savings"], keyof transfer_from_savings>]: never; }) | undefined;
            cancel_transfer_from_savings?: ({
                from_account?: string | undefined;
                request_id?: number | undefined;
            } & {
                from_account?: string | undefined;
                request_id?: number | undefined;
            } & { [K_111 in Exclude<keyof I["operations"][number]["cancel_transfer_from_savings"], keyof cancel_transfer_from_savings>]: never; }) | undefined;
            decline_voting_rights?: ({
                account?: string | undefined;
                decline?: boolean | undefined;
            } & {
                account?: string | undefined;
                decline?: boolean | undefined;
            } & { [K_112 in Exclude<keyof I["operations"][number]["decline_voting_rights"], keyof decline_voting_rights>]: never; }) | undefined;
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
                } & { [K_113 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                    void_t?: ({} & {} & { [K_114 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                    recurrent_transfer_pair_id?: ({
                        pair_id?: number | undefined;
                    } & {
                        pair_id?: number | undefined;
                    } & { [K_115 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
                } & { [K_116 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_117 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"], keyof {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_118 in Exclude<keyof I["operations"][number]["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
        } & { [K_119 in Exclude<keyof I["operations"][number], keyof operation>]: never; })[] & { [K_120 in Exclude<keyof I["operations"], keyof {
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
            delete_comment?: {
                author?: string | undefined;
                permlink?: string | undefined;
            } | undefined;
            custom_json?: {
                required_auths?: string[] | undefined;
                required_posting_auths?: string[] | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } | undefined;
            comment_options?: {
                author?: string | undefined;
                permlink?: string | undefined;
                max_accepted_payout?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: {
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
            } | undefined;
            set_withdraw_vesting_route?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                percent?: number | undefined;
                auto_vest?: boolean | undefined;
            } | undefined;
            limit_order_create2?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
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
                expiration?: string | undefined;
            } | undefined;
            claim_account?: {
                creator?: string | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            create_claimed_account?: {
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
                extensions?: {
                    void_t?: {} | undefined;
                } | undefined;
            } | undefined;
            request_account_recovery?: {
                recovery_account?: string | undefined;
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            recover_account?: {
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                recent_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            change_recovery_account?: {
                account_to_recover?: string | undefined;
                new_recovery_account?: string | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            escrow_transfer?: {
                from_account?: string | undefined;
                to?: string | undefined;
                agent?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } | undefined;
            escrow_dispute?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
            } | undefined;
            escrow_release?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                receiver?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            escrow_approve?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
                approve?: boolean | undefined;
            } | undefined;
            transfer_to_savings?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            cancel_transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
            } | undefined;
            decline_voting_rights?: {
                account?: string | undefined;
                decline?: boolean | undefined;
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
            void_t?: ({} & {} & { [K_121 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_122 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_123 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_124 in Exclude<keyof I, keyof transaction>]: never; }>(base?: I | undefined): transaction;
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
            delete_comment?: {
                author?: string | undefined;
                permlink?: string | undefined;
            } | undefined;
            custom_json?: {
                required_auths?: string[] | undefined;
                required_posting_auths?: string[] | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } | undefined;
            comment_options?: {
                author?: string | undefined;
                permlink?: string | undefined;
                max_accepted_payout?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: {
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
            } | undefined;
            set_withdraw_vesting_route?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                percent?: number | undefined;
                auto_vest?: boolean | undefined;
            } | undefined;
            limit_order_create2?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
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
                expiration?: string | undefined;
            } | undefined;
            claim_account?: {
                creator?: string | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            create_claimed_account?: {
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
                extensions?: {
                    void_t?: {} | undefined;
                } | undefined;
            } | undefined;
            request_account_recovery?: {
                recovery_account?: string | undefined;
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            recover_account?: {
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                recent_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            change_recovery_account?: {
                account_to_recover?: string | undefined;
                new_recovery_account?: string | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            escrow_transfer?: {
                from_account?: string | undefined;
                to?: string | undefined;
                agent?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } | undefined;
            escrow_dispute?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
            } | undefined;
            escrow_release?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                receiver?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            escrow_approve?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
                approve?: boolean | undefined;
            } | undefined;
            transfer_to_savings?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            cancel_transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
            } | undefined;
            decline_voting_rights?: {
                account?: string | undefined;
                decline?: boolean | undefined;
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
            delete_comment?: {
                author?: string | undefined;
                permlink?: string | undefined;
            } | undefined;
            custom_json?: {
                required_auths?: string[] | undefined;
                required_posting_auths?: string[] | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } | undefined;
            comment_options?: {
                author?: string | undefined;
                permlink?: string | undefined;
                max_accepted_payout?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: {
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
            } | undefined;
            set_withdraw_vesting_route?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                percent?: number | undefined;
                auto_vest?: boolean | undefined;
            } | undefined;
            limit_order_create2?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
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
                expiration?: string | undefined;
            } | undefined;
            claim_account?: {
                creator?: string | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            create_claimed_account?: {
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
                extensions?: {
                    void_t?: {} | undefined;
                } | undefined;
            } | undefined;
            request_account_recovery?: {
                recovery_account?: string | undefined;
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            recover_account?: {
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                recent_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            change_recovery_account?: {
                account_to_recover?: string | undefined;
                new_recovery_account?: string | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            escrow_transfer?: {
                from_account?: string | undefined;
                to?: string | undefined;
                agent?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } | undefined;
            escrow_dispute?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
            } | undefined;
            escrow_release?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                receiver?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            escrow_approve?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
                approve?: boolean | undefined;
            } | undefined;
            transfer_to_savings?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            cancel_transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
            } | undefined;
            decline_voting_rights?: {
                account?: string | undefined;
                decline?: boolean | undefined;
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
            delete_comment?: {
                author?: string | undefined;
                permlink?: string | undefined;
            } | undefined;
            custom_json?: {
                required_auths?: string[] | undefined;
                required_posting_auths?: string[] | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } | undefined;
            comment_options?: {
                author?: string | undefined;
                permlink?: string | undefined;
                max_accepted_payout?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: {
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
            } | undefined;
            set_withdraw_vesting_route?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                percent?: number | undefined;
                auto_vest?: boolean | undefined;
            } | undefined;
            limit_order_create2?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
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
                expiration?: string | undefined;
            } | undefined;
            claim_account?: {
                creator?: string | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            create_claimed_account?: {
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
                extensions?: {
                    void_t?: {} | undefined;
                } | undefined;
            } | undefined;
            request_account_recovery?: {
                recovery_account?: string | undefined;
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            recover_account?: {
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                recent_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            change_recovery_account?: {
                account_to_recover?: string | undefined;
                new_recovery_account?: string | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            escrow_transfer?: {
                from_account?: string | undefined;
                to?: string | undefined;
                agent?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } | undefined;
            escrow_dispute?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
            } | undefined;
            escrow_release?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                receiver?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            escrow_approve?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
                approve?: boolean | undefined;
            } | undefined;
            transfer_to_savings?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            cancel_transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
            } | undefined;
            decline_voting_rights?: {
                account?: string | undefined;
                decline?: boolean | undefined;
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
            } & { [K_125 in Exclude<keyof I_1["operations"][number]["vote"], keyof vote>]: never; }) | undefined;
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
            } & { [K_126 in Exclude<keyof I_1["operations"][number]["comment"], keyof comment>]: never; }) | undefined;
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
                } & { [K_127 in Exclude<keyof I_1["operations"][number]["transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_128 in Exclude<keyof I_1["operations"][number]["transfer"], keyof transfer>]: never; }) | undefined;
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
                } & { [K_129 in Exclude<keyof I_1["operations"][number]["transfer_to_vesting"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_130 in Exclude<keyof I_1["operations"][number]["transfer_to_vesting"], keyof transfer_to_vesting>]: never; }) | undefined;
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
                } & { [K_131 in Exclude<keyof I_1["operations"][number]["withdraw_vesting"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_132 in Exclude<keyof I_1["operations"][number]["withdraw_vesting"], keyof withdraw_vesting>]: never; }) | undefined;
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
                } & { [K_133 in Exclude<keyof I_1["operations"][number]["limit_order_create"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
                min_to_receive?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_134 in Exclude<keyof I_1["operations"][number]["limit_order_create"]["min_to_receive"], keyof import("./asset").asset>]: never; }) | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } & { [K_135 in Exclude<keyof I_1["operations"][number]["limit_order_create"], keyof limit_order_create>]: never; }) | undefined;
            limit_order_cancel?: ({
                order?: string | undefined;
                orderid?: number | undefined;
            } & {
                order?: string | undefined;
                orderid?: number | undefined;
            } & { [K_136 in Exclude<keyof I_1["operations"][number]["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
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
                    } & { [K_137 in Exclude<keyof I_1["operations"][number]["feed_publish"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                    quote?: ({
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & { [K_138 in Exclude<keyof I_1["operations"][number]["feed_publish"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
                } & { [K_139 in Exclude<keyof I_1["operations"][number]["feed_publish"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
            } & { [K_140 in Exclude<keyof I_1["operations"][number]["feed_publish"], keyof feed_publish>]: never; }) | undefined;
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
                } & { [K_141 in Exclude<keyof I_1["operations"][number]["convert"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_142 in Exclude<keyof I_1["operations"][number]["convert"], keyof convert>]: never; }) | undefined;
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
                } & { [K_143 in Exclude<keyof I_1["operations"][number]["account_create"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
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
                    } & { [K_144 in Exclude<keyof I_1["operations"][number]["account_create"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_145 in Exclude<keyof I_1["operations"][number]["account_create"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_146 in Exclude<keyof I_1["operations"][number]["account_create"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                    } & { [K_147 in Exclude<keyof I_1["operations"][number]["account_create"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_148 in Exclude<keyof I_1["operations"][number]["account_create"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_149 in Exclude<keyof I_1["operations"][number]["account_create"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                    } & { [K_150 in Exclude<keyof I_1["operations"][number]["account_create"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_151 in Exclude<keyof I_1["operations"][number]["account_create"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_152 in Exclude<keyof I_1["operations"][number]["account_create"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_153 in Exclude<keyof I_1["operations"][number]["account_create"], keyof account_create>]: never; }) | undefined;
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
                    } & { [K_154 in Exclude<keyof I_1["operations"][number]["account_update"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_155 in Exclude<keyof I_1["operations"][number]["account_update"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_156 in Exclude<keyof I_1["operations"][number]["account_update"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                    } & { [K_157 in Exclude<keyof I_1["operations"][number]["account_update"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_158 in Exclude<keyof I_1["operations"][number]["account_update"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_159 in Exclude<keyof I_1["operations"][number]["account_update"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                    } & { [K_160 in Exclude<keyof I_1["operations"][number]["account_update"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_161 in Exclude<keyof I_1["operations"][number]["account_update"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_162 in Exclude<keyof I_1["operations"][number]["account_update"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_163 in Exclude<keyof I_1["operations"][number]["account_update"], keyof account_update>]: never; }) | undefined;
            account_witness_vote?: ({
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } & {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } & { [K_164 in Exclude<keyof I_1["operations"][number]["account_witness_vote"], keyof account_witness_vote>]: never; }) | undefined;
            account_witness_proxy?: ({
                account?: string | undefined;
                proxy?: string | undefined;
            } & {
                account?: string | undefined;
                proxy?: string | undefined;
            } & { [K_165 in Exclude<keyof I_1["operations"][number]["account_witness_proxy"], keyof account_witness_proxy>]: never; }) | undefined;
            custom?: ({
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } & {
                required_auths?: (string[] & string[] & { [K_166 in Exclude<keyof I_1["operations"][number]["custom"]["required_auths"], keyof string[]>]: never; }) | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } & { [K_167 in Exclude<keyof I_1["operations"][number]["custom"], keyof custom>]: never; }) | undefined;
            witness_block_approve?: ({
                witness?: string | undefined;
                block_id?: string | undefined;
            } & {
                witness?: string | undefined;
                block_id?: string | undefined;
            } & { [K_168 in Exclude<keyof I_1["operations"][number]["witness_block_approve"], keyof witness_block_approve>]: never; }) | undefined;
            delete_comment?: ({
                author?: string | undefined;
                permlink?: string | undefined;
            } & {
                author?: string | undefined;
                permlink?: string | undefined;
            } & { [K_169 in Exclude<keyof I_1["operations"][number]["delete_comment"], keyof delete_comment>]: never; }) | undefined;
            custom_json?: ({
                required_auths?: string[] | undefined;
                required_posting_auths?: string[] | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } & {
                required_auths?: (string[] & string[] & { [K_170 in Exclude<keyof I_1["operations"][number]["custom_json"]["required_auths"], keyof string[]>]: never; }) | undefined;
                required_posting_auths?: (string[] & string[] & { [K_171 in Exclude<keyof I_1["operations"][number]["custom_json"]["required_posting_auths"], keyof string[]>]: never; }) | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } & { [K_172 in Exclude<keyof I_1["operations"][number]["custom_json"], keyof custom_json>]: never; }) | undefined;
            comment_options?: ({
                author?: string | undefined;
                permlink?: string | undefined;
                max_accepted_payout?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: {
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
            } & {
                author?: string | undefined;
                permlink?: string | undefined;
                max_accepted_payout?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_173 in Exclude<keyof I_1["operations"][number]["comment_options"]["max_accepted_payout"], keyof import("./asset").asset>]: never; }) | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: ({
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[] & ({
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                } & {
                    beneficiaries?: ({
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] & ({
                        account?: string | undefined;
                        weight?: number | undefined;
                    } & {
                        account?: string | undefined;
                        weight?: number | undefined;
                    } & { [K_174 in Exclude<keyof I_1["operations"][number]["comment_options"]["extensions"][number]["beneficiaries"][number], keyof import("./comment_options").beneficiary_route_type>]: never; })[] & { [K_175 in Exclude<keyof I_1["operations"][number]["comment_options"]["extensions"][number]["beneficiaries"], keyof {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[]>]: never; }) | undefined;
                } & { [K_176 in Exclude<keyof I_1["operations"][number]["comment_options"]["extensions"][number], "beneficiaries">]: never; })[] & { [K_177 in Exclude<keyof I_1["operations"][number]["comment_options"]["extensions"], keyof {
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_178 in Exclude<keyof I_1["operations"][number]["comment_options"], keyof comment_options>]: never; }) | undefined;
            set_withdraw_vesting_route?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                percent?: number | undefined;
                auto_vest?: boolean | undefined;
            } & {
                from_account?: string | undefined;
                to_account?: string | undefined;
                percent?: number | undefined;
                auto_vest?: boolean | undefined;
            } & { [K_179 in Exclude<keyof I_1["operations"][number]["set_withdraw_vesting_route"], keyof set_withdraw_vesting_route>]: never; }) | undefined;
            limit_order_create2?: ({
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
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
                } & { [K_180 in Exclude<keyof I_1["operations"][number]["limit_order_create2"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
                fill_or_kill?: boolean | undefined;
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
                    } & { [K_181 in Exclude<keyof I_1["operations"][number]["limit_order_create2"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                    quote?: ({
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & { [K_182 in Exclude<keyof I_1["operations"][number]["limit_order_create2"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
                } & { [K_183 in Exclude<keyof I_1["operations"][number]["limit_order_create2"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
                expiration?: string | undefined;
            } & { [K_184 in Exclude<keyof I_1["operations"][number]["limit_order_create2"], keyof limit_order_create2>]: never; }) | undefined;
            claim_account?: ({
                creator?: string | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } & {
                creator?: string | undefined;
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_185 in Exclude<keyof I_1["operations"][number]["claim_account"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_186 in Exclude<keyof I_1["operations"][number]["claim_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_187 in Exclude<keyof I_1["operations"][number]["claim_account"]["extensions"][number], "void_t">]: never; })[] & { [K_188 in Exclude<keyof I_1["operations"][number]["claim_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_189 in Exclude<keyof I_1["operations"][number]["claim_account"], keyof claim_account>]: never; }) | undefined;
            create_claimed_account?: ({
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
                extensions?: {
                    void_t?: {} | undefined;
                } | undefined;
            } & {
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
                    } & { [K_190 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_191 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_192 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                    } & { [K_193 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_194 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_195 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                    } & { [K_196 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_197 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_198 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_199 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["extensions"]["void_t"], never>]: never; }) | undefined;
                } & { [K_200 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["extensions"], "void_t">]: never; }) | undefined;
            } & { [K_201 in Exclude<keyof I_1["operations"][number]["create_claimed_account"], keyof create_claimed_account>]: never; }) | undefined;
            request_account_recovery?: ({
                recovery_account?: string | undefined;
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } & {
                recovery_account?: string | undefined;
                account_to_recover?: string | undefined;
                new_owner_authority?: ({
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
                    } & { [K_202 in Exclude<keyof I_1["operations"][number]["request_account_recovery"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_203 in Exclude<keyof I_1["operations"][number]["request_account_recovery"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_204 in Exclude<keyof I_1["operations"][number]["request_account_recovery"]["new_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_205 in Exclude<keyof I_1["operations"][number]["request_account_recovery"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_206 in Exclude<keyof I_1["operations"][number]["request_account_recovery"]["extensions"][number], "void_t">]: never; })[] & { [K_207 in Exclude<keyof I_1["operations"][number]["request_account_recovery"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_208 in Exclude<keyof I_1["operations"][number]["request_account_recovery"], keyof request_account_recovery>]: never; }) | undefined;
            recover_account?: ({
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                recent_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } & {
                account_to_recover?: string | undefined;
                new_owner_authority?: ({
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
                    } & { [K_209 in Exclude<keyof I_1["operations"][number]["recover_account"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_210 in Exclude<keyof I_1["operations"][number]["recover_account"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_211 in Exclude<keyof I_1["operations"][number]["recover_account"]["new_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
                recent_owner_authority?: ({
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
                    } & { [K_212 in Exclude<keyof I_1["operations"][number]["recover_account"]["recent_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_213 in Exclude<keyof I_1["operations"][number]["recover_account"]["recent_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_214 in Exclude<keyof I_1["operations"][number]["recover_account"]["recent_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_215 in Exclude<keyof I_1["operations"][number]["recover_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_216 in Exclude<keyof I_1["operations"][number]["recover_account"]["extensions"][number], "void_t">]: never; })[] & { [K_217 in Exclude<keyof I_1["operations"][number]["recover_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_218 in Exclude<keyof I_1["operations"][number]["recover_account"], keyof recover_account>]: never; }) | undefined;
            change_recovery_account?: ({
                account_to_recover?: string | undefined;
                new_recovery_account?: string | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } & {
                account_to_recover?: string | undefined;
                new_recovery_account?: string | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_219 in Exclude<keyof I_1["operations"][number]["change_recovery_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_220 in Exclude<keyof I_1["operations"][number]["change_recovery_account"]["extensions"][number], "void_t">]: never; })[] & { [K_221 in Exclude<keyof I_1["operations"][number]["change_recovery_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_222 in Exclude<keyof I_1["operations"][number]["change_recovery_account"], keyof change_recovery_account>]: never; }) | undefined;
            escrow_transfer?: ({
                from_account?: string | undefined;
                to?: string | undefined;
                agent?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } & {
                from_account?: string | undefined;
                to?: string | undefined;
                agent?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_223 in Exclude<keyof I_1["operations"][number]["escrow_transfer"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
                hive_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_224 in Exclude<keyof I_1["operations"][number]["escrow_transfer"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_225 in Exclude<keyof I_1["operations"][number]["escrow_transfer"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } & { [K_226 in Exclude<keyof I_1["operations"][number]["escrow_transfer"], keyof escrow_transfer>]: never; }) | undefined;
            escrow_dispute?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
            } & {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
            } & { [K_227 in Exclude<keyof I_1["operations"][number]["escrow_dispute"], keyof escrow_dispute>]: never; }) | undefined;
            escrow_release?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                receiver?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } & {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                receiver?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_228 in Exclude<keyof I_1["operations"][number]["escrow_release"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
                hive_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_229 in Exclude<keyof I_1["operations"][number]["escrow_release"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_230 in Exclude<keyof I_1["operations"][number]["escrow_release"], keyof escrow_release>]: never; }) | undefined;
            escrow_approve?: ({
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
                approve?: boolean | undefined;
            } & {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
                approve?: boolean | undefined;
            } & { [K_231 in Exclude<keyof I_1["operations"][number]["escrow_approve"], keyof escrow_approve>]: never; }) | undefined;
            transfer_to_savings?: ({
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
                } & { [K_232 in Exclude<keyof I_1["operations"][number]["transfer_to_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_233 in Exclude<keyof I_1["operations"][number]["transfer_to_savings"], keyof transfer_to_savings>]: never; }) | undefined;
            transfer_from_savings?: ({
                from_account?: string | undefined;
                request_id?: number | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } & {
                from_account?: string | undefined;
                request_id?: number | undefined;
                to_account?: string | undefined;
                amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_234 in Exclude<keyof I_1["operations"][number]["transfer_from_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_235 in Exclude<keyof I_1["operations"][number]["transfer_from_savings"], keyof transfer_from_savings>]: never; }) | undefined;
            cancel_transfer_from_savings?: ({
                from_account?: string | undefined;
                request_id?: number | undefined;
            } & {
                from_account?: string | undefined;
                request_id?: number | undefined;
            } & { [K_236 in Exclude<keyof I_1["operations"][number]["cancel_transfer_from_savings"], keyof cancel_transfer_from_savings>]: never; }) | undefined;
            decline_voting_rights?: ({
                account?: string | undefined;
                decline?: boolean | undefined;
            } & {
                account?: string | undefined;
                decline?: boolean | undefined;
            } & { [K_237 in Exclude<keyof I_1["operations"][number]["decline_voting_rights"], keyof decline_voting_rights>]: never; }) | undefined;
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
                } & { [K_238 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                    void_t?: ({} & {} & { [K_239 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                    recurrent_transfer_pair_id?: ({
                        pair_id?: number | undefined;
                    } & {
                        pair_id?: number | undefined;
                    } & { [K_240 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
                } & { [K_241 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_242 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"], keyof {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_243 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
        } & { [K_244 in Exclude<keyof I_1["operations"][number], keyof operation>]: never; })[] & { [K_245 in Exclude<keyof I_1["operations"], keyof {
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
            delete_comment?: {
                author?: string | undefined;
                permlink?: string | undefined;
            } | undefined;
            custom_json?: {
                required_auths?: string[] | undefined;
                required_posting_auths?: string[] | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } | undefined;
            comment_options?: {
                author?: string | undefined;
                permlink?: string | undefined;
                max_accepted_payout?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: {
                    beneficiaries?: {
                        account?: string | undefined;
                        weight?: number | undefined;
                    }[] | undefined;
                }[] | undefined;
            } | undefined;
            set_withdraw_vesting_route?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                percent?: number | undefined;
                auto_vest?: boolean | undefined;
            } | undefined;
            limit_order_create2?: {
                owner?: string | undefined;
                orderid?: number | undefined;
                amount_to_sell?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fill_or_kill?: boolean | undefined;
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
                expiration?: string | undefined;
            } | undefined;
            claim_account?: {
                creator?: string | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            create_claimed_account?: {
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
                extensions?: {
                    void_t?: {} | undefined;
                } | undefined;
            } | undefined;
            request_account_recovery?: {
                recovery_account?: string | undefined;
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            recover_account?: {
                account_to_recover?: string | undefined;
                new_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                recent_owner_authority?: {
                    weight_threshold?: number | undefined;
                    account_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                    key_auths?: {
                        [x: string]: number | undefined;
                    } | undefined;
                } | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            change_recovery_account?: {
                account_to_recover?: string | undefined;
                new_recovery_account?: string | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } | undefined;
            escrow_transfer?: {
                from_account?: string | undefined;
                to?: string | undefined;
                agent?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } | undefined;
            escrow_dispute?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
            } | undefined;
            escrow_release?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                receiver?: string | undefined;
                escrow_id?: number | undefined;
                hbd_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                hive_amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
            } | undefined;
            escrow_approve?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                agent?: string | undefined;
                who?: string | undefined;
                escrow_id?: number | undefined;
                approve?: boolean | undefined;
            } | undefined;
            transfer_to_savings?: {
                from_account?: string | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
                to_account?: string | undefined;
                amount?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                memo?: string | undefined;
            } | undefined;
            cancel_transfer_from_savings?: {
                from_account?: string | undefined;
                request_id?: number | undefined;
            } | undefined;
            decline_voting_rights?: {
                account?: string | undefined;
                decline?: boolean | undefined;
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
            void_t?: ({} & {} & { [K_246 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_247 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_248 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_249 in Exclude<keyof I_1, keyof transaction>]: never; }>(object: I_1): transaction;
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
