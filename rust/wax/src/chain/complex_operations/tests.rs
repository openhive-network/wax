//! Wire tests of the online complex-operation factories through a chain
//! bound to a canned JSON-RPC server, plus end-to-end pushes of the built
//! operations through the C++ validation layer.

use std::io::{Read, Write};
use std::net::TcpListener;
use std::thread;

use crate::{
    ComplexOperation, HiveChainOptions, create_hive_chain,
    create_wax_foundation,
};

use super::{AccountAuthorityUpdateOperation, LegacyVoteOperation};

const TAPOS: &str = "04c507a8c7fe5be96be64ce7c86855e1806cbde3";
const EXPIRATION: &str = "2023-11-09T21:51:27";

// Trimmed real `database_api` payloads (see `chain/api/tests.rs`): "gtg"
// with `voting_manabar.current_mana == post_voting_power.amount` and a
// downvote manabar at ~25% of it, matching `downvote_pool_percent: 2500`.
const DGP_FIXTURE: &str = r#"{
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

const FIND_ACCOUNTS_FIXTURE: &str = r#"{"accounts": [{
    "id": 27007,
    "name": "gtg",
    "owner": {"weight_threshold": 1, "account_auths": [], "key_auths": [["STM7vP4NNZTiGP2LWfU4nZKGPWzTAcQ1MPtXVchpZq5YRhFqTBhFf", 1]]},
    "active": {"weight_threshold": 1, "account_auths": [["good-karma", 1]], "key_auths": [["STM5ZDPkbLuMLKSKGiuo5BFinviBK9jkAeWXLYchGuPUeVKzGbwz1", 1]]},
    "posting": {"weight_threshold": 1, "account_auths": [], "key_auths": [["STM6dNhJF7K7MnVvrf2uv7SPTFCdRDsDpq2vNVU1atu9Un5LcpKzs", 1]]},
    "memo_key": "STM6dNhJF7K7MnVvrf2uv7SPTFCdRDsDpq2vNVU1atu9Un5LcpKzs",
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
}]}"#;

