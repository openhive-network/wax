import { ApiManabar, NaiAsset } from "../types/index.js";

export interface FindRcAccountsRequest {
  accounts: string[];
}

export interface RcAccount {
  account: string;
  rc_manabar: ApiManabar;
  max_rc_creation_adjustment: NaiAsset;
  max_rc: string | number;
}

export interface FindRcAccountsResponse {
  rc_accounts: Array<RcAccount>;
}
