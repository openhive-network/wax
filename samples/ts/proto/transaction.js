/* eslint-disable */
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
export const protobufPackage = "hive.protocol.buffers";
function createBaseoperation() {
    return {};
}
export const operation = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.vote !== undefined) {
            vote.encode(message.vote, writer.uint32(10).fork()).ldelim();
        }
        if (message.comment !== undefined) {
            comment.encode(message.comment, writer.uint32(18).fork()).ldelim();
        }
        if (message.transfer !== undefined) {
            transfer.encode(message.transfer, writer.uint32(26).fork()).ldelim();
        }
        if (message.transfer_to_vesting !== undefined) {
            transfer_to_vesting.encode(message.transfer_to_vesting, writer.uint32(34).fork()).ldelim();
        }
        if (message.withdraw_vesting !== undefined) {
            withdraw_vesting.encode(message.withdraw_vesting, writer.uint32(42).fork()).ldelim();
        }
        if (message.limit_order_create !== undefined) {
            limit_order_create.encode(message.limit_order_create, writer.uint32(50).fork()).ldelim();
        }
        if (message.limit_order_cancel !== undefined) {
            limit_order_cancel.encode(message.limit_order_cancel, writer.uint32(58).fork()).ldelim();
        }
        if (message.feed_publish !== undefined) {
            feed_publish.encode(message.feed_publish, writer.uint32(66).fork()).ldelim();
        }
        if (message.convert !== undefined) {
            convert.encode(message.convert, writer.uint32(74).fork()).ldelim();
        }
        if (message.account_create !== undefined) {
            account_create.encode(message.account_create, writer.uint32(82).fork()).ldelim();
        }
        if (message.account_update !== undefined) {
            account_update.encode(message.account_update, writer.uint32(90).fork()).ldelim();
        }
        if (message.account_witness_vote !== undefined) {
            account_witness_vote.encode(message.account_witness_vote, writer.uint32(106).fork()).ldelim();
        }
        if (message.account_witness_proxy !== undefined) {
            account_witness_proxy.encode(message.account_witness_proxy, writer.uint32(114).fork()).ldelim();
        }
        if (message.custom !== undefined) {
            custom.encode(message.custom, writer.uint32(130).fork()).ldelim();
        }
        if (message.witness_block_approve !== undefined) {
            witness_block_approve.encode(message.witness_block_approve, writer.uint32(138).fork()).ldelim();
        }
        if (message.delete_comment !== undefined) {
            delete_comment.encode(message.delete_comment, writer.uint32(146).fork()).ldelim();
        }
        if (message.custom_json !== undefined) {
            custom_json.encode(message.custom_json, writer.uint32(154).fork()).ldelim();
        }
        if (message.comment_options !== undefined) {
            comment_options.encode(message.comment_options, writer.uint32(162).fork()).ldelim();
        }
        if (message.set_withdraw_vesting_route !== undefined) {
            set_withdraw_vesting_route.encode(message.set_withdraw_vesting_route, writer.uint32(170).fork()).ldelim();
        }
        if (message.limit_order_create2 !== undefined) {
            limit_order_create2.encode(message.limit_order_create2, writer.uint32(178).fork()).ldelim();
        }
        if (message.claim_account !== undefined) {
            claim_account.encode(message.claim_account, writer.uint32(186).fork()).ldelim();
        }
        if (message.create_claimed_account !== undefined) {
            create_claimed_account.encode(message.create_claimed_account, writer.uint32(194).fork()).ldelim();
        }
        if (message.request_account_recovery !== undefined) {
            request_account_recovery.encode(message.request_account_recovery, writer.uint32(202).fork()).ldelim();
        }
        if (message.recover_account !== undefined) {
            recover_account.encode(message.recover_account, writer.uint32(210).fork()).ldelim();
        }
        if (message.change_recovery_account !== undefined) {
            change_recovery_account.encode(message.change_recovery_account, writer.uint32(218).fork()).ldelim();
        }
        if (message.escrow_transfer !== undefined) {
            escrow_transfer.encode(message.escrow_transfer, writer.uint32(226).fork()).ldelim();
        }
        if (message.escrow_dispute !== undefined) {
            escrow_dispute.encode(message.escrow_dispute, writer.uint32(234).fork()).ldelim();
        }
        if (message.escrow_release !== undefined) {
            escrow_release.encode(message.escrow_release, writer.uint32(242).fork()).ldelim();
        }
        if (message.escrow_approve !== undefined) {
            escrow_approve.encode(message.escrow_approve, writer.uint32(258).fork()).ldelim();
        }
        if (message.transfer_to_savings !== undefined) {
            transfer_to_savings.encode(message.transfer_to_savings, writer.uint32(266).fork()).ldelim();
        }
        if (message.transfer_from_savings !== undefined) {
            transfer_from_savings.encode(message.transfer_from_savings, writer.uint32(274).fork()).ldelim();
        }
        if (message.cancel_transfer_from_savings !== undefined) {
            cancel_transfer_from_savings.encode(message.cancel_transfer_from_savings, writer.uint32(282).fork()).ldelim();
        }
        if (message.decline_voting_rights !== undefined) {
            decline_voting_rights.encode(message.decline_voting_rights, writer.uint32(298).fork()).ldelim();
        }
        if (message.recurrent_transfer !== undefined) {
            recurrent_transfer.encode(message.recurrent_transfer, writer.uint32(402).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseoperation();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.vote = vote.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.comment = comment.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.transfer = transfer.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.transfer_to_vesting = transfer_to_vesting.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.withdraw_vesting = withdraw_vesting.decode(reader, reader.uint32());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.limit_order_create = limit_order_create.decode(reader, reader.uint32());
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.limit_order_cancel = limit_order_cancel.decode(reader, reader.uint32());
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.feed_publish = feed_publish.decode(reader, reader.uint32());
                    continue;
                case 9:
                    if (tag !== 74) {
                        break;
                    }
                    message.convert = convert.decode(reader, reader.uint32());
                    continue;
                case 10:
                    if (tag !== 82) {
                        break;
                    }
                    message.account_create = account_create.decode(reader, reader.uint32());
                    continue;
                case 11:
                    if (tag !== 90) {
                        break;
                    }
                    message.account_update = account_update.decode(reader, reader.uint32());
                    continue;
                case 13:
                    if (tag !== 106) {
                        break;
                    }
                    message.account_witness_vote = account_witness_vote.decode(reader, reader.uint32());
                    continue;
                case 14:
                    if (tag !== 114) {
                        break;
                    }
                    message.account_witness_proxy = account_witness_proxy.decode(reader, reader.uint32());
                    continue;
                case 16:
                    if (tag !== 130) {
                        break;
                    }
                    message.custom = custom.decode(reader, reader.uint32());
                    continue;
                case 17:
                    if (tag !== 138) {
                        break;
                    }
                    message.witness_block_approve = witness_block_approve.decode(reader, reader.uint32());
                    continue;
                case 18:
                    if (tag !== 146) {
                        break;
                    }
                    message.delete_comment = delete_comment.decode(reader, reader.uint32());
                    continue;
                case 19:
                    if (tag !== 154) {
                        break;
                    }
                    message.custom_json = custom_json.decode(reader, reader.uint32());
                    continue;
                case 20:
                    if (tag !== 162) {
                        break;
                    }
                    message.comment_options = comment_options.decode(reader, reader.uint32());
                    continue;
                case 21:
                    if (tag !== 170) {
                        break;
                    }
                    message.set_withdraw_vesting_route = set_withdraw_vesting_route.decode(reader, reader.uint32());
                    continue;
                case 22:
                    if (tag !== 178) {
                        break;
                    }
                    message.limit_order_create2 = limit_order_create2.decode(reader, reader.uint32());
                    continue;
                case 23:
                    if (tag !== 186) {
                        break;
                    }
                    message.claim_account = claim_account.decode(reader, reader.uint32());
                    continue;
                case 24:
                    if (tag !== 194) {
                        break;
                    }
                    message.create_claimed_account = create_claimed_account.decode(reader, reader.uint32());
                    continue;
                case 25:
                    if (tag !== 202) {
                        break;
                    }
                    message.request_account_recovery = request_account_recovery.decode(reader, reader.uint32());
                    continue;
                case 26:
                    if (tag !== 210) {
                        break;
                    }
                    message.recover_account = recover_account.decode(reader, reader.uint32());
                    continue;
                case 27:
                    if (tag !== 218) {
                        break;
                    }
                    message.change_recovery_account = change_recovery_account.decode(reader, reader.uint32());
                    continue;
                case 28:
                    if (tag !== 226) {
                        break;
                    }
                    message.escrow_transfer = escrow_transfer.decode(reader, reader.uint32());
                    continue;
                case 29:
                    if (tag !== 234) {
                        break;
                    }
                    message.escrow_dispute = escrow_dispute.decode(reader, reader.uint32());
                    continue;
                case 30:
                    if (tag !== 242) {
                        break;
                    }
                    message.escrow_release = escrow_release.decode(reader, reader.uint32());
                    continue;
                case 32:
                    if (tag !== 258) {
                        break;
                    }
                    message.escrow_approve = escrow_approve.decode(reader, reader.uint32());
                    continue;
                case 33:
                    if (tag !== 266) {
                        break;
                    }
                    message.transfer_to_savings = transfer_to_savings.decode(reader, reader.uint32());
                    continue;
                case 34:
                    if (tag !== 274) {
                        break;
                    }
                    message.transfer_from_savings = transfer_from_savings.decode(reader, reader.uint32());
                    continue;
                case 35:
                    if (tag !== 282) {
                        break;
                    }
                    message.cancel_transfer_from_savings = cancel_transfer_from_savings.decode(reader, reader.uint32());
                    continue;
                case 37:
                    if (tag !== 298) {
                        break;
                    }
                    message.decline_voting_rights = decline_voting_rights.decode(reader, reader.uint32());
                    continue;
                case 50:
                    if (tag !== 402) {
                        break;
                    }
                    message.recurrent_transfer = recurrent_transfer.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
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
            account_witness_vote: isSet(object.account_witness_vote)
                ? account_witness_vote.fromJSON(object.account_witness_vote)
                : undefined,
            account_witness_proxy: isSet(object.account_witness_proxy)
                ? account_witness_proxy.fromJSON(object.account_witness_proxy)
                : undefined,
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
            recurrent_transfer: isSet(object.recurrent_transfer)
                ? recurrent_transfer.fromJSON(object.recurrent_transfer)
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
        if (message.account_witness_vote !== undefined) {
            obj.account_witness_vote = account_witness_vote.toJSON(message.account_witness_vote);
        }
        if (message.account_witness_proxy !== undefined) {
            obj.account_witness_proxy = account_witness_proxy.toJSON(message.account_witness_proxy);
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
        if (message.recurrent_transfer !== undefined) {
            obj.recurrent_transfer = recurrent_transfer.toJSON(message.recurrent_transfer);
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
        message.account_witness_vote = (object.account_witness_vote !== undefined && object.account_witness_vote !== null)
            ? account_witness_vote.fromPartial(object.account_witness_vote)
            : undefined;
        message.account_witness_proxy =
            (object.account_witness_proxy !== undefined && object.account_witness_proxy !== null)
                ? account_witness_proxy.fromPartial(object.account_witness_proxy)
                : undefined;
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
        message.recurrent_transfer = (object.recurrent_transfer !== undefined && object.recurrent_transfer !== null)
            ? recurrent_transfer.fromPartial(object.recurrent_transfer)
            : undefined;
        return message;
    },
};
function createBasetransaction() {
    return { ref_block_num: 0, ref_block_prefix: 0, expiration: "", operations: [], extensions: [] };
}
export const transaction = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.ref_block_num !== 0) {
            writer.uint32(8).uint32(message.ref_block_num);
        }
        if (message.ref_block_prefix !== 0) {
            writer.uint32(16).uint32(message.ref_block_prefix);
        }
        if (message.expiration !== "") {
            writer.uint32(26).string(message.expiration);
        }
        for (const v of message.operations) {
            operation.encode(v, writer.uint32(34).fork()).ldelim();
        }
        for (const v of message.extensions) {
            future_extensions.encode(v, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasetransaction();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.ref_block_num = reader.uint32();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.ref_block_prefix = reader.uint32();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.expiration = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.operations.push(operation.decode(reader, reader.uint32()));
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.extensions.push(future_extensions.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            ref_block_num: isSet(object.ref_block_num) ? Number(object.ref_block_num) : 0,
            ref_block_prefix: isSet(object.ref_block_prefix) ? Number(object.ref_block_prefix) : 0,
            expiration: isSet(object.expiration) ? String(object.expiration) : "",
            operations: Array.isArray(object === null || object === void 0 ? void 0 : object.operations) ? object.operations.map((e) => operation.fromJSON(e)) : [],
            extensions: Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a, _b;
        const obj = {};
        if (message.ref_block_num !== 0) {
            obj.ref_block_num = Math.round(message.ref_block_num);
        }
        if (message.ref_block_prefix !== 0) {
            obj.ref_block_prefix = Math.round(message.ref_block_prefix);
        }
        if (message.expiration !== "") {
            obj.expiration = message.expiration;
        }
        if ((_a = message.operations) === null || _a === void 0 ? void 0 : _a.length) {
            obj.operations = message.operations.map((e) => operation.toJSON(e));
        }
        if ((_b = message.extensions) === null || _b === void 0 ? void 0 : _b.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return transaction.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBasetransaction();
        message.ref_block_num = (_a = object.ref_block_num) !== null && _a !== void 0 ? _a : 0;
        message.ref_block_prefix = (_b = object.ref_block_prefix) !== null && _b !== void 0 ? _b : 0;
        message.expiration = (_c = object.expiration) !== null && _c !== void 0 ? _c : "";
        message.operations = ((_d = object.operations) === null || _d === void 0 ? void 0 : _d.map((e) => operation.fromPartial(e))) || [];
        message.extensions = ((_e = object.extensions) === null || _e === void 0 ? void 0 : _e.map((e) => future_extensions.fromPartial(e))) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
