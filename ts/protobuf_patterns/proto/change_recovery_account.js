/* eslint-disable */
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasechange_recovery_account() {
    return { account_to_recover: "", new_recovery_account: "", extensions: [] };
}
export const change_recovery_account = {
    fromJSON(object) {
        return {
            account_to_recover: isSet(object.account_to_recover) ? globalThis.String(object.account_to_recover) : "",
            new_recovery_account: isSet(object.new_recovery_account) ? globalThis.String(object.new_recovery_account) : "",
            extensions: globalThis.Array.isArray(object?.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account_to_recover !== undefined) {
            obj.account_to_recover = message.account_to_recover;
        }
        if (message.new_recovery_account !== undefined) {
            obj.new_recovery_account = message.new_recovery_account;
        }
        if (message.extensions?.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return change_recovery_account.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasechange_recovery_account();
        message.account_to_recover = object.account_to_recover ?? "";
        message.new_recovery_account = object.new_recovery_account ?? "";
        message.extensions = object.extensions?.map((e) => future_extensions.fromPartial(e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
