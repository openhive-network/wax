import _m0 from "protobufjs/minimal.js";
import { future_extensions } from "./future_extensions.js";
import { operation } from "./operation.js";
export declare const protobufPackage = "hive.protocol.buffers";
export interface transaction {
    ref_block_num: number;
    ref_block_prefix: number;
    expiration: string;
    operations: operation[];
    extensions: future_extensions[];
    /** for signed_transaction */
    signatures: string[];
}
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
                owner?: string | undefined;
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
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
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
        }[] | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
        signatures?: string[] | undefined;
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
                owner?: string | undefined;
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
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
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
                owner?: string | undefined;
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
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
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
            } & { [K in Exclude<keyof I["operations"][number]["vote"], keyof import("./vote.js").vote>]: never; }) | undefined;
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
            } & { [K_1 in Exclude<keyof I["operations"][number]["comment"], keyof import("./comment.js").comment>]: never; }) | undefined;
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
                } & { [K_2 in Exclude<keyof I["operations"][number]["transfer"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_3 in Exclude<keyof I["operations"][number]["transfer"], keyof import("./transfer.js").transfer>]: never; }) | undefined;
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
                } & { [K_4 in Exclude<keyof I["operations"][number]["transfer_to_vesting"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_5 in Exclude<keyof I["operations"][number]["transfer_to_vesting"], keyof import("./transfer_to_vesting.js").transfer_to_vesting>]: never; }) | undefined;
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
                } & { [K_6 in Exclude<keyof I["operations"][number]["withdraw_vesting"]["vesting_shares"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_7 in Exclude<keyof I["operations"][number]["withdraw_vesting"], keyof import("./withdraw_vesting.js").withdraw_vesting>]: never; }) | undefined;
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
                } & { [K_8 in Exclude<keyof I["operations"][number]["limit_order_create"]["amount_to_sell"], keyof import("./asset.js").asset>]: never; }) | undefined;
                min_to_receive?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_9 in Exclude<keyof I["operations"][number]["limit_order_create"]["min_to_receive"], keyof import("./asset.js").asset>]: never; }) | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } & { [K_10 in Exclude<keyof I["operations"][number]["limit_order_create"], keyof import("./limit_order_create.js").limit_order_create>]: never; }) | undefined;
            limit_order_cancel?: ({
                owner?: string | undefined;
                orderid?: number | undefined;
            } & {
                owner?: string | undefined;
                orderid?: number | undefined;
            } & { [K_11 in Exclude<keyof I["operations"][number]["limit_order_cancel"], keyof import("./limit_order_cancel.js").limit_order_cancel>]: never; }) | undefined;
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
                    } & { [K_12 in Exclude<keyof I["operations"][number]["feed_publish"]["exchange_rate"]["base"], keyof import("./asset.js").asset>]: never; }) | undefined;
                    quote?: ({
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & { [K_13 in Exclude<keyof I["operations"][number]["feed_publish"]["exchange_rate"]["quote"], keyof import("./asset.js").asset>]: never; }) | undefined;
                } & { [K_14 in Exclude<keyof I["operations"][number]["feed_publish"]["exchange_rate"], keyof import("./price.js").price>]: never; }) | undefined;
            } & { [K_15 in Exclude<keyof I["operations"][number]["feed_publish"], keyof import("./feed_publish.js").feed_publish>]: never; }) | undefined;
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
                } & { [K_16 in Exclude<keyof I["operations"][number]["convert"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_17 in Exclude<keyof I["operations"][number]["convert"], keyof import("./convert.js").convert>]: never; }) | undefined;
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
                } & { [K_18 in Exclude<keyof I["operations"][number]["account_create"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
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
                } & { [K_21 in Exclude<keyof I["operations"][number]["account_create"]["owner"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                } & { [K_24 in Exclude<keyof I["operations"][number]["account_create"]["active"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                } & { [K_27 in Exclude<keyof I["operations"][number]["account_create"]["posting"], keyof import("./authority.js").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_28 in Exclude<keyof I["operations"][number]["account_create"], keyof import("./account_create.js").account_create>]: never; }) | undefined;
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
                } & { [K_31 in Exclude<keyof I["operations"][number]["account_update"]["owner"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                } & { [K_34 in Exclude<keyof I["operations"][number]["account_update"]["active"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                } & { [K_37 in Exclude<keyof I["operations"][number]["account_update"]["posting"], keyof import("./authority.js").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_38 in Exclude<keyof I["operations"][number]["account_update"], keyof import("./account_update.js").account_update>]: never; }) | undefined;
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
                    } & { [K_39 in Exclude<keyof I["operations"][number]["witness_update"]["props"]["account_creation_fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
                    maximum_block_size?: number | undefined;
                    hbd_interest_rate?: number | undefined;
                } & { [K_40 in Exclude<keyof I["operations"][number]["witness_update"]["props"], keyof import("./legacy_chain_properties.js").legacy_chain_properties>]: never; }) | undefined;
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_41 in Exclude<keyof I["operations"][number]["witness_update"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_42 in Exclude<keyof I["operations"][number]["witness_update"], keyof import("./witness_update.js").witness_update>]: never; }) | undefined;
            account_witness_vote?: ({
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } & {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } & { [K_43 in Exclude<keyof I["operations"][number]["account_witness_vote"], keyof import("./account_witness_vote.js").account_witness_vote>]: never; }) | undefined;
            account_witness_proxy?: ({
                account?: string | undefined;
                proxy?: string | undefined;
            } & {
                account?: string | undefined;
                proxy?: string | undefined;
            } & { [K_44 in Exclude<keyof I["operations"][number]["account_witness_proxy"], keyof import("./account_witness_proxy.js").account_witness_proxy>]: never; }) | undefined;
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
                } & { [K_45 in Exclude<keyof I["operations"][number]["pow"]["work"], keyof import("./pow.js").pow_work>]: never; }) | undefined;
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
                    } & { [K_46 in Exclude<keyof I["operations"][number]["pow"]["props"]["account_creation_fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
                    maximum_block_size?: number | undefined;
                    hbd_interest_rate?: number | undefined;
                } & { [K_47 in Exclude<keyof I["operations"][number]["pow"]["props"], keyof import("./legacy_chain_properties.js").legacy_chain_properties>]: never; }) | undefined;
            } & { [K_48 in Exclude<keyof I["operations"][number]["pow"], keyof import("./pow.js").pow>]: never; }) | undefined;
            custom?: ({
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } & {
                required_auths?: (string[] & string[] & { [K_49 in Exclude<keyof I["operations"][number]["custom"]["required_auths"], keyof string[]>]: never; }) | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } & { [K_50 in Exclude<keyof I["operations"][number]["custom"], keyof import("./custom.js").custom>]: never; }) | undefined;
            witness_block_approve?: ({
                witness?: string | undefined;
                block_id?: string | undefined;
            } & {
                witness?: string | undefined;
                block_id?: string | undefined;
            } & { [K_51 in Exclude<keyof I["operations"][number]["witness_block_approve"], keyof import("./witness_block_approve.js").witness_block_approve>]: never; }) | undefined;
            delete_comment?: ({
                author?: string | undefined;
                permlink?: string | undefined;
            } & {
                author?: string | undefined;
                permlink?: string | undefined;
            } & { [K_52 in Exclude<keyof I["operations"][number]["delete_comment"], keyof import("./delete_comment.js").delete_comment>]: never; }) | undefined;
            custom_json?: ({
                required_auths?: string[] | undefined;
                required_posting_auths?: string[] | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } & {
                required_auths?: (string[] & string[] & { [K_53 in Exclude<keyof I["operations"][number]["custom_json"]["required_auths"], keyof string[]>]: never; }) | undefined;
                required_posting_auths?: (string[] & string[] & { [K_54 in Exclude<keyof I["operations"][number]["custom_json"]["required_posting_auths"], keyof string[]>]: never; }) | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } & { [K_55 in Exclude<keyof I["operations"][number]["custom_json"], keyof import("./custom_json.js").custom_json>]: never; }) | undefined;
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
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
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
                } & { [K_56 in Exclude<keyof I["operations"][number]["comment_options"]["max_accepted_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: ({
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
                }[] & ({
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
                } & {
                    comment_payout_beneficiaries?: ({
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
                        } & { [K_57 in Exclude<keyof I["operations"][number]["comment_options"]["extensions"][number]["comment_payout_beneficiaries"]["beneficiaries"][number], keyof import("./comment_options.js").beneficiary_route_type>]: never; })[] & { [K_58 in Exclude<keyof I["operations"][number]["comment_options"]["extensions"][number]["comment_payout_beneficiaries"]["beneficiaries"], keyof {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[]>]: never; }) | undefined;
                    } & { [K_59 in Exclude<keyof I["operations"][number]["comment_options"]["extensions"][number]["comment_payout_beneficiaries"], "beneficiaries">]: never; }) | undefined;
                } & { [K_60 in Exclude<keyof I["operations"][number]["comment_options"]["extensions"][number], "comment_payout_beneficiaries">]: never; })[] & { [K_61 in Exclude<keyof I["operations"][number]["comment_options"]["extensions"], keyof {
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_62 in Exclude<keyof I["operations"][number]["comment_options"], keyof import("./comment_options.js").comment_options>]: never; }) | undefined;
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
            } & { [K_63 in Exclude<keyof I["operations"][number]["set_withdraw_vesting_route"], keyof import("./set_withdraw_vesting_route.js").set_withdraw_vesting_route>]: never; }) | undefined;
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
                } & { [K_64 in Exclude<keyof I["operations"][number]["limit_order_create2"]["amount_to_sell"], keyof import("./asset.js").asset>]: never; }) | undefined;
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
                    } & { [K_65 in Exclude<keyof I["operations"][number]["limit_order_create2"]["exchange_rate"]["base"], keyof import("./asset.js").asset>]: never; }) | undefined;
                    quote?: ({
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & { [K_66 in Exclude<keyof I["operations"][number]["limit_order_create2"]["exchange_rate"]["quote"], keyof import("./asset.js").asset>]: never; }) | undefined;
                } & { [K_67 in Exclude<keyof I["operations"][number]["limit_order_create2"]["exchange_rate"], keyof import("./price.js").price>]: never; }) | undefined;
                expiration?: string | undefined;
            } & { [K_68 in Exclude<keyof I["operations"][number]["limit_order_create2"], keyof import("./limit_order_create2.js").limit_order_create2>]: never; }) | undefined;
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
                } & { [K_69 in Exclude<keyof I["operations"][number]["claim_account"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_70 in Exclude<keyof I["operations"][number]["claim_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_71 in Exclude<keyof I["operations"][number]["claim_account"]["extensions"][number], "void_t">]: never; })[] & { [K_72 in Exclude<keyof I["operations"][number]["claim_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_73 in Exclude<keyof I["operations"][number]["claim_account"], keyof import("./claim_account.js").claim_account>]: never; }) | undefined;
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
                    } & { [K_74 in Exclude<keyof I["operations"][number]["create_claimed_account"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_75 in Exclude<keyof I["operations"][number]["create_claimed_account"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_76 in Exclude<keyof I["operations"][number]["create_claimed_account"]["owner"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_77 in Exclude<keyof I["operations"][number]["create_claimed_account"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_78 in Exclude<keyof I["operations"][number]["create_claimed_account"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_79 in Exclude<keyof I["operations"][number]["create_claimed_account"]["active"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_80 in Exclude<keyof I["operations"][number]["create_claimed_account"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_81 in Exclude<keyof I["operations"][number]["create_claimed_account"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_82 in Exclude<keyof I["operations"][number]["create_claimed_account"]["posting"], keyof import("./authority.js").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_83 in Exclude<keyof I["operations"][number]["create_claimed_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_84 in Exclude<keyof I["operations"][number]["create_claimed_account"]["extensions"][number], "void_t">]: never; })[] & { [K_85 in Exclude<keyof I["operations"][number]["create_claimed_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_86 in Exclude<keyof I["operations"][number]["create_claimed_account"], keyof import("./create_claimed_account.js").create_claimed_account>]: never; }) | undefined;
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
                    } & { [K_87 in Exclude<keyof I["operations"][number]["request_account_recovery"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_88 in Exclude<keyof I["operations"][number]["request_account_recovery"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_89 in Exclude<keyof I["operations"][number]["request_account_recovery"]["new_owner_authority"], keyof import("./authority.js").authority>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_90 in Exclude<keyof I["operations"][number]["request_account_recovery"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_91 in Exclude<keyof I["operations"][number]["request_account_recovery"]["extensions"][number], "void_t">]: never; })[] & { [K_92 in Exclude<keyof I["operations"][number]["request_account_recovery"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_93 in Exclude<keyof I["operations"][number]["request_account_recovery"], keyof import("./request_account_recovery.js").request_account_recovery>]: never; }) | undefined;
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
                    } & { [K_94 in Exclude<keyof I["operations"][number]["recover_account"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_95 in Exclude<keyof I["operations"][number]["recover_account"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_96 in Exclude<keyof I["operations"][number]["recover_account"]["new_owner_authority"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_97 in Exclude<keyof I["operations"][number]["recover_account"]["recent_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_98 in Exclude<keyof I["operations"][number]["recover_account"]["recent_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_99 in Exclude<keyof I["operations"][number]["recover_account"]["recent_owner_authority"], keyof import("./authority.js").authority>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_100 in Exclude<keyof I["operations"][number]["recover_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_101 in Exclude<keyof I["operations"][number]["recover_account"]["extensions"][number], "void_t">]: never; })[] & { [K_102 in Exclude<keyof I["operations"][number]["recover_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_103 in Exclude<keyof I["operations"][number]["recover_account"], keyof import("./recover_account.js").recover_account>]: never; }) | undefined;
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
                    void_t?: ({} & {} & { [K_104 in Exclude<keyof I["operations"][number]["change_recovery_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_105 in Exclude<keyof I["operations"][number]["change_recovery_account"]["extensions"][number], "void_t">]: never; })[] & { [K_106 in Exclude<keyof I["operations"][number]["change_recovery_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_107 in Exclude<keyof I["operations"][number]["change_recovery_account"], keyof import("./change_recovery_account.js").change_recovery_account>]: never; }) | undefined;
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
                } & { [K_108 in Exclude<keyof I["operations"][number]["escrow_transfer"]["hbd_amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_109 in Exclude<keyof I["operations"][number]["escrow_transfer"]["hive_amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_110 in Exclude<keyof I["operations"][number]["escrow_transfer"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } & { [K_111 in Exclude<keyof I["operations"][number]["escrow_transfer"], keyof import("./escrow_transfer.js").escrow_transfer>]: never; }) | undefined;
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
            } & { [K_112 in Exclude<keyof I["operations"][number]["escrow_dispute"], keyof import("./escrow_dispute.js").escrow_dispute>]: never; }) | undefined;
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
                } & { [K_113 in Exclude<keyof I["operations"][number]["escrow_release"]["hbd_amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_114 in Exclude<keyof I["operations"][number]["escrow_release"]["hive_amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_115 in Exclude<keyof I["operations"][number]["escrow_release"], keyof import("./escrow_release.js").escrow_release>]: never; }) | undefined;
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
                        } & { [K_116 in Exclude<keyof I["operations"][number]["pow2"]["work"]["pow2"]["input"], keyof import("./pow2.js").pow2_input>]: never; }) | undefined;
                        pow_summary?: number | undefined;
                    } & { [K_117 in Exclude<keyof I["operations"][number]["pow2"]["work"]["pow2"], keyof import("./pow2.js").pow2_pow>]: never; }) | undefined;
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
                        } & { [K_118 in Exclude<keyof I["operations"][number]["pow2"]["work"]["equihash_pow"]["input"], keyof import("./pow2.js").pow2_input>]: never; }) | undefined;
                        proof?: ({
                            n?: number | undefined;
                            k?: number | undefined;
                            seed?: string | undefined;
                            inputs?: number[] | undefined;
                        } & {
                            n?: number | undefined;
                            k?: number | undefined;
                            seed?: string | undefined;
                            inputs?: (number[] & number[] & { [K_119 in Exclude<keyof I["operations"][number]["pow2"]["work"]["equihash_pow"]["proof"]["inputs"], keyof number[]>]: never; }) | undefined;
                        } & { [K_120 in Exclude<keyof I["operations"][number]["pow2"]["work"]["equihash_pow"]["proof"], keyof import("./pow2.js").equihash_proof>]: never; }) | undefined;
                        prev_block?: string | undefined;
                        pow_summary?: number | undefined;
                    } & { [K_121 in Exclude<keyof I["operations"][number]["pow2"]["work"]["equihash_pow"], keyof import("./pow2.js").equihash_pow>]: never; }) | undefined;
                } & { [K_122 in Exclude<keyof I["operations"][number]["pow2"]["work"], keyof import("./pow2.js").pow2_work>]: never; }) | undefined;
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
                    } & { [K_123 in Exclude<keyof I["operations"][number]["pow2"]["props"]["account_creation_fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
                    maximum_block_size?: number | undefined;
                    hbd_interest_rate?: number | undefined;
                } & { [K_124 in Exclude<keyof I["operations"][number]["pow2"]["props"], keyof import("./legacy_chain_properties.js").legacy_chain_properties>]: never; }) | undefined;
            } & { [K_125 in Exclude<keyof I["operations"][number]["pow2"], keyof import("./pow2.js").pow2>]: never; }) | undefined;
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
            } & { [K_126 in Exclude<keyof I["operations"][number]["escrow_approve"], keyof import("./escrow_approve.js").escrow_approve>]: never; }) | undefined;
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
                } & { [K_127 in Exclude<keyof I["operations"][number]["transfer_to_savings"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_128 in Exclude<keyof I["operations"][number]["transfer_to_savings"], keyof import("./transfer_to_savings.js").transfer_to_savings>]: never; }) | undefined;
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
                } & { [K_129 in Exclude<keyof I["operations"][number]["transfer_from_savings"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_130 in Exclude<keyof I["operations"][number]["transfer_from_savings"], keyof import("./transfer_from_savings.js").transfer_from_savings>]: never; }) | undefined;
            cancel_transfer_from_savings?: ({
                from_account?: string | undefined;
                request_id?: number | undefined;
            } & {
                from_account?: string | undefined;
                request_id?: number | undefined;
            } & { [K_131 in Exclude<keyof I["operations"][number]["cancel_transfer_from_savings"], keyof import("./cancel_transfer_from_savings.js").cancel_transfer_from_savings>]: never; }) | undefined;
            decline_voting_rights?: ({
                account?: string | undefined;
                decline?: boolean | undefined;
            } & {
                account?: string | undefined;
                decline?: boolean | undefined;
            } & { [K_132 in Exclude<keyof I["operations"][number]["decline_voting_rights"], keyof import("./decline_voting_rights.js").decline_voting_rights>]: never; }) | undefined;
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
                } & { [K_133 in Exclude<keyof I["operations"][number]["claim_reward_balance"]["reward_hive"], keyof import("./asset.js").asset>]: never; }) | undefined;
                reward_hbd?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_134 in Exclude<keyof I["operations"][number]["claim_reward_balance"]["reward_hbd"], keyof import("./asset.js").asset>]: never; }) | undefined;
                reward_vests?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_135 in Exclude<keyof I["operations"][number]["claim_reward_balance"]["reward_vests"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_136 in Exclude<keyof I["operations"][number]["claim_reward_balance"], keyof import("./claim_reward_balance.js").claim_reward_balance>]: never; }) | undefined;
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
                } & { [K_137 in Exclude<keyof I["operations"][number]["delegate_vesting_shares"]["vesting_shares"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_138 in Exclude<keyof I["operations"][number]["delegate_vesting_shares"], keyof import("./delegate_vesting_shares.js").delegate_vesting_shares>]: never; }) | undefined;
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
                } & { [K_139 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
                delegation?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_140 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["delegation"], keyof import("./asset.js").asset>]: never; }) | undefined;
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
                    } & { [K_141 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_142 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_143 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["owner"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_144 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_145 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_146 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["active"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_147 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_148 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_149 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["posting"], keyof import("./authority.js").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_150 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_151 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["extensions"][number], "void_t">]: never; })[] & { [K_152 in Exclude<keyof I["operations"][number]["account_create_with_delegation"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_153 in Exclude<keyof I["operations"][number]["account_create_with_delegation"], keyof import("./account_create_with_delegation.js").account_create_with_delegation>]: never; }) | undefined;
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
                } & { [K_154 in Exclude<keyof I["operations"][number]["witness_set_properties"]["props"], string | number>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_155 in Exclude<keyof I["operations"][number]["witness_set_properties"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_156 in Exclude<keyof I["operations"][number]["witness_set_properties"]["extensions"][number], "void_t">]: never; })[] & { [K_157 in Exclude<keyof I["operations"][number]["witness_set_properties"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_158 in Exclude<keyof I["operations"][number]["witness_set_properties"], keyof import("./witness_set_properties.js").witness_set_properties>]: never; }) | undefined;
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
                    } & { [K_159 in Exclude<keyof I["operations"][number]["account_update2"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_160 in Exclude<keyof I["operations"][number]["account_update2"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_161 in Exclude<keyof I["operations"][number]["account_update2"]["owner"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_162 in Exclude<keyof I["operations"][number]["account_update2"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_163 in Exclude<keyof I["operations"][number]["account_update2"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_164 in Exclude<keyof I["operations"][number]["account_update2"]["active"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_165 in Exclude<keyof I["operations"][number]["account_update2"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_166 in Exclude<keyof I["operations"][number]["account_update2"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_167 in Exclude<keyof I["operations"][number]["account_update2"]["posting"], keyof import("./authority.js").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
                posting_json_metadata?: string | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_168 in Exclude<keyof I["operations"][number]["account_update2"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_169 in Exclude<keyof I["operations"][number]["account_update2"]["extensions"][number], "void_t">]: never; })[] & { [K_170 in Exclude<keyof I["operations"][number]["account_update2"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_171 in Exclude<keyof I["operations"][number]["account_update2"], keyof import("./account_update2.js").account_update2>]: never; }) | undefined;
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
                } & { [K_172 in Exclude<keyof I["operations"][number]["create_proposal"]["daily_pay"], keyof import("./asset.js").asset>]: never; }) | undefined;
                subject?: string | undefined;
                permlink?: string | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_173 in Exclude<keyof I["operations"][number]["create_proposal"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_174 in Exclude<keyof I["operations"][number]["create_proposal"]["extensions"][number], "void_t">]: never; })[] & { [K_175 in Exclude<keyof I["operations"][number]["create_proposal"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_176 in Exclude<keyof I["operations"][number]["create_proposal"], keyof import("./create_proposal.js").create_proposal>]: never; }) | undefined;
            update_proposal_votes?: ({
                voter?: string | undefined;
                proposal_ids?: string[] | undefined;
                approve?: boolean | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } & {
                voter?: string | undefined;
                proposal_ids?: (string[] & string[] & { [K_177 in Exclude<keyof I["operations"][number]["update_proposal_votes"]["proposal_ids"], keyof string[]>]: never; }) | undefined;
                approve?: boolean | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_178 in Exclude<keyof I["operations"][number]["update_proposal_votes"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_179 in Exclude<keyof I["operations"][number]["update_proposal_votes"]["extensions"][number], "void_t">]: never; })[] & { [K_180 in Exclude<keyof I["operations"][number]["update_proposal_votes"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_181 in Exclude<keyof I["operations"][number]["update_proposal_votes"], keyof import("./update_proposal_votes.js").update_proposal_votes>]: never; }) | undefined;
            remove_proposal?: ({
                proposal_owner?: string | undefined;
                proposal_ids?: string[] | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } & {
                proposal_owner?: string | undefined;
                proposal_ids?: (string[] & string[] & { [K_182 in Exclude<keyof I["operations"][number]["remove_proposal"]["proposal_ids"], keyof string[]>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_183 in Exclude<keyof I["operations"][number]["remove_proposal"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_184 in Exclude<keyof I["operations"][number]["remove_proposal"]["extensions"][number], "void_t">]: never; })[] & { [K_185 in Exclude<keyof I["operations"][number]["remove_proposal"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_186 in Exclude<keyof I["operations"][number]["remove_proposal"], keyof import("./remove_proposal.js").remove_proposal>]: never; }) | undefined;
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
                } & { [K_187 in Exclude<keyof I["operations"][number]["update_proposal"]["daily_pay"], keyof import("./asset.js").asset>]: never; }) | undefined;
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
                    void_t?: ({} & {} & { [K_188 in Exclude<keyof I["operations"][number]["update_proposal"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                    update_proposal_end_date?: ({
                        end_date?: string | undefined;
                    } & {
                        end_date?: string | undefined;
                    } & { [K_189 in Exclude<keyof I["operations"][number]["update_proposal"]["extensions"][number]["update_proposal_end_date"], "end_date">]: never; }) | undefined;
                } & { [K_190 in Exclude<keyof I["operations"][number]["update_proposal"]["extensions"][number], keyof import("./update_proposal.js").update_proposal_extension>]: never; })[] & { [K_191 in Exclude<keyof I["operations"][number]["update_proposal"]["extensions"], keyof {
                    void_t?: {} | undefined;
                    update_proposal_end_date?: {
                        end_date?: string | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_192 in Exclude<keyof I["operations"][number]["update_proposal"], keyof import("./update_proposal.js").update_proposal>]: never; }) | undefined;
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
                } & { [K_193 in Exclude<keyof I["operations"][number]["collateralized_convert"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_194 in Exclude<keyof I["operations"][number]["collateralized_convert"], keyof import("./collateralized_convert.js").collateralized_convert>]: never; }) | undefined;
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
                } & { [K_195 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
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
                    void_t?: ({} & {} & { [K_196 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                    recurrent_transfer_pair_id?: ({
                        pair_id?: number | undefined;
                    } & {
                        pair_id?: number | undefined;
                    } & { [K_197 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
                } & { [K_198 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer.js").recurrent_transfer_extension>]: never; })[] & { [K_199 in Exclude<keyof I["operations"][number]["recurrent_transfer"]["extensions"], keyof {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_200 in Exclude<keyof I["operations"][number]["recurrent_transfer"], keyof import("./recurrent_transfer.js").recurrent_transfer>]: never; }) | undefined;
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
                } & { [K_201 in Exclude<keyof I["operations"][number]["fill_convert_request"]["amount_in"], keyof import("./asset.js").asset>]: never; }) | undefined;
                amount_out?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_202 in Exclude<keyof I["operations"][number]["fill_convert_request"]["amount_out"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_203 in Exclude<keyof I["operations"][number]["fill_convert_request"], keyof import("./fill_convert_request.js").fill_convert_request>]: never; }) | undefined;
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
                } & { [K_204 in Exclude<keyof I["operations"][number]["author_reward"]["hbd_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_payout?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_205 in Exclude<keyof I["operations"][number]["author_reward"]["hive_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                vesting_payout?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_206 in Exclude<keyof I["operations"][number]["author_reward"]["vesting_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                curators_vesting_payout?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_207 in Exclude<keyof I["operations"][number]["author_reward"]["curators_vesting_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                payout_must_be_claimed?: boolean | undefined;
            } & { [K_208 in Exclude<keyof I["operations"][number]["author_reward"], keyof import("./author_reward.js").author_reward>]: never; }) | undefined;
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
                } & { [K_209 in Exclude<keyof I["operations"][number]["curation_reward"]["reward"], keyof import("./asset.js").asset>]: never; }) | undefined;
                comment_author?: string | undefined;
                comment_permlink?: string | undefined;
                payout_must_be_claimed?: boolean | undefined;
            } & { [K_210 in Exclude<keyof I["operations"][number]["curation_reward"], keyof import("./curation_reward.js").curation_reward>]: never; }) | undefined;
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
                } & { [K_211 in Exclude<keyof I["operations"][number]["comment_reward"]["payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                author_rewards?: string | undefined;
                total_payout_value?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_212 in Exclude<keyof I["operations"][number]["comment_reward"]["total_payout_value"], keyof import("./asset.js").asset>]: never; }) | undefined;
                curator_payout_value?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_213 in Exclude<keyof I["operations"][number]["comment_reward"]["curator_payout_value"], keyof import("./asset.js").asset>]: never; }) | undefined;
                beneficiary_payout_value?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_214 in Exclude<keyof I["operations"][number]["comment_reward"]["beneficiary_payout_value"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_215 in Exclude<keyof I["operations"][number]["comment_reward"], keyof import("./comment_reward.js").comment_reward>]: never; }) | undefined;
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
                } & { [K_216 in Exclude<keyof I["operations"][number]["liquidity_reward"]["payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_217 in Exclude<keyof I["operations"][number]["liquidity_reward"], keyof import("./liquidity_reward.js").liquidity_reward>]: never; }) | undefined;
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
                } & { [K_218 in Exclude<keyof I["operations"][number]["interest"]["interest"], keyof import("./asset.js").asset>]: never; }) | undefined;
                is_saved_into_hbd_balance?: boolean | undefined;
            } & { [K_219 in Exclude<keyof I["operations"][number]["interest"], keyof import("./interest.js").interest>]: never; }) | undefined;
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
                } & { [K_220 in Exclude<keyof I["operations"][number]["fill_vesting_withdraw"]["withdrawn"], keyof import("./asset.js").asset>]: never; }) | undefined;
                deposited?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_221 in Exclude<keyof I["operations"][number]["fill_vesting_withdraw"]["deposited"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_222 in Exclude<keyof I["operations"][number]["fill_vesting_withdraw"], keyof import("./fill_vesting_withdraw.js").fill_vesting_withdraw>]: never; }) | undefined;
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
                } & { [K_223 in Exclude<keyof I["operations"][number]["fill_order"]["current_pays"], keyof import("./asset.js").asset>]: never; }) | undefined;
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
                } & { [K_224 in Exclude<keyof I["operations"][number]["fill_order"]["open_pays"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_225 in Exclude<keyof I["operations"][number]["fill_order"], keyof import("./fill_order.js").fill_order>]: never; }) | undefined;
            shutdown_witness?: ({
                owner?: string | undefined;
            } & {
                owner?: string | undefined;
            } & { [K_226 in Exclude<keyof I["operations"][number]["shutdown_witness"], "owner">]: never; }) | undefined;
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
                } & { [K_227 in Exclude<keyof I["operations"][number]["fill_transfer_from_savings"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                request_id?: number | undefined;
                memo?: string | undefined;
            } & { [K_228 in Exclude<keyof I["operations"][number]["fill_transfer_from_savings"], keyof import("./fill_transfer_from_savings.js").fill_transfer_from_savings>]: never; }) | undefined;
            hardfork?: ({
                hardfork_id?: number | undefined;
            } & {
                hardfork_id?: number | undefined;
            } & { [K_229 in Exclude<keyof I["operations"][number]["hardfork"], "hardfork_id">]: never; }) | undefined;
            comment_payout_update?: ({
                author?: string | undefined;
                permlink?: string | undefined;
            } & {
                author?: string | undefined;
                permlink?: string | undefined;
            } & { [K_230 in Exclude<keyof I["operations"][number]["comment_payout_update"], keyof import("./comment_payout_update.js").comment_payout_update>]: never; }) | undefined;
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
                } & { [K_231 in Exclude<keyof I["operations"][number]["return_vesting_delegation"]["vesting_shares"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_232 in Exclude<keyof I["operations"][number]["return_vesting_delegation"], keyof import("./return_vesting_delegation.js").return_vesting_delegation>]: never; }) | undefined;
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
                } & { [K_233 in Exclude<keyof I["operations"][number]["comment_benefactor_reward"]["hbd_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_payout?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_234 in Exclude<keyof I["operations"][number]["comment_benefactor_reward"]["hive_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                vesting_payout?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_235 in Exclude<keyof I["operations"][number]["comment_benefactor_reward"]["vesting_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                payout_must_be_claimed?: boolean | undefined;
            } & { [K_236 in Exclude<keyof I["operations"][number]["comment_benefactor_reward"], keyof import("./comment_benefactor_reward.js").comment_benefactor_reward>]: never; }) | undefined;
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
                } & { [K_237 in Exclude<keyof I["operations"][number]["producer_reward"]["vesting_shares"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_238 in Exclude<keyof I["operations"][number]["producer_reward"], keyof import("./producer_reward.js").producer_reward>]: never; }) | undefined;
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
                } & { [K_239 in Exclude<keyof I["operations"][number]["clear_null_account_balance"]["total_cleared"][number], keyof import("./asset.js").asset>]: never; })[] & { [K_240 in Exclude<keyof I["operations"][number]["clear_null_account_balance"]["total_cleared"], keyof {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_241 in Exclude<keyof I["operations"][number]["clear_null_account_balance"], "total_cleared">]: never; }) | undefined;
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
                } & { [K_242 in Exclude<keyof I["operations"][number]["proposal_pay"]["payment"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_243 in Exclude<keyof I["operations"][number]["proposal_pay"], keyof import("./proposal_pay.js").proposal_pay>]: never; }) | undefined;
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
                } & { [K_244 in Exclude<keyof I["operations"][number]["dhf_funding"]["additional_funds"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_245 in Exclude<keyof I["operations"][number]["dhf_funding"], keyof import("./dhf_funding.js").dhf_funding>]: never; }) | undefined;
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
                other_affected_accounts?: (string[] & string[] & { [K_246 in Exclude<keyof I["operations"][number]["hardfork_hive"]["other_affected_accounts"], keyof string[]>]: never; }) | undefined;
                hbd_transferred?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_247 in Exclude<keyof I["operations"][number]["hardfork_hive"]["hbd_transferred"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_transferred?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_248 in Exclude<keyof I["operations"][number]["hardfork_hive"]["hive_transferred"], keyof import("./asset.js").asset>]: never; }) | undefined;
                vests_converted?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_249 in Exclude<keyof I["operations"][number]["hardfork_hive"]["vests_converted"], keyof import("./asset.js").asset>]: never; }) | undefined;
                total_hive_from_vests?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_250 in Exclude<keyof I["operations"][number]["hardfork_hive"]["total_hive_from_vests"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_251 in Exclude<keyof I["operations"][number]["hardfork_hive"], keyof import("./hardfork_hive.js").hardfork_hive>]: never; }) | undefined;
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
                } & { [K_252 in Exclude<keyof I["operations"][number]["hardfork_hive_restore"]["hbd_transferred"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_transferred?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_253 in Exclude<keyof I["operations"][number]["hardfork_hive_restore"]["hive_transferred"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_254 in Exclude<keyof I["operations"][number]["hardfork_hive_restore"], keyof import("./hardfork_hive_restore.js").hardfork_hive_restore>]: never; }) | undefined;
            delayed_voting?: ({
                voter?: string | undefined;
                votes?: string | undefined;
            } & {
                voter?: string | undefined;
                votes?: string | undefined;
            } & { [K_255 in Exclude<keyof I["operations"][number]["delayed_voting"], keyof import("./delayed_voting.js").delayed_voting>]: never; }) | undefined;
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
                } & { [K_256 in Exclude<keyof I["operations"][number]["consolidate_treasury_balance"]["total_moved"][number], keyof import("./asset.js").asset>]: never; })[] & { [K_257 in Exclude<keyof I["operations"][number]["consolidate_treasury_balance"]["total_moved"], keyof {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_258 in Exclude<keyof I["operations"][number]["consolidate_treasury_balance"], "total_moved">]: never; }) | undefined;
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
                } & { [K_259 in Exclude<keyof I["operations"][number]["effective_comment_vote"]["pending_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_260 in Exclude<keyof I["operations"][number]["effective_comment_vote"], keyof import("./effective_comment_vote.js").effective_comment_vote>]: never; }) | undefined;
            ineffective_delete_comment?: ({
                author?: string | undefined;
                permlink?: string | undefined;
            } & {
                author?: string | undefined;
                permlink?: string | undefined;
            } & { [K_261 in Exclude<keyof I["operations"][number]["ineffective_delete_comment"], keyof import("./ineffective_delete_comment.js").ineffective_delete_comment>]: never; }) | undefined;
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
                } & { [K_262 in Exclude<keyof I["operations"][number]["dhf_conversion"]["hive_amount_in"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hbd_amount_out?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_263 in Exclude<keyof I["operations"][number]["dhf_conversion"]["hbd_amount_out"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_264 in Exclude<keyof I["operations"][number]["dhf_conversion"], keyof import("./dhf_conversion.js").dhf_conversion>]: never; }) | undefined;
            expired_account_notification?: ({
                account?: string | undefined;
            } & {
                account?: string | undefined;
            } & { [K_265 in Exclude<keyof I["operations"][number]["expired_account_notification"], "account">]: never; }) | undefined;
            changed_recovery_account?: ({
                account?: string | undefined;
                old_recovery_account?: string | undefined;
                new_recovery_account?: string | undefined;
            } & {
                account?: string | undefined;
                old_recovery_account?: string | undefined;
                new_recovery_account?: string | undefined;
            } & { [K_266 in Exclude<keyof I["operations"][number]["changed_recovery_account"], keyof import("./changed_recovery_account.js").changed_recovery_account>]: never; }) | undefined;
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
                } & { [K_267 in Exclude<keyof I["operations"][number]["transfer_to_vesting_completed"]["hive_vested"], keyof import("./asset.js").asset>]: never; }) | undefined;
                vesting_shares_received?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_268 in Exclude<keyof I["operations"][number]["transfer_to_vesting_completed"]["vesting_shares_received"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_269 in Exclude<keyof I["operations"][number]["transfer_to_vesting_completed"], keyof import("./transfer_to_vesting_completed.js").transfer_to_vesting_completed>]: never; }) | undefined;
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
                } & { [K_270 in Exclude<keyof I["operations"][number]["pow_reward"]["reward"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_271 in Exclude<keyof I["operations"][number]["pow_reward"], keyof import("./pow_reward.js").pow_reward>]: never; }) | undefined;
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
                } & { [K_272 in Exclude<keyof I["operations"][number]["vesting_shares_split"]["vesting_shares_before_split"], keyof import("./asset.js").asset>]: never; }) | undefined;
                vesting_shares_after_split?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_273 in Exclude<keyof I["operations"][number]["vesting_shares_split"]["vesting_shares_after_split"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_274 in Exclude<keyof I["operations"][number]["vesting_shares_split"], keyof import("./vesting_shares_split.js").vesting_shares_split>]: never; }) | undefined;
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
                } & { [K_275 in Exclude<keyof I["operations"][number]["account_created"]["initial_vesting_shares"], keyof import("./asset.js").asset>]: never; }) | undefined;
                initial_delegation?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_276 in Exclude<keyof I["operations"][number]["account_created"]["initial_delegation"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_277 in Exclude<keyof I["operations"][number]["account_created"], keyof import("./account_created.js").account_created>]: never; }) | undefined;
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
                } & { [K_278 in Exclude<keyof I["operations"][number]["fill_collateralized_convert_request"]["amount_in"], keyof import("./asset.js").asset>]: never; }) | undefined;
                amount_out?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_279 in Exclude<keyof I["operations"][number]["fill_collateralized_convert_request"]["amount_out"], keyof import("./asset.js").asset>]: never; }) | undefined;
                excess_collateral?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_280 in Exclude<keyof I["operations"][number]["fill_collateralized_convert_request"]["excess_collateral"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_281 in Exclude<keyof I["operations"][number]["fill_collateralized_convert_request"], keyof import("./fill_collateralized_convert_request.js").fill_collateralized_convert_request>]: never; }) | undefined;
            system_warning?: ({
                message?: string | undefined;
            } & {
                message?: string | undefined;
            } & { [K_282 in Exclude<keyof I["operations"][number]["system_warning"], "message">]: never; }) | undefined;
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
                } & { [K_283 in Exclude<keyof I["operations"][number]["fill_recurrent_transfer"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                memo?: string | undefined;
                remaining_executions?: number | undefined;
            } & { [K_284 in Exclude<keyof I["operations"][number]["fill_recurrent_transfer"], keyof import("./fill_recurrent_transfer.js").fill_recurrent_transfer>]: never; }) | undefined;
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
                } & { [K_285 in Exclude<keyof I["operations"][number]["failed_recurrent_transfer"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                memo?: string | undefined;
                consecutive_failures?: number | undefined;
                remaining_executions?: number | undefined;
                deleted?: boolean | undefined;
            } & { [K_286 in Exclude<keyof I["operations"][number]["failed_recurrent_transfer"], keyof import("./failed_recurrent_transfer.js").failed_recurrent_transfer>]: never; }) | undefined;
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
                } & { [K_287 in Exclude<keyof I["operations"][number]["limit_order_cancelled"]["amount_back"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_288 in Exclude<keyof I["operations"][number]["limit_order_cancelled"], keyof import("./limit_order_cancelled.js").limit_order_cancelled>]: never; }) | undefined;
            producer_missed?: ({
                producer?: string | undefined;
            } & {
                producer?: string | undefined;
            } & { [K_289 in Exclude<keyof I["operations"][number]["producer_missed"], "producer">]: never; }) | undefined;
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
                } & { [K_290 in Exclude<keyof I["operations"][number]["proposal_fee"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_291 in Exclude<keyof I["operations"][number]["proposal_fee"], keyof import("./proposal_fee.js").proposal_fee>]: never; }) | undefined;
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
                } & { [K_292 in Exclude<keyof I["operations"][number]["collateralized_convert_immediate_conversion"]["hbd_out"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_293 in Exclude<keyof I["operations"][number]["collateralized_convert_immediate_conversion"], keyof import("./collateralized_convert_immediate_conversion.js").collateralized_convert_immediate_conversion>]: never; }) | undefined;
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
                } & { [K_294 in Exclude<keyof I["operations"][number]["escrow_approved"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_295 in Exclude<keyof I["operations"][number]["escrow_approved"], keyof import("./escrow_approved.js").escrow_approved>]: never; }) | undefined;
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
                } & { [K_296 in Exclude<keyof I["operations"][number]["escrow_rejected"]["hbd_amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_297 in Exclude<keyof I["operations"][number]["escrow_rejected"]["hive_amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_298 in Exclude<keyof I["operations"][number]["escrow_rejected"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_299 in Exclude<keyof I["operations"][number]["escrow_rejected"], keyof import("./escrow_rejected.js").escrow_rejected>]: never; }) | undefined;
            proxy_cleared?: ({
                account?: string | undefined;
                proxy?: string | undefined;
            } & {
                account?: string | undefined;
                proxy?: string | undefined;
            } & { [K_300 in Exclude<keyof I["operations"][number]["proxy_cleared"], keyof import("./proxy_cleared.js").proxy_cleared>]: never; }) | undefined;
            declined_voting_rights?: ({
                account?: string | undefined;
            } & {
                account?: string | undefined;
            } & { [K_301 in Exclude<keyof I["operations"][number]["declined_voting_rights"], "account">]: never; }) | undefined;
        } & { [K_302 in Exclude<keyof I["operations"][number], keyof operation>]: never; })[] & { [K_303 in Exclude<keyof I["operations"], keyof {
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
                owner?: string | undefined;
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
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
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
        }[]>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_304 in Exclude<keyof I["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_305 in Exclude<keyof I["extensions"][number], "void_t">]: never; })[] & { [K_306 in Exclude<keyof I["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
        signatures?: (string[] & string[] & { [K_307 in Exclude<keyof I["signatures"], keyof string[]>]: never; }) | undefined;
    } & { [K_308 in Exclude<keyof I, keyof transaction>]: never; }>(base?: I | undefined): transaction;
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
                owner?: string | undefined;
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
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
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
        }[] | undefined;
        extensions?: {
            void_t?: {} | undefined;
        }[] | undefined;
        signatures?: string[] | undefined;
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
                owner?: string | undefined;
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
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
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
                owner?: string | undefined;
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
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
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
            } & { [K_309 in Exclude<keyof I_1["operations"][number]["vote"], keyof import("./vote.js").vote>]: never; }) | undefined;
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
            } & { [K_310 in Exclude<keyof I_1["operations"][number]["comment"], keyof import("./comment.js").comment>]: never; }) | undefined;
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
                } & { [K_311 in Exclude<keyof I_1["operations"][number]["transfer"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_312 in Exclude<keyof I_1["operations"][number]["transfer"], keyof import("./transfer.js").transfer>]: never; }) | undefined;
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
                } & { [K_313 in Exclude<keyof I_1["operations"][number]["transfer_to_vesting"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_314 in Exclude<keyof I_1["operations"][number]["transfer_to_vesting"], keyof import("./transfer_to_vesting.js").transfer_to_vesting>]: never; }) | undefined;
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
                } & { [K_315 in Exclude<keyof I_1["operations"][number]["withdraw_vesting"]["vesting_shares"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_316 in Exclude<keyof I_1["operations"][number]["withdraw_vesting"], keyof import("./withdraw_vesting.js").withdraw_vesting>]: never; }) | undefined;
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
                } & { [K_317 in Exclude<keyof I_1["operations"][number]["limit_order_create"]["amount_to_sell"], keyof import("./asset.js").asset>]: never; }) | undefined;
                min_to_receive?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_318 in Exclude<keyof I_1["operations"][number]["limit_order_create"]["min_to_receive"], keyof import("./asset.js").asset>]: never; }) | undefined;
                fill_or_kill?: boolean | undefined;
                expiration?: string | undefined;
            } & { [K_319 in Exclude<keyof I_1["operations"][number]["limit_order_create"], keyof import("./limit_order_create.js").limit_order_create>]: never; }) | undefined;
            limit_order_cancel?: ({
                owner?: string | undefined;
                orderid?: number | undefined;
            } & {
                owner?: string | undefined;
                orderid?: number | undefined;
            } & { [K_320 in Exclude<keyof I_1["operations"][number]["limit_order_cancel"], keyof import("./limit_order_cancel.js").limit_order_cancel>]: never; }) | undefined;
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
                    } & { [K_321 in Exclude<keyof I_1["operations"][number]["feed_publish"]["exchange_rate"]["base"], keyof import("./asset.js").asset>]: never; }) | undefined;
                    quote?: ({
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & { [K_322 in Exclude<keyof I_1["operations"][number]["feed_publish"]["exchange_rate"]["quote"], keyof import("./asset.js").asset>]: never; }) | undefined;
                } & { [K_323 in Exclude<keyof I_1["operations"][number]["feed_publish"]["exchange_rate"], keyof import("./price.js").price>]: never; }) | undefined;
            } & { [K_324 in Exclude<keyof I_1["operations"][number]["feed_publish"], keyof import("./feed_publish.js").feed_publish>]: never; }) | undefined;
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
                } & { [K_325 in Exclude<keyof I_1["operations"][number]["convert"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_326 in Exclude<keyof I_1["operations"][number]["convert"], keyof import("./convert.js").convert>]: never; }) | undefined;
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
                } & { [K_327 in Exclude<keyof I_1["operations"][number]["account_create"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
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
                    } & { [K_328 in Exclude<keyof I_1["operations"][number]["account_create"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_329 in Exclude<keyof I_1["operations"][number]["account_create"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_330 in Exclude<keyof I_1["operations"][number]["account_create"]["owner"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_331 in Exclude<keyof I_1["operations"][number]["account_create"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_332 in Exclude<keyof I_1["operations"][number]["account_create"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_333 in Exclude<keyof I_1["operations"][number]["account_create"]["active"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_334 in Exclude<keyof I_1["operations"][number]["account_create"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_335 in Exclude<keyof I_1["operations"][number]["account_create"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_336 in Exclude<keyof I_1["operations"][number]["account_create"]["posting"], keyof import("./authority.js").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_337 in Exclude<keyof I_1["operations"][number]["account_create"], keyof import("./account_create.js").account_create>]: never; }) | undefined;
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
                    } & { [K_338 in Exclude<keyof I_1["operations"][number]["account_update"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_339 in Exclude<keyof I_1["operations"][number]["account_update"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_340 in Exclude<keyof I_1["operations"][number]["account_update"]["owner"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_341 in Exclude<keyof I_1["operations"][number]["account_update"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_342 in Exclude<keyof I_1["operations"][number]["account_update"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_343 in Exclude<keyof I_1["operations"][number]["account_update"]["active"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_344 in Exclude<keyof I_1["operations"][number]["account_update"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_345 in Exclude<keyof I_1["operations"][number]["account_update"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_346 in Exclude<keyof I_1["operations"][number]["account_update"]["posting"], keyof import("./authority.js").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
            } & { [K_347 in Exclude<keyof I_1["operations"][number]["account_update"], keyof import("./account_update.js").account_update>]: never; }) | undefined;
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
                    } & { [K_348 in Exclude<keyof I_1["operations"][number]["witness_update"]["props"]["account_creation_fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
                    maximum_block_size?: number | undefined;
                    hbd_interest_rate?: number | undefined;
                } & { [K_349 in Exclude<keyof I_1["operations"][number]["witness_update"]["props"], keyof import("./legacy_chain_properties.js").legacy_chain_properties>]: never; }) | undefined;
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_350 in Exclude<keyof I_1["operations"][number]["witness_update"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_351 in Exclude<keyof I_1["operations"][number]["witness_update"], keyof import("./witness_update.js").witness_update>]: never; }) | undefined;
            account_witness_vote?: ({
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } & {
                account?: string | undefined;
                witness?: string | undefined;
                approve?: boolean | undefined;
            } & { [K_352 in Exclude<keyof I_1["operations"][number]["account_witness_vote"], keyof import("./account_witness_vote.js").account_witness_vote>]: never; }) | undefined;
            account_witness_proxy?: ({
                account?: string | undefined;
                proxy?: string | undefined;
            } & {
                account?: string | undefined;
                proxy?: string | undefined;
            } & { [K_353 in Exclude<keyof I_1["operations"][number]["account_witness_proxy"], keyof import("./account_witness_proxy.js").account_witness_proxy>]: never; }) | undefined;
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
                } & { [K_354 in Exclude<keyof I_1["operations"][number]["pow"]["work"], keyof import("./pow.js").pow_work>]: never; }) | undefined;
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
                    } & { [K_355 in Exclude<keyof I_1["operations"][number]["pow"]["props"]["account_creation_fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
                    maximum_block_size?: number | undefined;
                    hbd_interest_rate?: number | undefined;
                } & { [K_356 in Exclude<keyof I_1["operations"][number]["pow"]["props"], keyof import("./legacy_chain_properties.js").legacy_chain_properties>]: never; }) | undefined;
            } & { [K_357 in Exclude<keyof I_1["operations"][number]["pow"], keyof import("./pow.js").pow>]: never; }) | undefined;
            custom?: ({
                required_auths?: string[] | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } & {
                required_auths?: (string[] & string[] & { [K_358 in Exclude<keyof I_1["operations"][number]["custom"]["required_auths"], keyof string[]>]: never; }) | undefined;
                id?: number | undefined;
                data?: string | undefined;
            } & { [K_359 in Exclude<keyof I_1["operations"][number]["custom"], keyof import("./custom.js").custom>]: never; }) | undefined;
            witness_block_approve?: ({
                witness?: string | undefined;
                block_id?: string | undefined;
            } & {
                witness?: string | undefined;
                block_id?: string | undefined;
            } & { [K_360 in Exclude<keyof I_1["operations"][number]["witness_block_approve"], keyof import("./witness_block_approve.js").witness_block_approve>]: never; }) | undefined;
            delete_comment?: ({
                author?: string | undefined;
                permlink?: string | undefined;
            } & {
                author?: string | undefined;
                permlink?: string | undefined;
            } & { [K_361 in Exclude<keyof I_1["operations"][number]["delete_comment"], keyof import("./delete_comment.js").delete_comment>]: never; }) | undefined;
            custom_json?: ({
                required_auths?: string[] | undefined;
                required_posting_auths?: string[] | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } & {
                required_auths?: (string[] & string[] & { [K_362 in Exclude<keyof I_1["operations"][number]["custom_json"]["required_auths"], keyof string[]>]: never; }) | undefined;
                required_posting_auths?: (string[] & string[] & { [K_363 in Exclude<keyof I_1["operations"][number]["custom_json"]["required_posting_auths"], keyof string[]>]: never; }) | undefined;
                id?: string | undefined;
                json?: string | undefined;
            } & { [K_364 in Exclude<keyof I_1["operations"][number]["custom_json"], keyof import("./custom_json.js").custom_json>]: never; }) | undefined;
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
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
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
                } & { [K_365 in Exclude<keyof I_1["operations"][number]["comment_options"]["max_accepted_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                percent_hbd?: number | undefined;
                allow_votes?: boolean | undefined;
                allow_curation_rewards?: boolean | undefined;
                extensions?: ({
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
                }[] & ({
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
                } & {
                    comment_payout_beneficiaries?: ({
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
                        } & { [K_366 in Exclude<keyof I_1["operations"][number]["comment_options"]["extensions"][number]["comment_payout_beneficiaries"]["beneficiaries"][number], keyof import("./comment_options.js").beneficiary_route_type>]: never; })[] & { [K_367 in Exclude<keyof I_1["operations"][number]["comment_options"]["extensions"][number]["comment_payout_beneficiaries"]["beneficiaries"], keyof {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[]>]: never; }) | undefined;
                    } & { [K_368 in Exclude<keyof I_1["operations"][number]["comment_options"]["extensions"][number]["comment_payout_beneficiaries"], "beneficiaries">]: never; }) | undefined;
                } & { [K_369 in Exclude<keyof I_1["operations"][number]["comment_options"]["extensions"][number], "comment_payout_beneficiaries">]: never; })[] & { [K_370 in Exclude<keyof I_1["operations"][number]["comment_options"]["extensions"], keyof {
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_371 in Exclude<keyof I_1["operations"][number]["comment_options"], keyof import("./comment_options.js").comment_options>]: never; }) | undefined;
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
            } & { [K_372 in Exclude<keyof I_1["operations"][number]["set_withdraw_vesting_route"], keyof import("./set_withdraw_vesting_route.js").set_withdraw_vesting_route>]: never; }) | undefined;
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
                } & { [K_373 in Exclude<keyof I_1["operations"][number]["limit_order_create2"]["amount_to_sell"], keyof import("./asset.js").asset>]: never; }) | undefined;
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
                    } & { [K_374 in Exclude<keyof I_1["operations"][number]["limit_order_create2"]["exchange_rate"]["base"], keyof import("./asset.js").asset>]: never; }) | undefined;
                    quote?: ({
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & {
                        amount?: string | undefined;
                        precision?: number | undefined;
                        nai?: string | undefined;
                    } & { [K_375 in Exclude<keyof I_1["operations"][number]["limit_order_create2"]["exchange_rate"]["quote"], keyof import("./asset.js").asset>]: never; }) | undefined;
                } & { [K_376 in Exclude<keyof I_1["operations"][number]["limit_order_create2"]["exchange_rate"], keyof import("./price.js").price>]: never; }) | undefined;
                expiration?: string | undefined;
            } & { [K_377 in Exclude<keyof I_1["operations"][number]["limit_order_create2"], keyof import("./limit_order_create2.js").limit_order_create2>]: never; }) | undefined;
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
                } & { [K_378 in Exclude<keyof I_1["operations"][number]["claim_account"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_379 in Exclude<keyof I_1["operations"][number]["claim_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_380 in Exclude<keyof I_1["operations"][number]["claim_account"]["extensions"][number], "void_t">]: never; })[] & { [K_381 in Exclude<keyof I_1["operations"][number]["claim_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_382 in Exclude<keyof I_1["operations"][number]["claim_account"], keyof import("./claim_account.js").claim_account>]: never; }) | undefined;
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
                    } & { [K_383 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_384 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_385 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["owner"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_386 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_387 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_388 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["active"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_389 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_390 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_391 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["posting"], keyof import("./authority.js").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_392 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_393 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["extensions"][number], "void_t">]: never; })[] & { [K_394 in Exclude<keyof I_1["operations"][number]["create_claimed_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_395 in Exclude<keyof I_1["operations"][number]["create_claimed_account"], keyof import("./create_claimed_account.js").create_claimed_account>]: never; }) | undefined;
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
                    } & { [K_396 in Exclude<keyof I_1["operations"][number]["request_account_recovery"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_397 in Exclude<keyof I_1["operations"][number]["request_account_recovery"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_398 in Exclude<keyof I_1["operations"][number]["request_account_recovery"]["new_owner_authority"], keyof import("./authority.js").authority>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_399 in Exclude<keyof I_1["operations"][number]["request_account_recovery"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_400 in Exclude<keyof I_1["operations"][number]["request_account_recovery"]["extensions"][number], "void_t">]: never; })[] & { [K_401 in Exclude<keyof I_1["operations"][number]["request_account_recovery"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_402 in Exclude<keyof I_1["operations"][number]["request_account_recovery"], keyof import("./request_account_recovery.js").request_account_recovery>]: never; }) | undefined;
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
                    } & { [K_403 in Exclude<keyof I_1["operations"][number]["recover_account"]["new_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_404 in Exclude<keyof I_1["operations"][number]["recover_account"]["new_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_405 in Exclude<keyof I_1["operations"][number]["recover_account"]["new_owner_authority"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_406 in Exclude<keyof I_1["operations"][number]["recover_account"]["recent_owner_authority"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_407 in Exclude<keyof I_1["operations"][number]["recover_account"]["recent_owner_authority"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_408 in Exclude<keyof I_1["operations"][number]["recover_account"]["recent_owner_authority"], keyof import("./authority.js").authority>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_409 in Exclude<keyof I_1["operations"][number]["recover_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_410 in Exclude<keyof I_1["operations"][number]["recover_account"]["extensions"][number], "void_t">]: never; })[] & { [K_411 in Exclude<keyof I_1["operations"][number]["recover_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_412 in Exclude<keyof I_1["operations"][number]["recover_account"], keyof import("./recover_account.js").recover_account>]: never; }) | undefined;
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
                    void_t?: ({} & {} & { [K_413 in Exclude<keyof I_1["operations"][number]["change_recovery_account"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_414 in Exclude<keyof I_1["operations"][number]["change_recovery_account"]["extensions"][number], "void_t">]: never; })[] & { [K_415 in Exclude<keyof I_1["operations"][number]["change_recovery_account"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_416 in Exclude<keyof I_1["operations"][number]["change_recovery_account"], keyof import("./change_recovery_account.js").change_recovery_account>]: never; }) | undefined;
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
                } & { [K_417 in Exclude<keyof I_1["operations"][number]["escrow_transfer"]["hbd_amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_418 in Exclude<keyof I_1["operations"][number]["escrow_transfer"]["hive_amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_419 in Exclude<keyof I_1["operations"][number]["escrow_transfer"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
                ratification_deadline?: string | undefined;
                escrow_expiration?: string | undefined;
                json_meta?: string | undefined;
            } & { [K_420 in Exclude<keyof I_1["operations"][number]["escrow_transfer"], keyof import("./escrow_transfer.js").escrow_transfer>]: never; }) | undefined;
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
            } & { [K_421 in Exclude<keyof I_1["operations"][number]["escrow_dispute"], keyof import("./escrow_dispute.js").escrow_dispute>]: never; }) | undefined;
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
                } & { [K_422 in Exclude<keyof I_1["operations"][number]["escrow_release"]["hbd_amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_423 in Exclude<keyof I_1["operations"][number]["escrow_release"]["hive_amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_424 in Exclude<keyof I_1["operations"][number]["escrow_release"], keyof import("./escrow_release.js").escrow_release>]: never; }) | undefined;
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
                        } & { [K_425 in Exclude<keyof I_1["operations"][number]["pow2"]["work"]["pow2"]["input"], keyof import("./pow2.js").pow2_input>]: never; }) | undefined;
                        pow_summary?: number | undefined;
                    } & { [K_426 in Exclude<keyof I_1["operations"][number]["pow2"]["work"]["pow2"], keyof import("./pow2.js").pow2_pow>]: never; }) | undefined;
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
                        } & { [K_427 in Exclude<keyof I_1["operations"][number]["pow2"]["work"]["equihash_pow"]["input"], keyof import("./pow2.js").pow2_input>]: never; }) | undefined;
                        proof?: ({
                            n?: number | undefined;
                            k?: number | undefined;
                            seed?: string | undefined;
                            inputs?: number[] | undefined;
                        } & {
                            n?: number | undefined;
                            k?: number | undefined;
                            seed?: string | undefined;
                            inputs?: (number[] & number[] & { [K_428 in Exclude<keyof I_1["operations"][number]["pow2"]["work"]["equihash_pow"]["proof"]["inputs"], keyof number[]>]: never; }) | undefined;
                        } & { [K_429 in Exclude<keyof I_1["operations"][number]["pow2"]["work"]["equihash_pow"]["proof"], keyof import("./pow2.js").equihash_proof>]: never; }) | undefined;
                        prev_block?: string | undefined;
                        pow_summary?: number | undefined;
                    } & { [K_430 in Exclude<keyof I_1["operations"][number]["pow2"]["work"]["equihash_pow"], keyof import("./pow2.js").equihash_pow>]: never; }) | undefined;
                } & { [K_431 in Exclude<keyof I_1["operations"][number]["pow2"]["work"], keyof import("./pow2.js").pow2_work>]: never; }) | undefined;
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
                    } & { [K_432 in Exclude<keyof I_1["operations"][number]["pow2"]["props"]["account_creation_fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
                    maximum_block_size?: number | undefined;
                    hbd_interest_rate?: number | undefined;
                } & { [K_433 in Exclude<keyof I_1["operations"][number]["pow2"]["props"], keyof import("./legacy_chain_properties.js").legacy_chain_properties>]: never; }) | undefined;
            } & { [K_434 in Exclude<keyof I_1["operations"][number]["pow2"], keyof import("./pow2.js").pow2>]: never; }) | undefined;
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
            } & { [K_435 in Exclude<keyof I_1["operations"][number]["escrow_approve"], keyof import("./escrow_approve.js").escrow_approve>]: never; }) | undefined;
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
                } & { [K_436 in Exclude<keyof I_1["operations"][number]["transfer_to_savings"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_437 in Exclude<keyof I_1["operations"][number]["transfer_to_savings"], keyof import("./transfer_to_savings.js").transfer_to_savings>]: never; }) | undefined;
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
                } & { [K_438 in Exclude<keyof I_1["operations"][number]["transfer_from_savings"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                memo?: string | undefined;
            } & { [K_439 in Exclude<keyof I_1["operations"][number]["transfer_from_savings"], keyof import("./transfer_from_savings.js").transfer_from_savings>]: never; }) | undefined;
            cancel_transfer_from_savings?: ({
                from_account?: string | undefined;
                request_id?: number | undefined;
            } & {
                from_account?: string | undefined;
                request_id?: number | undefined;
            } & { [K_440 in Exclude<keyof I_1["operations"][number]["cancel_transfer_from_savings"], keyof import("./cancel_transfer_from_savings.js").cancel_transfer_from_savings>]: never; }) | undefined;
            decline_voting_rights?: ({
                account?: string | undefined;
                decline?: boolean | undefined;
            } & {
                account?: string | undefined;
                decline?: boolean | undefined;
            } & { [K_441 in Exclude<keyof I_1["operations"][number]["decline_voting_rights"], keyof import("./decline_voting_rights.js").decline_voting_rights>]: never; }) | undefined;
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
                } & { [K_442 in Exclude<keyof I_1["operations"][number]["claim_reward_balance"]["reward_hive"], keyof import("./asset.js").asset>]: never; }) | undefined;
                reward_hbd?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_443 in Exclude<keyof I_1["operations"][number]["claim_reward_balance"]["reward_hbd"], keyof import("./asset.js").asset>]: never; }) | undefined;
                reward_vests?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_444 in Exclude<keyof I_1["operations"][number]["claim_reward_balance"]["reward_vests"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_445 in Exclude<keyof I_1["operations"][number]["claim_reward_balance"], keyof import("./claim_reward_balance.js").claim_reward_balance>]: never; }) | undefined;
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
                } & { [K_446 in Exclude<keyof I_1["operations"][number]["delegate_vesting_shares"]["vesting_shares"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_447 in Exclude<keyof I_1["operations"][number]["delegate_vesting_shares"], keyof import("./delegate_vesting_shares.js").delegate_vesting_shares>]: never; }) | undefined;
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
                } & { [K_448 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
                delegation?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_449 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["delegation"], keyof import("./asset.js").asset>]: never; }) | undefined;
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
                    } & { [K_450 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_451 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_452 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["owner"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_453 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_454 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_455 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["active"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_456 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_457 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_458 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["posting"], keyof import("./authority.js").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_459 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_460 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["extensions"][number], "void_t">]: never; })[] & { [K_461 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_462 in Exclude<keyof I_1["operations"][number]["account_create_with_delegation"], keyof import("./account_create_with_delegation.js").account_create_with_delegation>]: never; }) | undefined;
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
                } & { [K_463 in Exclude<keyof I_1["operations"][number]["witness_set_properties"]["props"], string | number>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_464 in Exclude<keyof I_1["operations"][number]["witness_set_properties"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_465 in Exclude<keyof I_1["operations"][number]["witness_set_properties"]["extensions"][number], "void_t">]: never; })[] & { [K_466 in Exclude<keyof I_1["operations"][number]["witness_set_properties"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_467 in Exclude<keyof I_1["operations"][number]["witness_set_properties"], keyof import("./witness_set_properties.js").witness_set_properties>]: never; }) | undefined;
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
                    } & { [K_468 in Exclude<keyof I_1["operations"][number]["account_update2"]["owner"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_469 in Exclude<keyof I_1["operations"][number]["account_update2"]["owner"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_470 in Exclude<keyof I_1["operations"][number]["account_update2"]["owner"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_471 in Exclude<keyof I_1["operations"][number]["account_update2"]["active"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_472 in Exclude<keyof I_1["operations"][number]["account_update2"]["active"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_473 in Exclude<keyof I_1["operations"][number]["account_update2"]["active"], keyof import("./authority.js").authority>]: never; }) | undefined;
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
                    } & { [K_474 in Exclude<keyof I_1["operations"][number]["account_update2"]["posting"]["account_auths"], string | number>]: never; }) | undefined;
                    key_auths?: ({
                        [x: string]: number | undefined;
                    } & {
                        [x: string]: number | undefined;
                    } & { [K_475 in Exclude<keyof I_1["operations"][number]["account_update2"]["posting"]["key_auths"], string | number>]: never; }) | undefined;
                } & { [K_476 in Exclude<keyof I_1["operations"][number]["account_update2"]["posting"], keyof import("./authority.js").authority>]: never; }) | undefined;
                memo_key?: string | undefined;
                json_metadata?: string | undefined;
                posting_json_metadata?: string | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_477 in Exclude<keyof I_1["operations"][number]["account_update2"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_478 in Exclude<keyof I_1["operations"][number]["account_update2"]["extensions"][number], "void_t">]: never; })[] & { [K_479 in Exclude<keyof I_1["operations"][number]["account_update2"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_480 in Exclude<keyof I_1["operations"][number]["account_update2"], keyof import("./account_update2.js").account_update2>]: never; }) | undefined;
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
                } & { [K_481 in Exclude<keyof I_1["operations"][number]["create_proposal"]["daily_pay"], keyof import("./asset.js").asset>]: never; }) | undefined;
                subject?: string | undefined;
                permlink?: string | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_482 in Exclude<keyof I_1["operations"][number]["create_proposal"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_483 in Exclude<keyof I_1["operations"][number]["create_proposal"]["extensions"][number], "void_t">]: never; })[] & { [K_484 in Exclude<keyof I_1["operations"][number]["create_proposal"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_485 in Exclude<keyof I_1["operations"][number]["create_proposal"], keyof import("./create_proposal.js").create_proposal>]: never; }) | undefined;
            update_proposal_votes?: ({
                voter?: string | undefined;
                proposal_ids?: string[] | undefined;
                approve?: boolean | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } & {
                voter?: string | undefined;
                proposal_ids?: (string[] & string[] & { [K_486 in Exclude<keyof I_1["operations"][number]["update_proposal_votes"]["proposal_ids"], keyof string[]>]: never; }) | undefined;
                approve?: boolean | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_487 in Exclude<keyof I_1["operations"][number]["update_proposal_votes"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_488 in Exclude<keyof I_1["operations"][number]["update_proposal_votes"]["extensions"][number], "void_t">]: never; })[] & { [K_489 in Exclude<keyof I_1["operations"][number]["update_proposal_votes"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_490 in Exclude<keyof I_1["operations"][number]["update_proposal_votes"], keyof import("./update_proposal_votes.js").update_proposal_votes>]: never; }) | undefined;
            remove_proposal?: ({
                proposal_owner?: string | undefined;
                proposal_ids?: string[] | undefined;
                extensions?: {
                    void_t?: {} | undefined;
                }[] | undefined;
            } & {
                proposal_owner?: string | undefined;
                proposal_ids?: (string[] & string[] & { [K_491 in Exclude<keyof I_1["operations"][number]["remove_proposal"]["proposal_ids"], keyof string[]>]: never; }) | undefined;
                extensions?: ({
                    void_t?: {} | undefined;
                }[] & ({
                    void_t?: {} | undefined;
                } & {
                    void_t?: ({} & {} & { [K_492 in Exclude<keyof I_1["operations"][number]["remove_proposal"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                } & { [K_493 in Exclude<keyof I_1["operations"][number]["remove_proposal"]["extensions"][number], "void_t">]: never; })[] & { [K_494 in Exclude<keyof I_1["operations"][number]["remove_proposal"]["extensions"], keyof {
                    void_t?: {} | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_495 in Exclude<keyof I_1["operations"][number]["remove_proposal"], keyof import("./remove_proposal.js").remove_proposal>]: never; }) | undefined;
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
                } & { [K_496 in Exclude<keyof I_1["operations"][number]["update_proposal"]["daily_pay"], keyof import("./asset.js").asset>]: never; }) | undefined;
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
                    void_t?: ({} & {} & { [K_497 in Exclude<keyof I_1["operations"][number]["update_proposal"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                    update_proposal_end_date?: ({
                        end_date?: string | undefined;
                    } & {
                        end_date?: string | undefined;
                    } & { [K_498 in Exclude<keyof I_1["operations"][number]["update_proposal"]["extensions"][number]["update_proposal_end_date"], "end_date">]: never; }) | undefined;
                } & { [K_499 in Exclude<keyof I_1["operations"][number]["update_proposal"]["extensions"][number], keyof import("./update_proposal.js").update_proposal_extension>]: never; })[] & { [K_500 in Exclude<keyof I_1["operations"][number]["update_proposal"]["extensions"], keyof {
                    void_t?: {} | undefined;
                    update_proposal_end_date?: {
                        end_date?: string | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_501 in Exclude<keyof I_1["operations"][number]["update_proposal"], keyof import("./update_proposal.js").update_proposal>]: never; }) | undefined;
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
                } & { [K_502 in Exclude<keyof I_1["operations"][number]["collateralized_convert"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_503 in Exclude<keyof I_1["operations"][number]["collateralized_convert"], keyof import("./collateralized_convert.js").collateralized_convert>]: never; }) | undefined;
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
                } & { [K_504 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
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
                    void_t?: ({} & {} & { [K_505 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number]["void_t"], never>]: never; }) | undefined;
                    recurrent_transfer_pair_id?: ({
                        pair_id?: number | undefined;
                    } & {
                        pair_id?: number | undefined;
                    } & { [K_506 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number]["recurrent_transfer_pair_id"], "pair_id">]: never; }) | undefined;
                } & { [K_507 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"][number], keyof import("./recurrent_transfer.js").recurrent_transfer_extension>]: never; })[] & { [K_508 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"]["extensions"], keyof {
                    void_t?: {} | undefined;
                    recurrent_transfer_pair_id?: {
                        pair_id?: number | undefined;
                    } | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_509 in Exclude<keyof I_1["operations"][number]["recurrent_transfer"], keyof import("./recurrent_transfer.js").recurrent_transfer>]: never; }) | undefined;
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
                } & { [K_510 in Exclude<keyof I_1["operations"][number]["fill_convert_request"]["amount_in"], keyof import("./asset.js").asset>]: never; }) | undefined;
                amount_out?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_511 in Exclude<keyof I_1["operations"][number]["fill_convert_request"]["amount_out"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_512 in Exclude<keyof I_1["operations"][number]["fill_convert_request"], keyof import("./fill_convert_request.js").fill_convert_request>]: never; }) | undefined;
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
                } & { [K_513 in Exclude<keyof I_1["operations"][number]["author_reward"]["hbd_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_payout?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_514 in Exclude<keyof I_1["operations"][number]["author_reward"]["hive_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                vesting_payout?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_515 in Exclude<keyof I_1["operations"][number]["author_reward"]["vesting_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                curators_vesting_payout?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_516 in Exclude<keyof I_1["operations"][number]["author_reward"]["curators_vesting_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                payout_must_be_claimed?: boolean | undefined;
            } & { [K_517 in Exclude<keyof I_1["operations"][number]["author_reward"], keyof import("./author_reward.js").author_reward>]: never; }) | undefined;
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
                } & { [K_518 in Exclude<keyof I_1["operations"][number]["curation_reward"]["reward"], keyof import("./asset.js").asset>]: never; }) | undefined;
                comment_author?: string | undefined;
                comment_permlink?: string | undefined;
                payout_must_be_claimed?: boolean | undefined;
            } & { [K_519 in Exclude<keyof I_1["operations"][number]["curation_reward"], keyof import("./curation_reward.js").curation_reward>]: never; }) | undefined;
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
                } & { [K_520 in Exclude<keyof I_1["operations"][number]["comment_reward"]["payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                author_rewards?: string | undefined;
                total_payout_value?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_521 in Exclude<keyof I_1["operations"][number]["comment_reward"]["total_payout_value"], keyof import("./asset.js").asset>]: never; }) | undefined;
                curator_payout_value?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_522 in Exclude<keyof I_1["operations"][number]["comment_reward"]["curator_payout_value"], keyof import("./asset.js").asset>]: never; }) | undefined;
                beneficiary_payout_value?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_523 in Exclude<keyof I_1["operations"][number]["comment_reward"]["beneficiary_payout_value"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_524 in Exclude<keyof I_1["operations"][number]["comment_reward"], keyof import("./comment_reward.js").comment_reward>]: never; }) | undefined;
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
                } & { [K_525 in Exclude<keyof I_1["operations"][number]["liquidity_reward"]["payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_526 in Exclude<keyof I_1["operations"][number]["liquidity_reward"], keyof import("./liquidity_reward.js").liquidity_reward>]: never; }) | undefined;
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
                } & { [K_527 in Exclude<keyof I_1["operations"][number]["interest"]["interest"], keyof import("./asset.js").asset>]: never; }) | undefined;
                is_saved_into_hbd_balance?: boolean | undefined;
            } & { [K_528 in Exclude<keyof I_1["operations"][number]["interest"], keyof import("./interest.js").interest>]: never; }) | undefined;
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
                } & { [K_529 in Exclude<keyof I_1["operations"][number]["fill_vesting_withdraw"]["withdrawn"], keyof import("./asset.js").asset>]: never; }) | undefined;
                deposited?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_530 in Exclude<keyof I_1["operations"][number]["fill_vesting_withdraw"]["deposited"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_531 in Exclude<keyof I_1["operations"][number]["fill_vesting_withdraw"], keyof import("./fill_vesting_withdraw.js").fill_vesting_withdraw>]: never; }) | undefined;
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
                } & { [K_532 in Exclude<keyof I_1["operations"][number]["fill_order"]["current_pays"], keyof import("./asset.js").asset>]: never; }) | undefined;
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
                } & { [K_533 in Exclude<keyof I_1["operations"][number]["fill_order"]["open_pays"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_534 in Exclude<keyof I_1["operations"][number]["fill_order"], keyof import("./fill_order.js").fill_order>]: never; }) | undefined;
            shutdown_witness?: ({
                owner?: string | undefined;
            } & {
                owner?: string | undefined;
            } & { [K_535 in Exclude<keyof I_1["operations"][number]["shutdown_witness"], "owner">]: never; }) | undefined;
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
                } & { [K_536 in Exclude<keyof I_1["operations"][number]["fill_transfer_from_savings"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                request_id?: number | undefined;
                memo?: string | undefined;
            } & { [K_537 in Exclude<keyof I_1["operations"][number]["fill_transfer_from_savings"], keyof import("./fill_transfer_from_savings.js").fill_transfer_from_savings>]: never; }) | undefined;
            hardfork?: ({
                hardfork_id?: number | undefined;
            } & {
                hardfork_id?: number | undefined;
            } & { [K_538 in Exclude<keyof I_1["operations"][number]["hardfork"], "hardfork_id">]: never; }) | undefined;
            comment_payout_update?: ({
                author?: string | undefined;
                permlink?: string | undefined;
            } & {
                author?: string | undefined;
                permlink?: string | undefined;
            } & { [K_539 in Exclude<keyof I_1["operations"][number]["comment_payout_update"], keyof import("./comment_payout_update.js").comment_payout_update>]: never; }) | undefined;
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
                } & { [K_540 in Exclude<keyof I_1["operations"][number]["return_vesting_delegation"]["vesting_shares"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_541 in Exclude<keyof I_1["operations"][number]["return_vesting_delegation"], keyof import("./return_vesting_delegation.js").return_vesting_delegation>]: never; }) | undefined;
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
                } & { [K_542 in Exclude<keyof I_1["operations"][number]["comment_benefactor_reward"]["hbd_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_payout?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_543 in Exclude<keyof I_1["operations"][number]["comment_benefactor_reward"]["hive_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                vesting_payout?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_544 in Exclude<keyof I_1["operations"][number]["comment_benefactor_reward"]["vesting_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
                payout_must_be_claimed?: boolean | undefined;
            } & { [K_545 in Exclude<keyof I_1["operations"][number]["comment_benefactor_reward"], keyof import("./comment_benefactor_reward.js").comment_benefactor_reward>]: never; }) | undefined;
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
                } & { [K_546 in Exclude<keyof I_1["operations"][number]["producer_reward"]["vesting_shares"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_547 in Exclude<keyof I_1["operations"][number]["producer_reward"], keyof import("./producer_reward.js").producer_reward>]: never; }) | undefined;
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
                } & { [K_548 in Exclude<keyof I_1["operations"][number]["clear_null_account_balance"]["total_cleared"][number], keyof import("./asset.js").asset>]: never; })[] & { [K_549 in Exclude<keyof I_1["operations"][number]["clear_null_account_balance"]["total_cleared"], keyof {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_550 in Exclude<keyof I_1["operations"][number]["clear_null_account_balance"], "total_cleared">]: never; }) | undefined;
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
                } & { [K_551 in Exclude<keyof I_1["operations"][number]["proposal_pay"]["payment"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_552 in Exclude<keyof I_1["operations"][number]["proposal_pay"], keyof import("./proposal_pay.js").proposal_pay>]: never; }) | undefined;
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
                } & { [K_553 in Exclude<keyof I_1["operations"][number]["dhf_funding"]["additional_funds"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_554 in Exclude<keyof I_1["operations"][number]["dhf_funding"], keyof import("./dhf_funding.js").dhf_funding>]: never; }) | undefined;
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
                other_affected_accounts?: (string[] & string[] & { [K_555 in Exclude<keyof I_1["operations"][number]["hardfork_hive"]["other_affected_accounts"], keyof string[]>]: never; }) | undefined;
                hbd_transferred?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_556 in Exclude<keyof I_1["operations"][number]["hardfork_hive"]["hbd_transferred"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_transferred?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_557 in Exclude<keyof I_1["operations"][number]["hardfork_hive"]["hive_transferred"], keyof import("./asset.js").asset>]: never; }) | undefined;
                vests_converted?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_558 in Exclude<keyof I_1["operations"][number]["hardfork_hive"]["vests_converted"], keyof import("./asset.js").asset>]: never; }) | undefined;
                total_hive_from_vests?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_559 in Exclude<keyof I_1["operations"][number]["hardfork_hive"]["total_hive_from_vests"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_560 in Exclude<keyof I_1["operations"][number]["hardfork_hive"], keyof import("./hardfork_hive.js").hardfork_hive>]: never; }) | undefined;
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
                } & { [K_561 in Exclude<keyof I_1["operations"][number]["hardfork_hive_restore"]["hbd_transferred"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_transferred?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_562 in Exclude<keyof I_1["operations"][number]["hardfork_hive_restore"]["hive_transferred"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_563 in Exclude<keyof I_1["operations"][number]["hardfork_hive_restore"], keyof import("./hardfork_hive_restore.js").hardfork_hive_restore>]: never; }) | undefined;
            delayed_voting?: ({
                voter?: string | undefined;
                votes?: string | undefined;
            } & {
                voter?: string | undefined;
                votes?: string | undefined;
            } & { [K_564 in Exclude<keyof I_1["operations"][number]["delayed_voting"], keyof import("./delayed_voting.js").delayed_voting>]: never; }) | undefined;
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
                } & { [K_565 in Exclude<keyof I_1["operations"][number]["consolidate_treasury_balance"]["total_moved"][number], keyof import("./asset.js").asset>]: never; })[] & { [K_566 in Exclude<keyof I_1["operations"][number]["consolidate_treasury_balance"]["total_moved"], keyof {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                }[]>]: never; }) | undefined;
            } & { [K_567 in Exclude<keyof I_1["operations"][number]["consolidate_treasury_balance"], "total_moved">]: never; }) | undefined;
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
                } & { [K_568 in Exclude<keyof I_1["operations"][number]["effective_comment_vote"]["pending_payout"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_569 in Exclude<keyof I_1["operations"][number]["effective_comment_vote"], keyof import("./effective_comment_vote.js").effective_comment_vote>]: never; }) | undefined;
            ineffective_delete_comment?: ({
                author?: string | undefined;
                permlink?: string | undefined;
            } & {
                author?: string | undefined;
                permlink?: string | undefined;
            } & { [K_570 in Exclude<keyof I_1["operations"][number]["ineffective_delete_comment"], keyof import("./ineffective_delete_comment.js").ineffective_delete_comment>]: never; }) | undefined;
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
                } & { [K_571 in Exclude<keyof I_1["operations"][number]["dhf_conversion"]["hive_amount_in"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hbd_amount_out?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_572 in Exclude<keyof I_1["operations"][number]["dhf_conversion"]["hbd_amount_out"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_573 in Exclude<keyof I_1["operations"][number]["dhf_conversion"], keyof import("./dhf_conversion.js").dhf_conversion>]: never; }) | undefined;
            expired_account_notification?: ({
                account?: string | undefined;
            } & {
                account?: string | undefined;
            } & { [K_574 in Exclude<keyof I_1["operations"][number]["expired_account_notification"], "account">]: never; }) | undefined;
            changed_recovery_account?: ({
                account?: string | undefined;
                old_recovery_account?: string | undefined;
                new_recovery_account?: string | undefined;
            } & {
                account?: string | undefined;
                old_recovery_account?: string | undefined;
                new_recovery_account?: string | undefined;
            } & { [K_575 in Exclude<keyof I_1["operations"][number]["changed_recovery_account"], keyof import("./changed_recovery_account.js").changed_recovery_account>]: never; }) | undefined;
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
                } & { [K_576 in Exclude<keyof I_1["operations"][number]["transfer_to_vesting_completed"]["hive_vested"], keyof import("./asset.js").asset>]: never; }) | undefined;
                vesting_shares_received?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_577 in Exclude<keyof I_1["operations"][number]["transfer_to_vesting_completed"]["vesting_shares_received"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_578 in Exclude<keyof I_1["operations"][number]["transfer_to_vesting_completed"], keyof import("./transfer_to_vesting_completed.js").transfer_to_vesting_completed>]: never; }) | undefined;
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
                } & { [K_579 in Exclude<keyof I_1["operations"][number]["pow_reward"]["reward"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_580 in Exclude<keyof I_1["operations"][number]["pow_reward"], keyof import("./pow_reward.js").pow_reward>]: never; }) | undefined;
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
                } & { [K_581 in Exclude<keyof I_1["operations"][number]["vesting_shares_split"]["vesting_shares_before_split"], keyof import("./asset.js").asset>]: never; }) | undefined;
                vesting_shares_after_split?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_582 in Exclude<keyof I_1["operations"][number]["vesting_shares_split"]["vesting_shares_after_split"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_583 in Exclude<keyof I_1["operations"][number]["vesting_shares_split"], keyof import("./vesting_shares_split.js").vesting_shares_split>]: never; }) | undefined;
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
                } & { [K_584 in Exclude<keyof I_1["operations"][number]["account_created"]["initial_vesting_shares"], keyof import("./asset.js").asset>]: never; }) | undefined;
                initial_delegation?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_585 in Exclude<keyof I_1["operations"][number]["account_created"]["initial_delegation"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_586 in Exclude<keyof I_1["operations"][number]["account_created"], keyof import("./account_created.js").account_created>]: never; }) | undefined;
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
                } & { [K_587 in Exclude<keyof I_1["operations"][number]["fill_collateralized_convert_request"]["amount_in"], keyof import("./asset.js").asset>]: never; }) | undefined;
                amount_out?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_588 in Exclude<keyof I_1["operations"][number]["fill_collateralized_convert_request"]["amount_out"], keyof import("./asset.js").asset>]: never; }) | undefined;
                excess_collateral?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_589 in Exclude<keyof I_1["operations"][number]["fill_collateralized_convert_request"]["excess_collateral"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_590 in Exclude<keyof I_1["operations"][number]["fill_collateralized_convert_request"], keyof import("./fill_collateralized_convert_request.js").fill_collateralized_convert_request>]: never; }) | undefined;
            system_warning?: ({
                message?: string | undefined;
            } & {
                message?: string | undefined;
            } & { [K_591 in Exclude<keyof I_1["operations"][number]["system_warning"], "message">]: never; }) | undefined;
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
                } & { [K_592 in Exclude<keyof I_1["operations"][number]["fill_recurrent_transfer"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                memo?: string | undefined;
                remaining_executions?: number | undefined;
            } & { [K_593 in Exclude<keyof I_1["operations"][number]["fill_recurrent_transfer"], keyof import("./fill_recurrent_transfer.js").fill_recurrent_transfer>]: never; }) | undefined;
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
                } & { [K_594 in Exclude<keyof I_1["operations"][number]["failed_recurrent_transfer"]["amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                memo?: string | undefined;
                consecutive_failures?: number | undefined;
                remaining_executions?: number | undefined;
                deleted?: boolean | undefined;
            } & { [K_595 in Exclude<keyof I_1["operations"][number]["failed_recurrent_transfer"], keyof import("./failed_recurrent_transfer.js").failed_recurrent_transfer>]: never; }) | undefined;
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
                } & { [K_596 in Exclude<keyof I_1["operations"][number]["limit_order_cancelled"]["amount_back"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_597 in Exclude<keyof I_1["operations"][number]["limit_order_cancelled"], keyof import("./limit_order_cancelled.js").limit_order_cancelled>]: never; }) | undefined;
            producer_missed?: ({
                producer?: string | undefined;
            } & {
                producer?: string | undefined;
            } & { [K_598 in Exclude<keyof I_1["operations"][number]["producer_missed"], "producer">]: never; }) | undefined;
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
                } & { [K_599 in Exclude<keyof I_1["operations"][number]["proposal_fee"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_600 in Exclude<keyof I_1["operations"][number]["proposal_fee"], keyof import("./proposal_fee.js").proposal_fee>]: never; }) | undefined;
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
                } & { [K_601 in Exclude<keyof I_1["operations"][number]["collateralized_convert_immediate_conversion"]["hbd_out"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_602 in Exclude<keyof I_1["operations"][number]["collateralized_convert_immediate_conversion"], keyof import("./collateralized_convert_immediate_conversion.js").collateralized_convert_immediate_conversion>]: never; }) | undefined;
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
                } & { [K_603 in Exclude<keyof I_1["operations"][number]["escrow_approved"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_604 in Exclude<keyof I_1["operations"][number]["escrow_approved"], keyof import("./escrow_approved.js").escrow_approved>]: never; }) | undefined;
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
                } & { [K_605 in Exclude<keyof I_1["operations"][number]["escrow_rejected"]["hbd_amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                hive_amount?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_606 in Exclude<keyof I_1["operations"][number]["escrow_rejected"]["hive_amount"], keyof import("./asset.js").asset>]: never; }) | undefined;
                fee?: ({
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & {
                    amount?: string | undefined;
                    precision?: number | undefined;
                    nai?: string | undefined;
                } & { [K_607 in Exclude<keyof I_1["operations"][number]["escrow_rejected"]["fee"], keyof import("./asset.js").asset>]: never; }) | undefined;
            } & { [K_608 in Exclude<keyof I_1["operations"][number]["escrow_rejected"], keyof import("./escrow_rejected.js").escrow_rejected>]: never; }) | undefined;
            proxy_cleared?: ({
                account?: string | undefined;
                proxy?: string | undefined;
            } & {
                account?: string | undefined;
                proxy?: string | undefined;
            } & { [K_609 in Exclude<keyof I_1["operations"][number]["proxy_cleared"], keyof import("./proxy_cleared.js").proxy_cleared>]: never; }) | undefined;
            declined_voting_rights?: ({
                account?: string | undefined;
            } & {
                account?: string | undefined;
            } & { [K_610 in Exclude<keyof I_1["operations"][number]["declined_voting_rights"], "account">]: never; }) | undefined;
        } & { [K_611 in Exclude<keyof I_1["operations"][number], keyof operation>]: never; })[] & { [K_612 in Exclude<keyof I_1["operations"], keyof {
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
                owner?: string | undefined;
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
                    comment_payout_beneficiaries?: {
                        beneficiaries?: {
                            account?: string | undefined;
                            weight?: number | undefined;
                        }[] | undefined;
                    } | undefined;
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
        }[]>]: never; }) | undefined;
        extensions?: ({
            void_t?: {} | undefined;
        }[] & ({
            void_t?: {} | undefined;
        } & {
            void_t?: ({} & {} & { [K_613 in Exclude<keyof I_1["extensions"][number]["void_t"], never>]: never; }) | undefined;
        } & { [K_614 in Exclude<keyof I_1["extensions"][number], "void_t">]: never; })[] & { [K_615 in Exclude<keyof I_1["extensions"], keyof {
            void_t?: {} | undefined;
        }[]>]: never; }) | undefined;
        signatures?: (string[] & string[] & { [K_616 in Exclude<keyof I_1["signatures"], keyof string[]>]: never; }) | undefined;
    } & { [K_617 in Exclude<keyof I_1, keyof transaction>]: never; }>(object: I_1): transaction;
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
