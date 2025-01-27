/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseescrow_approved() {
    return { from_account: "", to_account: "", agent: "", escrow_id: 0, fee: undefined };
}
export const escrow_approved = {
    fromJSON(object) {
        return {
            from_account: isSet(object.from) ? globalThis.String(object.from) : "",
            to_account: isSet(object.to) ? globalThis.String(object.to) : "",
            agent: isSet(object.agent) ? globalThis.String(object.agent) : "",
            escrow_id: isSet(object.escrow_id) ? globalThis.Number(object.escrow_id) : 0,
            fee: isSet(object.fee) ? asset.fromJSON(object.fee) : undefined,
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
        if (message.fee !== undefined) {
            obj.fee = asset.toJSON(message.fee);
        }
        return obj;
    },
    create(base) {
        return escrow_approved.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseescrow_approved();
        message.from_account = object.from_account ?? "";
        message.to_account = object.to_account ?? "";
        message.agent = object.agent ?? "";
        message.escrow_id = object.escrow_id ?? 0;
        message.fee = (object.fee !== undefined && object.fee !== null) ? asset.fromPartial(object.fee) : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
