/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaselegacy_chain_properties() {
    return { account_creation_fee: undefined, maximum_block_size: 0, hbd_interest_rate: 0 };
}
export const legacy_chain_properties = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account_creation_fee !== undefined) {
            asset.encode(message.account_creation_fee, writer.uint32(10).fork()).ldelim();
        }
        if (message.maximum_block_size !== 0) {
            writer.uint32(16).uint32(message.maximum_block_size);
        }
        if (message.hbd_interest_rate !== 0) {
            writer.uint32(24).uint32(message.hbd_interest_rate);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaselegacy_chain_properties();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.account_creation_fee = asset.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.maximum_block_size = reader.uint32();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.hbd_interest_rate = reader.uint32();
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
            account_creation_fee: isSet(object.account_creation_fee)
                ? asset.fromJSON(object.account_creation_fee)
                : undefined,
            maximum_block_size: isSet(object.maximum_block_size) ? Number(object.maximum_block_size) : 0,
            hbd_interest_rate: isSet(object.hbd_interest_rate) ? Number(object.hbd_interest_rate) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account_creation_fee !== undefined) {
            obj.account_creation_fee = asset.toJSON(message.account_creation_fee);
        }
        if (message.maximum_block_size !== 0) {
            obj.maximum_block_size = Math.round(message.maximum_block_size);
        }
        if (message.hbd_interest_rate !== 0) {
            obj.hbd_interest_rate = Math.round(message.hbd_interest_rate);
        }
        return obj;
    },
    create(base) {
        return legacy_chain_properties.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaselegacy_chain_properties();
        message.account_creation_fee = (object.account_creation_fee !== undefined && object.account_creation_fee !== null)
            ? asset.fromPartial(object.account_creation_fee)
            : undefined;
        message.maximum_block_size = (_a = object.maximum_block_size) !== null && _a !== void 0 ? _a : 0;
        message.hbd_interest_rate = (_b = object.hbd_interest_rate) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
