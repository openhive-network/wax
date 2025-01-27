/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseconsolidate_treasury_balance() {
    return { total_moved: [] };
}
export const consolidate_treasury_balance = {
    fromJSON(object) {
        return {
            total_moved: globalThis.Array.isArray(object?.total_moved)
                ? object.total_moved.map((e) => asset.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.total_moved?.length) {
            obj.total_moved = message.total_moved.map((e) => asset.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return consolidate_treasury_balance.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseconsolidate_treasury_balance();
        message.total_moved = object.total_moved?.map((e) => asset.fromPartial(e)) || [];
        return message;
    },
};
