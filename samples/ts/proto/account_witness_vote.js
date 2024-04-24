/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseaccount_witness_vote() {
    return { account: "", witness: "", approve: false };
}
export const account_witness_vote = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account !== "") {
            writer.uint32(10).string(message.account);
        }
        if (message.witness !== "") {
            writer.uint32(18).string(message.witness);
        }
        if (message.approve !== false) {
            writer.uint32(24).bool(message.approve);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseaccount_witness_vote();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.account = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.witness = reader.string();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.approve = reader.bool();
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
            account: isSet(object.account) ? globalThis.String(object.account) : "",
            witness: isSet(object.witness) ? globalThis.String(object.witness) : "",
            approve: isSet(object.approve) ? globalThis.Boolean(object.approve) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        if (message.witness !== undefined) {
            obj.witness = message.witness;
        }
        if (message.approve !== undefined) {
            obj.approve = message.approve;
        }
        return obj;
    },
    create(base) {
        return account_witness_vote.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseaccount_witness_vote();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.witness = (_b = object.witness) !== null && _b !== void 0 ? _b : "";
        message.approve = (_c = object.approve) !== null && _c !== void 0 ? _c : false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
