/* eslint-disable */
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasewitness_set_properties() {
    return { owner: "", props: {}, extensions: [] };
}
export const witness_set_properties = {
    fromJSON(object) {
        return {
            owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
            props: isObject(object.props)
                ? Object.entries(object.props).reduce((acc, [key, value]) => {
                    acc[key] = String(value);
                    return acc;
                }, {})
                : {},
            extensions: globalThis.Array.isArray(object?.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== undefined) {
            obj.owner = message.owner;
        }
        if (message.props) {
            const entries = Object.entries(message.props);
            if (entries.length > 0) {
                obj.props = {};
                entries.forEach(([k, v]) => {
                    obj.props[k] = v;
                });
            }
        }
        if (message.extensions?.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return witness_set_properties.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasewitness_set_properties();
        message.owner = object.owner ?? "";
        message.props = Object.entries(object.props ?? {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = globalThis.String(value);
            }
            return acc;
        }, {});
        message.extensions = object.extensions?.map((e) => future_extensions.fromPartial(e)) || [];
        return message;
    },
};
function createBasewitness_set_properties_PropsEntry() {
    return { key: "", value: "" };
}
export const witness_set_properties_PropsEntry = {
    fromJSON(object) {
        return {
            key: isSet(object.key) ? globalThis.String(object.key) : "",
            value: isSet(object.value) ? globalThis.String(object.value) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.key !== undefined) {
            obj.key = message.key;
        }
        if (message.value !== undefined) {
            obj.value = message.value;
        }
        return obj;
    },
    create(base) {
        return witness_set_properties_PropsEntry.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasewitness_set_properties_PropsEntry();
        message.key = object.key ?? "";
        message.value = object.value ?? "";
        return message;
    },
};
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isSet(value) {
    return value !== null && value !== undefined;
}
