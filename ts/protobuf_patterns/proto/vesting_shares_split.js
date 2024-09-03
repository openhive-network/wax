/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasevesting_shares_split() {
    return { owner: "", vesting_shares_before_split: undefined, vesting_shares_after_split: undefined };
}
export const vesting_shares_split = {
    fromJSON(object) {
        return {
            owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
            vesting_shares_before_split: isSet(object.vesting_shares_before_split)
                ? asset.fromJSON(object.vesting_shares_before_split)
                : undefined,
            vesting_shares_after_split: isSet(object.vesting_shares_after_split)
                ? asset.fromJSON(object.vesting_shares_after_split)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== undefined) {
            obj.owner = message.owner;
        }
        if (message.vesting_shares_before_split !== undefined) {
            obj.vesting_shares_before_split = asset.toJSON(message.vesting_shares_before_split);
        }
        if (message.vesting_shares_after_split !== undefined) {
            obj.vesting_shares_after_split = asset.toJSON(message.vesting_shares_after_split);
        }
        return obj;
    },
    create(base) {
        return vesting_shares_split.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasevesting_shares_split();
        message.owner = (_a = object.owner) !== null && _a !== void 0 ? _a : "";
        message.vesting_shares_before_split =
            (object.vesting_shares_before_split !== undefined && object.vesting_shares_before_split !== null)
                ? asset.fromPartial(object.vesting_shares_before_split)
                : undefined;
        message.vesting_shares_after_split =
            (object.vesting_shares_after_split !== undefined && object.vesting_shares_after_split !== null)
                ? asset.fromPartial(object.vesting_shares_after_split)
                : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
