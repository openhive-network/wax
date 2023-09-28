/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseproposal_pay() {
    return { proposal_id: 0, receiver: "", payer: "", payment: undefined };
}
export const proposal_pay = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.proposal_id !== 0) {
            writer.uint32(8).uint32(message.proposal_id);
        }
        if (message.receiver !== "") {
            writer.uint32(18).string(message.receiver);
        }
        if (message.payer !== "") {
            writer.uint32(26).string(message.payer);
        }
        if (message.payment !== undefined) {
            asset.encode(message.payment, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseproposal_pay();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.proposal_id = reader.uint32();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.receiver = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.payer = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.payment = asset.decode(reader, reader.uint32());
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
            proposal_id: isSet(object.proposal_id) ? Number(object.proposal_id) : 0,
            receiver: isSet(object.receiver) ? String(object.receiver) : "",
            payer: isSet(object.payer) ? String(object.payer) : "",
            payment: isSet(object.payment) ? asset.fromJSON(object.payment) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.proposal_id !== 0) {
            obj.proposal_id = Math.round(message.proposal_id);
        }
        if (message.receiver !== "") {
            obj.receiver = message.receiver;
        }
        if (message.payer !== "") {
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
