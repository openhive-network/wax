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
function isSet(value) {
    return value !== null && value !== undefined;
}
