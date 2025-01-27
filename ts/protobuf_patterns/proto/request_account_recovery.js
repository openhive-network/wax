/* eslint-disable */
import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaserequest_account_recovery() {
    return { recovery_account: "", account_to_recover: "", new_owner_authority: undefined, extensions: [] };
}
export const request_account_recovery = {
    fromJSON(object) {
        return {
            recovery_account: isSet(object.recovery_account) ? globalThis.String(object.recovery_account) : "",
            account_to_recover: isSet(object.account_to_recover) ? globalThis.String(object.account_to_recover) : "",
            new_owner_authority: isSet(object.new_owner_authority)
                ? authority.fromJSON(object.new_owner_authority)
                : undefined,
            extensions: globalThis.Array.isArray(object?.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.recovery_account !== undefined) {
            obj.recovery_account = message.recovery_account;
        }
        if (message.account_to_recover !== undefined) {
            obj.account_to_recover = message.account_to_recover;
        }
        if (message.new_owner_authority !== undefined) {
            obj.new_owner_authority = authority.toJSON(message.new_owner_authority);
        }
        if (message.extensions?.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return request_account_recovery.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaserequest_account_recovery();
        message.recovery_account = object.recovery_account ?? "";
        message.account_to_recover = object.account_to_recover ?? "";
        message.new_owner_authority = (object.new_owner_authority !== undefined && object.new_owner_authority !== null)
            ? authority.fromPartial(object.new_owner_authority)
            : undefined;
        message.extensions = object.extensions?.map((e) => future_extensions.fromPartial(e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
