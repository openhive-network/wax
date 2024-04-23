/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasewitness_block_approve() {
    return { witness: "", block_id: "" };
}
export const witness_block_approve = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.witness !== "") {
            writer.uint32(10).string(message.witness);
        }
        if (message.block_id !== "") {
            writer.uint32(18).string(message.block_id);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasewitness_block_approve();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.witness = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.block_id = reader.string();
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
            witness: isSet(object.witness) ? String(object.witness) : "",
            block_id: isSet(object.block_id) ? String(object.block_id) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.witness !== undefined) {
            obj.witness = message.witness;
        }
        if (message.block_id !== undefined) {
            obj.block_id = message.block_id;
        }
        return obj;
    },
    create(base) {
        return witness_block_approve.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasewitness_block_approve();
        message.witness = (_a = object.witness) !== null && _a !== void 0 ? _a : "";
        message.block_id = (_b = object.block_id) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
