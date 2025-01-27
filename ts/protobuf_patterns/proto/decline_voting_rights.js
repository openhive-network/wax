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
        return decline_voting_rights.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasedecline_voting_rights();
        message.account = object.account ?? "";
        message.decline = object.decline ?? false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
