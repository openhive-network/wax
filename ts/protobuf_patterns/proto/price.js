/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseprice() {
    return { base: undefined, quote: undefined };
}
export const price = {
    fromJSON(object) {
        return {
            base: isSet(object.base) ? asset.fromJSON(object.base) : undefined,
            quote: isSet(object.quote) ? asset.fromJSON(object.quote) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.base !== undefined) {
            obj.base = asset.toJSON(message.base);
        }
        if (message.quote !== undefined) {
            obj.quote = asset.toJSON(message.quote);
        }
        return obj;
    },
    create(base) {
        return price.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseprice();
        message.base = (object.base !== undefined && object.base !== null) ? asset.fromPartial(object.base) : undefined;
        message.quote = (object.quote !== undefined && object.quote !== null) ? asset.fromPartial(object.quote) : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
