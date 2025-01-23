import { operation, transaction } from "../protocol";
import type { ApiOperation, ApiTransaction } from "../api";

/**
 * Helper function to determine which operation/transaction type is about to be processed
 * @param o the object to be tested
 * @returns true if given operation object matches ApiOperation type, false otherwise.
 */
export const matchesHiveProtocolType = (o: operation | ApiOperation | transaction | ApiTransaction): boolean => {
  if ("operations" in o) {
    /// Assume transaction object
    const ops = o.operations
    if (ops.length === 0)
      return true; /// Assume Hive Protocol for direct processing by protocol interface

    return "type" in ops[0];
  }

  /// Assume operation object
  return "type" in o;
}

  /**
   * Allows to convert given operation (represented as protobuf operation type or Hive protocol APIOperation) to JSON string.
   * @remarks JSON generation process **is not straightforward** and requires some additional processing, because some ProtoBuf definitions
   * use another field names in JSON serialization - this is caused by conclict to Python language keyword `from`.
   * @param op the operation to be converted
   * @returns stringified JSON representation of the operation
   */
  export const JSON_stringify_operation = (op: operation | ApiOperation): string => {
    if (matchesHiveProtocolType(op))
      return JSON.stringify(op);
    else
      return JSON.stringify(operation.toJSON(op as operation));
  }

  /**
   * Allows to convert given transaction (represented as protobuf trancation type or Hive protocol APITransaction) to JSON string.
   * @remarks JSON generation process **is not straightforward** and requires some additional processing, because some ProtoBuf definitions
   * use another field names in JSON serialization - this is caused by conclict to Python language keyword `from`.
   * @param tx the transaction to be converted
   * @returns stringified JSON representation of the transaction
   */
  export const JSON_stringify_transaction = (tx: transaction | ApiTransaction): string => {
    if(tx.operations.length === 0) {
      /** I believe the important difference in JSON serialization appears at operation level, so we can safely convert empty transaction
       * to JSON string without any additional processing.
       */
      return JSON.stringify(tx);
    }

    if(matchesHiveProtocolType(tx.operations[0]))
      return JSON.stringify(tx);
    else
      return JSON.stringify(transaction.toJSON(tx as transaction));
  }
