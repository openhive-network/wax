import { ApiAccount } from "../types/index.js";

export interface FindAccountsRequest {
  accounts: string[];
  delayed_votes_active: boolean;
}

export interface FindAccountsResponse {
  accounts: Array<ApiAccount>;
}
