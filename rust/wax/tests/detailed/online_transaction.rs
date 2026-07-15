// Integration tests of the online transaction surface:
// `HiveChainExt::create_transaction`, `OnlineTransaction`
// (`generate_authority_verification_trace`, `perform_on_chain_verification`)
// and the round-based authority fetching behind them, all exercised against
// a scripted JSON-RPC server.
//
// TS NOTE: the TS suite covers this surface through live-chain style tests
// (`ts/wasm/__tests__/detailed/*`); the Rust port scripts the wire instead,
// so the request sequence (fetch rounds, batch payloads) is asserted too.

use std::io::{Read, Write};
use std::net::TcpListener;
use std::sync::mpsc;
use std::thread;

use serde_json::{Value, json};

use wax::proto::{self, operation::Value as OperationValue};
use wax::{
    AuthorityEntryProcessingStatus, AuthorityPathEntry, HiveChainExt,
    ProcessedEntry, WaxChainError, WaxChainOptions, create_hive_chain,
};

use crate::common::{BeekeeperSignatureProvider, new_in_memory_beekeeper};

// The WIF / public-key pair pinned by the TS fixtures — see
// `tests/detailed/hive_base.rs`.
const FIXTURE_WIF: &str = "5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT";
const FIXTURE_PUBLIC_KEY: &str =
    "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh";

// A second real public key, never matched by any signature in these tests.
const OTHER_PUBLIC_KEY: &str =
    "STM8MN3FNBa8WbEpxz3wGL3L1mkt6sGnncH8iuto7r8Wa3T9NSSGT";

// ---------------------------------------------------------------------------
// Scripted JSON-RPC server
// ---------------------------------------------------------------------------

struct CapturedCall {
    method: String,
    params: Value,
}

/// Serves one JSON-RPC response per entry of `results` (in order), capturing
/// each request's method and params. Every response closes its connection so
/// the client opens a fresh one per call.
fn spawn_json_rpc_server(
    results: Vec<Value>,
) -> (String, mpsc::Receiver<CapturedCall>) {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let url = format!("http://{}", listener.local_addr().unwrap());
    let (captured_tx, captured_rx) = mpsc::channel();

    thread::spawn(move || {
        for result in results {
            let (mut stream, _) = listener.accept().unwrap();
            let mut raw = Vec::new();
            let mut buf = [0u8; 4096];

            let head_end = loop {
                let n = stream.read(&mut buf).unwrap();
                raw.extend_from_slice(&buf[..n]);

                if let Some(pos) = raw.windows(4).position(|w| w == b"\r\n\r\n")
                {
                    break pos + 4;
                }
            };

            let head = String::from_utf8_lossy(&raw[..head_end]).to_lowercase();
            let content_length = head
                .lines()
                .find_map(|line| line.strip_prefix("content-length:"))
                .map_or(0, |value| value.trim().parse::<usize>().unwrap());

            while raw.len() < head_end + content_length {
                let n = stream.read(&mut buf).unwrap();
                raw.extend_from_slice(&buf[..n]);
            }

            let request: Value =
                serde_json::from_slice(&raw[head_end..]).unwrap();
            let body = json!({
                "jsonrpc": "2.0",
                "id": request["id"],
                "result": result,
            })
            .to_string();
            let response = format!(
                "HTTP/1.1 200 OK\r\ncontent-type: application/json\r\n\
                 content-length: {}\r\nconnection: close\r\n\r\n{body}",
                body.len(),
            );
            stream.write_all(response.as_bytes()).unwrap();

            captured_tx
                .send(CapturedCall {
                    method: request["method"]
                        .as_str()
                        .unwrap_or_default()
                        .to_string(),
                    params: request["params"].clone(),
                })
                .unwrap();
        }
    });

    (url, captured_rx)
}

// ---------------------------------------------------------------------------
// Response fixtures
// ---------------------------------------------------------------------------

