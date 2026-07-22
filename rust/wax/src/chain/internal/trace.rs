//! Conversion of the flattened FFI authority-verification trace into the
//! public [`AuthorityTrace`] model.

use std::collections::{HashMap, HashSet};

use crate::core::ffi::{RustAuthPathNode, RustAuthVerificationTrace};

use crate::base::internal::protocol::rust_protocol;
use crate::models::basic::{PublicKey, Signature};

use crate::chain::authority_trace::{
    AuthorityEntryProcessingStatus, AuthorityPathEntry, AuthorityPathTraceData,
    AuthorityTrace, AuthorityTraceSignatureInfo, ProcessedEntry,
};

// hive::protocol::authority_entry_processing_flags
// (hive/libraries/protocol/include/hive/protocol/authority_trace_data.hpp).
const MATCHING_KEY: u32 = 0x004;
const INSUFFICIENT_WEIGHT: u32 = 0x008;
const DEPTH_LIMIT_EXCEEDED: u32 = 0x010;
const ACCOUNT_LIMIT_EXCEEDED: u32 = 0x020;
const CYCLE_DETECTED: u32 = 0x040;
const MISSING_ACCOUNT: u32 = 0x080;

const REJECTION_FLAGS: u32 = INSUFFICIENT_WEIGHT
    | DEPTH_LIMIT_EXCEEDED
    | ACCOUNT_LIMIT_EXCEEDED
    | CYCLE_DETECTED
    | MISSING_ACCOUNT;

/// Converts the flattened FFI trace into the public model, pairing the
/// signature keys encountered on authority-path leaves with the signatures
/// they were decoded from (`key_signatures`).
pub(crate) fn convert_authority_trace(
    key_signatures: &HashMap<PublicKey, Signature>,
    trace: &RustAuthVerificationTrace,
) -> AuthorityTrace {
    let collected_data = trace
        .final_authority_path_indices
        .iter()
        .map(|&index| build_trace_data(&trace.nodes, index, key_signatures))
        .collect();

    let root_entries = trace
        .root_indices
        .iter()
        .map(|&index| build_path_entry(&trace.nodes, index))
        .collect();

    let verification_status = trace
        .root_indices
        .last()
        .map(|&index| to_processing_status(&trace.nodes[index as usize]));

    AuthorityTrace {
        collected_data,
        root_entries,
        verification_status,
    }
}

fn to_processing_status(
    node: &RustAuthPathNode,
) -> AuthorityEntryProcessingStatus {
    if node.flags & REJECTION_FLAGS != 0 {
        return AuthorityEntryProcessingStatus::Rejected {
            account_authority_processing_depth_exceeded: node.flags
                & DEPTH_LIMIT_EXCEEDED
                != 0,
            account_authority_count_exceeded: node.flags
                & ACCOUNT_LIMIT_EXCEEDED
                != 0,
            account_authority_points_missing_account: node.flags
                & MISSING_ACCOUNT
                != 0,
            has_account_authority_cycle: node.flags & CYCLE_DETECTED != 0,
            has_insufficient_weight: node.flags & INSUFFICIENT_WEIGHT != 0,
            has_matching_public_key: node.flags & MATCHING_KEY != 0,
            unrelated_account_matched_to_public_key: None,
        };
    }

    AuthorityEntryProcessingStatus::Accepted {
        is_open_authority: node.threshold == 0,
    }
}

// NOTE: TS keeps the entry as a bare `TAccountName | TPublicKey` union —
// both are `string` there. The Rust enum makes the variant explicit; account
// names and public keys are disjoint lexical spaces (names are short and
// lowercase, keys carry an uppercase address prefix), so account-name
// validation discriminates reliably.
fn to_processed_entry(entry: &str) -> ProcessedEntry {
    if rust_protocol().cpp_is_valid_account_name(entry) {
        ProcessedEntry::Account(entry.to_string())
    } else {
        ProcessedEntry::PublicKey(entry.to_string())
    }
}

