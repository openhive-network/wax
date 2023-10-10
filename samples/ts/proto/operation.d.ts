import _m0 from "protobufjs/minimal.js";
import { account_create } from "./account_create.js";
import { account_create_with_delegation } from "./account_create_with_delegation.js";
import { account_created } from "./account_created.js";
import { account_update } from "./account_update.js";
import { account_update2 } from "./account_update2.js";
import { account_witness_proxy } from "./account_witness_proxy.js";
import { account_witness_vote } from "./account_witness_vote.js";
import { author_reward } from "./author_reward.js";
import { cancel_transfer_from_savings } from "./cancel_transfer_from_savings.js";
import { change_recovery_account } from "./change_recovery_account.js";
import { changed_recovery_account } from "./changed_recovery_account.js";
import { claim_account } from "./claim_account.js";
import { claim_reward_balance } from "./claim_reward_balance.js";
import { clear_null_account_balance } from "./clear_null_account_balance.js";
import { collateralized_convert } from "./collateralized_convert.js";
import { collateralized_convert_immediate_conversion } from "./collateralized_convert_immediate_conversion.js";
import { comment } from "./comment.js";
import { comment_benefactor_reward } from "./comment_benefactor_reward.js";
import { comment_options } from "./comment_options.js";
import { comment_payout_update } from "./comment_payout_update.js";
import { comment_reward } from "./comment_reward.js";
import { consolidate_treasury_balance } from "./consolidate_treasury_balance.js";
import { convert } from "./convert.js";
import { create_claimed_account } from "./create_claimed_account.js";
import { create_proposal } from "./create_proposal.js";
import { curation_reward } from "./curation_reward.js";
import { custom } from "./custom.js";
import { custom_json } from "./custom_json.js";
import { decline_voting_rights } from "./decline_voting_rights.js";
import { declined_voting_rights } from "./declined_voting_rights.js";
import { delayed_voting } from "./delayed_voting.js";
import { delegate_vesting_shares } from "./delegate_vesting_shares.js";
import { delete_comment } from "./delete_comment.js";
import { dhf_conversion } from "./dhf_conversion.js";
import { dhf_funding } from "./dhf_funding.js";
import { effective_comment_vote } from "./effective_comment_vote.js";
import { escrow_approve } from "./escrow_approve.js";
import { escrow_approved } from "./escrow_approved.js";
import { escrow_dispute } from "./escrow_dispute.js";
import { escrow_rejected } from "./escrow_rejected.js";
import { escrow_release } from "./escrow_release.js";
import { escrow_transfer } from "./escrow_transfer.js";
import { expired_account_notification } from "./expired_account_notification.js";
import { failed_recurrent_transfer } from "./failed_recurrent_transfer.js";
import { feed_publish } from "./feed_publish.js";
import { fill_collateralized_convert_request } from "./fill_collateralized_convert_request.js";
import { fill_convert_request } from "./fill_convert_request.js";
import { fill_order } from "./fill_order.js";
import { fill_recurrent_transfer } from "./fill_recurrent_transfer.js";
import { fill_transfer_from_savings } from "./fill_transfer_from_savings.js";
import { fill_vesting_withdraw } from "./fill_vesting_withdraw.js";
import { hardfork } from "./hardfork.js";
import { hardfork_hive } from "./hardfork_hive.js";
import { hardfork_hive_restore } from "./hardfork_hive_restore.js";
import { ineffective_delete_comment } from "./ineffective_delete_comment.js";
import { interest } from "./interest.js";
import { limit_order_cancel } from "./limit_order_cancel.js";
import { limit_order_cancelled } from "./limit_order_cancelled.js";
import { limit_order_create } from "./limit_order_create.js";
import { limit_order_create2 } from "./limit_order_create2.js";
import { liquidity_reward } from "./liquidity_reward.js";
import { pow } from "./pow.js";
import { pow2 } from "./pow2.js";
import { pow_reward } from "./pow_reward.js";
import { producer_missed } from "./producer_missed.js";
import { producer_reward } from "./producer_reward.js";
import { proposal_fee } from "./proposal_fee.js";
import { proposal_pay } from "./proposal_pay.js";
import { proxy_cleared } from "./proxy_cleared.js";
import { recover_account } from "./recover_account.js";
import { recurrent_transfer } from "./recurrent_transfer.js";
import { remove_proposal } from "./remove_proposal.js";
import { request_account_recovery } from "./request_account_recovery.js";
import { return_vesting_delegation } from "./return_vesting_delegation.js";
import { set_withdraw_vesting_route } from "./set_withdraw_vesting_route.js";
import { shutdown_witness } from "./shutdown_witness.js";
import { system_warning } from "./system_warning.js";
import { transfer } from "./transfer.js";
import { transfer_from_savings } from "./transfer_from_savings.js";
import { transfer_to_savings } from "./transfer_to_savings.js";
import { transfer_to_vesting } from "./transfer_to_vesting.js";
import { transfer_to_vesting_completed } from "./transfer_to_vesting_completed.js";
import { update_proposal } from "./update_proposal.js";
import { update_proposal_votes } from "./update_proposal_votes.js";
import { vesting_shares_split } from "./vesting_shares_split.js";
import { vote } from "./vote.js";
import { withdraw_vesting } from "./withdraw_vesting.js";
import { witness_block_approve } from "./witness_block_approve.js";
import { witness_set_properties } from "./witness_set_properties.js";
import { witness_update } from "./witness_update.js";
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
    witness_update?: witness_update | undefined;
    account_witness_vote?: account_witness_vote | undefined;
    account_witness_proxy?: account_witness_proxy | undefined;
    pow?: pow | undefined;
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
    pow2?: pow2 | undefined;
    escrow_approve?: escrow_approve | undefined;
    transfer_to_savings?: transfer_to_savings | undefined;
    transfer_from_savings?: transfer_from_savings | undefined;
    cancel_transfer_from_savings?: cancel_transfer_from_savings | undefined;
    decline_voting_rights?: decline_voting_rights | undefined;
    claim_reward_balance?: claim_reward_balance | undefined;
    delegate_vesting_shares?: delegate_vesting_shares | undefined;
    account_create_with_delegation?: account_create_with_delegation | undefined;
    witness_set_properties?: witness_set_properties | undefined;
    account_update2?: account_update2 | undefined;
    create_proposal?: create_proposal | undefined;
    update_proposal_votes?: update_proposal_votes | undefined;
    remove_proposal?: remove_proposal | undefined;
    update_proposal?: update_proposal | undefined;
    collateralized_convert?: collateralized_convert | undefined;
    recurrent_transfer?: recurrent_transfer | undefined;
    /** Virtual operations: */
    fill_convert_request?: fill_convert_request | undefined;
    author_reward?: author_reward | undefined;
    curation_reward?: curation_reward | undefined;
    comment_reward?: comment_reward | undefined;
    liquidity_reward?: liquidity_reward | undefined;
    interest?: interest | undefined;
    fill_vesting_withdraw?: fill_vesting_withdraw | undefined;
    fill_order?: fill_order | undefined;
    shutdown_witness?: shutdown_witness | undefined;
    fill_transfer_from_savings?: fill_transfer_from_savings | undefined;
    hardfork?: hardfork | undefined;
    comment_payout_update?: comment_payout_update | undefined;
    return_vesting_delegation?: return_vesting_delegation | undefined;
    comment_benefactor_reward?: comment_benefactor_reward | undefined;
    producer_reward?: producer_reward | undefined;
    clear_null_account_balance?: clear_null_account_balance | undefined;
    proposal_pay?: proposal_pay | undefined;
    dhf_funding?: dhf_funding | undefined;
    hardfork_hive?: hardfork_hive | undefined;
    hardfork_hive_restore?: hardfork_hive_restore | undefined;
    delayed_voting?: delayed_voting | undefined;
    consolidate_treasury_balance?: consolidate_treasury_balance | undefined;
    effective_comment_vote?: effective_comment_vote | undefined;
    ineffective_delete_comment?: ineffective_delete_comment | undefined;
    dhf_conversion?: dhf_conversion | undefined;
    expired_account_notification?: expired_account_notification | undefined;
    changed_recovery_account?: changed_recovery_account | undefined;
    transfer_to_vesting_completed?: transfer_to_vesting_completed | undefined;
    pow_reward?: pow_reward | undefined;
    vesting_shares_split?: vesting_shares_split | undefined;
    account_created?: account_created | undefined;
    fill_collateralized_convert_request?: fill_collateralized_convert_request | undefined;
    system_warning?: system_warning | undefined;
    fill_recurrent_transfer?: fill_recurrent_transfer | undefined;
    failed_recurrent_transfer?: failed_recurrent_transfer | undefined;
    limit_order_cancelled?: limit_order_cancelled | undefined;
    producer_missed?: producer_missed | undefined;
    proposal_fee?: proposal_fee | undefined;
    collateralized_convert_immediate_conversion?: collateralized_convert_immediate_conversion | undefined;
    escrow_approved?: escrow_approved | undefined;
    escrow_rejected?: escrow_rejected | undefined;
    proxy_cleared?: proxy_cleared | undefined;
    declined_voting_rights?: declined_voting_rights | undefined;
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
        witness_update?: {
            owner?: string | undefined;
            url?: string | undefined;
            block_signing_key?: string | undefined;
            props?: {
                account_creation_fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                maximum_block_size?: number | undefined;
                hbd_interest_rate?: number | undefined;
            } | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
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
        pow?: {
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
            }[] | undefined;
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
            to_account?: string | undefined;
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
        pow2?: {
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
        claim_reward_balance?: {
            account?: string | undefined;
            reward_hive?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            reward_hbd?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            reward_vests?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        delegate_vesting_shares?: {
            delegator?: string | undefined;
            delegatee?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        account_create_with_delegation?: {
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            delegation?: {
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
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        witness_set_properties?: {
            owner?: string | undefined;
            props?: {
                [x: string]: string | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        account_update2?: {
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
            posting_json_metadata?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        create_proposal?: {
            creator?: string | undefined;
            receiver?: string | undefined;
            start_date?: string | undefined;
            end_date?: string | undefined;
            daily_pay?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            subject?: string | undefined;
            permlink?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        update_proposal_votes?: {
            voter?: string | undefined;
            proposal_ids?: string[] | undefined;
            approve?: boolean | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        remove_proposal?: {
            proposal_owner?: string | undefined;
            proposal_ids?: string[] | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        update_proposal?: {
            proposal_id?: string | undefined;
            creator?: string | undefined;
            daily_pay?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            subject?: string | undefined;
            permlink?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
                update_proposal_end_date?: {
                    end_date?: string | undefined;
                } | undefined;
            }[] | undefined;
        } | undefined;
        collateralized_convert?: {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
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
        fill_convert_request?: {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount_in?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            amount_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        author_reward?: {
            author?: string | undefined;
            permlink?: string | undefined;
            hbd_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            curators_vesting_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } | undefined;
        curation_reward?: {
            curator?: string | undefined;
            reward?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            comment_author?: string | undefined;
            comment_permlink?: string | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } | undefined;
        comment_reward?: {
            author?: string | undefined;
            permlink?: string | undefined;
            payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            author_rewards?: string | undefined;
            total_payout_value?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            curator_payout_value?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            beneficiary_payout_value?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        liquidity_reward?: {
            owner?: string | undefined;
            payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        interest?: {
            owner?: string | undefined;
            interest?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            is_saved_into_hbd_balance?: boolean | undefined;
        } | undefined;
        fill_vesting_withdraw?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            withdrawn?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            deposited?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        fill_order?: {
            current_owner?: string | undefined;
            current_orderid?: number | undefined;
            current_pays?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            open_owner?: string | undefined;
            open_orderid?: number | undefined;
            open_pays?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        shutdown_witness?: {
            owner?: string | undefined;
        } | undefined;
        fill_transfer_from_savings?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            request_id?: number | undefined;
            memo?: string | undefined;
        } | undefined;
        hardfork?: {
            hardfork_id?: number | undefined;
        } | undefined;
        comment_payout_update?: {
            author?: string | undefined;
            permlink?: string | undefined;
        } | undefined;
        return_vesting_delegation?: {
            account?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        comment_benefactor_reward?: {
            benefactor?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            hbd_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } | undefined;
        producer_reward?: {
            producer?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        clear_null_account_balance?: {
            total_cleared?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[] | undefined;
        } | undefined;
        proposal_pay?: {
            proposal_id?: number | undefined;
            receiver?: string | undefined;
            payer?: string | undefined;
            payment?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        dhf_funding?: {
            treasury?: string | undefined;
            additional_funds?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        hardfork_hive?: {
            account?: string | undefined;
            treasury?: string | undefined;
            other_affected_accounts?: string[] | undefined;
            hbd_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vests_converted?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            total_hive_from_vests?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        hardfork_hive_restore?: {
            account?: string | undefined;
            treasury?: string | undefined;
            hbd_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        delayed_voting?: {
            voter?: string | undefined;
            votes?: string | undefined;
        } | undefined;
        consolidate_treasury_balance?: {
            total_moved?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[] | undefined;
        } | undefined;
        effective_comment_vote?: {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: string | undefined;
            rshares?: string | undefined;
            total_vote_weight?: string | undefined;
            pending_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        ineffective_delete_comment?: {
            author?: string | undefined;
            permlink?: string | undefined;
        } | undefined;
        dhf_conversion?: {
            treasury?: string | undefined;
            hive_amount_in?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hbd_amount_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        expired_account_notification?: {
            account?: string | undefined;
        } | undefined;
        changed_recovery_account?: {
            account?: string | undefined;
            old_recovery_account?: string | undefined;
            new_recovery_account?: string | undefined;
        } | undefined;
        transfer_to_vesting_completed?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            hive_vested?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_shares_received?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        pow_reward?: {
            worker?: string | undefined;
            reward?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        vesting_shares_split?: {
            owner?: string | undefined;
            vesting_shares_before_split?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_shares_after_split?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        account_created?: {
            new_account_name?: string | undefined;
            creator?: string | undefined;
            initial_vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            initial_delegation?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        fill_collateralized_convert_request?: {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount_in?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            amount_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            excess_collateral?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        system_warning?: {
            message?: string | undefined;
        } | undefined;
        fill_recurrent_transfer?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
            remaining_executions?: number | undefined;
        } | undefined;
        failed_recurrent_transfer?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
            consecutive_failures?: number | undefined;
            remaining_executions?: number | undefined;
            deleted?: boolean | undefined;
        } | undefined;
        limit_order_cancelled?: {
            seller?: string | undefined;
            orderid?: number | undefined;
            amount_back?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        producer_missed?: {
            producer?: string | undefined;
        } | undefined;
        proposal_fee?: {
            creator?: string | undefined;
            treasury?: string | undefined;
            proposal_id?: number | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        collateralized_convert_immediate_conversion?: {
            owner?: string | undefined;
            requestid?: number | undefined;
            hbd_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        escrow_approved?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            escrow_id?: number | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        escrow_rejected?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
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
        } | undefined;
        proxy_cleared?: {
            account?: string | undefined;
            proxy?: string | undefined;
        } | undefined;
        declined_voting_rights?: {
            account?: string | undefined;
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
        witness_update?: ({
            owner?: string | undefined;
            url?: string | undefined;
            block_signing_key?: string | undefined;
            props?: {
                account_creation_fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                maximum_block_size?: number | undefined;
                hbd_interest_rate?: number | undefined;
            } | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            url?: string | undefined;
            block_signing_key?: string | undefined;
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
                } & { [K_39 in Exclude<keyof I["witness_update"]["props"]["account_creation_fee"], keyof import("./asset").asset>]: never; }) | undefined;
                maximum_block_size?: number | undefined;
                hbd_interest_rate?: number | undefined;
            } & { [K_40 in Exclude<keyof I["witness_update"]["props"], keyof import("./legacy_chain_properties").legacy_chain_properties>]: never; }) | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_41 in Exclude<keyof I["witness_update"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_42 in Exclude<keyof I["witness_update"], keyof witness_update>]: never; }) | undefined;
        account_witness_vote?: ({
            account?: string | undefined;
            witness?: string | undefined;
            approve?: boolean | undefined;
        } & {
            account?: string | undefined;
            witness?: string | undefined;
            approve?: boolean | undefined;
        } & { [K_43 in Exclude<keyof I["account_witness_vote"], keyof account_witness_vote>]: never; }) | undefined;
        account_witness_proxy?: ({
            account?: string | undefined;
            proxy?: string | undefined;
        } & {
            account?: string | undefined;
            proxy?: string | undefined;
        } & { [K_44 in Exclude<keyof I["account_witness_proxy"], keyof account_witness_proxy>]: never; }) | undefined;
        pow?: ({
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
            } & { [K_45 in Exclude<keyof I["pow"]["work"], keyof import("./pow").pow_work>]: never; }) | undefined;
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
                } & { [K_46 in Exclude<keyof I["pow"]["props"]["account_creation_fee"], keyof import("./asset").asset>]: never; }) | undefined;
                maximum_block_size?: number | undefined;
                hbd_interest_rate?: number | undefined;
            } & { [K_47 in Exclude<keyof I["pow"]["props"], keyof import("./legacy_chain_properties").legacy_chain_properties>]: never; }) | undefined;
        } & { [K_48 in Exclude<keyof I["pow"], keyof pow>]: never; }) | undefined;
        custom?: ({
            required_auths?: string[] | undefined;
            id?: number | undefined;
            data?: string | undefined;
        } & {
            required_auths?: (string[] & string[] & { [K_49 in Exclude<keyof I["custom"]["required_auths"], keyof string[]>]: never; }) | undefined;
            id?: number | undefined;
            data?: string | undefined;
        } & { [K_50 in Exclude<keyof I["custom"], keyof custom>]: never; }) | undefined;
        witness_block_approve?: ({
            witness?: string | undefined;
            block_id?: string | undefined;
        } & {
            witness?: string | undefined;
            block_id?: string | undefined;
        } & { [K_51 in Exclude<keyof I["witness_block_approve"], keyof witness_block_approve>]: never; }) | undefined;
        delete_comment?: ({
            author?: string | undefined;
            permlink?: string | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
        } & { [K_52 in Exclude<keyof I["delete_comment"], keyof delete_comment>]: never; }) | undefined;
        custom_json?: ({
            required_auths?: string[] | undefined;
            required_posting_auths?: string[] | undefined;
            id?: string | undefined;
            json?: string | undefined;
        } & {
            required_auths?: (string[] & string[] & { [K_53 in Exclude<keyof I["custom_json"]["required_auths"], keyof string[]>]: never; }) | undefined;
            required_posting_auths?: (string[] & string[] & { [K_54 in Exclude<keyof I["custom_json"]["required_posting_auths"], keyof string[]>]: never; }) | undefined;
            id?: string | undefined;
            json?: string | undefined;
        } & { [K_55 in Exclude<keyof I["custom_json"], keyof custom_json>]: never; }) | undefined;
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
            } & { [K_56 in Exclude<keyof I["comment_options"]["max_accepted_payout"], keyof import("./asset").asset>]: never; }) | undefined;
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
                } & { [K_57 in Exclude<keyof I["comment_options"]["extensions"][number]["beneficiaries"][number], keyof import("./comment_options").beneficiary_route_type>]: never; })[] & { [K_58 in Exclude<keyof I["comment_options"]["extensions"][number]["beneficiaries"], keyof {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_59 in Exclude<keyof I["comment_options"]["extensions"][number], "beneficiaries">]: never; })[] & { [K_60 in Exclude<keyof I["comment_options"]["extensions"], keyof {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_61 in Exclude<keyof I["comment_options"], keyof comment_options>]: never; }) | undefined;
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
        } & { [K_62 in Exclude<keyof I["set_withdraw_vesting_route"], keyof set_withdraw_vesting_route>]: never; }) | undefined;
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
            } & { [K_63 in Exclude<keyof I["limit_order_create2"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
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
                } & { [K_64 in Exclude<keyof I["limit_order_create2"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                quote?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_65 in Exclude<keyof I["limit_order_create2"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_66 in Exclude<keyof I["limit_order_create2"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
            expiration?: string | undefined;
        } & { [K_67 in Exclude<keyof I["limit_order_create2"], keyof limit_order_create2>]: never; }) | undefined;
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
            } & { [K_68 in Exclude<keyof I["claim_account"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_69 in Exclude<keyof I["claim_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_70 in Exclude<keyof I["claim_account"]["extensions"][number], "void_t">]: never; })[] & { [K_71 in Exclude<keyof I["claim_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_72 in Exclude<keyof I["claim_account"], keyof claim_account>]: never; }) | undefined;
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
            }[] | undefined;
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
                } & { [K_73 in Exclude<keyof I["create_claimed_account"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_74 in Exclude<keyof I["create_claimed_account"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_75 in Exclude<keyof I["create_claimed_account"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_76 in Exclude<keyof I["create_claimed_account"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_77 in Exclude<keyof I["create_claimed_account"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_78 in Exclude<keyof I["create_claimed_account"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_79 in Exclude<keyof I["create_claimed_account"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_80 in Exclude<keyof I["create_claimed_account"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_81 in Exclude<keyof I["create_claimed_account"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_82 in Exclude<keyof I["create_claimed_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_83 in Exclude<keyof I["create_claimed_account"]["extensions"][number], "void_t">]: never; })[] & { [K_84 in Exclude<keyof I["create_claimed_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_85 in Exclude<keyof I["create_claimed_account"], keyof create_claimed_account>]: never; }) | undefined;
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
                } & { [K_86 in Exclude<keyof I["request_account_recovery"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_87 in Exclude<keyof I["request_account_recovery"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_88 in Exclude<keyof I["request_account_recovery"]["new_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_89 in Exclude<keyof I["request_account_recovery"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_90 in Exclude<keyof I["request_account_recovery"]["extensions"][number], "void_t">]: never; })[] & { [K_91 in Exclude<keyof I["request_account_recovery"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_92 in Exclude<keyof I["request_account_recovery"], keyof request_account_recovery>]: never; }) | undefined;
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
                } & { [K_93 in Exclude<keyof I["recover_account"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_94 in Exclude<keyof I["recover_account"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_95 in Exclude<keyof I["recover_account"]["new_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_96 in Exclude<keyof I["recover_account"]["recent_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_97 in Exclude<keyof I["recover_account"]["recent_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_98 in Exclude<keyof I["recover_account"]["recent_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_99 in Exclude<keyof I["recover_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_100 in Exclude<keyof I["recover_account"]["extensions"][number], "void_t">]: never; })[] & { [K_101 in Exclude<keyof I["recover_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_102 in Exclude<keyof I["recover_account"], keyof recover_account>]: never; }) | undefined;
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
                void_t?: ({} & {} & { [K_103 in Exclude<keyof I["change_recovery_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_104 in Exclude<keyof I["change_recovery_account"]["extensions"][number], "void_t">]: never; })[] & { [K_105 in Exclude<keyof I["change_recovery_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_106 in Exclude<keyof I["change_recovery_account"], keyof change_recovery_account>]: never; }) | undefined;
        escrow_transfer?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
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
            to_account?: string | undefined;
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
            } & { [K_107 in Exclude<keyof I["escrow_transfer"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_108 in Exclude<keyof I["escrow_transfer"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_109 in Exclude<keyof I["escrow_transfer"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            ratification_deadline?: string | undefined;
            escrow_expiration?: string | undefined;
            json_meta?: string | undefined;
        } & { [K_110 in Exclude<keyof I["escrow_transfer"], keyof escrow_transfer>]: never; }) | undefined;
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
        } & { [K_111 in Exclude<keyof I["escrow_dispute"], keyof escrow_dispute>]: never; }) | undefined;
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
            } & { [K_112 in Exclude<keyof I["escrow_release"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_113 in Exclude<keyof I["escrow_release"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_114 in Exclude<keyof I["escrow_release"], keyof escrow_release>]: never; }) | undefined;
        pow2?: ({
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
                    } & { [K_115 in Exclude<keyof I["pow2"]["work"]["pow2"]["input"], keyof import("./pow2").pow2_input>]: never; }) | undefined;
                    pow_summary?: number | undefined;
                } & { [K_116 in Exclude<keyof I["pow2"]["work"]["pow2"], keyof import("./pow2").pow2_pow>]: never; }) | undefined;
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
                    } & { [K_117 in Exclude<keyof I["pow2"]["work"]["equihash_pow"]["input"], keyof import("./pow2").pow2_input>]: never; }) | undefined;
                    proof?: ({
                        n?: number | undefined;
                        k?: number | undefined;
                        seed?: string | undefined;
                        inputs?: number[] | undefined;
                    } & {
                        n?: number | undefined;
                        k?: number | undefined;
                        seed?: string | undefined;
                        inputs?: (number[] & number[] & { [K_118 in Exclude<keyof I["pow2"]["work"]["equihash_pow"]["proof"]["inputs"], keyof number[]>]: never; }) | undefined;
                    } & { [K_119 in Exclude<keyof I["pow2"]["work"]["equihash_pow"]["proof"], keyof import("./pow2").equihash_proof>]: never; }) | undefined;
                    prev_block?: string | undefined;
                    pow_summary?: number | undefined;
                } & { [K_120 in Exclude<keyof I["pow2"]["work"]["equihash_pow"], keyof import("./pow2").equihash_pow>]: never; }) | undefined;
            } & { [K_121 in Exclude<keyof I["pow2"]["work"], keyof import("./pow2").pow2_work>]: never; }) | undefined;
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
                } & { [K_122 in Exclude<keyof I["pow2"]["props"]["account_creation_fee"], keyof import("./asset").asset>]: never; }) | undefined;
                maximum_block_size?: number | undefined;
                hbd_interest_rate?: number | undefined;
            } & { [K_123 in Exclude<keyof I["pow2"]["props"], keyof import("./legacy_chain_properties").legacy_chain_properties>]: never; }) | undefined;
        } & { [K_124 in Exclude<keyof I["pow2"], keyof pow2>]: never; }) | undefined;
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
        } & { [K_125 in Exclude<keyof I["escrow_approve"], keyof escrow_approve>]: never; }) | undefined;
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
            } & { [K_126 in Exclude<keyof I["transfer_to_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_127 in Exclude<keyof I["transfer_to_savings"], keyof transfer_to_savings>]: never; }) | undefined;
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
            } & { [K_128 in Exclude<keyof I["transfer_from_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_129 in Exclude<keyof I["transfer_from_savings"], keyof transfer_from_savings>]: never; }) | undefined;
        cancel_transfer_from_savings?: ({
            from_account?: string | undefined;
            request_id?: number | undefined;
        } & {
            from_account?: string | undefined;
            request_id?: number | undefined;
        } & { [K_130 in Exclude<keyof I["cancel_transfer_from_savings"], keyof cancel_transfer_from_savings>]: never; }) | undefined;
        decline_voting_rights?: ({
            account?: string | undefined;
            decline?: boolean | undefined;
        } & {
            account?: string | undefined;
            decline?: boolean | undefined;
        } & { [K_131 in Exclude<keyof I["decline_voting_rights"], keyof decline_voting_rights>]: never; }) | undefined;
        claim_reward_balance?: ({
            account?: string | undefined;
            reward_hive?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            reward_hbd?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            reward_vests?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            account?: string | undefined;
            reward_hive?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_132 in Exclude<keyof I["claim_reward_balance"]["reward_hive"], keyof import("./asset").asset>]: never; }) | undefined;
            reward_hbd?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_133 in Exclude<keyof I["claim_reward_balance"]["reward_hbd"], keyof import("./asset").asset>]: never; }) | undefined;
            reward_vests?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_134 in Exclude<keyof I["claim_reward_balance"]["reward_vests"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_135 in Exclude<keyof I["claim_reward_balance"], keyof claim_reward_balance>]: never; }) | undefined;
        delegate_vesting_shares?: ({
            delegator?: string | undefined;
            delegatee?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            delegator?: string | undefined;
            delegatee?: string | undefined;
            vesting_shares?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_136 in Exclude<keyof I["delegate_vesting_shares"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_137 in Exclude<keyof I["delegate_vesting_shares"], keyof delegate_vesting_shares>]: never; }) | undefined;
        account_create_with_delegation?: ({
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            delegation?: {
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
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_138 in Exclude<keyof I["account_create_with_delegation"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            delegation?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_139 in Exclude<keyof I["account_create_with_delegation"]["delegation"], keyof import("./asset").asset>]: never; }) | undefined;
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
                } & { [K_140 in Exclude<keyof I["account_create_with_delegation"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_141 in Exclude<keyof I["account_create_with_delegation"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_142 in Exclude<keyof I["account_create_with_delegation"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_143 in Exclude<keyof I["account_create_with_delegation"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_144 in Exclude<keyof I["account_create_with_delegation"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_145 in Exclude<keyof I["account_create_with_delegation"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_146 in Exclude<keyof I["account_create_with_delegation"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_147 in Exclude<keyof I["account_create_with_delegation"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_148 in Exclude<keyof I["account_create_with_delegation"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_149 in Exclude<keyof I["account_create_with_delegation"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_150 in Exclude<keyof I["account_create_with_delegation"]["extensions"][number], "void_t">]: never; })[] & { [K_151 in Exclude<keyof I["account_create_with_delegation"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_152 in Exclude<keyof I["account_create_with_delegation"], keyof account_create_with_delegation>]: never; }) | undefined;
        witness_set_properties?: ({
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
            } & { [K_153 in Exclude<keyof I["witness_set_properties"]["props"], string | number>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_154 in Exclude<keyof I["witness_set_properties"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_155 in Exclude<keyof I["witness_set_properties"]["extensions"][number], "void_t">]: never; })[] & { [K_156 in Exclude<keyof I["witness_set_properties"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_157 in Exclude<keyof I["witness_set_properties"], keyof witness_set_properties>]: never; }) | undefined;
        account_update2?: ({
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
            posting_json_metadata?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
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
                } & { [K_158 in Exclude<keyof I["account_update2"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_159 in Exclude<keyof I["account_update2"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_160 in Exclude<keyof I["account_update2"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_161 in Exclude<keyof I["account_update2"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_162 in Exclude<keyof I["account_update2"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_163 in Exclude<keyof I["account_update2"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_164 in Exclude<keyof I["account_update2"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_165 in Exclude<keyof I["account_update2"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_166 in Exclude<keyof I["account_update2"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
            posting_json_metadata?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_167 in Exclude<keyof I["account_update2"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_168 in Exclude<keyof I["account_update2"]["extensions"][number], "void_t">]: never; })[] & { [K_169 in Exclude<keyof I["account_update2"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_170 in Exclude<keyof I["account_update2"], keyof account_update2>]: never; }) | undefined;
        create_proposal?: ({
            creator?: string | undefined;
            receiver?: string | undefined;
            start_date?: string | undefined;
            end_date?: string | undefined;
            daily_pay?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            subject?: string | undefined;
            permlink?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            creator?: string | undefined;
            receiver?: string | undefined;
            start_date?: string | undefined;
            end_date?: string | undefined;
            daily_pay?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_171 in Exclude<keyof I["create_proposal"]["daily_pay"], keyof import("./asset").asset>]: never; }) | undefined;
            subject?: string | undefined;
            permlink?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_172 in Exclude<keyof I["create_proposal"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_173 in Exclude<keyof I["create_proposal"]["extensions"][number], "void_t">]: never; })[] & { [K_174 in Exclude<keyof I["create_proposal"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_175 in Exclude<keyof I["create_proposal"], keyof create_proposal>]: never; }) | undefined;
        update_proposal_votes?: ({
            voter?: string | undefined;
            proposal_ids?: string[] | undefined;
            approve?: boolean | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            voter?: string | undefined;
            proposal_ids?: (string[] & string[] & { [K_176 in Exclude<keyof I["update_proposal_votes"]["proposal_ids"], keyof string[]>]: never; }) | undefined;
            approve?: boolean | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_177 in Exclude<keyof I["update_proposal_votes"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_178 in Exclude<keyof I["update_proposal_votes"]["extensions"][number], "void_t">]: never; })[] & { [K_179 in Exclude<keyof I["update_proposal_votes"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_180 in Exclude<keyof I["update_proposal_votes"], keyof update_proposal_votes>]: never; }) | undefined;
        remove_proposal?: ({
            proposal_owner?: string | undefined;
            proposal_ids?: string[] | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            proposal_owner?: string | undefined;
            proposal_ids?: (string[] & string[] & { [K_181 in Exclude<keyof I["remove_proposal"]["proposal_ids"], keyof string[]>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_182 in Exclude<keyof I["remove_proposal"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_183 in Exclude<keyof I["remove_proposal"]["extensions"][number], "void_t">]: never; })[] & { [K_184 in Exclude<keyof I["remove_proposal"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_185 in Exclude<keyof I["remove_proposal"], keyof remove_proposal>]: never; }) | undefined;
        update_proposal?: ({
            proposal_id?: string | undefined;
            creator?: string | undefined;
            daily_pay?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            subject?: string | undefined;
            permlink?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
                update_proposal_end_date?: {
                    end_date?: string | undefined;
                } | undefined;
            }[] | undefined;
        } & {
            proposal_id?: string | undefined;
            creator?: string | undefined;
            daily_pay?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_186 in Exclude<keyof I["update_proposal"]["daily_pay"], keyof import("./asset").asset>]: never; }) | undefined;
            subject?: string | undefined;
            permlink?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
                update_proposal_end_date?: {
                    end_date?: string | undefined;
                } | undefined;
            }[] & ({
                void_t?: {} | undefined;
                update_proposal_end_date?: {
                    end_date?: string | undefined;
                } | undefined;
            } & {
                void_t?: ({} & {} & { [K_187 in Exclude<keyof I["update_proposal"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                update_proposal_end_date?: ({
                    end_date?: string | undefined;
                } & {
                    end_date?: string | undefined;
                } & { [K_188 in Exclude<keyof I["update_proposal"]["extensions"][number]["update_proposal_end_date"], "end_date">]: never; }) | undefined;
            } & { [K_189 in Exclude<keyof I["update_proposal"]["extensions"][number], keyof import("./update_proposal").update_proposal_extension>]: never; })[] & { [K_190 in Exclude<keyof I["update_proposal"]["extensions"], keyof {
                void_t?: {} | undefined;
                update_proposal_end_date?: {
                    end_date?: string | undefined;
                } | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_191 in Exclude<keyof I["update_proposal"], keyof update_proposal>]: never; }) | undefined;
        collateralized_convert?: ({
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
            } & { [K_192 in Exclude<keyof I["collateralized_convert"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_193 in Exclude<keyof I["collateralized_convert"], keyof collateralized_convert>]: never; }) | undefined;
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
            } & { [K_194 in Exclude<keyof I["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                void_t?: ({} & {} & { [K_195 in Exclude<keyof I["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                recurrent_transfer_pair_id?: ({
                    pair_id?: number | undefined;
                } & {
                    pair_id?: number | undefined;
                } & { [K_196 in Exclude<keyof I["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
            } & { [K_197 in Exclude<keyof I["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_198 in Exclude<keyof I["recurrent_transfer"]["extensions"], keyof {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_199 in Exclude<keyof I["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
        fill_convert_request?: ({
            owner?: string | undefined;
            requestid?: number | undefined;
            amount_in?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            amount_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount_in?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_200 in Exclude<keyof I["fill_convert_request"]["amount_in"], keyof import("./asset").asset>]: never; }) | undefined;
            amount_out?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_201 in Exclude<keyof I["fill_convert_request"]["amount_out"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_202 in Exclude<keyof I["fill_convert_request"], keyof fill_convert_request>]: never; }) | undefined;
        author_reward?: ({
            author?: string | undefined;
            permlink?: string | undefined;
            hbd_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            curators_vesting_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
            hbd_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_203 in Exclude<keyof I["author_reward"]["hbd_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_204 in Exclude<keyof I["author_reward"]["hive_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            vesting_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_205 in Exclude<keyof I["author_reward"]["vesting_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            curators_vesting_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_206 in Exclude<keyof I["author_reward"]["curators_vesting_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } & { [K_207 in Exclude<keyof I["author_reward"], keyof author_reward>]: never; }) | undefined;
        curation_reward?: ({
            curator?: string | undefined;
            reward?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            comment_author?: string | undefined;
            comment_permlink?: string | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } & {
            curator?: string | undefined;
            reward?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_208 in Exclude<keyof I["curation_reward"]["reward"], keyof import("./asset").asset>]: never; }) | undefined;
            comment_author?: string | undefined;
            comment_permlink?: string | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } & { [K_209 in Exclude<keyof I["curation_reward"], keyof curation_reward>]: never; }) | undefined;
        comment_reward?: ({
            author?: string | undefined;
            permlink?: string | undefined;
            payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            author_rewards?: string | undefined;
            total_payout_value?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            curator_payout_value?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            beneficiary_payout_value?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
            payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_210 in Exclude<keyof I["comment_reward"]["payout"], keyof import("./asset").asset>]: never; }) | undefined;
            author_rewards?: string | undefined;
            total_payout_value?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_211 in Exclude<keyof I["comment_reward"]["total_payout_value"], keyof import("./asset").asset>]: never; }) | undefined;
            curator_payout_value?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_212 in Exclude<keyof I["comment_reward"]["curator_payout_value"], keyof import("./asset").asset>]: never; }) | undefined;
            beneficiary_payout_value?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_213 in Exclude<keyof I["comment_reward"]["beneficiary_payout_value"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_214 in Exclude<keyof I["comment_reward"], keyof comment_reward>]: never; }) | undefined;
        liquidity_reward?: ({
            owner?: string | undefined;
            payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_215 in Exclude<keyof I["liquidity_reward"]["payout"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_216 in Exclude<keyof I["liquidity_reward"], keyof liquidity_reward>]: never; }) | undefined;
        interest?: ({
            owner?: string | undefined;
            interest?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            is_saved_into_hbd_balance?: boolean | undefined;
        } & {
            owner?: string | undefined;
            interest?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_217 in Exclude<keyof I["interest"]["interest"], keyof import("./asset").asset>]: never; }) | undefined;
            is_saved_into_hbd_balance?: boolean | undefined;
        } & { [K_218 in Exclude<keyof I["interest"], keyof interest>]: never; }) | undefined;
        fill_vesting_withdraw?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            withdrawn?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            deposited?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            withdrawn?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_219 in Exclude<keyof I["fill_vesting_withdraw"]["withdrawn"], keyof import("./asset").asset>]: never; }) | undefined;
            deposited?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_220 in Exclude<keyof I["fill_vesting_withdraw"]["deposited"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_221 in Exclude<keyof I["fill_vesting_withdraw"], keyof fill_vesting_withdraw>]: never; }) | undefined;
        fill_order?: ({
            current_owner?: string | undefined;
            current_orderid?: number | undefined;
            current_pays?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            open_owner?: string | undefined;
            open_orderid?: number | undefined;
            open_pays?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            current_owner?: string | undefined;
            current_orderid?: number | undefined;
            current_pays?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_222 in Exclude<keyof I["fill_order"]["current_pays"], keyof import("./asset").asset>]: never; }) | undefined;
            open_owner?: string | undefined;
            open_orderid?: number | undefined;
            open_pays?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_223 in Exclude<keyof I["fill_order"]["open_pays"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_224 in Exclude<keyof I["fill_order"], keyof fill_order>]: never; }) | undefined;
        shutdown_witness?: ({
            owner?: string | undefined;
        } & {
            owner?: string | undefined;
        } & { [K_225 in Exclude<keyof I["shutdown_witness"], "owner">]: never; }) | undefined;
        fill_transfer_from_savings?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            request_id?: number | undefined;
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
            } & { [K_226 in Exclude<keyof I["fill_transfer_from_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            request_id?: number | undefined;
            memo?: string | undefined;
        } & { [K_227 in Exclude<keyof I["fill_transfer_from_savings"], keyof fill_transfer_from_savings>]: never; }) | undefined;
        hardfork?: ({
            hardfork_id?: number | undefined;
        } & {
            hardfork_id?: number | undefined;
        } & { [K_228 in Exclude<keyof I["hardfork"], "hardfork_id">]: never; }) | undefined;
        comment_payout_update?: ({
            author?: string | undefined;
            permlink?: string | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
        } & { [K_229 in Exclude<keyof I["comment_payout_update"], keyof comment_payout_update>]: never; }) | undefined;
        return_vesting_delegation?: ({
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
            } & { [K_230 in Exclude<keyof I["return_vesting_delegation"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_231 in Exclude<keyof I["return_vesting_delegation"], keyof return_vesting_delegation>]: never; }) | undefined;
        comment_benefactor_reward?: ({
            benefactor?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            hbd_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } & {
            benefactor?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            hbd_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_232 in Exclude<keyof I["comment_benefactor_reward"]["hbd_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_233 in Exclude<keyof I["comment_benefactor_reward"]["hive_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            vesting_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_234 in Exclude<keyof I["comment_benefactor_reward"]["vesting_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } & { [K_235 in Exclude<keyof I["comment_benefactor_reward"], keyof comment_benefactor_reward>]: never; }) | undefined;
        producer_reward?: ({
            producer?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            producer?: string | undefined;
            vesting_shares?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_236 in Exclude<keyof I["producer_reward"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_237 in Exclude<keyof I["producer_reward"], keyof producer_reward>]: never; }) | undefined;
        clear_null_account_balance?: ({
            total_cleared?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[] | undefined;
        } & {
            total_cleared?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[] & ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_238 in Exclude<keyof I["clear_null_account_balance"]["total_cleared"][number], keyof import("./asset").asset>]: never; })[] & { [K_239 in Exclude<keyof I["clear_null_account_balance"]["total_cleared"], keyof {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_240 in Exclude<keyof I["clear_null_account_balance"], "total_cleared">]: never; }) | undefined;
        proposal_pay?: ({
            proposal_id?: number | undefined;
            receiver?: string | undefined;
            payer?: string | undefined;
            payment?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            proposal_id?: number | undefined;
            receiver?: string | undefined;
            payer?: string | undefined;
            payment?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_241 in Exclude<keyof I["proposal_pay"]["payment"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_242 in Exclude<keyof I["proposal_pay"], keyof proposal_pay>]: never; }) | undefined;
        dhf_funding?: ({
            treasury?: string | undefined;
            additional_funds?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            treasury?: string | undefined;
            additional_funds?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_243 in Exclude<keyof I["dhf_funding"]["additional_funds"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_244 in Exclude<keyof I["dhf_funding"], keyof dhf_funding>]: never; }) | undefined;
        hardfork_hive?: ({
            account?: string | undefined;
            treasury?: string | undefined;
            other_affected_accounts?: string[] | undefined;
            hbd_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vests_converted?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            total_hive_from_vests?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            account?: string | undefined;
            treasury?: string | undefined;
            other_affected_accounts?: (string[] & string[] & { [K_245 in Exclude<keyof I["hardfork_hive"]["other_affected_accounts"], keyof string[]>]: never; }) | undefined;
            hbd_transferred?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_246 in Exclude<keyof I["hardfork_hive"]["hbd_transferred"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_transferred?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_247 in Exclude<keyof I["hardfork_hive"]["hive_transferred"], keyof import("./asset").asset>]: never; }) | undefined;
            vests_converted?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_248 in Exclude<keyof I["hardfork_hive"]["vests_converted"], keyof import("./asset").asset>]: never; }) | undefined;
            total_hive_from_vests?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_249 in Exclude<keyof I["hardfork_hive"]["total_hive_from_vests"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_250 in Exclude<keyof I["hardfork_hive"], keyof hardfork_hive>]: never; }) | undefined;
        hardfork_hive_restore?: ({
            account?: string | undefined;
            treasury?: string | undefined;
            hbd_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            account?: string | undefined;
            treasury?: string | undefined;
            hbd_transferred?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_251 in Exclude<keyof I["hardfork_hive_restore"]["hbd_transferred"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_transferred?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_252 in Exclude<keyof I["hardfork_hive_restore"]["hive_transferred"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_253 in Exclude<keyof I["hardfork_hive_restore"], keyof hardfork_hive_restore>]: never; }) | undefined;
        delayed_voting?: ({
            voter?: string | undefined;
            votes?: string | undefined;
        } & {
            voter?: string | undefined;
            votes?: string | undefined;
        } & { [K_254 in Exclude<keyof I["delayed_voting"], keyof delayed_voting>]: never; }) | undefined;
        consolidate_treasury_balance?: ({
            total_moved?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[] | undefined;
        } & {
            total_moved?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[] & ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_255 in Exclude<keyof I["consolidate_treasury_balance"]["total_moved"][number], keyof import("./asset").asset>]: never; })[] & { [K_256 in Exclude<keyof I["consolidate_treasury_balance"]["total_moved"], keyof {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_257 in Exclude<keyof I["consolidate_treasury_balance"], "total_moved">]: never; }) | undefined;
        effective_comment_vote?: ({
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: string | undefined;
            rshares?: string | undefined;
            total_vote_weight?: string | undefined;
            pending_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: string | undefined;
            rshares?: string | undefined;
            total_vote_weight?: string | undefined;
            pending_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_258 in Exclude<keyof I["effective_comment_vote"]["pending_payout"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_259 in Exclude<keyof I["effective_comment_vote"], keyof effective_comment_vote>]: never; }) | undefined;
        ineffective_delete_comment?: ({
            author?: string | undefined;
            permlink?: string | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
        } & { [K_260 in Exclude<keyof I["ineffective_delete_comment"], keyof ineffective_delete_comment>]: never; }) | undefined;
        dhf_conversion?: ({
            treasury?: string | undefined;
            hive_amount_in?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hbd_amount_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            treasury?: string | undefined;
            hive_amount_in?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_261 in Exclude<keyof I["dhf_conversion"]["hive_amount_in"], keyof import("./asset").asset>]: never; }) | undefined;
            hbd_amount_out?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_262 in Exclude<keyof I["dhf_conversion"]["hbd_amount_out"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_263 in Exclude<keyof I["dhf_conversion"], keyof dhf_conversion>]: never; }) | undefined;
        expired_account_notification?: ({
            account?: string | undefined;
        } & {
            account?: string | undefined;
        } & { [K_264 in Exclude<keyof I["expired_account_notification"], "account">]: never; }) | undefined;
        changed_recovery_account?: ({
            account?: string | undefined;
            old_recovery_account?: string | undefined;
            new_recovery_account?: string | undefined;
        } & {
            account?: string | undefined;
            old_recovery_account?: string | undefined;
            new_recovery_account?: string | undefined;
        } & { [K_265 in Exclude<keyof I["changed_recovery_account"], keyof changed_recovery_account>]: never; }) | undefined;
        transfer_to_vesting_completed?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            hive_vested?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_shares_received?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            hive_vested?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_266 in Exclude<keyof I["transfer_to_vesting_completed"]["hive_vested"], keyof import("./asset").asset>]: never; }) | undefined;
            vesting_shares_received?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_267 in Exclude<keyof I["transfer_to_vesting_completed"]["vesting_shares_received"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_268 in Exclude<keyof I["transfer_to_vesting_completed"], keyof transfer_to_vesting_completed>]: never; }) | undefined;
        pow_reward?: ({
            worker?: string | undefined;
            reward?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            worker?: string | undefined;
            reward?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_269 in Exclude<keyof I["pow_reward"]["reward"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_270 in Exclude<keyof I["pow_reward"], keyof pow_reward>]: never; }) | undefined;
        vesting_shares_split?: ({
            owner?: string | undefined;
            vesting_shares_before_split?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_shares_after_split?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            vesting_shares_before_split?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_271 in Exclude<keyof I["vesting_shares_split"]["vesting_shares_before_split"], keyof import("./asset").asset>]: never; }) | undefined;
            vesting_shares_after_split?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_272 in Exclude<keyof I["vesting_shares_split"]["vesting_shares_after_split"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_273 in Exclude<keyof I["vesting_shares_split"], keyof vesting_shares_split>]: never; }) | undefined;
        account_created?: ({
            new_account_name?: string | undefined;
            creator?: string | undefined;
            initial_vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            initial_delegation?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            new_account_name?: string | undefined;
            creator?: string | undefined;
            initial_vesting_shares?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_274 in Exclude<keyof I["account_created"]["initial_vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
            initial_delegation?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_275 in Exclude<keyof I["account_created"]["initial_delegation"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_276 in Exclude<keyof I["account_created"], keyof account_created>]: never; }) | undefined;
        fill_collateralized_convert_request?: ({
            owner?: string | undefined;
            requestid?: number | undefined;
            amount_in?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            amount_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            excess_collateral?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount_in?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_277 in Exclude<keyof I["fill_collateralized_convert_request"]["amount_in"], keyof import("./asset").asset>]: never; }) | undefined;
            amount_out?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_278 in Exclude<keyof I["fill_collateralized_convert_request"]["amount_out"], keyof import("./asset").asset>]: never; }) | undefined;
            excess_collateral?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_279 in Exclude<keyof I["fill_collateralized_convert_request"]["excess_collateral"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_280 in Exclude<keyof I["fill_collateralized_convert_request"], keyof fill_collateralized_convert_request>]: never; }) | undefined;
        system_warning?: ({
            message?: string | undefined;
        } & {
            message?: string | undefined;
        } & { [K_281 in Exclude<keyof I["system_warning"], "message">]: never; }) | undefined;
        fill_recurrent_transfer?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
            remaining_executions?: number | undefined;
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
            } & { [K_282 in Exclude<keyof I["fill_recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
            remaining_executions?: number | undefined;
        } & { [K_283 in Exclude<keyof I["fill_recurrent_transfer"], keyof fill_recurrent_transfer>]: never; }) | undefined;
        failed_recurrent_transfer?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
            consecutive_failures?: number | undefined;
            remaining_executions?: number | undefined;
            deleted?: boolean | undefined;
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
            } & { [K_284 in Exclude<keyof I["failed_recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
            consecutive_failures?: number | undefined;
            remaining_executions?: number | undefined;
            deleted?: boolean | undefined;
        } & { [K_285 in Exclude<keyof I["failed_recurrent_transfer"], keyof failed_recurrent_transfer>]: never; }) | undefined;
        limit_order_cancelled?: ({
            seller?: string | undefined;
            orderid?: number | undefined;
            amount_back?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            seller?: string | undefined;
            orderid?: number | undefined;
            amount_back?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_286 in Exclude<keyof I["limit_order_cancelled"]["amount_back"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_287 in Exclude<keyof I["limit_order_cancelled"], keyof limit_order_cancelled>]: never; }) | undefined;
        producer_missed?: ({
            producer?: string | undefined;
        } & {
            producer?: string | undefined;
        } & { [K_288 in Exclude<keyof I["producer_missed"], "producer">]: never; }) | undefined;
        proposal_fee?: ({
            creator?: string | undefined;
            treasury?: string | undefined;
            proposal_id?: number | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            creator?: string | undefined;
            treasury?: string | undefined;
            proposal_id?: number | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_289 in Exclude<keyof I["proposal_fee"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_290 in Exclude<keyof I["proposal_fee"], keyof proposal_fee>]: never; }) | undefined;
        collateralized_convert_immediate_conversion?: ({
            owner?: string | undefined;
            requestid?: number | undefined;
            hbd_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            requestid?: number | undefined;
            hbd_out?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_291 in Exclude<keyof I["collateralized_convert_immediate_conversion"]["hbd_out"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_292 in Exclude<keyof I["collateralized_convert_immediate_conversion"], keyof collateralized_convert_immediate_conversion>]: never; }) | undefined;
        escrow_approved?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            escrow_id?: number | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            escrow_id?: number | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_293 in Exclude<keyof I["escrow_approved"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_294 in Exclude<keyof I["escrow_approved"], keyof escrow_approved>]: never; }) | undefined;
        escrow_rejected?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
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
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
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
            } & { [K_295 in Exclude<keyof I["escrow_rejected"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_296 in Exclude<keyof I["escrow_rejected"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_297 in Exclude<keyof I["escrow_rejected"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_298 in Exclude<keyof I["escrow_rejected"], keyof escrow_rejected>]: never; }) | undefined;
        proxy_cleared?: ({
            account?: string | undefined;
            proxy?: string | undefined;
        } & {
            account?: string | undefined;
            proxy?: string | undefined;
        } & { [K_299 in Exclude<keyof I["proxy_cleared"], keyof proxy_cleared>]: never; }) | undefined;
        declined_voting_rights?: ({
            account?: string | undefined;
        } & {
            account?: string | undefined;
        } & { [K_300 in Exclude<keyof I["declined_voting_rights"], "account">]: never; }) | undefined;
    } & { [K_301 in Exclude<keyof I, keyof operation>]: never; }>(base?: I | undefined): operation;
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
        witness_update?: {
            owner?: string | undefined;
            url?: string | undefined;
            block_signing_key?: string | undefined;
            props?: {
                account_creation_fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                maximum_block_size?: number | undefined;
                hbd_interest_rate?: number | undefined;
            } | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
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
        pow?: {
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
            }[] | undefined;
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
            to_account?: string | undefined;
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
        pow2?: {
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
        claim_reward_balance?: {
            account?: string | undefined;
            reward_hive?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            reward_hbd?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            reward_vests?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        delegate_vesting_shares?: {
            delegator?: string | undefined;
            delegatee?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        account_create_with_delegation?: {
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            delegation?: {
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
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        witness_set_properties?: {
            owner?: string | undefined;
            props?: {
                [x: string]: string | undefined;
            } | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        account_update2?: {
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
            posting_json_metadata?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        create_proposal?: {
            creator?: string | undefined;
            receiver?: string | undefined;
            start_date?: string | undefined;
            end_date?: string | undefined;
            daily_pay?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            subject?: string | undefined;
            permlink?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        update_proposal_votes?: {
            voter?: string | undefined;
            proposal_ids?: string[] | undefined;
            approve?: boolean | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        remove_proposal?: {
            proposal_owner?: string | undefined;
            proposal_ids?: string[] | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } | undefined;
        update_proposal?: {
            proposal_id?: string | undefined;
            creator?: string | undefined;
            daily_pay?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            subject?: string | undefined;
            permlink?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
                update_proposal_end_date?: {
                    end_date?: string | undefined;
                } | undefined;
            }[] | undefined;
        } | undefined;
        collateralized_convert?: {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
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
        fill_convert_request?: {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount_in?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            amount_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        author_reward?: {
            author?: string | undefined;
            permlink?: string | undefined;
            hbd_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            curators_vesting_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } | undefined;
        curation_reward?: {
            curator?: string | undefined;
            reward?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            comment_author?: string | undefined;
            comment_permlink?: string | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } | undefined;
        comment_reward?: {
            author?: string | undefined;
            permlink?: string | undefined;
            payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            author_rewards?: string | undefined;
            total_payout_value?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            curator_payout_value?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            beneficiary_payout_value?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        liquidity_reward?: {
            owner?: string | undefined;
            payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        interest?: {
            owner?: string | undefined;
            interest?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            is_saved_into_hbd_balance?: boolean | undefined;
        } | undefined;
        fill_vesting_withdraw?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            withdrawn?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            deposited?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        fill_order?: {
            current_owner?: string | undefined;
            current_orderid?: number | undefined;
            current_pays?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            open_owner?: string | undefined;
            open_orderid?: number | undefined;
            open_pays?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        shutdown_witness?: {
            owner?: string | undefined;
        } | undefined;
        fill_transfer_from_savings?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            request_id?: number | undefined;
            memo?: string | undefined;
        } | undefined;
        hardfork?: {
            hardfork_id?: number | undefined;
        } | undefined;
        comment_payout_update?: {
            author?: string | undefined;
            permlink?: string | undefined;
        } | undefined;
        return_vesting_delegation?: {
            account?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        comment_benefactor_reward?: {
            benefactor?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            hbd_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } | undefined;
        producer_reward?: {
            producer?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        clear_null_account_balance?: {
            total_cleared?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[] | undefined;
        } | undefined;
        proposal_pay?: {
            proposal_id?: number | undefined;
            receiver?: string | undefined;
            payer?: string | undefined;
            payment?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        dhf_funding?: {
            treasury?: string | undefined;
            additional_funds?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        hardfork_hive?: {
            account?: string | undefined;
            treasury?: string | undefined;
            other_affected_accounts?: string[] | undefined;
            hbd_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vests_converted?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            total_hive_from_vests?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        hardfork_hive_restore?: {
            account?: string | undefined;
            treasury?: string | undefined;
            hbd_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        delayed_voting?: {
            voter?: string | undefined;
            votes?: string | undefined;
        } | undefined;
        consolidate_treasury_balance?: {
            total_moved?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[] | undefined;
        } | undefined;
        effective_comment_vote?: {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: string | undefined;
            rshares?: string | undefined;
            total_vote_weight?: string | undefined;
            pending_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        ineffective_delete_comment?: {
            author?: string | undefined;
            permlink?: string | undefined;
        } | undefined;
        dhf_conversion?: {
            treasury?: string | undefined;
            hive_amount_in?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hbd_amount_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        expired_account_notification?: {
            account?: string | undefined;
        } | undefined;
        changed_recovery_account?: {
            account?: string | undefined;
            old_recovery_account?: string | undefined;
            new_recovery_account?: string | undefined;
        } | undefined;
        transfer_to_vesting_completed?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            hive_vested?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_shares_received?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        pow_reward?: {
            worker?: string | undefined;
            reward?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        vesting_shares_split?: {
            owner?: string | undefined;
            vesting_shares_before_split?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_shares_after_split?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        account_created?: {
            new_account_name?: string | undefined;
            creator?: string | undefined;
            initial_vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            initial_delegation?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        fill_collateralized_convert_request?: {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount_in?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            amount_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            excess_collateral?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        system_warning?: {
            message?: string | undefined;
        } | undefined;
        fill_recurrent_transfer?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
            remaining_executions?: number | undefined;
        } | undefined;
        failed_recurrent_transfer?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
            consecutive_failures?: number | undefined;
            remaining_executions?: number | undefined;
            deleted?: boolean | undefined;
        } | undefined;
        limit_order_cancelled?: {
            seller?: string | undefined;
            orderid?: number | undefined;
            amount_back?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        producer_missed?: {
            producer?: string | undefined;
        } | undefined;
        proposal_fee?: {
            creator?: string | undefined;
            treasury?: string | undefined;
            proposal_id?: number | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        collateralized_convert_immediate_conversion?: {
            owner?: string | undefined;
            requestid?: number | undefined;
            hbd_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        escrow_approved?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            escrow_id?: number | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } | undefined;
        escrow_rejected?: {
            from_account?: string | undefined;
            to_account?: string | undefined;
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
        } | undefined;
        proxy_cleared?: {
            account?: string | undefined;
            proxy?: string | undefined;
        } | undefined;
        declined_voting_rights?: {
            account?: string | undefined;
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
        } & { [K_302 in Exclude<keyof I_1["vote"], keyof vote>]: never; }) | undefined;
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
        } & { [K_303 in Exclude<keyof I_1["comment"], keyof comment>]: never; }) | undefined;
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
            } & { [K_304 in Exclude<keyof I_1["transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_305 in Exclude<keyof I_1["transfer"], keyof transfer>]: never; }) | undefined;
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
            } & { [K_306 in Exclude<keyof I_1["transfer_to_vesting"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_307 in Exclude<keyof I_1["transfer_to_vesting"], keyof transfer_to_vesting>]: never; }) | undefined;
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
            } & { [K_308 in Exclude<keyof I_1["withdraw_vesting"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_309 in Exclude<keyof I_1["withdraw_vesting"], keyof withdraw_vesting>]: never; }) | undefined;
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
            } & { [K_310 in Exclude<keyof I_1["limit_order_create"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
            min_to_receive?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_311 in Exclude<keyof I_1["limit_order_create"]["min_to_receive"], keyof import("./asset").asset>]: never; }) | undefined;
            fill_or_kill?: boolean | undefined;
            expiration?: string | undefined;
        } & { [K_312 in Exclude<keyof I_1["limit_order_create"], keyof limit_order_create>]: never; }) | undefined;
        limit_order_cancel?: ({
            order?: string | undefined;
            orderid?: number | undefined;
        } & {
            order?: string | undefined;
            orderid?: number | undefined;
        } & { [K_313 in Exclude<keyof I_1["limit_order_cancel"], keyof limit_order_cancel>]: never; }) | undefined;
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
                } & { [K_314 in Exclude<keyof I_1["feed_publish"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                quote?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_315 in Exclude<keyof I_1["feed_publish"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_316 in Exclude<keyof I_1["feed_publish"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
        } & { [K_317 in Exclude<keyof I_1["feed_publish"], keyof feed_publish>]: never; }) | undefined;
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
            } & { [K_318 in Exclude<keyof I_1["convert"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_319 in Exclude<keyof I_1["convert"], keyof convert>]: never; }) | undefined;
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
            } & { [K_320 in Exclude<keyof I_1["account_create"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
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
                } & { [K_321 in Exclude<keyof I_1["account_create"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_322 in Exclude<keyof I_1["account_create"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_323 in Exclude<keyof I_1["account_create"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_324 in Exclude<keyof I_1["account_create"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_325 in Exclude<keyof I_1["account_create"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_326 in Exclude<keyof I_1["account_create"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_327 in Exclude<keyof I_1["account_create"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_328 in Exclude<keyof I_1["account_create"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_329 in Exclude<keyof I_1["account_create"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_330 in Exclude<keyof I_1["account_create"], keyof account_create>]: never; }) | undefined;
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
                } & { [K_331 in Exclude<keyof I_1["account_update"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_332 in Exclude<keyof I_1["account_update"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_333 in Exclude<keyof I_1["account_update"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_334 in Exclude<keyof I_1["account_update"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_335 in Exclude<keyof I_1["account_update"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_336 in Exclude<keyof I_1["account_update"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_337 in Exclude<keyof I_1["account_update"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_338 in Exclude<keyof I_1["account_update"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_339 in Exclude<keyof I_1["account_update"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
        } & { [K_340 in Exclude<keyof I_1["account_update"], keyof account_update>]: never; }) | undefined;
        witness_update?: ({
            owner?: string | undefined;
            url?: string | undefined;
            block_signing_key?: string | undefined;
            props?: {
                account_creation_fee?: {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } | undefined;
                maximum_block_size?: number | undefined;
                hbd_interest_rate?: number | undefined;
            } | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            url?: string | undefined;
            block_signing_key?: string | undefined;
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
                } & { [K_341 in Exclude<keyof I_1["witness_update"]["props"]["account_creation_fee"], keyof import("./asset").asset>]: never; }) | undefined;
                maximum_block_size?: number | undefined;
                hbd_interest_rate?: number | undefined;
            } & { [K_342 in Exclude<keyof I_1["witness_update"]["props"], keyof import("./legacy_chain_properties").legacy_chain_properties>]: never; }) | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_343 in Exclude<keyof I_1["witness_update"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_344 in Exclude<keyof I_1["witness_update"], keyof witness_update>]: never; }) | undefined;
        account_witness_vote?: ({
            account?: string | undefined;
            witness?: string | undefined;
            approve?: boolean | undefined;
        } & {
            account?: string | undefined;
            witness?: string | undefined;
            approve?: boolean | undefined;
        } & { [K_345 in Exclude<keyof I_1["account_witness_vote"], keyof account_witness_vote>]: never; }) | undefined;
        account_witness_proxy?: ({
            account?: string | undefined;
            proxy?: string | undefined;
        } & {
            account?: string | undefined;
            proxy?: string | undefined;
        } & { [K_346 in Exclude<keyof I_1["account_witness_proxy"], keyof account_witness_proxy>]: never; }) | undefined;
        pow?: ({
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
            } & { [K_347 in Exclude<keyof I_1["pow"]["work"], keyof import("./pow").pow_work>]: never; }) | undefined;
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
                } & { [K_348 in Exclude<keyof I_1["pow"]["props"]["account_creation_fee"], keyof import("./asset").asset>]: never; }) | undefined;
                maximum_block_size?: number | undefined;
                hbd_interest_rate?: number | undefined;
            } & { [K_349 in Exclude<keyof I_1["pow"]["props"], keyof import("./legacy_chain_properties").legacy_chain_properties>]: never; }) | undefined;
        } & { [K_350 in Exclude<keyof I_1["pow"], keyof pow>]: never; }) | undefined;
        custom?: ({
            required_auths?: string[] | undefined;
            id?: number | undefined;
            data?: string | undefined;
        } & {
            required_auths?: (string[] & string[] & { [K_351 in Exclude<keyof I_1["custom"]["required_auths"], keyof string[]>]: never; }) | undefined;
            id?: number | undefined;
            data?: string | undefined;
        } & { [K_352 in Exclude<keyof I_1["custom"], keyof custom>]: never; }) | undefined;
        witness_block_approve?: ({
            witness?: string | undefined;
            block_id?: string | undefined;
        } & {
            witness?: string | undefined;
            block_id?: string | undefined;
        } & { [K_353 in Exclude<keyof I_1["witness_block_approve"], keyof witness_block_approve>]: never; }) | undefined;
        delete_comment?: ({
            author?: string | undefined;
            permlink?: string | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
        } & { [K_354 in Exclude<keyof I_1["delete_comment"], keyof delete_comment>]: never; }) | undefined;
        custom_json?: ({
            required_auths?: string[] | undefined;
            required_posting_auths?: string[] | undefined;
            id?: string | undefined;
            json?: string | undefined;
        } & {
            required_auths?: (string[] & string[] & { [K_355 in Exclude<keyof I_1["custom_json"]["required_auths"], keyof string[]>]: never; }) | undefined;
            required_posting_auths?: (string[] & string[] & { [K_356 in Exclude<keyof I_1["custom_json"]["required_posting_auths"], keyof string[]>]: never; }) | undefined;
            id?: string | undefined;
            json?: string | undefined;
        } & { [K_357 in Exclude<keyof I_1["custom_json"], keyof custom_json>]: never; }) | undefined;
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
            } & { [K_358 in Exclude<keyof I_1["comment_options"]["max_accepted_payout"], keyof import("./asset").asset>]: never; }) | undefined;
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
                } & { [K_359 in Exclude<keyof I_1["comment_options"]["extensions"][number]["beneficiaries"][number], keyof import("./comment_options").beneficiary_route_type>]: never; })[] & { [K_360 in Exclude<keyof I_1["comment_options"]["extensions"][number]["beneficiaries"], keyof {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_361 in Exclude<keyof I_1["comment_options"]["extensions"][number], "beneficiaries">]: never; })[] & { [K_362 in Exclude<keyof I_1["comment_options"]["extensions"], keyof {
                beneficiaries?: {
                    account?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_363 in Exclude<keyof I_1["comment_options"], keyof comment_options>]: never; }) | undefined;
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
        } & { [K_364 in Exclude<keyof I_1["set_withdraw_vesting_route"], keyof set_withdraw_vesting_route>]: never; }) | undefined;
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
            } & { [K_365 in Exclude<keyof I_1["limit_order_create2"]["amount_to_sell"], keyof import("./asset").asset>]: never; }) | undefined;
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
                } & { [K_366 in Exclude<keyof I_1["limit_order_create2"]["exchange_rate"]["base"], keyof import("./asset").asset>]: never; }) | undefined;
                quote?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_367 in Exclude<keyof I_1["limit_order_create2"]["exchange_rate"]["quote"], keyof import("./asset").asset>]: never; }) | undefined;
            } & { [K_368 in Exclude<keyof I_1["limit_order_create2"]["exchange_rate"], keyof import("./price").price>]: never; }) | undefined;
            expiration?: string | undefined;
        } & { [K_369 in Exclude<keyof I_1["limit_order_create2"], keyof limit_order_create2>]: never; }) | undefined;
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
            } & { [K_370 in Exclude<keyof I_1["claim_account"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_371 in Exclude<keyof I_1["claim_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_372 in Exclude<keyof I_1["claim_account"]["extensions"][number], "void_t">]: never; })[] & { [K_373 in Exclude<keyof I_1["claim_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_374 in Exclude<keyof I_1["claim_account"], keyof claim_account>]: never; }) | undefined;
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
            }[] | undefined;
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
                } & { [K_375 in Exclude<keyof I_1["create_claimed_account"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_376 in Exclude<keyof I_1["create_claimed_account"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_377 in Exclude<keyof I_1["create_claimed_account"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_378 in Exclude<keyof I_1["create_claimed_account"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_379 in Exclude<keyof I_1["create_claimed_account"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_380 in Exclude<keyof I_1["create_claimed_account"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_381 in Exclude<keyof I_1["create_claimed_account"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_382 in Exclude<keyof I_1["create_claimed_account"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_383 in Exclude<keyof I_1["create_claimed_account"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_384 in Exclude<keyof I_1["create_claimed_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_385 in Exclude<keyof I_1["create_claimed_account"]["extensions"][number], "void_t">]: never; })[] & { [K_386 in Exclude<keyof I_1["create_claimed_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_387 in Exclude<keyof I_1["create_claimed_account"], keyof create_claimed_account>]: never; }) | undefined;
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
                } & { [K_388 in Exclude<keyof I_1["request_account_recovery"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_389 in Exclude<keyof I_1["request_account_recovery"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_390 in Exclude<keyof I_1["request_account_recovery"]["new_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_391 in Exclude<keyof I_1["request_account_recovery"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_392 in Exclude<keyof I_1["request_account_recovery"]["extensions"][number], "void_t">]: never; })[] & { [K_393 in Exclude<keyof I_1["request_account_recovery"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_394 in Exclude<keyof I_1["request_account_recovery"], keyof request_account_recovery>]: never; }) | undefined;
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
                } & { [K_395 in Exclude<keyof I_1["recover_account"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_396 in Exclude<keyof I_1["recover_account"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_397 in Exclude<keyof I_1["recover_account"]["new_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_398 in Exclude<keyof I_1["recover_account"]["recent_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_399 in Exclude<keyof I_1["recover_account"]["recent_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_400 in Exclude<keyof I_1["recover_account"]["recent_owner_authority"], keyof import("./authority").authority>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_401 in Exclude<keyof I_1["recover_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_402 in Exclude<keyof I_1["recover_account"]["extensions"][number], "void_t">]: never; })[] & { [K_403 in Exclude<keyof I_1["recover_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_404 in Exclude<keyof I_1["recover_account"], keyof recover_account>]: never; }) | undefined;
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
                void_t?: ({} & {} & { [K_405 in Exclude<keyof I_1["change_recovery_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_406 in Exclude<keyof I_1["change_recovery_account"]["extensions"][number], "void_t">]: never; })[] & { [K_407 in Exclude<keyof I_1["change_recovery_account"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_408 in Exclude<keyof I_1["change_recovery_account"], keyof change_recovery_account>]: never; }) | undefined;
        escrow_transfer?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
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
            to_account?: string | undefined;
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
            } & { [K_409 in Exclude<keyof I_1["escrow_transfer"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_410 in Exclude<keyof I_1["escrow_transfer"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_411 in Exclude<keyof I_1["escrow_transfer"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            ratification_deadline?: string | undefined;
            escrow_expiration?: string | undefined;
            json_meta?: string | undefined;
        } & { [K_412 in Exclude<keyof I_1["escrow_transfer"], keyof escrow_transfer>]: never; }) | undefined;
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
        } & { [K_413 in Exclude<keyof I_1["escrow_dispute"], keyof escrow_dispute>]: never; }) | undefined;
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
            } & { [K_414 in Exclude<keyof I_1["escrow_release"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_415 in Exclude<keyof I_1["escrow_release"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_416 in Exclude<keyof I_1["escrow_release"], keyof escrow_release>]: never; }) | undefined;
        pow2?: ({
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
                    } & { [K_417 in Exclude<keyof I_1["pow2"]["work"]["pow2"]["input"], keyof import("./pow2").pow2_input>]: never; }) | undefined;
                    pow_summary?: number | undefined;
                } & { [K_418 in Exclude<keyof I_1["pow2"]["work"]["pow2"], keyof import("./pow2").pow2_pow>]: never; }) | undefined;
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
                    } & { [K_419 in Exclude<keyof I_1["pow2"]["work"]["equihash_pow"]["input"], keyof import("./pow2").pow2_input>]: never; }) | undefined;
                    proof?: ({
                        n?: number | undefined;
                        k?: number | undefined;
                        seed?: string | undefined;
                        inputs?: number[] | undefined;
                    } & {
                        n?: number | undefined;
                        k?: number | undefined;
                        seed?: string | undefined;
                        inputs?: (number[] & number[] & { [K_420 in Exclude<keyof I_1["pow2"]["work"]["equihash_pow"]["proof"]["inputs"], keyof number[]>]: never; }) | undefined;
                    } & { [K_421 in Exclude<keyof I_1["pow2"]["work"]["equihash_pow"]["proof"], keyof import("./pow2").equihash_proof>]: never; }) | undefined;
                    prev_block?: string | undefined;
                    pow_summary?: number | undefined;
                } & { [K_422 in Exclude<keyof I_1["pow2"]["work"]["equihash_pow"], keyof import("./pow2").equihash_pow>]: never; }) | undefined;
            } & { [K_423 in Exclude<keyof I_1["pow2"]["work"], keyof import("./pow2").pow2_work>]: never; }) | undefined;
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
                } & { [K_424 in Exclude<keyof I_1["pow2"]["props"]["account_creation_fee"], keyof import("./asset").asset>]: never; }) | undefined;
                maximum_block_size?: number | undefined;
                hbd_interest_rate?: number | undefined;
            } & { [K_425 in Exclude<keyof I_1["pow2"]["props"], keyof import("./legacy_chain_properties").legacy_chain_properties>]: never; }) | undefined;
        } & { [K_426 in Exclude<keyof I_1["pow2"], keyof pow2>]: never; }) | undefined;
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
        } & { [K_427 in Exclude<keyof I_1["escrow_approve"], keyof escrow_approve>]: never; }) | undefined;
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
            } & { [K_428 in Exclude<keyof I_1["transfer_to_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_429 in Exclude<keyof I_1["transfer_to_savings"], keyof transfer_to_savings>]: never; }) | undefined;
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
            } & { [K_430 in Exclude<keyof I_1["transfer_from_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
        } & { [K_431 in Exclude<keyof I_1["transfer_from_savings"], keyof transfer_from_savings>]: never; }) | undefined;
        cancel_transfer_from_savings?: ({
            from_account?: string | undefined;
            request_id?: number | undefined;
        } & {
            from_account?: string | undefined;
            request_id?: number | undefined;
        } & { [K_432 in Exclude<keyof I_1["cancel_transfer_from_savings"], keyof cancel_transfer_from_savings>]: never; }) | undefined;
        decline_voting_rights?: ({
            account?: string | undefined;
            decline?: boolean | undefined;
        } & {
            account?: string | undefined;
            decline?: boolean | undefined;
        } & { [K_433 in Exclude<keyof I_1["decline_voting_rights"], keyof decline_voting_rights>]: never; }) | undefined;
        claim_reward_balance?: ({
            account?: string | undefined;
            reward_hive?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            reward_hbd?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            reward_vests?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            account?: string | undefined;
            reward_hive?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_434 in Exclude<keyof I_1["claim_reward_balance"]["reward_hive"], keyof import("./asset").asset>]: never; }) | undefined;
            reward_hbd?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_435 in Exclude<keyof I_1["claim_reward_balance"]["reward_hbd"], keyof import("./asset").asset>]: never; }) | undefined;
            reward_vests?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_436 in Exclude<keyof I_1["claim_reward_balance"]["reward_vests"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_437 in Exclude<keyof I_1["claim_reward_balance"], keyof claim_reward_balance>]: never; }) | undefined;
        delegate_vesting_shares?: ({
            delegator?: string | undefined;
            delegatee?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            delegator?: string | undefined;
            delegatee?: string | undefined;
            vesting_shares?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_438 in Exclude<keyof I_1["delegate_vesting_shares"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_439 in Exclude<keyof I_1["delegate_vesting_shares"], keyof delegate_vesting_shares>]: never; }) | undefined;
        account_create_with_delegation?: ({
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            delegation?: {
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
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_440 in Exclude<keyof I_1["account_create_with_delegation"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
            delegation?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_441 in Exclude<keyof I_1["account_create_with_delegation"]["delegation"], keyof import("./asset").asset>]: never; }) | undefined;
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
                } & { [K_442 in Exclude<keyof I_1["account_create_with_delegation"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_443 in Exclude<keyof I_1["account_create_with_delegation"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_444 in Exclude<keyof I_1["account_create_with_delegation"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_445 in Exclude<keyof I_1["account_create_with_delegation"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_446 in Exclude<keyof I_1["account_create_with_delegation"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_447 in Exclude<keyof I_1["account_create_with_delegation"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_448 in Exclude<keyof I_1["account_create_with_delegation"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_449 in Exclude<keyof I_1["account_create_with_delegation"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_450 in Exclude<keyof I_1["account_create_with_delegation"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_451 in Exclude<keyof I_1["account_create_with_delegation"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_452 in Exclude<keyof I_1["account_create_with_delegation"]["extensions"][number], "void_t">]: never; })[] & { [K_453 in Exclude<keyof I_1["account_create_with_delegation"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_454 in Exclude<keyof I_1["account_create_with_delegation"], keyof account_create_with_delegation>]: never; }) | undefined;
        witness_set_properties?: ({
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
            } & { [K_455 in Exclude<keyof I_1["witness_set_properties"]["props"], string | number>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_456 in Exclude<keyof I_1["witness_set_properties"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_457 in Exclude<keyof I_1["witness_set_properties"]["extensions"][number], "void_t">]: never; })[] & { [K_458 in Exclude<keyof I_1["witness_set_properties"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_459 in Exclude<keyof I_1["witness_set_properties"], keyof witness_set_properties>]: never; }) | undefined;
        account_update2?: ({
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
            posting_json_metadata?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
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
                } & { [K_460 in Exclude<keyof I_1["account_update2"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_461 in Exclude<keyof I_1["account_update2"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_462 in Exclude<keyof I_1["account_update2"]["owner"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_463 in Exclude<keyof I_1["account_update2"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_464 in Exclude<keyof I_1["account_update2"]["active"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_465 in Exclude<keyof I_1["account_update2"]["active"], keyof import("./authority").authority>]: never; }) | undefined;
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
                } & { [K_466 in Exclude<keyof I_1["account_update2"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                key_auths?: ({
                    [x: string]: number | undefined;
                } & {
                    [x: string]: number | undefined;
                } & { [K_467 in Exclude<keyof I_1["account_update2"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
            } & { [K_468 in Exclude<keyof I_1["account_update2"]["posting"], keyof import("./authority").authority>]: never; }) | undefined;
            memo_key?: string | undefined;
            json_metadata?: string | undefined;
            posting_json_metadata?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_469 in Exclude<keyof I_1["account_update2"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_470 in Exclude<keyof I_1["account_update2"]["extensions"][number], "void_t">]: never; })[] & { [K_471 in Exclude<keyof I_1["account_update2"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_472 in Exclude<keyof I_1["account_update2"], keyof account_update2>]: never; }) | undefined;
        create_proposal?: ({
            creator?: string | undefined;
            receiver?: string | undefined;
            start_date?: string | undefined;
            end_date?: string | undefined;
            daily_pay?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            subject?: string | undefined;
            permlink?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            creator?: string | undefined;
            receiver?: string | undefined;
            start_date?: string | undefined;
            end_date?: string | undefined;
            daily_pay?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_473 in Exclude<keyof I_1["create_proposal"]["daily_pay"], keyof import("./asset").asset>]: never; }) | undefined;
            subject?: string | undefined;
            permlink?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_474 in Exclude<keyof I_1["create_proposal"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_475 in Exclude<keyof I_1["create_proposal"]["extensions"][number], "void_t">]: never; })[] & { [K_476 in Exclude<keyof I_1["create_proposal"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_477 in Exclude<keyof I_1["create_proposal"], keyof create_proposal>]: never; }) | undefined;
        update_proposal_votes?: ({
            voter?: string | undefined;
            proposal_ids?: string[] | undefined;
            approve?: boolean | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            voter?: string | undefined;
            proposal_ids?: (string[] & string[] & { [K_478 in Exclude<keyof I_1["update_proposal_votes"]["proposal_ids"], keyof string[]>]: never; }) | undefined;
            approve?: boolean | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_479 in Exclude<keyof I_1["update_proposal_votes"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_480 in Exclude<keyof I_1["update_proposal_votes"]["extensions"][number], "void_t">]: never; })[] & { [K_481 in Exclude<keyof I_1["update_proposal_votes"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_482 in Exclude<keyof I_1["update_proposal_votes"], keyof update_proposal_votes>]: never; }) | undefined;
        remove_proposal?: ({
            proposal_owner?: string | undefined;
            proposal_ids?: string[] | undefined;
            extensions?: {
                void_t?: {} | undefined;
            }[] | undefined;
        } & {
            proposal_owner?: string | undefined;
            proposal_ids?: (string[] & string[] & { [K_483 in Exclude<keyof I_1["remove_proposal"]["proposal_ids"], keyof string[]>]: never; }) | undefined;
            extensions?: ({
                void_t?: {} | undefined;
            }[] & ({
                void_t?: {} | undefined;
            } & {
                void_t?: ({} & {} & { [K_484 in Exclude<keyof I_1["remove_proposal"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
            } & { [K_485 in Exclude<keyof I_1["remove_proposal"]["extensions"][number], "void_t">]: never; })[] & { [K_486 in Exclude<keyof I_1["remove_proposal"]["extensions"], keyof {
                void_t?: {} | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_487 in Exclude<keyof I_1["remove_proposal"], keyof remove_proposal>]: never; }) | undefined;
        update_proposal?: ({
            proposal_id?: string | undefined;
            creator?: string | undefined;
            daily_pay?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            subject?: string | undefined;
            permlink?: string | undefined;
            extensions?: {
                void_t?: {} | undefined;
                update_proposal_end_date?: {
                    end_date?: string | undefined;
                } | undefined;
            }[] | undefined;
        } & {
            proposal_id?: string | undefined;
            creator?: string | undefined;
            daily_pay?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_488 in Exclude<keyof I_1["update_proposal"]["daily_pay"], keyof import("./asset").asset>]: never; }) | undefined;
            subject?: string | undefined;
            permlink?: string | undefined;
            extensions?: ({
                void_t?: {} | undefined;
                update_proposal_end_date?: {
                    end_date?: string | undefined;
                } | undefined;
            }[] & ({
                void_t?: {} | undefined;
                update_proposal_end_date?: {
                    end_date?: string | undefined;
                } | undefined;
            } & {
                void_t?: ({} & {} & { [K_489 in Exclude<keyof I_1["update_proposal"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                update_proposal_end_date?: ({
                    end_date?: string | undefined;
                } & {
                    end_date?: string | undefined;
                } & { [K_490 in Exclude<keyof I_1["update_proposal"]["extensions"][number]["update_proposal_end_date"], "end_date">]: never; }) | undefined;
            } & { [K_491 in Exclude<keyof I_1["update_proposal"]["extensions"][number], keyof import("./update_proposal").update_proposal_extension>]: never; })[] & { [K_492 in Exclude<keyof I_1["update_proposal"]["extensions"], keyof {
                void_t?: {} | undefined;
                update_proposal_end_date?: {
                    end_date?: string | undefined;
                } | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_493 in Exclude<keyof I_1["update_proposal"], keyof update_proposal>]: never; }) | undefined;
        collateralized_convert?: ({
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
            } & { [K_494 in Exclude<keyof I_1["collateralized_convert"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_495 in Exclude<keyof I_1["collateralized_convert"], keyof collateralized_convert>]: never; }) | undefined;
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
            } & { [K_496 in Exclude<keyof I_1["recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
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
                void_t?: ({} & {} & { [K_497 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                recurrent_transfer_pair_id?: ({
                    pair_id?: number | undefined;
                } & {
                    pair_id?: number | undefined;
                } & { [K_498 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
            } & { [K_499 in Exclude<keyof I_1["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer").recurrent_transfer_extension>]: never; })[] & { [K_500 in Exclude<keyof I_1["recurrent_transfer"]["extensions"], keyof {
                void_t?: {} | undefined;
                recurrent_transfer_pair_id?: {
                    pair_id?: number | undefined;
                } | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_501 in Exclude<keyof I_1["recurrent_transfer"], keyof recurrent_transfer>]: never; }) | undefined;
        fill_convert_request?: ({
            owner?: string | undefined;
            requestid?: number | undefined;
            amount_in?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            amount_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount_in?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_502 in Exclude<keyof I_1["fill_convert_request"]["amount_in"], keyof import("./asset").asset>]: never; }) | undefined;
            amount_out?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_503 in Exclude<keyof I_1["fill_convert_request"]["amount_out"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_504 in Exclude<keyof I_1["fill_convert_request"], keyof fill_convert_request>]: never; }) | undefined;
        author_reward?: ({
            author?: string | undefined;
            permlink?: string | undefined;
            hbd_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            curators_vesting_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
            hbd_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_505 in Exclude<keyof I_1["author_reward"]["hbd_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_506 in Exclude<keyof I_1["author_reward"]["hive_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            vesting_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_507 in Exclude<keyof I_1["author_reward"]["vesting_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            curators_vesting_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_508 in Exclude<keyof I_1["author_reward"]["curators_vesting_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } & { [K_509 in Exclude<keyof I_1["author_reward"], keyof author_reward>]: never; }) | undefined;
        curation_reward?: ({
            curator?: string | undefined;
            reward?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            comment_author?: string | undefined;
            comment_permlink?: string | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } & {
            curator?: string | undefined;
            reward?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_510 in Exclude<keyof I_1["curation_reward"]["reward"], keyof import("./asset").asset>]: never; }) | undefined;
            comment_author?: string | undefined;
            comment_permlink?: string | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } & { [K_511 in Exclude<keyof I_1["curation_reward"], keyof curation_reward>]: never; }) | undefined;
        comment_reward?: ({
            author?: string | undefined;
            permlink?: string | undefined;
            payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            author_rewards?: string | undefined;
            total_payout_value?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            curator_payout_value?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            beneficiary_payout_value?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
            payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_512 in Exclude<keyof I_1["comment_reward"]["payout"], keyof import("./asset").asset>]: never; }) | undefined;
            author_rewards?: string | undefined;
            total_payout_value?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_513 in Exclude<keyof I_1["comment_reward"]["total_payout_value"], keyof import("./asset").asset>]: never; }) | undefined;
            curator_payout_value?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_514 in Exclude<keyof I_1["comment_reward"]["curator_payout_value"], keyof import("./asset").asset>]: never; }) | undefined;
            beneficiary_payout_value?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_515 in Exclude<keyof I_1["comment_reward"]["beneficiary_payout_value"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_516 in Exclude<keyof I_1["comment_reward"], keyof comment_reward>]: never; }) | undefined;
        liquidity_reward?: ({
            owner?: string | undefined;
            payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_517 in Exclude<keyof I_1["liquidity_reward"]["payout"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_518 in Exclude<keyof I_1["liquidity_reward"], keyof liquidity_reward>]: never; }) | undefined;
        interest?: ({
            owner?: string | undefined;
            interest?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            is_saved_into_hbd_balance?: boolean | undefined;
        } & {
            owner?: string | undefined;
            interest?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_519 in Exclude<keyof I_1["interest"]["interest"], keyof import("./asset").asset>]: never; }) | undefined;
            is_saved_into_hbd_balance?: boolean | undefined;
        } & { [K_520 in Exclude<keyof I_1["interest"], keyof interest>]: never; }) | undefined;
        fill_vesting_withdraw?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            withdrawn?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            deposited?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            withdrawn?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_521 in Exclude<keyof I_1["fill_vesting_withdraw"]["withdrawn"], keyof import("./asset").asset>]: never; }) | undefined;
            deposited?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_522 in Exclude<keyof I_1["fill_vesting_withdraw"]["deposited"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_523 in Exclude<keyof I_1["fill_vesting_withdraw"], keyof fill_vesting_withdraw>]: never; }) | undefined;
        fill_order?: ({
            current_owner?: string | undefined;
            current_orderid?: number | undefined;
            current_pays?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            open_owner?: string | undefined;
            open_orderid?: number | undefined;
            open_pays?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            current_owner?: string | undefined;
            current_orderid?: number | undefined;
            current_pays?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_524 in Exclude<keyof I_1["fill_order"]["current_pays"], keyof import("./asset").asset>]: never; }) | undefined;
            open_owner?: string | undefined;
            open_orderid?: number | undefined;
            open_pays?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_525 in Exclude<keyof I_1["fill_order"]["open_pays"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_526 in Exclude<keyof I_1["fill_order"], keyof fill_order>]: never; }) | undefined;
        shutdown_witness?: ({
            owner?: string | undefined;
        } & {
            owner?: string | undefined;
        } & { [K_527 in Exclude<keyof I_1["shutdown_witness"], "owner">]: never; }) | undefined;
        fill_transfer_from_savings?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            request_id?: number | undefined;
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
            } & { [K_528 in Exclude<keyof I_1["fill_transfer_from_savings"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            request_id?: number | undefined;
            memo?: string | undefined;
        } & { [K_529 in Exclude<keyof I_1["fill_transfer_from_savings"], keyof fill_transfer_from_savings>]: never; }) | undefined;
        hardfork?: ({
            hardfork_id?: number | undefined;
        } & {
            hardfork_id?: number | undefined;
        } & { [K_530 in Exclude<keyof I_1["hardfork"], "hardfork_id">]: never; }) | undefined;
        comment_payout_update?: ({
            author?: string | undefined;
            permlink?: string | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
        } & { [K_531 in Exclude<keyof I_1["comment_payout_update"], keyof comment_payout_update>]: never; }) | undefined;
        return_vesting_delegation?: ({
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
            } & { [K_532 in Exclude<keyof I_1["return_vesting_delegation"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_533 in Exclude<keyof I_1["return_vesting_delegation"], keyof return_vesting_delegation>]: never; }) | undefined;
        comment_benefactor_reward?: ({
            benefactor?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            hbd_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } & {
            benefactor?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            hbd_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_534 in Exclude<keyof I_1["comment_benefactor_reward"]["hbd_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_535 in Exclude<keyof I_1["comment_benefactor_reward"]["hive_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            vesting_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_536 in Exclude<keyof I_1["comment_benefactor_reward"]["vesting_payout"], keyof import("./asset").asset>]: never; }) | undefined;
            payout_must_be_claimed?: boolean | undefined;
        } & { [K_537 in Exclude<keyof I_1["comment_benefactor_reward"], keyof comment_benefactor_reward>]: never; }) | undefined;
        producer_reward?: ({
            producer?: string | undefined;
            vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            producer?: string | undefined;
            vesting_shares?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_538 in Exclude<keyof I_1["producer_reward"]["vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_539 in Exclude<keyof I_1["producer_reward"], keyof producer_reward>]: never; }) | undefined;
        clear_null_account_balance?: ({
            total_cleared?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[] | undefined;
        } & {
            total_cleared?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[] & ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_540 in Exclude<keyof I_1["clear_null_account_balance"]["total_cleared"][number], keyof import("./asset").asset>]: never; })[] & { [K_541 in Exclude<keyof I_1["clear_null_account_balance"]["total_cleared"], keyof {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_542 in Exclude<keyof I_1["clear_null_account_balance"], "total_cleared">]: never; }) | undefined;
        proposal_pay?: ({
            proposal_id?: number | undefined;
            receiver?: string | undefined;
            payer?: string | undefined;
            payment?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            proposal_id?: number | undefined;
            receiver?: string | undefined;
            payer?: string | undefined;
            payment?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_543 in Exclude<keyof I_1["proposal_pay"]["payment"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_544 in Exclude<keyof I_1["proposal_pay"], keyof proposal_pay>]: never; }) | undefined;
        dhf_funding?: ({
            treasury?: string | undefined;
            additional_funds?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            treasury?: string | undefined;
            additional_funds?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_545 in Exclude<keyof I_1["dhf_funding"]["additional_funds"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_546 in Exclude<keyof I_1["dhf_funding"], keyof dhf_funding>]: never; }) | undefined;
        hardfork_hive?: ({
            account?: string | undefined;
            treasury?: string | undefined;
            other_affected_accounts?: string[] | undefined;
            hbd_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vests_converted?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            total_hive_from_vests?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            account?: string | undefined;
            treasury?: string | undefined;
            other_affected_accounts?: (string[] & string[] & { [K_547 in Exclude<keyof I_1["hardfork_hive"]["other_affected_accounts"], keyof string[]>]: never; }) | undefined;
            hbd_transferred?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_548 in Exclude<keyof I_1["hardfork_hive"]["hbd_transferred"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_transferred?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_549 in Exclude<keyof I_1["hardfork_hive"]["hive_transferred"], keyof import("./asset").asset>]: never; }) | undefined;
            vests_converted?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_550 in Exclude<keyof I_1["hardfork_hive"]["vests_converted"], keyof import("./asset").asset>]: never; }) | undefined;
            total_hive_from_vests?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_551 in Exclude<keyof I_1["hardfork_hive"]["total_hive_from_vests"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_552 in Exclude<keyof I_1["hardfork_hive"], keyof hardfork_hive>]: never; }) | undefined;
        hardfork_hive_restore?: ({
            account?: string | undefined;
            treasury?: string | undefined;
            hbd_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hive_transferred?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            account?: string | undefined;
            treasury?: string | undefined;
            hbd_transferred?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_553 in Exclude<keyof I_1["hardfork_hive_restore"]["hbd_transferred"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_transferred?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_554 in Exclude<keyof I_1["hardfork_hive_restore"]["hive_transferred"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_555 in Exclude<keyof I_1["hardfork_hive_restore"], keyof hardfork_hive_restore>]: never; }) | undefined;
        delayed_voting?: ({
            voter?: string | undefined;
            votes?: string | undefined;
        } & {
            voter?: string | undefined;
            votes?: string | undefined;
        } & { [K_556 in Exclude<keyof I_1["delayed_voting"], keyof delayed_voting>]: never; }) | undefined;
        consolidate_treasury_balance?: ({
            total_moved?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[] | undefined;
        } & {
            total_moved?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[] & ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_557 in Exclude<keyof I_1["consolidate_treasury_balance"]["total_moved"][number], keyof import("./asset").asset>]: never; })[] & { [K_558 in Exclude<keyof I_1["consolidate_treasury_balance"]["total_moved"], keyof {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            }[]>]: never; }) | undefined;
        } & { [K_559 in Exclude<keyof I_1["consolidate_treasury_balance"], "total_moved">]: never; }) | undefined;
        effective_comment_vote?: ({
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: string | undefined;
            rshares?: string | undefined;
            total_vote_weight?: string | undefined;
            pending_payout?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            voter?: string | undefined;
            author?: string | undefined;
            permlink?: string | undefined;
            weight?: string | undefined;
            rshares?: string | undefined;
            total_vote_weight?: string | undefined;
            pending_payout?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_560 in Exclude<keyof I_1["effective_comment_vote"]["pending_payout"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_561 in Exclude<keyof I_1["effective_comment_vote"], keyof effective_comment_vote>]: never; }) | undefined;
        ineffective_delete_comment?: ({
            author?: string | undefined;
            permlink?: string | undefined;
        } & {
            author?: string | undefined;
            permlink?: string | undefined;
        } & { [K_562 in Exclude<keyof I_1["ineffective_delete_comment"], keyof ineffective_delete_comment>]: never; }) | undefined;
        dhf_conversion?: ({
            treasury?: string | undefined;
            hive_amount_in?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            hbd_amount_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            treasury?: string | undefined;
            hive_amount_in?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_563 in Exclude<keyof I_1["dhf_conversion"]["hive_amount_in"], keyof import("./asset").asset>]: never; }) | undefined;
            hbd_amount_out?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_564 in Exclude<keyof I_1["dhf_conversion"]["hbd_amount_out"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_565 in Exclude<keyof I_1["dhf_conversion"], keyof dhf_conversion>]: never; }) | undefined;
        expired_account_notification?: ({
            account?: string | undefined;
        } & {
            account?: string | undefined;
        } & { [K_566 in Exclude<keyof I_1["expired_account_notification"], "account">]: never; }) | undefined;
        changed_recovery_account?: ({
            account?: string | undefined;
            old_recovery_account?: string | undefined;
            new_recovery_account?: string | undefined;
        } & {
            account?: string | undefined;
            old_recovery_account?: string | undefined;
            new_recovery_account?: string | undefined;
        } & { [K_567 in Exclude<keyof I_1["changed_recovery_account"], keyof changed_recovery_account>]: never; }) | undefined;
        transfer_to_vesting_completed?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            hive_vested?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_shares_received?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            hive_vested?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_568 in Exclude<keyof I_1["transfer_to_vesting_completed"]["hive_vested"], keyof import("./asset").asset>]: never; }) | undefined;
            vesting_shares_received?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_569 in Exclude<keyof I_1["transfer_to_vesting_completed"]["vesting_shares_received"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_570 in Exclude<keyof I_1["transfer_to_vesting_completed"], keyof transfer_to_vesting_completed>]: never; }) | undefined;
        pow_reward?: ({
            worker?: string | undefined;
            reward?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            worker?: string | undefined;
            reward?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_571 in Exclude<keyof I_1["pow_reward"]["reward"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_572 in Exclude<keyof I_1["pow_reward"], keyof pow_reward>]: never; }) | undefined;
        vesting_shares_split?: ({
            owner?: string | undefined;
            vesting_shares_before_split?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            vesting_shares_after_split?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            vesting_shares_before_split?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_573 in Exclude<keyof I_1["vesting_shares_split"]["vesting_shares_before_split"], keyof import("./asset").asset>]: never; }) | undefined;
            vesting_shares_after_split?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_574 in Exclude<keyof I_1["vesting_shares_split"]["vesting_shares_after_split"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_575 in Exclude<keyof I_1["vesting_shares_split"], keyof vesting_shares_split>]: never; }) | undefined;
        account_created?: ({
            new_account_name?: string | undefined;
            creator?: string | undefined;
            initial_vesting_shares?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            initial_delegation?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            new_account_name?: string | undefined;
            creator?: string | undefined;
            initial_vesting_shares?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_576 in Exclude<keyof I_1["account_created"]["initial_vesting_shares"], keyof import("./asset").asset>]: never; }) | undefined;
            initial_delegation?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_577 in Exclude<keyof I_1["account_created"]["initial_delegation"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_578 in Exclude<keyof I_1["account_created"], keyof account_created>]: never; }) | undefined;
        fill_collateralized_convert_request?: ({
            owner?: string | undefined;
            requestid?: number | undefined;
            amount_in?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            amount_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            excess_collateral?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            requestid?: number | undefined;
            amount_in?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_579 in Exclude<keyof I_1["fill_collateralized_convert_request"]["amount_in"], keyof import("./asset").asset>]: never; }) | undefined;
            amount_out?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_580 in Exclude<keyof I_1["fill_collateralized_convert_request"]["amount_out"], keyof import("./asset").asset>]: never; }) | undefined;
            excess_collateral?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_581 in Exclude<keyof I_1["fill_collateralized_convert_request"]["excess_collateral"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_582 in Exclude<keyof I_1["fill_collateralized_convert_request"], keyof fill_collateralized_convert_request>]: never; }) | undefined;
        system_warning?: ({
            message?: string | undefined;
        } & {
            message?: string | undefined;
        } & { [K_583 in Exclude<keyof I_1["system_warning"], "message">]: never; }) | undefined;
        fill_recurrent_transfer?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
            remaining_executions?: number | undefined;
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
            } & { [K_584 in Exclude<keyof I_1["fill_recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
            remaining_executions?: number | undefined;
        } & { [K_585 in Exclude<keyof I_1["fill_recurrent_transfer"], keyof fill_recurrent_transfer>]: never; }) | undefined;
        failed_recurrent_transfer?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            amount?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
            memo?: string | undefined;
            consecutive_failures?: number | undefined;
            remaining_executions?: number | undefined;
            deleted?: boolean | undefined;
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
            } & { [K_586 in Exclude<keyof I_1["failed_recurrent_transfer"]["amount"], keyof import("./asset").asset>]: never; }) | undefined;
            memo?: string | undefined;
            consecutive_failures?: number | undefined;
            remaining_executions?: number | undefined;
            deleted?: boolean | undefined;
        } & { [K_587 in Exclude<keyof I_1["failed_recurrent_transfer"], keyof failed_recurrent_transfer>]: never; }) | undefined;
        limit_order_cancelled?: ({
            seller?: string | undefined;
            orderid?: number | undefined;
            amount_back?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            seller?: string | undefined;
            orderid?: number | undefined;
            amount_back?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_588 in Exclude<keyof I_1["limit_order_cancelled"]["amount_back"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_589 in Exclude<keyof I_1["limit_order_cancelled"], keyof limit_order_cancelled>]: never; }) | undefined;
        producer_missed?: ({
            producer?: string | undefined;
        } & {
            producer?: string | undefined;
        } & { [K_590 in Exclude<keyof I_1["producer_missed"], "producer">]: never; }) | undefined;
        proposal_fee?: ({
            creator?: string | undefined;
            treasury?: string | undefined;
            proposal_id?: number | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            creator?: string | undefined;
            treasury?: string | undefined;
            proposal_id?: number | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_591 in Exclude<keyof I_1["proposal_fee"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_592 in Exclude<keyof I_1["proposal_fee"], keyof proposal_fee>]: never; }) | undefined;
        collateralized_convert_immediate_conversion?: ({
            owner?: string | undefined;
            requestid?: number | undefined;
            hbd_out?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            owner?: string | undefined;
            requestid?: number | undefined;
            hbd_out?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_593 in Exclude<keyof I_1["collateralized_convert_immediate_conversion"]["hbd_out"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_594 in Exclude<keyof I_1["collateralized_convert_immediate_conversion"], keyof collateralized_convert_immediate_conversion>]: never; }) | undefined;
        escrow_approved?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            escrow_id?: number | undefined;
            fee?: {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } | undefined;
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
            agent?: string | undefined;
            escrow_id?: number | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_595 in Exclude<keyof I_1["escrow_approved"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_596 in Exclude<keyof I_1["escrow_approved"], keyof escrow_approved>]: never; }) | undefined;
        escrow_rejected?: ({
            from_account?: string | undefined;
            to_account?: string | undefined;
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
        } & {
            from_account?: string | undefined;
            to_account?: string | undefined;
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
            } & { [K_597 in Exclude<keyof I_1["escrow_rejected"]["hbd_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            hive_amount?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_598 in Exclude<keyof I_1["escrow_rejected"]["hive_amount"], keyof import("./asset").asset>]: never; }) | undefined;
            fee?: ({
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & {
                amount?: string | undefined;
                precision?: number | undefined;
                nai?: string | undefined;
            } & { [K_599 in Exclude<keyof I_1["escrow_rejected"]["fee"], keyof import("./asset").asset>]: never; }) | undefined;
        } & { [K_600 in Exclude<keyof I_1["escrow_rejected"], keyof escrow_rejected>]: never; }) | undefined;
        proxy_cleared?: ({
            account?: string | undefined;
            proxy?: string | undefined;
        } & {
            account?: string | undefined;
            proxy?: string | undefined;
        } & { [K_601 in Exclude<keyof I_1["proxy_cleared"], keyof proxy_cleared>]: never; }) | undefined;
        declined_voting_rights?: ({
            account?: string | undefined;
        } & {
            account?: string | undefined;
        } & { [K_602 in Exclude<keyof I_1["declined_voting_rights"], "account">]: never; }) | undefined;
    } & { [K_603 in Exclude<keyof I_1, keyof operation>]: never; }>(object: I_1): operation;
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
