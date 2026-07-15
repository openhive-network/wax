// Integration tests of the chain-level helpers ported from TS
// `IHiveChainInterface`: `broadcast` (all three input forms) and the
// per-account manabar accessors, exercised against the scripted JSON-RPC
// server from `common.rs`.
//
// TS NOTE: mirrors the `chain_api.ts` surface (`broadcast`,
// `calculateCurrentManabarValueForAccount`,
// `calculateManabarFullRegenerationTimeForAccount`).

use chrono::Utc;
use serde_json::{Value, json};

use wax::models::basic::HiveDateTime;
use wax::models::enums::EManabarType;
use wax::{HiveChain, HiveChainExt, WaxChainOptions, create_hive_chain};

use crate::common::{
    DGPO_TIME_SECONDS, OTHER_PUBLIC_KEY, account_update2_value,
    api_account_json, authority_json, dgpo_result, find_accounts_result,
    rc_account_json, spawn_json_rpc_server, transfer_value,
};

// The head block id of `dgpo_result` — TaPoS ref_block_num 0x578e and
// ref_block_prefix 0x6dcf900a.
const HEAD_BLOCK_ID: &str = "05c1578e0a90cf6de23e3fbd407ba00fedbb1c15";

fn chain_for(endpoint: String) -> Box<dyn HiveChain> {
    create_hive_chain(WaxChainOptions {
        api_endpoint: endpoint,
        ..Default::default()
    })
    .unwrap()
}

/// An `ApiAccount` for `alice` with the given vote power and one manabar
/// field (`voting_manabar` / `downvote_manabar`) overridden.
fn manabar_account_json(
    post_voting_power: &str,
    manabar_field: &str,
    current_mana: i64,
    last_update_time: u32,
) -> Value {
    let mut account = api_account_json(
        "alice",
        authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]),
        OTHER_PUBLIC_KEY,
    );
    account["post_voting_power"]["amount"] = json!(post_voting_power);
    account[manabar_field] = json!({
        "current_mana": current_mana,
        "last_update_time": last_update_time,
    });

    account
}

// ---------------------------------------------------------------------------
// broadcast
// ---------------------------------------------------------------------------

#[tokio::test]
async fn broadcast_converts_offline_transaction_to_api_form() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![json!({})]);
    let chain = chain_for(endpoint);

    let mut tx = chain
        .create_transaction_with_tapos(HEAD_BLOCK_ID, "2025-07-08T12:35:57")
        .unwrap();
    tx.push_operation(chain.create_operation(transfer_value("hello")));

    chain.broadcast(&tx).await.unwrap();

    let call = captured.recv().unwrap();
    assert_eq!(call.method, "network_broadcast_api.broadcast_transaction");
    assert_eq!(call.params["max_block_age"], json!(-1));
    assert_eq!(call.params["trx"]["ref_block_num"], json!(0x578e));
    assert_eq!(call.params["trx"]["ref_block_prefix"], json!(0x6dcf900au32));
    assert_eq!(call.params["trx"]["expiration"], json!("2025-07-08T12:35:57"));
    assert_eq!(
        call.params["trx"]["operations"][0]["type"],
        json!("transfer_operation")
    );
    // An offline transaction implies no on-chain checks — one call only.
    assert!(captured.try_recv().is_err(), "expected exactly one call");
}

