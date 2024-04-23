/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseeffective_comment_vote() {
    return {
        voter: "",
        author: "",
        permlink: "",
        weight: "0",
        rshares: "0",
        total_vote_weight: "0",
        pending_payout: undefined,
    };
}
export const effective_comment_vote = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.voter !== "") {
            writer.uint32(10).string(message.voter);
        }
        if (message.author !== "") {
            writer.uint32(18).string(message.author);
        }
        if (message.permlink !== "") {
            writer.uint32(26).string(message.permlink);
        }
        if (message.weight !== "0") {
            writer.uint32(32).uint64(message.weight);
        }
        if (message.rshares !== "0") {
            writer.uint32(40).int64(message.rshares);
        }
        if (message.total_vote_weight !== "0") {
            writer.uint32(48).uint64(message.total_vote_weight);
        }
        if (message.pending_payout !== undefined) {
            asset.encode(message.pending_payout, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseeffective_comment_vote();
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
                    if (tag !== 18) {
                        break;
                    }
                    message.author = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.permlink = reader.string();
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.weight = longToString(reader.uint64());
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.rshares = longToString(reader.int64());
                    continue;
                case 6:
                    if (tag !== 48) {
                        break;
                    }
                    message.total_vote_weight = longToString(reader.uint64());
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.pending_payout = asset.decode(reader, reader.uint32());
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
            voter: isSet(object.voter) ? String(object.voter) : "",
            author: isSet(object.author) ? String(object.author) : "",
            permlink: isSet(object.permlink) ? String(object.permlink) : "",
            weight: isSet(object.weight) ? String(object.weight) : "0",
            rshares: isSet(object.rshares) ? String(object.rshares) : "0",
            total_vote_weight: isSet(object.total_vote_weight) ? String(object.total_vote_weight) : "0",
            pending_payout: isSet(object.pending_payout) ? asset.fromJSON(object.pending_payout) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.voter !== undefined) {
            obj.voter = message.voter;
        }
        if (message.author !== undefined) {
            obj.author = message.author;
        }
        if (message.permlink !== undefined) {
            obj.permlink = message.permlink;
        }
        if (message.weight !== undefined) {
            obj.weight = message.weight;
        }
        if (message.rshares !== undefined) {
            obj.rshares = message.rshares;
        }
        if (message.total_vote_weight !== undefined) {
            obj.total_vote_weight = message.total_vote_weight;
        }
        if (message.pending_payout !== undefined) {
            obj.pending_payout = asset.toJSON(message.pending_payout);
        }
        return obj;
    },
    create(base) {
        return effective_comment_vote.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseeffective_comment_vote();
        message.voter = (_a = object.voter) !== null && _a !== void 0 ? _a : "";
        message.author = (_b = object.author) !== null && _b !== void 0 ? _b : "";
        message.permlink = (_c = object.permlink) !== null && _c !== void 0 ? _c : "";
        message.weight = (_d = object.weight) !== null && _d !== void 0 ? _d : "0";
        message.rshares = (_e = object.rshares) !== null && _e !== void 0 ? _e : "0";
        message.total_vote_weight = (_f = object.total_vote_weight) !== null && _f !== void 0 ? _f : "0";
        message.pending_payout = (object.pending_payout !== undefined && object.pending_payout !== null)
            ? asset.fromPartial(object.pending_payout)
            : undefined;
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
