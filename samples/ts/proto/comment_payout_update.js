/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecomment_payout_update() {
    return { author: "", permlink: "" };
}
export const comment_payout_update = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.author !== "") {
            writer.uint32(10).string(message.author);
        }
        if (message.permlink !== "") {
            writer.uint32(18).string(message.permlink);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecomment_payout_update();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.author = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.permlink = reader.string();
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
            author: isSet(object.author) ? String(object.author) : "",
            permlink: isSet(object.permlink) ? String(object.permlink) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.author !== "") {
            obj.author = message.author;
        }
        if (message.permlink !== "") {
            obj.permlink = message.permlink;
        }
        return obj;
    },
    create(base) {
        return comment_payout_update.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasecomment_payout_update();
        message.author = (_a = object.author) !== null && _a !== void 0 ? _a : "";
        message.permlink = (_b = object.permlink) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
