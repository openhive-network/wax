/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseconsolidate_treasury_balance() {
    return { total_moved: [] };
}
export const consolidate_treasury_balance = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.total_moved) {
            asset.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseconsolidate_treasury_balance();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.total_moved.push(asset.decode(reader, reader.uint32()));
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
            total_moved: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.total_moved)
                ? object.total_moved.map((e) => asset.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if ((_a = message.total_moved) === null || _a === void 0 ? void 0 : _a.length) {
            obj.total_moved = message.total_moved.map((e) => asset.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return consolidate_treasury_balance.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseconsolidate_treasury_balance();
        message.total_moved = ((_a = object.total_moved) === null || _a === void 0 ? void 0 : _a.map((e) => asset.fromPartial(e))) || [];
        return message;
    },
};
