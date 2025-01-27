/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasecomment_payout_update() {
    return { author: "", permlink: "" };
}
export const comment_payout_update = {
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
        return comment_payout_update.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasecomment_payout_update();
        message.author = object.author ?? "";
        message.permlink = object.permlink ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
