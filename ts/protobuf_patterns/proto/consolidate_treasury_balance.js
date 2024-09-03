/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseconsolidate_treasury_balance() {
    return { total_moved: [] };
}
export const consolidate_treasury_balance = {
    fromJSON(object) {
        return {
            total_moved: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.total_moved)
                ? object.total_moved.map((e) => asset.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if ((_a = message.total_moved) === null || _a === void 0 ? void 0 : _a.length) {
            obj.total_moved = message.total_moved.map((e) => asset.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return consolidate_treasury_balance.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseconsolidate_treasury_balance();
        message.total_moved = ((_a = object.total_moved) === null || _a === void 0 ? void 0 : _a.map((e) => asset.fromPartial(e))) || [];
        return message;
    },
};
