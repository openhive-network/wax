/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaserecover_account() {
    return { account_to_recover: "", new_owner_authority: undefined, recent_owner_authority: undefined, extensions: [] };
}
export const recover_account = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account_to_recover !== "") {
            writer.uint32(10).string(message.account_to_recover);
        }
        if (message.new_owner_authority !== undefined) {
            authority.encode(message.new_owner_authority, writer.uint32(18).fork()).ldelim();
        }
        if (message.recent_owner_authority !== undefined) {
            authority.encode(message.recent_owner_authority, writer.uint32(26).fork()).ldelim();
        }
        for (const v of message.extensions) {
            future_extensions.encode(v, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaserecover_account();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.account_to_recover = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.new_owner_authority = authority.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.recent_owner_authority = authority.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
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
            account_to_recover: isSet(object.account_to_recover) ? String(object.account_to_recover) : "",
            new_owner_authority: isSet(object.new_owner_authority)
                ? authority.fromJSON(object.new_owner_authority)
                : undefined,
            recent_owner_authority: isSet(object.recent_owner_authority)
                ? authority.fromJSON(object.recent_owner_authority)
                : undefined,
            extensions: Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.account_to_recover !== "") {
            obj.account_to_recover = message.account_to_recover;
        }
        if (message.new_owner_authority !== undefined) {
            obj.new_owner_authority = authority.toJSON(message.new_owner_authority);
        }
        if (message.recent_owner_authority !== undefined) {
            obj.recent_owner_authority = authority.toJSON(message.recent_owner_authority);
        }
        if ((_a = message.extensions) === null || _a === void 0 ? void 0 : _a.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return recover_account.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaserecover_account();
        message.account_to_recover = (_a = object.account_to_recover) !== null && _a !== void 0 ? _a : "";
        message.new_owner_authority = (object.new_owner_authority !== undefined && object.new_owner_authority !== null)
            ? authority.fromPartial(object.new_owner_authority)
            : undefined;
        message.recent_owner_authority =
            (object.recent_owner_authority !== undefined && object.recent_owner_authority !== null)
                ? authority.fromPartial(object.recent_owner_authority)
                : undefined;
        message.extensions = ((_b = object.extensions) === null || _b === void 0 ? void 0 : _b.map((e) => future_extensions.fromPartial(e))) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
