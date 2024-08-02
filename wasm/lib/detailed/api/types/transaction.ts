import { type ITransaction } from "../../../interfaces.js";
import { Type, plainToInstance } from "class-transformer";
import { Min, Max, IsDateString, IsInt, IsObject, IsString, ValidateNested } from "class-validator";

export class ApiOperation {
  @IsString()
  public type!: string;

  @IsObject()
  public value!: object;
}

export class ApiTransaction {
  /**
   * Constructs new ApiTransaction object
   *
   * @param {?object} apiTransaction optional API object either from the remote Node or {@link ITransaction.toApiJson}
   *
   * @example
   * ```ts
   * new ApiTransaction(transactionBuilder.toApiJson());
   * ```
   */
  public constructor(apiTransaction?: object) {
    if(apiTransaction !== undefined) {
      const { operations, ...otherTransactionData } = apiTransaction as any;

      Object.assign(this, otherTransactionData);

      if(Array.isArray(operations))
        for(const op of operations)
          this.operations.push(plainToInstance(ApiOperation, op));
    }
  }

  @IsInt()
  @Min(0) // Should be set to min/max. uint16 value
  @Max(65535)
  public ref_block_num!: number;

  @IsInt()
  @Min(0)
  @Max(4294967295)
  public ref_block_prefix!: number;

  @IsDateString()
  public expiration!: string;

  @ValidateNested({ each: true })
  @Type(() => ApiOperation)
  public operations: Array<ApiOperation> = [];

  @IsObject({ each: true })
  public extensions: object[] = [];

  @IsString({ each: true })
  public signatures: string[] = [];
}
