/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
import { void_t } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaserecurrent_transfer_pair_id() {
    return { pair_id: 0 };
}
export const recurrent_transfer_pair_id = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.pair_id !== 0) {
            writer.uint32(8).uint32(message.pair_id);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaserecurrent_transfer_pair_id();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.pair_id = reader.uint32();
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
        return { pair_id: isSet(object.pair_id) ? Number(object.pair_id) : 0 };
    },
    toJSON(message) {
        const obj = {};
        if (message.pair_id !== undefined) {
            obj.pair_id = Math.round(message.pair_id);
        }
        return obj;
    },
    create(base) {
        return recurrent_transfer_pair_id.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaserecurrent_transfer_pair_id();
        message.pair_id = (_a = object.pair_id) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
function createBaserecurrent_transfer_extension() {
    return {};
}
export const recurrent_transfer_extension = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.void_t !== undefined) {
            void_t.encode(message.void_t, writer.uint32(10).fork()).ldelim();
        }
        if (message.recurrent_transfer_pair_id !== undefined) {
            recurrent_transfer_pair_id.encode(message.recurrent_transfer_pair_id, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaserecurrent_transfer_extension();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.void_t = void_t.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.recurrent_transfer_pair_id = recurrent_transfer_pair_id.decode(reader, reader.uint32());
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
            void_t: isSet(object.void_t) ? void_t.fromJSON(object.void_t) : undefined,
            recurrent_transfer_pair_id: isSet(object.recurrent_transfer_pair_id)
                ? recurrent_transfer_pair_id.fromJSON(object.recurrent_transfer_pair_id)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.void_t !== undefined) {
            obj.void_t = void_t.toJSON(message.void_t);
        }
        if (message.recurrent_transfer_pair_id !== undefined) {
            obj.recurrent_transfer_pair_id = recurrent_transfer_pair_id.toJSON(message.recurrent_transfer_pair_id);
        }
        return obj;
    },
    create(base) {
        return recurrent_transfer_extension.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaserecurrent_transfer_extension();
        message.void_t = (object.void_t !== undefined && object.void_t !== null)
            ? void_t.fromPartial(object.void_t)
            : undefined;
        message.recurrent_transfer_pair_id =
            (object.recurrent_transfer_pair_id !== undefined && object.recurrent_transfer_pair_id !== null)
                ? recurrent_transfer_pair_id.fromPartial(object.recurrent_transfer_pair_id)
                : undefined;
        return message;
    },
};
function createBaserecurrent_transfer() {
    return {
        from_account: "",
        to_account: "",
        amount: undefined,
        memo: "",
        recurrence: 0,
        executions: 0,
        extensions: [],
    };
}
export const recurrent_transfer = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.from_account !== "") {
            writer.uint32(10).string(message.from_account);
        }
        if (message.to_account !== "") {
            writer.uint32(18).string(message.to_account);
        }
        if (message.amount !== undefined) {
            asset.encode(message.amount, writer.uint32(26).fork()).ldelim();
        }
        if (message.memo !== "") {
            writer.uint32(34).string(message.memo);
        }
        if (message.recurrence !== 0) {
            writer.uint32(40).uint32(message.recurrence);
        }
        if (message.executions !== 0) {
            writer.uint32(48).uint32(message.executions);
        }
        for (const v of message.extensions) {
            recurrent_transfer_extension.encode(v, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaserecurrent_transfer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.from_account = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.to_account = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.amount = asset.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.memo = reader.string();
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.recurrence = reader.uint32();
                    continue;
                case 6:
                    if (tag !== 48) {
                        break;
                    }
                    message.executions = reader.uint32();
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.extensions.push(recurrent_transfer_extension.decode(reader, reader.uint32()));
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
            from_account: isSet(object.from) ? String(object.from) : "",
            to_account: isSet(object.to) ? String(object.to) : "",
            amount: isSet(object.amount) ? asset.fromJSON(object.amount) : undefined,
            memo: isSet(object.memo) ? String(object.memo) : "",
            recurrence: isSet(object.recurrence) ? Number(object.recurrence) : 0,
            executions: isSet(object.executions) ? Number(object.executions) : 0,
            extensions: Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => recurrent_transfer_extension.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.from_account !== undefined) {
            obj.from = message.from_account;
        }
        if (message.to_account !== undefined) {
            obj.to = message.to_account;
        }
        if (message.amount !== undefined) {
            obj.amount = asset.toJSON(message.amount);
        }
        if (message.memo !== undefined) {
            obj.memo = message.memo;
        }
        if (message.recurrence !== undefined) {
            obj.recurrence = Math.round(message.recurrence);
        }
        if (message.executions !== undefined) {
            obj.executions = Math.round(message.executions);
        }
        if ((_a = message.extensions) === null || _a === void 0 ? void 0 : _a.length) {
            obj.extensions = message.extensions.map((e) => recurrent_transfer_extension.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return recurrent_transfer.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaserecurrent_transfer();
        message.from_account = (_a = object.from_account) !== null && _a !== void 0 ? _a : "";
        message.to_account = (_b = object.to_account) !== null && _b !== void 0 ? _b : "";
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? asset.fromPartial(object.amount)
            : undefined;
        message.memo = (_c = object.memo) !== null && _c !== void 0 ? _c : "";
        message.recurrence = (_d = object.recurrence) !== null && _d !== void 0 ? _d : 0;
        message.executions = (_e = object.executions) !== null && _e !== void 0 ? _e : 0;
        message.extensions = ((_f = object.extensions) === null || _f === void 0 ? void 0 : _f.map((e) => recurrent_transfer_extension.fromPartial(e))) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
