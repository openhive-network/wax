import * as _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecomment() {
    return { parent_author: "", parent_permlink: "", author: "", permlink: "", title: "", body: "", json_metadata: "" };
}
export const comment = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.parent_author !== "") {
            writer.uint32(10).string(message.parent_author);
        }
        if (message.parent_permlink !== "") {
            writer.uint32(18).string(message.parent_permlink);
        }
        if (message.author !== "") {
            writer.uint32(26).string(message.author);
        }
        if (message.permlink !== "") {
            writer.uint32(34).string(message.permlink);
        }
        if (message.title !== "") {
            writer.uint32(42).string(message.title);
        }
        if (message.body !== "") {
            writer.uint32(50).string(message.body);
        }
        if (message.json_metadata !== "") {
            writer.uint32(58).string(message.json_metadata);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecomment();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.parent_author = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.parent_permlink = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.author = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.permlink = reader.string();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.title = reader.string();
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.body = reader.string();
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.json_metadata = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            parent_author: isSet(object.parent_author) ? String(object.parent_author) : "",
            parent_permlink: isSet(object.parent_permlink) ? String(object.parent_permlink) : "",
            author: isSet(object.author) ? String(object.author) : "",
            permlink: isSet(object.permlink) ? String(object.permlink) : "",
            title: isSet(object.title) ? String(object.title) : "",
            body: isSet(object.body) ? String(object.body) : "",
            json_metadata: isSet(object.json_metadata) ? String(object.json_metadata) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.parent_author !== "") {
            obj.parent_author = message.parent_author;
        }
        if (message.parent_permlink !== "") {
            obj.parent_permlink = message.parent_permlink;
        }
        if (message.author !== "") {
            obj.author = message.author;
        }
        if (message.permlink !== "") {
            obj.permlink = message.permlink;
        }
        if (message.title !== "") {
            obj.title = message.title;
        }
        if (message.body !== "") {
            obj.body = message.body;
        }
        if (message.json_metadata !== "") {
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
