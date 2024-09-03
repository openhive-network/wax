/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaseproxy_cleared() {
    return { account: "", proxy: "" };
}
export const proxy_cleared = {
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
        return proxy_cleared.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseproxy_cleared();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.proxy = (_b = object.proxy) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
