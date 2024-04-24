import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * Related to transfer_to_vesting_operation.
 * Generated every time above operation is executed. Supplements it with amount of VESTS received.
 * Note: power up immediately increases mana regeneration and vote power for comments, but there is a grace period before
 * it activates as governance vote power.
 * @see delayed_voting
 *
 * @param {string} from_account - account that executed power up (source of hive_vested)
 * @param {string} to_account - account that gets power up (receiver of vesting_shares_received)
 * @param {asset} hive_vested - (HIVE) liquid funds being turned into VESTS
 * @param {asset} vesting_shares_received - (VESTS) result of power up
 */
export interface transfer_to_vesting_completed {
    from_account: string;
    to_account: string;
    hive_vested: asset | undefined;
    vesting_shares_received: asset | undefined;
}
export declare const transfer_to_vesting_completed: {
    encode(message: transfer_to_vesting_completed, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): transfer_to_vesting_completed;
    fromJSON(object: any): transfer_to_vesting_completed;
    toJSON(message: transfer_to_vesting_completed): unknown;
    create<I extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        hive_vested?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        vesting_shares_received?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        hive_vested?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K in Exclude<keyof I["hive_vested"], keyof asset>]: never; }) | undefined;
        vesting_shares_received?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_1 in Exclude<keyof I["vesting_shares_received"], keyof asset>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof transfer_to_vesting_completed>]: never; }>(base?: I | undefined): transfer_to_vesting_completed;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        hive_vested?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
        vesting_shares_received?: {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        hive_vested?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["hive_vested"], keyof asset>]: never; }) | undefined;
        vesting_shares_received?: ({
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & {
            amount?: string | undefined;
            precision?: number | undefined;
            nai?: string | undefined;
        } & { [K_4 in Exclude<keyof I_1["vesting_shares_received"], keyof asset>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof transfer_to_vesting_completed>]: never; }>(object: I_1): transfer_to_vesting_completed;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
