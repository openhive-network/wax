/* eslint-disable */
import { authority } from "./authority.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaserecover_account() {
    return { account_to_recover: "", new_owner_authority: undefined, recent_owner_authority: undefined, extensions: [] };
}
export const recover_account = {
    fromJSON(object) {
        return {
            account_to_recover: isSet(object.account_to_recover) ? globalThis.String(object.account_to_recover) : "",
            new_owner_authority: isSet(object.new_owner_authority)
                ? authority.fromJSON(object.new_owner_authority)
                : undefined,
            recent_owner_authority: isSet(object.recent_owner_authority)
                ? authority.fromJSON(object.recent_owner_authority)
                : undefined,
            extensions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.account_to_recover !== undefined) {
            obj.account_to_recover = message.account_to_recover;
        }
        if (message.new_owner_authority !== undefined) {
            obj.new_owner_authority = authority.toJSON(message.new_owner_authority);
        }
        if (message.recent_owner_authority !== undefined) {
            obj.recent_owner_authority = authority.toJSON(message.recent_owner_authority);
        }
        if ((_a = message.extensions) === null || _a === void 0 ? void 0 : _a.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return recover_account.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaserecover_account();
        message.account_to_recover = (_a = object.account_to_recover) !== null && _a !== void 0 ? _a : "";
        message.new_owner_authority = (object.new_owner_authority !== undefined && object.new_owner_authority !== null)
            ? authority.fromPartial(object.new_owner_authority)
            : undefined;
        message.recent_owner_authority =
            (object.recent_owner_authority !== undefined && object.recent_owner_authority !== null)
                ? authority.fromPartial(object.recent_owner_authority)
                : undefined;
        message.extensions = ((_b = object.extensions) === null || _b === void 0 ? void 0 : _b.map((e) => future_extensions.fromPartial(e))) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
