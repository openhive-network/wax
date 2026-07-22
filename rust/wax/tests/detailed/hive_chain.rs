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
use wax::{HiveChain, HiveChainOptions, create_hive_chain};

use crate::common::{
    DGPO_TIME_SECONDS, OTHER_PUBLIC_KEY, account_update2_value,
    api_account_json, authority_json, dgpo_result, find_accounts_result,
    rc_account_json, spawn_json_rpc_server, transfer_value,
};

// The head block id of `dgpo_result` — TaPoS ref_block_num 0x578e and
// ref_block_prefix 0x6dcf900a.
const HEAD_BLOCK_ID: &str = "05c1578e0a90cf6de23e3fbd407ba00fedbb1c15";

fn chain_for(endpoint: String) -> HiveChain {
    create_hive_chain(HiveChainOptions {
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
    assert_eq!(
        call.params["trx"]["expiration"],
        json!("2025-07-08T12:35:57")
    );
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
    assert_eq!(
        captured.recv().unwrap().method,
        "database_api.find_accounts"
    );
    // ...and only then posts.
    let broadcast = captured.recv().unwrap();
    assert_eq!(
        broadcast.method,
        "network_broadcast_api.broadcast_transaction"
    );
    assert_eq!(broadcast.params["max_block_age"], json!(-1));
    assert_eq!(
        broadcast.params["trx"]["operations"]
            .as_array()
            .unwrap()
            .len(),
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

// ---------------------------------------------------------------------------
// Ports of the remaining `ts/wasm/__tests__/detailed/hive_chain.ts` tests.
//
// Coverage of the TS tests NOT ported below: line 10 (assert exception
// during broadcast) lives in `mock_base.rs::assertion_during_transaction_
// broadcast` and `hive_assertion.rs`; line 30 in
// `hive_chain_custom_opts.rs` (mock) and `live_api.rs` (live); line 45 in
// `online_transaction.rs`; lines 71/98 in `extend_api.rs` and
// `live_api.rs`; lines 146-192 in the scripted manabar tests above. Each
// port below has a `// TS line N` comment pointing back to the TS
// original.
// ---------------------------------------------------------------------------

// TS line 125: "Should be able to calculate current manabar value using hive
// chain interface".
#[test]
fn calculates_current_manabar_value_fixture() {
    let foundation = wax::create_wax_foundation(None);

    let manabar = foundation
        .calculate_current_manabar_value(
            manabar_at(1702548351),
            2196088774870643,
            1952744111294225,
            1702548249,
        )
        .expect("calculate_current_manabar_value");

    assert_eq!(manabar.current_mana, 1953262632254958);
    assert_eq!(manabar.max_mana, 2196088774870643);
    assert_eq!(wax::Manabar::percent(&manabar).to_string(), "88.94");
}

fn manabar_at(seconds: i64) -> HiveDateTime {
    HiveDateTime::from(
        chrono::DateTime::<Utc>::from_timestamp(seconds, 0)
            .expect("valid timestamp"),
    )
}

// TS line 194: "Should be able to change endpointUrl property".
#[test]
fn changes_endpoint_url_property() {
    let chain = create_hive_chain(None).unwrap();

    chain
        .set_endpoint_url("https://best.honey.provider")
        .expect("set_endpoint_url");

    assert_eq!(chain.endpoint_url(), "https://best.honey.provider");
}

// TS lines 203/224: "Should be able to set custom endpointUrl property on
// database api" (also on both extended and base chain objects) — the
// override must route only that namespace's calls.
#[tokio::test]
async fn sets_custom_endpoint_url_on_database_api() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![dgpo_result()]);

    // The chain default is unroutable — only the override can succeed.
    let chain = chain_for("http://127.0.0.1:1".into());
    chain.api().database_api.set_endpoint_url(Some(endpoint));

    chain
        .api()
        .database_api
        .get_dynamic_global_properties(Default::default())
        .await
        .expect("dgpo through the database_api override");
    assert_eq!(
        captured.recv().unwrap().method,
        "database_api.get_dynamic_global_properties"
    );

    // Another namespace keeps following the (unroutable) chain default.
    let error = chain
        .api()
        .block_api
        .get_block(wax::api::GetBlockRequest { block_num: 1 })
        .await;
    assert!(error.is_err(), "block_api must not inherit the override");
}

// TS lines 212/236/248: the endpointUrl relationship between the base chain
// and extended surfaces.
//
// TS NOTE: TS `extend()` clones the chain object, so setting the URL through
// the extended chain reaches the base (line 212) while setting it on the
// base does NOT reach previously extended chains (line 236). The Rust
// `extend()` hands out surfaces sharing one transport, so a chain-level
// `set_endpoint_url` is visible in BOTH directions — the deliberate
// divergence documented on `JsonRpcCaller::set_endpoint_url_for_path`.
#[tokio::test]
async fn endpoint_url_is_shared_with_extended_surfaces() {
    let (endpoint, captured) = spawn_json_rpc_server(vec![dgpo_result()]);

    let chain = chain_for("http://127.0.0.1:1".into());
    // The surface is taken BEFORE the URL change...
    let api = chain.api();

    chain.set_endpoint_url(&endpoint).expect("set_endpoint_url");

    // ...and still follows the new chain-wide endpoint.
    api.database_api
        .get_dynamic_global_properties(Default::default())
        .await
        .expect("dgpo through the shared transport");
    assert_eq!(
        captured.recv().unwrap().method,
        "database_api.get_dynamic_global_properties"
    );
}

// The WIF pair pinned by the TS fixtures plus the second signing key of the
// double-signature tests.
const SIGN_WIF: &str = "5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT";
const OTHER_SIGN_WIF: &str =
    "5KXNQP5feaaXpp28yRrGaFeNYZT7Vrb1PqLEyo7E3pJiG1veLKG";

const FIRST_SIGNATURE: &str = "1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4b40a66cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707";
const SECOND_SIGNATURE: &str = "209e2e371495ae731486c46cad62786ebb4260a54e558c41393e4ee681047ee07b5f476133d1100e08a6b88220c62c372789efbeb17d465d1c65efb0e23f8f1e0b";

fn vote_tapos_tx(foundation: &wax::WaxFoundation) -> wax::Transaction {
    let mut tx = foundation
        .create_transaction_with_tapos(
            "04c1c7a566fc0da66aee465714acee7346b48ac2",
            "2023-08-01T15:38:48",
        )
        .expect("create_transaction_with_tapos");

    tx.push_operation(foundation.create_operation(
        wax::proto::operation::Value::VoteOperation(wax::proto::Vote {
            voter: "otom".into(),
            author: "c0ff33a".into(),
            permlink: "ewxhnjbj".into(),
            weight: 2200,
        }),
    ));

    tx
}

// TS line 268: "Should be able to sign the transaction twice".
#[test]
fn signs_the_transaction_twice() {
    let foundation = wax::create_wax_foundation(None);

    let bk = crate::common::new_in_memory_beekeeper();
    let created = bk.session.create_wallet("w0", "pw").expect("create_wallet");
    let mut wallet = created.wallet;
    let key = wallet.import_key(SIGN_WIF).expect("import_key");
    let other_key = wallet.import_key(OTHER_SIGN_WIF).expect("import_key");

    let mut tx = vote_tapos_tx(&foundation);

    let provider =
        wax_signers_beekeeper::BeekeeperSignatureProvider::new(wallet);
    tx.sign(&provider, &key).expect("first sign");
    tx.sign(&provider, &other_key).expect("second sign");

    assert_eq!(
        tx.transaction().signatures,
        [FIRST_SIGNATURE, SECOND_SIGNATURE]
    );
}

// TS line 293: "Should be able to sign the transaction twice on different
// transaction instances".
#[test]
fn signs_the_transaction_twice_on_different_instances() {
    let foundation = wax::create_wax_foundation(None);

    let bk = crate::common::new_in_memory_beekeeper();
    let created = bk.session.create_wallet("w0", "pw").expect("create_wallet");
    let mut wallet = created.wallet;
    let key = wallet.import_key(SIGN_WIF).expect("import_key");
    let other_key = wallet.import_key(OTHER_SIGN_WIF).expect("import_key");

    let mut tx = vote_tapos_tx(&foundation);

    let provider =
        wax_signers_beekeeper::BeekeeperSignatureProvider::new(wallet);
    tx.sign(&provider, &key).expect("first sign");

    let mut other_tx = foundation
        .create_transaction_from_json(&tx.to_api().expect("to_api"))
        .expect("create_transaction_from_json");
    other_tx.sign(&provider, &other_key).expect("second sign");

    assert_eq!(
        other_tx.transaction().signatures,
        [FIRST_SIGNATURE, SECOND_SIGNATURE]
    );
}

// data.protocol.ts: `signatureTransaction` (posting authority of
// `thatcryptodave`), trimmed to what the required-authorities check reads:
// the long profile `posting_json_metadata` is shortened and the signature
// dropped (the full literal lives in `hive_chain_custom_opts.rs`).
const POSTING_AUTHORITY_TX: &str = r#"{
    "expiration": "2024-02-21T06:55:40",
    "extensions": [],
    "operations": [
        {
            "type": "account_update2_operation",
            "value": {
                "account": "thatcryptodave",
                "extensions": [],
                "json_metadata": "",
                "posting_json_metadata": "{\"name\":\"David P.\"}"
            }
        }
    ],
    "signatures": [],
    "ref_block_num": 26295,
    "ref_block_prefix": 26859167
}"#;

// data.protocol.ts: `requiredActiveAuthorityTransaction`.
const ACTIVE_AUTHORITY_TX: &str = r#"{
    "ref_block_num": 59819,
    "ref_block_prefix": 1319397834,
    "extensions": [],
    "expiration": "2024-09-12T07:15:15",
    "operations": [
        {
            "type": "limit_order_cancel_operation",
            "value": {"owner": "droida", "orderid": 877434673}
        }
    ],
    "signatures": [
        "20470dc8de917827ea55328774123c93b4670cfe72133981072e2821e7fa20bfaf04f5dcec762ebc89a64232bc2c5d5d0de98a61ab670647cfb4c5ff5c438e865e"
    ]
}"#;

