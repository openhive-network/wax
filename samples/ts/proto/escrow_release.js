/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
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
        if (message.receiver !== "") {
            writer.uint32(42).string(message.receiver);
        }
        if (message.escrow_id !== 0) {
            writer.uint32(48).uint32(message.escrow_id);
        }
        if (message.hbd_amount !== undefined) {
            asset.encode(message.hbd_amount, writer.uint32(58).fork()).ldelim();
        }
        if (message.hive_amount !== undefined) {
            asset.encode(message.hive_amount, writer.uint32(66).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseescrow_release();
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
                    if (tag !== 42) {
                        break;
                    }
                    message.receiver = reader.string();
                    continue;
                case 6:
                    if (tag !== 48) {
                        break;
                    }
                    message.escrow_id = reader.uint32();
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.hbd_amount = asset.decode(reader, reader.uint32());
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.hive_amount = asset.decode(reader, reader.uint32());
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
            receiver: isSet(object.receiver) ? String(object.receiver) : "",
            escrow_id: isSet(object.escrow_id) ? Number(object.escrow_id) : 0,
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
        return escrow_release.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseescrow_release();
        message.from_account = (_a = object.from_account) !== null && _a !== void 0 ? _a : "";
        message.to_account = (_b = object.to_account) !== null && _b !== void 0 ? _b : "";
        message.agent = (_c = object.agent) !== null && _c !== void 0 ? _c : "";
        message.who = (_d = object.who) !== null && _d !== void 0 ? _d : "";
        message.receiver = (_e = object.receiver) !== null && _e !== void 0 ? _e : "";
        message.escrow_id = (_f = object.escrow_id) !== null && _f !== void 0 ? _f : 0;
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
