import { TTransactionPackType, ApiTransaction } from "../types"

export interface VerifyAuthorityRequest {
  trx: ApiTransaction;
  pack: TTransactionPackType;
};

export interface VerifyAuthorityResponse {
  valid: boolean;
};