#[tokio::test]
async fn broadcast_runs_on_chain_verification_for_online_transaction() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        find_accounts_result(vec![
            api_account_json(
                "alice",
                authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]),
                OTHER_PUBLIC_KEY,
            ),
            api_account_json(
                "bob",
                authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]),
                OTHER_PUBLIC_KEY,
            ),
        ]),
        json!({}),
    ]);
    let chain = chain_for(endpoint);

    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(chain.create_operation(transfer_value("hello world")));

    chain.broadcast(&tx).await.unwrap();

    // create_transaction anchors TaPoS...
    assert_eq!(
        captured.recv().unwrap().method,
        "database_api.get_dynamic_global_properties"
    );
    // ...broadcast first performs the on-chain verification (key-leak scan
    // over the impacted accounts)...
    assert_eq!(captured.recv().unwrap().method, "database_api.find_accounts");
    // ...and only then posts.
    let broadcast = captured.recv().unwrap();
    assert_eq!(
        broadcast.method,
        "network_broadcast_api.broadcast_transaction"
    );
    assert_eq!(broadcast.params["max_block_age"], json!(-1));
    assert_eq!(
        broadcast.params["trx"]["operations"].as_array().unwrap().len(),
        1
    );
    assert!(captured.try_recv().is_err(), "expected exactly three calls");
}

#[tokio::test]
async fn broadcast_aborts_when_on_chain_verification_fails() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        // Only `alice` exists; `ghost` is missing from the rc response.
        json!({ "rc_accounts": [rc_account_json("alice")] }),
    ]);
    let chain = chain_for(endpoint);

    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(
        chain.create_operation(account_update2_value("alice", "ghost")),
    );

    let error = chain.broadcast(&tx).await.unwrap_err();

    assert_eq!(error.to_string(), r#"Accounts "ghost" do not exist!"#);

    captured.recv().unwrap();
    assert_eq!(captured.recv().unwrap().method, "rc_api.find_rc_accounts");
    assert!(
        captured.try_recv().is_err(),
        "a failed verification must not reach the broadcast call"
    );
}

// ---------------------------------------------------------------------------
// calculate_current_manabar_value_for_account
// ---------------------------------------------------------------------------

#[tokio::test]
async fn upvote_manabar_value_uses_account_vote_power() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        // The template's voting manabar is full (current == vote power).
        find_accounts_result(vec![api_account_json(
            "alice",
            authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]),
            OTHER_PUBLIC_KEY,
        )]),
    ]);
    let chain = chain_for(endpoint);

    let manabar = chain
        .calculate_current_manabar_value_for_account(
            "alice",
            EManabarType::Upvote,
        )
        .await
        .unwrap();

    assert_eq!(manabar.max_mana, 323_542_936_294_746);
    assert_eq!(manabar.current_mana, 323_542_936_294_746);

    assert_eq!(
        captured.recv().unwrap().method,
        "database_api.get_dynamic_global_properties"
    );
    let fetch = captured.recv().unwrap();
    assert_eq!(fetch.method, "database_api.find_accounts");
    assert_eq!(
        fetch.params,
        json!({ "accounts": ["alice"], "delayed_votes_active": true })
    );
    assert!(captured.try_recv().is_err(), "expected exactly two calls");
}

// TS NOTE: mirrors the `getManabarDataArguments` downvote branch — the
// maximum is the vote power scaled to `downvote_pool_percent` (2500 = 25% in
// the dgpo fixture), dividing first when the vote power is large.
#[tokio::test]
async fn downvote_manabar_scales_max_to_pool_share() {
    let (endpoint, _captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        // Small vote power: scaled as (power * percent) / 100%.
        find_accounts_result(vec![manabar_account_json(
            "1000000",
            "downvote_manabar",
            100,
            DGPO_TIME_SECONDS,
        )]),
        dgpo_result(),
        // Large vote power (> 10^8): scaled as (power / 100%) * percent.
        find_accounts_result(vec![manabar_account_json(
            "323542936294746",
            "downvote_manabar",
            40_000_000_000_000,
            DGPO_TIME_SECONDS,
        )]),
    ]);
    let chain = chain_for(endpoint);

    let small = chain
        .calculate_current_manabar_value_for_account(
            "alice",
            EManabarType::Downvote,
        )
        .await
        .unwrap();

    assert_eq!(small.max_mana, 250_000);
    assert_eq!(small.current_mana, 100);

    let large = chain
        .calculate_current_manabar_value_for_account(
            "alice",
            EManabarType::Downvote,
        )
        .await
        .unwrap();

    assert_eq!(large.max_mana, 80_885_734_072_500);
    assert_eq!(large.current_mana, 40_000_000_000_000);
}

