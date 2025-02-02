import { authority_verification_trace, path_entry, VectorPathEntry } from "../build_wasm/wax.common";
import type { IAuthorityPathEntry, IAuthorityPathTraceData, IAuthorityTraceSignatureInfo, IVerifyAuthorityTrace, TAuthorityEntryProcessingStatus } from "./verify_authority_trace_interface";
import type { TPublicKey, TSignature } from "@hiveio/beekeeper";

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

const pureTransformPathEntry = (entry: path_entry): Omit<IAuthorityPathEntry, 'visitedEntries'> => {
  return {
    processedEntry: entry.processed_entry.toString(),
    processedRole: entry.processed_role.toString(),
    threshold: entry.threshold,
    weight: entry.weight,
    recursionDepth: entry.recursion_depth,
    processingStatus: transformProcessingStatus(entry)
  };
}

const transformPathEntry = (entry: path_entry): IAuthorityPathEntry => {
  return {
    ...pureTransformPathEntry(entry),
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

const getAuthorityTraceLastRoot = (path: VectorPathEntry): path_entry => {
  const size = path.size();
  const result: path_entry = path.get(size -1)!;
  return result;
}

const buildAuthorityPathTraceData = (signatureKeyInfo: Map<TPublicKey, TSignature>,
  entry: path_entry): IAuthorityPathTraceData => {
  const size = entry.visited_entries.size();
  const visitedEntries: IAuthorityPathEntry[]=[];

  /**
   * \warning Here visitedEntries are stored by reference. finalAuthorityPath object can be returned also from
   * execution branch where source visited_entries are not empty, so array declared above is filled then
   */
  const finalAuthorityPath: IAuthorityPathEntry = {
    ...pureTransformPathEntry(entry),
    visitedEntries
  };

  if(size === 0) {
    /** On visited authority path leaves we can try to look for matching key - otherwise it make no sense since entries
     *  at higher levels usually point redirected account
     */
    const signature = signatureKeyInfo.get(finalAuthorityPath.processedEntry);
    if(signature !== undefined) {
      const signatureKey = finalAuthorityPath.processedEntry;

      return {
        finalAuthorityPath,
        matchingSignature: {
          signature,
          signatureKey
        }
      };
    }
    else {
      return {
        finalAuthorityPath,
        matchingSignature: undefined
      };
    }
  }

  let matchingSignature: IAuthorityTraceSignatureInfo|undefined;

  for (let i = 0; i < size; i++) {
    const visitedEntry = entry.visited_entries.get(i)!;
    const data = buildAuthorityPathTraceData(signatureKeyInfo, visitedEntry);
    visitedEntries.push(data.finalAuthorityPath);

    if(data.matchingSignature !== undefined)
      matchingSignature = data.matchingSignature;
  }

  return {
    finalAuthorityPath,
    matchingSignature
  };
}

/**
 * Converts low level authority verification trace from C++ (wasm) version to the public TS interface.
 */
export const convertAuthorityTrace = (signatureKeyInfo: Map<TPublicKey, TSignature>,
  trace: authority_verification_trace): IVerifyAuthorityTrace => {

  const collectedData: IAuthorityPathTraceData[] = [];

  for(let i = 0; i < trace.final_authority_path.size(); ++i)
    collectedData.push(buildAuthorityPathTraceData(signatureKeyInfo, trace.final_authority_path.get(i)!));

  const rootEntries: IAuthorityPathEntry[] = transformAuthorityPath(trace.root);
  const verificationStatus: TAuthorityEntryProcessingStatus = transformProcessingStatus(
    getAuthorityTraceLastRoot(trace.root));

  /// to be removed as deprecated part of IVerifyAuthorityTrace
  const rootEntry: IAuthorityPathEntry = transformPathEntry(getAuthorityTraceLastRoot(trace.root));
  /// to be removed as deprecated part of IVerifyAuthorityTrace
  const finalAuthorityPath: IAuthorityPathEntry[] = transformAuthorityPath(trace.final_authority_path);

  return {
    collectedData,
    rootEntries,
    rootEntry,
    finalAuthorityPath,
    verificationStatus
  };
}
