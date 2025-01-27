/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaselegacy_chain_properties() {
    return { account_creation_fee: undefined, maximum_block_size: 0, hbd_interest_rate: 0 };
}
export const legacy_chain_properties = {
    fromJSON(object) {
        return {
            account_creation_fee: isSet(object.account_creation_fee)
                ? asset.fromJSON(object.account_creation_fee)
                : undefined,
            maximum_block_size: isSet(object.maximum_block_size) ? globalThis.Number(object.maximum_block_size) : 0,
            hbd_interest_rate: isSet(object.hbd_interest_rate) ? globalThis.Number(object.hbd_interest_rate) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account_creation_fee !== undefined) {
            obj.account_creation_fee = asset.toJSON(message.account_creation_fee);
        }
        if (message.maximum_block_size !== undefined) {
            obj.maximum_block_size = Math.round(message.maximum_block_size);
        }
        if (message.hbd_interest_rate !== undefined) {
            obj.hbd_interest_rate = Math.round(message.hbd_interest_rate);
        }
        return obj;
    },
    create(base) {
        return legacy_chain_properties.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaselegacy_chain_properties();
        message.account_creation_fee = (object.account_creation_fee !== undefined && object.account_creation_fee !== null)
            ? asset.fromPartial(object.account_creation_fee)
            : undefined;
        message.maximum_block_size = object.maximum_block_size ?? 0;
        message.hbd_interest_rate = object.hbd_interest_rate ?? 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
