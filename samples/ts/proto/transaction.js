/* eslint-disable */
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
