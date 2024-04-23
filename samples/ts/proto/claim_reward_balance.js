/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseclaim_reward_balance() {
    return { account: "", reward_hive: undefined, reward_hbd: undefined, reward_vests: undefined };
}
export const claim_reward_balance = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account !== "") {
            writer.uint32(10).string(message.account);
        }
        if (message.reward_hive !== undefined) {
            asset.encode(message.reward_hive, writer.uint32(18).fork()).ldelim();
        }
        if (message.reward_hbd !== undefined) {
            asset.encode(message.reward_hbd, writer.uint32(26).fork()).ldelim();
        }
        if (message.reward_vests !== undefined) {
            asset.encode(message.reward_vests, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseclaim_reward_balance();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.account = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.reward_hive = asset.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.reward_hbd = asset.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.reward_vests = asset.decode(reader, reader.uint32());
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
            account: isSet(object.account) ? String(object.account) : "",
            reward_hive: isSet(object.reward_hive) ? asset.fromJSON(object.reward_hive) : undefined,
            reward_hbd: isSet(object.reward_hbd) ? asset.fromJSON(object.reward_hbd) : undefined,
            reward_vests: isSet(object.reward_vests) ? asset.fromJSON(object.reward_vests) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        if (message.reward_hive !== undefined) {
            obj.reward_hive = asset.toJSON(message.reward_hive);
        }
        if (message.reward_hbd !== undefined) {
            obj.reward_hbd = asset.toJSON(message.reward_hbd);
        }
        if (message.reward_vests !== undefined) {
            obj.reward_vests = asset.toJSON(message.reward_vests);
        }
        return obj;
    },
    create(base) {
        return claim_reward_balance.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseclaim_reward_balance();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.reward_hive = (object.reward_hive !== undefined && object.reward_hive !== null)
            ? asset.fromPartial(object.reward_hive)
            : undefined;
        message.reward_hbd = (object.reward_hbd !== undefined && object.reward_hbd !== null)
            ? asset.fromPartial(object.reward_hbd)
            : undefined;
        message.reward_vests = (object.reward_vests !== undefined && object.reward_vests !== null)
            ? asset.fromPartial(object.reward_vests)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
