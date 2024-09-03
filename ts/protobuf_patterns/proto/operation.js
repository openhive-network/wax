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
            vote: isSet(object.vote) ? vote.fromJSON(object.vote) : undefined,
            comment: isSet(object.comment) ? comment.fromJSON(object.comment) : undefined,
            transfer: isSet(object.transfer) ? transfer.fromJSON(object.transfer) : undefined,
            transfer_to_vesting: isSet(object.transfer_to_vesting)
                ? transfer_to_vesting.fromJSON(object.transfer_to_vesting)
                : undefined,
            withdraw_vesting: isSet(object.withdraw_vesting) ? withdraw_vesting.fromJSON(object.withdraw_vesting) : undefined,
            limit_order_create: isSet(object.limit_order_create)
                ? limit_order_create.fromJSON(object.limit_order_create)
                : undefined,
            limit_order_cancel: isSet(object.limit_order_cancel)
                ? limit_order_cancel.fromJSON(object.limit_order_cancel)
                : undefined,
            feed_publish: isSet(object.feed_publish) ? feed_publish.fromJSON(object.feed_publish) : undefined,
            convert: isSet(object.convert) ? convert.fromJSON(object.convert) : undefined,
            account_create: isSet(object.account_create) ? account_create.fromJSON(object.account_create) : undefined,
            account_update: isSet(object.account_update) ? account_update.fromJSON(object.account_update) : undefined,
            witness_update: isSet(object.witness_update) ? witness_update.fromJSON(object.witness_update) : undefined,
            account_witness_vote: isSet(object.account_witness_vote)
                ? account_witness_vote.fromJSON(object.account_witness_vote)
                : undefined,
            account_witness_proxy: isSet(object.account_witness_proxy)
                ? account_witness_proxy.fromJSON(object.account_witness_proxy)
                : undefined,
            pow: isSet(object.pow) ? pow.fromJSON(object.pow) : undefined,
            custom: isSet(object.custom) ? custom.fromJSON(object.custom) : undefined,
            witness_block_approve: isSet(object.witness_block_approve)
                ? witness_block_approve.fromJSON(object.witness_block_approve)
                : undefined,
            delete_comment: isSet(object.delete_comment) ? delete_comment.fromJSON(object.delete_comment) : undefined,
            custom_json: isSet(object.custom_json) ? custom_json.fromJSON(object.custom_json) : undefined,
            comment_options: isSet(object.comment_options) ? comment_options.fromJSON(object.comment_options) : undefined,
            set_withdraw_vesting_route: isSet(object.set_withdraw_vesting_route)
                ? set_withdraw_vesting_route.fromJSON(object.set_withdraw_vesting_route)
                : undefined,
            limit_order_create2: isSet(object.limit_order_create2)
                ? limit_order_create2.fromJSON(object.limit_order_create2)
                : undefined,
            claim_account: isSet(object.claim_account) ? claim_account.fromJSON(object.claim_account) : undefined,
            create_claimed_account: isSet(object.create_claimed_account)
                ? create_claimed_account.fromJSON(object.create_claimed_account)
                : undefined,
            request_account_recovery: isSet(object.request_account_recovery)
                ? request_account_recovery.fromJSON(object.request_account_recovery)
                : undefined,
            recover_account: isSet(object.recover_account) ? recover_account.fromJSON(object.recover_account) : undefined,
            change_recovery_account: isSet(object.change_recovery_account)
                ? change_recovery_account.fromJSON(object.change_recovery_account)
                : undefined,
            escrow_transfer: isSet(object.escrow_transfer) ? escrow_transfer.fromJSON(object.escrow_transfer) : undefined,
            escrow_dispute: isSet(object.escrow_dispute) ? escrow_dispute.fromJSON(object.escrow_dispute) : undefined,
            escrow_release: isSet(object.escrow_release) ? escrow_release.fromJSON(object.escrow_release) : undefined,
            pow2: isSet(object.pow2) ? pow2.fromJSON(object.pow2) : undefined,
            escrow_approve: isSet(object.escrow_approve) ? escrow_approve.fromJSON(object.escrow_approve) : undefined,
            transfer_to_savings: isSet(object.transfer_to_savings)
                ? transfer_to_savings.fromJSON(object.transfer_to_savings)
                : undefined,
            transfer_from_savings: isSet(object.transfer_from_savings)
                ? transfer_from_savings.fromJSON(object.transfer_from_savings)
                : undefined,
            cancel_transfer_from_savings: isSet(object.cancel_transfer_from_savings)
                ? cancel_transfer_from_savings.fromJSON(object.cancel_transfer_from_savings)
                : undefined,
            decline_voting_rights: isSet(object.decline_voting_rights)
                ? decline_voting_rights.fromJSON(object.decline_voting_rights)
                : undefined,
            claim_reward_balance: isSet(object.claim_reward_balance)
                ? claim_reward_balance.fromJSON(object.claim_reward_balance)
                : undefined,
            delegate_vesting_shares: isSet(object.delegate_vesting_shares)
                ? delegate_vesting_shares.fromJSON(object.delegate_vesting_shares)
                : undefined,
            account_create_with_delegation: isSet(object.account_create_with_delegation)
                ? account_create_with_delegation.fromJSON(object.account_create_with_delegation)
                : undefined,
            witness_set_properties: isSet(object.witness_set_properties)
                ? witness_set_properties.fromJSON(object.witness_set_properties)
                : undefined,
            account_update2: isSet(object.account_update2) ? account_update2.fromJSON(object.account_update2) : undefined,
            create_proposal: isSet(object.create_proposal) ? create_proposal.fromJSON(object.create_proposal) : undefined,
            update_proposal_votes: isSet(object.update_proposal_votes)
                ? update_proposal_votes.fromJSON(object.update_proposal_votes)
                : undefined,
            remove_proposal: isSet(object.remove_proposal) ? remove_proposal.fromJSON(object.remove_proposal) : undefined,
            update_proposal: isSet(object.update_proposal) ? update_proposal.fromJSON(object.update_proposal) : undefined,
            collateralized_convert: isSet(object.collateralized_convert)
                ? collateralized_convert.fromJSON(object.collateralized_convert)
                : undefined,
            recurrent_transfer: isSet(object.recurrent_transfer)
                ? recurrent_transfer.fromJSON(object.recurrent_transfer)
                : undefined,
            fill_convert_request: isSet(object.fill_convert_request)
                ? fill_convert_request.fromJSON(object.fill_convert_request)
                : undefined,
            author_reward: isSet(object.author_reward) ? author_reward.fromJSON(object.author_reward) : undefined,
            curation_reward: isSet(object.curation_reward) ? curation_reward.fromJSON(object.curation_reward) : undefined,
            comment_reward: isSet(object.comment_reward) ? comment_reward.fromJSON(object.comment_reward) : undefined,
            liquidity_reward: isSet(object.liquidity_reward) ? liquidity_reward.fromJSON(object.liquidity_reward) : undefined,
            interest: isSet(object.interest) ? interest.fromJSON(object.interest) : undefined,
            fill_vesting_withdraw: isSet(object.fill_vesting_withdraw)
                ? fill_vesting_withdraw.fromJSON(object.fill_vesting_withdraw)
                : undefined,
            fill_order: isSet(object.fill_order) ? fill_order.fromJSON(object.fill_order) : undefined,
            shutdown_witness: isSet(object.shutdown_witness) ? shutdown_witness.fromJSON(object.shutdown_witness) : undefined,
            fill_transfer_from_savings: isSet(object.fill_transfer_from_savings)
                ? fill_transfer_from_savings.fromJSON(object.fill_transfer_from_savings)
                : undefined,
            hardfork: isSet(object.hardfork) ? hardfork.fromJSON(object.hardfork) : undefined,
            comment_payout_update: isSet(object.comment_payout_update)
                ? comment_payout_update.fromJSON(object.comment_payout_update)
                : undefined,
            return_vesting_delegation: isSet(object.return_vesting_delegation)
                ? return_vesting_delegation.fromJSON(object.return_vesting_delegation)
                : undefined,
            comment_benefactor_reward: isSet(object.comment_benefactor_reward)
                ? comment_benefactor_reward.fromJSON(object.comment_benefactor_reward)
                : undefined,
            producer_reward: isSet(object.producer_reward) ? producer_reward.fromJSON(object.producer_reward) : undefined,
            clear_null_account_balance: isSet(object.clear_null_account_balance)
                ? clear_null_account_balance.fromJSON(object.clear_null_account_balance)
                : undefined,
            proposal_pay: isSet(object.proposal_pay) ? proposal_pay.fromJSON(object.proposal_pay) : undefined,
            dhf_funding: isSet(object.dhf_funding) ? dhf_funding.fromJSON(object.dhf_funding) : undefined,
            hardfork_hive: isSet(object.hardfork_hive) ? hardfork_hive.fromJSON(object.hardfork_hive) : undefined,
            hardfork_hive_restore: isSet(object.hardfork_hive_restore)
                ? hardfork_hive_restore.fromJSON(object.hardfork_hive_restore)
                : undefined,
            delayed_voting: isSet(object.delayed_voting) ? delayed_voting.fromJSON(object.delayed_voting) : undefined,
            consolidate_treasury_balance: isSet(object.consolidate_treasury_balance)
                ? consolidate_treasury_balance.fromJSON(object.consolidate_treasury_balance)
                : undefined,
            effective_comment_vote: isSet(object.effective_comment_vote)
                ? effective_comment_vote.fromJSON(object.effective_comment_vote)
                : undefined,
            ineffective_delete_comment: isSet(object.ineffective_delete_comment)
                ? ineffective_delete_comment.fromJSON(object.ineffective_delete_comment)
                : undefined,
            dhf_conversion: isSet(object.dhf_conversion) ? dhf_conversion.fromJSON(object.dhf_conversion) : undefined,
            expired_account_notification: isSet(object.expired_account_notification)
                ? expired_account_notification.fromJSON(object.expired_account_notification)
                : undefined,
            changed_recovery_account: isSet(object.changed_recovery_account)
                ? changed_recovery_account.fromJSON(object.changed_recovery_account)
                : undefined,
            transfer_to_vesting_completed: isSet(object.transfer_to_vesting_completed)
                ? transfer_to_vesting_completed.fromJSON(object.transfer_to_vesting_completed)
                : undefined,
            pow_reward: isSet(object.pow_reward) ? pow_reward.fromJSON(object.pow_reward) : undefined,
            vesting_shares_split: isSet(object.vesting_shares_split)
                ? vesting_shares_split.fromJSON(object.vesting_shares_split)
                : undefined,
            account_created: isSet(object.account_created) ? account_created.fromJSON(object.account_created) : undefined,
            fill_collateralized_convert_request: isSet(object.fill_collateralized_convert_request)
                ? fill_collateralized_convert_request.fromJSON(object.fill_collateralized_convert_request)
                : undefined,
            system_warning: isSet(object.system_warning) ? system_warning.fromJSON(object.system_warning) : undefined,
            fill_recurrent_transfer: isSet(object.fill_recurrent_transfer)
                ? fill_recurrent_transfer.fromJSON(object.fill_recurrent_transfer)
                : undefined,
            failed_recurrent_transfer: isSet(object.failed_recurrent_transfer)
                ? failed_recurrent_transfer.fromJSON(object.failed_recurrent_transfer)
                : undefined,
            limit_order_cancelled: isSet(object.limit_order_cancelled)
                ? limit_order_cancelled.fromJSON(object.limit_order_cancelled)
                : undefined,
            producer_missed: isSet(object.producer_missed) ? producer_missed.fromJSON(object.producer_missed) : undefined,
            proposal_fee: isSet(object.proposal_fee) ? proposal_fee.fromJSON(object.proposal_fee) : undefined,
            collateralized_convert_immediate_conversion: isSet(object.collateralized_convert_immediate_conversion)
                ? collateralized_convert_immediate_conversion.fromJSON(object.collateralized_convert_immediate_conversion)
                : undefined,
            escrow_approved: isSet(object.escrow_approved) ? escrow_approved.fromJSON(object.escrow_approved) : undefined,
            escrow_rejected: isSet(object.escrow_rejected) ? escrow_rejected.fromJSON(object.escrow_rejected) : undefined,
            proxy_cleared: isSet(object.proxy_cleared) ? proxy_cleared.fromJSON(object.proxy_cleared) : undefined,
            declined_voting_rights: isSet(object.declined_voting_rights)
                ? declined_voting_rights.fromJSON(object.declined_voting_rights)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.vote !== undefined) {
            obj.vote = vote.toJSON(message.vote);
        }
        if (message.comment !== undefined) {
            obj.comment = comment.toJSON(message.comment);
        }
        if (message.transfer !== undefined) {
            obj.transfer = transfer.toJSON(message.transfer);
        }
        if (message.transfer_to_vesting !== undefined) {
            obj.transfer_to_vesting = transfer_to_vesting.toJSON(message.transfer_to_vesting);
        }
        if (message.withdraw_vesting !== undefined) {
            obj.withdraw_vesting = withdraw_vesting.toJSON(message.withdraw_vesting);
        }
        if (message.limit_order_create !== undefined) {
            obj.limit_order_create = limit_order_create.toJSON(message.limit_order_create);
        }
        if (message.limit_order_cancel !== undefined) {
            obj.limit_order_cancel = limit_order_cancel.toJSON(message.limit_order_cancel);
        }
        if (message.feed_publish !== undefined) {
            obj.feed_publish = feed_publish.toJSON(message.feed_publish);
        }
        if (message.convert !== undefined) {
            obj.convert = convert.toJSON(message.convert);
        }
        if (message.account_create !== undefined) {
            obj.account_create = account_create.toJSON(message.account_create);
        }
        if (message.account_update !== undefined) {
            obj.account_update = account_update.toJSON(message.account_update);
        }
        if (message.witness_update !== undefined) {
            obj.witness_update = witness_update.toJSON(message.witness_update);
        }
        if (message.account_witness_vote !== undefined) {
            obj.account_witness_vote = account_witness_vote.toJSON(message.account_witness_vote);
        }
        if (message.account_witness_proxy !== undefined) {
            obj.account_witness_proxy = account_witness_proxy.toJSON(message.account_witness_proxy);
        }
        if (message.pow !== undefined) {
            obj.pow = pow.toJSON(message.pow);
        }
        if (message.custom !== undefined) {
            obj.custom = custom.toJSON(message.custom);
        }
        if (message.witness_block_approve !== undefined) {
            obj.witness_block_approve = witness_block_approve.toJSON(message.witness_block_approve);
        }
        if (message.delete_comment !== undefined) {
            obj.delete_comment = delete_comment.toJSON(message.delete_comment);
        }
        if (message.custom_json !== undefined) {
            obj.custom_json = custom_json.toJSON(message.custom_json);
        }
        if (message.comment_options !== undefined) {
            obj.comment_options = comment_options.toJSON(message.comment_options);
        }
        if (message.set_withdraw_vesting_route !== undefined) {
            obj.set_withdraw_vesting_route = set_withdraw_vesting_route.toJSON(message.set_withdraw_vesting_route);
        }
        if (message.limit_order_create2 !== undefined) {
            obj.limit_order_create2 = limit_order_create2.toJSON(message.limit_order_create2);
        }
        if (message.claim_account !== undefined) {
            obj.claim_account = claim_account.toJSON(message.claim_account);
        }
        if (message.create_claimed_account !== undefined) {
            obj.create_claimed_account = create_claimed_account.toJSON(message.create_claimed_account);
        }
        if (message.request_account_recovery !== undefined) {
            obj.request_account_recovery = request_account_recovery.toJSON(message.request_account_recovery);
        }
        if (message.recover_account !== undefined) {
            obj.recover_account = recover_account.toJSON(message.recover_account);
        }
        if (message.change_recovery_account !== undefined) {
            obj.change_recovery_account = change_recovery_account.toJSON(message.change_recovery_account);
        }
        if (message.escrow_transfer !== undefined) {
            obj.escrow_transfer = escrow_transfer.toJSON(message.escrow_transfer);
        }
        if (message.escrow_dispute !== undefined) {
            obj.escrow_dispute = escrow_dispute.toJSON(message.escrow_dispute);
        }
        if (message.escrow_release !== undefined) {
            obj.escrow_release = escrow_release.toJSON(message.escrow_release);
        }
        if (message.pow2 !== undefined) {
            obj.pow2 = pow2.toJSON(message.pow2);
        }
        if (message.escrow_approve !== undefined) {
            obj.escrow_approve = escrow_approve.toJSON(message.escrow_approve);
        }
        if (message.transfer_to_savings !== undefined) {
            obj.transfer_to_savings = transfer_to_savings.toJSON(message.transfer_to_savings);
        }
        if (message.transfer_from_savings !== undefined) {
            obj.transfer_from_savings = transfer_from_savings.toJSON(message.transfer_from_savings);
        }
        if (message.cancel_transfer_from_savings !== undefined) {
            obj.cancel_transfer_from_savings = cancel_transfer_from_savings.toJSON(message.cancel_transfer_from_savings);
        }
        if (message.decline_voting_rights !== undefined) {
            obj.decline_voting_rights = decline_voting_rights.toJSON(message.decline_voting_rights);
        }
        if (message.claim_reward_balance !== undefined) {
            obj.claim_reward_balance = claim_reward_balance.toJSON(message.claim_reward_balance);
        }
        if (message.delegate_vesting_shares !== undefined) {
            obj.delegate_vesting_shares = delegate_vesting_shares.toJSON(message.delegate_vesting_shares);
        }
        if (message.account_create_with_delegation !== undefined) {
            obj.account_create_with_delegation = account_create_with_delegation.toJSON(message.account_create_with_delegation);
        }
        if (message.witness_set_properties !== undefined) {
            obj.witness_set_properties = witness_set_properties.toJSON(message.witness_set_properties);
        }
        if (message.account_update2 !== undefined) {
            obj.account_update2 = account_update2.toJSON(message.account_update2);
        }
        if (message.create_proposal !== undefined) {
            obj.create_proposal = create_proposal.toJSON(message.create_proposal);
        }
        if (message.update_proposal_votes !== undefined) {
            obj.update_proposal_votes = update_proposal_votes.toJSON(message.update_proposal_votes);
        }
        if (message.remove_proposal !== undefined) {
            obj.remove_proposal = remove_proposal.toJSON(message.remove_proposal);
        }
        if (message.update_proposal !== undefined) {
            obj.update_proposal = update_proposal.toJSON(message.update_proposal);
        }
        if (message.collateralized_convert !== undefined) {
            obj.collateralized_convert = collateralized_convert.toJSON(message.collateralized_convert);
        }
        if (message.recurrent_transfer !== undefined) {
            obj.recurrent_transfer = recurrent_transfer.toJSON(message.recurrent_transfer);
        }
        if (message.fill_convert_request !== undefined) {
            obj.fill_convert_request = fill_convert_request.toJSON(message.fill_convert_request);
        }
        if (message.author_reward !== undefined) {
            obj.author_reward = author_reward.toJSON(message.author_reward);
        }
        if (message.curation_reward !== undefined) {
            obj.curation_reward = curation_reward.toJSON(message.curation_reward);
        }
        if (message.comment_reward !== undefined) {
            obj.comment_reward = comment_reward.toJSON(message.comment_reward);
        }
        if (message.liquidity_reward !== undefined) {
            obj.liquidity_reward = liquidity_reward.toJSON(message.liquidity_reward);
        }
        if (message.interest !== undefined) {
            obj.interest = interest.toJSON(message.interest);
        }
        if (message.fill_vesting_withdraw !== undefined) {
            obj.fill_vesting_withdraw = fill_vesting_withdraw.toJSON(message.fill_vesting_withdraw);
        }
        if (message.fill_order !== undefined) {
            obj.fill_order = fill_order.toJSON(message.fill_order);
        }
        if (message.shutdown_witness !== undefined) {
            obj.shutdown_witness = shutdown_witness.toJSON(message.shutdown_witness);
        }
        if (message.fill_transfer_from_savings !== undefined) {
            obj.fill_transfer_from_savings = fill_transfer_from_savings.toJSON(message.fill_transfer_from_savings);
        }
        if (message.hardfork !== undefined) {
            obj.hardfork = hardfork.toJSON(message.hardfork);
        }
        if (message.comment_payout_update !== undefined) {
            obj.comment_payout_update = comment_payout_update.toJSON(message.comment_payout_update);
        }
        if (message.return_vesting_delegation !== undefined) {
            obj.return_vesting_delegation = return_vesting_delegation.toJSON(message.return_vesting_delegation);
        }
        if (message.comment_benefactor_reward !== undefined) {
            obj.comment_benefactor_reward = comment_benefactor_reward.toJSON(message.comment_benefactor_reward);
        }
        if (message.producer_reward !== undefined) {
            obj.producer_reward = producer_reward.toJSON(message.producer_reward);
        }
        if (message.clear_null_account_balance !== undefined) {
            obj.clear_null_account_balance = clear_null_account_balance.toJSON(message.clear_null_account_balance);
        }
        if (message.proposal_pay !== undefined) {
            obj.proposal_pay = proposal_pay.toJSON(message.proposal_pay);
        }
        if (message.dhf_funding !== undefined) {
            obj.dhf_funding = dhf_funding.toJSON(message.dhf_funding);
        }
        if (message.hardfork_hive !== undefined) {
            obj.hardfork_hive = hardfork_hive.toJSON(message.hardfork_hive);
        }
        if (message.hardfork_hive_restore !== undefined) {
            obj.hardfork_hive_restore = hardfork_hive_restore.toJSON(message.hardfork_hive_restore);
        }
        if (message.delayed_voting !== undefined) {
            obj.delayed_voting = delayed_voting.toJSON(message.delayed_voting);
        }
        if (message.consolidate_treasury_balance !== undefined) {
            obj.consolidate_treasury_balance = consolidate_treasury_balance.toJSON(message.consolidate_treasury_balance);
        }
        if (message.effective_comment_vote !== undefined) {
            obj.effective_comment_vote = effective_comment_vote.toJSON(message.effective_comment_vote);
        }
        if (message.ineffective_delete_comment !== undefined) {
            obj.ineffective_delete_comment = ineffective_delete_comment.toJSON(message.ineffective_delete_comment);
        }
        if (message.dhf_conversion !== undefined) {
            obj.dhf_conversion = dhf_conversion.toJSON(message.dhf_conversion);
        }
        if (message.expired_account_notification !== undefined) {
            obj.expired_account_notification = expired_account_notification.toJSON(message.expired_account_notification);
        }
        if (message.changed_recovery_account !== undefined) {
            obj.changed_recovery_account = changed_recovery_account.toJSON(message.changed_recovery_account);
        }
        if (message.transfer_to_vesting_completed !== undefined) {
            obj.transfer_to_vesting_completed = transfer_to_vesting_completed.toJSON(message.transfer_to_vesting_completed);
        }
        if (message.pow_reward !== undefined) {
            obj.pow_reward = pow_reward.toJSON(message.pow_reward);
        }
        if (message.vesting_shares_split !== undefined) {
            obj.vesting_shares_split = vesting_shares_split.toJSON(message.vesting_shares_split);
        }
        if (message.account_created !== undefined) {
            obj.account_created = account_created.toJSON(message.account_created);
        }
        if (message.fill_collateralized_convert_request !== undefined) {
            obj.fill_collateralized_convert_request = fill_collateralized_convert_request.toJSON(message.fill_collateralized_convert_request);
        }
        if (message.system_warning !== undefined) {
            obj.system_warning = system_warning.toJSON(message.system_warning);
        }
        if (message.fill_recurrent_transfer !== undefined) {
            obj.fill_recurrent_transfer = fill_recurrent_transfer.toJSON(message.fill_recurrent_transfer);
        }
        if (message.failed_recurrent_transfer !== undefined) {
            obj.failed_recurrent_transfer = failed_recurrent_transfer.toJSON(message.failed_recurrent_transfer);
        }
        if (message.limit_order_cancelled !== undefined) {
            obj.limit_order_cancelled = limit_order_cancelled.toJSON(message.limit_order_cancelled);
        }
        if (message.producer_missed !== undefined) {
            obj.producer_missed = producer_missed.toJSON(message.producer_missed);
        }
        if (message.proposal_fee !== undefined) {
            obj.proposal_fee = proposal_fee.toJSON(message.proposal_fee);
        }
        if (message.collateralized_convert_immediate_conversion !== undefined) {
            obj.collateralized_convert_immediate_conversion = collateralized_convert_immediate_conversion.toJSON(message.collateralized_convert_immediate_conversion);
        }
        if (message.escrow_approved !== undefined) {
            obj.escrow_approved = escrow_approved.toJSON(message.escrow_approved);
        }
        if (message.escrow_rejected !== undefined) {
            obj.escrow_rejected = escrow_rejected.toJSON(message.escrow_rejected);
        }
        if (message.proxy_cleared !== undefined) {
            obj.proxy_cleared = proxy_cleared.toJSON(message.proxy_cleared);
        }
        if (message.declined_voting_rights !== undefined) {
            obj.declined_voting_rights = declined_voting_rights.toJSON(message.declined_voting_rights);
        }
        return obj;
    },
    create(base) {
        return operation.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseoperation();
        message.vote = (object.vote !== undefined && object.vote !== null) ? vote.fromPartial(object.vote) : undefined;
        message.comment = (object.comment !== undefined && object.comment !== null)
            ? comment.fromPartial(object.comment)
            : undefined;
        message.transfer = (object.transfer !== undefined && object.transfer !== null)
            ? transfer.fromPartial(object.transfer)
            : undefined;
        message.transfer_to_vesting = (object.transfer_to_vesting !== undefined && object.transfer_to_vesting !== null)
            ? transfer_to_vesting.fromPartial(object.transfer_to_vesting)
            : undefined;
        message.withdraw_vesting = (object.withdraw_vesting !== undefined && object.withdraw_vesting !== null)
            ? withdraw_vesting.fromPartial(object.withdraw_vesting)
            : undefined;
        message.limit_order_create = (object.limit_order_create !== undefined && object.limit_order_create !== null)
            ? limit_order_create.fromPartial(object.limit_order_create)
            : undefined;
        message.limit_order_cancel = (object.limit_order_cancel !== undefined && object.limit_order_cancel !== null)
            ? limit_order_cancel.fromPartial(object.limit_order_cancel)
            : undefined;
        message.feed_publish = (object.feed_publish !== undefined && object.feed_publish !== null)
            ? feed_publish.fromPartial(object.feed_publish)
            : undefined;
        message.convert = (object.convert !== undefined && object.convert !== null)
            ? convert.fromPartial(object.convert)
            : undefined;
        message.account_create = (object.account_create !== undefined && object.account_create !== null)
            ? account_create.fromPartial(object.account_create)
            : undefined;
        message.account_update = (object.account_update !== undefined && object.account_update !== null)
            ? account_update.fromPartial(object.account_update)
            : undefined;
        message.witness_update = (object.witness_update !== undefined && object.witness_update !== null)
            ? witness_update.fromPartial(object.witness_update)
            : undefined;
        message.account_witness_vote = (object.account_witness_vote !== undefined && object.account_witness_vote !== null)
            ? account_witness_vote.fromPartial(object.account_witness_vote)
            : undefined;
        message.account_witness_proxy =
            (object.account_witness_proxy !== undefined && object.account_witness_proxy !== null)
                ? account_witness_proxy.fromPartial(object.account_witness_proxy)
                : undefined;
        message.pow = (object.pow !== undefined && object.pow !== null) ? pow.fromPartial(object.pow) : undefined;
        message.custom = (object.custom !== undefined && object.custom !== null)
            ? custom.fromPartial(object.custom)
            : undefined;
        message.witness_block_approve =
            (object.witness_block_approve !== undefined && object.witness_block_approve !== null)
                ? witness_block_approve.fromPartial(object.witness_block_approve)
                : undefined;
        message.delete_comment = (object.delete_comment !== undefined && object.delete_comment !== null)
            ? delete_comment.fromPartial(object.delete_comment)
            : undefined;
        message.custom_json = (object.custom_json !== undefined && object.custom_json !== null)
            ? custom_json.fromPartial(object.custom_json)
            : undefined;
        message.comment_options = (object.comment_options !== undefined && object.comment_options !== null)
            ? comment_options.fromPartial(object.comment_options)
            : undefined;
        message.set_withdraw_vesting_route =
            (object.set_withdraw_vesting_route !== undefined && object.set_withdraw_vesting_route !== null)
                ? set_withdraw_vesting_route.fromPartial(object.set_withdraw_vesting_route)
                : undefined;
        message.limit_order_create2 = (object.limit_order_create2 !== undefined && object.limit_order_create2 !== null)
            ? limit_order_create2.fromPartial(object.limit_order_create2)
            : undefined;
        message.claim_account = (object.claim_account !== undefined && object.claim_account !== null)
            ? claim_account.fromPartial(object.claim_account)
            : undefined;
        message.create_claimed_account =
            (object.create_claimed_account !== undefined && object.create_claimed_account !== null)
                ? create_claimed_account.fromPartial(object.create_claimed_account)
                : undefined;
        message.request_account_recovery =
            (object.request_account_recovery !== undefined && object.request_account_recovery !== null)
                ? request_account_recovery.fromPartial(object.request_account_recovery)
                : undefined;
        message.recover_account = (object.recover_account !== undefined && object.recover_account !== null)
            ? recover_account.fromPartial(object.recover_account)
            : undefined;
        message.change_recovery_account =
            (object.change_recovery_account !== undefined && object.change_recovery_account !== null)
                ? change_recovery_account.fromPartial(object.change_recovery_account)
                : undefined;
        message.escrow_transfer = (object.escrow_transfer !== undefined && object.escrow_transfer !== null)
            ? escrow_transfer.fromPartial(object.escrow_transfer)
            : undefined;
        message.escrow_dispute = (object.escrow_dispute !== undefined && object.escrow_dispute !== null)
            ? escrow_dispute.fromPartial(object.escrow_dispute)
            : undefined;
        message.escrow_release = (object.escrow_release !== undefined && object.escrow_release !== null)
            ? escrow_release.fromPartial(object.escrow_release)
            : undefined;
        message.pow2 = (object.pow2 !== undefined && object.pow2 !== null) ? pow2.fromPartial(object.pow2) : undefined;
        message.escrow_approve = (object.escrow_approve !== undefined && object.escrow_approve !== null)
            ? escrow_approve.fromPartial(object.escrow_approve)
            : undefined;
        message.transfer_to_savings = (object.transfer_to_savings !== undefined && object.transfer_to_savings !== null)
            ? transfer_to_savings.fromPartial(object.transfer_to_savings)
            : undefined;
        message.transfer_from_savings =
            (object.transfer_from_savings !== undefined && object.transfer_from_savings !== null)
                ? transfer_from_savings.fromPartial(object.transfer_from_savings)
                : undefined;
        message.cancel_transfer_from_savings =
            (object.cancel_transfer_from_savings !== undefined && object.cancel_transfer_from_savings !== null)
                ? cancel_transfer_from_savings.fromPartial(object.cancel_transfer_from_savings)
                : undefined;
        message.decline_voting_rights =
            (object.decline_voting_rights !== undefined && object.decline_voting_rights !== null)
                ? decline_voting_rights.fromPartial(object.decline_voting_rights)
                : undefined;
        message.claim_reward_balance = (object.claim_reward_balance !== undefined && object.claim_reward_balance !== null)
            ? claim_reward_balance.fromPartial(object.claim_reward_balance)
            : undefined;
        message.delegate_vesting_shares =
            (object.delegate_vesting_shares !== undefined && object.delegate_vesting_shares !== null)
                ? delegate_vesting_shares.fromPartial(object.delegate_vesting_shares)
                : undefined;
        message.account_create_with_delegation =
            (object.account_create_with_delegation !== undefined && object.account_create_with_delegation !== null)
                ? account_create_with_delegation.fromPartial(object.account_create_with_delegation)
                : undefined;
        message.witness_set_properties =
            (object.witness_set_properties !== undefined && object.witness_set_properties !== null)
                ? witness_set_properties.fromPartial(object.witness_set_properties)
                : undefined;
        message.account_update2 = (object.account_update2 !== undefined && object.account_update2 !== null)
            ? account_update2.fromPartial(object.account_update2)
            : undefined;
        message.create_proposal = (object.create_proposal !== undefined && object.create_proposal !== null)
            ? create_proposal.fromPartial(object.create_proposal)
            : undefined;
        message.update_proposal_votes =
            (object.update_proposal_votes !== undefined && object.update_proposal_votes !== null)
                ? update_proposal_votes.fromPartial(object.update_proposal_votes)
                : undefined;
        message.remove_proposal = (object.remove_proposal !== undefined && object.remove_proposal !== null)
            ? remove_proposal.fromPartial(object.remove_proposal)
            : undefined;
        message.update_proposal = (object.update_proposal !== undefined && object.update_proposal !== null)
            ? update_proposal.fromPartial(object.update_proposal)
            : undefined;
        message.collateralized_convert =
            (object.collateralized_convert !== undefined && object.collateralized_convert !== null)
                ? collateralized_convert.fromPartial(object.collateralized_convert)
                : undefined;
        message.recurrent_transfer = (object.recurrent_transfer !== undefined && object.recurrent_transfer !== null)
            ? recurrent_transfer.fromPartial(object.recurrent_transfer)
            : undefined;
        message.fill_convert_request = (object.fill_convert_request !== undefined && object.fill_convert_request !== null)
            ? fill_convert_request.fromPartial(object.fill_convert_request)
            : undefined;
        message.author_reward = (object.author_reward !== undefined && object.author_reward !== null)
            ? author_reward.fromPartial(object.author_reward)
            : undefined;
        message.curation_reward = (object.curation_reward !== undefined && object.curation_reward !== null)
            ? curation_reward.fromPartial(object.curation_reward)
            : undefined;
        message.comment_reward = (object.comment_reward !== undefined && object.comment_reward !== null)
            ? comment_reward.fromPartial(object.comment_reward)
            : undefined;
        message.liquidity_reward = (object.liquidity_reward !== undefined && object.liquidity_reward !== null)
            ? liquidity_reward.fromPartial(object.liquidity_reward)
            : undefined;
        message.interest = (object.interest !== undefined && object.interest !== null)
            ? interest.fromPartial(object.interest)
            : undefined;
        message.fill_vesting_withdraw =
            (object.fill_vesting_withdraw !== undefined && object.fill_vesting_withdraw !== null)
                ? fill_vesting_withdraw.fromPartial(object.fill_vesting_withdraw)
                : undefined;
        message.fill_order = (object.fill_order !== undefined && object.fill_order !== null)
            ? fill_order.fromPartial(object.fill_order)
            : undefined;
        message.shutdown_witness = (object.shutdown_witness !== undefined && object.shutdown_witness !== null)
            ? shutdown_witness.fromPartial(object.shutdown_witness)
            : undefined;
        message.fill_transfer_from_savings =
            (object.fill_transfer_from_savings !== undefined && object.fill_transfer_from_savings !== null)
                ? fill_transfer_from_savings.fromPartial(object.fill_transfer_from_savings)
                : undefined;
        message.hardfork = (object.hardfork !== undefined && object.hardfork !== null)
            ? hardfork.fromPartial(object.hardfork)
            : undefined;
        message.comment_payout_update =
            (object.comment_payout_update !== undefined && object.comment_payout_update !== null)
                ? comment_payout_update.fromPartial(object.comment_payout_update)
                : undefined;
        message.return_vesting_delegation =
            (object.return_vesting_delegation !== undefined && object.return_vesting_delegation !== null)
                ? return_vesting_delegation.fromPartial(object.return_vesting_delegation)
                : undefined;
        message.comment_benefactor_reward =
            (object.comment_benefactor_reward !== undefined && object.comment_benefactor_reward !== null)
                ? comment_benefactor_reward.fromPartial(object.comment_benefactor_reward)
                : undefined;
        message.producer_reward = (object.producer_reward !== undefined && object.producer_reward !== null)
            ? producer_reward.fromPartial(object.producer_reward)
            : undefined;
        message.clear_null_account_balance =
            (object.clear_null_account_balance !== undefined && object.clear_null_account_balance !== null)
                ? clear_null_account_balance.fromPartial(object.clear_null_account_balance)
                : undefined;
        message.proposal_pay = (object.proposal_pay !== undefined && object.proposal_pay !== null)
            ? proposal_pay.fromPartial(object.proposal_pay)
            : undefined;
        message.dhf_funding = (object.dhf_funding !== undefined && object.dhf_funding !== null)
            ? dhf_funding.fromPartial(object.dhf_funding)
            : undefined;
        message.hardfork_hive = (object.hardfork_hive !== undefined && object.hardfork_hive !== null)
            ? hardfork_hive.fromPartial(object.hardfork_hive)
            : undefined;
        message.hardfork_hive_restore =
            (object.hardfork_hive_restore !== undefined && object.hardfork_hive_restore !== null)
                ? hardfork_hive_restore.fromPartial(object.hardfork_hive_restore)
                : undefined;
        message.delayed_voting = (object.delayed_voting !== undefined && object.delayed_voting !== null)
            ? delayed_voting.fromPartial(object.delayed_voting)
            : undefined;
        message.consolidate_treasury_balance =
            (object.consolidate_treasury_balance !== undefined && object.consolidate_treasury_balance !== null)
                ? consolidate_treasury_balance.fromPartial(object.consolidate_treasury_balance)
                : undefined;
        message.effective_comment_vote =
            (object.effective_comment_vote !== undefined && object.effective_comment_vote !== null)
                ? effective_comment_vote.fromPartial(object.effective_comment_vote)
                : undefined;
        message.ineffective_delete_comment =
            (object.ineffective_delete_comment !== undefined && object.ineffective_delete_comment !== null)
                ? ineffective_delete_comment.fromPartial(object.ineffective_delete_comment)
                : undefined;
        message.dhf_conversion = (object.dhf_conversion !== undefined && object.dhf_conversion !== null)
            ? dhf_conversion.fromPartial(object.dhf_conversion)
            : undefined;
        message.expired_account_notification =
            (object.expired_account_notification !== undefined && object.expired_account_notification !== null)
                ? expired_account_notification.fromPartial(object.expired_account_notification)
                : undefined;
        message.changed_recovery_account =
            (object.changed_recovery_account !== undefined && object.changed_recovery_account !== null)
                ? changed_recovery_account.fromPartial(object.changed_recovery_account)
                : undefined;
        message.transfer_to_vesting_completed =
            (object.transfer_to_vesting_completed !== undefined && object.transfer_to_vesting_completed !== null)
                ? transfer_to_vesting_completed.fromPartial(object.transfer_to_vesting_completed)
                : undefined;
        message.pow_reward = (object.pow_reward !== undefined && object.pow_reward !== null)
            ? pow_reward.fromPartial(object.pow_reward)
            : undefined;
        message.vesting_shares_split = (object.vesting_shares_split !== undefined && object.vesting_shares_split !== null)
            ? vesting_shares_split.fromPartial(object.vesting_shares_split)
            : undefined;
        message.account_created = (object.account_created !== undefined && object.account_created !== null)
            ? account_created.fromPartial(object.account_created)
            : undefined;
        message.fill_collateralized_convert_request =
            (object.fill_collateralized_convert_request !== undefined && object.fill_collateralized_convert_request !== null)
                ? fill_collateralized_convert_request.fromPartial(object.fill_collateralized_convert_request)
                : undefined;
        message.system_warning = (object.system_warning !== undefined && object.system_warning !== null)
            ? system_warning.fromPartial(object.system_warning)
            : undefined;
        message.fill_recurrent_transfer =
            (object.fill_recurrent_transfer !== undefined && object.fill_recurrent_transfer !== null)
                ? fill_recurrent_transfer.fromPartial(object.fill_recurrent_transfer)
                : undefined;
        message.failed_recurrent_transfer =
            (object.failed_recurrent_transfer !== undefined && object.failed_recurrent_transfer !== null)
                ? failed_recurrent_transfer.fromPartial(object.failed_recurrent_transfer)
                : undefined;
        message.limit_order_cancelled =
            (object.limit_order_cancelled !== undefined && object.limit_order_cancelled !== null)
                ? limit_order_cancelled.fromPartial(object.limit_order_cancelled)
                : undefined;
        message.producer_missed = (object.producer_missed !== undefined && object.producer_missed !== null)
            ? producer_missed.fromPartial(object.producer_missed)
            : undefined;
        message.proposal_fee = (object.proposal_fee !== undefined && object.proposal_fee !== null)
            ? proposal_fee.fromPartial(object.proposal_fee)
            : undefined;
        message.collateralized_convert_immediate_conversion =
            (object.collateralized_convert_immediate_conversion !== undefined &&
                object.collateralized_convert_immediate_conversion !== null)
                ? collateralized_convert_immediate_conversion.fromPartial(object.collateralized_convert_immediate_conversion)
                : undefined;
        message.escrow_approved = (object.escrow_approved !== undefined && object.escrow_approved !== null)
            ? escrow_approved.fromPartial(object.escrow_approved)
            : undefined;
        message.escrow_rejected = (object.escrow_rejected !== undefined && object.escrow_rejected !== null)
            ? escrow_rejected.fromPartial(object.escrow_rejected)
            : undefined;
        message.proxy_cleared = (object.proxy_cleared !== undefined && object.proxy_cleared !== null)
            ? proxy_cleared.fromPartial(object.proxy_cleared)
            : undefined;
        message.declined_voting_rights =
            (object.declined_voting_rights !== undefined && object.declined_voting_rights !== null)
                ? declined_voting_rights.fromPartial(object.declined_voting_rights)
                : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
