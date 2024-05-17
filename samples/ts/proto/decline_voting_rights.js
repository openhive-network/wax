/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasedecline_voting_rights() {
    return { account: "", decline: false };
}
export const decline_voting_rights = {
    fromJSON(object) {
        return {
            account: isSet(object.account) ? globalThis.String(object.account) : "",
            decline: isSet(object.decline) ? globalThis.Boolean(object.decline) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        if (message.decline !== undefined) {
            obj.decline = message.decline;
        }
        return obj;
    },
    create(base) {
        return decline_voting_rights.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasedecline_voting_rights();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.decline = (_b = object.decline) !== null && _b !== void 0 ? _b : false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
