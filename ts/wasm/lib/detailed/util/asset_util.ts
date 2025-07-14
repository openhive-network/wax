import { type TNaiAssetSource } from "../interfaces.js";

export const isNaiAsset = (asset: TNaiAssetSource): boolean => {
  return typeof asset === 'object';
}
