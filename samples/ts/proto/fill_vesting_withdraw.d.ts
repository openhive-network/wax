import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to withdraw_vesting_operation and set_withdraw_vesting_route_operation.
 * Generated during block processing in batches for each active withdraw route (including implied
 * from_account(VESTS)->from_account(HIVE)) each time vesting withdrawal period passes.
 * Note: not generated for implied route when all funds were already distributed along explicit routes
 *
 * @param {string} from_account - user that activated power down
 * @param {string} to_account - target of vesting route (potentially the same as from_account - receiver of deposited)
 * @param {asset} withdraw - (VESTS) source amount
 * @param {asset} deposited - (HIVE or VESTS) [converted] target amount
 */
export interface fill_vesting_withdraw {
    from_account: string;
    to_account: string;
    withdrawn: asset | undefined;
    deposited: asset | undefined;
}
export declare const fill_vesting_withdraw: {
    encode(message: fill_vesting_withdraw, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): fill_vesting_withdraw;
    fromJSON(object: any): fill_vesting_withdraw;
    toJSON(message: fill_vesting_withdraw): unknown;
    create<I extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        withdrawn?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        deposited?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        withdrawn?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["withdrawn"], keyof asset>]: never; }) | undefined;
        deposited?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["deposited"], keyof asset>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof fill_vesting_withdraw>]: never; }>(base?: I | undefined): fill_vesting_withdraw;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        withdrawn?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        deposited?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        withdrawn?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["withdrawn"], keyof asset>]: never; }) | undefined;
        deposited?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["deposited"], keyof asset>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof fill_vesting_withdraw>]: never; }>(object: I_1): fill_vesting_withdraw;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
