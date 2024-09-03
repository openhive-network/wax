/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasecomment() {
    return { parent_author: "", parent_permlink: "", author: "", permlink: "", title: "", body: "", json_metadata: "" };
}
export const comment = {
    fromJSON(object) {
        return {
            parent_author: isSet(object.parent_author) ? globalThis.String(object.parent_author) : "",
            parent_permlink: isSet(object.parent_permlink) ? globalThis.String(object.parent_permlink) : "",
            author: isSet(object.author) ? globalThis.String(object.author) : "",
            permlink: isSet(object.permlink) ? globalThis.String(object.permlink) : "",
            title: isSet(object.title) ? globalThis.String(object.title) : "",
            body: isSet(object.body) ? globalThis.String(object.body) : "",
            json_metadata: isSet(object.json_metadata) ? globalThis.String(object.json_metadata) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.parent_author !== undefined) {
            obj.parent_author = message.parent_author;
        }
        if (message.parent_permlink !== undefined) {
            obj.parent_permlink = message.parent_permlink;
        }
        if (message.author !== undefined) {
            obj.author = message.author;
        }
        if (message.permlink !== undefined) {
            obj.permlink = message.permlink;
        }
        if (message.title !== undefined) {
            obj.title = message.title;
        }
        if (message.body !== undefined) {
            obj.body = message.body;
        }
        if (message.json_metadata !== undefined) {
            obj.json_metadata = message.json_metadata;
        }
        return obj;
    },
    create(base) {
        return comment.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBasecomment();
        message.parent_author = (_a = object.parent_author) !== null && _a !== void 0 ? _a : "";
        message.parent_permlink = (_b = object.parent_permlink) !== null && _b !== void 0 ? _b : "";
        message.author = (_c = object.author) !== null && _c !== void 0 ? _c : "";
        message.permlink = (_d = object.permlink) !== null && _d !== void 0 ? _d : "";
        message.title = (_e = object.title) !== null && _e !== void 0 ? _e : "";
        message.body = (_f = object.body) !== null && _f !== void 0 ? _f : "";
        message.json_metadata = (_g = object.json_metadata) !== null && _g !== void 0 ? _g : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
