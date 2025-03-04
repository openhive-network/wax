export interface OperationTypeCountsRequest {
  'result-limit': number;
}

export interface OpsCount {
  count: number;
  op_type_id: number;
}

export interface OperationTypeCountsResponse {
  block_num: number;
  witness: string;
  ops_count: OpsCount[];
}
