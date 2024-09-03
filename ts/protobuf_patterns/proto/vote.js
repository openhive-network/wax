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
        return vote.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBasevote();
        message.voter = (_a = object.voter) !== null && _a !== void 0 ? _a : "";
        message.author = (_b = object.author) !== null && _b !== void 0 ? _b : "";
        message.permlink = (_c = object.permlink) !== null && _c !== void 0 ? _c : "";
        message.weight = (_d = object.weight) !== null && _d !== void 0 ? _d : 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
