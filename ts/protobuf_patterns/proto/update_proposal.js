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
        return update_proposal_end_date.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseupdate_proposal_end_date();
        message.end_date = object.end_date ?? "";
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
        return update_proposal_extension.fromPartial(base ?? {});
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
            extensions: globalThis.Array.isArray(object?.extensions)
                ? object.extensions.map((e) => update_proposal_extension.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
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
        if (message.extensions?.length) {
            obj.extensions = message.extensions.map((e) => update_proposal_extension.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return update_proposal.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseupdate_proposal();
        message.proposal_id = object.proposal_id ?? "0";
        message.creator = object.creator ?? "";
        message.daily_pay = (object.daily_pay !== undefined && object.daily_pay !== null)
            ? asset.fromPartial(object.daily_pay)
            : undefined;
        message.subject = object.subject ?? "";
        message.permlink = object.permlink ?? "";
        message.extensions = object.extensions?.map((e) => update_proposal_extension.fromPartial(e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
