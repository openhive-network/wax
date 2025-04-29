/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseescrow_transfer() {
    return {
        from: "",
        to: "",
        agent: "",
        escrow_id: 0,
        hbd_amount: undefined,
        hive_amount: undefined,
        fee: undefined,
        ratification_deadline: "",
        escrow_expiration: "",
        json_meta: "",
    };
}
export const escrow_transfer = {
    fromJSON(object) {
        return {
            from: isSet(object.from) ? globalThis.String(object.from) : "",
            to: isSet(object.to) ? globalThis.String(object.to) : "",
            agent: isSet(object.agent) ? globalThis.String(object.agent) : "",
            escrow_id: isSet(object.escrow_id) ? globalThis.Number(object.escrow_id) : 0,
            hbd_amount: isSet(object.hbd_amount) ? asset.fromJSON(object.hbd_amount) : undefined,
            hive_amount: isSet(object.hive_amount) ? asset.fromJSON(object.hive_amount) : undefined,
            fee: isSet(object.fee) ? asset.fromJSON(object.fee) : undefined,
            ratification_deadline: isSet(object.ratification_deadline) ? globalThis.String(object.ratification_deadline) : "",
            escrow_expiration: isSet(object.escrow_expiration) ? globalThis.String(object.escrow_expiration) : "",
            json_meta: isSet(object.json_meta) ? globalThis.String(object.json_meta) : "",
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
        if (message.agent !== undefined) {
            obj.agent = message.agent;
        }
        if (message.escrow_id !== undefined) {
            obj.escrow_id = Math.round(message.escrow_id);
        }
        if (message.hbd_amount !== undefined) {
            obj.hbd_amount = asset.toJSON(message.hbd_amount);
        }
        if (message.hive_amount !== undefined) {
            obj.hive_amount = asset.toJSON(message.hive_amount);
        }
        if (message.fee !== undefined) {
            obj.fee = asset.toJSON(message.fee);
        }
        if (message.ratification_deadline !== undefined) {
            obj.ratification_deadline = message.ratification_deadline;
        }
        if (message.escrow_expiration !== undefined) {
            obj.escrow_expiration = message.escrow_expiration;
        }
        if (message.json_meta !== undefined) {
            obj.json_meta = message.json_meta;
        }
        return obj;
    },
    create(base) {
        return escrow_transfer.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseescrow_transfer();
        message.from = object.from ?? "";
        message.to = object.to ?? "";
        message.agent = object.agent ?? "";
        message.escrow_id = object.escrow_id ?? 0;
        message.hbd_amount = (object.hbd_amount !== undefined && object.hbd_amount !== null)
            ? asset.fromPartial(object.hbd_amount)
            : undefined;
        message.hive_amount = (object.hive_amount !== undefined && object.hive_amount !== null)
            ? asset.fromPartial(object.hive_amount)
            : undefined;
        message.fee = (object.fee !== undefined && object.fee !== null) ? asset.fromPartial(object.fee) : undefined;
        message.ratification_deadline = object.ratification_deadline ?? "";
        message.escrow_expiration = object.escrow_expiration ?? "";
        message.json_meta = object.json_meta ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
