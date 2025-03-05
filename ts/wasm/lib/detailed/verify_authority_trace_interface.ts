import type { TPublicKey, TSignature } from "@hiveio/beekeeper";
import type { TAccountName } from './hive_apps_operations';

export type TAuthorityRole = string; /// TODO: unify with role type defined in account authority update meta operation

/**
 * Collects information during given authority processing when it was rejected.
 *
 * @category Authority
 */
export type TAuthorityEntryVerificationFailure = {
  entryAccepted: false;
  /**
   * true if given authority processing has been interrupted by crossing recursion limit
   */
  accountAuthorityProcessingDepthExceeded: boolean;
  /**
   * true if given path entry processing has been interrupted by crossing total number of processed account redirections
   */
  accountAuthorityCountExceeded: boolean;
  /**
   * true if given path entry points to the account not known by the blockchain
   */
  accountAuthorityPointsMissingAccount: boolean;
  /**
   * true if given path entry created a cycle while processig authority account redirection
   */
  hasAccountAuthorityCycle: boolean;
  /**
   * true when key/account entry matched, but the weight was insufficient
   */
  hasInsufficientWeight: boolean;
  /**
   * - true when authority has matching any key, but the weight is insufficient
   * - false when authority does not contain any matching key
  */
  hasMatchingPublicKey: boolean;

  /**
   * Will be set to non-null value when given (decoded from signature) public key matched to some account, but it is not associated in any way to required authority account.
   */
  unrelatedAccountMatchedToPublicKey?: TAccountName;
};

/**
 * Determines set of information collected when given authority path entry has been processed successfully.
 *
 * @category Authority
 */
export type TAuthorityEntryVerificationSuccess = {
  entryAccepted: true;
  /**
   * - true when authority is open
   * - false when any key in the authority matched (it implies sufficient weight)
   */
  isOpenAuthority: boolean;
};

/**
 * Determines set of information collected during processing given authority path entry.
 *
 * @category Authority
 */
export type TAuthorityEntryProcessingStatus = TAuthorityEntryVerificationSuccess | TAuthorityEntryVerificationFailure;

/**
 * Holds data specific to single authority path entry.
 * Authority paths are created while processing Account authority definitions, which contain entries describing authority details (built over account or direct key).
 * 
 * @category Authority
 */
export interface IAuthorityPathEntry {
  /**
   * Account name or public key specified at given authority entry definition.
   */
  processedEntry: TAccountName | TPublicKey;
  /**
   * Role level (posting/active/owner) specific to processed authority entry.
   */
  processedRole: TAuthorityRole;
  /**
   * A threashold specific to processed authority role definition.
   */
  threshold: number;
  /**
   * A weight specific to processed (account or key) entry definition.
   */
  weight: number;

  /**
   * Current processing nest level (in case of account authority redirection it can be > 1).
   */
  recursionDepth: number;

  /**
   * Holds set of gathered information described by {@link TAuthorityEntryProcessingStatus} type specific to given entry.
   */
  processingStatus: TAuthorityEntryProcessingStatus;

  /**
   * Holds entries being visited during traversing redirected account authority definifions.
   * This structure allows to see all paths entered during authority verification process, i.e. just to simplify debugging or analysis.
   */
  visitedEntries: Array<IAuthorityPathEntry>;
}

/**
 * Holds data produced during authority verification process.
 *
 * @category Authority
 */
export interface IAuthorityTraceSignatureInfo {
  signatureKey: TPublicKey;
  signature: TSignature;
};

/**
 * Holds data produced during authority verification process.
 *
 * @category Authority
 */
export interface IAuthorityPathTraceData {
  /**
   * Optionally filled when procesed authority path matched to the signatures and its decoded public key.
   * Can be empty when no matching signature has been found.
   */
  matchingSignatures: IAuthorityTraceSignatureInfo[];

  /**
   * Stores data specific to the authority path chosen:
   * - if verification process has been satisfied, it contains successfull path
   * - when it failed points last processed path.
   */
  finalAuthorityPath: IAuthorityPathEntry;
};

/**
 * Holds data produced during authority verification process.
 * 
 * @category Authority
 */
export interface IVerifyAuthorityTrace
 {
  /**
   * Stores data acquired during authority verification process associated to given public key (decoded from signature). Simplifies matching data to signatures in multiple signature case.
   */
  collectedData: Array<IAuthorityPathTraceData>;
  /**
   * Holds information specific to the account which signed a transaction.
   * Each array element can be specific to separate authority & signature needed to satisfy transaction.
   */
  rootEntries: Array<IAuthorityPathEntry>;

  /**
   * Holds information specific to the account which signed a transaction.
   * Link to last element of {@link rootEntries} array.
   * @deprecated
   */
  rootEntry: IAuthorityPathEntry;

  /**
   * Stores data specific to the authority path chosen:
   * - if verification process has been satisfied, it contains successfull path
   * - when it failed points last processed path.
   * @deprecated
   */
  finalAuthorityPath: Array<IAuthorityPathEntry>;
  /**
   * Holds set of gathered information described by {@link TAuthorityEntryProcessingStatus} type specific to whole authority verification process.
   */
  verificationStatus: TAuthorityEntryProcessingStatus;
};