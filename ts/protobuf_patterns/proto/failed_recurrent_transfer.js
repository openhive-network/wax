/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasefailed_recurrent_transfer() {
    return {
        from: "",
        to: "",
        amount: undefined,
        memo: "",
        consecutive_failures: 0,
        remaining_executions: 0,
        deleted: false,
    };
}
export const failed_recurrent_transfer = {
    fromJSON(object) {
        return {
            from: isSet(object.from) ? globalThis.String(object.from) : "",
            to: isSet(object.to) ? globalThis.String(object.to) : "",
            amount: isSet(object.amount) ? asset.fromJSON(object.amount) : undefined,
            memo: isSet(object.memo) ? globalThis.String(object.memo) : "",
            consecutive_failures: isSet(object.consecutive_failures) ? globalThis.Number(object.consecutive_failures) : 0,
            remaining_executions: isSet(object.remaining_executions) ? globalThis.Number(object.remaining_executions) : 0,
            deleted: isSet(object.deleted) ? globalThis.Boolean(object.deleted) : false,
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
        if (message.consecutive_failures !== undefined) {
            obj.consecutive_failures = Math.round(message.consecutive_failures);
        }
        if (message.remaining_executions !== undefined) {
            obj.remaining_executions = Math.round(message.remaining_executions);
        }
        if (message.deleted !== undefined) {
            obj.deleted = message.deleted;
        }
        return obj;
    },
    create(base) {
        return failed_recurrent_transfer.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasefailed_recurrent_transfer();
        message.from = object.from ?? "";
        message.to = object.to ?? "";
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? asset.fromPartial(object.amount)
            : undefined;
        message.memo = object.memo ?? "";
        message.consecutive_failures = object.consecutive_failures ?? 0;
        message.remaining_executions = object.remaining_executions ?? 0;
        message.deleted = object.deleted ?? false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
