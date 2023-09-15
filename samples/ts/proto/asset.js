import * as _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseasset() {
    return { amount: "", precision: 0, nai: "" };
}
export const asset = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.amount !== "") {
            writer.uint32(10).string(message.amount);
        }
        if (message.precision !== 0) {
            writer.uint32(16).uint32(message.precision);
        }
        if (message.nai !== "") {
            writer.uint32(26).string(message.nai);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseasset();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.amount = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.precision = reader.uint32();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.nai = reader.string();
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
            amount: isSet(object.amount) ? String(object.amount) : "",
            precision: isSet(object.precision) ? Number(object.precision) : 0,
            nai: isSet(object.nai) ? String(object.nai) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.amount !== "") {
            obj.amount = message.amount;
        }
        if (message.precision !== 0) {
            obj.precision = Math.round(message.precision);
        }
        if (message.nai !== "") {
            obj.nai = message.nai;
        }
        return obj;
    },
    create(base) {
        return asset.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseasset();
        message.amount = (_a = object.amount) !== null && _a !== void 0 ? _a : "";
        message.precision = (_b = object.precision) !== null && _b !== void 0 ? _b : 0;
        message.nai = (_c = object.nai) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
