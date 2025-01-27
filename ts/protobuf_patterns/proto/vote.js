/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasevote() {
    return { voter: "", author: "", permlink: "", weight: 0 };
}
export const vote = {
    fromJSON(object) {
        return {
            voter: isSet(object.voter) ? globalThis.String(object.voter) : "",
            author: isSet(object.author) ? globalThis.String(object.author) : "",
            permlink: isSet(object.permlink) ? globalThis.String(object.permlink) : "",
            weight: isSet(object.weight) ? globalThis.Number(object.weight) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.voter !== undefined) {
            obj.voter = message.voter;
        }
        if (message.author !== undefined) {
            obj.author = message.author;
        }
        if (message.permlink !== undefined) {
            obj.permlink = message.permlink;
        }
        if (message.weight !== undefined) {
            obj.weight = Math.round(message.weight);
        }
        return obj;
    },
    create(base) {
        return vote.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasevote();
        message.voter = object.voter ?? "";
        message.author = object.author ?? "";
        message.permlink = object.permlink ?? "";
        message.weight = object.weight ?? 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
