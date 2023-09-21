/* eslint-disable */
import * as _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasevote() {
    return { voter: "", author: "", permlink: "", weight: 0 };
}
export const vote = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.voter !== "") {
            writer.uint32(82).string(message.voter);
        }
        if (message.author !== "") {
            writer.uint32(90).string(message.author);
        }
        if (message.permlink !== "") {
            writer.uint32(98).string(message.permlink);
        }
        if (message.weight !== 0) {
            writer.uint32(104).uint32(message.weight);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasevote();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 10:
                    if (tag !== 82) {
                        break;
                    }
                    message.voter = reader.string();
                    continue;
                case 11:
                    if (tag !== 90) {
                        break;
                    }
                    message.author = reader.string();
                    continue;
                case 12:
                    if (tag !== 98) {
                        break;
                    }
                    message.permlink = reader.string();
                    continue;
                case 13:
                    if (tag !== 104) {
                        break;
                    }
                    message.weight = reader.uint32();
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
            voter: isSet(object.voter) ? String(object.voter) : "",
            author: isSet(object.author) ? String(object.author) : "",
            permlink: isSet(object.permlink) ? String(object.permlink) : "",
            weight: isSet(object.weight) ? Number(object.weight) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.voter !== "") {
            obj.voter = message.voter;
        }
        if (message.author !== "") {
            obj.author = message.author;
        }
        if (message.permlink !== "") {
            obj.permlink = message.permlink;
        }
        if (message.weight !== 0) {
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
