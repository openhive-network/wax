/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaserequest_account_recovery() {
    return { recovery_account: "", account_to_recover: "", new_owner_authority: undefined, extensions: [] };
}
export const request_account_recovery = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.recovery_account !== "") {
            writer.uint32(10).string(message.recovery_account);
        }
        if (message.account_to_recover !== "") {
            writer.uint32(18).string(message.account_to_recover);
        }
        if (message.new_owner_authority !== undefined) {
            authority.encode(message.new_owner_authority, writer.uint32(26).fork()).ldelim();
        }
        for (const v of message.extensions) {
            future_extensions.encode(v, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaserequest_account_recovery();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.recovery_account = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.account_to_recover = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.new_owner_authority = authority.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
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
            recovery_account: isSet(object.recovery_account) ? String(object.recovery_account) : "",
            account_to_recover: isSet(object.account_to_recover) ? String(object.account_to_recover) : "",
            new_owner_authority: isSet(object.new_owner_authority)
                ? authority.fromJSON(object.new_owner_authority)
                : undefined,
            extensions: Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.recovery_account !== "") {
            obj.recovery_account = message.recovery_account;
        }
        if (message.account_to_recover !== "") {
            obj.account_to_recover = message.account_to_recover;
        }
        if (message.new_owner_authority !== undefined) {
            obj.new_owner_authority = authority.toJSON(message.new_owner_authority);
        }
        if ((_a = message.extensions) === null || _a === void 0 ? void 0 : _a.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return request_account_recovery.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaserequest_account_recovery();
        message.recovery_account = (_a = object.recovery_account) !== null && _a !== void 0 ? _a : "";
        message.account_to_recover = (_b = object.account_to_recover) !== null && _b !== void 0 ? _b : "";
        message.new_owner_authority = (object.new_owner_authority !== undefined && object.new_owner_authority !== null)
            ? authority.fromPartial(object.new_owner_authority)
            : undefined;
        message.extensions = ((_c = object.extensions) === null || _c === void 0 ? void 0 : _c.map((e) => future_extensions.fromPartial(e))) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
