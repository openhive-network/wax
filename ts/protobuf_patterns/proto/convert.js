/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseconvert() {
    return { owner: "", requestid: 0, amount: undefined };
}
export const convert = {
    fromJSON(object) {
        return {
            owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
            requestid: isSet(object.requestid) ? globalThis.Number(object.requestid) : 0,
            amount: isSet(object.amount) ? asset.fromJSON(object.amount) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== undefined) {
            obj.owner = message.owner;
        }
        if (message.requestid !== undefined) {
            obj.requestid = Math.round(message.requestid);
        }
        if (message.amount !== undefined) {
            obj.amount = asset.toJSON(message.amount);
        }
        return obj;
    },
    create(base) {
        return convert.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseconvert();
        message.owner = object.owner ?? "";
        message.requestid = object.requestid ?? 0;
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? asset.fromPartial(object.amount)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
