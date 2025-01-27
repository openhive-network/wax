/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseclear_null_account_balance() {
    return { total_cleared: [] };
}
export const clear_null_account_balance = {
    fromJSON(object) {
        return {
            total_cleared: globalThis.Array.isArray(object?.total_cleared)
                ? object.total_cleared.map((e) => asset.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.total_cleared?.length) {
            obj.total_cleared = message.total_cleared.map((e) => asset.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return clear_null_account_balance.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseclear_null_account_balance();
        message.total_cleared = object.total_cleared?.map((e) => asset.fromPartial(e)) || [];
        return message;
    },
};
