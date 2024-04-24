/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecreate_proposal() {
    return {
        creator: "",
        receiver: "",
        start_date: "",
        end_date: "",
        daily_pay: undefined,
        subject: "",
        permlink: "",
        extensions: [],
    };
}
export const create_proposal = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.creator !== "") {
            writer.uint32(10).string(message.creator);
        }
        if (message.receiver !== "") {
            writer.uint32(18).string(message.receiver);
        }
        if (message.start_date !== "") {
            writer.uint32(26).string(message.start_date);
        }
        if (message.end_date !== "") {
            writer.uint32(34).string(message.end_date);
        }
        if (message.daily_pay !== undefined) {
            asset.encode(message.daily_pay, writer.uint32(42).fork()).ldelim();
        }
        if (message.subject !== "") {
            writer.uint32(50).string(message.subject);
        }
        if (message.permlink !== "") {
            writer.uint32(58).string(message.permlink);
        }
        for (const v of message.extensions) {
            future_extensions.encode(v, writer.uint32(66).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecreate_proposal();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.creator = reader.string();
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
                    message.start_date = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.end_date = reader.string();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.daily_pay = asset.decode(reader, reader.uint32());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.subject = reader.string();
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.permlink = reader.string();
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.extensions.push(future_extensions.decode(reader, reader.uint32()));
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
            creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
            receiver: isSet(object.receiver) ? globalThis.String(object.receiver) : "",
            start_date: isSet(object.start_date) ? globalThis.String(object.start_date) : "",
            end_date: isSet(object.end_date) ? globalThis.String(object.end_date) : "",
            daily_pay: isSet(object.daily_pay) ? asset.fromJSON(object.daily_pay) : undefined,
            subject: isSet(object.subject) ? globalThis.String(object.subject) : "",
            permlink: isSet(object.permlink) ? globalThis.String(object.permlink) : "",
            extensions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.creator !== undefined) {
            obj.creator = message.creator;
        }
        if (message.receiver !== undefined) {
            obj.receiver = message.receiver;
        }
        if (message.start_date !== undefined) {
            obj.start_date = message.start_date;
        }
        if (message.end_date !== undefined) {
            obj.end_date = message.end_date;
        }
        if (message.daily_pay !== undefined) {
            obj.daily_pay = asset.toJSON(message.daily_pay);
        }
        if (message.subject !== undefined) {
            obj.subject = message.subject;
        }
        if (message.permlink !== undefined) {
            obj.permlink = message.permlink;
        }
        if ((_a = message.extensions) === null || _a === void 0 ? void 0 : _a.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return create_proposal.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBasecreate_proposal();
        message.creator = (_a = object.creator) !== null && _a !== void 0 ? _a : "";
        message.receiver = (_b = object.receiver) !== null && _b !== void 0 ? _b : "";
        message.start_date = (_c = object.start_date) !== null && _c !== void 0 ? _c : "";
        message.end_date = (_d = object.end_date) !== null && _d !== void 0 ? _d : "";
        message.daily_pay = (object.daily_pay !== undefined && object.daily_pay !== null)
            ? asset.fromPartial(object.daily_pay)
            : undefined;
        message.subject = (_e = object.subject) !== null && _e !== void 0 ? _e : "";
        message.permlink = (_f = object.permlink) !== null && _f !== void 0 ? _f : "";
        message.extensions = ((_g = object.extensions) === null || _g === void 0 ? void 0 : _g.map((e) => future_extensions.fromPartial(e))) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
