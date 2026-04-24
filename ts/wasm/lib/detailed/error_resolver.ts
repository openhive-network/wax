import { CxxExceptionData, parseCxxExceptionData } from "./cxx_exception_data.js";
import {
  WaxAssertionError,
  WaxInsufficientBalanceError,
  WaxInvalidAccountNameError,
  WaxInvalidAssetError,
  WaxInvalidFeeError,
  WaxInvalidPermlinkError,
  WaxUnhandledAssertionError,
} from "./errors.js";

type WaxAssertionConstructor = new (raw: CxxExceptionData) => WaxAssertionError;

/**
 * Maps the C++ exception class name (from `getExceptionMessage()` first tuple element)
 * to a category used when the JSON stack data doesn't carry one.
 *
 * In practice C++ enriches every thrown assertion with its category via
 * `throw_recognized_wax_assertion()` (local lookup by `assert_hash`), but this map is
 * kept as a safety net for payloads that were produced without that enrichment.
 */
const CPP_EXCEPTION_NAME_TO_CATEGORY: Record<string, string> = {
  "cpp::wax_protocol_assertion": "protocol",
  "cpp::wax_chain_assertion": "chain",
};

const SUBJECT_TYPE_MAP: ReadonlyMap<string, WaxAssertionConstructor> = new Map<string, WaxAssertionConstructor>([
  ["protocol/account_name", WaxInvalidAccountNameError],
  ["chain/account_name", WaxInvalidAccountNameError],
  ["protocol/asset", WaxInvalidAssetError],
  ["chain/asset", WaxInvalidAssetError],
  ["protocol/permlink", WaxInvalidPermlinkError],
  ["chain/permlink", WaxInvalidPermlinkError],
  ["chain/fee", WaxInvalidFeeError],
  ["chain/balance", WaxInsufficientBalanceError],
]);

function determineCategory(data: CxxExceptionData, waxExceptionName?: string): string {
  const fromData = data.category;
  if (fromData !== "unknown")
    return fromData;
  if (waxExceptionName !== undefined) {
    const mapped = CPP_EXCEPTION_NAME_TO_CATEGORY[waxExceptionName];
    if (mapped !== undefined)
      return mapped;
  }
  return "unknown";
}

/**
 * Parse and classify a C++ exception payload into the proper Wax exception type.
 *
 * @param raw  Either a JSON string or already-parsed C++ exception data payload.
 * @param waxExceptionName Optional C++ exception class name (e.g. `"cpp::wax_chain_assertion"`),
 *                         used as a fallback for category detection when the JSON does not
 *                         contain it explicitly.
 */
export function resolveException(
  raw: string | Record<string, any>,
  waxExceptionName?: string,
): WaxAssertionError {
  const data = parseCxxExceptionData(raw);
  const category = determineCategory(data, waxExceptionName);
  const subjectType = data.subjectType;

  const specific = SUBJECT_TYPE_MAP.get(`${category}/${subjectType}`);
  if (specific !== undefined)
    return new specific(data);

  if (category === "protocol" || category === "chain")
    return new WaxAssertionError(data);

  return new WaxUnhandledAssertionError(data);
}
