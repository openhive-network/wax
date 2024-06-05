import { asset, witness_set_properties } from "../../protocol.js";
import { type IBuiltHiveAppsOperation, OperationBuilder } from "../operation_builder.js";
import { type witness_set_properties_data } from "../../wax_module.js";
import { type TPublicKey } from "@hiveio/beekeeper";
import { WaxBaseApi } from "../base_api.js";
import type Long from "long";

export class WitnessSetPropertiesBuilder extends OperationBuilder {
  private readonly witnessProps: witness_set_properties;

  private readonly props: witness_set_properties_data;

  /**
   * Creates a new witness set properties builder
   * @param {string} owner Witness account name to update
   * @param {TPublicKey} witnessKey current witness key
   */
  public constructor(owner: string, witnessKey: string) {
    super();

    this.witnessProps = witness_set_properties.fromPartial({
      extensions: [],
      owner,
      props: {}
    });

    this.props = {
      key: witnessKey,
      new_signing_key: undefined,
      account_creation_fee: undefined,
      url: undefined,
      hbd_exchange_rate: undefined,
      maximum_block_size: undefined,
      hbd_interest_rate: undefined,
      account_subsidy_budget: undefined,
      account_subsidy_decay: undefined
    };
  }

  /**
   * New witness key to set
   * @param {TPublicKey} key new witness public key
   * @returns {WitnessSetPropertiesBuilder} itself
   */
  public setNewSigningKey(key: TPublicKey): this {
    this.props.new_signing_key = key;

    return this;
  }

  /**
   * HIVE maximum account creation fee
   * @param {asset | string | BigInt | number} fee account creation fee
   * @returns {WitnessSetPropertiesBuilder} itself
   */
  public setAccountCreationFee(fee: asset | Long | string | BigInt | number): this {
    if (typeof fee !== "object" || "low" in fee)
      fee = this.api.hive(fee);

    this.props.account_creation_fee = fee as asset;

    return this;
  }

  /**
   * New witness URL to set
   * @param {string} url witness url
   * @returns {WitnessSetPropertiesBuilder} itself
   */
  public setUrl(url: string): this {
    this.props.url = url;

    return this;
  }

  /**
   * Sets HBD to HIVE ratio proposed by the witness
   * @param {asset | Long | string | BigInt | number} rateBaseHbd HBD base asset
   * @param {asset | Long | string | BigInt | number} rateQuoteHive HIVE quote asset
   * @returns {WitnessSetPropertiesBuilder} itself
   */
  public setHBDExchangeRate(rateBaseHbd: asset | Long | string | BigInt | number, rateQuoteHive: asset | Long | string | BigInt | number): this {
    if (typeof rateBaseHbd !== "object" || "low" in rateBaseHbd)
      rateBaseHbd = this.api.hbd(rateBaseHbd);

    if (typeof rateQuoteHive !== "object" || "low" in rateQuoteHive)
      rateQuoteHive = this.api.hive(rateQuoteHive);

    this.props.hbd_exchange_rate = { base: rateBaseHbd as asset, quote: rateQuoteHive as asset };

    return this;
  }

  /**
   * This witnesses vote for the maximum_block_size which is used by the network to tune rate limiting and capacity
   * @param {number} blockSize maximum block size to set in bytes
   * @returns {WitnessSetPropertiesBuilder} itself
   */
  public setMaximumBlockSize(blockSize: number): this {
    this.props.maximum_block_size = blockSize;

    return this;
  }

  /**
   * Sets rate of interest for holding HBD
   * @param {number} interestRate rate of interest for holding HBD (in BPS - basis points)
   * @returns {WitnessSetPropertiesBuilder} itself
   */
  public setHBDInterestRate(interestRate: number): this {
    this.props.hbd_interest_rate = interestRate;

    return this;
  }

  /**
   * Sets how many free accounts should be created per elected witness block.
   * Scaled so that HIVE_ACCOUNT_SUBSIDY_PRECISION represents one account.
   * @param {number} budget account subsidy budget to be set
   * @returns {WitnessSetPropertiesBuilder} itself
   */
  public setAccountSubsidyBudget(budget: number): this {
    this.props.account_subsidy_budget = budget;

    return this;
  }

  /**
   * Sets what fraction of the "stockpiled" free accounts "expire" per elected witness block.
   * Scaled so that 1 << HIVE_RD_DECAY_DENOM_SHIFT represents 100% of accounts expiring.
   * @param {number} decay account subsidy decay to be set
   * @returns {WitnessSetPropertiesBuilder} itself
   */
  public setAccountSubsidyDecay(decay: number): this {
    this.props.account_subsidy_decay = decay;

    return this;
  }

  /**
   * @internal
   */
  public override build(): IBuiltHiveAppsOperation {
    this.witnessProps.props = (this.api as WaxBaseApi).serializeWitnessProps(this.props);

    this.push({ witness_set_properties: this.witnessProps });

    return this.builtOperations;
  }
}
