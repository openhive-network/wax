/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseescrow_dispute() {
    return { from_account: "", to_account: "", agent: "", who: "", escrow_id: 0 };
}
export const escrow_dispute = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.from_account !== "") {
            writer.uint32(10).string(message.from_account);
        }
        if (message.to_account !== "") {
            writer.uint32(18).string(message.to_account);
        }
        if (message.agent !== "") {
            writer.uint32(26).string(message.agent);
        }
        if (message.who !== "") {
            writer.uint32(34).string(message.who);
        }
        if (message.escrow_id !== 0) {
            writer.uint32(40).uint32(message.escrow_id);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseescrow_dispute();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.from_account = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.to_account = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.agent = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.who = reader.string();
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.escrow_id = reader.uint32();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            from_account: isSet(object.from) ? String(object.from) : "",
            to_account: isSet(object.to) ? String(object.to) : "",
            agent: isSet(object.agent) ? String(object.agent) : "",
            who: isSet(object.who) ? String(object.who) : "",
            escrow_id: isSet(object.escrow_id) ? Number(object.escrow_id) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.from_account !== "") {
            obj.from = message.from_account;
        }
        if (message.to_account !== "") {
            obj.to = message.to_account;
        }
        if (message.agent !== "") {
            obj.agent = message.agent;
        }
        if (message.who !== "") {
            obj.who = message.who;
        }
        if (message.escrow_id !== 0) {
            obj.escrow_id = Math.round(message.escrow_id);
        }
        return obj;
    },
    create(base) {
        return escrow_dispute.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseescrow_dispute();
        message.from_account = (_a = object.from_account) !== null && _a !== void 0 ? _a : "";
        message.to_account = (_b = object.to_account) !== null && _b !== void 0 ? _b : "";
        message.agent = (_c = object.agent) !== null && _c !== void 0 ? _c : "";
        message.who = (_d = object.who) !== null && _d !== void 0 ? _d : "";
        message.escrow_id = (_e = object.escrow_id) !== null && _e !== void 0 ? _e : 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
