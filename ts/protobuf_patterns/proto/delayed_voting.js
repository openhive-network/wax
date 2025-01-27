/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasedelayed_voting() {
    return { voter: "", votes: "0" };
}
export const delayed_voting = {
    fromJSON(object) {
        return {
            voter: isSet(object.voter) ? globalThis.String(object.voter) : "",
            votes: isSet(object.votes) ? globalThis.String(object.votes) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.voter !== undefined) {
            obj.voter = message.voter;
        }
        if (message.votes !== undefined) {
            obj.votes = message.votes;
        }
        return obj;
    },
    create(base) {
        return delayed_voting.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasedelayed_voting();
        message.voter = object.voter ?? "";
        message.votes = object.votes ?? "0";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
