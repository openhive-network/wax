/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaseasset() {
    return { amount: "", precision: 0, nai: "" };
}
export const asset = {
    fromJSON(object) {
        return {
            amount: isSet(object.amount) ? globalThis.String(object.amount) : "",
            precision: isSet(object.precision) ? globalThis.Number(object.precision) : 0,
            nai: isSet(object.nai) ? globalThis.String(object.nai) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.amount !== undefined) {
            obj.amount = message.amount;
        }
        if (message.precision !== undefined) {
            obj.precision = Math.round(message.precision);
        }
        if (message.nai !== undefined) {
            obj.nai = message.nai;
        }
        return obj;
    },
    create(base) {
        return asset.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseasset();
        message.amount = (_a = object.amount) !== null && _a !== void 0 ? _a : "";
        message.precision = (_b = object.precision) !== null && _b !== void 0 ? _b : 0;
        message.nai = (_c = object.nai) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
