/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseaccount_create_with_delegation() {
    return {
        fee: undefined,
        delegation: undefined,
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
export const account_create_with_delegation = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.fee !== undefined) {
            asset.encode(message.fee, writer.uint32(10).fork()).ldelim();
        }
        if (message.delegation !== undefined) {
            asset.encode(message.delegation, writer.uint32(18).fork()).ldelim();
        }
        if (message.creator !== "") {
            writer.uint32(26).string(message.creator);
        }
        if (message.new_account_name !== "") {
            writer.uint32(34).string(message.new_account_name);
        }
        if (message.owner !== undefined) {
            authority.encode(message.owner, writer.uint32(42).fork()).ldelim();
        }
        if (message.active !== undefined) {
            authority.encode(message.active, writer.uint32(50).fork()).ldelim();
        }
        if (message.posting !== undefined) {
            authority.encode(message.posting, writer.uint32(58).fork()).ldelim();
        }
        if (message.memo_key !== "") {
            writer.uint32(66).string(message.memo_key);
        }
        if (message.json_metadata !== "") {
            writer.uint32(74).string(message.json_metadata);
        }
        for (const v of message.extensions) {
            future_extensions.encode(v, writer.uint32(82).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseaccount_create_with_delegation();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.fee = asset.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.delegation = asset.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.creator = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.new_account_name = reader.string();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.owner = authority.decode(reader, reader.uint32());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.active = authority.decode(reader, reader.uint32());
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.posting = authority.decode(reader, reader.uint32());
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.memo_key = reader.string();
                    continue;
                case 9:
                    if (tag !== 74) {
                        break;
                    }
                    message.json_metadata = reader.string();
                    continue;
                case 10:
                    if (tag !== 82) {
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
            fee: isSet(object.fee) ? asset.fromJSON(object.fee) : undefined,
            delegation: isSet(object.delegation) ? asset.fromJSON(object.delegation) : undefined,
            creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
            new_account_name: isSet(object.new_account_name) ? globalThis.String(object.new_account_name) : "",
            owner: isSet(object.owner) ? authority.fromJSON(object.owner) : undefined,
            active: isSet(object.active) ? authority.fromJSON(object.active) : undefined,
            posting: isSet(object.posting) ? authority.fromJSON(object.posting) : undefined,
            memo_key: isSet(object.memo_key) ? globalThis.String(object.memo_key) : "",
            json_metadata: isSet(object.json_metadata) ? globalThis.String(object.json_metadata) : "",
            extensions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.fee !== undefined) {
            obj.fee = asset.toJSON(message.fee);
        }
        if (message.delegation !== undefined) {
            obj.delegation = asset.toJSON(message.delegation);
        }
        if (message.creator !== undefined) {
            obj.creator = message.creator;
        }
        if (message.new_account_name !== undefined) {
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
        if (message.memo_key !== undefined) {
            obj.memo_key = message.memo_key;
        }
        if (message.json_metadata !== undefined) {
            obj.json_metadata = message.json_metadata;
        }
        if ((_a = message.extensions) === null || _a === void 0 ? void 0 : _a.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return account_create_with_delegation.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseaccount_create_with_delegation();
        message.fee = (object.fee !== undefined && object.fee !== null) ? asset.fromPartial(object.fee) : undefined;
        message.delegation = (object.delegation !== undefined && object.delegation !== null)
            ? asset.fromPartial(object.delegation)
            : undefined;
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
