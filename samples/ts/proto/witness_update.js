/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
import { legacy_chain_properties } from "./legacy_chain_properties.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasewitness_update() {
    return { owner: "", url: "", block_signing_key: "", props: undefined, fee: undefined };
}
export const witness_update = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.owner !== "") {
            writer.uint32(10).string(message.owner);
        }
        if (message.url !== "") {
            writer.uint32(18).string(message.url);
        }
        if (message.block_signing_key !== "") {
            writer.uint32(26).string(message.block_signing_key);
        }
        if (message.props !== undefined) {
            legacy_chain_properties.encode(message.props, writer.uint32(34).fork()).ldelim();
        }
        if (message.fee !== undefined) {
            asset.encode(message.fee, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasewitness_update();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.owner = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.url = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.block_signing_key = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.props = legacy_chain_properties.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.fee = asset.decode(reader, reader.uint32());
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
            owner: isSet(object.owner) ? String(object.owner) : "",
            url: isSet(object.url) ? String(object.url) : "",
            block_signing_key: isSet(object.block_signing_key) ? String(object.block_signing_key) : "",
            props: isSet(object.props) ? legacy_chain_properties.fromJSON(object.props) : undefined,
            fee: isSet(object.fee) ? asset.fromJSON(object.fee) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== undefined) {
            obj.owner = message.owner;
        }
        if (message.url !== undefined) {
            obj.url = message.url;
        }
        if (message.block_signing_key !== undefined) {
            obj.block_signing_key = message.block_signing_key;
        }
        if (message.props !== undefined) {
            obj.props = legacy_chain_properties.toJSON(message.props);
        }
        if (message.fee !== undefined) {
            obj.fee = asset.toJSON(message.fee);
        }
        return obj;
    },
    create(base) {
        return witness_update.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasewitness_update();
        message.owner = (_a = object.owner) !== null && _a !== void 0 ? _a : "";
        message.url = (_b = object.url) !== null && _b !== void 0 ? _b : "";
        message.block_signing_key = (_c = object.block_signing_key) !== null && _c !== void 0 ? _c : "";
        message.props = (object.props !== undefined && object.props !== null)
            ? legacy_chain_properties.fromPartial(object.props)
            : undefined;
        message.fee = (object.fee !== undefined && object.fee !== null) ? asset.fromPartial(object.fee) : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
