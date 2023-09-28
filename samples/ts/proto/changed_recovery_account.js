/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasechanged_recovery_account() {
    return { account: "", old_recovery_account: "", new_recovery_account: "" };
}
export const changed_recovery_account = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account !== "") {
            writer.uint32(10).string(message.account);
        }
        if (message.old_recovery_account !== "") {
            writer.uint32(18).string(message.old_recovery_account);
        }
        if (message.new_recovery_account !== "") {
            writer.uint32(26).string(message.new_recovery_account);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasechanged_recovery_account();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.account = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.old_recovery_account = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.new_recovery_account = reader.string();
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
            account: isSet(object.account) ? String(object.account) : "",
            old_recovery_account: isSet(object.old_recovery_account) ? String(object.old_recovery_account) : "",
            new_recovery_account: isSet(object.new_recovery_account) ? String(object.new_recovery_account) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== "") {
            obj.account = message.account;
        }
        if (message.old_recovery_account !== "") {
            obj.old_recovery_account = message.old_recovery_account;
        }
        if (message.new_recovery_account !== "") {
            obj.new_recovery_account = message.new_recovery_account;
        }
        return obj;
    },
    create(base) {
        return changed_recovery_account.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasechanged_recovery_account();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.old_recovery_account = (_b = object.old_recovery_account) !== null && _b !== void 0 ? _b : "";
        message.new_recovery_account = (_c = object.new_recovery_account) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
