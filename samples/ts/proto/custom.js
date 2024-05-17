/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasecustom() {
    return { required_auths: [], id: 0, data: "" };
}
export const custom = {
    fromJSON(object) {
        return {
            required_auths: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.required_auths)
                ? object.required_auths.map((e) => globalThis.String(e))
                : [],
            id: isSet(object.id) ? globalThis.Number(object.id) : 0,
            data: isSet(object.data) ? globalThis.String(object.data) : "",
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if ((_a = message.required_auths) === null || _a === void 0 ? void 0 : _a.length) {
            obj.required_auths = message.required_auths;
        }
        if (message.id !== undefined) {
            obj.id = Math.round(message.id);
        }
        if (message.data !== undefined) {
            obj.data = message.data;
        }
        return obj;
    },
    create(base) {
        return custom.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasecustom();
        message.required_auths = ((_a = object.required_auths) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        message.id = (_b = object.id) !== null && _b !== void 0 ? _b : 0;
        message.data = (_c = object.data) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
