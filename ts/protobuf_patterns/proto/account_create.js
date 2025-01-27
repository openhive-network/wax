/* eslint-disable */
import { asset } from "./asset.js";
import { authority } from "./authority.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseaccount_create() {
    return {
        fee: undefined,
        creator: "",
        new_account_name: "",
        owner: undefined,
        active: undefined,
        posting: undefined,
        memo_key: "",
        json_metadata: "",
    };
}
export const account_create = {
    fromJSON(object) {
        return {
            fee: isSet(object.fee) ? asset.fromJSON(object.fee) : undefined,
            creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
            new_account_name: isSet(object.new_account_name) ? globalThis.String(object.new_account_name) : "",
            owner: isSet(object.owner) ? authority.fromJSON(object.owner) : undefined,
            active: isSet(object.active) ? authority.fromJSON(object.active) : undefined,
            posting: isSet(object.posting) ? authority.fromJSON(object.posting) : undefined,
            memo_key: isSet(object.memo_key) ? globalThis.String(object.memo_key) : "",
            json_metadata: isSet(object.json_metadata) ? globalThis.String(object.json_metadata) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.fee !== undefined) {
            obj.fee = asset.toJSON(message.fee);
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
        return obj;
    },
    create(base) {
        return account_create.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseaccount_create();
        message.fee = (object.fee !== undefined && object.fee !== null) ? asset.fromPartial(object.fee) : undefined;
        message.creator = object.creator ?? "";
        message.new_account_name = object.new_account_name ?? "";
        message.owner = (object.owner !== undefined && object.owner !== null)
            ? authority.fromPartial(object.owner)
            : undefined;
        message.active = (object.active !== undefined && object.active !== null)
            ? authority.fromPartial(object.active)
            : undefined;
        message.posting = (object.posting !== undefined && object.posting !== null)
            ? authority.fromPartial(object.posting)
            : undefined;
        message.memo_key = object.memo_key ?? "";
        message.json_metadata = object.json_metadata ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