#[tokio::test]
async fn rc_manabar_value_comes_from_rc_api() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        // The fixture's RC manabar is full (current == max_rc).
        json!({ "rc_accounts": [rc_account_json("alice")] }),
    ]);
    let chain = chain_for(endpoint);

    let manabar = chain
        .calculate_current_manabar_value_for_account("alice", EManabarType::Rc)
        .await
        .unwrap();

    assert_eq!(manabar.max_mana, 58_291_273_068);
    assert_eq!(manabar.current_mana, 58_291_273_068);

    captured.recv().unwrap();
    let fetch = captured.recv().unwrap();
    assert_eq!(fetch.method, "rc_api.find_rc_accounts");
    assert_eq!(fetch.params, json!({ "accounts": ["alice"] }));
}

// ---------------------------------------------------------------------------
// calculate_manabar_full_regeneration_time_for_account
// ---------------------------------------------------------------------------

#[tokio::test]
async fn full_regeneration_time_spans_the_regen_window() {
    let (endpoint, _captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        // Already full at head time — regenerated "now" (the head time).
        find_accounts_result(vec![api_account_json(
            "alice",
            authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]),
            OTHER_PUBLIC_KEY,
        )]),
        dgpo_result(),
        // Empty at head time — full one 5-day regen window later.
        find_accounts_result(vec![manabar_account_json(
            "323542936294746",
            "voting_manabar",
            0,
            DGPO_TIME_SECONDS,
        )]),
    ]);
    let chain = chain_for(endpoint);

    let already_full = chain
        .calculate_manabar_full_regeneration_time_for_account(
            "alice",
            EManabarType::Upvote,
        )
        .await
        .unwrap();

    assert_eq!(
        already_full,
        HiveDateTime::parse("2025-07-08T12:34:57").unwrap()
    );

    let empty = chain
        .calculate_manabar_full_regeneration_time_for_account(
            "alice",
            EManabarType::Upvote,
        )
        .await
        .unwrap();

    assert_eq!(empty, HiveDateTime::parse("2025-07-13T12:34:57").unwrap());
}

// TS NOTE: TS returns `new Date()` when the manabar has no capacity; the
// Rust port reports "now" the same way.
#[tokio::test]
async fn full_regeneration_time_reports_empty_capacity_as_now() {
    let (endpoint, _captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        find_accounts_result(vec![manabar_account_json(
            "0",
            "voting_manabar",
            0,
            DGPO_TIME_SECONDS,
        )]),
    ]);
    let chain = chain_for(endpoint);

    let before = Utc::now();
    let time = chain
        .calculate_manabar_full_regeneration_time_for_account(
            "alice",
            EManabarType::Upvote,
        )
        .await
        .unwrap();
    let after = Utc::now();

    assert!(time.inner() >= before && time.inner() <= after);
}

#[tokio::test]
async fn manabar_helpers_report_missing_accounts() {
    let (endpoint, _captured) = spawn_json_rpc_server(vec![
        dgpo_result(),
        find_accounts_result(vec![]),
        dgpo_result(),
        json!({ "rc_accounts": [] }),
    ]);
    let chain = chain_for(endpoint);

    let error = chain
        .calculate_current_manabar_value_for_account(
            "ghost",
            EManabarType::Upvote,
        )
        .await
        .unwrap_err();

    assert_eq!(
        error.to_string(),
        r#"No such account on chain with given name: "ghost""#
    );

    let error = chain
        .calculate_current_manabar_value_for_account("ghost", EManabarType::Rc)
        .await
        .unwrap_err();

    assert_eq!(
        error.to_string(),
        r#"No such account on chain with given name: "ghost""#
    );
}
