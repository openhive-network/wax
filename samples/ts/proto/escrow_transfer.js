/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
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
        if (message.escrow_id !== 0) {
            writer.uint32(32).uint32(message.escrow_id);
        }
        if (message.hbd_amount !== undefined) {
            asset.encode(message.hbd_amount, writer.uint32(42).fork()).ldelim();
        }
        if (message.hive_amount !== undefined) {
            asset.encode(message.hive_amount, writer.uint32(50).fork()).ldelim();
        }
        if (message.fee !== undefined) {
            asset.encode(message.fee, writer.uint32(58).fork()).ldelim();
        }
        if (message.ratification_deadline !== "") {
            writer.uint32(66).string(message.ratification_deadline);
        }
        if (message.escrow_expiration !== "") {
            writer.uint32(74).string(message.escrow_expiration);
        }
        if (message.json_meta !== "") {
            writer.uint32(82).string(message.json_meta);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseescrow_transfer();
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
                    if (tag !== 32) {
                        break;
                    }
                    message.escrow_id = reader.uint32();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.hbd_amount = asset.decode(reader, reader.uint32());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.hive_amount = asset.decode(reader, reader.uint32());
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.fee = asset.decode(reader, reader.uint32());
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.ratification_deadline = reader.string();
                    continue;
                case 9:
                    if (tag !== 74) {
                        break;
                    }
                    message.escrow_expiration = reader.string();
                    continue;
                case 10:
                    if (tag !== 82) {
                        break;
                    }
                    message.json_meta = reader.string();
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
            escrow_id: isSet(object.escrow_id) ? Number(object.escrow_id) : 0,
            hbd_amount: isSet(object.hbd_amount) ? asset.fromJSON(object.hbd_amount) : undefined,
            hive_amount: isSet(object.hive_amount) ? asset.fromJSON(object.hive_amount) : undefined,
            fee: isSet(object.fee) ? asset.fromJSON(object.fee) : undefined,
            ratification_deadline: isSet(object.ratification_deadline) ? String(object.ratification_deadline) : "",
            escrow_expiration: isSet(object.escrow_expiration) ? String(object.escrow_expiration) : "",
            json_meta: isSet(object.json_meta) ? String(object.json_meta) : "",
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
