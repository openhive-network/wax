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
        return changed_recovery_account.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasechanged_recovery_account();
        message.account = object.account ?? "";
        message.old_recovery_account = object.old_recovery_account ?? "";
        message.new_recovery_account = object.new_recovery_account ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
