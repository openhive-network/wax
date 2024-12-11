import type { TPublicKey } from "@hiveio/beekeeper";
import { WaxError } from "../../../../../errors.js";
import { LevelBase } from "../../level_base.js";

export class HiveRoleMemoKeyDefinition extends LevelBase<"memo"> {
  public constructor() {
    super("memo");
  }

  private HIVE_ADDRESS_PREFIX!: string;

  private static NULL_PUBLIC_KEY = "STM1111111111111111111111111111111114T1Anm";

  private publicKey!: TPublicKey;

  public init(hiveAddressPrefix: string, publicKey: TPublicKey) {
    this.publicKey = publicKey;
    this.HIVE_ADDRESS_PREFIX = hiveAddressPrefix;
  }

  public get value(): Readonly<TPublicKey> {
    return this.publicKey;
  }

  /**
   * Sets the provided public key as the account memo key.
   *
   * @param {TPublicKey} publicKey Public key to be set as the account memo key
   * @returns itself
   */
  public set(publicKey: TPublicKey): this {
    if (!publicKey.startsWith(this.HIVE_ADDRESS_PREFIX))
      throw new WaxError("Invalid public key provided as memo key");

    this.publicKey = publicKey;

    return this;
  }

  /**
   * Checks if the memo key is set to the default value - null public key (`STM1111111111111111111111111111111114T1Anm`)
   *
   * @returns {boolean} Either true or false depending on whether the public key is set or not.
   */
  public get isSet(): boolean {
    return this.publicKey !== HiveRoleMemoKeyDefinition.NULL_PUBLIC_KEY;
  }
}