// `database_api.get_dynamic_global_properties` result; the fixture from
// `src/chain/api/tests.rs`. head_block_id 05c1578e0a90cf6de23e3fbd407ba00f...
// yields ref_block_num 0x578e and ref_block_prefix 0x6dcf900a.
//
// A raw string instead of `json!` — the literal is deep enough to blow the
// default macro recursion limit.
const DGPO_RESULT: &str = r#"{
    "id": 0,
    "head_block_number": 96549390,
    "head_block_id": "05c1578e0a90cf6de23e3fbd407ba00fedbb1c15",
    "time": "2025-07-08T12:34:57",
    "current_witness": "gtg",
    "total_pow": 514415,
    "num_pow_witnesses": 172,
    "virtual_supply": {"amount": "504726954597", "precision": 3, "nai": "@@000000021"},
    "current_supply": {"amount": "489233021062", "precision": 3, "nai": "@@000000021"},
    "init_hbd_supply": {"amount": "0", "precision": 3, "nai": "@@000000013"},
    "current_hbd_supply": {"amount": "13126252559", "precision": 3, "nai": "@@000000013"},
    "total_vesting_fund_hive": {"amount": "141086068060", "precision": 3, "nai": "@@000000021"},
    "total_vesting_shares": {"amount": "263084307129416595", "precision": 6, "nai": "@@000000037"},
    "pending_rewarded_vesting_shares": {"amount": "365194429725286", "precision": 6, "nai": "@@000000037"},
    "pending_rewarded_vesting_hive": {"amount": "194858873", "precision": 3, "nai": "@@000000021"},
    "hbd_interest_rate": 2000,
    "hbd_print_rate": 10000,
    "maximum_block_size": 65536,
    "current_aslot": 96921594,
    "recent_slots_filled": "340282366920938463463374607431768211455",
    "participation_count": 128,
    "last_irreversible_block_num": 96549371,
    "vote_power_reserve_rate": 10,
    "delegation_return_period": 432000,
    "reverse_auction_seconds": 0,
    "available_account_subsidies": 17017685,
    "hbd_stop_percent": 2000,
    "hbd_start_percent": 1900,
    "next_maintenance_time": "2025-07-08T12:47:40",
    "last_budget_time": "2025-07-08T11:47:40",
    "next_daily_maintenance_time": "2025-07-09T02:07:40",
    "content_reward_percent": 6500,
    "vesting_reward_percent": 1500,
    "proposal_fund_percent": 1000,
    "dhf_interval_ledger": {"amount": "8206", "precision": 3, "nai": "@@000000013"},
    "downvote_pool_percent": 2500,
    "current_remove_threshold": 200,
    "early_voting_seconds": 86400,
    "mid_voting_seconds": 172800,
    "max_consecutive_recurrent_transfer_failures": 10,
    "max_recurrent_transfer_end_date": 730,
    "min_recurrent_transfers_recurrence": 24,
    "max_open_recurrent_transfers": 255
}"#;

fn dgpo_result() -> Value {
    serde_json::from_str(DGPO_RESULT).unwrap()
}

fn nai(amount: &str, precision: u32, nai: &str) -> Value {
    json!({ "amount": amount, "precision": precision, "nai": nai })
}

fn authority_json(
    threshold: u32,
    account_auths: &[(&str, u16)],
    key_auths: &[(&str, u16)],
) -> Value {
    let account_auths: Vec<Value> = account_auths
        .iter()
        .map(|(name, weight)| json!([name, weight]))
        .collect();
    let key_auths: Vec<Value> = key_auths
        .iter()
        .map(|(key, weight)| json!([key, weight]))
        .collect();

    json!({
        "weight_threshold": threshold,
        "account_auths": account_auths,
        "key_auths": key_auths,
    })
}

// Static part of an `ApiAccount` object — typed deserialization requires
// every field on the wire. Name, authorities and memo key are patched in by
// `api_account_json`.
const API_ACCOUNT_TEMPLATE: &str = r#"{
    "id": 27007,
    "name": "",
    "owner": null,
    "active": null,
    "posting": null,
    "memo_key": "",
    "json_metadata": "",
    "posting_json_metadata": "",
    "proxy": "",
    "previous_owner_update": "1970-01-01T00:00:00",
    "last_owner_update": "1970-01-01T00:00:00",
    "last_account_update": "2022-01-17T15:12:24",
    "created": "2016-08-10T09:39:24",
    "mined": false,
    "recovery_account": "steem",
    "last_account_recovery": "1970-01-01T00:00:00",
    "reset_account": "null",
    "comment_count": 0,
    "lifetime_vote_count": 0,
    "post_count": 1817,
    "can_vote": true,
    "voting_manabar": {"current_mana": "323542936294746", "last_update_time": 1751966086},
    "downvote_manabar": {"current_mana": 80885734073686, "last_update_time": 1751966086},
    "balance": {"amount": "199001", "precision": 3, "nai": "@@000000021"},
    "savings_balance": {"amount": "0", "precision": 3, "nai": "@@000000021"},
    "hbd_balance": {"amount": "938", "precision": 3, "nai": "@@000000013"},
    "hbd_seconds": "0",
    "hbd_seconds_last_update": "2025-05-22T11:14:03",
    "hbd_last_interest_payment": "2025-05-22T11:14:03",
    "savings_hbd_balance": {"amount": "0", "precision": 3, "nai": "@@000000013"},
    "savings_hbd_seconds": "0",
    "savings_hbd_seconds_last_update": "1970-01-01T00:00:00",
    "savings_hbd_last_interest_payment": "1970-01-01T00:00:00",
    "savings_withdraw_requests": 0,
    "reward_hbd_balance": {"amount": "0", "precision": 3, "nai": "@@000000013"},
    "reward_hive_balance": {"amount": "0", "precision": 3, "nai": "@@000000021"},
    "reward_vesting_balance": {"amount": "0", "precision": 6, "nai": "@@000000037"},
    "reward_vesting_hive": {"amount": "0", "precision": 3, "nai": "@@000000021"},
    "vesting_shares": {"amount": "323542936294746", "precision": 6, "nai": "@@000000037"},
    "delegated_vesting_shares": {"amount": "0", "precision": 6, "nai": "@@000000037"},
    "received_vesting_shares": {"amount": "0", "precision": 6, "nai": "@@000000037"},
    "vesting_withdraw_rate": {"amount": "0", "precision": 6, "nai": "@@000000037"},
    "post_voting_power": {"amount": "323542936294746", "precision": 6, "nai": "@@000000037"},
    "next_vesting_withdrawal": "1969-12-31T23:59:59",
    "withdrawn": 0,
    "to_withdraw": 0,
    "withdraw_routes": 0,
    "pending_transfers": 0,
    "curation_rewards": 1520643,
    "posting_rewards": 8095004,
    "proxied_vsf_votes": ["12508698179992", 0, 0, 0],
    "witnesses_voted_for": 30,
    "last_post": "2025-06-10T07:22:33",
    "last_root_post": "2025-06-10T07:22:33",
    "last_post_edit": "2025-06-10T07:22:33",
    "last_vote_time": "2025-07-08T09:41:33",
    "post_bandwidth": 0,
    "pending_claimed_accounts": 0,
    "open_recurrent_transfers": 0,
    "is_smt": false,
    "delayed_votes": [],
    "governance_vote_expiration_ts": "2026-04-08T18:52:15"
}"#;

