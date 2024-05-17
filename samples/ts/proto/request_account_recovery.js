/* eslint-disable */
import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaserequest_account_recovery() {
    return { recovery_account: "", account_to_recover: "", new_owner_authority: undefined, extensions: [] };
}
export const request_account_recovery = {
    fromJSON(object) {
        return {
            recovery_account: isSet(object.recovery_account) ? globalThis.String(object.recovery_account) : "",
            account_to_recover: isSet(object.account_to_recover) ? globalThis.String(object.account_to_recover) : "",
            new_owner_authority: isSet(object.new_owner_authority)
                ? authority.fromJSON(object.new_owner_authority)
                : undefined,
            extensions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.recovery_account !== undefined) {
            obj.recovery_account = message.recovery_account;
        }
        if (message.account_to_recover !== undefined) {
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
