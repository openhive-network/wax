/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasechanged_recovery_account() {
    return { account: "", old_recovery_account: "", new_recovery_account: "" };
}
export const changed_recovery_account = {
    fromJSON(object) {
        return {
            account: isSet(object.account) ? globalThis.String(object.account) : "",
            old_recovery_account: isSet(object.old_recovery_account) ? globalThis.String(object.old_recovery_account) : "",
            new_recovery_account: isSet(object.new_recovery_account) ? globalThis.String(object.new_recovery_account) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        if (message.old_recovery_account !== undefined) {
            obj.old_recovery_account = message.old_recovery_account;
        }
        if (message.new_recovery_account !== undefined) {
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