fn build_path_entry(
    nodes: &[RustAuthPathNode],
    index: u32,
) -> AuthorityPathEntry {
    let node = &nodes[index as usize];
    let visited_entries = node
        .visited_indices
        .iter()
        .map(|&child| build_path_entry(nodes, child))
        .collect();

    AuthorityPathEntry {
        processed_entry: to_processed_entry(&node.processed_entry),
        processed_role: node.processed_role.clone(),
        threshold: node.threshold,
        weight: node.weight,
        recursion_depth: node.recursion_depth,
        processing_status: to_processing_status(node),
        visited_entries,
    }
}

fn build_trace_data(
    nodes: &[RustAuthPathNode],
    index: u32,
    key_signatures: &HashMap<PublicKey, Signature>,
) -> AuthorityPathTraceData {
    let node = &nodes[index as usize];

    if node.visited_indices.is_empty() {
        // Only leaves can name a signature key — entries at higher levels
        // point at redirected accounts.
        let matching_signatures = key_signatures
            .get(node.processed_entry.as_str())
            .map(|signature| {
                vec![AuthorityTraceSignatureInfo {
                    signature_key: node.processed_entry.clone(),
                    signature: signature.clone(),
                }]
            })
            .unwrap_or_default();

        return AuthorityPathTraceData {
            matching_signatures,
            final_authority_path: build_path_entry(nodes, index),
        };
    }

    let mut visited_entries = Vec::with_capacity(node.visited_indices.len());
    let mut matching_signatures = Vec::new();
    let mut seen_signatures = HashSet::new();

    for &child in &node.visited_indices {
        let child_data = build_trace_data(nodes, child, key_signatures);
        visited_entries.push(child_data.final_authority_path);

        for info in child_data.matching_signatures {
            if seen_signatures.insert(info.signature.clone()) {
                matching_signatures.push(info);
            }
        }
    }

    AuthorityPathTraceData {
        matching_signatures,
        final_authority_path: AuthorityPathEntry {
            processed_entry: to_processed_entry(&node.processed_entry),
            processed_role: node.processed_role.clone(),
            threshold: node.threshold,
            weight: node.weight,
            recursion_depth: node.recursion_depth,
            processing_status: to_processing_status(node),
            visited_entries,
        },
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const KEY: &str = "STM8MN3FNBa8WbEpxz3wGL3L1mkt6sGnncH8iuto7r8Wa3T9NSSGT";
    const OTHER_KEY: &str =
        "STM8HCf7QLUexogEviN8x1SpKRhFwg2sc8LrWuJqv7QsmWrua6ZyR";

    fn node(
        entry: &str,
        flags: u32,
        threshold: u32,
        visited: Vec<u32>,
    ) -> RustAuthPathNode {
        RustAuthPathNode {
            processed_entry: entry.to_string(),
            processed_role: "active".to_string(),
            recursion_depth: 0,
            threshold,
            weight: 1,
            flags,
            visited_indices: visited,
        }
    }

    fn signatures(entries: &[(&str, &str)]) -> HashMap<PublicKey, Signature> {
        entries
            .iter()
            .map(|(key, signature)| (key.to_string(), signature.to_string()))
            .collect()
    }

    #[test]
    fn accepted_leaf_pairs_matching_signature() {
        let trace = RustAuthVerificationTrace {
            nodes: vec![
                node(KEY, MATCHING_KEY, 1, vec![]),
                node("alice", MATCHING_KEY, 1, vec![0]),
            ],
            root_indices: vec![1],
            final_authority_path_indices: vec![1],
            verification_status: 0,
        };

        let converted =
            convert_authority_trace(&signatures(&[(KEY, "sig-a")]), &trace);

        assert!(matches!(
            converted.verification_status,
            Some(AuthorityEntryProcessingStatus::Accepted {
                is_open_authority: false
            })
        ));

        let data = &converted.collected_data[0];
        assert_eq!(data.matching_signatures.len(), 1);
        assert_eq!(data.matching_signatures[0].signature_key, KEY);
        assert_eq!(data.matching_signatures[0].signature, "sig-a");

        assert!(matches!(
            &data.final_authority_path.processed_entry,
            ProcessedEntry::Account(name) if name == "alice"
        ));
        assert!(matches!(
            &data.final_authority_path.visited_entries[0].processed_entry,
            ProcessedEntry::PublicKey(key) if key == KEY
        ));
    }

    #[test]
    fn rejection_flags_map_to_status_fields() {
        let trace = RustAuthVerificationTrace {
            nodes: vec![node(
                "alice",
                MISSING_ACCOUNT | INSUFFICIENT_WEIGHT | MATCHING_KEY,
                1,
                vec![],
            )],
            root_indices: vec![0],
            final_authority_path_indices: vec![0],
            verification_status: 0,
        };

        let converted = convert_authority_trace(&HashMap::new(), &trace);

        let Some(AuthorityEntryProcessingStatus::Rejected {
            account_authority_processing_depth_exceeded,
            account_authority_count_exceeded,
            account_authority_points_missing_account,
            has_account_authority_cycle,
            has_insufficient_weight,
            has_matching_public_key,
            unrelated_account_matched_to_public_key,
        }) = converted.verification_status
        else {
            panic!("expected a rejected status");
        };

        assert!(account_authority_points_missing_account);
        assert!(has_insufficient_weight);
        assert!(has_matching_public_key);
        assert!(!account_authority_processing_depth_exceeded);
        assert!(!account_authority_count_exceeded);
        assert!(!has_account_authority_cycle);
        assert!(unrelated_account_matched_to_public_key.is_none());
    }

    #[test]
    fn open_authority_reported_on_zero_threshold() {
        let trace = RustAuthVerificationTrace {
            nodes: vec![node("alice", 0, 0, vec![])],
            root_indices: vec![0],
            final_authority_path_indices: vec![],
            verification_status: 0,
        };

        let converted = convert_authority_trace(&HashMap::new(), &trace);

        assert!(matches!(
            converted.verification_status,
            Some(AuthorityEntryProcessingStatus::Accepted {
                is_open_authority: true
            })
        ));
    }

    #[test]
    fn duplicate_signatures_across_children_are_deduplicated() {
        // Two leaves matched by the same key/signature under one parent, plus
        // a distinct second key.
        let trace = RustAuthVerificationTrace {
            nodes: vec![
                node(KEY, MATCHING_KEY, 1, vec![]),
                node(KEY, MATCHING_KEY, 1, vec![]),
                node(OTHER_KEY, MATCHING_KEY, 1, vec![]),
                node("alice", MATCHING_KEY, 2, vec![0, 1, 2]),
            ],
            root_indices: vec![3],
            final_authority_path_indices: vec![3],
            verification_status: 0,
        };

        let converted = convert_authority_trace(
            &signatures(&[(KEY, "sig-a"), (OTHER_KEY, "sig-b")]),
            &trace,
        );

        let data = &converted.collected_data[0];
        let keys: Vec<&str> = data
            .matching_signatures
            .iter()
            .map(|info| info.signature_key.as_str())
            .collect();

        assert_eq!(keys, vec![KEY, OTHER_KEY]);
        assert_eq!(data.final_authority_path.visited_entries.len(), 3);
    }

    #[test]
    fn status_comes_from_last_root_entry() {
        let trace = RustAuthVerificationTrace {
            nodes: vec![
                node("alice", MATCHING_KEY, 1, vec![]),
                node("bob", MISSING_ACCOUNT, 1, vec![]),
            ],
            root_indices: vec![0, 1],
            final_authority_path_indices: vec![],
            verification_status: 0,
        };

        let converted = convert_authority_trace(&HashMap::new(), &trace);

        assert_eq!(converted.root_entries.len(), 2);
        assert!(matches!(
            converted.verification_status,
            Some(AuthorityEntryProcessingStatus::Rejected { .. })
        ));
    }
}
