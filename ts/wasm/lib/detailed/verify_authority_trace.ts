import { VectorPathEntry } from "../build_wasm/wax.common";
import type { IAuthorityPathEntry, IVerifyAuthorityTrace, TAuthorityEntryProcessingStatus } from "../verify_authority_trace_interface";
import type { authority_verification_trace, path_entry } from "../wax_module";

/// TODO export it through embind
enum authority_entry_processing_flags
{
  //ENTERING_AUTHORITY   = 0x01
  NOT_MATCHING_KEY        = 0x02,
  MATCHING_KEY            = 0x04,
  INSUFFICIENT_WEIGHT     = 0x08,
  DEPTH_LIMIT_EXCEEDED    = 0x10,
  ACCOUNT_LIMIT_EXCEEDED  = 0x20,
  CYCLE_DETECTED          = 0x40,
  MISSING_ACCOUNT         = 0x80,
};

const transformProcessingStatus = (entry: path_entry): TAuthorityEntryProcessingStatus => {
  const flags = entry.flags;

  if(flags &
    (authority_entry_processing_flags.INSUFFICIENT_WEIGHT|authority_entry_processing_flags.DEPTH_LIMIT_EXCEEDED|
    authority_entry_processing_flags.ACCOUNT_LIMIT_EXCEEDED|authority_entry_processing_flags.CYCLE_DETECTED|
    authority_entry_processing_flags.MISSING_ACCOUNT))
    return {
      entryAccepted: false,

      accountAuthorityProcessingDepthExceeded: (flags & authority_entry_processing_flags.DEPTH_LIMIT_EXCEEDED) !== 0,
      accountAuthorityCountExceeded: (flags & authority_entry_processing_flags.ACCOUNT_LIMIT_EXCEEDED) !== 0,
      accountAuthorityPointsMissingAccount: (flags & authority_entry_processing_flags.MISSING_ACCOUNT) !== 0,
      hasAccountAuthorityCycle: (flags & authority_entry_processing_flags.CYCLE_DETECTED) !== 0,
      hasInsufficientWeight: (flags & authority_entry_processing_flags.INSUFFICIENT_WEIGHT) !== 0,
      hasMatchingPublicKey: (flags & authority_entry_processing_flags.MATCHING_KEY) !== 0,
    };
    
  return {
    entryAccepted: true,
    isOpenAuthority: entry.threshold === 0
  };
}

const transformPathEntry = (entry: path_entry): IAuthorityPathEntry => {
  return {
    processedEntry: entry.processed_entry.toString(),
    processedRole: entry.processed_role.toString(),
    threshold: entry.threshold,
    weight: entry.weight,
    recursionDepth: entry.recursion_depth,
    processingStatus: transformProcessingStatus(entry),
    visitedEntries: transformAuthorityPath(entry.visited_entries)
  };
};

const transformAuthorityPath = (path: VectorPathEntry): Array<IAuthorityPathEntry> => {
  const size = path.size();

  const result: Array<IAuthorityPathEntry> = new Array(size);

  for (let i = 0; i < size; i++)
    result[i] = transformPathEntry(path.get(i)!);

  return result;
}

/**
 * Converts low level authority verification trace from C++ (wasm) version to the public TS interface.
 */
export const convertAuthorityTrace = (trace: authority_verification_trace): IVerifyAuthorityTrace => {

  const rootEntry: IAuthorityPathEntry = transformPathEntry(trace.root);
  const finalAuthorityPath: IAuthorityPathEntry[] = transformAuthorityPath(trace.final_authority_path);
  const verificationStatus: TAuthorityEntryProcessingStatus = transformProcessingStatus(trace.root);

  return {
    rootEntry,
    finalAuthorityPath,
    verificationStatus
  };
}
