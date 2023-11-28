import { GetKeyReferencesRequest, GetKeyReferencesResponse } from "./api/account_by_key_api/get_key_references.js";
import { GetBlockRequest, GetBlockResponse } from "./api/block_api/get_block.js";
import { GetBlockHeaderRequest, GetBlockHeaderResponse } from "./api/block_api/get_block_header.js";
import { GetBlockRangeRequest, GetBlockRangeResponse } from "./api/block_api/get_block_range.js";
import { FindAccountsRequest, FindAccountsResponse } from "./api/database_api/find_accounts.js";
import { GetDynamicGlobalPropertiesRequest, GetDynamicGlobalPropertiesResponse } from "./api/database_api/get_dynamic_global_properties.js";
import { BroadcastTransactionRequest, BroadcastTransactionResponse } from "./api/network_broadcast_api/broadcast_transaction.js";

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
  }
};
