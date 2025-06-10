/* eslint-disable */
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
function isSet(value) {
    return value !== null && value !== undefined;
}