// data.protocol.ts: `requiredOwnerAuthorityTransaction` — the vsc.gateway
// owner-authority update. The full 21-key owner authority is kept verbatim;
// the 11 signatures of the TS fixture are dropped (inert for the
// required-authorities check).
const OWNER_AUTHORITY_TX: &str = r#"{
    "ref_block_num": 61120,
    "ref_block_prefix": 1820528888,
    "extensions": [],
    "expiration": "2024-09-12T08:40:18",
    "operations": [
        {
            "type": "account_update_operation",
            "value": {
                "owner": {
                    "key_auths": [
                        ["STM4xCRKtqz2GyCq4ctwyi2SFk29fyVyCMxpuNioGGi7JAJuTXWD2", 1],
                        ["STM57pVtywZGeywtcxtozLjxRUZFSt9kcFv2LDP8YsTQzW1e4b8NT", 1],
                        ["STM5QHDFfzSFzPRGknGiXAbFtdkadgFmDzMazCSFWch5k3QRYrNUu", 1],
                        ["STM5gQ79TFvy483xLvW2ZDyZRw979yxeNSrVY278J5ZkRKfFkXn2u", 1],
                        ["STM5jQxUpMn84tCFQCrhwvVxkhbgTBYGYYiPJys1QHd9bJvb92UdP", 1],
                        ["STM5tzqAFVovzopZszs46P22PLUQzTVTyPdkFaGkxgRcFV3sPWUMa", 1],
                        ["STM5victPsYtnLQvHi4V1c3ZshMMe1sxFHkj1YtM3sMwW49Dim5Rn", 1],
                        ["STM6bzzDhAH7by2H8CuD742p89ZDEkPg3W3nhxcLWzjqxFTyfEUga", 1],
                        ["STM6fSMwqr6F1c2aNf7ov8WnKnAn7Grrb8A7kQR4Qu5yDJF8Y5icL", 1],
                        ["STM6hGTjCRfDHLuzzYKVwr9cmjzgXdBJ8Efv7SK75gGiywqNwbp8u", 1],
                        ["STM6psb1cFxfd8YbWUfSbbMazp16Dq189sTcZ3oDuEAw96jY7fgvs", 1],
                        ["STM6qtzpc2d4M2vWZJFJptcS5c8RYmYPgLrRfjx2s6PZJDViaEsAR", 1],
                        ["STM6v5nGgfZ1jTPB7FbS92McNU2iA15oyi8FBGnemHuYU5yP9cmBF", 1],
                        ["STM6wtyPzJ9DbExRQMGh39FrMPT9USFQxcEiNycVJToZ1YgBSRhka", 1],
                        ["STM6xHrBQuK3HeQ6ydQwD1fLdL65H4W6XGA8tmzwntMuNuoxwKnD6", 1],
                        ["STM76nQCMeBybWbHLNdoyTwLRxefc3CWAQUTPfkS981FCH4jKCKyU", 1],
                        ["STM7Qt3bkotstLhuaNXGbDLcsGUxSauY8pqBFFKBqQXPmdCfFjWoN", 1],
                        ["STM7upEkw7FBfNexisNxnotd6v47oA4Vd26gu69ijEZnxFnK3nYuU", 1],
                        ["STM7zgquZgbBCw3SmgtyMvRcB67XGSDEAsPw3Unqay4NSYApuF6oQ", 1],
                        ["STM859GqiDqMZBAjW1hZQ6JuK2EoCbMN8g1VomACiHLHUSXgwMJ1J", 1],
                        ["STM8XB3ZtazYGLGpPVT6Vjwjeaiqgx8tfjmmUAfn31DDmzvVpaLqo", 1]
                    ],
                    "account_auths": [["vsc.network", 11]],
                    "weight_threshold": 11
                },
                "active": {"key_auths": [], "account_auths": [], "weight_threshold": 11},
                "account": "vsc.gateway",
                "posting": {"key_auths": [], "account_auths": [["vsc.network", 11]], "weight_threshold": 11},
                "memo_key": "STM8buQNWovTcX7H8yLdYNx82xDddQE9R5MzQDNg4mocScnXTGSkE",
                "json_metadata": "{\"message\":\"VSC Multsig Account\",\"epoch\":378}"
            }
        }
    ],
    "signatures": []
}"#;

