/* eslint-disable */
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasedelegate_rc() {
    return { from: "", delegatees: [], max_rc: "0", extensions: [] };
}
export const delegate_rc = {
    fromJSON(object) {
        return {
            from: isSet(object.from) ? globalThis.String(object.from) : "",
            delegatees: globalThis.Array.isArray(object?.delegatees)
                ? object.delegatees.map((e) => globalThis.String(e))
                : [],
            max_rc: isSet(object.max_rc) ? globalThis.String(object.max_rc) : "0",
            extensions: globalThis.Array.isArray(object?.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.from !== undefined) {
            obj.from = message.from;
        }
        if (message.delegatees?.length) {
            obj.delegatees = message.delegatees;
        }
        if (message.max_rc !== undefined) {
            obj.max_rc = message.max_rc;
        }
        if (message.extensions?.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return delegate_rc.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasedelegate_rc();
        message.from = object.from ?? "";
        message.delegatees = object.delegatees?.map((e) => e) || [];
        message.max_rc = object.max_rc ?? "0";
        message.extensions = object.extensions?.map((e) => future_extensions.fromPartial(e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
