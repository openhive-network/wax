/* eslint-disable */
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseupdate_proposal_votes() {
    return { voter: "", proposal_ids: [], approve: false, extensions: [] };
}
export const update_proposal_votes = {
    fromJSON(object) {
        return {
            voter: isSet(object.voter) ? globalThis.String(object.voter) : "",
            proposal_ids: globalThis.Array.isArray(object?.proposal_ids)
                ? object.proposal_ids.map((e) => globalThis.String(e))
                : [],
            approve: isSet(object.approve) ? globalThis.Boolean(object.approve) : false,
            extensions: globalThis.Array.isArray(object?.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.voter !== undefined) {
            obj.voter = message.voter;
        }
        if (message.proposal_ids?.length) {
            obj.proposal_ids = message.proposal_ids;
        }
        if (message.approve !== undefined) {
            obj.approve = message.approve;
        }
        if (message.extensions?.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return update_proposal_votes.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseupdate_proposal_votes();
        message.voter = object.voter ?? "";
        message.proposal_ids = object.proposal_ids?.map((e) => e) || [];
        message.approve = object.approve ?? false;
        message.extensions = object.extensions?.map((e) => future_extensions.fromPartial(e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
