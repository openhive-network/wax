/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseclear_null_account_balance() {
    return { total_cleared: [] };
}
export const clear_null_account_balance = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.total_cleared) {
            asset.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseclear_null_account_balance();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.total_cleared.push(asset.decode(reader, reader.uint32()));
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
            total_cleared: Array.isArray(object === null || object === void 0 ? void 0 : object.total_cleared)
                ? object.total_cleared.map((e) => asset.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if ((_a = message.total_cleared) === null || _a === void 0 ? void 0 : _a.length) {
            obj.total_cleared = message.total_cleared.map((e) => asset.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return clear_null_account_balance.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseclear_null_account_balance();
        message.total_cleared = ((_a = object.total_cleared) === null || _a === void 0 ? void 0 : _a.map((e) => asset.fromPartial(e))) || [];
        return message;
    },
};
