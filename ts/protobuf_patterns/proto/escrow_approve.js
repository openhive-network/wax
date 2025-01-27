/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaseescrow_approve() {
    return { from_account: "", to_account: "", agent: "", who: "", escrow_id: 0, approve: false };
}
export const escrow_approve = {
    fromJSON(object) {
        return {
            from_account: isSet(object.from) ? globalThis.String(object.from) : "",
            to_account: isSet(object.to) ? globalThis.String(object.to) : "",
            agent: isSet(object.agent) ? globalThis.String(object.agent) : "",
            who: isSet(object.who) ? globalThis.String(object.who) : "",
            escrow_id: isSet(object.escrow_id) ? globalThis.Number(object.escrow_id) : 0,
            approve: isSet(object.approve) ? globalThis.Boolean(object.approve) : false,
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
        if (message.escrow_id !== undefined) {
            obj.escrow_id = Math.round(message.escrow_id);
        }
        if (message.approve !== undefined) {
            obj.approve = message.approve;
        }
        return obj;
    },
    create(base) {
        return escrow_approve.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseescrow_approve();
        message.from_account = object.from_account ?? "";
        message.to_account = object.to_account ?? "";
        message.agent = object.agent ?? "";
        message.who = object.who ?? "";
        message.escrow_id = object.escrow_id ?? 0;
        message.approve = object.approve ?? false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
