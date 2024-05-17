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
        return account_witness_proxy.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseaccount_witness_proxy();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.proxy = (_b = object.proxy) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
