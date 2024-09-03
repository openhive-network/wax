/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasevoid_t() {
    return {};
}
export const void_t = {
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return void_t.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBasevoid_t();
        return message;
    },
};
function createBasefuture_extensions() {
    return {};
}
export const future_extensions = {
    fromJSON(object) {
        return { void_t: isSet(object.void_t) ? void_t.fromJSON(object.void_t) : undefined };
    },
    toJSON(message) {
        const obj = {};
        if (message.void_t !== undefined) {
            obj.void_t = void_t.toJSON(message.void_t);
        }
        return obj;
    },
    create(base) {
        return future_extensions.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBasefuture_extensions();
        message.void_t = (object.void_t !== undefined && object.void_t !== null)
            ? void_t.fromPartial(object.void_t)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
