/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasecustom_json() {
    return { required_auths: [], required_posting_auths: [], id: "", json: "" };
}
export const custom_json = {
    fromJSON(object) {
        return {
            required_auths: globalThis.Array.isArray(object?.required_auths)
                ? object.required_auths.map((e) => globalThis.String(e))
                : [],
            required_posting_auths: globalThis.Array.isArray(object?.required_posting_auths)
                ? object.required_posting_auths.map((e) => globalThis.String(e))
                : [],
            id: isSet(object.id) ? globalThis.String(object.id) : "",
            json: isSet(object.json) ? globalThis.String(object.json) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.required_auths?.length) {
            obj.required_auths = message.required_auths;
        }
        if (message.required_posting_auths?.length) {
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
        return custom_json.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasecustom_json();
        message.required_auths = object.required_auths?.map((e) => e) || [];
        message.required_posting_auths = object.required_posting_auths?.map((e) => e) || [];
        message.id = object.id ?? "";
        message.json = object.json ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
