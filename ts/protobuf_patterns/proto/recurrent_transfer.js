/* eslint-disable */
import { asset } from "./asset.js";
import { void_t } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaserecurrent_transfer_pair_id() {
    return { pair_id: 0 };
}
export const recurrent_transfer_pair_id = {
    fromJSON(object) {
        return { pair_id: isSet(object.pair_id) ? globalThis.Number(object.pair_id) : 0 };
    },
    toJSON(message) {
        const obj = {};
        if (message.pair_id !== undefined) {
            obj.pair_id = Math.round(message.pair_id);
        }
        return obj;
    },
    create(base) {
        return recurrent_transfer_pair_id.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaserecurrent_transfer_pair_id();
        message.pair_id = object.pair_id ?? 0;
        return message;
    },
};
function createBaserecurrent_transfer_extension() {
    return {};
}
export const recurrent_transfer_extension = {
    fromJSON(object) {
        return {
            void_t: isSet(object.void_t) ? void_t.fromJSON(object.void_t) : undefined,
            recurrent_transfer_pair_id: isSet(object.recurrent_transfer_pair_id)
                ? recurrent_transfer_pair_id.fromJSON(object.recurrent_transfer_pair_id)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.void_t !== undefined) {
            obj.void_t = void_t.toJSON(message.void_t);
        }
        if (message.recurrent_transfer_pair_id !== undefined) {
            obj.recurrent_transfer_pair_id = recurrent_transfer_pair_id.toJSON(message.recurrent_transfer_pair_id);
        }
        return obj;
    },
    create(base) {
        return recurrent_transfer_extension.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaserecurrent_transfer_extension();
        message.void_t = (object.void_t !== undefined && object.void_t !== null)
            ? void_t.fromPartial(object.void_t)
            : undefined;
        message.recurrent_transfer_pair_id =
            (object.recurrent_transfer_pair_id !== undefined && object.recurrent_transfer_pair_id !== null)
                ? recurrent_transfer_pair_id.fromPartial(object.recurrent_transfer_pair_id)
                : undefined;
        return message;
    },
};
function createBaserecurrent_transfer() {
    return {
        from_account: "",
        to_account: "",
        amount: undefined,
        memo: "",
        recurrence: 0,
        executions: 0,
        extensions: [],
    };
}
export const recurrent_transfer = {
    fromJSON(object) {
        return {
            from_account: isSet(object.from) ? globalThis.String(object.from) : "",
            to_account: isSet(object.to) ? globalThis.String(object.to) : "",
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
        message.from_account = object.from_account ?? "";
        message.to_account = object.to_account ?? "";
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
