/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasedelegate_vesting_shares() {
    return { delegator: "", delegatee: "", vesting_shares: undefined };
}
export const delegate_vesting_shares = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.delegator !== "") {
            writer.uint32(10).string(message.delegator);
        }
        if (message.delegatee !== "") {
            writer.uint32(18).string(message.delegatee);
        }
        if (message.vesting_shares !== undefined) {
            asset.encode(message.vesting_shares, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasedelegate_vesting_shares();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.delegator = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.delegatee = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
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
            delegator: isSet(object.delegator) ? String(object.delegator) : "",
            delegatee: isSet(object.delegatee) ? String(object.delegatee) : "",
            vesting_shares: isSet(object.vesting_shares) ? asset.fromJSON(object.vesting_shares) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.delegator !== undefined) {
            obj.delegator = message.delegator;
        }
        if (message.delegatee !== undefined) {
            obj.delegatee = message.delegatee;
        }
        if (message.vesting_shares !== undefined) {
            obj.vesting_shares = asset.toJSON(message.vesting_shares);
        }
        return obj;
    },
    create(base) {
        return delegate_vesting_shares.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasedelegate_vesting_shares();
        message.delegator = (_a = object.delegator) !== null && _a !== void 0 ? _a : "";
        message.delegatee = (_b = object.delegatee) !== null && _b !== void 0 ? _b : "";
        message.vesting_shares = (object.vesting_shares !== undefined && object.vesting_shares !== null)
            ? asset.fromPartial(object.vesting_shares)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
