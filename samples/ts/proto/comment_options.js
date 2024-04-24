/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasebeneficiary_route_type() {
    return { account: "", weight: 0 };
}
export const beneficiary_route_type = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account !== "") {
            writer.uint32(10).string(message.account);
        }
        if (message.weight !== 0) {
            writer.uint32(16).uint32(message.weight);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasebeneficiary_route_type();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.account = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.weight = reader.uint32();
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
        return beneficiary_route_type.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasebeneficiary_route_type();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.weight = (_b = object.weight) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function createBasecomment_payout_beneficiaries() {
    return { beneficiaries: [] };
}
export const comment_payout_beneficiaries = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.beneficiaries) {
            beneficiary_route_type.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecomment_payout_beneficiaries();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.beneficiaries.push(beneficiary_route_type.decode(reader, reader.uint32()));
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
            beneficiaries: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.beneficiaries)
                ? object.beneficiaries.map((e) => beneficiary_route_type.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if ((_a = message.beneficiaries) === null || _a === void 0 ? void 0 : _a.length) {
            obj.beneficiaries = message.beneficiaries.map((e) => beneficiary_route_type.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return comment_payout_beneficiaries.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasecomment_payout_beneficiaries();
        message.beneficiaries = ((_a = object.beneficiaries) === null || _a === void 0 ? void 0 : _a.map((e) => beneficiary_route_type.fromPartial(e))) || [];
        return message;
    },
};
function createBasecomment_options_extension() {
    return {};
}
export const comment_options_extension = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.comment_payout_beneficiaries !== undefined) {
            comment_payout_beneficiaries.encode(message.comment_payout_beneficiaries, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecomment_options_extension();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.comment_payout_beneficiaries = comment_payout_beneficiaries.decode(reader, reader.uint32());
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
        return comment_options_extension.fromPartial(base !== null && base !== void 0 ? base : {});
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
    encode(message, writer = _m0.Writer.create()) {
        if (message.author !== "") {
            writer.uint32(10).string(message.author);
        }
        if (message.permlink !== "") {
            writer.uint32(18).string(message.permlink);
        }
        if (message.max_accepted_payout !== undefined) {
            asset.encode(message.max_accepted_payout, writer.uint32(26).fork()).ldelim();
        }
        if (message.percent_hbd !== 0) {
            writer.uint32(32).uint32(message.percent_hbd);
        }
        if (message.allow_votes !== false) {
            writer.uint32(40).bool(message.allow_votes);
        }
        if (message.allow_curation_rewards !== false) {
            writer.uint32(48).bool(message.allow_curation_rewards);
        }
        for (const v of message.extensions) {
            comment_options_extension.encode(v, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecomment_options();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.author = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.permlink = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.max_accepted_payout = asset.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.percent_hbd = reader.uint32();
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.allow_votes = reader.bool();
                    continue;
                case 6:
                    if (tag !== 48) {
                        break;
                    }
                    message.allow_curation_rewards = reader.bool();
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.extensions.push(comment_options_extension.decode(reader, reader.uint32()));
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
            author: isSet(object.author) ? globalThis.String(object.author) : "",
            permlink: isSet(object.permlink) ? globalThis.String(object.permlink) : "",
            max_accepted_payout: isSet(object.max_accepted_payout) ? asset.fromJSON(object.max_accepted_payout) : undefined,
            percent_hbd: isSet(object.percent_hbd) ? globalThis.Number(object.percent_hbd) : 0,
            allow_votes: isSet(object.allow_votes) ? globalThis.Boolean(object.allow_votes) : false,
            allow_curation_rewards: isSet(object.allow_curation_rewards)
                ? globalThis.Boolean(object.allow_curation_rewards)
                : false,
            extensions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => comment_options_extension.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
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
        if ((_a = message.extensions) === null || _a === void 0 ? void 0 : _a.length) {
            obj.extensions = message.extensions.map((e) => comment_options_extension.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return comment_options.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBasecomment_options();
        message.author = (_a = object.author) !== null && _a !== void 0 ? _a : "";
        message.permlink = (_b = object.permlink) !== null && _b !== void 0 ? _b : "";
        message.max_accepted_payout = (object.max_accepted_payout !== undefined && object.max_accepted_payout !== null)
            ? asset.fromPartial(object.max_accepted_payout)
            : undefined;
        message.percent_hbd = (_c = object.percent_hbd) !== null && _c !== void 0 ? _c : 0;
        message.allow_votes = (_d = object.allow_votes) !== null && _d !== void 0 ? _d : false;
        message.allow_curation_rewards = (_e = object.allow_curation_rewards) !== null && _e !== void 0 ? _e : false;
        message.extensions = ((_f = object.extensions) === null || _f === void 0 ? void 0 : _f.map((e) => comment_options_extension.fromPartial(e))) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
