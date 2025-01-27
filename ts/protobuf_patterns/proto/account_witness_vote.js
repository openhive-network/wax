/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaseaccount_witness_vote() {
    return { account: "", witness: "", approve: false };
}
export const account_witness_vote = {
    fromJSON(object) {
        return {
            account: isSet(object.account) ? globalThis.String(object.account) : "",
            witness: isSet(object.witness) ? globalThis.String(object.witness) : "",
            approve: isSet(object.approve) ? globalThis.Boolean(object.approve) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        if (message.witness !== undefined) {
            obj.witness = message.witness;
        }
        if (message.approve !== undefined) {
            obj.approve = message.approve;
        }
        return obj;
    },
    create(base) {
        return account_witness_vote.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseaccount_witness_vote();
        message.account = object.account ?? "";
        message.witness = object.witness ?? "";
        message.approve = object.approve ?? false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
