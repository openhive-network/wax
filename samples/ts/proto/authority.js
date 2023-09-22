/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseauthority() {
    return { weight_threshold: 0, account_auths: {}, key_auths: {} };
}
export const authority = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.weight_threshold !== 0) {
            writer.uint32(8).uint32(message.weight_threshold);
        }
        Object.entries(message.account_auths).forEach(([key, value]) => {
            authority_AccountAuthsEntry.encode({ key: key, value }, writer.uint32(18).fork()).ldelim();
        });
        Object.entries(message.key_auths).forEach(([key, value]) => {
            authority_KeyAuthsEntry.encode({ key: key, value }, writer.uint32(26).fork()).ldelim();
        });
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseauthority();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.weight_threshold = reader.uint32();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    const entry2 = authority_AccountAuthsEntry.decode(reader, reader.uint32());
                    if (entry2.value !== undefined) {
                        message.account_auths[entry2.key] = entry2.value;
                    }
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    const entry3 = authority_KeyAuthsEntry.decode(reader, reader.uint32());
                    if (entry3.value !== undefined) {
                        message.key_auths[entry3.key] = entry3.value;
                    }
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
            weight_threshold: isSet(object.weight_threshold) ? Number(object.weight_threshold) : 0,
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
        if (message.weight_threshold !== 0) {
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
                acc[key] = Number(value);
            }
            return acc;
        }, {});
        message.key_auths = Object.entries((_c = object.key_auths) !== null && _c !== void 0 ? _c : {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = Number(value);
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
    encode(message, writer = _m0.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== 0) {
            writer.uint32(16).uint32(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseauthority_AccountAuthsEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.key = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.value = reader.uint32();
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
        return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? Number(object.value) : 0 };
    },
    toJSON(message) {
        const obj = {};
        if (message.key !== "") {
            obj.key = message.key;
        }
        if (message.value !== 0) {
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
    encode(message, writer = _m0.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== 0) {
            writer.uint32(16).uint32(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseauthority_KeyAuthsEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.key = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.value = reader.uint32();
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
        return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? Number(object.value) : 0 };
    },
    toJSON(message) {
        const obj = {};
        if (message.key !== "") {
            obj.key = message.key;
        }
        if (message.value !== 0) {
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
