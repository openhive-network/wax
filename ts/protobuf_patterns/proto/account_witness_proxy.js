/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaseaccount_witness_proxy() {
    return { account: "", proxy: "" };
}
export const account_witness_proxy = {
    fromJSON(object) {
        return {
            account: isSet(object.account) ? globalThis.String(object.account) : "",
            proxy: isSet(object.proxy) ? globalThis.String(object.proxy) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        if (message.proxy !== undefined) {
            obj.proxy = message.proxy;
        }
        return obj;
    },
    create(base) {
        return account_witness_proxy.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseaccount_witness_proxy();
        message.account = object.account ?? "";
        message.proxy = object.proxy ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
