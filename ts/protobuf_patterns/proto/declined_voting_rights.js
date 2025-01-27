/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasedeclined_voting_rights() {
    return { account: "" };
}
export const declined_voting_rights = {
    fromJSON(object) {
        return { account: isSet(object.account) ? globalThis.String(object.account) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        return obj;
    },
    create(base) {
        return declined_voting_rights.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasedeclined_voting_rights();
        message.account = object.account ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
