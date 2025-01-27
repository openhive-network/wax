/* eslint-disable */
import { legacy_chain_properties } from "./legacy_chain_properties.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasepow_work() {
    return { worker: "", input: "", signature: "", work: "" };
}
export const pow_work = {
    fromJSON(object) {
        return {
            worker: isSet(object.worker) ? globalThis.String(object.worker) : "",
            input: isSet(object.input) ? globalThis.String(object.input) : "",
            signature: isSet(object.signature) ? globalThis.String(object.signature) : "",
            work: isSet(object.work) ? globalThis.String(object.work) : "",
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
        return pow_work.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasepow_work();
        message.worker = object.worker ?? "";
        message.input = object.input ?? "";
        message.signature = object.signature ?? "";
        message.work = object.work ?? "";
        return message;
    },
};
function createBasepow() {
    return { worker_account: "", block_id: "", nonce: "0", work: undefined, props: undefined };
}
export const pow = {
    fromJSON(object) {
        return {
            worker_account: isSet(object.worker_account) ? globalThis.String(object.worker_account) : "",
            block_id: isSet(object.block_id) ? globalThis.String(object.block_id) : "",
            nonce: isSet(object.nonce) ? globalThis.String(object.nonce) : "0",
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
        return pow.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasepow();
        message.worker_account = object.worker_account ?? "";
        message.block_id = object.block_id ?? "";
        message.nonce = object.nonce ?? "0";
        message.work = (object.work !== undefined && object.work !== null) ? pow_work.fromPartial(object.work) : undefined;
        message.props = (object.props !== undefined && object.props !== null)
            ? legacy_chain_properties.fromPartial(object.props)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
