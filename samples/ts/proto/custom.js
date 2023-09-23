/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecustom() {
    return { required_auths: [], id: 0, data: "" };
}
export const custom = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.required_auths) {
            writer.uint32(10).string(v);
        }
        if (message.id !== 0) {
            writer.uint32(16).uint32(message.id);
        }
        if (message.data !== "") {
            writer.uint32(26).string(message.data);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecustom();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.required_auths.push(reader.string());
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.id = reader.uint32();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.data = reader.string();
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
            required_auths: Array.isArray(object === null || object === void 0 ? void 0 : object.required_auths) ? object.required_auths.map((e) => String(e)) : [],
            id: isSet(object.id) ? Number(object.id) : 0,
            data: isSet(object.data) ? String(object.data) : "",
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if ((_a = message.required_auths) === null || _a === void 0 ? void 0 : _a.length) {
            obj.required_auths = message.required_auths;
        }
        if (message.id !== 0) {
            obj.id = Math.round(message.id);
        }
        if (message.data !== "") {
            obj.data = message.data;
        }
        return obj;
    },
    create(base) {
        return custom.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasecustom();
        message.required_auths = ((_a = object.required_auths) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        message.id = (_b = object.id) !== null && _b !== void 0 ? _b : 0;
        message.data = (_c = object.data) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
