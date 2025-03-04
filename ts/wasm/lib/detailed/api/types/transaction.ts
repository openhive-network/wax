export interface ApiOperation {
  type: string;
  value: object;
}

export interface ApiTransaction {
  ref_block_num: number;
  ref_block_prefix: number;
  expiration: string;
  operations: Array<ApiOperation>;
  extensions: object[];
  signatures: string[];
}
