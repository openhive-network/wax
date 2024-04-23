/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { legacy_chain_properties } from "./legacy_chain_properties.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasepow_work() {
    return { worker: "", input: "", signature: "", work: "" };
}
export const pow_work = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.worker !== "") {
            writer.uint32(10).string(message.worker);
        }
        if (message.input !== "") {
            writer.uint32(18).string(message.input);
        }
        if (message.signature !== "") {
            writer.uint32(26).string(message.signature);
        }
        if (message.work !== "") {
            writer.uint32(34).string(message.work);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasepow_work();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.worker = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.input = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.signature = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.work = reader.string();
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
            worker: isSet(object.worker) ? String(object.worker) : "",
            input: isSet(object.input) ? String(object.input) : "",
            signature: isSet(object.signature) ? String(object.signature) : "",
            work: isSet(object.work) ? String(object.work) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.worker !== undefined) {
            obj.worker = message.worker;
        }
        if (message.input !== undefined) {
            obj.input = message.input;
        }
        if (message.signature !== undefined) {
            obj.signature = message.signature;
        }
        if (message.work !== undefined) {
            obj.work = message.work;
        }
        return obj;
    },
    create(base) {
        return pow_work.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBasepow_work();
        message.worker = (_a = object.worker) !== null && _a !== void 0 ? _a : "";
        message.input = (_b = object.input) !== null && _b !== void 0 ? _b : "";
        message.signature = (_c = object.signature) !== null && _c !== void 0 ? _c : "";
        message.work = (_d = object.work) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBasepow() {
    return { worker_account: "", block_id: "", nonce: "0", work: undefined, props: undefined };
}
export const pow = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.worker_account !== "") {
            writer.uint32(10).string(message.worker_account);
        }
        if (message.block_id !== "") {
            writer.uint32(18).string(message.block_id);
        }
        if (message.nonce !== "0") {
            writer.uint32(24).uint64(message.nonce);
        }
        if (message.work !== undefined) {
            pow_work.encode(message.work, writer.uint32(34).fork()).ldelim();
        }
        if (message.props !== undefined) {
            legacy_chain_properties.encode(message.props, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasepow();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.worker_account = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.block_id = reader.string();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.nonce = longToString(reader.uint64());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.work = pow_work.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.props = legacy_chain_properties.decode(reader, reader.uint32());
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
            worker_account: isSet(object.worker_account) ? String(object.worker_account) : "",
            block_id: isSet(object.block_id) ? String(object.block_id) : "",
            nonce: isSet(object.nonce) ? String(object.nonce) : "0",
            work: isSet(object.work) ? pow_work.fromJSON(object.work) : undefined,
            props: isSet(object.props) ? legacy_chain_properties.fromJSON(object.props) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.worker_account !== undefined) {
            obj.worker_account = message.worker_account;
        }
        if (message.block_id !== undefined) {
            obj.block_id = message.block_id;
        }
        if (message.nonce !== undefined) {
            obj.nonce = message.nonce;
        }
        if (message.work !== undefined) {
            obj.work = pow_work.toJSON(message.work);
        }
        if (message.props !== undefined) {
            obj.props = legacy_chain_properties.toJSON(message.props);
        }
        return obj;
    },
    create(base) {
        return pow.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasepow();
        message.worker_account = (_a = object.worker_account) !== null && _a !== void 0 ? _a : "";
        message.block_id = (_b = object.block_id) !== null && _b !== void 0 ? _b : "";
        message.nonce = (_c = object.nonce) !== null && _c !== void 0 ? _c : "0";
        message.work = (object.work !== undefined && object.work !== null) ? pow_work.fromPartial(object.work) : undefined;
        message.props = (object.props !== undefined && object.props !== null)
            ? legacy_chain_properties.fromPartial(object.props)
            : undefined;
        return message;
    },
};
function longToString(long) {
    return long.toString();
}
if (_m0.util.Long !== Long) {
    _m0.util.Long = Long;
    _m0.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
