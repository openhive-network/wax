import { IAssetFormatter, IFormattedAsset, IWaxFormatterProvider } from "../interfaces";
import { asset } from "../protocol.js";
import { protocol_foundation } from "../wax_module.js";

class FormattedAsset implements IFormattedAsset
{
  public constructor(public readonly amount: string,
                     public readonly token: string) {
  }
};

export class DefaultAssetFormatter implements IAssetFormatter<IFormattedAsset> {

  public constructor(private readonly base: protocol_foundation){
  }
  public format(value: asset): IFormattedAsset {
    let result: FormattedAsset;

    const scaledAmount: string = this.base.cpp_asset_value(value);    

    switch(value.nai) {
      case "@@000000037": /// VESTS
      case "@@000000013": /// HBD
      case "@@000000021": /// HIVE
      {
        const tokenName: string = this.base.cpp_asset_symbol(value);
        result = new FormattedAsset(scaledAmount, tokenName);
        break;
      }
      default:
        result = new FormattedAsset(scaledAmount, value.nai);
        break;
    }

    return result;
  }

};

export class CustomFormatterProvider<T> implements IWaxFormatterProvider<T> {
  public constructor(
    public readonly proto: protocol_foundation,
    public readonly assetFormatter: IAssetFormatter<T>) {
    }
    
    public registerAssetFormatter<TCustomFormattedResult>(formatter: IAssetFormatter<TCustomFormattedResult>): IWaxFormatterProvider<TCustomFormattedResult> {
      return new CustomFormatterProvider<TCustomFormattedResult>(this.proto, formatter);
    }
};
