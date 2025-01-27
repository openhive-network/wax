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
        return proxy_cleared.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseproxy_cleared();
        message.account = object.account ?? "";
        message.proxy = object.proxy ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
