// We could potentially reuse types generated from wax-api-jsonrpc package here

export interface ApiOperation {
  type: string;
  value: Record<string, any>;
}

export type LegacyApiOperation = ([string, Record<string, any>]) | ([number, Record<string, any>]);

interface BaseTransaction<OpType> {
  ref_block_num: number;
  ref_block_prefix: number;
  expiration: string;
  operations: Array<OpType>;
  extensions: object[];
  signatures: string[];
}

export type ApiTransaction = BaseTransaction<ApiOperation>;
export type LegacyApiTransaction = BaseTransaction<LegacyApiOperation>;
