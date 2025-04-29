/* eslint-disable */
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
export const protobufPackage = "hive.protocol.buffers";
function createBaseoperation() {
    return {};
}
export const operation = {
    fromJSON(object) {
        return {
            vote_operation: isSet(object.vote_operation) ? vote.fromJSON(object.vote_operation) : undefined,
            comment_operation: isSet(object.comment_operation) ? comment.fromJSON(object.comment_operation) : undefined,
            transfer_operation: isSet(object.transfer_operation) ? transfer.fromJSON(object.transfer_operation) : undefined,
            transfer_to_vesting_operation: isSet(object.transfer_to_vesting_operation)
                ? transfer_to_vesting.fromJSON(object.transfer_to_vesting_operation)
                : undefined,
            withdraw_vesting_operation: isSet(object.withdraw_vesting_operation)
                ? withdraw_vesting.fromJSON(object.withdraw_vesting_operation)
                : undefined,
            limit_order_create_operation: isSet(object.limit_order_create_operation)
                ? limit_order_create.fromJSON(object.limit_order_create_operation)
                : undefined,
            limit_order_cancel_operation: isSet(object.limit_order_cancel_operation)
                ? limit_order_cancel.fromJSON(object.limit_order_cancel_operation)
                : undefined,
            feed_publish_operation: isSet(object.feed_publish_operation)
                ? feed_publish.fromJSON(object.feed_publish_operation)
                : undefined,
            convert_operation: isSet(object.convert_operation) ? convert.fromJSON(object.convert_operation) : undefined,
            account_create_operation: isSet(object.account_create_operation)
                ? account_create.fromJSON(object.account_create_operation)
                : undefined,
            account_update_operation: isSet(object.account_update_operation)
                ? account_update.fromJSON(object.account_update_operation)
                : undefined,
            witness_update_operation: isSet(object.witness_update_operation)
                ? witness_update.fromJSON(object.witness_update_operation)
                : undefined,
            account_witness_vote_operation: isSet(object.account_witness_vote_operation)
                ? account_witness_vote.fromJSON(object.account_witness_vote_operation)
                : undefined,
            account_witness_proxy_operation: isSet(object.account_witness_proxy_operation)
                ? account_witness_proxy.fromJSON(object.account_witness_proxy_operation)
                : undefined,
            pow_operation: isSet(object.pow_operation) ? pow.fromJSON(object.pow_operation) : undefined,
            custom_operation: isSet(object.custom_operation) ? custom.fromJSON(object.custom_operation) : undefined,
            witness_block_approve_operation: isSet(object.witness_block_approve_operation)
                ? witness_block_approve.fromJSON(object.witness_block_approve_operation)
                : undefined,
            delete_comment_operation: isSet(object.delete_comment_operation)
                ? delete_comment.fromJSON(object.delete_comment_operation)
                : undefined,
            custom_json_operation: isSet(object.custom_json_operation)
                ? custom_json.fromJSON(object.custom_json_operation)
                : undefined,
            comment_options_operation: isSet(object.comment_options_operation)
                ? comment_options.fromJSON(object.comment_options_operation)
                : undefined,
            set_withdraw_vesting_route_operation: isSet(object.set_withdraw_vesting_route_operation)
                ? set_withdraw_vesting_route.fromJSON(object.set_withdraw_vesting_route_operation)
                : undefined,
            limit_order_create2_operation: isSet(object.limit_order_create2_operation)
                ? limit_order_create2.fromJSON(object.limit_order_create2_operation)
                : undefined,
            claim_account_operation: isSet(object.claim_account_operation)
                ? claim_account.fromJSON(object.claim_account_operation)
                : undefined,
            create_claimed_account_operation: isSet(object.create_claimed_account_operation)
                ? create_claimed_account.fromJSON(object.create_claimed_account_operation)
                : undefined,
            request_account_recovery_operation: isSet(object.request_account_recovery_operation)
                ? request_account_recovery.fromJSON(object.request_account_recovery_operation)
                : undefined,
            recover_account_operation: isSet(object.recover_account_operation)
                ? recover_account.fromJSON(object.recover_account_operation)
                : undefined,
            change_recovery_account_operation: isSet(object.change_recovery_account_operation)
                ? change_recovery_account.fromJSON(object.change_recovery_account_operation)
                : undefined,
            escrow_transfer_operation: isSet(object.escrow_transfer_operation)
                ? escrow_transfer.fromJSON(object.escrow_transfer_operation)
                : undefined,
            escrow_dispute_operation: isSet(object.escrow_dispute_operation)
                ? escrow_dispute.fromJSON(object.escrow_dispute_operation)
                : undefined,
            escrow_release_operation: isSet(object.escrow_release_operation)
                ? escrow_release.fromJSON(object.escrow_release_operation)
                : undefined,
            pow2_operation: isSet(object.pow2_operation) ? pow2.fromJSON(object.pow2_operation) : undefined,
            escrow_approve_operation: isSet(object.escrow_approve_operation)
                ? escrow_approve.fromJSON(object.escrow_approve_operation)
                : undefined,
            transfer_to_savings_operation: isSet(object.transfer_to_savings_operation)
                ? transfer_to_savings.fromJSON(object.transfer_to_savings_operation)
                : undefined,
            transfer_from_savings_operation: isSet(object.transfer_from_savings_operation)
                ? transfer_from_savings.fromJSON(object.transfer_from_savings_operation)
                : undefined,
            cancel_transfer_from_savings_operation: isSet(object.cancel_transfer_from_savings_operation)
                ? cancel_transfer_from_savings.fromJSON(object.cancel_transfer_from_savings_operation)
                : undefined,
            decline_voting_rights_operation: isSet(object.decline_voting_rights_operation)
                ? decline_voting_rights.fromJSON(object.decline_voting_rights_operation)
                : undefined,
            claim_reward_balance_operation: isSet(object.claim_reward_balance_operation)
                ? claim_reward_balance.fromJSON(object.claim_reward_balance_operation)
                : undefined,
            delegate_vesting_shares_operation: isSet(object.delegate_vesting_shares_operation)
                ? delegate_vesting_shares.fromJSON(object.delegate_vesting_shares_operation)
                : undefined,
            account_create_with_delegation_operation: isSet(object.account_create_with_delegation_operation)
                ? account_create_with_delegation.fromJSON(object.account_create_with_delegation_operation)
                : undefined,
            witness_set_properties_operation: isSet(object.witness_set_properties_operation)
                ? witness_set_properties.fromJSON(object.witness_set_properties_operation)
                : undefined,
            account_update2_operation: isSet(object.account_update2_operation)
                ? account_update2.fromJSON(object.account_update2_operation)
                : undefined,
            create_proposal_operation: isSet(object.create_proposal_operation)
                ? create_proposal.fromJSON(object.create_proposal_operation)
                : undefined,
            update_proposal_votes_operation: isSet(object.update_proposal_votes_operation)
                ? update_proposal_votes.fromJSON(object.update_proposal_votes_operation)
                : undefined,
            remove_proposal_operation: isSet(object.remove_proposal_operation)
                ? remove_proposal.fromJSON(object.remove_proposal_operation)
                : undefined,
            update_proposal_operation: isSet(object.update_proposal_operation)
                ? update_proposal.fromJSON(object.update_proposal_operation)
                : undefined,
            collateralized_convert_operation: isSet(object.collateralized_convert_operation)
                ? collateralized_convert.fromJSON(object.collateralized_convert_operation)
                : undefined,
            recurrent_transfer_operation: isSet(object.recurrent_transfer_operation)
                ? recurrent_transfer.fromJSON(object.recurrent_transfer_operation)
                : undefined,
            fill_convert_request_operation: isSet(object.fill_convert_request_operation)
                ? fill_convert_request.fromJSON(object.fill_convert_request_operation)
                : undefined,
            author_reward_operation: isSet(object.author_reward_operation)
                ? author_reward.fromJSON(object.author_reward_operation)
                : undefined,
            curation_reward_operation: isSet(object.curation_reward_operation)
                ? curation_reward.fromJSON(object.curation_reward_operation)
                : undefined,
            comment_reward_operation: isSet(object.comment_reward_operation)
                ? comment_reward.fromJSON(object.comment_reward_operation)
                : undefined,
            liquidity_reward_operation: isSet(object.liquidity_reward_operation)
                ? liquidity_reward.fromJSON(object.liquidity_reward_operation)
                : undefined,
            interest_operation: isSet(object.interest_operation) ? interest.fromJSON(object.interest_operation) : undefined,
            fill_vesting_withdraw_operation: isSet(object.fill_vesting_withdraw_operation)
                ? fill_vesting_withdraw.fromJSON(object.fill_vesting_withdraw_operation)
                : undefined,
            fill_order_operation: isSet(object.fill_order_operation)
                ? fill_order.fromJSON(object.fill_order_operation)
                : undefined,
            shutdown_witness_operation: isSet(object.shutdown_witness_operation)
                ? shutdown_witness.fromJSON(object.shutdown_witness_operation)
                : undefined,
            fill_transfer_from_savings_operation: isSet(object.fill_transfer_from_savings_operation)
                ? fill_transfer_from_savings.fromJSON(object.fill_transfer_from_savings_operation)
                : undefined,
            hardfork_operation: isSet(object.hardfork_operation) ? hardfork.fromJSON(object.hardfork_operation) : undefined,
            comment_payout_update_operation: isSet(object.comment_payout_update_operation)
                ? comment_payout_update.fromJSON(object.comment_payout_update_operation)
                : undefined,
            return_vesting_delegation_operation: isSet(object.return_vesting_delegation_operation)
                ? return_vesting_delegation.fromJSON(object.return_vesting_delegation_operation)
                : undefined,
            comment_benefactor_reward_operation: isSet(object.comment_benefactor_reward_operation)
                ? comment_benefactor_reward.fromJSON(object.comment_benefactor_reward_operation)
                : undefined,
            producer_reward_operation: isSet(object.producer_reward_operation)
                ? producer_reward.fromJSON(object.producer_reward_operation)
                : undefined,
            clear_null_account_balance_operation: isSet(object.clear_null_account_balance_operation)
                ? clear_null_account_balance.fromJSON(object.clear_null_account_balance_operation)
                : undefined,
            proposal_pay_operation: isSet(object.proposal_pay_operation)
                ? proposal_pay.fromJSON(object.proposal_pay_operation)
                : undefined,
            dhf_funding_operation: isSet(object.dhf_funding_operation)
                ? dhf_funding.fromJSON(object.dhf_funding_operation)
                : undefined,
            hardfork_hive_operation: isSet(object.hardfork_hive_operation)
                ? hardfork_hive.fromJSON(object.hardfork_hive_operation)
                : undefined,
            hardfork_hive_restore_operation: isSet(object.hardfork_hive_restore_operation)
                ? hardfork_hive_restore.fromJSON(object.hardfork_hive_restore_operation)
                : undefined,
            delayed_voting_operation: isSet(object.delayed_voting_operation)
                ? delayed_voting.fromJSON(object.delayed_voting_operation)
                : undefined,
            consolidate_treasury_balance_operation: isSet(object.consolidate_treasury_balance_operation)
                ? consolidate_treasury_balance.fromJSON(object.consolidate_treasury_balance_operation)
                : undefined,
            effective_comment_vote_operation: isSet(object.effective_comment_vote_operation)
                ? effective_comment_vote.fromJSON(object.effective_comment_vote_operation)
                : undefined,
            ineffective_delete_comment_operation: isSet(object.ineffective_delete_comment_operation)
                ? ineffective_delete_comment.fromJSON(object.ineffective_delete_comment_operation)
                : undefined,
            dhf_conversion_operation: isSet(object.dhf_conversion_operation)
                ? dhf_conversion.fromJSON(object.dhf_conversion_operation)
                : undefined,
            expired_account_notification_operation: isSet(object.expired_account_notification_operation)
                ? expired_account_notification.fromJSON(object.expired_account_notification_operation)
                : undefined,
            changed_recovery_account_operation: isSet(object.changed_recovery_account_operation)
                ? changed_recovery_account.fromJSON(object.changed_recovery_account_operation)
                : undefined,
            transfer_to_vesting_completed_operation: isSet(object.transfer_to_vesting_completed_operation)
                ? transfer_to_vesting_completed.fromJSON(object.transfer_to_vesting_completed_operation)
                : undefined,
            pow_reward_operation: isSet(object.pow_reward_operation)
                ? pow_reward.fromJSON(object.pow_reward_operation)
                : undefined,
            vesting_shares_split_operation: isSet(object.vesting_shares_split_operation)
                ? vesting_shares_split.fromJSON(object.vesting_shares_split_operation)
                : undefined,
            account_created_operation: isSet(object.account_created_operation)
                ? account_created.fromJSON(object.account_created_operation)
                : undefined,
            fill_collateralized_convert_request_operation: isSet(object.fill_collateralized_convert_request_operation)
                ? fill_collateralized_convert_request.fromJSON(object.fill_collateralized_convert_request_operation)
                : undefined,
            system_warning_operation: isSet(object.system_warning_operation)
                ? system_warning.fromJSON(object.system_warning_operation)
                : undefined,
            fill_recurrent_transfer_operation: isSet(object.fill_recurrent_transfer_operation)
                ? fill_recurrent_transfer.fromJSON(object.fill_recurrent_transfer_operation)
                : undefined,
            failed_recurrent_transfer_operation: isSet(object.failed_recurrent_transfer_operation)
                ? failed_recurrent_transfer.fromJSON(object.failed_recurrent_transfer_operation)
                : undefined,
            limit_order_cancelled_operation: isSet(object.limit_order_cancelled_operation)
                ? limit_order_cancelled.fromJSON(object.limit_order_cancelled_operation)
                : undefined,
            producer_missed_operation: isSet(object.producer_missed_operation)
                ? producer_missed.fromJSON(object.producer_missed_operation)
                : undefined,
            proposal_fee_operation: isSet(object.proposal_fee_operation)
                ? proposal_fee.fromJSON(object.proposal_fee_operation)
                : undefined,
            collateralized_convert_immediate_conversion_operation: isSet(object.collateralized_convert_immediate_conversion_operation)
                ? collateralized_convert_immediate_conversion.fromJSON(object.collateralized_convert_immediate_conversion_operation)
                : undefined,
            escrow_approved_operation: isSet(object.escrow_approved_operation)
                ? escrow_approved.fromJSON(object.escrow_approved_operation)
                : undefined,
            escrow_rejected_operation: isSet(object.escrow_rejected_operation)
                ? escrow_rejected.fromJSON(object.escrow_rejected_operation)
                : undefined,
            proxy_cleared_operation: isSet(object.proxy_cleared_operation)
                ? proxy_cleared.fromJSON(object.proxy_cleared_operation)
                : undefined,
            declined_voting_rights_operation: isSet(object.declined_voting_rights_operation)
                ? declined_voting_rights.fromJSON(object.declined_voting_rights_operation)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.vote_operation !== undefined) {
            obj.vote_operation = vote.toJSON(message.vote_operation);
        }
        if (message.comment_operation !== undefined) {
            obj.comment_operation = comment.toJSON(message.comment_operation);
        }
        if (message.transfer_operation !== undefined) {
            obj.transfer_operation = transfer.toJSON(message.transfer_operation);
        }
        if (message.transfer_to_vesting_operation !== undefined) {
            obj.transfer_to_vesting_operation = transfer_to_vesting.toJSON(message.transfer_to_vesting_operation);
        }
        if (message.withdraw_vesting_operation !== undefined) {
            obj.withdraw_vesting_operation = withdraw_vesting.toJSON(message.withdraw_vesting_operation);
        }
        if (message.limit_order_create_operation !== undefined) {
            obj.limit_order_create_operation = limit_order_create.toJSON(message.limit_order_create_operation);
        }
        if (message.limit_order_cancel_operation !== undefined) {
            obj.limit_order_cancel_operation = limit_order_cancel.toJSON(message.limit_order_cancel_operation);
        }
        if (message.feed_publish_operation !== undefined) {
            obj.feed_publish_operation = feed_publish.toJSON(message.feed_publish_operation);
        }
        if (message.convert_operation !== undefined) {
            obj.convert_operation = convert.toJSON(message.convert_operation);
        }
        if (message.account_create_operation !== undefined) {
            obj.account_create_operation = account_create.toJSON(message.account_create_operation);
        }
        if (message.account_update_operation !== undefined) {
            obj.account_update_operation = account_update.toJSON(message.account_update_operation);
        }
        if (message.witness_update_operation !== undefined) {
            obj.witness_update_operation = witness_update.toJSON(message.witness_update_operation);
        }
        if (message.account_witness_vote_operation !== undefined) {
            obj.account_witness_vote_operation = account_witness_vote.toJSON(message.account_witness_vote_operation);
        }
        if (message.account_witness_proxy_operation !== undefined) {
            obj.account_witness_proxy_operation = account_witness_proxy.toJSON(message.account_witness_proxy_operation);
        }
        if (message.pow_operation !== undefined) {
            obj.pow_operation = pow.toJSON(message.pow_operation);
        }
        if (message.custom_operation !== undefined) {
            obj.custom_operation = custom.toJSON(message.custom_operation);
        }
        if (message.witness_block_approve_operation !== undefined) {
            obj.witness_block_approve_operation = witness_block_approve.toJSON(message.witness_block_approve_operation);
        }
        if (message.delete_comment_operation !== undefined) {
            obj.delete_comment_operation = delete_comment.toJSON(message.delete_comment_operation);
        }
        if (message.custom_json_operation !== undefined) {
            obj.custom_json_operation = custom_json.toJSON(message.custom_json_operation);
        }
        if (message.comment_options_operation !== undefined) {
            obj.comment_options_operation = comment_options.toJSON(message.comment_options_operation);
        }
        if (message.set_withdraw_vesting_route_operation !== undefined) {
            obj.set_withdraw_vesting_route_operation = set_withdraw_vesting_route.toJSON(message.set_withdraw_vesting_route_operation);
        }
        if (message.limit_order_create2_operation !== undefined) {
            obj.limit_order_create2_operation = limit_order_create2.toJSON(message.limit_order_create2_operation);
        }
        if (message.claim_account_operation !== undefined) {
            obj.claim_account_operation = claim_account.toJSON(message.claim_account_operation);
        }
        if (message.create_claimed_account_operation !== undefined) {
            obj.create_claimed_account_operation = create_claimed_account.toJSON(message.create_claimed_account_operation);
        }
        if (message.request_account_recovery_operation !== undefined) {
            obj.request_account_recovery_operation = request_account_recovery.toJSON(message.request_account_recovery_operation);
        }
        if (message.recover_account_operation !== undefined) {
            obj.recover_account_operation = recover_account.toJSON(message.recover_account_operation);
        }
        if (message.change_recovery_account_operation !== undefined) {
            obj.change_recovery_account_operation = change_recovery_account.toJSON(message.change_recovery_account_operation);
        }
        if (message.escrow_transfer_operation !== undefined) {
            obj.escrow_transfer_operation = escrow_transfer.toJSON(message.escrow_transfer_operation);
        }
        if (message.escrow_dispute_operation !== undefined) {
            obj.escrow_dispute_operation = escrow_dispute.toJSON(message.escrow_dispute_operation);
        }
        if (message.escrow_release_operation !== undefined) {
            obj.escrow_release_operation = escrow_release.toJSON(message.escrow_release_operation);
        }
        if (message.pow2_operation !== undefined) {
            obj.pow2_operation = pow2.toJSON(message.pow2_operation);
        }
        if (message.escrow_approve_operation !== undefined) {
            obj.escrow_approve_operation = escrow_approve.toJSON(message.escrow_approve_operation);
        }
        if (message.transfer_to_savings_operation !== undefined) {
            obj.transfer_to_savings_operation = transfer_to_savings.toJSON(message.transfer_to_savings_operation);
        }
        if (message.transfer_from_savings_operation !== undefined) {
            obj.transfer_from_savings_operation = transfer_from_savings.toJSON(message.transfer_from_savings_operation);
        }
        if (message.cancel_transfer_from_savings_operation !== undefined) {
            obj.cancel_transfer_from_savings_operation = cancel_transfer_from_savings.toJSON(message.cancel_transfer_from_savings_operation);
        }
        if (message.decline_voting_rights_operation !== undefined) {
            obj.decline_voting_rights_operation = decline_voting_rights.toJSON(message.decline_voting_rights_operation);
        }
        if (message.claim_reward_balance_operation !== undefined) {
            obj.claim_reward_balance_operation = claim_reward_balance.toJSON(message.claim_reward_balance_operation);
        }
        if (message.delegate_vesting_shares_operation !== undefined) {
            obj.delegate_vesting_shares_operation = delegate_vesting_shares.toJSON(message.delegate_vesting_shares_operation);
        }
        if (message.account_create_with_delegation_operation !== undefined) {
            obj.account_create_with_delegation_operation = account_create_with_delegation.toJSON(message.account_create_with_delegation_operation);
        }
        if (message.witness_set_properties_operation !== undefined) {
            obj.witness_set_properties_operation = witness_set_properties.toJSON(message.witness_set_properties_operation);
        }
        if (message.account_update2_operation !== undefined) {
            obj.account_update2_operation = account_update2.toJSON(message.account_update2_operation);
        }
        if (message.create_proposal_operation !== undefined) {
            obj.create_proposal_operation = create_proposal.toJSON(message.create_proposal_operation);
        }
        if (message.update_proposal_votes_operation !== undefined) {
            obj.update_proposal_votes_operation = update_proposal_votes.toJSON(message.update_proposal_votes_operation);
        }
        if (message.remove_proposal_operation !== undefined) {
            obj.remove_proposal_operation = remove_proposal.toJSON(message.remove_proposal_operation);
        }
        if (message.update_proposal_operation !== undefined) {
            obj.update_proposal_operation = update_proposal.toJSON(message.update_proposal_operation);
        }
        if (message.collateralized_convert_operation !== undefined) {
            obj.collateralized_convert_operation = collateralized_convert.toJSON(message.collateralized_convert_operation);
        }
        if (message.recurrent_transfer_operation !== undefined) {
            obj.recurrent_transfer_operation = recurrent_transfer.toJSON(message.recurrent_transfer_operation);
        }
        if (message.fill_convert_request_operation !== undefined) {
            obj.fill_convert_request_operation = fill_convert_request.toJSON(message.fill_convert_request_operation);
        }
        if (message.author_reward_operation !== undefined) {
            obj.author_reward_operation = author_reward.toJSON(message.author_reward_operation);
        }
        if (message.curation_reward_operation !== undefined) {
            obj.curation_reward_operation = curation_reward.toJSON(message.curation_reward_operation);
        }
        if (message.comment_reward_operation !== undefined) {
            obj.comment_reward_operation = comment_reward.toJSON(message.comment_reward_operation);
        }
        if (message.liquidity_reward_operation !== undefined) {
            obj.liquidity_reward_operation = liquidity_reward.toJSON(message.liquidity_reward_operation);
        }
        if (message.interest_operation !== undefined) {
            obj.interest_operation = interest.toJSON(message.interest_operation);
        }
        if (message.fill_vesting_withdraw_operation !== undefined) {
            obj.fill_vesting_withdraw_operation = fill_vesting_withdraw.toJSON(message.fill_vesting_withdraw_operation);
        }
        if (message.fill_order_operation !== undefined) {
            obj.fill_order_operation = fill_order.toJSON(message.fill_order_operation);
        }
        if (message.shutdown_witness_operation !== undefined) {
            obj.shutdown_witness_operation = shutdown_witness.toJSON(message.shutdown_witness_operation);
        }
        if (message.fill_transfer_from_savings_operation !== undefined) {
            obj.fill_transfer_from_savings_operation = fill_transfer_from_savings.toJSON(message.fill_transfer_from_savings_operation);
        }
        if (message.hardfork_operation !== undefined) {
            obj.hardfork_operation = hardfork.toJSON(message.hardfork_operation);
        }
        if (message.comment_payout_update_operation !== undefined) {
            obj.comment_payout_update_operation = comment_payout_update.toJSON(message.comment_payout_update_operation);
        }
        if (message.return_vesting_delegation_operation !== undefined) {
            obj.return_vesting_delegation_operation = return_vesting_delegation.toJSON(message.return_vesting_delegation_operation);
        }
        if (message.comment_benefactor_reward_operation !== undefined) {
            obj.comment_benefactor_reward_operation = comment_benefactor_reward.toJSON(message.comment_benefactor_reward_operation);
        }
        if (message.producer_reward_operation !== undefined) {
            obj.producer_reward_operation = producer_reward.toJSON(message.producer_reward_operation);
        }
        if (message.clear_null_account_balance_operation !== undefined) {
            obj.clear_null_account_balance_operation = clear_null_account_balance.toJSON(message.clear_null_account_balance_operation);
        }
        if (message.proposal_pay_operation !== undefined) {
            obj.proposal_pay_operation = proposal_pay.toJSON(message.proposal_pay_operation);
        }
        if (message.dhf_funding_operation !== undefined) {
            obj.dhf_funding_operation = dhf_funding.toJSON(message.dhf_funding_operation);
        }
        if (message.hardfork_hive_operation !== undefined) {
            obj.hardfork_hive_operation = hardfork_hive.toJSON(message.hardfork_hive_operation);
        }
        if (message.hardfork_hive_restore_operation !== undefined) {
            obj.hardfork_hive_restore_operation = hardfork_hive_restore.toJSON(message.hardfork_hive_restore_operation);
        }
        if (message.delayed_voting_operation !== undefined) {
            obj.delayed_voting_operation = delayed_voting.toJSON(message.delayed_voting_operation);
        }
        if (message.consolidate_treasury_balance_operation !== undefined) {
            obj.consolidate_treasury_balance_operation = consolidate_treasury_balance.toJSON(message.consolidate_treasury_balance_operation);
        }
        if (message.effective_comment_vote_operation !== undefined) {
            obj.effective_comment_vote_operation = effective_comment_vote.toJSON(message.effective_comment_vote_operation);
        }
        if (message.ineffective_delete_comment_operation !== undefined) {
            obj.ineffective_delete_comment_operation = ineffective_delete_comment.toJSON(message.ineffective_delete_comment_operation);
        }
        if (message.dhf_conversion_operation !== undefined) {
            obj.dhf_conversion_operation = dhf_conversion.toJSON(message.dhf_conversion_operation);
        }
        if (message.expired_account_notification_operation !== undefined) {
            obj.expired_account_notification_operation = expired_account_notification.toJSON(message.expired_account_notification_operation);
        }
        if (message.changed_recovery_account_operation !== undefined) {
            obj.changed_recovery_account_operation = changed_recovery_account.toJSON(message.changed_recovery_account_operation);
        }
        if (message.transfer_to_vesting_completed_operation !== undefined) {
            obj.transfer_to_vesting_completed_operation = transfer_to_vesting_completed.toJSON(message.transfer_to_vesting_completed_operation);
        }
        if (message.pow_reward_operation !== undefined) {
            obj.pow_reward_operation = pow_reward.toJSON(message.pow_reward_operation);
        }
        if (message.vesting_shares_split_operation !== undefined) {
            obj.vesting_shares_split_operation = vesting_shares_split.toJSON(message.vesting_shares_split_operation);
        }
        if (message.account_created_operation !== undefined) {
            obj.account_created_operation = account_created.toJSON(message.account_created_operation);
        }
        if (message.fill_collateralized_convert_request_operation !== undefined) {
            obj.fill_collateralized_convert_request_operation = fill_collateralized_convert_request.toJSON(message.fill_collateralized_convert_request_operation);
        }
        if (message.system_warning_operation !== undefined) {
            obj.system_warning_operation = system_warning.toJSON(message.system_warning_operation);
        }
        if (message.fill_recurrent_transfer_operation !== undefined) {
            obj.fill_recurrent_transfer_operation = fill_recurrent_transfer.toJSON(message.fill_recurrent_transfer_operation);
        }
        if (message.failed_recurrent_transfer_operation !== undefined) {
            obj.failed_recurrent_transfer_operation = failed_recurrent_transfer.toJSON(message.failed_recurrent_transfer_operation);
        }
        if (message.limit_order_cancelled_operation !== undefined) {
            obj.limit_order_cancelled_operation = limit_order_cancelled.toJSON(message.limit_order_cancelled_operation);
        }
        if (message.producer_missed_operation !== undefined) {
            obj.producer_missed_operation = producer_missed.toJSON(message.producer_missed_operation);
        }
        if (message.proposal_fee_operation !== undefined) {
            obj.proposal_fee_operation = proposal_fee.toJSON(message.proposal_fee_operation);
        }
        if (message.collateralized_convert_immediate_conversion_operation !== undefined) {
            obj.collateralized_convert_immediate_conversion_operation = collateralized_convert_immediate_conversion.toJSON(message.collateralized_convert_immediate_conversion_operation);
        }
        if (message.escrow_approved_operation !== undefined) {
            obj.escrow_approved_operation = escrow_approved.toJSON(message.escrow_approved_operation);
        }
        if (message.escrow_rejected_operation !== undefined) {
            obj.escrow_rejected_operation = escrow_rejected.toJSON(message.escrow_rejected_operation);
        }
        if (message.proxy_cleared_operation !== undefined) {
            obj.proxy_cleared_operation = proxy_cleared.toJSON(message.proxy_cleared_operation);
        }
        if (message.declined_voting_rights_operation !== undefined) {
            obj.declined_voting_rights_operation = declined_voting_rights.toJSON(message.declined_voting_rights_operation);
        }
        return obj;
    },
    create(base) {
        return operation.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseoperation();
        message.vote_operation = (object.vote_operation !== undefined && object.vote_operation !== null)
            ? vote.fromPartial(object.vote_operation)
            : undefined;
        message.comment_operation = (object.comment_operation !== undefined && object.comment_operation !== null)
            ? comment.fromPartial(object.comment_operation)
            : undefined;
        message.transfer_operation = (object.transfer_operation !== undefined && object.transfer_operation !== null)
            ? transfer.fromPartial(object.transfer_operation)
            : undefined;
        message.transfer_to_vesting_operation =
            (object.transfer_to_vesting_operation !== undefined && object.transfer_to_vesting_operation !== null)
                ? transfer_to_vesting.fromPartial(object.transfer_to_vesting_operation)
                : undefined;
        message.withdraw_vesting_operation =
            (object.withdraw_vesting_operation !== undefined && object.withdraw_vesting_operation !== null)
                ? withdraw_vesting.fromPartial(object.withdraw_vesting_operation)
                : undefined;
        message.limit_order_create_operation =
            (object.limit_order_create_operation !== undefined && object.limit_order_create_operation !== null)
                ? limit_order_create.fromPartial(object.limit_order_create_operation)
                : undefined;
        message.limit_order_cancel_operation =
            (object.limit_order_cancel_operation !== undefined && object.limit_order_cancel_operation !== null)
                ? limit_order_cancel.fromPartial(object.limit_order_cancel_operation)
                : undefined;
        message.feed_publish_operation =
            (object.feed_publish_operation !== undefined && object.feed_publish_operation !== null)
                ? feed_publish.fromPartial(object.feed_publish_operation)
                : undefined;
        message.convert_operation = (object.convert_operation !== undefined && object.convert_operation !== null)
            ? convert.fromPartial(object.convert_operation)
            : undefined;
        message.account_create_operation =
            (object.account_create_operation !== undefined && object.account_create_operation !== null)
                ? account_create.fromPartial(object.account_create_operation)
                : undefined;
        message.account_update_operation =
            (object.account_update_operation !== undefined && object.account_update_operation !== null)
                ? account_update.fromPartial(object.account_update_operation)
                : undefined;
        message.witness_update_operation =
            (object.witness_update_operation !== undefined && object.witness_update_operation !== null)
                ? witness_update.fromPartial(object.witness_update_operation)
                : undefined;
        message.account_witness_vote_operation =
            (object.account_witness_vote_operation !== undefined && object.account_witness_vote_operation !== null)
                ? account_witness_vote.fromPartial(object.account_witness_vote_operation)
                : undefined;
        message.account_witness_proxy_operation =
            (object.account_witness_proxy_operation !== undefined && object.account_witness_proxy_operation !== null)
                ? account_witness_proxy.fromPartial(object.account_witness_proxy_operation)
                : undefined;
        message.pow_operation = (object.pow_operation !== undefined && object.pow_operation !== null)
            ? pow.fromPartial(object.pow_operation)
            : undefined;
        message.custom_operation = (object.custom_operation !== undefined && object.custom_operation !== null)
            ? custom.fromPartial(object.custom_operation)
            : undefined;
        message.witness_block_approve_operation =
            (object.witness_block_approve_operation !== undefined && object.witness_block_approve_operation !== null)
                ? witness_block_approve.fromPartial(object.witness_block_approve_operation)
                : undefined;
        message.delete_comment_operation =
            (object.delete_comment_operation !== undefined && object.delete_comment_operation !== null)
                ? delete_comment.fromPartial(object.delete_comment_operation)
                : undefined;
        message.custom_json_operation =
            (object.custom_json_operation !== undefined && object.custom_json_operation !== null)
                ? custom_json.fromPartial(object.custom_json_operation)
                : undefined;
        message.comment_options_operation =
            (object.comment_options_operation !== undefined && object.comment_options_operation !== null)
                ? comment_options.fromPartial(object.comment_options_operation)
                : undefined;
        message.set_withdraw_vesting_route_operation =
            (object.set_withdraw_vesting_route_operation !== undefined &&
                object.set_withdraw_vesting_route_operation !== null)
                ? set_withdraw_vesting_route.fromPartial(object.set_withdraw_vesting_route_operation)
                : undefined;
        message.limit_order_create2_operation =
            (object.limit_order_create2_operation !== undefined && object.limit_order_create2_operation !== null)
                ? limit_order_create2.fromPartial(object.limit_order_create2_operation)
                : undefined;
        message.claim_account_operation =
            (object.claim_account_operation !== undefined && object.claim_account_operation !== null)
                ? claim_account.fromPartial(object.claim_account_operation)
                : undefined;
        message.create_claimed_account_operation =
            (object.create_claimed_account_operation !== undefined && object.create_claimed_account_operation !== null)
                ? create_claimed_account.fromPartial(object.create_claimed_account_operation)
                : undefined;
        message.request_account_recovery_operation =
            (object.request_account_recovery_operation !== undefined && object.request_account_recovery_operation !== null)
                ? request_account_recovery.fromPartial(object.request_account_recovery_operation)
                : undefined;
        message.recover_account_operation =
            (object.recover_account_operation !== undefined && object.recover_account_operation !== null)
                ? recover_account.fromPartial(object.recover_account_operation)
                : undefined;
        message.change_recovery_account_operation =
            (object.change_recovery_account_operation !== undefined && object.change_recovery_account_operation !== null)
                ? change_recovery_account.fromPartial(object.change_recovery_account_operation)
                : undefined;
        message.escrow_transfer_operation =
            (object.escrow_transfer_operation !== undefined && object.escrow_transfer_operation !== null)
                ? escrow_transfer.fromPartial(object.escrow_transfer_operation)
                : undefined;
        message.escrow_dispute_operation =
            (object.escrow_dispute_operation !== undefined && object.escrow_dispute_operation !== null)
                ? escrow_dispute.fromPartial(object.escrow_dispute_operation)
                : undefined;
        message.escrow_release_operation =
            (object.escrow_release_operation !== undefined && object.escrow_release_operation !== null)
                ? escrow_release.fromPartial(object.escrow_release_operation)
                : undefined;
        message.pow2_operation = (object.pow2_operation !== undefined && object.pow2_operation !== null)
            ? pow2.fromPartial(object.pow2_operation)
            : undefined;
        message.escrow_approve_operation =
            (object.escrow_approve_operation !== undefined && object.escrow_approve_operation !== null)
                ? escrow_approve.fromPartial(object.escrow_approve_operation)
                : undefined;
        message.transfer_to_savings_operation =
            (object.transfer_to_savings_operation !== undefined && object.transfer_to_savings_operation !== null)
                ? transfer_to_savings.fromPartial(object.transfer_to_savings_operation)
                : undefined;
        message.transfer_from_savings_operation =
            (object.transfer_from_savings_operation !== undefined && object.transfer_from_savings_operation !== null)
                ? transfer_from_savings.fromPartial(object.transfer_from_savings_operation)
                : undefined;
        message.cancel_transfer_from_savings_operation =
            (object.cancel_transfer_from_savings_operation !== undefined &&
                object.cancel_transfer_from_savings_operation !== null)
                ? cancel_transfer_from_savings.fromPartial(object.cancel_transfer_from_savings_operation)
                : undefined;
        message.decline_voting_rights_operation =
            (object.decline_voting_rights_operation !== undefined && object.decline_voting_rights_operation !== null)
                ? decline_voting_rights.fromPartial(object.decline_voting_rights_operation)
                : undefined;
        message.claim_reward_balance_operation =
            (object.claim_reward_balance_operation !== undefined && object.claim_reward_balance_operation !== null)
                ? claim_reward_balance.fromPartial(object.claim_reward_balance_operation)
                : undefined;
        message.delegate_vesting_shares_operation =
            (object.delegate_vesting_shares_operation !== undefined && object.delegate_vesting_shares_operation !== null)
                ? delegate_vesting_shares.fromPartial(object.delegate_vesting_shares_operation)
                : undefined;
        message.account_create_with_delegation_operation =
            (object.account_create_with_delegation_operation !== undefined &&
                object.account_create_with_delegation_operation !== null)
                ? account_create_with_delegation.fromPartial(object.account_create_with_delegation_operation)
                : undefined;
        message.witness_set_properties_operation =
            (object.witness_set_properties_operation !== undefined && object.witness_set_properties_operation !== null)
                ? witness_set_properties.fromPartial(object.witness_set_properties_operation)
                : undefined;
        message.account_update2_operation =
            (object.account_update2_operation !== undefined && object.account_update2_operation !== null)
                ? account_update2.fromPartial(object.account_update2_operation)
                : undefined;
        message.create_proposal_operation =
            (object.create_proposal_operation !== undefined && object.create_proposal_operation !== null)
                ? create_proposal.fromPartial(object.create_proposal_operation)
                : undefined;
        message.update_proposal_votes_operation =
            (object.update_proposal_votes_operation !== undefined && object.update_proposal_votes_operation !== null)
                ? update_proposal_votes.fromPartial(object.update_proposal_votes_operation)
                : undefined;
        message.remove_proposal_operation =
            (object.remove_proposal_operation !== undefined && object.remove_proposal_operation !== null)
                ? remove_proposal.fromPartial(object.remove_proposal_operation)
                : undefined;
        message.update_proposal_operation =
            (object.update_proposal_operation !== undefined && object.update_proposal_operation !== null)
                ? update_proposal.fromPartial(object.update_proposal_operation)
                : undefined;
        message.collateralized_convert_operation =
            (object.collateralized_convert_operation !== undefined && object.collateralized_convert_operation !== null)
                ? collateralized_convert.fromPartial(object.collateralized_convert_operation)
                : undefined;
        message.recurrent_transfer_operation =
            (object.recurrent_transfer_operation !== undefined && object.recurrent_transfer_operation !== null)
                ? recurrent_transfer.fromPartial(object.recurrent_transfer_operation)
                : undefined;
        message.fill_convert_request_operation =
            (object.fill_convert_request_operation !== undefined && object.fill_convert_request_operation !== null)
                ? fill_convert_request.fromPartial(object.fill_convert_request_operation)
                : undefined;
        message.author_reward_operation =
            (object.author_reward_operation !== undefined && object.author_reward_operation !== null)
                ? author_reward.fromPartial(object.author_reward_operation)
                : undefined;
        message.curation_reward_operation =
            (object.curation_reward_operation !== undefined && object.curation_reward_operation !== null)
                ? curation_reward.fromPartial(object.curation_reward_operation)
                : undefined;
        message.comment_reward_operation =
            (object.comment_reward_operation !== undefined && object.comment_reward_operation !== null)
                ? comment_reward.fromPartial(object.comment_reward_operation)
                : undefined;
        message.liquidity_reward_operation =
            (object.liquidity_reward_operation !== undefined && object.liquidity_reward_operation !== null)
                ? liquidity_reward.fromPartial(object.liquidity_reward_operation)
                : undefined;
        message.interest_operation = (object.interest_operation !== undefined && object.interest_operation !== null)
            ? interest.fromPartial(object.interest_operation)
            : undefined;
        message.fill_vesting_withdraw_operation =
            (object.fill_vesting_withdraw_operation !== undefined && object.fill_vesting_withdraw_operation !== null)
                ? fill_vesting_withdraw.fromPartial(object.fill_vesting_withdraw_operation)
                : undefined;
        message.fill_order_operation = (object.fill_order_operation !== undefined && object.fill_order_operation !== null)
            ? fill_order.fromPartial(object.fill_order_operation)
            : undefined;
        message.shutdown_witness_operation =
            (object.shutdown_witness_operation !== undefined && object.shutdown_witness_operation !== null)
                ? shutdown_witness.fromPartial(object.shutdown_witness_operation)
                : undefined;
        message.fill_transfer_from_savings_operation =
            (object.fill_transfer_from_savings_operation !== undefined &&
                object.fill_transfer_from_savings_operation !== null)
                ? fill_transfer_from_savings.fromPartial(object.fill_transfer_from_savings_operation)
                : undefined;
        message.hardfork_operation = (object.hardfork_operation !== undefined && object.hardfork_operation !== null)
            ? hardfork.fromPartial(object.hardfork_operation)
            : undefined;
        message.comment_payout_update_operation =
            (object.comment_payout_update_operation !== undefined && object.comment_payout_update_operation !== null)
                ? comment_payout_update.fromPartial(object.comment_payout_update_operation)
                : undefined;
        message.return_vesting_delegation_operation =
            (object.return_vesting_delegation_operation !== undefined && object.return_vesting_delegation_operation !== null)
                ? return_vesting_delegation.fromPartial(object.return_vesting_delegation_operation)
                : undefined;
        message.comment_benefactor_reward_operation =
            (object.comment_benefactor_reward_operation !== undefined && object.comment_benefactor_reward_operation !== null)
                ? comment_benefactor_reward.fromPartial(object.comment_benefactor_reward_operation)
                : undefined;
        message.producer_reward_operation =
            (object.producer_reward_operation !== undefined && object.producer_reward_operation !== null)
                ? producer_reward.fromPartial(object.producer_reward_operation)
                : undefined;
        message.clear_null_account_balance_operation =
            (object.clear_null_account_balance_operation !== undefined &&
                object.clear_null_account_balance_operation !== null)
                ? clear_null_account_balance.fromPartial(object.clear_null_account_balance_operation)
                : undefined;
        message.proposal_pay_operation =
            (object.proposal_pay_operation !== undefined && object.proposal_pay_operation !== null)
                ? proposal_pay.fromPartial(object.proposal_pay_operation)
                : undefined;
        message.dhf_funding_operation =
            (object.dhf_funding_operation !== undefined && object.dhf_funding_operation !== null)
                ? dhf_funding.fromPartial(object.dhf_funding_operation)
                : undefined;
        message.hardfork_hive_operation =
            (object.hardfork_hive_operation !== undefined && object.hardfork_hive_operation !== null)
                ? hardfork_hive.fromPartial(object.hardfork_hive_operation)
                : undefined;
        message.hardfork_hive_restore_operation =
            (object.hardfork_hive_restore_operation !== undefined && object.hardfork_hive_restore_operation !== null)
                ? hardfork_hive_restore.fromPartial(object.hardfork_hive_restore_operation)
                : undefined;
        message.delayed_voting_operation =
            (object.delayed_voting_operation !== undefined && object.delayed_voting_operation !== null)
                ? delayed_voting.fromPartial(object.delayed_voting_operation)
                : undefined;
        message.consolidate_treasury_balance_operation =
            (object.consolidate_treasury_balance_operation !== undefined &&
                object.consolidate_treasury_balance_operation !== null)
                ? consolidate_treasury_balance.fromPartial(object.consolidate_treasury_balance_operation)
                : undefined;
        message.effective_comment_vote_operation =
            (object.effective_comment_vote_operation !== undefined && object.effective_comment_vote_operation !== null)
                ? effective_comment_vote.fromPartial(object.effective_comment_vote_operation)
                : undefined;
        message.ineffective_delete_comment_operation =
            (object.ineffective_delete_comment_operation !== undefined &&
                object.ineffective_delete_comment_operation !== null)
                ? ineffective_delete_comment.fromPartial(object.ineffective_delete_comment_operation)
                : undefined;
        message.dhf_conversion_operation =
            (object.dhf_conversion_operation !== undefined && object.dhf_conversion_operation !== null)
                ? dhf_conversion.fromPartial(object.dhf_conversion_operation)
                : undefined;
        message.expired_account_notification_operation =
            (object.expired_account_notification_operation !== undefined &&
                object.expired_account_notification_operation !== null)
                ? expired_account_notification.fromPartial(object.expired_account_notification_operation)
                : undefined;
        message.changed_recovery_account_operation =
            (object.changed_recovery_account_operation !== undefined && object.changed_recovery_account_operation !== null)
                ? changed_recovery_account.fromPartial(object.changed_recovery_account_operation)
                : undefined;
        message.transfer_to_vesting_completed_operation =
            (object.transfer_to_vesting_completed_operation !== undefined &&
                object.transfer_to_vesting_completed_operation !== null)
                ? transfer_to_vesting_completed.fromPartial(object.transfer_to_vesting_completed_operation)
                : undefined;
        message.pow_reward_operation = (object.pow_reward_operation !== undefined && object.pow_reward_operation !== null)
            ? pow_reward.fromPartial(object.pow_reward_operation)
            : undefined;
        message.vesting_shares_split_operation =
            (object.vesting_shares_split_operation !== undefined && object.vesting_shares_split_operation !== null)
                ? vesting_shares_split.fromPartial(object.vesting_shares_split_operation)
                : undefined;
        message.account_created_operation =
            (object.account_created_operation !== undefined && object.account_created_operation !== null)
                ? account_created.fromPartial(object.account_created_operation)
                : undefined;
        message.fill_collateralized_convert_request_operation =
            (object.fill_collateralized_convert_request_operation !== undefined &&
                object.fill_collateralized_convert_request_operation !== null)
                ? fill_collateralized_convert_request.fromPartial(object.fill_collateralized_convert_request_operation)
                : undefined;
        message.system_warning_operation =
            (object.system_warning_operation !== undefined && object.system_warning_operation !== null)
                ? system_warning.fromPartial(object.system_warning_operation)
                : undefined;
        message.fill_recurrent_transfer_operation =
            (object.fill_recurrent_transfer_operation !== undefined && object.fill_recurrent_transfer_operation !== null)
                ? fill_recurrent_transfer.fromPartial(object.fill_recurrent_transfer_operation)
                : undefined;
        message.failed_recurrent_transfer_operation =
            (object.failed_recurrent_transfer_operation !== undefined && object.failed_recurrent_transfer_operation !== null)
                ? failed_recurrent_transfer.fromPartial(object.failed_recurrent_transfer_operation)
                : undefined;
        message.limit_order_cancelled_operation =
            (object.limit_order_cancelled_operation !== undefined && object.limit_order_cancelled_operation !== null)
                ? limit_order_cancelled.fromPartial(object.limit_order_cancelled_operation)
                : undefined;
        message.producer_missed_operation =
            (object.producer_missed_operation !== undefined && object.producer_missed_operation !== null)
                ? producer_missed.fromPartial(object.producer_missed_operation)
                : undefined;
        message.proposal_fee_operation =
            (object.proposal_fee_operation !== undefined && object.proposal_fee_operation !== null)
                ? proposal_fee.fromPartial(object.proposal_fee_operation)
                : undefined;
        message.collateralized_convert_immediate_conversion_operation =
            (object.collateralized_convert_immediate_conversion_operation !== undefined &&
                object.collateralized_convert_immediate_conversion_operation !== null)
                ? collateralized_convert_immediate_conversion.fromPartial(object.collateralized_convert_immediate_conversion_operation)
                : undefined;
        message.escrow_approved_operation =
            (object.escrow_approved_operation !== undefined && object.escrow_approved_operation !== null)
                ? escrow_approved.fromPartial(object.escrow_approved_operation)
                : undefined;
        message.escrow_rejected_operation =
            (object.escrow_rejected_operation !== undefined && object.escrow_rejected_operation !== null)
                ? escrow_rejected.fromPartial(object.escrow_rejected_operation)
                : undefined;
        message.proxy_cleared_operation =
            (object.proxy_cleared_operation !== undefined && object.proxy_cleared_operation !== null)
                ? proxy_cleared.fromPartial(object.proxy_cleared_operation)
                : undefined;
        message.declined_voting_rights_operation =
            (object.declined_voting_rights_operation !== undefined && object.declined_voting_rights_operation !== null)
                ? declined_voting_rights.fromPartial(object.declined_voting_rights_operation)
                : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
