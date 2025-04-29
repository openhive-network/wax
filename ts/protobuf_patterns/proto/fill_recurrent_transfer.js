/* eslint-disable */
import { asset } from "./asset.js";
import { recurrent_transfer_extension } from "./recurrent_transfer_extension.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasefill_recurrent_transfer() {
    return { from: "", to: "", amount: undefined, memo: "", remaining_executions: 0, extensions: [] };
}
export const fill_recurrent_transfer = {
    fromJSON(object) {
        return {
            from: isSet(object.from) ? globalThis.String(object.from) : "",
            to: isSet(object.to) ? globalThis.String(object.to) : "",
            amount: isSet(object.amount) ? asset.fromJSON(object.amount) : undefined,
            memo: isSet(object.memo) ? globalThis.String(object.memo) : "",
            remaining_executions: isSet(object.remaining_executions) ? globalThis.Number(object.remaining_executions) : 0,
            extensions: globalThis.Array.isArray(object?.extensions)
                ? object.extensions.map((e) => recurrent_transfer_extension.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.from !== undefined) {
            obj.from = message.from;
        }
        if (message.to !== undefined) {
            obj.to = message.to;
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
        if (message.extensions?.length) {
            obj.extensions = message.extensions.map((e) => recurrent_transfer_extension.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return fill_recurrent_transfer.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasefill_recurrent_transfer();
        message.from = object.from ?? "";
        message.to = object.to ?? "";
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? asset.fromPartial(object.amount)
            : undefined;
        message.memo = object.memo ?? "";
        message.remaining_executions = object.remaining_executions ?? 0;
        message.extensions = object.extensions?.map((e) => recurrent_transfer_extension.fromPartial(e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
