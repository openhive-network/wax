// Integration tests of the online transaction surface:
// `HiveChain::create_transaction`, `OnlineTransaction`
// (`generate_authority_verification_trace`, `perform_on_chain_verification`)
// and the round-based authority fetching behind them, all exercised against
// a scripted JSON-RPC server (see `common.rs` for the server and the
// chain-response fixtures).
//
// TS NOTE: the TS suite covers this surface through live-chain style tests
// (`ts/wasm/__tests__/detailed/*`); the Rust port scripts the wire instead,
// so the request sequence (fetch rounds, batch payloads) is asserted too.

use serde_json::json;

use wax::{
    AuthorityEntryProcessingStatus, AuthorityPathEntry, HiveChainOptions,
    ProcessedEntry, WaxChainError, create_hive_chain,
};

use crate::common::{
    BeekeeperSignatureProvider, OTHER_PUBLIC_KEY, account_update2_value,
    api_account_json, authority_json, dgpo_result, find_accounts_result,
    new_in_memory_beekeeper, rc_account_json, spawn_json_rpc_server,
    transfer_value,
};

// The WIF / public-key pair pinned by the TS fixtures — see
// `tests/detailed/hive_base.rs`.
const FIXTURE_WIF: &str = "5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT";
const FIXTURE_PUBLIC_KEY: &str =
    "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh";

#[tokio::test]
async fn create_transaction_anchors_tapos_to_head_block() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![dgpo_result()]);
    let chain = create_hive_chain(HiveChainOptions {
        api_endpoint: endpoint,
        ..Default::default()
    })
    .unwrap();

    let mut tx = chain.create_transaction(None).await.unwrap();

    assert_eq!(
        captured.recv().unwrap().method,
        "database_api.get_dynamic_global_properties"
    );

    let proto_tx = tx.transaction();
    assert_eq!(proto_tx.ref_block_num, 0x578e);
    assert_eq!(proto_tx.ref_block_prefix, 0x6dcf900a);
    assert!(!proto_tx.expiration.is_empty());

    // The inherent `push_operation` builds in place, keeping the online type.
    tx.push_operation(chain.create_operation(transfer_value("hello")));

    assert_eq!(tx.transaction().operations.len(), 1);
    tx.validate().unwrap();
}

#[tokio::test]
async fn trace_accepts_directly_authorized_signature_key() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        find_accounts_result(vec![api_account_json(
            "alice",
            authority_json(1, &[], &[(FIXTURE_PUBLIC_KEY, 1)]),
            OTHER_PUBLIC_KEY,
        )]),
    ]);
    let chain = create_hive_chain(HiveChainOptions {
        api_endpoint: endpoint,
        ..Default::default()
    })
    .unwrap();

    let mut bk = new_in_memory_beekeeper();
    let created = bk
        .api
        .session(&bk.token)
        .create_wallet("w0", Some("pw"), Some(true))
        .expect("create_wallet");
    let mut wallet = created.wallet;
    let public_key = wallet.import_key(FIXTURE_WIF).expect("import_key");

    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(chain.create_operation(transfer_value("hello")));

    let provider = BeekeeperSignatureProvider::new(wallet);
    let signature = tx.sign(&provider, &public_key).expect("sign");

    let trace = tx
        .generate_authority_verification_trace(false, None)
        .await
        .unwrap();

    assert!(matches!(
        trace.verification_status,
        Some(AuthorityEntryProcessingStatus::Accepted {
            is_open_authority: false
        })
    ));

    assert_eq!(trace.collected_data.len(), 1);
    let matching = &trace.collected_data[0].matching_signatures;
    assert_eq!(matching.len(), 1);
    assert_eq!(matching[0].signature_key, public_key);
    assert_eq!(matching[0].signature, signature);

    assert!(!trace.root_entries.is_empty());

    // dgpo + a single authority fetch round for the seeded account.
    captured.recv().unwrap();
    let fetch = captured.recv().unwrap();
    assert_eq!(fetch.method, "database_api.find_accounts");
    assert_eq!(
        fetch.params,
        json!({ "accounts": ["alice"], "delayed_votes_active": true })
    );
    assert!(captured.try_recv().is_err(), "expected exactly two calls");
}

#[tokio::test]
async fn trace_fetches_redirected_account_authority_in_second_round() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        find_accounts_result(vec![api_account_json(
            "alice",
            authority_json(1, &[("corp", 1)], &[]),
            OTHER_PUBLIC_KEY,
        )]),
        find_accounts_result(vec![api_account_json(
            "corp",
            authority_json(1, &[], &[(FIXTURE_PUBLIC_KEY, 1)]),
            OTHER_PUBLIC_KEY,
        )]),
    ]);
    let chain = create_hive_chain(HiveChainOptions {
        api_endpoint: endpoint,
        ..Default::default()
    })
    .unwrap();

    let mut bk = new_in_memory_beekeeper();
    let created = bk
        .api
        .session(&bk.token)
        .create_wallet("w0", Some("pw"), Some(true))
        .expect("create_wallet");
    let mut wallet = created.wallet;
    let public_key = wallet.import_key(FIXTURE_WIF).expect("import_key");

    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(chain.create_operation(transfer_value("hello")));

    let provider = BeekeeperSignatureProvider::new(wallet);
    tx.sign(&provider, &public_key).expect("sign");

    let trace = tx
        .generate_authority_verification_trace(false, None)
        .await
        .unwrap();

    assert!(matches!(
        trace.verification_status,
        Some(AuthorityEntryProcessingStatus::Accepted { .. })
    ));
    assert_eq!(
        trace.collected_data[0].matching_signatures[0].signature_key,
        public_key
    );

    // The signature key sits behind an account-authority redirection, so the
    // path must descend through `corp`.
    assert!(any_entry(
        &trace.collected_data[0].final_authority_path,
        &|entry| {
            matches!(&entry.processed_entry, ProcessedEntry::Account(name) if name == "corp")
        }
    ));

    captured.recv().unwrap();
    let first = captured.recv().unwrap();
    assert_eq!(
        first.params,
        json!({ "accounts": ["alice"], "delayed_votes_active": true })
    );
    let second = captured.recv().unwrap();
    assert_eq!(
        second.params,
        json!({ "accounts": ["corp"], "delayed_votes_active": true })
    );
}