// data.proto-protocol.ts: `recoverAccountTransaction`.
const RECOVER_ACCOUNT_TX: &str = r#"{
    "ref_block_num": 36,
    "ref_block_prefix": 2180018243,
    "expiration": "2024-04-24T08:30:15",
    "extensions": [],
    "signatures": [],
    "operations": [
        {
            "type": "recover_account_operation",
            "value": {
                "account_to_recover": "bob",
                "new_owner_authority": {
                    "weight_threshold": 1,
                    "account_auths": [],
                    "key_auths": [["STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW", 1]]
                },
                "recent_owner_authority": {
                    "weight_threshold": 1,
                    "account_auths": [],
                    "key_auths": [["STM4wJYLcRnALfbpb4ziqiH3oLEgw9PTJZTBBj8goFyjta3mm6D1s", 1]]
                },
                "extensions": []
            }
        }
    ]
}"#;

fn required_authorities_of(
    json: &str,
) -> wax::models::authority::RequiredAuthorities {
    wax::create_wax_foundation(None)
        .create_transaction_from_json(json)
        .expect("create_transaction_from_json")
        .required_authorities()
        .expect("required_authorities")
}

// TS line 320: "Should be able to get transaction required posting
// authority".
#[test]
fn required_posting_authority() {
    let auths = required_authorities_of(POSTING_AUTHORITY_TX);

    assert_eq!(auths.posting_accounts, ["thatcryptodave"]);
    assert!(auths.active_accounts.is_empty());
    assert!(auths.owner_accounts.is_empty());
    assert!(auths.other_authorities.is_empty());
}

