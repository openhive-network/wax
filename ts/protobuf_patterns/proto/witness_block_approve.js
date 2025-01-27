/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasewitness_block_approve() {
    return { witness: "", block_id: "" };
}
export const witness_block_approve = {
    fromJSON(object) {
        return {
            witness: isSet(object.witness) ? globalThis.String(object.witness) : "",
            block_id: isSet(object.block_id) ? globalThis.String(object.block_id) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.witness !== undefined) {
            obj.witness = message.witness;
        }
        if (message.block_id !== undefined) {
            obj.block_id = message.block_id;
        }
        return obj;
    },
    create(base) {
        return witness_block_approve.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasewitness_block_approve();
        message.witness = object.witness ?? "";
        message.block_id = object.block_id ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
