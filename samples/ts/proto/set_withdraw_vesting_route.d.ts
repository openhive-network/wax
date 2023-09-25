import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "hive.protocol.buffers";
/**
 * The operation set_withdraw_vesting_route_operation allows a user to decide where
 * and how much percent of hive should be transferred to  the account { to_account }
 * from power down operation. A user may also decide that the Hive may be immediately converted to Hive Power.
 * The operation may be created in any moment of power down operation and even if there is no power down operation in progress.
 * The setting is valid till a user creates an operation  set_withdraw_vesting_route_operation
 * with the same { to_account} and with the {percent} = 0.
 * A user may set up 10 { to_account } accounts.
 *
 * @param {string} from_account - The account the funds are coming from.
 * @param {string} to_account - The account the funds are going to. A user may set up 10 accounts.
 * @param {number} percent - The percentage of the HP shares.
 *                           If the sum of the setting shares is less than 100%,
 *                           the rest is transferred to the liquid balance of { from_account }.
 *                           Default value: percent = 0;
 * @param {bool} auto_vest - If auto_vest = true, then the amount of the Hive is immediately converted
 *                           into HP on the { to_account } balance.
 *                           If auto_vest = false, there is no conversion from Hive into HP.
 *                           Default auto_vest = false;
 */
export interface set_withdraw_vesting_route {
    from_account: string;
    to_account: string;
    percent: number;
    auto_vest: boolean;
}
export declare const set_withdraw_vesting_route: {
    encode(message: set_withdraw_vesting_route, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): set_withdraw_vesting_route;
    fromJSON(object: any): set_withdraw_vesting_route;
    toJSON(message: set_withdraw_vesting_route): unknown;
    create<I extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        percent?: number | undefined;
        auto_vest?: boolean | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        percent?: number | undefined;
        auto_vest?: boolean | undefined;
    } & { [K in Exclude<keyof I, keyof set_withdraw_vesting_route>]: never; }>(base?: I | undefined): set_withdraw_vesting_route;
    fromPartial<I_1 extends {
        from_account?: string | undefined;
        to_account?: string | undefined;
        percent?: number | undefined;
        auto_vest?: boolean | undefined;
    } & {
        from_account?: string | undefined;
        to_account?: string | undefined;
        percent?: number | undefined;
        auto_vest?: boolean | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof set_withdraw_vesting_route>]: never; }>(object: I_1): set_withdraw_vesting_route;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
declare type KeysOfUnion<T> = T extends T ? keyof T : never;
export declare type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
