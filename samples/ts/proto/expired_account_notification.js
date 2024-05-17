/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaseexpired_account_notification() {
    return { account: "" };
}
export const expired_account_notification = {
    fromJSON(object) {
        return { account: isSet(object.account) ? globalThis.String(object.account) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        return obj;
    },
    create(base) {
        return expired_account_notification.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseexpired_account_notification();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
