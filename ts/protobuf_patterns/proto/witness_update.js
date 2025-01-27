/* eslint-disable */
import { asset } from "./asset.js";
import { legacy_chain_properties } from "./legacy_chain_properties.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasewitness_update() {
    return { owner: "", url: "", block_signing_key: "", props: undefined, fee: undefined };
}
export const witness_update = {
    fromJSON(object) {
        return {
            owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
            url: isSet(object.url) ? globalThis.String(object.url) : "",
            block_signing_key: isSet(object.block_signing_key) ? globalThis.String(object.block_signing_key) : "",
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
        return witness_update.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasewitness_update();
        message.owner = object.owner ?? "";
        message.url = object.url ?? "";
        message.block_signing_key = object.block_signing_key ?? "";
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
