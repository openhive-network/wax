/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasedhf_funding() {
    return { treasury: "", additional_funds: undefined };
}
export const dhf_funding = {
    fromJSON(object) {
        return {
            treasury: isSet(object.treasury) ? globalThis.String(object.treasury) : "",
            additional_funds: isSet(object.additional_funds) ? asset.fromJSON(object.additional_funds) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.treasury !== undefined) {
            obj.treasury = message.treasury;
        }
        if (message.additional_funds !== undefined) {
            obj.additional_funds = asset.toJSON(message.additional_funds);
        }
        return obj;
    },
    create(base) {
        return dhf_funding.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasedhf_funding();
        message.treasury = object.treasury ?? "";
        message.additional_funds = (object.additional_funds !== undefined && object.additional_funds !== null)
            ? asset.fromPartial(object.additional_funds)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
