/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseproposal_pay() {
    return { proposal_id: 0, receiver: "", payer: "", payment: undefined };
}
export const proposal_pay = {
    fromJSON(object) {
        return {
            proposal_id: isSet(object.proposal_id) ? globalThis.Number(object.proposal_id) : 0,
            receiver: isSet(object.receiver) ? globalThis.String(object.receiver) : "",
            payer: isSet(object.payer) ? globalThis.String(object.payer) : "",
            payment: isSet(object.payment) ? asset.fromJSON(object.payment) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.proposal_id !== undefined) {
            obj.proposal_id = Math.round(message.proposal_id);
        }
        if (message.receiver !== undefined) {
            obj.receiver = message.receiver;
        }
        if (message.payer !== undefined) {
            obj.payer = message.payer;
        }
        if (message.payment !== undefined) {
            obj.payment = asset.toJSON(message.payment);
        }
        return obj;
    },
    create(base) {
        return proposal_pay.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseproposal_pay();
        message.proposal_id = (_a = object.proposal_id) !== null && _a !== void 0 ? _a : 0;
        message.receiver = (_b = object.receiver) !== null && _b !== void 0 ? _b : "";
        message.payer = (_c = object.payer) !== null && _c !== void 0 ? _c : "";
        message.payment = (object.payment !== undefined && object.payment !== null)
            ? asset.fromPartial(object.payment)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
