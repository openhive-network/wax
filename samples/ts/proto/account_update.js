/* eslint-disable */
import { authority } from "./authority.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseaccount_update() {
    return { account: "", memo_key: "", json_metadata: "" };
}
export const account_update = {
    fromJSON(object) {
        return {
            account: isSet(object.account) ? globalThis.String(object.account) : "",
            owner: isSet(object.owner) ? authority.fromJSON(object.owner) : undefined,
            active: isSet(object.active) ? authority.fromJSON(object.active) : undefined,
            posting: isSet(object.posting) ? authority.fromJSON(object.posting) : undefined,
            memo_key: isSet(object.memo_key) ? globalThis.String(object.memo_key) : "",
            json_metadata: isSet(object.json_metadata) ? globalThis.String(object.json_metadata) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
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
        if (message.memo_key !== undefined) {
            obj.memo_key = message.memo_key;
        }
        if (message.json_metadata !== undefined) {
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
