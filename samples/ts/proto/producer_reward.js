/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseproducer_reward() {
    return { producer: "", vesting_shares: undefined };
}
export const producer_reward = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.producer !== "") {
            writer.uint32(10).string(message.producer);
        }
        if (message.vesting_shares !== undefined) {
            asset.encode(message.vesting_shares, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseproducer_reward();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.producer = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.vesting_shares = asset.decode(reader, reader.uint32());
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
            producer: isSet(object.producer) ? String(object.producer) : "",
            vesting_shares: isSet(object.vesting_shares) ? asset.fromJSON(object.vesting_shares) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.producer !== "") {
            obj.producer = message.producer;
        }
        if (message.vesting_shares !== undefined) {
            obj.vesting_shares = asset.toJSON(message.vesting_shares);
        }
        return obj;
    },
    create(base) {
        return producer_reward.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseproducer_reward();
        message.producer = (_a = object.producer) !== null && _a !== void 0 ? _a : "";
        message.vesting_shares = (object.vesting_shares !== undefined && object.vesting_shares !== null)
            ? asset.fromPartial(object.vesting_shares)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
