/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { authority } from "./authority.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseaccount_update() {
    return { account: "", owner: undefined, active: undefined, posting: undefined, memo_key: "", json_metadata: "" };
}
export const account_update = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account !== "") {
            writer.uint32(10).string(message.account);
        }
        if (message.owner !== undefined) {
            authority.encode(message.owner, writer.uint32(18).fork()).ldelim();
        }
        if (message.active !== undefined) {
            authority.encode(message.active, writer.uint32(26).fork()).ldelim();
        }
        if (message.posting !== undefined) {
            authority.encode(message.posting, writer.uint32(34).fork()).ldelim();
        }
        if (message.memo_key !== "") {
            writer.uint32(42).string(message.memo_key);
        }
        if (message.json_metadata !== "") {
            writer.uint32(50).string(message.json_metadata);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseaccount_update();
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
                    if (tag !== 18) {
                        break;
                    }
                    message.owner = authority.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.active = authority.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.posting = authority.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.memo_key = reader.string();
                    continue;
                case 6:
                    if (tag !== 50) {
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
            account: isSet(object.account) ? String(object.account) : "",
            owner: isSet(object.owner) ? authority.fromJSON(object.owner) : undefined,
            active: isSet(object.active) ? authority.fromJSON(object.active) : undefined,
            posting: isSet(object.posting) ? authority.fromJSON(object.posting) : undefined,
            memo_key: isSet(object.memo_key) ? String(object.memo_key) : "",
            json_metadata: isSet(object.json_metadata) ? String(object.json_metadata) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== "") {
            obj.account = message.account;
        }
        if (message.owner !== undefined) {
            obj.owner = authority.toJSON(message.owner);
        }
        if (message.active !== undefined) {
            obj.active = authority.toJSON(message.active);
        }
        if (message.posting !== undefined) {
            obj.posting = authority.toJSON(message.posting);
        }
        if (message.memo_key !== "") {
            obj.memo_key = message.memo_key;
        }
        if (message.json_metadata !== "") {
            obj.json_metadata = message.json_metadata;
        }
        return obj;
    },
    create(base) {
        return account_update.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseaccount_update();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.owner = (object.owner !== undefined && object.owner !== null)
            ? authority.fromPartial(object.owner)
            : undefined;
        message.active = (object.active !== undefined && object.active !== null)
            ? authority.fromPartial(object.active)
            : undefined;
        message.posting = (object.posting !== undefined && object.posting !== null)
            ? authority.fromPartial(object.posting)
            : undefined;
        message.memo_key = (_b = object.memo_key) !== null && _b !== void 0 ? _b : "";
        message.json_metadata = (_c = object.json_metadata) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
