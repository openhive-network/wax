/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasetransfer_to_vesting_completed() {
    return { from_account: "", to_account: "", hive_vested: undefined, vesting_shares_received: undefined };
}
export const transfer_to_vesting_completed = {
    fromJSON(object) {
        return {
            from_account: isSet(object.from_account) ? globalThis.String(object.from_account) : "",
            to_account: isSet(object.to_account) ? globalThis.String(object.to_account) : "",
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
        return transfer_to_vesting_completed.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasetransfer_to_vesting_completed();
        message.from_account = object.from_account ?? "";
        message.to_account = object.to_account ?? "";
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
