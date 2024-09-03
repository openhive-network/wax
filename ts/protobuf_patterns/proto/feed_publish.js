/* eslint-disable */
import { price } from "./price.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasefeed_publish() {
    return { publisher: "", exchange_rate: undefined };
}
export const feed_publish = {
    fromJSON(object) {
        return {
            publisher: isSet(object.publisher) ? globalThis.String(object.publisher) : "",
            exchange_rate: isSet(object.exchange_rate) ? price.fromJSON(object.exchange_rate) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.publisher !== undefined) {
            obj.publisher = message.publisher;
        }
        if (message.exchange_rate !== undefined) {
            obj.exchange_rate = price.toJSON(message.exchange_rate);
        }
        return obj;
    },
    create(base) {
        return feed_publish.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasefeed_publish();
        message.publisher = (_a = object.publisher) !== null && _a !== void 0 ? _a : "";
        message.exchange_rate = (object.exchange_rate !== undefined && object.exchange_rate !== null)
            ? price.fromPartial(object.exchange_rate)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
