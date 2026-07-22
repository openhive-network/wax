//! Tests of the beekeeper signer crate's account-role key resolution
//! (`wax_signers_beekeeper::resolve_public_key`).
//!
//! TS NOTE: counterpart of the `BeekeeperProvider.for(chain, wallet,
//! account, role)` overload (`ts/packages/signers-beekeeper/src/index.ts`).
//! The TS package test only covers the explicit-key overload (ported in
//! `hive_base.rs` / `encryption_data.rs`), so these scripted-server tests
//! are Rust originals.

use serde_json::json;

use wax::{HiveChain, HiveChainOptions, create_hive_chain};

use wax_signers_beekeeper::{BeekeeperProviderError, Role, resolve_public_key};

use crate::common::{
    OTHER_PUBLIC_KEY, api_account_json_roles, authority_json,
    find_accounts_result, spawn_json_rpc_server,
};

const ACTIVE_KEY: &str =
    "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh";
const MEMO_KEY: &str = "STM6dNhJF7K7MnVvrf2uv7SPTFCdRDsDpq2vNVU1atu9Un5LcpKzs";

fn chain_for(endpoint: String) -> HiveChain {
    create_hive_chain(HiveChainOptions {
        api_endpoint: endpoint,
        ..Default::default()
    })
    .unwrap()
}

/// An `alice` fixture whose `active` authority is distinguishable from the
/// `owner` / `posting` ones (those carry `OTHER_PUBLIC_KEY`).
fn alice_account(active: serde_json::Value) -> serde_json::Value {
    api_account_json_roles(
        "alice",
        authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]),
        active,
        authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]),
        MEMO_KEY,
    )
}

#[tokio::test]
async fn resolves_the_requested_role_authority_key() {
    let (endpoint, captured) =
        spawn_json_rpc_server(vec![find_accounts_result(vec![alice_account(
            authority_json(1, &[], &[(ACTIVE_KEY, 1)]),
        )])]);
    let chain = chain_for(endpoint);

    let key = resolve_public_key(&chain, "alice", Role::Active)
        .await
        .unwrap();

    assert_eq!(key, ACTIVE_KEY);

    let call = captured.recv().unwrap();

    assert_eq!(call.method, "database_api.find_accounts");
    assert_eq!(
        call.params,
        json!({ "accounts": ["alice"], "delayed_votes_active": false })
    );
}

#[tokio::test]
async fn resolves_the_memo_key() {
    let (endpoint, _captured) =
        spawn_json_rpc_server(vec![find_accounts_result(vec![alice_account(
            authority_json(1, &[], &[(ACTIVE_KEY, 1)]),
        )])]);
    let chain = chain_for(endpoint);

    let key = resolve_public_key(&chain, "alice", Role::Memo)
        .await
        .unwrap();

    assert_eq!(key, MEMO_KEY);
}

#[tokio::test]
async fn errors_on_unknown_account() {
    let (endpoint, _captured) =
        spawn_json_rpc_server(vec![find_accounts_result(vec![])]);
    let chain = chain_for(endpoint);

    let error = resolve_public_key(&chain, "alice", Role::Active)
        .await
        .unwrap_err();

    assert!(matches!(
        &error,
        BeekeeperProviderError::AccountNotFound(account)
            if account == "alice"
    ));
    assert_eq!(error.to_string(), "Account alice not found");
}

#[tokio::test]
async fn errors_on_role_without_key_entries() {
    let (endpoint, _captured) =
        spawn_json_rpc_server(vec![find_accounts_result(vec![alice_account(
            authority_json(1, &[], &[]),
        )])]);
    let chain = chain_for(endpoint);

    let error = resolve_public_key(&chain, "alice", Role::Active)
        .await
        .unwrap_err();

    assert!(matches!(
        &error,
        BeekeeperProviderError::MissingRoleKey { account, role }
            if account == "alice" && *role == Role::Active
    ));
    assert_eq!(error.to_string(), "Account alice does not have active key");
}
