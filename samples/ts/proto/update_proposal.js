/* eslint-disable */
import { asset } from "./asset.js";
import { void_t } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseupdate_proposal_end_date() {
    return { end_date: "" };
}
export const update_proposal_end_date = {
    fromJSON(object) {
        return { end_date: isSet(object.end_date) ? globalThis.String(object.end_date) : "" };
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
    fromJSON(object) {
        return {
            proposal_id: isSet(object.proposal_id) ? globalThis.String(object.proposal_id) : "0",
            creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
            daily_pay: isSet(object.daily_pay) ? asset.fromJSON(object.daily_pay) : undefined,
            subject: isSet(object.subject) ? globalThis.String(object.subject) : "",
            permlink: isSet(object.permlink) ? globalThis.String(object.permlink) : "",
            extensions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
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
function isSet(value) {
    return value !== null && value !== undefined;
}
