/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseescrow_transfer() {
    return {
        from_account: "",
        to_account: "",
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
            from_account: isSet(object.from) ? globalThis.String(object.from) : "",
            to_account: isSet(object.to) ? globalThis.String(object.to) : "",
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
        if (message.from_account !== undefined) {
            obj.from = message.from_account;
        }
        if (message.to_account !== undefined) {
            obj.to = message.to_account;
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
        return escrow_transfer.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseescrow_transfer();
        message.from_account = (_a = object.from_account) !== null && _a !== void 0 ? _a : "";
        message.to_account = (_b = object.to_account) !== null && _b !== void 0 ? _b : "";
        message.agent = (_c = object.agent) !== null && _c !== void 0 ? _c : "";
        message.escrow_id = (_d = object.escrow_id) !== null && _d !== void 0 ? _d : 0;
        message.hbd_amount = (object.hbd_amount !== undefined && object.hbd_amount !== null)
            ? asset.fromPartial(object.hbd_amount)
            : undefined;
        message.hive_amount = (object.hive_amount !== undefined && object.hive_amount !== null)
            ? asset.fromPartial(object.hive_amount)
            : undefined;
        message.fee = (object.fee !== undefined && object.fee !== null) ? asset.fromPartial(object.fee) : undefined;
        message.ratification_deadline = (_e = object.ratification_deadline) !== null && _e !== void 0 ? _e : "";
        message.escrow_expiration = (_f = object.escrow_expiration) !== null && _f !== void 0 ? _f : "";
        message.json_meta = (_g = object.json_meta) !== null && _g !== void 0 ? _g : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
