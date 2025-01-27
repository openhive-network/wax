/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaseineffective_delete_comment() {
    return { author: "", permlink: "" };
}
export const ineffective_delete_comment = {
    fromJSON(object) {
        return {
            author: isSet(object.author) ? globalThis.String(object.author) : "",
            permlink: isSet(object.permlink) ? globalThis.String(object.permlink) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.author !== undefined) {
            obj.author = message.author;
        }
        if (message.permlink !== undefined) {
            obj.permlink = message.permlink;
        }
        return obj;
    },
    create(base) {
        return ineffective_delete_comment.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseineffective_delete_comment();
        message.author = object.author ?? "";
        message.permlink = object.permlink ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
