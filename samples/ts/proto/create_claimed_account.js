/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecreate_claimed_account() {
    return {
        creator: "",
        new_account_name: "",
        owner: undefined,
        active: undefined,
        posting: undefined,
        memo_key: "",
        json_metadata: "",
        extensions: [],
    };
}
export const create_claimed_account = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.creator !== "") {
            writer.uint32(10).string(message.creator);
        }
        if (message.new_account_name !== "") {
            writer.uint32(18).string(message.new_account_name);
        }
        if (message.owner !== undefined) {
            authority.encode(message.owner, writer.uint32(26).fork()).ldelim();
        }
        if (message.active !== undefined) {
            authority.encode(message.active, writer.uint32(34).fork()).ldelim();
        }
        if (message.posting !== undefined) {
            authority.encode(message.posting, writer.uint32(42).fork()).ldelim();
        }
        if (message.memo_key !== "") {
            writer.uint32(50).string(message.memo_key);
        }
        if (message.json_metadata !== "") {
            writer.uint32(58).string(message.json_metadata);
        }
        for (const v of message.extensions) {
            future_extensions.encode(v, writer.uint32(66).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecreate_claimed_account();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.creator = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.new_account_name = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.owner = authority.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.active = authority.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.posting = authority.decode(reader, reader.uint32());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.memo_key = reader.string();
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.json_metadata = reader.string();
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.extensions.push(future_extensions.decode(reader, reader.uint32()));
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
            creator: isSet(object.creator) ? String(object.creator) : "",
            new_account_name: isSet(object.new_account_name) ? String(object.new_account_name) : "",
            owner: isSet(object.owner) ? authority.fromJSON(object.owner) : undefined,
            active: isSet(object.active) ? authority.fromJSON(object.active) : undefined,
            posting: isSet(object.posting) ? authority.fromJSON(object.posting) : undefined,
            memo_key: isSet(object.memo_key) ? String(object.memo_key) : "",
            json_metadata: isSet(object.json_metadata) ? String(object.json_metadata) : "",
            extensions: Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.creator !== "") {
            obj.creator = message.creator;
        }
        if (message.new_account_name !== "") {
            obj.new_account_name = message.new_account_name;
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
        if ((_a = message.extensions) === null || _a === void 0 ? void 0 : _a.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return create_claimed_account.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBasecreate_claimed_account();
        message.creator = (_a = object.creator) !== null && _a !== void 0 ? _a : "";
        message.new_account_name = (_b = object.new_account_name) !== null && _b !== void 0 ? _b : "";
        message.owner = (object.owner !== undefined && object.owner !== null)
            ? authority.fromPartial(object.owner)
            : undefined;
        message.active = (object.active !== undefined && object.active !== null)
            ? authority.fromPartial(object.active)
            : undefined;
        message.posting = (object.posting !== undefined && object.posting !== null)
            ? authority.fromPartial(object.posting)
            : undefined;
        message.memo_key = (_c = object.memo_key) !== null && _c !== void 0 ? _c : "";
        message.json_metadata = (_d = object.json_metadata) !== null && _d !== void 0 ? _d : "";
        message.extensions = ((_e = object.extensions) === null || _e === void 0 ? void 0 : _e.map((e) => future_extensions.fromPartial(e))) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
