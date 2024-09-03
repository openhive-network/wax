/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseclear_null_account_balance() {
    return { total_cleared: [] };
}
export const clear_null_account_balance = {
    fromJSON(object) {
        return {
            total_cleared: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.total_cleared)
                ? object.total_cleared.map((e) => asset.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if ((_a = message.total_cleared) === null || _a === void 0 ? void 0 : _a.length) {
            obj.total_cleared = message.total_cleared.map((e) => asset.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return clear_null_account_balance.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseclear_null_account_balance();
        message.total_cleared = ((_a = object.total_cleared) === null || _a === void 0 ? void 0 : _a.map((e) => asset.fromPartial(e))) || [];
        return message;
    },
};
