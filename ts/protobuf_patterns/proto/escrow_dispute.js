/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaseescrow_dispute() {
    return { from: "", to: "", agent: "", who: "", escrow_id: 0 };
}
export const escrow_dispute = {
    fromJSON(object) {
        return {
            from: isSet(object.from) ? globalThis.String(object.from) : "",
            to: isSet(object.to) ? globalThis.String(object.to) : "",
            agent: isSet(object.agent) ? globalThis.String(object.agent) : "",
            who: isSet(object.who) ? globalThis.String(object.who) : "",
            escrow_id: isSet(object.escrow_id) ? globalThis.Number(object.escrow_id) : 0,
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
        if (message.who !== undefined) {
            obj.who = message.who;
        }
        if (message.escrow_id !== undefined) {
            obj.escrow_id = Math.round(message.escrow_id);
        }
        return obj;
    },
    create(base) {
        return escrow_dispute.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseescrow_dispute();
        message.from = object.from ?? "";
        message.to = object.to ?? "";
        message.agent = object.agent ?? "";
        message.who = object.who ?? "";
        message.escrow_id = object.escrow_id ?? 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
