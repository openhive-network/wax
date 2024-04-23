/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasechange_recovery_account() {
    return { account_to_recover: "", new_recovery_account: "", extensions: [] };
}
export const change_recovery_account = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account_to_recover !== "") {
            writer.uint32(10).string(message.account_to_recover);
        }
        if (message.new_recovery_account !== "") {
            writer.uint32(18).string(message.new_recovery_account);
        }
        for (const v of message.extensions) {
            future_extensions.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasechange_recovery_account();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.account_to_recover = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.new_recovery_account = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
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
            account_to_recover: isSet(object.account_to_recover) ? String(object.account_to_recover) : "",
            new_recovery_account: isSet(object.new_recovery_account) ? String(object.new_recovery_account) : "",
            extensions: Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.account_to_recover !== undefined) {
            obj.account_to_recover = message.account_to_recover;
        }
        if (message.new_recovery_account !== undefined) {
            obj.new_recovery_account = message.new_recovery_account;
        }
        if ((_a = message.extensions) === null || _a === void 0 ? void 0 : _a.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return change_recovery_account.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasechange_recovery_account();
        message.account_to_recover = (_a = object.account_to_recover) !== null && _a !== void 0 ? _a : "";
        message.new_recovery_account = (_b = object.new_recovery_account) !== null && _b !== void 0 ? _b : "";
        message.extensions = ((_c = object.extensions) === null || _c === void 0 ? void 0 : _c.map((e) => future_extensions.fromPartial(e))) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
