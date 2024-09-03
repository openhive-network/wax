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
function isSet(value) {
    return value !== null && value !== undefined;
}
