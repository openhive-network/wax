import type { TPublicKey } from "../../interfaces";

export interface GetKeyReferencesRequest {
  keys: Array<TPublicKey>;
}

export interface GetKeyReferencesResponse {
  accounts: string[][];
}