#[tokio::test]
async fn trace_terminates_when_redirected_account_does_not_exist() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        find_accounts_result(vec![api_account_json(
            "alice",
            authority_json(1, &[("ghost", 1)], &[]),
            OTHER_PUBLIC_KEY,
        )]),
        // The chain does not know `ghost`.
        find_accounts_result(vec![]),
    ]);
    let chain = create_hive_chain(HiveChainOptions {
        api_endpoint: endpoint,
        ..Default::default()
    })
    .unwrap();

    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(chain.create_operation(transfer_value("hello")));

    // Unsigned: the point is loop termination and the missing-account flag.
    let trace = tx
        .generate_authority_verification_trace(false, None)
        .await
        .unwrap();

    assert!(matches!(
        trace.verification_status,
        Some(AuthorityEntryProcessingStatus::Rejected { .. })
    ));
    assert!(trace.root_entries.iter().any(|entry| {
        any_entry(entry, &|entry| {
            matches!(
                entry.processing_status,
                AuthorityEntryProcessingStatus::Rejected {
                    account_authority_points_missing_account: true,
                    ..
                }
            )
        })
    }));

    captured.recv().unwrap();
    assert_eq!(
        captured.recv().unwrap().method,
        "database_api.find_accounts"
    );
    assert_eq!(
        captured.recv().unwrap().params,
        json!({ "accounts": ["ghost"], "delayed_votes_active": true })
    );
    assert!(
        captured.try_recv().is_err(),
        "the unknown account must not be re-requested"
    );
}

#[tokio::test]
async fn on_chain_verification_passes_for_clean_memo() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        find_accounts_result(vec![
            api_account_json(
                "alice",
                authority_json(1, &[], &[(FIXTURE_PUBLIC_KEY, 1)]),
                OTHER_PUBLIC_KEY,
            ),
            api_account_json(
                "bob",
                authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]),
                OTHER_PUBLIC_KEY,
            ),
        ]),
    ]);
    let chain = create_hive_chain(HiveChainOptions {
        api_endpoint: endpoint,
        ..Default::default()
    })
    .unwrap();

    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(chain.create_operation(transfer_value("hello world")));

    tx.perform_on_chain_verification().await.unwrap();

    captured.recv().unwrap();
    let scan = captured.recv().unwrap();
    assert_eq!(scan.method, "database_api.find_accounts");
    // Both impacted accounts are scanned, in sorted batch order.
    assert_eq!(
        scan.params,
        json!({ "accounts": ["alice", "bob"], "delayed_votes_active": true })
    );
    // No existence checks are due for a plain transfer.
    assert!(captured.try_recv().is_err(), "expected exactly two calls");
}

#[tokio::test]
async fn on_chain_verification_detects_private_key_leaked_into_memo() {
    let (endpoint, _captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        find_accounts_result(vec![
            api_account_json(
                "alice",
                authority_json(1, &[], &[(FIXTURE_PUBLIC_KEY, 1)]),
                OTHER_PUBLIC_KEY,
            ),
            api_account_json(
                "bob",
                authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]),
                OTHER_PUBLIC_KEY,
            ),
        ]),
    ]);
    let chain = create_hive_chain(HiveChainOptions {
        api_endpoint: endpoint,
        ..Default::default()
    })
    .unwrap();

    let mut tx = chain.create_transaction(None).await.unwrap();
    // The memo leaks the private key matching alice's active authority key.
    tx.push_operation(chain.create_operation(transfer_value(FIXTURE_WIF)));

    let error = tx.perform_on_chain_verification().await.unwrap_err();

    assert!(matches!(error, WaxChainError::Foundation(_)));
}

#[tokio::test]
async fn on_chain_verification_reports_nonexistent_referenced_accounts() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        // Only `alice` exists; `ghost` is missing from the rc response.
        json!({ "rc_accounts": [rc_account_json("alice")] }),
    ]);
    let chain = create_hive_chain(HiveChainOptions {
        api_endpoint: endpoint,
        ..Default::default()
    })
    .unwrap();

    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(
        chain.create_operation(account_update2_value("alice", "ghost")),
    );

    let error = tx.perform_on_chain_verification().await.unwrap_err();

    assert_eq!(error.to_string(), r#"Accounts "ghost" do not exist!"#);

    captured.recv().unwrap();
    let existence = captured.recv().unwrap();
    assert_eq!(existence.method, "rc_api.find_rc_accounts");
    assert_eq!(existence.params, json!({ "accounts": ["alice", "ghost"] }));
}

fn any_entry(
    entry: &AuthorityPathEntry,
    predicate: &dyn Fn(&AuthorityPathEntry) -> bool,
) -> bool {
    predicate(entry)
        || entry
            .visited_entries
            .iter()
            .any(|child| any_entry(child, predicate))
}
