import { GetKeyReferencesRequest, GetKeyReferencesResponse } from "./api/account_by_key_api/get_key_references.js";
import { GetBlockRequest, GetBlockResponse } from "./api/block_api/get_block.js";
import { GetBlockHeaderRequest, GetBlockHeaderResponse } from "./api/block_api/get_block_header.js";
import { GetBlockRangeRequest, GetBlockRangeResponse } from "./api/block_api/get_block_range.js";
import { FindAccountsRequest, FindAccountsResponse } from "./api/database_api/find_accounts.js";
import { GetDynamicGlobalPropertiesRequest, GetDynamicGlobalPropertiesResponse } from "./api/database_api/get_dynamic_global_properties.js";
import { FindRcAccountsRequest, FindRcAccountsResponse } from "./api/rc_api/find_rc_accounts.js";
import { BroadcastTransactionRequest, BroadcastTransactionResponse } from "./api/network_broadcast_api/broadcast_transaction.js";
import { VerifyAuthorityRequest, VerifyAuthorityResponse } from "./api/database_api/index.js";

import { OperationTypeCountsRequest, OperationTypeCountsResponse } from "./rest-api/index.js";
import { GetWitnessesByNameRequest, SingleWitnessResponse } from "./rest-api/hafbe/witnesses/by-name.js";
import { GetAllWitnessesRequest } from "./rest-api/hafbe/witnesses/all.js";

export const HiveRestApiTypes = {
  'hafbe-api': {
    witnesses: {
      params: GetAllWitnessesRequest,
      result: SingleWitnessResponse,
      responseArray: true,
      accountName: {
        params: GetWitnessesByNameRequest,
        result: SingleWitnessResponse,
        urlPath: "{accountName}"
      }
    },
    operationTypeCounts: {
      params: OperationTypeCountsRequest,
      result: OperationTypeCountsResponse,
      responseArray: true,
      urlPath: 'operation-type-counts'
    }
  }
};

export const HiveApiTypes = {
  account_by_key_api: {
    get_key_references: {
      params: GetKeyReferencesRequest,
      result: GetKeyReferencesResponse
    }
  },
  database_api: {
    find_accounts: {
      params: FindAccountsRequest,
      result: FindAccountsResponse
    },
    get_dynamic_global_properties: {
      params: GetDynamicGlobalPropertiesRequest,
      result: GetDynamicGlobalPropertiesResponse
    },
    verify_authority: {
      params: VerifyAuthorityRequest,
      result: VerifyAuthorityResponse
    }
  },
  network_broadcast_api: {
    broadcast_transaction: {
      params: BroadcastTransactionRequest,
      result: BroadcastTransactionResponse
    }
  },
  block_api: {
    get_block: {
      params: GetBlockRequest,
      result: GetBlockResponse
    },
    get_block_header: {
      params: GetBlockHeaderRequest,
      result: GetBlockHeaderResponse
    },
    get_block_range: {
      params: GetBlockRangeRequest,
      result: GetBlockRangeResponse
    }
  },
  rc_api: {
    find_rc_accounts: {
      params: FindRcAccountsRequest,
      result: FindRcAccountsResponse
    }
  }
};
