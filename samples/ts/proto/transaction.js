import * as _m0 from "protobufjs/minimal.js";
import { comment } from "./comment.js";
import { limit_order_cancel } from "./limit_order_cancel.js";
import { recurrent_transfer } from "./recurrent_transfer.js";
import { vote } from "./vote.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseoperation() {
    return {};
}
export const operation = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.comment !== undefined) {
            comment.encode(message.comment, writer.uint32(122).fork()).ldelim();
        }
        if (message.vote !== undefined) {
            vote.encode(message.vote, writer.uint32(130).fork()).ldelim();
        }
        if (message.limit_order_cancel !== undefined) {
            limit_order_cancel.encode(message.limit_order_cancel, writer.uint32(138).fork()).ldelim();
        }
        if (message.recurrent_transfer !== undefined) {
            recurrent_transfer.encode(message.recurrent_transfer, writer.uint32(146).fork()).ldelim();
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
                case 15:
                    if (tag !== 122) {
                        break;
                    }
                    message.comment = comment.decode(reader, reader.uint32());
                    continue;
                case 16:
                    if (tag !== 130) {
                        break;
                    }
                    message.vote = vote.decode(reader, reader.uint32());
                    continue;
                case 17:
                    if (tag !== 138) {
                        break;
                    }
                    message.limit_order_cancel = limit_order_cancel.decode(reader, reader.uint32());
                    continue;
                case 18:
                    if (tag !== 146) {
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
            comment: isSet(object.comment) ? comment.fromJSON(object.comment) : undefined,
            vote: isSet(object.vote) ? vote.fromJSON(object.vote) : undefined,
            limit_order_cancel: isSet(object.limit_order_cancel)
                ? limit_order_cancel.fromJSON(object.limit_order_cancel)
                : undefined,
            recurrent_transfer: isSet(object.recurrent_transfer)
                ? recurrent_transfer.fromJSON(object.recurrent_transfer)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.comment !== undefined) {
            obj.comment = comment.toJSON(message.comment);
        }
        if (message.vote !== undefined) {
            obj.vote = vote.toJSON(message.vote);
        }
        if (message.limit_order_cancel !== undefined) {
            obj.limit_order_cancel = limit_order_cancel.toJSON(message.limit_order_cancel);
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
        message.comment = (object.comment !== undefined && object.comment !== null)
            ? comment.fromPartial(object.comment)
            : undefined;
        message.vote = (object.vote !== undefined && object.vote !== null) ? vote.fromPartial(object.vote) : undefined;
        message.limit_order_cancel = (object.limit_order_cancel !== undefined && object.limit_order_cancel !== null)
            ? limit_order_cancel.fromPartial(object.limit_order_cancel)
            : undefined;
        message.recurrent_transfer = (object.recurrent_transfer !== undefined && object.recurrent_transfer !== null)
            ? recurrent_transfer.fromPartial(object.recurrent_transfer)
            : undefined;
        return message;
    },
};
function createBasetransaction() {
    return { operations: [] };
}
export const transaction = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.operations) {
            operation.encode(v, writer.uint32(146).fork()).ldelim();
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
                case 18:
                    if (tag !== 146) {
                        break;
                    }
                    message.operations.push(operation.decode(reader, reader.uint32()));
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
            operations: Array.isArray(object === null || object === void 0 ? void 0 : object.operations) ? object.operations.map((e) => operation.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if ((_a = message.operations) === null || _a === void 0 ? void 0 : _a.length) {
            obj.operations = message.operations.map((e) => operation.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return transaction.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasetransaction();
        message.operations = ((_a = object.operations) === null || _a === void 0 ? void 0 : _a.map((e) => operation.fromPartial(e))) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
