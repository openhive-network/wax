/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasedecline_voting_rights() {
    return { account: "", decline: false };
}
export const decline_voting_rights = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account !== "") {
            writer.uint32(10).string(message.account);
        }
        if (message.decline !== false) {
            writer.uint32(16).bool(message.decline);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasedecline_voting_rights();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.account = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.decline = reader.bool();
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
            account: isSet(object.account) ? globalThis.String(object.account) : "",
            decline: isSet(object.decline) ? globalThis.Boolean(object.decline) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        if (message.decline !== undefined) {
            obj.decline = message.decline;
        }
        return obj;
    },
    create(base) {
        return decline_voting_rights.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasedecline_voting_rights();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.decline = (_b = object.decline) !== null && _b !== void 0 ? _b : false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