/// Serves `requests` JSON-RPC requests, dispatching on the requested method
/// and returning the matching canned fixture.
fn spawn_json_rpc_server(requests: usize) -> String {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let url = format!("http://{}", listener.local_addr().unwrap());

    thread::spawn(move || {
        for _ in 0..requests {
            let (mut stream, _) = listener.accept().unwrap();
            let raw = read_http_request(&mut stream);

            let result = if raw.contains("get_dynamic_global_properties") {
                DGP_FIXTURE
            } else if raw.contains("find_accounts") {
                FIND_ACCOUNTS_FIXTURE
            } else {
                panic!("unexpected JSON-RPC request: {raw}");
            };
            let body =
                format!(r#"{{"jsonrpc":"2.0","id":1,"result":{result}}}"#);
            let response = format!(
                "HTTP/1.1 200 OK\r\ncontent-type: application/json\r\n\
                 content-length: {}\r\nconnection: close\r\n\r\n{body}",
                body.len(),
            );

            stream.write_all(response.as_bytes()).unwrap();
        }
    });

    url
}

fn read_http_request(stream: &mut impl Read) -> String {
    let mut raw = Vec::new();
    let mut buf = [0u8; 1024];

    let head_end = loop {
        let n = stream.read(&mut buf).unwrap();
        raw.extend_from_slice(&buf[..n]);

        if let Some(pos) = raw.windows(4).position(|w| w == b"\r\n\r\n") {
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

    String::from_utf8_lossy(&raw).into_owned()
}

fn chain_for(requests: usize) -> crate::HiveChain {
    create_hive_chain(HiveChainOptions {
        api_endpoint: spawn_json_rpc_server(requests),
        ..Default::default()
    })
    .unwrap()
}

#[tokio::test]
async fn legacy_vote_resolves_a_full_upvote() {
    let chain = chain_for(2);

    let operation = LegacyVoteOperation::create_for(
        &chain, "gtg", "author", "permlink", None,
    )
    .await
    .unwrap();

    assert_eq!(operation.vote().voter, "gtg");
    assert_eq!(operation.vote().weight, 10_000);
}

#[tokio::test]
async fn legacy_vote_downvote_round_trips_through_cpp_validation() {
    let chain = chain_for(2);

    let operation = LegacyVoteOperation::create_for(
        &chain, "gtg", "author", "permlink", -100.0,
    )
    .await
    .unwrap();

    // The fixture's downvote pool scales back up to the full voting mana.
    assert_eq!(operation.vote().weight, (-10_000i32) as u32);

    // The two's-complement weight must survive the C++ protocol layer:
    // pushing the operation builds its handle, and validate() applies the
    // protocol range checks on the recovered signed value.
    let foundation = create_wax_foundation(None);
    let mut tx = foundation
        .create_transaction_with_tapos(TAPOS, EXPIRATION)
        .unwrap();

    tx.push_complex_operation(&foundation, operation).unwrap();
    tx.validate().unwrap();
}

#[tokio::test]
async fn legacy_vote_rejects_out_of_range_weight_before_any_request() {
    let chain = create_hive_chain(None).unwrap();

    let error = LegacyVoteOperation::create_for(
        &chain, "gtg", "author", "permlink", 100.5,
    )
    .await
    .unwrap_err();

    assert!(
        error
            .to_string()
            .contains("Vote weight must be between -100% and 100%"),
        "unexpected error: {error}"
    );
}

#[tokio::test]
async fn account_authority_update_emits_only_the_changed_roles() {
    let chain = chain_for(1);

    let mut operation =
        AccountAuthorityUpdateOperation::create_for(&chain, "gtg")
            .await
            .unwrap();

    assert!(!operation.is_effective());
    assert!(operation.active.has("good-karma", 1));

    operation
        .active
        .add("STM7vP4NNZTiGP2LWfU4nZKGPWzTAcQ1MPtXVchpZq5YRhFqTBhFf", 2)
        .unwrap();

    assert!(operation.is_effective());

    let foundation = create_wax_foundation(None);
    let operations = operation.finalize(&foundation).unwrap();

    assert_eq!(operations.len(), 1);

    let update = match &operations[0].value {
        Some(crate::proto::operation::Value::AccountUpdate2Operation(op)) => op,
        other => panic!("expected AccountUpdate2Operation, got {other:?}"),
    };

    assert_eq!(update.account, "gtg");
    assert!(update.owner.is_none());
    assert!(update.posting.is_none());
    assert!(update.memo_key.is_none());

    let active = update.active.as_ref().expect("active must be present");

    assert_eq!(active.account_auths.get("good-karma"), Some(&1));
    assert_eq!(
        active
            .key_auths
            .get("STM7vP4NNZTiGP2LWfU4nZKGPWzTAcQ1MPtXVchpZq5YRhFqTBhFf"),
        Some(&2)
    );
}

#[tokio::test]
async fn account_authority_update_hive_returns_every_role_for_bulk_edits() {
    let chain = chain_for(1);

    let mut operation =
        AccountAuthorityUpdateOperation::create_for(&chain, "gtg")
            .await
            .unwrap();

    let roles = operation.hive();
    roles
        .active
        .add(
            "STM7vP4NNZTiGP2LWfU4nZKGPWzTAcQ1MPtXVchpZq5YRhFqTBhFf",
            None,
        )
        .unwrap();
    roles
        .memo
        .set("STM8MN3FNBa8WbEpxz3wGL3L1mkt6sGnncH8iuto7r8Wa3T9NSSGT")
        .unwrap();

    assert_eq!(roles.owner.role(), super::HiveRole::Owner);
    assert_eq!(roles.posting.role(), super::HiveRole::Posting);
    assert!(operation.is_effective());
    assert!(operation.active.changed());
    assert!(operation.memo.changed());
}

#[tokio::test]
async fn account_authority_update_round_trips_through_cpp_validation() {
    let chain = chain_for(1);

    let mut operation =
        AccountAuthorityUpdateOperation::create_for(&chain, "gtg")
            .await
            .unwrap();

    // A real Hive public key (from the canonical wax fixtures): the memo key
    // is routed through hive::protocol::public_key_type, which base58check-
    // parses it on construction.
    operation
        .memo
        .set("STM8MN3FNBa8WbEpxz3wGL3L1mkt6sGnncH8iuto7r8Wa3T9NSSGT")
        .unwrap();

    let foundation = create_wax_foundation(None);
    let mut tx = foundation
        .create_transaction_with_tapos(TAPOS, EXPIRATION)
        .unwrap();

    tx.push_complex_operation(&foundation, operation).unwrap();
    tx.validate().unwrap();
}

#[tokio::test]
async fn account_authority_update_rejects_the_temp_account() {
    // The temp-account check runs against the local protocol config before
    // any API request, so no server is needed.
    let chain = create_hive_chain(None).unwrap();

    let error = AccountAuthorityUpdateOperation::create_for(&chain, "temp")
        .await
        .unwrap_err();

    assert!(
        error.to_string().contains("temporary account"),
        "unexpected error: {error}"
    );
}
