/* eslint-disable */
import { asset } from "./asset.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseclaim_account() {
    return { creator: "", fee: undefined, extensions: [] };
}
export const claim_account = {
    fromJSON(object) {
        return {
            creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
            fee: isSet(object.fee) ? asset.fromJSON(object.fee) : undefined,
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
        if (message.fee !== undefined) {
            obj.fee = asset.toJSON(message.fee);
        }
        if (message.extensions?.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return claim_account.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseclaim_account();
        message.creator = object.creator ?? "";
        message.fee = (object.fee !== undefined && object.fee !== null) ? asset.fromPartial(object.fee) : undefined;
        message.extensions = object.extensions?.map((e) => future_extensions.fromPartial(e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
