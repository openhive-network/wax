import { type TNaiAssetSource } from "../../interfaces.js";


export const isNaiAsset = (asset: TNaiAssetSource): boolean => {
  if (typeof asset !== 'object' || 'low' in asset)
    return false;

  return true;
}
