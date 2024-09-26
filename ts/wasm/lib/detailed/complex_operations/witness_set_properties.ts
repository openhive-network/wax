import { asset, operation, witness_set_properties } from "../../protocol.js";
import { OperationBase, IOperationSink } from "../operation_base.js";
import { type witness_set_properties_data } from "../../wax_module.js";
import { type TPublicKey } from "@hiveio/beekeeper";
import { EAssetName, type WaxBaseApi } from '../base_api.js';
import type Long from "long";
import { TAccountName } from "../hive_apps_operations/index.js";
import { isNaiAsset } from "../util/asset_util.js";

type TInternalAsset = asset | Long | string | BigInt | number;

export interface IWitnessSetPropertiesData {
  /**
   * Witness account name.
   */
  owner: TAccountName;
  /**
   * The public key of the witness.
   */
  witnessSigningKey: TPublicKey;
  /**
   * The new signing key of the witness.
   */
  newSigningKey?: TPublicKey;
  /**
   * The account creation fee.
   */
  accountCreationFee?: TInternalAsset;
  /**
   * The URL of the witness.
   */
  url?: string;
  /**
   * The HBD exchange rate.
   */
  hbdExchangeRate?: { base: TInternalAsset; quote: TInternalAsset; };
  /**
   * The maximum block size.
   */
  maximumBlockSize?: number;
  /**
   * The HBD interest rate.
   */
  hbdInterestRate?: number;
  /**
   * The account subsidy budget.
   */
  accountSubsidyBudget?: number;
  /**
   * The account subsidy decay.
   */
  accountSubsidyDecay?: number;
}

export class WitnessSetPropertiesOperation extends OperationBase {
  private accountCreationFee?: TInternalAsset = undefined;
  private hbdExchangeRate?: { base: TInternalAsset; quote: TInternalAsset; } = undefined;

  private readonly witnessProps: witness_set_properties;

  private readonly props: witness_set_properties_data;

  public constructor(data: IWitnessSetPropertiesData) {
    super();

    this.witnessProps = witness_set_properties.fromPartial({
      extensions: [],
      owner: data.owner,
      props: {}
    });

    this.accountCreationFee = data.accountCreationFee;
    this.hbdExchangeRate = data.hbdExchangeRate;

    this.props = {
      key: data.witnessSigningKey,
      new_signing_key: data.newSigningKey ?? undefined,
      account_creation_fee: undefined,
      url: data.url,
      hbd_exchange_rate: undefined,
      maximum_block_size: data.maximumBlockSize ?? undefined,
      hbd_interest_rate: data.hbdInterestRate ?? undefined,
      account_subsidy_budget: data.accountSubsidyBudget ?? undefined,
      account_subsidy_decay: data.accountSubsidyDecay ?? undefined
    };
  }

  /**
   * @internal
   */
  public finalize(sink: IOperationSink): Iterable<operation> {
    if (this.hbdExchangeRate !== undefined) {
      let base: asset, quote: asset;
      if (isNaiAsset(this.hbdExchangeRate.base))
        base = (sink.api as WaxBaseApi).assertAssetSymbol(EAssetName.HBD, this.hbdExchangeRate.base as asset);
      else
        base = sink.api.hbdSatoshis(this.hbdExchangeRate.base as number | string | BigInt | Long);

      if (isNaiAsset(this.hbdExchangeRate.quote))
        quote = (sink.api as WaxBaseApi).assertAssetSymbol(EAssetName.HIVE, this.hbdExchangeRate.quote as asset);
      else
        quote = sink.api.hiveSatoshis(this.hbdExchangeRate.quote as number | string | BigInt | Long);

      this.props.hbd_exchange_rate = { base, quote };
    }

    if (this.accountCreationFee !== undefined) {
      let fee: asset;

      if (isNaiAsset(this.accountCreationFee))
        fee = (sink.api as WaxBaseApi).assertAssetSymbol(EAssetName.HIVE, this.accountCreationFee as asset);
      else
        fee = sink.api.hiveSatoshis(this.accountCreationFee as number | string | BigInt | Long);

      this.props.account_creation_fee = fee;
    }

    this.witnessProps.props = (sink.api as WaxBaseApi).serializeWitnessProps(this.props);

    return [{ witness_set_properties: this.witnessProps }];
  }
}