// TS line 342: "Should be able to get transaction required active
// authority".
#[test]
fn required_active_authority() {
    let auths = required_authorities_of(ACTIVE_AUTHORITY_TX);

    assert_eq!(auths.active_accounts, ["droida"]);
    assert!(auths.posting_accounts.is_empty());
    assert!(auths.owner_accounts.is_empty());
    assert!(auths.other_authorities.is_empty());
}

// TS line 364: "Should be able to get transaction required owner authority".
#[test]
fn required_owner_authority() {
    let auths = required_authorities_of(OWNER_AUTHORITY_TX);

    assert_eq!(auths.owner_accounts, ["vsc.gateway"]);
    assert!(auths.posting_accounts.is_empty());
    assert!(auths.active_accounts.is_empty());
    assert!(auths.other_authorities.is_empty());
}

// TS line 388: "Should be able to get transaction required authorities for
// transaction with recover_account_operation".
#[test]
fn required_other_authorities_for_recover_account() {
    let auths = required_authorities_of(RECOVER_ACCOUNT_TX);

    assert_eq!(
        auths.other_authorities[0].key_auths,
        [(
            "STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW".to_string(),
            1
        )]
        .into_iter()
        .collect()
    );
    assert_eq!(
        auths.other_authorities[1].key_auths,
        [(
            "STM4wJYLcRnALfbpb4ziqiH3oLEgw9PTJZTBBj8goFyjta3mm6D1s".to_string(),
            1
        )]
        .into_iter()
        .collect()
    );
}

