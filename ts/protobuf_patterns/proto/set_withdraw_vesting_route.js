/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaseset_withdraw_vesting_route() {
    return { from_account: "", to_account: "", percent: 0, auto_vest: false };
}
export const set_withdraw_vesting_route = {
    fromJSON(object) {
        return {
            from_account: isSet(object.from_account) ? globalThis.String(object.from_account) : "",
            to_account: isSet(object.to_account) ? globalThis.String(object.to_account) : "",
            percent: isSet(object.percent) ? globalThis.Number(object.percent) : 0,
            auto_vest: isSet(object.auto_vest) ? globalThis.Boolean(object.auto_vest) : false,
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
