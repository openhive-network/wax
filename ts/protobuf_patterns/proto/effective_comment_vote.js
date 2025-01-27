/* eslint-disable */
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
    fromJSON(object) {
        return {
            voter: isSet(object.voter) ? globalThis.String(object.voter) : "",
            author: isSet(object.author) ? globalThis.String(object.author) : "",
            permlink: isSet(object.permlink) ? globalThis.String(object.permlink) : "",
            weight: isSet(object.weight) ? globalThis.String(object.weight) : "0",
            rshares: isSet(object.rshares) ? globalThis.String(object.rshares) : "0",
            total_vote_weight: isSet(object.total_vote_weight) ? globalThis.String(object.total_vote_weight) : "0",
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
        return effective_comment_vote.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseeffective_comment_vote();
        message.voter = object.voter ?? "";
        message.author = object.author ?? "";
        message.permlink = object.permlink ?? "";
        message.weight = object.weight ?? "0";
        message.rshares = object.rshares ?? "0";
        message.total_vote_weight = object.total_vote_weight ?? "0";
        message.pending_payout = (object.pending_payout !== undefined && object.pending_payout !== null)
            ? asset.fromPartial(object.pending_payout)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
