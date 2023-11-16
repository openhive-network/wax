import { GetKeyReferencesRequest, GetKeyReferencesResponse } from "./api/account_by_key_api/get_key_references.js";
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
  }
};
