/* eslint-disable */
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseremove_proposal() {
    return { proposal_owner: "", proposal_ids: [], extensions: [] };
}
export const remove_proposal = {
    fromJSON(object) {
        return {
            proposal_owner: isSet(object.proposal_owner) ? globalThis.String(object.proposal_owner) : "",
            proposal_ids: globalThis.Array.isArray(object?.proposal_ids)
                ? object.proposal_ids.map((e) => globalThis.String(e))
                : [],
            extensions: globalThis.Array.isArray(object?.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.proposal_owner !== undefined) {
            obj.proposal_owner = message.proposal_owner;
        }
        if (message.proposal_ids?.length) {
            obj.proposal_ids = message.proposal_ids;
        }
        if (message.extensions?.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return remove_proposal.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseremove_proposal();
        message.proposal_owner = object.proposal_owner ?? "";
        message.proposal_ids = object.proposal_ids?.map((e) => e) || [];
        message.extensions = object.extensions?.map((e) => future_extensions.fromPartial(e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
