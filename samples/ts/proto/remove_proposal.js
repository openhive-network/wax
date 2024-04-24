/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseremove_proposal() {
    return { proposal_owner: "", proposal_ids: [], extensions: [] };
}
export const remove_proposal = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.proposal_owner !== "") {
            writer.uint32(10).string(message.proposal_owner);
        }
        writer.uint32(18).fork();
        for (const v of message.proposal_ids) {
            writer.int64(v);
        }
        writer.ldelim();
        for (const v of message.extensions) {
            future_extensions.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseremove_proposal();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.proposal_owner = reader.string();
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
                    if (tag !== 26) {
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
            proposal_owner: isSet(object.proposal_owner) ? globalThis.String(object.proposal_owner) : "",
            proposal_ids: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.proposal_ids)
                ? object.proposal_ids.map((e) => globalThis.String(e))
                : [],
            extensions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a, _b;
        const obj = {};
        if (message.proposal_owner !== undefined) {
            obj.proposal_owner = message.proposal_owner;
        }
        if ((_a = message.proposal_ids) === null || _a === void 0 ? void 0 : _a.length) {
            obj.proposal_ids = message.proposal_ids;
        }
        if ((_b = message.extensions) === null || _b === void 0 ? void 0 : _b.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return remove_proposal.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseremove_proposal();
        message.proposal_owner = (_a = object.proposal_owner) !== null && _a !== void 0 ? _a : "";
        message.proposal_ids = ((_b = object.proposal_ids) === null || _b === void 0 ? void 0 : _b.map((e) => e)) || [];
        message.extensions = ((_c = object.extensions) === null || _c === void 0 ? void 0 : _c.map((e) => future_extensions.fromPartial(e))) || [];
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
