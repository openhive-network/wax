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
        return escrow_approve.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseescrow_approve();
        message.from_account = (_a = object.from_account) !== null && _a !== void 0 ? _a : "";
        message.to_account = (_b = object.to_account) !== null && _b !== void 0 ? _b : "";
        message.agent = (_c = object.agent) !== null && _c !== void 0 ? _c : "";
        message.who = (_d = object.who) !== null && _d !== void 0 ? _d : "";
        message.escrow_id = (_e = object.escrow_id) !== null && _e !== void 0 ? _e : 0;
        message.approve = (_f = object.approve) !== null && _f !== void 0 ? _f : false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
