/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasehardfork_hive() {
    return {
        account: "",
        treasury: "",
        other_affected_accounts: [],
        hbd_transferred: undefined,
        hive_transferred: undefined,
        vests_converted: undefined,
        total_hive_from_vests: undefined,
    };
}
export const hardfork_hive = {
    fromJSON(object) {
        return {
            account: isSet(object.account) ? globalThis.String(object.account) : "",
            treasury: isSet(object.treasury) ? globalThis.String(object.treasury) : "",
            other_affected_accounts: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.other_affected_accounts)
                ? object.other_affected_accounts.map((e) => globalThis.String(e))
                : [],
            hbd_transferred: isSet(object.hbd_transferred) ? asset.fromJSON(object.hbd_transferred) : undefined,
            hive_transferred: isSet(object.hive_transferred) ? asset.fromJSON(object.hive_transferred) : undefined,
            vests_converted: isSet(object.vests_converted) ? asset.fromJSON(object.vests_converted) : undefined,
            total_hive_from_vests: isSet(object.total_hive_from_vests)
                ? asset.fromJSON(object.total_hive_from_vests)
                : undefined,
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        if (message.treasury !== undefined) {
            obj.treasury = message.treasury;
        }
        if ((_a = message.other_affected_accounts) === null || _a === void 0 ? void 0 : _a.length) {
            obj.other_affected_accounts = message.other_affected_accounts;
        }
        if (message.hbd_transferred !== undefined) {
            obj.hbd_transferred = asset.toJSON(message.hbd_transferred);
        }
        if (message.hive_transferred !== undefined) {
            obj.hive_transferred = asset.toJSON(message.hive_transferred);
        }
        if (message.vests_converted !== undefined) {
            obj.vests_converted = asset.toJSON(message.vests_converted);
        }
        if (message.total_hive_from_vests !== undefined) {
            obj.total_hive_from_vests = asset.toJSON(message.total_hive_from_vests);
        }
        return obj;
    },
    create(base) {
        return hardfork_hive.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasehardfork_hive();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.treasury = (_b = object.treasury) !== null && _b !== void 0 ? _b : "";
        message.other_affected_accounts = ((_c = object.other_affected_accounts) === null || _c === void 0 ? void 0 : _c.map((e) => e)) || [];
        message.hbd_transferred = (object.hbd_transferred !== undefined && object.hbd_transferred !== null)
            ? asset.fromPartial(object.hbd_transferred)
            : undefined;
        message.hive_transferred = (object.hive_transferred !== undefined && object.hive_transferred !== null)
            ? asset.fromPartial(object.hive_transferred)
            : undefined;
        message.vests_converted = (object.vests_converted !== undefined && object.vests_converted !== null)
            ? asset.fromPartial(object.vests_converted)
            : undefined;
        message.total_hive_from_vests =
            (object.total_hive_from_vests !== undefined && object.total_hive_from_vests !== null)
                ? asset.fromPartial(object.total_hive_from_vests)
                : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
