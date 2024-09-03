/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseproposal_fee() {
    return { creator: "", treasury: "", proposal_id: 0, fee: undefined };
}
export const proposal_fee = {
    fromJSON(object) {
        return {
            creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
            treasury: isSet(object.treasury) ? globalThis.String(object.treasury) : "",
            proposal_id: isSet(object.proposal_id) ? globalThis.Number(object.proposal_id) : 0,
            fee: isSet(object.fee) ? asset.fromJSON(object.fee) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.creator !== undefined) {
            obj.creator = message.creator;
        }
        if (message.treasury !== undefined) {
            obj.treasury = message.treasury;
        }
        if (message.proposal_id !== undefined) {
            obj.proposal_id = Math.round(message.proposal_id);
        }
        if (message.fee !== undefined) {
            obj.fee = asset.toJSON(message.fee);
        }
        return obj;
    },
    create(base) {
        return proposal_fee.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseproposal_fee();
        message.creator = (_a = object.creator) !== null && _a !== void 0 ? _a : "";
        message.treasury = (_b = object.treasury) !== null && _b !== void 0 ? _b : "";
        message.proposal_id = (_c = object.proposal_id) !== null && _c !== void 0 ? _c : 0;
        message.fee = (object.fee !== undefined && object.fee !== null) ? asset.fromPartial(object.fee) : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
