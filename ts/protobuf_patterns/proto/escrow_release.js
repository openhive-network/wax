/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseescrow_release() {
    return {
        from_account: "",
        to_account: "",
        agent: "",
        who: "",
        receiver: "",
        escrow_id: 0,
        hbd_amount: undefined,
        hive_amount: undefined,
    };
}
export const escrow_release = {
    fromJSON(object) {
        return {
            from_account: isSet(object.from) ? globalThis.String(object.from) : "",
            to_account: isSet(object.to) ? globalThis.String(object.to) : "",
            agent: isSet(object.agent) ? globalThis.String(object.agent) : "",
            who: isSet(object.who) ? globalThis.String(object.who) : "",
            receiver: isSet(object.receiver) ? globalThis.String(object.receiver) : "",
            escrow_id: isSet(object.escrow_id) ? globalThis.Number(object.escrow_id) : 0,
            hbd_amount: isSet(object.hbd_amount) ? asset.fromJSON(object.hbd_amount) : undefined,
            hive_amount: isSet(object.hive_amount) ? asset.fromJSON(object.hive_amount) : undefined,
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
        if (message.who !== undefined) {
            obj.who = message.who;
        }
        if (message.receiver !== undefined) {
            obj.receiver = message.receiver;
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
        return obj;
    },
    create(base) {
        return escrow_release.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseescrow_release();
        message.from_account = object.from_account ?? "";
        message.to_account = object.to_account ?? "";
        message.agent = object.agent ?? "";
        message.who = object.who ?? "";
        message.receiver = object.receiver ?? "";
        message.escrow_id = object.escrow_id ?? 0;
        message.hbd_amount = (object.hbd_amount !== undefined && object.hbd_amount !== null)
            ? asset.fromPartial(object.hbd_amount)
            : undefined;
        message.hive_amount = (object.hive_amount !== undefined && object.hive_amount !== null)
            ? asset.fromPartial(object.hive_amount)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
