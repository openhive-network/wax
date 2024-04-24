/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasedhf_funding() {
    return { treasury: "", additional_funds: undefined };
}
export const dhf_funding = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.treasury !== "") {
            writer.uint32(10).string(message.treasury);
        }
        if (message.additional_funds !== undefined) {
            asset.encode(message.additional_funds, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasedhf_funding();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.treasury = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.additional_funds = asset.decode(reader, reader.uint32());
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
        return dhf_funding.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasedhf_funding();
        message.treasury = (_a = object.treasury) !== null && _a !== void 0 ? _a : "";
        message.additional_funds = (object.additional_funds !== undefined && object.additional_funds !== null)
            ? asset.fromPartial(object.additional_funds)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
