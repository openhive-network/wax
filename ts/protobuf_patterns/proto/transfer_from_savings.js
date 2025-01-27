/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasetransfer_from_savings() {
    return { from_account: "", request_id: 0, to_account: "", amount: undefined, memo: "" };
}
export const transfer_from_savings = {
    fromJSON(object) {
        return {
            from_account: isSet(object.from) ? globalThis.String(object.from) : "",
            request_id: isSet(object.request_id) ? globalThis.Number(object.request_id) : 0,
            to_account: isSet(object.to) ? globalThis.String(object.to) : "",
            amount: isSet(object.amount) ? asset.fromJSON(object.amount) : undefined,
            memo: isSet(object.memo) ? globalThis.String(object.memo) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.from_account !== undefined) {
            obj.from = message.from_account;
        }
        if (message.request_id !== undefined) {
            obj.request_id = Math.round(message.request_id);
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
        return obj;
    },
    create(base) {
        return transfer_from_savings.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasetransfer_from_savings();
        message.from_account = object.from_account ?? "";
        message.request_id = object.request_id ?? 0;
        message.to_account = object.to_account ?? "";
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? asset.fromPartial(object.amount)
            : undefined;
        message.memo = object.memo ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
