/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasedelegate_vesting_shares() {
    return { delegator: "", delegatee: "", vesting_shares: undefined };
}
export const delegate_vesting_shares = {
    fromJSON(object) {
        return {
            delegator: isSet(object.delegator) ? globalThis.String(object.delegator) : "",
            delegatee: isSet(object.delegatee) ? globalThis.String(object.delegatee) : "",
            vesting_shares: isSet(object.vesting_shares) ? asset.fromJSON(object.vesting_shares) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.delegator !== undefined) {
            obj.delegator = message.delegator;
        }
        if (message.delegatee !== undefined) {
            obj.delegatee = message.delegatee;
        }
        if (message.vesting_shares !== undefined) {
            obj.vesting_shares = asset.toJSON(message.vesting_shares);
        }
        return obj;
    },
    create(base) {
        return delegate_vesting_shares.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasedelegate_vesting_shares();
        message.delegator = (_a = object.delegator) !== null && _a !== void 0 ? _a : "";
        message.delegatee = (_b = object.delegatee) !== null && _b !== void 0 ? _b : "";
        message.vesting_shares = (object.vesting_shares !== undefined && object.vesting_shares !== null)
            ? asset.fromPartial(object.vesting_shares)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
