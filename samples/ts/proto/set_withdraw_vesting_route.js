/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseset_withdraw_vesting_route() {
    return { from_account: "", to_account: "", percent: 0, auto_vest: false };
}
export const set_withdraw_vesting_route = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.from_account !== "") {
            writer.uint32(10).string(message.from_account);
        }
        if (message.to_account !== "") {
            writer.uint32(18).string(message.to_account);
        }
        if (message.percent !== 0) {
            writer.uint32(24).uint32(message.percent);
        }
        if (message.auto_vest === true) {
            writer.uint32(32).bool(message.auto_vest);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseset_withdraw_vesting_route();
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
                    if (tag !== 24) {
                        break;
                    }
                    message.percent = reader.uint32();
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.auto_vest = reader.bool();
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
            from_account: isSet(object.from_account) ? String(object.from_account) : "",
            to_account: isSet(object.to_account) ? String(object.to_account) : "",
            percent: isSet(object.percent) ? Number(object.percent) : 0,
            auto_vest: isSet(object.auto_vest) ? Boolean(object.auto_vest) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.from_account !== undefined) {
            obj.from_account = message.from_account;
        }
        if (message.to_account !== undefined) {
            obj.to_account = message.to_account;
        }
        if (message.percent !== undefined) {
            obj.percent = Math.round(message.percent);
        }
        if (message.auto_vest !== undefined) {
            obj.auto_vest = message.auto_vest;
        }
        return obj;
    },
    create(base) {
        return set_withdraw_vesting_route.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseset_withdraw_vesting_route();
        message.from_account = (_a = object.from_account) !== null && _a !== void 0 ? _a : "";
        message.to_account = (_b = object.to_account) !== null && _b !== void 0 ? _b : "";
        message.percent = (_c = object.percent) !== null && _c !== void 0 ? _c : 0;
        message.auto_vest = (_d = object.auto_vest) !== null && _d !== void 0 ? _d : false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
