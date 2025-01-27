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
        return expired_account_notification.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseexpired_account_notification();
        message.account = object.account ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
