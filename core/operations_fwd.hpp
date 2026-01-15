#pragma once

namespace fc {
template<typename... Types>
class static_variant;
} // namespace fc

namespace hive { namespace protocol {

class vote_operation; // 0
class comment_operation; // 1

class transfer_operation; // 2
class transfer_to_vesting_operation; // 3
class withdraw_vesting_operation; // 4

class limit_order_create_operation; // 5
class limit_order_cancel_operation; // 6

class feed_publish_operation; // 7
class convert_operation; // 8

class account_create_operation; // 9
class account_update_operation; // 10

class witness_update_operation; // 11
class account_witness_vote_operation; // 12
class account_witness_proxy_operation; // 13

class pow_operation; // 14

class custom_operation; // 15

class witness_block_approve_operation; // 16

class delete_comment_operation; // 17
class custom_json_operation; // 18
class comment_options_operation; // 19
class set_withdraw_vesting_route_operation; // 20
class limit_order_create2_operation; // 21
class claim_account_operation; // 22
class create_claimed_account_operation; // 23
class request_account_recovery_operation; // 24
class recover_account_operation; // 25
class change_recovery_account_operation; // 26
class escrow_transfer_operation; // 27
class escrow_dispute_operation; // 28
class escrow_release_operation; // 29
class pow2_operation; // 30
class escrow_approve_operation; // 31
class transfer_to_savings_operation; // 32
class transfer_from_savings_operation; // 33
class cancel_transfer_from_savings_operation; // 34
class custom_binary_operation; // 35
class decline_voting_rights_operation; // 36
class reset_account_operation; // 37
class set_reset_account_operation; // 38
class claim_reward_balance_operation; // 39
class delegate_vesting_shares_operation; // 40
class account_create_with_delegation_operation; // 41
class witness_set_properties_operation; // 42
class account_update2_operation; // 43
class create_proposal_operation; // 44
class update_proposal_votes_operation; // 45
class remove_proposal_operation; // 46
class update_proposal_operation; // 47
class collateralized_convert_operation; // 48
class recurrent_transfer_operation; // 49

#ifdef HIVE_ENABLE_SMT
        /// SMT operations
class claim_reward_balance2_operation; // last_pre_smt + 1

class smt_setup_operation; // last_pre_smt + 2
class smt_setup_emissions_operation; // last_pre_smt + 3
class smt_set_setup_parameters_operation; // last_pre_smt + 4
class smt_set_runtime_parameters_operation; // last_pre_smt + 5
class smt_create_operation; // last_pre_smt + 5
class smt_contribute_operation; // last_pre_smt + 6
#endif

        /// virtual operations below this point
class fill_convert_request_operation; // last_regular + 1
class author_reward_operation; // last_regular + 2
class curation_reward_operation; // last_regular + 3
class comment_reward_operation; // last_regular + 4
class liquidity_reward_operation; // last_regular + 5
class interest_operation; // last_regular + 6
class fill_vesting_withdraw_operation; // last_regular + 7
class fill_order_operation; // last_regular + 8
class shutdown_witness_operation; // last_regular + 9
class fill_transfer_from_savings_operation; // last_regular + 10
class hardfork_operation; // last_regular + 11
class comment_payout_update_operation; // last_regular + 12
class return_vesting_delegation_operation; // last_regular + 13
class comment_benefactor_reward_operation; // last_regular + 14
class producer_reward_operation; // last_regular + 15
class clear_null_account_balance_operation; // last_regular + 16
class proposal_pay_operation; // last_regular + 17
class dhf_funding_operation; // last_regular + 18
class hardfork_hive_operation; // last_regular + 19
class hardfork_hive_restore_operation; // last_regular + 20
class delayed_voting_operation; // last_regular + 21
class consolidate_treasury_balance_operation; // last_regular + 22
class effective_comment_vote_operation; // last_regular + 23
class ineffective_delete_comment_operation; // last_regular + 24
class dhf_conversion_operation; // last_regular + 25
class expired_account_notification_operation; // last_regular + 26
class changed_recovery_account_operation; // last_regular + 27
class transfer_to_vesting_completed_operation; // last_regular + 28
class pow_reward_operation; // last_regular + 29
class vesting_shares_split_operation; // last_regular + 30
class account_created_operation; // last_regular + 31
class fill_collateralized_convert_request_operation; // last_regular + 32
class system_warning_operation; // last_regular + 33,
class fill_recurrent_transfer_operation; // last_regular + 34
class failed_recurrent_transfer_operation; // last_regular + 35
class limit_order_cancelled_operation;  // last_regular + 36
class producer_missed_operation; // last_regular + 37
class proposal_fee_operation; //last_regular + 38
class collateralized_convert_immediate_conversion_operation; //last_regular + 39
class escrow_approved_operation; //last_regular + 40
class escrow_rejected_operation; //last_regular + 41
class proxy_cleared_operation; //last_regular + 42
class declined_voting_rights_operation; //last_regular + 43

} } // namespace hive::protocol

// Forward declare hive::protocol::operation:

