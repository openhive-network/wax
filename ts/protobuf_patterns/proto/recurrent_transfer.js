/* eslint-disable */
import { asset } from "./asset.js";
import { recurrent_transfer_extension } from "./recurrent_transfer_extension.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaserecurrent_transfer() {
    return { from: "", to: "", amount: undefined, memo: "", recurrence: 0, executions: 0, extensions: [] };
}
export const recurrent_transfer = {
    fromJSON(object) {
        return {
            from: isSet(object.from) ? globalThis.String(object.from) : "",
            to: isSet(object.to) ? globalThis.String(object.to) : "",
            amount: isSet(object.amount) ? asset.fromJSON(object.amount) : undefined,
            memo: isSet(object.memo) ? globalThis.String(object.memo) : "",
            recurrence: isSet(object.recurrence) ? globalThis.Number(object.recurrence) : 0,
            executions: isSet(object.executions) ? globalThis.Number(object.executions) : 0,
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
        if (message.recurrence !== undefined) {
            obj.recurrence = Math.round(message.recurrence);
        }
        if (message.executions !== undefined) {
            obj.executions = Math.round(message.executions);
        }
        if (message.extensions?.length) {
            obj.extensions = message.extensions.map((e) => recurrent_transfer_extension.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return recurrent_transfer.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaserecurrent_transfer();
        message.from = object.from ?? "";
        message.to = object.to ?? "";
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? asset.fromPartial(object.amount)
            : undefined;
        message.memo = object.memo ?? "";
        message.recurrence = object.recurrence ?? 0;
        message.executions = object.executions ?? 0;
        message.extensions = object.extensions?.map((e) => recurrent_transfer_extension.fromPartial(e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