/// A full `ApiAccount` object with the given name, active authority and memo
/// key; owner and posting default to a key nothing signs with.
fn api_account_json(name: &str, active: Value, memo_key: &str) -> Value {
    let mut account: Value =
        serde_json::from_str(API_ACCOUNT_TEMPLATE).unwrap();
    account["name"] = json!(name);
    account["owner"] = authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]);
    account["active"] = active;
    account["posting"] = authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]);
    account["memo_key"] = json!(memo_key);

    account
}

fn find_accounts_result(accounts: Vec<Value>) -> Value {
    json!({ "accounts": accounts })
}

fn rc_account_json(name: &str) -> Value {
    json!({
        "account": name,
        "rc_manabar": {"current_mana": "58291273068", "last_update_time": 1751966086},
        "max_rc_creation_adjustment": nai("2020", 6, "@@000000037"),
        "max_rc": "58291273068"
    })
}

// ---------------------------------------------------------------------------
// Operation fixtures
// ---------------------------------------------------------------------------

fn transfer_value(memo: &str) -> OperationValue {
    OperationValue::TransferOperation(proto::Transfer {
        from_account: "alice".into(),
        to_account: "bob".into(),
        amount: proto::Asset {
            amount: "1000".into(),
            precision: 3,
            nai: "@@000000021".into(),
        },
        memo: memo.into(),
    })
}

fn account_update2_value(
    account: &str,
    posting_account_auth: &str,
) -> OperationValue {
    OperationValue::AccountUpdate2Operation(proto::AccountUpdate2 {
        account: account.into(),
        owner: None,
        active: None,
        posting: Some(proto::Authority {
            weight_threshold: 1,
            account_auths: [(posting_account_auth.to_string(), 1u32)]
                .into_iter()
                .collect(),
            key_auths: Default::default(),
        }),
        memo_key: None,
        json_metadata: "".into(),
        posting_json_metadata: "".into(),
        extensions: Vec::new(),
    })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[tokio::test]
async fn create_transaction_anchors_tapos_to_head_block() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![dgpo_result()]);
    let chain = create_hive_chain(WaxChainOptions {
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
    let chain = create_hive_chain(WaxChainOptions {
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

    let trace = tx.generate_authority_verification_trace(false).await.unwrap();

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
    let chain = create_hive_chain(WaxChainOptions {
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

    let trace = tx.generate_authority_verification_trace(false).await.unwrap();

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
    assert!(any_entry(&trace.collected_data[0].final_authority_path, &|entry| {
        matches!(&entry.processed_entry, ProcessedEntry::Account(name) if name == "corp")
    }));

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
    let chain = create_hive_chain(WaxChainOptions {
        api_endpoint: endpoint,
        ..Default::default()
    })
    .unwrap();

    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(chain.create_operation(transfer_value("hello")));

    // Unsigned: the point is loop termination and the missing-account flag.
    let trace = tx.generate_authority_verification_trace(false).await.unwrap();

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
    assert_eq!(captured.recv().unwrap().method, "database_api.find_accounts");
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
    let chain = create_hive_chain(WaxChainOptions {
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
    let chain = create_hive_chain(WaxChainOptions {
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
    let chain = create_hive_chain(WaxChainOptions {
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
