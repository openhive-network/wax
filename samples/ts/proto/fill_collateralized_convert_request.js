/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasefill_collateralized_convert_request() {
    return { owner: "", requestid: 0, amount_in: undefined, amount_out: undefined, excess_collateral: undefined };
}
export const fill_collateralized_convert_request = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.owner !== "") {
            writer.uint32(10).string(message.owner);
        }
        if (message.requestid !== 0) {
            writer.uint32(16).uint32(message.requestid);
        }
        if (message.amount_in !== undefined) {
            asset.encode(message.amount_in, writer.uint32(26).fork()).ldelim();
        }
        if (message.amount_out !== undefined) {
            asset.encode(message.amount_out, writer.uint32(34).fork()).ldelim();
        }
        if (message.excess_collateral !== undefined) {
            asset.encode(message.excess_collateral, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasefill_collateralized_convert_request();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.owner = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.requestid = reader.uint32();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.amount_in = asset.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.amount_out = asset.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.excess_collateral = asset.decode(reader, reader.uint32());
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
            owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
            requestid: isSet(object.requestid) ? globalThis.Number(object.requestid) : 0,
            amount_in: isSet(object.amount_in) ? asset.fromJSON(object.amount_in) : undefined,
            amount_out: isSet(object.amount_out) ? asset.fromJSON(object.amount_out) : undefined,
            excess_collateral: isSet(object.excess_collateral) ? asset.fromJSON(object.excess_collateral) : undefined,
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
        if (message.amount_in !== undefined) {
            obj.amount_in = asset.toJSON(message.amount_in);
        }
        if (message.amount_out !== undefined) {
            obj.amount_out = asset.toJSON(message.amount_out);
        }
        if (message.excess_collateral !== undefined) {
            obj.excess_collateral = asset.toJSON(message.excess_collateral);
        }
        return obj;
    },
    create(base) {
        return fill_collateralized_convert_request.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasefill_collateralized_convert_request();
        message.owner = (_a = object.owner) !== null && _a !== void 0 ? _a : "";
        message.requestid = (_b = object.requestid) !== null && _b !== void 0 ? _b : 0;
        message.amount_in = (object.amount_in !== undefined && object.amount_in !== null)
            ? asset.fromPartial(object.amount_in)
            : undefined;
        message.amount_out = (object.amount_out !== undefined && object.amount_out !== null)
            ? asset.fromPartial(object.amount_out)
            : undefined;
        message.excess_collateral = (object.excess_collateral !== undefined && object.excess_collateral !== null)
            ? asset.fromPartial(object.excess_collateral)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