// TS lines 402-488: the coin/satoshi precision suite. Each call mirrors one
// TS test; the amounts are the exact TS fixtures.
//
// TS NOTE: TS passes JS `number`s (IEEE 754 doubles); the Rust `AssetAmount`
// takes the same values through its `f64` / integer conversions.
#[test]
fn coins_and_satoshis_precision_fixtures() {
    let foundation = wax::create_wax_foundation(None);

    // TS line 402: hive asset with JS double.
    assert_eq!(foundation.hive_coins(100.3).unwrap().amount, "100300");
    // TS line 410: more decimal places than the precision.
    assert_eq!(foundation.hive_coins(100.34567).unwrap().amount, "100345");
    // TS line 418: hbd asset with JS double.
    assert_eq!(foundation.hbd_coins(100.34567).unwrap().amount, "100345");
    // TS line 426: fewer decimal places than the precision.
    assert_eq!(foundation.hbd_coins(100.3).unwrap().amount, "100300");
    // TS line 434: vests asset from an integer.
    assert_eq!(foundation.vests_coins(100).unwrap().amount, "100000000");
    // TS line 442: hive asset with even more decimal places.
    assert_eq!(
        foundation.hive_coins(100.345678910).unwrap().amount,
        "100345"
    );
    // TS line 450: vests asset with fewer decimal places.
    assert_eq!(foundation.vests_coins(100.3).unwrap().amount, "100300000");
    // TS line 458: vests asset near the max safe JS integer (fractional).
    assert_eq!(
        foundation.vests_coins(9007199254740.543).unwrap().amount,
        "9007199254740543000"
    );
    // TS lines 466/474/482: satoshis beyond Number.MAX_SAFE_INTEGER.
    assert_eq!(
        foundation.hive_satoshis(9007199254740992).unwrap().amount,
        "9007199254740992"
    );
    assert_eq!(
        foundation.hbd_satoshis(9007199254740992).unwrap().amount,
        "9007199254740992"
    );
    assert_eq!(
        foundation.vests_satoshis(9007199254740992).unwrap().amount,
        "9007199254740992"
    );
}
