/* eslint-disable */
import { asset } from "./asset.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecreate_proposal() {
    return {
        creator: "",
        receiver: "",
        start_date: "",
        end_date: "",
        daily_pay: undefined,
        subject: "",
        permlink: "",
        extensions: [],
    };
}
export const create_proposal = {
    fromJSON(object) {
        return {
            creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
            receiver: isSet(object.receiver) ? globalThis.String(object.receiver) : "",
            start_date: isSet(object.start_date) ? globalThis.String(object.start_date) : "",
            end_date: isSet(object.end_date) ? globalThis.String(object.end_date) : "",
            daily_pay: isSet(object.daily_pay) ? asset.fromJSON(object.daily_pay) : undefined,
            subject: isSet(object.subject) ? globalThis.String(object.subject) : "",
            permlink: isSet(object.permlink) ? globalThis.String(object.permlink) : "",
            extensions: globalThis.Array.isArray(object?.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.creator !== undefined) {
            obj.creator = message.creator;
        }
        if (message.receiver !== undefined) {
            obj.receiver = message.receiver;
        }
        if (message.start_date !== undefined) {
            obj.start_date = message.start_date;
        }
        if (message.end_date !== undefined) {
            obj.end_date = message.end_date;
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
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return create_proposal.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasecreate_proposal();
        message.creator = object.creator ?? "";
        message.receiver = object.receiver ?? "";
        message.start_date = object.start_date ?? "";
        message.end_date = object.end_date ?? "";
        message.daily_pay = (object.daily_pay !== undefined && object.daily_pay !== null)
            ? asset.fromPartial(object.daily_pay)
            : undefined;
        message.subject = object.subject ?? "";
        message.permlink = object.permlink ?? "";
        message.extensions = object.extensions?.map((e) => future_extensions.fromPartial(e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
