/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasefailed_recurrent_transfer() {
    return {
        from_account: "",
        to_account: "",
        amount: undefined,
        memo: "",
        consecutive_failures: 0,
        remaining_executions: 0,
        deleted: false,
    };
}
export const failed_recurrent_transfer = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.from_account !== "") {
            writer.uint32(10).string(message.from_account);
        }
        if (message.to_account !== "") {
            writer.uint32(18).string(message.to_account);
        }
        if (message.amount !== undefined) {
            asset.encode(message.amount, writer.uint32(26).fork()).ldelim();
        }
        if (message.memo !== "") {
            writer.uint32(34).string(message.memo);
        }
        if (message.consecutive_failures !== 0) {
            writer.uint32(40).uint32(message.consecutive_failures);
        }
        if (message.remaining_executions !== 0) {
            writer.uint32(48).uint32(message.remaining_executions);
        }
        if (message.deleted !== false) {
            writer.uint32(56).bool(message.deleted);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasefailed_recurrent_transfer();
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
                    if (tag !== 18) {
                        break;
                    }
                    message.to_account = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.amount = asset.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.memo = reader.string();
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.consecutive_failures = reader.uint32();
                    continue;
                case 6:
                    if (tag !== 48) {
                        break;
                    }
                    message.remaining_executions = reader.uint32();
                    continue;
                case 7:
                    if (tag !== 56) {
                        break;
                    }
                    message.deleted = reader.bool();
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
            from_account: isSet(object.from) ? globalThis.String(object.from) : "",
            to_account: isSet(object.to) ? globalThis.String(object.to) : "",
            amount: isSet(object.amount) ? asset.fromJSON(object.amount) : undefined,
            memo: isSet(object.memo) ? globalThis.String(object.memo) : "",
            consecutive_failures: isSet(object.consecutive_failures) ? globalThis.Number(object.consecutive_failures) : 0,
            remaining_executions: isSet(object.remaining_executions) ? globalThis.Number(object.remaining_executions) : 0,
            deleted: isSet(object.deleted) ? globalThis.Boolean(object.deleted) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.from_account !== undefined) {
            obj.from = message.from_account;
        }
        if (message.to_account !== undefined) {
            obj.to = message.to_account;
        }
        if (message.amount !== undefined) {
            obj.amount = asset.toJSON(message.amount);
        }
        if (message.memo !== undefined) {
            obj.memo = message.memo;
        }
        if (message.consecutive_failures !== undefined) {
            obj.consecutive_failures = Math.round(message.consecutive_failures);
        }
        if (message.remaining_executions !== undefined) {
            obj.remaining_executions = Math.round(message.remaining_executions);
        }
        if (message.deleted !== undefined) {
            obj.deleted = message.deleted;
        }
        return obj;
    },
    create(base) {
        return failed_recurrent_transfer.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBasefailed_recurrent_transfer();
        message.from_account = (_a = object.from_account) !== null && _a !== void 0 ? _a : "";
        message.to_account = (_b = object.to_account) !== null && _b !== void 0 ? _b : "";
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? asset.fromPartial(object.amount)
            : undefined;
        message.memo = (_c = object.memo) !== null && _c !== void 0 ? _c : "";
        message.consecutive_failures = (_d = object.consecutive_failures) !== null && _d !== void 0 ? _d : 0;
        message.remaining_executions = (_e = object.remaining_executions) !== null && _e !== void 0 ? _e : 0;
        message.deleted = (_f = object.deleted) !== null && _f !== void 0 ? _f : false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
