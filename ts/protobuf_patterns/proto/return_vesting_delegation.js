/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasereturn_vesting_delegation() {
    return { account: "", vesting_shares: undefined };
}
export const return_vesting_delegation = {
    fromJSON(object) {
        return {
            account: isSet(object.account) ? globalThis.String(object.account) : "",
            vesting_shares: isSet(object.vesting_shares) ? asset.fromJSON(object.vesting_shares) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        if (message.vesting_shares !== undefined) {
            obj.vesting_shares = asset.toJSON(message.vesting_shares);
        }
        return obj;
    },
    create(base) {
        return return_vesting_delegation.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasereturn_vesting_delegation();
        message.account = object.account ?? "";
        message.vesting_shares = (object.vesting_shares !== undefined && object.vesting_shares !== null)
            ? asset.fromPartial(object.vesting_shares)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
