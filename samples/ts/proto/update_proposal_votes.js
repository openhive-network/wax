/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseupdate_proposal_votes() {
    return { voter: "", proposal_ids: [], approve: false, extensions: [] };
}
export const update_proposal_votes = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.voter !== "") {
            writer.uint32(10).string(message.voter);
        }
        writer.uint32(18).fork();
        for (const v of message.proposal_ids) {
            writer.int64(v);
        }
        writer.ldelim();
        if (message.approve !== false) {
            writer.uint32(24).bool(message.approve);
        }
        for (const v of message.extensions) {
            future_extensions.encode(v, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseupdate_proposal_votes();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.voter = reader.string();
                    continue;
                case 2:
                    if (tag === 16) {
                        message.proposal_ids.push(longToString(reader.int64()));
                        continue;
                    }
                    if (tag === 18) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.proposal_ids.push(longToString(reader.int64()));
                        }
                        continue;
                    }
                    break;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.approve = reader.bool();
                    continue;
                case 4:
                    if (tag !== 34) {
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
            voter: isSet(object.voter) ? globalThis.String(object.voter) : "",
            proposal_ids: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.proposal_ids)
                ? object.proposal_ids.map((e) => globalThis.String(e))
                : [],
            approve: isSet(object.approve) ? globalThis.Boolean(object.approve) : false,
            extensions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a, _b;
        const obj = {};
        if (message.voter !== undefined) {
            obj.voter = message.voter;
        }
        if ((_a = message.proposal_ids) === null || _a === void 0 ? void 0 : _a.length) {
            obj.proposal_ids = message.proposal_ids;
        }
        if (message.approve !== undefined) {
            obj.approve = message.approve;
        }
        if ((_b = message.extensions) === null || _b === void 0 ? void 0 : _b.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return update_proposal_votes.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseupdate_proposal_votes();
        message.voter = (_a = object.voter) !== null && _a !== void 0 ? _a : "";
        message.proposal_ids = ((_b = object.proposal_ids) === null || _b === void 0 ? void 0 : _b.map((e) => e)) || [];
        message.approve = (_c = object.approve) !== null && _c !== void 0 ? _c : false;
        message.extensions = ((_d = object.extensions) === null || _d === void 0 ? void 0 : _d.map((e) => future_extensions.fromPartial(e))) || [];
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
