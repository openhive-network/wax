/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasehardfork_hive() {
    return {
        account: "",
        treasury: "",
        other_affected_accounts: [],
        hbd_transferred: undefined,
        hive_transferred: undefined,
        vests_converted: undefined,
        total_hive_from_vests: undefined,
    };
}
export const hardfork_hive = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account !== "") {
            writer.uint32(10).string(message.account);
        }
        if (message.treasury !== "") {
            writer.uint32(18).string(message.treasury);
        }
        for (const v of message.other_affected_accounts) {
            writer.uint32(26).string(v);
        }
        if (message.hbd_transferred !== undefined) {
            asset.encode(message.hbd_transferred, writer.uint32(34).fork()).ldelim();
        }
        if (message.hive_transferred !== undefined) {
            asset.encode(message.hive_transferred, writer.uint32(42).fork()).ldelim();
        }
        if (message.vests_converted !== undefined) {
            asset.encode(message.vests_converted, writer.uint32(50).fork()).ldelim();
        }
        if (message.total_hive_from_vests !== undefined) {
            asset.encode(message.total_hive_from_vests, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasehardfork_hive();
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
                    message.treasury = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.other_affected_accounts.push(reader.string());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.hbd_transferred = asset.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.hive_transferred = asset.decode(reader, reader.uint32());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.vests_converted = asset.decode(reader, reader.uint32());
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.total_hive_from_vests = asset.decode(reader, reader.uint32());
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
            account: isSet(object.account) ? String(object.account) : "",
            treasury: isSet(object.treasury) ? String(object.treasury) : "",
            other_affected_accounts: Array.isArray(object === null || object === void 0 ? void 0 : object.other_affected_accounts)
                ? object.other_affected_accounts.map((e) => String(e))
                : [],
            hbd_transferred: isSet(object.hbd_transferred) ? asset.fromJSON(object.hbd_transferred) : undefined,
            hive_transferred: isSet(object.hive_transferred) ? asset.fromJSON(object.hive_transferred) : undefined,
            vests_converted: isSet(object.vests_converted) ? asset.fromJSON(object.vests_converted) : undefined,
            total_hive_from_vests: isSet(object.total_hive_from_vests)
                ? asset.fromJSON(object.total_hive_from_vests)
                : undefined,
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.account !== "") {
            obj.account = message.account;
        }
        if (message.treasury !== "") {
            obj.treasury = message.treasury;
        }
        if ((_a = message.other_affected_accounts) === null || _a === void 0 ? void 0 : _a.length) {
            obj.other_affected_accounts = message.other_affected_accounts;
        }
        if (message.hbd_transferred !== undefined) {
            obj.hbd_transferred = asset.toJSON(message.hbd_transferred);
        }
        if (message.hive_transferred !== undefined) {
            obj.hive_transferred = asset.toJSON(message.hive_transferred);
        }
        if (message.vests_converted !== undefined) {
            obj.vests_converted = asset.toJSON(message.vests_converted);
        }
        if (message.total_hive_from_vests !== undefined) {
            obj.total_hive_from_vests = asset.toJSON(message.total_hive_from_vests);
        }
        return obj;
    },
    create(base) {
        return hardfork_hive.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasehardfork_hive();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.treasury = (_b = object.treasury) !== null && _b !== void 0 ? _b : "";
        message.other_affected_accounts = ((_c = object.other_affected_accounts) === null || _c === void 0 ? void 0 : _c.map((e) => e)) || [];
        message.hbd_transferred = (object.hbd_transferred !== undefined && object.hbd_transferred !== null)
            ? asset.fromPartial(object.hbd_transferred)
            : undefined;
        message.hive_transferred = (object.hive_transferred !== undefined && object.hive_transferred !== null)
            ? asset.fromPartial(object.hive_transferred)
            : undefined;
        message.vests_converted = (object.vests_converted !== undefined && object.vests_converted !== null)
            ? asset.fromPartial(object.vests_converted)
            : undefined;
        message.total_hive_from_vests =
            (object.total_hive_from_vests !== undefined && object.total_hive_from_vests !== null)
                ? asset.fromPartial(object.total_hive_from_vests)
                : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
