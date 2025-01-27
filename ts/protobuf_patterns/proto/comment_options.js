/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasebeneficiary_route_type() {
    return { account: "", weight: 0 };
}
export const beneficiary_route_type = {
    fromJSON(object) {
        return {
            account: isSet(object.account) ? globalThis.String(object.account) : "",
            weight: isSet(object.weight) ? globalThis.Number(object.weight) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        if (message.weight !== undefined) {
            obj.weight = Math.round(message.weight);
        }
        return obj;
    },
    create(base) {
        return beneficiary_route_type.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasebeneficiary_route_type();
        message.account = object.account ?? "";
        message.weight = object.weight ?? 0;
        return message;
    },
};
function createBasecomment_payout_beneficiaries() {
    return { beneficiaries: [] };
}
export const comment_payout_beneficiaries = {
    fromJSON(object) {
        return {
            beneficiaries: globalThis.Array.isArray(object?.beneficiaries)
                ? object.beneficiaries.map((e) => beneficiary_route_type.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.beneficiaries?.length) {
            obj.beneficiaries = message.beneficiaries.map((e) => beneficiary_route_type.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return comment_payout_beneficiaries.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasecomment_payout_beneficiaries();
        message.beneficiaries = object.beneficiaries?.map((e) => beneficiary_route_type.fromPartial(e)) || [];
        return message;
    },
};
function createBasecomment_options_extension() {
    return {};
}
export const comment_options_extension = {
    fromJSON(object) {
        return {
            comment_payout_beneficiaries: isSet(object.comment_payout_beneficiaries)
                ? comment_payout_beneficiaries.fromJSON(object.comment_payout_beneficiaries)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.comment_payout_beneficiaries !== undefined) {
            obj.comment_payout_beneficiaries = comment_payout_beneficiaries.toJSON(message.comment_payout_beneficiaries);
        }
        return obj;
    },
    create(base) {
        return comment_options_extension.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasecomment_options_extension();
        message.comment_payout_beneficiaries =
            (object.comment_payout_beneficiaries !== undefined && object.comment_payout_beneficiaries !== null)
                ? comment_payout_beneficiaries.fromPartial(object.comment_payout_beneficiaries)
                : undefined;
        return message;
    },
};
function createBasecomment_options() {
    return {
        author: "",
        permlink: "",
        max_accepted_payout: undefined,
        percent_hbd: 0,
        allow_votes: false,
        allow_curation_rewards: false,
        extensions: [],
    };
}
export const comment_options = {
    fromJSON(object) {
        return {
            author: isSet(object.author) ? globalThis.String(object.author) : "",
            permlink: isSet(object.permlink) ? globalThis.String(object.permlink) : "",
            max_accepted_payout: isSet(object.max_accepted_payout) ? asset.fromJSON(object.max_accepted_payout) : undefined,
            percent_hbd: isSet(object.percent_hbd) ? globalThis.Number(object.percent_hbd) : 0,
            allow_votes: isSet(object.allow_votes) ? globalThis.Boolean(object.allow_votes) : false,
            allow_curation_rewards: isSet(object.allow_curation_rewards)
                ? globalThis.Boolean(object.allow_curation_rewards)
                : false,
            extensions: globalThis.Array.isArray(object?.extensions)
                ? object.extensions.map((e) => comment_options_extension.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.author !== undefined) {
            obj.author = message.author;
        }
        if (message.permlink !== undefined) {
            obj.permlink = message.permlink;
        }
        if (message.max_accepted_payout !== undefined) {
            obj.max_accepted_payout = asset.toJSON(message.max_accepted_payout);
        }
        if (message.percent_hbd !== undefined) {
            obj.percent_hbd = Math.round(message.percent_hbd);
        }
        if (message.allow_votes !== undefined) {
            obj.allow_votes = message.allow_votes;
        }
        if (message.allow_curation_rewards !== undefined) {
            obj.allow_curation_rewards = message.allow_curation_rewards;
        }
        if (message.extensions?.length) {
            obj.extensions = message.extensions.map((e) => comment_options_extension.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return comment_options.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasecomment_options();
        message.author = object.author ?? "";
        message.permlink = object.permlink ?? "";
        message.max_accepted_payout = (object.max_accepted_payout !== undefined && object.max_accepted_payout !== null)
            ? asset.fromPartial(object.max_accepted_payout)
            : undefined;
        message.percent_hbd = object.percent_hbd ?? 0;
        message.allow_votes = object.allow_votes ?? false;
        message.allow_curation_rewards = object.allow_curation_rewards ?? false;
        message.extensions = object.extensions?.map((e) => comment_options_extension.fromPartial(e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
