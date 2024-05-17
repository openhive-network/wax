/* eslint-disable */
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasechange_recovery_account() {
    return { account_to_recover: "", new_recovery_account: "", extensions: [] };
}
export const change_recovery_account = {
    fromJSON(object) {
        return {
            account_to_recover: isSet(object.account_to_recover) ? globalThis.String(object.account_to_recover) : "",
            new_recovery_account: isSet(object.new_recovery_account) ? globalThis.String(object.new_recovery_account) : "",
            extensions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
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
