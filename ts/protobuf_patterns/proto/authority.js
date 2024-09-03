/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaseauthority() {
    return { weight_threshold: 0, account_auths: {}, key_auths: {} };
}
export const authority = {
    fromJSON(object) {
        return {
            weight_threshold: isSet(object.weight_threshold) ? globalThis.Number(object.weight_threshold) : 0,
            account_auths: isObject(object.account_auths)
                ? Object.entries(object.account_auths).reduce((acc, [key, value]) => {
                    acc[key] = Number(value);
                    return acc;
                }, {})
                : {},
            key_auths: isObject(object.key_auths)
                ? Object.entries(object.key_auths).reduce((acc, [key, value]) => {
                    acc[key] = Number(value);
                    return acc;
                }, {})
                : {},
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.weight_threshold !== undefined) {
            obj.weight_threshold = Math.round(message.weight_threshold);
        }
        if (message.account_auths) {
            const entries = Object.entries(message.account_auths);
            if (entries.length > 0) {
                obj.account_auths = {};
                entries.forEach(([k, v]) => {
                    obj.account_auths[k] = Math.round(v);
                });
            }
        }
        if (message.key_auths) {
            const entries = Object.entries(message.key_auths);
            if (entries.length > 0) {
                obj.key_auths = {};
                entries.forEach(([k, v]) => {
                    obj.key_auths[k] = Math.round(v);
                });
            }
        }
        return obj;
    },
    create(base) {
        return authority.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseauthority();
        message.weight_threshold = (_a = object.weight_threshold) !== null && _a !== void 0 ? _a : 0;
        message.account_auths = Object.entries((_b = object.account_auths) !== null && _b !== void 0 ? _b : {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = globalThis.Number(value);
            }
            return acc;
        }, {});
        message.key_auths = Object.entries((_c = object.key_auths) !== null && _c !== void 0 ? _c : {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = globalThis.Number(value);
            }
            return acc;
        }, {});
        return message;
    },
};
function createBaseauthority_AccountAuthsEntry() {
    return { key: "", value: 0 };
}
export const authority_AccountAuthsEntry = {
    fromJSON(object) {
        return {
            key: isSet(object.key) ? globalThis.String(object.key) : "",
            value: isSet(object.value) ? globalThis.Number(object.value) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.key !== undefined) {
            obj.key = message.key;
        }
        if (message.value !== undefined) {
            obj.value = Math.round(message.value);
        }
        return obj;
    },
    create(base) {
        return authority_AccountAuthsEntry.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseauthority_AccountAuthsEntry();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : "";
        message.value = (_b = object.value) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function createBaseauthority_KeyAuthsEntry() {
    return { key: "", value: 0 };
}
export const authority_KeyAuthsEntry = {
    fromJSON(object) {
        return {
            key: isSet(object.key) ? globalThis.String(object.key) : "",
            value: isSet(object.value) ? globalThis.Number(object.value) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.key !== undefined) {
            obj.key = message.key;
        }
        if (message.value !== undefined) {
            obj.value = Math.round(message.value);
        }
        return obj;
    },
    create(base) {
        return authority_KeyAuthsEntry.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseauthority_KeyAuthsEntry();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : "";
        message.value = (_b = object.value) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isSet(value) {
    return value !== null && value !== undefined;
}
