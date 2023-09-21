/* eslint-disable */
import * as _m0 from "protobufjs/minimal.js";
import { account_create } from "./account_create.js";
import { comment } from "./comment.js";
import { future_extensions } from "./future_extensions.js";
import { limit_order_cancel } from "./limit_order_cancel.js";
import { recurrent_transfer } from "./recurrent_transfer.js";
import { transfer } from "./transfer.js";
import { vote } from "./vote.js";
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
        if (message.limit_order_cancel !== undefined) {
            limit_order_cancel.encode(message.limit_order_cancel, writer.uint32(58).fork()).ldelim();
        }
        if (message.account_create !== undefined) {
            account_create.encode(message.account_create, writer.uint32(82).fork()).ldelim();
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
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.limit_order_cancel = limit_order_cancel.decode(reader, reader.uint32());
                    continue;
                case 10:
                    if (tag !== 82) {
                        break;
                    }
                    message.account_create = account_create.decode(reader, reader.uint32());
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
            limit_order_cancel: isSet(object.limit_order_cancel)
                ? limit_order_cancel.fromJSON(object.limit_order_cancel)
                : undefined,
            account_create: isSet(object.account_create) ? account_create.fromJSON(object.account_create) : undefined,
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
        if (message.limit_order_cancel !== undefined) {
            obj.limit_order_cancel = limit_order_cancel.toJSON(message.limit_order_cancel);
        }
        if (message.account_create !== undefined) {
            obj.account_create = account_create.toJSON(message.account_create);
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
        message.limit_order_cancel = (object.limit_order_cancel !== undefined && object.limit_order_cancel !== null)
            ? limit_order_cancel.fromPartial(object.limit_order_cancel)
            : undefined;
        message.account_create = (object.account_create !== undefined && object.account_create !== null)
            ? account_create.fromPartial(object.account_create)
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
