/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseaccount_created() {
    return { new_account_name: "", creator: "", initial_vesting_shares: undefined, initial_delegation: undefined };
}
export const account_created = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.new_account_name !== "") {
            writer.uint32(10).string(message.new_account_name);
        }
        if (message.creator !== "") {
            writer.uint32(18).string(message.creator);
        }
        if (message.initial_vesting_shares !== undefined) {
            asset.encode(message.initial_vesting_shares, writer.uint32(26).fork()).ldelim();
        }
        if (message.initial_delegation !== undefined) {
            asset.encode(message.initial_delegation, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseaccount_created();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.new_account_name = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.creator = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.initial_vesting_shares = asset.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.initial_delegation = asset.decode(reader, reader.uint32());
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
            new_account_name: isSet(object.new_account_name) ? String(object.new_account_name) : "",
            creator: isSet(object.creator) ? String(object.creator) : "",
            initial_vesting_shares: isSet(object.initial_vesting_shares)
                ? asset.fromJSON(object.initial_vesting_shares)
                : undefined,
            initial_delegation: isSet(object.initial_delegation) ? asset.fromJSON(object.initial_delegation) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.new_account_name !== undefined) {
            obj.new_account_name = message.new_account_name;
        }
        if (message.creator !== undefined) {
            obj.creator = message.creator;
        }
        if (message.initial_vesting_shares !== undefined) {
            obj.initial_vesting_shares = asset.toJSON(message.initial_vesting_shares);
        }
        if (message.initial_delegation !== undefined) {
            obj.initial_delegation = asset.toJSON(message.initial_delegation);
        }
        return obj;
    },
    create(base) {
        return account_created.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseaccount_created();
        message.new_account_name = (_a = object.new_account_name) !== null && _a !== void 0 ? _a : "";
        message.creator = (_b = object.creator) !== null && _b !== void 0 ? _b : "";
        message.initial_vesting_shares =
            (object.initial_vesting_shares !== undefined && object.initial_vesting_shares !== null)
                ? asset.fromPartial(object.initial_vesting_shares)
                : undefined;
        message.initial_delegation = (object.initial_delegation !== undefined && object.initial_delegation !== null)
            ? asset.fromPartial(object.initial_delegation)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
