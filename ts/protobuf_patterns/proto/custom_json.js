/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasecustom_json() {
    return { required_auths: [], required_posting_auths: [], id: "", json: "" };
}
export const custom_json = {
    fromJSON(object) {
        return {
            required_auths: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.required_auths)
                ? object.required_auths.map((e) => globalThis.String(e))
                : [],
            required_posting_auths: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.required_posting_auths)
                ? object.required_posting_auths.map((e) => globalThis.String(e))
                : [],
            id: isSet(object.id) ? globalThis.String(object.id) : "",
            json: isSet(object.json) ? globalThis.String(object.json) : "",
        };
    },
    toJSON(message) {
        var _a, _b;
        const obj = {};
        if ((_a = message.required_auths) === null || _a === void 0 ? void 0 : _a.length) {
            obj.required_auths = message.required_auths;
        }
        if ((_b = message.required_posting_auths) === null || _b === void 0 ? void 0 : _b.length) {
            obj.required_posting_auths = message.required_posting_auths;
        }
        if (message.id !== undefined) {
            obj.id = message.id;
        }
        if (message.json !== undefined) {
            obj.json = message.json;
        }
        return obj;
    },
    create(base) {
        return custom_json.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBasecustom_json();
        message.required_auths = ((_a = object.required_auths) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        message.required_posting_auths = ((_b = object.required_posting_auths) === null || _b === void 0 ? void 0 : _b.map((e) => e)) || [];
        message.id = (_c = object.id) !== null && _c !== void 0 ? _c : "";
        message.json = (_d = object.json) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
