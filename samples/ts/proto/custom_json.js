/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecustom_json() {
    return { required_auths: [], required_posting_auths: [], id: "", json: "" };
}
export const custom_json = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.required_auths) {
            writer.uint32(10).string(v);
        }
        for (const v of message.required_posting_auths) {
            writer.uint32(18).string(v);
        }
        if (message.id !== "") {
            writer.uint32(26).string(message.id);
        }
        if (message.json !== "") {
            writer.uint32(34).string(message.json);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecustom_json();
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
                    if (tag !== 18) {
                        break;
                    }
                    message.required_posting_auths.push(reader.string());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.id = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.json = reader.string();
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
            required_posting_auths: Array.isArray(object === null || object === void 0 ? void 0 : object.required_posting_auths)
                ? object.required_posting_auths.map((e) => String(e))
                : [],
            id: isSet(object.id) ? String(object.id) : "",
            json: isSet(object.json) ? String(object.json) : "",
        };
    },
    toJSON(message) {
        var _a, _b;
        const obj = {};
        if ((_a = message.required_auths) === null || _a === void 0 ? void 0 : _a.length) {
            obj.required_auths = message.required_auths;
        }
        if ((_b = message.required_posting_auths) === null || _b === void 0 ? void 0 : _b.length) {
            obj.required_posting_auths = message.required_posting_auths;
        }
        if (message.id !== "") {
            obj.id = message.id;
        }
        if (message.json !== "") {
            obj.json = message.json;
        }
        return obj;
    },
    create(base) {
        return custom_json.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBasecustom_json();
        message.required_auths = ((_a = object.required_auths) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        message.required_posting_auths = ((_b = object.required_posting_auths) === null || _b === void 0 ? void 0 : _b.map((e) => e)) || [];
        message.id = (_c = object.id) !== null && _c !== void 0 ? _c : "";
        message.json = (_d = object.json) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
