import Long from "long";
import { NaiAsset } from "../api/index.js";


export const isNaiAsset = (asset: number | string | BigInt | Long | NaiAsset): boolean => {
  if (typeof asset !== 'object' || 'low' in asset)
    return false;

  return true;
}
