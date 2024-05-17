/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasefill_vesting_withdraw() {
    return { from_account: "", to_account: "", withdrawn: undefined, deposited: undefined };
}
export const fill_vesting_withdraw = {
    fromJSON(object) {
        return {
            from_account: isSet(object.from_account) ? globalThis.String(object.from_account) : "",
            to_account: isSet(object.to_account) ? globalThis.String(object.to_account) : "",
            withdrawn: isSet(object.withdrawn) ? asset.fromJSON(object.withdrawn) : undefined,
            deposited: isSet(object.deposited) ? asset.fromJSON(object.deposited) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.from_account !== undefined) {
            obj.from_account = message.from_account;
        }
        if (message.to_account !== undefined) {
            obj.to_account = message.to_account;
        }
        if (message.withdrawn !== undefined) {
            obj.withdrawn = asset.toJSON(message.withdrawn);
        }
        if (message.deposited !== undefined) {
            obj.deposited = asset.toJSON(message.deposited);
        }
        return obj;
    },
    create(base) {
        return fill_vesting_withdraw.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasefill_vesting_withdraw();
        message.from_account = (_a = object.from_account) !== null && _a !== void 0 ? _a : "";
        message.to_account = (_b = object.to_account) !== null && _b !== void 0 ? _b : "";
        message.withdrawn = (object.withdrawn !== undefined && object.withdrawn !== null)
            ? asset.fromPartial(object.withdrawn)
            : undefined;
        message.deposited = (object.deposited !== undefined && object.deposited !== null)
            ? asset.fromPartial(object.deposited)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
