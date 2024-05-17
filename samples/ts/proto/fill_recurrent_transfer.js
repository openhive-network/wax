/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasefill_recurrent_transfer() {
    return { from_account: "", to_account: "", amount: undefined, memo: "", remaining_executions: 0 };
}
export const fill_recurrent_transfer = {
    fromJSON(object) {
        return {
            from_account: isSet(object.from) ? globalThis.String(object.from) : "",
            to_account: isSet(object.to) ? globalThis.String(object.to) : "",
            amount: isSet(object.amount) ? asset.fromJSON(object.amount) : undefined,
            memo: isSet(object.memo) ? globalThis.String(object.memo) : "",
            remaining_executions: isSet(object.remaining_executions) ? globalThis.Number(object.remaining_executions) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.from_account !== undefined) {
            obj.from = message.from_account;
        }
        if (message.to_account !== undefined) {
            obj.to = message.to_account;
        }
        if (message.amount !== undefined) {
            obj.amount = asset.toJSON(message.amount);
        }
        if (message.memo !== undefined) {
            obj.memo = message.memo;
        }
        if (message.remaining_executions !== undefined) {
            obj.remaining_executions = Math.round(message.remaining_executions);
        }
        return obj;
    },
    create(base) {
        return fill_recurrent_transfer.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBasefill_recurrent_transfer();
        message.from_account = (_a = object.from_account) !== null && _a !== void 0 ? _a : "";
        message.to_account = (_b = object.to_account) !== null && _b !== void 0 ? _b : "";
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? asset.fromPartial(object.amount)
            : undefined;
        message.memo = (_c = object.memo) !== null && _c !== void 0 ? _c : "";
        message.remaining_executions = (_d = object.remaining_executions) !== null && _d !== void 0 ? _d : 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
