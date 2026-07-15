//! Shared test fixture for the `detailed` integration-test suite. Rust port of
//! the TS `waxTest` helper in
//! `ts/wasm/__tests__/assets/jest-helper.ts`, plus the scripted JSON-RPC
//! server and chain-response fixtures shared by the online-surface tests
//! (`online_transaction.rs`, `hive_chain.rs`).

use std::cell::RefCell;
use std::io::{Read, Write};
use std::net::TcpListener;
use std::sync::mpsc;
use std::thread;

use serde_json::{Value, json};

use beekeeper::{
    api::BeekeeperApi, options::BeekeeperOptions, wallet::UnlockedWallet,
};
use wax::proto::{self, operation::Value as OperationValue};
use wax::{
    SignatureProvider, WaxError, WaxFoundation, WaxOptions,
    create_wax_foundation, result::CryptoMemo,
};

pub struct WaxTestCtx {
    pub base: Box<dyn WaxFoundation>,
}

pub fn wax_test<R>(
    options: impl Into<Option<WaxOptions>>,
    test: impl FnOnce(&WaxTestCtx) -> R,
) -> R {
    let ctx = WaxTestCtx {
        base: create_wax_foundation(options),
    };
    test(&ctx)
}

/// Bridges a Beekeeper [`UnlockedWallet`] to wax's [`SignatureProvider`] trait.
///
/// TS NOTE: TS tests build an `OnlineSigner` via `createSigner(base, wallet, key)`
/// which both signs and encrypts through the same wallet handle. This adapter
/// mirrors that role for the Rust side.
///
/// Beekeeper's `sign_digest` / `encrypt_data` / `decrypt_data` take `&mut self`,
/// so the wallet is wrapped in a `RefCell` to satisfy the `&self`-taking
/// `SignatureProvider` methods.
///
/// Like TS's `createSigner(base, wallet, key)`, encryption is a two-step
/// process: the beekeeper wallet produces the inner ciphertext, then the wax
/// foundation's `crypto_memo` codec wraps it (embedding the from/to keys and
/// the `#` prefix) into the final memo payload — and the reverse on decrypt.
/// crypto-memo packing is stateless, so a default foundation suffices.
pub struct BeekeeperSignatureProvider<'a> {
    wallet: RefCell<UnlockedWallet<'a>>,
    base: Box<dyn WaxFoundation>,
}

impl<'a> BeekeeperSignatureProvider<'a> {
    pub fn new(wallet: UnlockedWallet<'a>) -> Self {
        Self {
            wallet: RefCell::new(wallet),
            base: create_wax_foundation(None),
        }
    }
}

impl<'a> SignatureProvider for BeekeeperSignatureProvider<'a> {
    fn sign_digest(
        &self,
        public_key: &str,
        sig_digest: &str,
    ) -> Result<String, WaxError> {
        self.wallet
            .borrow_mut()
            .sign_digest(public_key, sig_digest)
            .map_err(|e| WaxError::new(e.to_string()))
    }

    fn encrypt_data(
        &self,
        content: &str,
        key: &str,
        other_key: Option<&str>,
        nonce: Option<u64>,
    ) -> Result<String, WaxError> {
        // NOTE: Beekeeper treats `nonce == 0` as "generate a fresh random nonce".
        // wax core always passes `Some(ref_block_prefix)`, so for our deterministic
        // tests this collapses to a real, reproducible nonce.
        let inner = self
            .wallet
            .borrow_mut()
            .encrypt_data(key, other_key, content, nonce.unwrap_or(0))
            .map_err(|e| WaxError::new(e.to_string()))?;

        self.base.crypto_memo_dump_string(&CryptoMemo {
            from: key.to_string(),
            to: other_key.unwrap_or(key).to_string(),
            content: inner,
        })
    }

    fn decrypt_data(
        &self,
        content: &str,
        _key: &str,
        _other_key: Option<&str>,
    ) -> Result<String, WaxError> {
        // The from/to keys are embedded in the crypto-memo, so the inbound
        // key arguments (wax core passes empty markers here) are unused — we
        // recover the real keys by decoding the memo, mirroring TS `base.decrypt`.
        let memo = self.base.crypto_memo_from_string(content)?;

        self.wallet
            .borrow_mut()
            .decrypt_data(&memo.from, Some(&memo.to), &memo.content)
            .map_err(|e| WaxError::new(e.to_string()))
    }
}

/// Owns an in-memory [`BeekeeperApi`] plus an open session token. Returned by
/// [`new_in_memory_beekeeper`] so the borrow chain — `api → session → wallet`
/// — has a single, locally-scoped owner per test.
pub struct BeekeeperFixture {
    pub api: BeekeeperApi,
    pub token: String,
}

/// Creates a fresh in-memory beekeeper and opens a session on it.
pub fn new_in_memory_beekeeper() -> BeekeeperFixture {
    let mut api =
        BeekeeperApi::new(BeekeeperOptions::new("ignored").in_memory(true));
    let token = api.create_session().expect("create_session");
    BeekeeperFixture { api, token }
}

// ---------------------------------------------------------------------------
// Scripted JSON-RPC server
// ---------------------------------------------------------------------------

/// A real public key that no signature in the detailed suite ever matches;
/// used wherever a fixture needs a syntactically valid but inert key.
pub const OTHER_PUBLIC_KEY: &str =
    "STM8MN3FNBa8WbEpxz3wGL3L1mkt6sGnncH8iuto7r8Wa3T9NSSGT";

pub struct CapturedCall {
    pub method: String,
    pub params: Value,
}

/// Serves one JSON-RPC response per entry of `results` (in order), capturing
/// each request's method and params. Every response closes its connection so
/// the client opens a fresh one per call.
pub fn spawn_json_rpc_server(
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
// Chain-response fixtures
// ---------------------------------------------------------------------------

// `database_api.get_dynamic_global_properties` result; the fixture from
// `src/chain/api/tests.rs`. head_block_id 05c1578e0a90cf6de23e3fbd407ba00f...
// yields ref_block_num 0x578e and ref_block_prefix 0x6dcf900a; `time` is
// unix timestamp 1751978097.
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

/// Unix timestamp of the [`dgpo_result`] head-block `time`
/// (`2025-07-08T12:34:57`).
pub const DGPO_TIME_SECONDS: u32 = 1_751_978_097;

pub fn dgpo_result() -> Value {
    serde_json::from_str(DGPO_RESULT).unwrap()
}

pub fn nai(amount: &str, precision: u32, nai: &str) -> Value {
    json!({ "amount": amount, "precision": precision, "nai": nai })
}

pub fn authority_json(
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
pub fn api_account_json(name: &str, active: Value, memo_key: &str) -> Value {
    let mut account: Value =
        serde_json::from_str(API_ACCOUNT_TEMPLATE).unwrap();
    account["name"] = json!(name);
    account["owner"] = authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]);
    account["active"] = active;
    account["posting"] = authority_json(1, &[], &[(OTHER_PUBLIC_KEY, 1)]);
    account["memo_key"] = json!(memo_key);

    account
}

pub fn find_accounts_result(accounts: Vec<Value>) -> Value {
    json!({ "accounts": accounts })
}

pub fn rc_account_json(name: &str) -> Value {
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

pub fn transfer_value(memo: &str) -> OperationValue {
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

pub fn account_update2_value(
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
