/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
import { void_t } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseupdate_proposal_end_date() {
    return { end_date: "" };
}
export const update_proposal_end_date = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.end_date !== "") {
            writer.uint32(10).string(message.end_date);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseupdate_proposal_end_date();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.end_date = reader.string();
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
        return { end_date: isSet(object.end_date) ? String(object.end_date) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.end_date !== undefined) {
            obj.end_date = message.end_date;
        }
        return obj;
    },
    create(base) {
        return update_proposal_end_date.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseupdate_proposal_end_date();
        message.end_date = (_a = object.end_date) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseupdate_proposal_extension() {
    return {};
}
export const update_proposal_extension = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.void_t !== undefined) {
            void_t.encode(message.void_t, writer.uint32(10).fork()).ldelim();
        }
        if (message.update_proposal_end_date !== undefined) {
            update_proposal_end_date.encode(message.update_proposal_end_date, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseupdate_proposal_extension();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.void_t = void_t.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.update_proposal_end_date = update_proposal_end_date.decode(reader, reader.uint32());
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
            void_t: isSet(object.void_t) ? void_t.fromJSON(object.void_t) : undefined,
            update_proposal_end_date: isSet(object.update_proposal_end_date)
                ? update_proposal_end_date.fromJSON(object.update_proposal_end_date)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.void_t !== undefined) {
            obj.void_t = void_t.toJSON(message.void_t);
        }
        if (message.update_proposal_end_date !== undefined) {
            obj.update_proposal_end_date = update_proposal_end_date.toJSON(message.update_proposal_end_date);
        }
        return obj;
    },
    create(base) {
        return update_proposal_extension.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseupdate_proposal_extension();
        message.void_t = (object.void_t !== undefined && object.void_t !== null)
            ? void_t.fromPartial(object.void_t)
            : undefined;
        message.update_proposal_end_date =
            (object.update_proposal_end_date !== undefined && object.update_proposal_end_date !== null)
                ? update_proposal_end_date.fromPartial(object.update_proposal_end_date)
                : undefined;
        return message;
    },
};
function createBaseupdate_proposal() {
    return { proposal_id: "0", creator: "", daily_pay: undefined, subject: "", permlink: "", extensions: [] };
}
export const update_proposal = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.proposal_id !== "0") {
            writer.uint32(8).int64(message.proposal_id);
        }
        if (message.creator !== "") {
            writer.uint32(18).string(message.creator);
        }
        if (message.daily_pay !== undefined) {
            asset.encode(message.daily_pay, writer.uint32(26).fork()).ldelim();
        }
        if (message.subject !== "") {
            writer.uint32(34).string(message.subject);
        }
        if (message.permlink !== "") {
            writer.uint32(42).string(message.permlink);
        }
        for (const v of message.extensions) {
            update_proposal_extension.encode(v, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseupdate_proposal();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.proposal_id = longToString(reader.int64());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.creator = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.daily_pay = asset.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.subject = reader.string();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.permlink = reader.string();
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.extensions.push(update_proposal_extension.decode(reader, reader.uint32()));
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
            proposal_id: isSet(object.proposal_id) ? String(object.proposal_id) : "0",
            creator: isSet(object.creator) ? String(object.creator) : "",
            daily_pay: isSet(object.daily_pay) ? asset.fromJSON(object.daily_pay) : undefined,
            subject: isSet(object.subject) ? String(object.subject) : "",
            permlink: isSet(object.permlink) ? String(object.permlink) : "",
            extensions: Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => update_proposal_extension.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.proposal_id !== undefined) {
            obj.proposal_id = message.proposal_id;
        }
        if (message.creator !== undefined) {
            obj.creator = message.creator;
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
            obj.extensions = message.extensions.map((e) => update_proposal_extension.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return update_proposal.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseupdate_proposal();
        message.proposal_id = (_a = object.proposal_id) !== null && _a !== void 0 ? _a : "0";
        message.creator = (_b = object.creator) !== null && _b !== void 0 ? _b : "";
        message.daily_pay = (object.daily_pay !== undefined && object.daily_pay !== null)
            ? asset.fromPartial(object.daily_pay)
            : undefined;
        message.subject = (_c = object.subject) !== null && _c !== void 0 ? _c : "";
        message.permlink = (_d = object.permlink) !== null && _d !== void 0 ? _d : "";
        message.extensions = ((_e = object.extensions) === null || _e === void 0 ? void 0 : _e.map((e) => update_proposal_extension.fromPartial(e))) || [];
        return message;
    },
};
function longToString(long) {
    return long.toString();
}
if (_m0.util.Long !== Long) {
    _m0.util.Long = Long;
    _m0.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
