/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasetransfer_to_vesting() {
    return { from_account: "", to_account: "", amount: undefined };
}
export const transfer_to_vesting = {
    fromJSON(object) {
        return {
            from_account: isSet(object.from) ? globalThis.String(object.from) : "",
            to_account: isSet(object.to) ? globalThis.String(object.to) : "",
            amount: isSet(object.amount) ? asset.fromJSON(object.amount) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.from_account !== undefined) {
            obj.from = message.from_account;
        }
        if (message.to_account !== undefined) {
            obj.to = message.to_account;
        }
        if (message.amount !== undefined) {
            obj.amount = asset.toJSON(message.amount);
        }
        return obj;
    },
    create(base) {
        return transfer_to_vesting.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasetransfer_to_vesting();
        message.from_account = object.from_account ?? "";
        message.to_account = object.to_account ?? "";
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? asset.fromPartial(object.amount)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
