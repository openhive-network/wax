/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasetransfer_to_vesting_completed() {
    return { from_account: "", to_account: "", hive_vested: undefined, vesting_shares_received: undefined };
}
export const transfer_to_vesting_completed = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.from_account !== "") {
            writer.uint32(10).string(message.from_account);
        }
        if (message.to_account !== "") {
            writer.uint32(18).string(message.to_account);
        }
        if (message.hive_vested !== undefined) {
            asset.encode(message.hive_vested, writer.uint32(26).fork()).ldelim();
        }
        if (message.vesting_shares_received !== undefined) {
            asset.encode(message.vesting_shares_received, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasetransfer_to_vesting_completed();
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
                    message.hive_vested = asset.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.vesting_shares_received = asset.decode(reader, reader.uint32());
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
            hive_vested: isSet(object.hive_vested) ? asset.fromJSON(object.hive_vested) : undefined,
            vesting_shares_received: isSet(object.vesting_shares_received)
                ? asset.fromJSON(object.vesting_shares_received)
                : undefined,
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
        if (message.hive_vested !== undefined) {
            obj.hive_vested = asset.toJSON(message.hive_vested);
        }
        if (message.vesting_shares_received !== undefined) {
            obj.vesting_shares_received = asset.toJSON(message.vesting_shares_received);
        }
        return obj;
    },
    create(base) {
        return transfer_to_vesting_completed.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasetransfer_to_vesting_completed();
        message.from_account = (_a = object.from_account) !== null && _a !== void 0 ? _a : "";
        message.to_account = (_b = object.to_account) !== null && _b !== void 0 ? _b : "";
        message.hive_vested = (object.hive_vested !== undefined && object.hive_vested !== null)
            ? asset.fromPartial(object.hive_vested)
            : undefined;
        message.vesting_shares_received =
            (object.vesting_shares_received !== undefined && object.vesting_shares_received !== null)
                ? asset.fromPartial(object.vesting_shares_received)
                : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
