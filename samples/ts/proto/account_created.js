/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseaccount_created() {
    return { new_account_name: "", creator: "", initial_vesting_shares: undefined, initial_delegation: undefined };
}
export const account_created = {
    fromJSON(object) {
        return {
            new_account_name: isSet(object.new_account_name) ? globalThis.String(object.new_account_name) : "",
            creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
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
