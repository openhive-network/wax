import { NaiAsset } from "../api";

export const HIVE: Omit<NaiAsset, "amount"> = {
  precision: 3,
  nai: "@@000000021"
};

export const HBD: Omit<NaiAsset, "amount"> = {
  precision: 3,
  nai: "@@000000013"
};

export const VESTS: Omit<NaiAsset, "amount"> = {
  precision: 6,
  nai: "@@000000037"
};