namespace hive { namespace protocol {

  typedef fc::static_variant<
        vote_operation, // 0
        comment_operation, // 1

        transfer_operation, // 2
        transfer_to_vesting_operation, // 3
        withdraw_vesting_operation, // 4

        limit_order_create_operation, // 5
        limit_order_cancel_operation, // 6

        feed_publish_operation, // 7
        convert_operation, // 8

        account_create_operation, // 9
        account_update_operation, // 10

        witness_update_operation, // 11
        account_witness_vote_operation, // 12
        account_witness_proxy_operation, // 13

        pow_operation, // 14

        custom_operation, // 15

        witness_block_approve_operation, // 16

        delete_comment_operation, // 17
        custom_json_operation, // 18
        comment_options_operation, // 19
        set_withdraw_vesting_route_operation, // 20
        limit_order_create2_operation, // 21
        claim_account_operation, // 22
        create_claimed_account_operation, // 23
        request_account_recovery_operation, // 24
        recover_account_operation, // 25
        change_recovery_account_operation, // 26
        escrow_transfer_operation, // 27
        escrow_dispute_operation, // 28
        escrow_release_operation, // 29
        pow2_operation, // 30
        escrow_approve_operation, // 31
        transfer_to_savings_operation, // 32
        transfer_from_savings_operation, // 33
        cancel_transfer_from_savings_operation, // 34
        custom_binary_operation, // 35
        decline_voting_rights_operation, // 36
        reset_account_operation, // 37
        set_reset_account_operation, // 38
        claim_reward_balance_operation, // 39
        delegate_vesting_shares_operation, // 40
        account_create_with_delegation_operation, // 41
        witness_set_properties_operation, // 42
        account_update2_operation, // 43
        create_proposal_operation, // 44
        update_proposal_votes_operation, // 45
        remove_proposal_operation, // 46
        update_proposal_operation, // 47
        collateralized_convert_operation, // 48
        recurrent_transfer_operation // 49

#ifndef HIVE_PROTOCOL_SKIP_VOPS
        ,

#ifdef HIVE_ENABLE_SMT
        /// SMT operations
        claim_reward_balance2_operation, // last_pre_smt + 1

        smt_setup_operation, // last_pre_smt + 2
        smt_setup_emissions_operation, // last_pre_smt + 3
        smt_set_setup_parameters_operation, // last_pre_smt + 4
        smt_set_runtime_parameters_operation, // last_pre_smt + 5
        smt_create_operation, // last_pre_smt + 5
        smt_contribute_operation, // last_pre_smt + 6
#endif

        /// virtual operations below this point
        fill_convert_request_operation, // last_regular + 1
        author_reward_operation, // last_regular + 2
        curation_reward_operation, // last_regular + 3
        comment_reward_operation, // last_regular + 4
        liquidity_reward_operation, // last_regular + 5
        interest_operation, // last_regular + 6
        fill_vesting_withdraw_operation, // last_regular + 7
        fill_order_operation, // last_regular + 8
        shutdown_witness_operation, // last_regular + 9
        fill_transfer_from_savings_operation, // last_regular + 10
        hardfork_operation, // last_regular + 11
        comment_payout_update_operation, // last_regular + 12
        return_vesting_delegation_operation, // last_regular + 13
        comment_benefactor_reward_operation, // last_regular + 14
        producer_reward_operation, // last_regular + 15
        clear_null_account_balance_operation, // last_regular + 16
        proposal_pay_operation, // last_regular + 17
        dhf_funding_operation, // last_regular + 18
        hardfork_hive_operation, // last_regular + 19
        hardfork_hive_restore_operation, // last_regular + 20
        delayed_voting_operation, // last_regular + 21
        consolidate_treasury_balance_operation, // last_regular + 22
        effective_comment_vote_operation, // last_regular + 23
        ineffective_delete_comment_operation, // last_regular + 24
        dhf_conversion_operation, // last_regular + 25
        expired_account_notification_operation, // last_regular + 26
        changed_recovery_account_operation, // last_regular + 27
        transfer_to_vesting_completed_operation, // last_regular + 28
        pow_reward_operation, // last_regular + 29
        vesting_shares_split_operation, // last_regular + 30
        account_created_operation, // last_regular + 31
        fill_collateralized_convert_request_operation, // last_regular + 32
        system_warning_operation, // last_regular + 33,
        fill_recurrent_transfer_operation, // last_regular + 34
        failed_recurrent_transfer_operation, // last_regular + 35
        limit_order_cancelled_operation,  // last_regular + 36
        producer_missed_operation, // last_regular + 37
        proposal_fee_operation, //last_regular + 38
        collateralized_convert_immediate_conversion_operation, //last_regular + 39
        escrow_approved_operation, //last_regular + 40
        escrow_rejected_operation, //last_regular + 41
        proxy_cleared_operation, //last_regular + 42
        declined_voting_rights_operation //last_regular + 43

#endif // HIVE_PROTOCOL_SKIP_VOPS
      > operation;

} } // hive::protocol
