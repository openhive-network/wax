/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasecustom() {
    return { required_auths: [], id: 0, data: "" };
}
export const custom = {
    fromJSON(object) {
        return {
            required_auths: globalThis.Array.isArray(object?.required_auths)
                ? object.required_auths.map((e) => globalThis.String(e))
                : [],
            id: isSet(object.id) ? globalThis.Number(object.id) : 0,
            data: isSet(object.data) ? globalThis.String(object.data) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.required_auths?.length) {
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
        return custom.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasecustom();
        message.required_auths = object.required_auths?.map((e) => e) || [];
        message.id = object.id ?? 0;
        message.data = object.data ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
