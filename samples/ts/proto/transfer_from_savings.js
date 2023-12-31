/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasetransfer_from_savings() {
    return { from_account: "", request_id: 0, to_account: "", amount: undefined, memo: "" };
}
export const transfer_from_savings = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.from_account !== "") {
            writer.uint32(10).string(message.from_account);
        }
        if (message.request_id !== 0) {
            writer.uint32(16).uint32(message.request_id);
        }
        if (message.to_account !== "") {
            writer.uint32(26).string(message.to_account);
        }
        if (message.amount !== undefined) {
            asset.encode(message.amount, writer.uint32(34).fork()).ldelim();
        }
        if (message.memo !== "") {
            writer.uint32(42).string(message.memo);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasetransfer_from_savings();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.from_account = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.request_id = reader.uint32();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.to_account = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.amount = asset.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.memo = reader.string();
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
            from_account: isSet(object.from) ? String(object.from) : "",
            request_id: isSet(object.request_id) ? Number(object.request_id) : 0,
            to_account: isSet(object.to) ? String(object.to) : "",
            amount: isSet(object.amount) ? asset.fromJSON(object.amount) : undefined,
            memo: isSet(object.memo) ? String(object.memo) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.from_account !== "") {
            obj.from = message.from_account;
        }
        if (message.request_id !== 0) {
            obj.request_id = Math.round(message.request_id);
        }
        if (message.to_account !== "") {
            obj.to = message.to_account;
        }
        if (message.amount !== undefined) {
            obj.amount = asset.toJSON(message.amount);
        }
        if (message.memo !== "") {
            obj.memo = message.memo;
        }
        return obj;
    },
    create(base) {
        return transfer_from_savings.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBasetransfer_from_savings();
        message.from_account = (_a = object.from_account) !== null && _a !== void 0 ? _a : "";
        message.request_id = (_b = object.request_id) !== null && _b !== void 0 ? _b : 0;
        message.to_account = (_c = object.to_account) !== null && _c !== void 0 ? _c : "";
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? asset.fromPartial(object.amount)
            : undefined;
        message.memo = (_d = object.memo) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
