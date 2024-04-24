/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasepow_reward() {
    return { worker: "", reward: undefined };
}
export const pow_reward = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.worker !== "") {
            writer.uint32(10).string(message.worker);
        }
        if (message.reward !== undefined) {
            asset.encode(message.reward, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasepow_reward();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.worker = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.reward = asset.decode(reader, reader.uint32());
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
            worker: isSet(object.worker) ? globalThis.String(object.worker) : "",
            reward: isSet(object.reward) ? asset.fromJSON(object.reward) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.worker !== undefined) {
            obj.worker = message.worker;
        }
        if (message.reward !== undefined) {
            obj.reward = asset.toJSON(message.reward);
        }
        return obj;
    },
    create(base) {
        return pow_reward.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasepow_reward();
        message.worker = (_a = object.worker) !== null && _a !== void 0 ? _a : "";
        message.reward = (object.reward !== undefined && object.reward !== null)
            ? asset.fromPartial(object.reward)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
