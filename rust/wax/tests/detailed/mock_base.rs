// Rust port of `ts/wasm/__tests__/detailed/mock_base.ts`.
//
// Tests appear in TS source order. Each Rust test has a `// TS line N` comment
// pointing back to the TS original.
//
// The TS suite talks to the proxy mock server driven by
// `assets/mock/jsonRpcMock.ts`; the Rust port spawns a routing JSON-RPC
// server per test (method + params dispatch, exactly the same canned
// fixtures from `assets/mock/data/*`) instead of one shared server per
// suite. `dgpo_result()` (head time 2025-07-08) predates every fixture's
// `last_update_time`, matching the TS mock's premise that no mana
// regeneration is in play.

use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_json::{Value, json};

use wax::api::{
    BroadcastTransactionRequest, FindAccountsRequest, FindAccountsResponse,
};
use wax::proto::{self, operation::Value as OperationValue};
use wax::{
    AuthorityEntryProcessingStatus, AuthorityPathEntry, AuthorityPathTraceData,
    HiveChain, LegacyVoteOperation, ProcessedEntry, WaxChainError,
    create_wax_foundation, hive_api,
};

use crate::common::{
    api_account_json_roles, authority_json, chain_at, dgpo_result, nai,
    spawn_routing_server,
};

/// Routes `get_dynamic_global_properties` to the shared DGPO fixture and
/// `find_accounts` to the per-name fixture map (unknown names are simply
/// absent from the response, like on a real node).
fn accounts_router(
    accounts: HashMap<String, Value>,
) -> impl Fn(&str, &Value) -> Value + Send + 'static {
    move |method, params| match method {
        "database_api.get_dynamic_global_properties" => {
            json!({ "result": dgpo_result() })
        }
        "database_api.find_accounts" => {
            let found: Vec<Value> = params["accounts"]
                .as_array()
                .unwrap_or(&Vec::new())
                .iter()
                .filter_map(|name| accounts.get(name.as_str()?).cloned())
                .collect();

            json!({ "result": { "accounts": found } })
        }
        other => panic!("unexpected JSON-RPC method: {other}"),
    }
}

fn chain_with_accounts(accounts: &[(&str, Value)]) -> HiveChain {
    let map: HashMap<String, Value> = accounts
        .iter()
        .map(|(name, account)| (name.to_string(), account.clone()))
        .collect();

    chain_at(spawn_routing_server(accounts_router(map)))
}

// ---------------------------------------------------------------------------
// Account fixtures (assets/mock/data/*.ts)
// ---------------------------------------------------------------------------

fn account(
    name: &str,
    owner: Value,
    active: Value,
    posting: Value,
    memo_key: &str,
) -> Value {
    api_account_json_roles(name, owner, active, posting, memo_key)
}

fn single_key(key: &str) -> Value {
    authority_json(1, &[], &[(key, 1)])
}

// data/andablackwidow.ts
fn andablackwidow_json() -> Value {
    account(
        "andablackwidow",
        single_key("STM8J45CaDLtDK1JXMLLNrMpTNSGdELd7Fd3nQJfwXKFBsr1diCe8"),
        single_key("STM5bAX9A3CR7CeYRP2Zv6doCQMwiYTfViXqj6wqafpUZwq1yFbxh"),
        authority_json(
            1,
            &[("ecency.app", 1)],
            &[("STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK", 1)],
        ),
        "STM6YomsriJAM85HDjxwtoeZCsfT4oLn8r3uVJxQ37VfJTEpxp7gs",
    )
}

// data/hivebuzz.ts — the posting authority declares the account itself as an
// account authority (threshold 2), producing the self-cycle scenario.
fn hivebuzz_json() -> Value {
    account(
        "hivebuzz",
        single_key("STM7zTd7NhztSuJVMzeQUux3GtyRkRJtj9ddpaj8ua42XgFxgh37t"),
        single_key("STM6dzRgPzL46R4XgBqBoGCZ6PXLFSGZsiCGa5oWhrYM2cNNAY1Df"),
        authority_json(
            2,
            &[("hivebuzz", 1)],
            &[("STM6YQPMBnQzpnWMtma4qFqaxZaCawkySyJkPHUnWS6mQECNd8Dq1", 1)],
        ),
        "STM5g7jcd53nAmKUZsqFEhoXEdGtxpMbSJTmN3PrRwtiaqfP4mfsJ",
    )
}

// data/sunnyvo.ts
fn sunnyvo_json() -> Value {
    account(
        "sunnyvo",
        single_key("STM54ayamDTUN85jEpNNmfJdBcn6KkXjTi2KAWqKq2EuNLNwAZvJo"),
        single_key("STM7VNj2fpLhpGYXYDfffUkiauxw8WzFAATGShxPwTmuZVX8niPHE"),
        authority_json(
            2,
            &[
                ("ecency.app", 1),
                ("hive.blog", 1),
                ("steemauto", 1),
                ("threespeak", 1),
            ],
            &[("STM8jRobEtRCFUXmNXuf46RsomxHQoPase9KXZf1QjPcXSUH7MQrD", 1)],
        ),
        "STM7XRNC1Xc99zNBL8n4e7wfpKwBYjPyFXgNXSHz4YkSpgRzq4Ttn",
    )
}

// data/sunnyvoAccounts.ts
fn ecency_app_json() -> Value {
    account(
        "ecency.app",
        single_key("STM6DFboChKgXFzkvEh18u2iXL7Q5N7ExNjqfPnuJ518uyRKWrsmJ"),
        single_key("STM78Cf8BNZ6HmmeskFwGPfcjKzYhQHZD1bAiYHbmGFGQRJjQHuny"),
        authority_json(
            1,
            &[("hivesigner", 1)],
            &[("STM7KDcjUNMqUdohFu9iYjCAqYEyXfM7pjNLx96GhRNpdYscB3aQc", 1)],
        ),
        "STM8fACNECP4r4BvfMBJ8n8ScZ4sgEMRraNBVosuibPR1vbs25pAa",
    )
}

fn hive_blog_json() -> Value {
    account(
        "hive.blog",
        single_key("STM6JDeCsvcnnYZUbLw5pc7JBsVS6EhxWfrxfYc8kQNH7qYtYkwXH"),
        single_key("STM84W3jKtMGLztXHPuQq7QiVG375C5cb15aXsnrsfuxYmybUWyVC"),
        authority_json(
            1,
            &[("hivesigner", 1)],
            &[("STM8M5rx2P4fqebGGbhhc5SUh8c6Dxkq68bMnW2y4FJxzhywskd3V", 1)],
        ),
        "STM4tmkj23MVQUufadfxrmhrsjt3nQL9zXKNnTkXbZKvHvvL7u5nu",
    )
}

fn steemauto_json() -> Value {
    account(
        "steemauto",
        single_key("STM86VpyNRUEtFmUuQVa1fEeRqqHmNFZFsGHUdJPjF6Z45rQie7yv"),
        single_key("STM5DrUcULGM8TcoqmtjH686JVArPhZH2tb99cLS2RxKG4Hy2xiVy"),
        single_key("STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF"),
        "STM83pJcjBB2eqeR4qA3avEcmFFpVNpJfTFJsauRufvEMRATDmAwy",
    )
}

fn threespeak_json() -> Value {
    account(
        "threespeak",
        authority_json(
            1,
            &[("starkerz", 1), ("theycallmedan", 1)],
            &[("STM6wDMAEgxp955fpcpenZPQGgLt3be5dNyYekr76on6kWCqDh16B", 1)],
        ),
        authority_json(
            1,
            &[("starkerz", 1), ("theycallmedan", 1)],
            &[
                ("STM5WLVxNWCvj7veaHQamSrtiHJGzHAptDov4Jhj8hTzp4NWu7ftS", 1),
                ("STM6rAm3t3kzYQR6CnhcazymEBByuB5vANjmd6DcksLCTVS8yfVsD", 1),
            ],
        ),
        single_key("STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF"),
        "STM6jcJe8XzGVH4RCQiK2YmT4jYenQ59wB3719Tx1vhq8vhdn9B5y",
    )
}

// data/directSigners_5.ts / directSigners_6.ts — `ecency` and `good-karma`
// carry different posting authorities in the two fixtures.
fn ecency_5_json() -> Value {
    account(
        "ecency",
        single_key("STM4yhxC7Bum8St36z3nZmj9VA59EXM7DXReMLMRn8fwrazgNbKYQ"),
        single_key("STM51ApnQm3HNieuy3ZUQNtXbdu8CzEFEWRPqMLY1422i8Gy7g2PJ"),
        authority_json(
            1,
            &[("tattooworld", 1)],
            &[("STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43", 1)],
        ),
        "STM5vCxUjSAZAgKBornswBuzXgAZasbE3EkPHpLmDEVHmPVGMnnah",
    )
}

fn ecency_6_json() -> Value {
    account(
        "ecency",
        single_key("STM4yhxC7Bum8St36z3nZmj9VA59EXM7DXReMLMRn8fwrazgNbKYQ"),
        single_key("STM51ApnQm3HNieuy3ZUQNtXbdu8CzEFEWRPqMLY1422i8Gy7g2PJ"),
        single_key("STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK"),
        "STM5vCxUjSAZAgKBornswBuzXgAZasbE3EkPHpLmDEVHmPVGMnnah",
    )
}

fn ecency_stats_json() -> Value {
    account(
        "ecency.stats",
        single_key("STM8h5aXWY4xxVZfUCT3Bp3un6G4aAu2aRseJ4U2QXEb6HmLzo98n"),
        single_key("STM6yT137LvnvqENnQj1mZx62SGxA5gpXUpMo2yAmCBXNfjnH3RjZ"),
        authority_json(
            1,
            &[("demo", 1), ("ecency.app", 1)],
            &[("STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd", 1)],
        ),
        "STM73YE8rEQoDh6Y6EvrX2tXmmzhEnoTTwrL5jh3Wet3iMxKBJJty",
    )
}

fn ecency_waves_json() -> Value {
    account(
        "ecency.waves",
        single_key("STM6JYdPvRXJ2nzLqW2CWSi7Jw89yFuRm24NZ21hPeC55omdH8UxJ"),
        single_key("STM7NLtY73dVT7W3Ymsc8kMBd165hRK9XKpUePqMoRAMrJCb8551L"),
        authority_json(
            1,
            &[("ecency.app", 1)],
            &[("STM8UxNA8pQpL7wtvzZUrfFFz1qGxgGH6a1VnJqDTGbivsU3Mi4Mz", 1)],
        ),
        "STM6jdqDjTGdbdeJQHUTe7j2Z94q48GJrx2VVifvHb9AgpuvD2978",
    )
}

fn esteem_app_json() -> Value {
    account(
        "esteem.app",
        single_key("STM6zXVBarPvth5XjcVmcyAiGEndvyiQAokVJHSsPGKWaoSqwHk5K"),
        single_key("STM5XKXqoieAtbq8isuXty8SrysvsXfehJGZeLBQ6STEAsP4gHUBV"),
        authority_json(
            1,
            &[("ecency.app", 1)],
            &[("STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK", 1)],
        ),
        "STM7rYhpTmVrhBmLcEaoxWvVk5M3FrN4xtapk1utikFD8hhrNmzAf",
    )
}

fn esteemapp_json() -> Value {
    account(
        "esteemapp",
        single_key("STM6drpX8y9nRyMykbonvXXkFbtESvWKG35NrNhoQ97uRhRQxbUhg"),
        single_key("STM8eKCcDrQhmqmHjA2ifrtVUs5U7KXqXScnh4dwGzk6rhyRt2DtB"),
        authority_json(
            1,
            &[
                ("ecency.app", 1),
                ("hivesigner", 1),
                ("peakd.app", 1),
                ("steemconnect", 1),
            ],
            &[("STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP", 1)],
        ),
        "STM6W6WwFy5P8putgwPppiyG1ySM65wvSQSPKErkDCNG9sTSevhjf",
    )
}

fn good_karma_json(posting_key: &str) -> Value {
    account(
        "good-karma",
        single_key("STM7Wv1ZehXeLJbUbauam6h3khcnMXD9BLmuMBoD1v8jxh8Qm6Wgt"),
        single_key("STM6FgbXf53uLD7m2skkzWR6Y4VU5zYwDqC476W2vva1aVognPnT2"),
        authority_json(
            1,
            &[("ecency.app", 1), ("peakd.app", 1)],
            &[(posting_key, 1)],
        ),
        "STM8mZcbokoRM8LvRk1CGibFyfuTXp77w72ktgJrZNsjKYmoF3gTx",
    )
}

// data/alice.ts
fn alice_json() -> Value {
    account(
        "alice",
        single_key("STM6adcTdVnt4iWbfEfiKZmwt6pNsoQnVKheZchL7vnnpCWYwRWDh"),
        single_key("STM7cUebxApQ9N4xFHtVrKKuLbUHCei5QoEhHX7WYx9tXHVCZGXVP"),
        authority_json(
            2,
            &[("guest4test8", 1)],
            &[
                ("STM6a34GANY5LD8deYvvfySSWGd7sPahgVNYoFPapngMUD27pWb45", 1),
                ("STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh", 1),
            ],
        ),
        "STM8m7a4dNtBDAUXZQdjpjYQosEQA4ep1caTRSrwUwH7jhH5TCpJU",
    )
}

// data/guest4test8.ts
fn guest4test8_json() -> Value {
    account(
        "guest4test8",
        single_key("STM6adcTdVnt4iWbfEfiKZmwt6pNsoQnVKheZchL7vnnpCWYwRWDh"),
        single_key("STM7cUebxApQ9N4xFHtVrKKuLbUHCei5QoEhHX7WYx9tXHVCZGXVP"),
        single_key("STM6ooSpKC7jEhujcCakiH881MSgJhddrVb1dNCc1h47wF2nqB9zb"),
        "STM8m7a4dNtBDAUXZQdjpjYQosEQA4ep1caTRSrwUwH7jhH5TCpJU",
    )
}

// data/steem.ts
fn steem_json() -> Value {
    account(
        "steem",
        single_key("STM82eDD3wQbA5e11D8ovC4MWkPwW1fG3ipSD2ksLJAJwFnV38E9j"),
        single_key("STM5YSQo7meRsCJwze3TxHp2gpUd2QGNcaGRs9x4FB4FvZMA6CBU2"),
        single_key("STM82eDD3wQbA5e11D8ovC4MWkPwW1fG3ipSD2ksLJAJwFnV38E9j"),
        "STM82eDD3wQbA5e11D8ovC4MWkPwW1fG3ipSD2ksLJAJwFnV38E9j",
    )
}

// data/data4nonexistingaccount.ts — an account whose name ("0steem") cannot
// exist on a real chain; the point is that the mock pipes it through as-is.
fn nonexisting_account_json() -> Value {
    account(
        "0steem",
        single_key("STM82eDD3wQbA5e11D8ovC4MWkPwW1fG3ipSD2ksLJAJwFnV38E9j"),
        single_key("STMNonexistingKey"),
        single_key("STM82eDD3wQbA5e11D8ovC4MWkPwW1fG3ipSD2ksLJAJwFnV38E9j"),
        "STM82eDD3wQbA5e11D8ovC4MWkPwW1fG3ipSD2ksLJAJwFnV38E9j",
    )
}

// data/vote.manabar-*.ts — the manabar trio: 100%, ~50% and ~1% of
// `post_voting_power`, with `last_update_time` past the DGPO head time so no
// regeneration applies.
fn alpha_manabar_json(
    name: &str,
    voting_mana: Value,
    downvote_mana: Value,
) -> Value {
    let mut account = account(
        name,
        authority_json(
            1,
            &[],
            &[
                ("STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4", 1),
                ("STM7Wz3qohJpAbmmqBv9UUKBG14h9ueYkJspWot5yiX1JSiohwZZX", 1),
            ],
        ),
        authority_json(
            1,
            &[],
            &[
                ("STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4", 1),
                ("STM7Wz3qohJpAbmmqBv9UUKBG14h9ueYkJspWot5yiX1JSiohwZZX", 1),
            ],
        ),
        authority_json(
            1,
            &[("ecency.app", 1), ("steemauto", 1)],
            &[
                ("STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4", 1),
                ("STM7Wz3qohJpAbmmqBv9UUKBG14h9ueYkJspWot5yiX1JSiohwZZX", 1),
            ],
        ),
        "STM7Wz3qohJpAbmmqBv9UUKBG14h9ueYkJspWot5yiX1JSiohwZZX",
    );

    account["voting_manabar"] =
        json!({ "current_mana": voting_mana, "last_update_time": 1762407201 });
    account["downvote_manabar"] = json!({
        "current_mana": downvote_mana,
        "last_update_time": 1762407201
    });
    account["post_voting_power"] = nai("17484585433049125", 6, "@@000000037");

    account
}

// ---------------------------------------------------------------------------
// Trace projection — emits the exact JSON shape the TS `collectedData`
// serializes to, so the expected literals below stay verbatim TS.
// ---------------------------------------------------------------------------

fn collected_data_json(data: &[AuthorityPathTraceData]) -> Value {
    Value::Array(
        data.iter()
            .map(|entry| {
                json!({
                    "finalAuthorityPath": entry_json(&entry.final_authority_path),
                    "matchingSignatures": entry
                        .matching_signatures
                        .iter()
                        .map(|signature| {
                            json!({
                                "signature": signature.signature,
                                "signatureKey": signature.signature_key,
                            })
                        })
                        .collect::<Vec<_>>(),
                })
            })
            .collect(),
    )
}

fn entry_json(entry: &AuthorityPathEntry) -> Value {
    let processed_entry = match &entry.processed_entry {
        ProcessedEntry::Account(name) => name,
        ProcessedEntry::PublicKey(key) => key,
    };

    json!({
        "processedEntry": processed_entry,
        "processedRole": entry.processed_role,
        "threshold": entry.threshold,
        "weight": entry.weight,
        "recursionDepth": entry.recursion_depth,
        "processingStatus": status_json(&entry.processing_status),
        "visitedEntries": entry
            .visited_entries
            .iter()
            .map(entry_json)
            .collect::<Vec<_>>(),
    })
}

fn status_json(status: &AuthorityEntryProcessingStatus) -> Value {
    match status {
        AuthorityEntryProcessingStatus::Accepted { is_open_authority } => {
            json!({
                "entryAccepted": true,
                "isOpenAuthority": is_open_authority,
            })
        }
        AuthorityEntryProcessingStatus::Rejected {
            account_authority_processing_depth_exceeded,
            account_authority_count_exceeded,
            account_authority_points_missing_account,
            has_account_authority_cycle,
            has_insufficient_weight,
            has_matching_public_key,
            unrelated_account_matched_to_public_key,
        } => {
            let mut status = json!({
                "entryAccepted": false,
                "accountAuthorityProcessingDepthExceeded":
                    account_authority_processing_depth_exceeded,
                "accountAuthorityCountExceeded":
                    account_authority_count_exceeded,
                "accountAuthorityPointsMissingAccount":
                    account_authority_points_missing_account,
                "hasAccountAuthorityCycle": has_account_authority_cycle,
                "hasInsufficientWeight": has_insufficient_weight,
                "hasMatchingPublicKey": has_matching_public_key,
            });
            if let Some(account) = unrelated_account_matched_to_public_key {
                status["unrelatedAccountMatchedToPublicKey"] = json!(account);
            }

            status
        }
    }
}

/// Runs the shared trace flow of the TS tests: parse the source transaction
/// from its API JSON, open an online transaction (fetches DGPO) and generate
/// the authority verification trace of the source.
async fn trace_for(chain: &HiveChain, source_tx_json: &str) -> Value {
    let source = create_wax_foundation(None)
        .create_transaction_from_json(source_tx_json)
        .expect("create_transaction_from_json");

    let tx = chain
        .create_transaction(None)
        .await
        .expect("create_transaction");
    let trace = tx
        .generate_authority_verification_trace(false, Some(&source))
        .await
        .expect("generate_authority_verification_trace");

    collected_data_json(&trace.collected_data)
}

// ---------------------------------------------------------------------------
// condenser_api extension (TS `chain.extend<{condenser_api: ...}>()`)
// ---------------------------------------------------------------------------

#[derive(Serialize)]
pub struct ActiveVotesParams(pub Vec<String>);

#[derive(Debug, Deserialize)]
pub struct ActiveVotesResult(#[allow(dead_code)] pub Value);

/// TS NOTE: the TS tests extend the chain with a typed `condenser_api`
/// namespace inline; `#[hive_api]` is the Rust extension seam.
#[hive_api]
pub trait CondenserApi {
    async fn get_active_votes(params: ActiveVotesParams) -> ActiveVotesResult;
}

fn active_votes_error_router() -> impl Fn(&str, &Value) -> Value + Send + 'static
{
    |method, params| match method {
        "database_api.get_dynamic_global_properties" => {
            json!({ "result": dgpo_result() })
        }
        "condenser_api.get_active_votes" => {
            let first = params[0].as_str().unwrap_or_default();
            match first {
                // `{error: undefined}` in the TS mock — neither `result` nor
                // `error` makes it onto the wire.
                "nodata" => json!({}),
                "malformed" => json!({
                    "error": { "code": -32602, "data": 12333333, "message": 123 }
                }),
                "appspecific" => json!({
                    "error": {
                        "code": -32602,
                        "data": "Post appspecific/com.chrome.devtools.json does not exist",
                        "message": "Invalid parameters"
                    }
                }),
                other => panic!("unexpected get_active_votes param: {other}"),
            }
        }
        other => panic!("unexpected JSON-RPC method: {other}"),
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

// TS line 19: "Should be able to create proper legacy vote operation".
#[tokio::test]
async fn creates_proper_legacy_vote_operations() {
    let chain = chain_with_accounts(&[
        (
            "alpha.manabar100",
            alpha_manabar_json(
                "alpha.manabar100",
                json!("17484585433049125"),
                json!(4371146358262281u64),
            ),
        ),
        (
            "alpha.manabar50",
            alpha_manabar_json(
                "alpha.manabar50",
                json!(8742292716524562u64),
                json!(2185573179131140u64),
            ),
        ),
        (
            "alpha.manabar1",
            alpha_manabar_json(
                "alpha.manabar1",
                json!(174845854330491u64),
                json!(43711463582622u64),
            ),
        ),
    ]);

    let mut tx = chain.create_transaction(None).await.unwrap();

    let accounts = ["alpha.manabar100", "alpha.manabar50", "alpha.manabar1"];
    let weights = [100.0, 50.0, 0.0, -50.0, -100.0];

    for account in accounts {
        for weight in weights {
            let operation = LegacyVoteOperation::create_for(
                &chain,
                account,
                "gtg",
                "hello-world",
                weight,
            )
            .await
            .expect("LegacyVoteOperation::create_for");

            tx.push_complex_operation(&chain, operation)
                .expect("push_complex_operation");
        }
    }

    let operations = &tx.transaction().operations;
    assert_eq!(
        operations[0],
        proto::Operation {
            value: Some(OperationValue::VoteOperation(proto::Vote {
                voter: "alpha.manabar100".into(),
                author: "gtg".into(),
                permlink: "hello-world".into(),
                weight: 10000,
            })),
        }
    );

    let weights: Vec<i32> = operations
        .iter()
        .map(|op| match op.value.as_ref().unwrap() {
            OperationValue::VoteOperation(vote) => vote.weight as i32,
            other => panic!("expected VoteOperation, got {other:?}"),
        })
        .collect();

    assert_eq!(
        weights,
        [
            // weight percent:
            //  100,   50, 0,   -50,   -100
            10000, 5000, 0, -5000, -10000, // alpha.manabar100
            4999, 2499, 0, -2499, -4999, // alpha.manabar50
            99, 49, 0, -49, -99, // alpha.manabar1
        ]
    );
}

// TS line 53: "Should be able to find account based on mock interface".
#[tokio::test]
async fn finds_account_based_on_mock_interface() {
    let fixture = steem_json();
    let chain = chain_with_accounts(&[("steem", fixture.clone())]);

    let found = chain
        .api()
        .database_api
        .find_accounts(FindAccountsRequest {
            accounts: vec!["steem".into()],
            delayed_votes_active: Some(true),
        })
        .await
        .expect("find_accounts");

    let expected: FindAccountsResponse =
        serde_json::from_value(json!({ "accounts": [fixture] }))
            .expect("deserialize fixture");
    assert_eq!(found, expected);
}

// TS line 63: "Should be able to correctly handle no data in hived node
// error".
//
// TS NOTE: TS raises `WaxError('Invalid response from chain API')`; the Rust
// transport reports the same condition as a `JsonRpc` error with code 0.
#[tokio::test]
async fn handles_no_data_in_hived_node_error() {
    let chain = chain_at(spawn_routing_server(active_votes_error_router()));
    let api = chain.extend::<CondenserApi>();

    let error = api
        .get_active_votes(ActiveVotesParams(vec!["nodata".into()]))
        .await
        .expect_err("expected error");

    assert!(
        matches!(
            error,
            WaxChainError::JsonRpc { code: 0, ref message }
                if message == "JSON-RPC response missing both `result` and `error`"
        ),
        "unexpected error: {error:?}",
    );
}

// TS line 89: "Should be able to correctly handle malformed hived node
// error".
//
// TS NOTE: TS routes the malformed payload through the WASM exception
// machinery ("Non-typed Error during Wasm call: ... Got non-object-like
// error. Original deserialization data: 12333333"); in Rust the typed
// envelope fails to deserialize (`message` is a number), surfacing as a
// `Deserialization` error naming the offending value.
#[tokio::test]
async fn handles_malformed_hived_node_error() {
    let chain = chain_at(spawn_routing_server(active_votes_error_router()));
    let api = chain.extend::<CondenserApi>();

    let error = api
        .get_active_votes(ActiveVotesParams(vec!["malformed".into()]))
        .await
        .expect_err("expected error");

    assert!(
        matches!(error, WaxChainError::Deserialization(_)),
        "unexpected error: {error:?}",
    );
    assert!(
        error
            .to_string()
            .contains("invalid type: integer `123`, expected a string"),
        "unexpected message: {error}",
    );
}

// TS line 115: "Should be able to correctly handle Hivemind string-like
// error".
//
// TS NOTE: TS surfaces the string `data` payload through the WASM error
// path; the Rust transport keeps the JSON-RPC `code` and `message` (the
// `data` payload is not modeled).
#[tokio::test]
async fn handles_hivemind_string_like_error() {
    let chain = chain_at(spawn_routing_server(active_votes_error_router()));
    let api = chain.extend::<CondenserApi>();

    let error = api
        .get_active_votes(ActiveVotesParams(vec![
            "appspecific".into(),
            "com.chrome.devtools.json".into(),
        ]))
        .await
        .expect_err("expected error");

    assert!(
        matches!(
            error,
            WaxChainError::JsonRpc { code: -32602, ref message }
                if message == "Invalid parameters"
        ),
        "unexpected error: {error:?}",
    );
}

// TS line 141: "Should be able to correctly handle standard Hived errors".
//
// TS NOTE: TS parses the assert payload into `WaxAssertionError` (category,
// raw stack, format/data breakdown); Rust has no typed assertion error on
// the chain surface yet, so the port asserts the JSON-RPC code and the
// composed assertion message instead.
#[tokio::test]
async fn handles_standard_hived_errors() {
    let route = |method: &str, params: &Value| match method {
        "database_api.get_dynamic_global_properties" => {
            json!({ "result": dgpo_result() })
        }
        "database_api.find_accounts" => {
            assert_eq!(params["accounts"], json!(["toolargeinputitis"]));
            // data/largeinput.ts
            json!({
                "error": {
                    "code": -32003,
                    "data": {
                        "assert_hash": "15599059534279751802",
                        "code": 10,
                        "extension": { "assertion_expression": "in_len <= sizeof(data)" },
                        "message": "Assert Exception",
                        "name": "assert_exception",
                        "stack": [{
                            "context": {
                                "file": "fixed_string.hpp",
                                "hostname": "",
                                "level": "error",
                                "line": 151,
                                "method": "assign",
                                "thread_name": "th_78",
                                "timestamp": "2025-11-25T13:04:28"
                            },
                            "data": { "fs": 16, "in": "toolargeinputitis", "is": 17 },
                            "format": "Input too large: `${in}` (${is}) for fixed size string: (${fs})"
                        }]
                    },
                    "message": "Assert Exception:in_len <= sizeof(data): Input too large: `toolargeinputitis` (17) for fixed size string: (16)"
                }
            })
        }
        other => panic!("unexpected JSON-RPC method: {other}"),
    };
    let chain = chain_at(spawn_routing_server(route));

    let error = chain
        .api()
        .database_api
        .find_accounts(FindAccountsRequest {
            accounts: vec!["toolargeinputitis".into()],
            delayed_votes_active: None,
        })
        .await
        .expect_err("expected error");

    assert!(
        matches!(
            error,
            WaxChainError::JsonRpc { code: -32003, ref message }
                if message == "Assert Exception:in_len <= sizeof(data): \
                    Input too large: `toolargeinputitis` (17) for fixed size \
                    string: (16)"
        ),
        "unexpected error: {error:?}",
    );
}

// TS line 172: "Testing assertion during transaction broadcast".
//
// TS NOTE: same divergence as above — TS asserts `WaxAssertionError`
// internals (source "unknown", assertion expression, assert hash); Rust
// asserts the raw JSON-RPC assertion envelope.
#[tokio::test]
async fn assertion_during_transaction_broadcast() {
    let route = |method: &str, params: &Value| match method {
        "database_api.get_dynamic_global_properties" => {
            json!({ "result": dgpo_result() })
        }
        "network_broadcast_api.broadcast_transaction" => {
            assert_eq!(params["max_block_age"], json!(0));
            // data/zero_max_block_age.ts
            json!({
                "error": {
                    "code": -32000,
                    "message": "Assert Exception:!check_max_block_age( args.max_block_age )",
                    "data": {
                        "code": 10,
                        "name": "assert_exception",
                        "message": "Assert Exception",
                        "stack": [{
                            "context": {
                                "level": "error",
                                "file": "network_broadcast_api.cpp",
                                "line": 30,
                                "method": "broadcast_transaction",
                                "hostname": "",
                                "thread_name": "th_100",
                                "timestamp": "2025-08-19T12:58:56"
                            },
                            "format": "",
                            "data": {}
                        }],
                        "extension": {
                            "assertion_expression": "!check_max_block_age( args.max_block_age )"
                        },
                        "assert_hash": "4716502953486857149"
                    }
                }
            })
        }
        other => panic!("unexpected JSON-RPC method: {other}"),
    };
    let chain = chain_at(spawn_routing_server(route));

    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(chain.create_operation(
        OperationValue::ClaimAccountOperation(proto::ClaimAccount {
            creator: "user123".into(),
            fee: proto::Asset {
                nai: "@@000000013".into(),
                amount: "1".into(),
                precision: 3,
            },
            extensions: Vec::new(),
        }),
    ));

    let trx = serde_json::from_value(tx.to_api_json().expect("to_api_json"))
        .expect("api transaction");
    let error = chain
        .api()
        .network_broadcast_api
        .broadcast_transaction(BroadcastTransactionRequest {
            max_block_age: 0,
            trx,
        })
        .await
        .expect_err("expected error");

    assert!(
        matches!(
            error,
            WaxChainError::JsonRpc { code: -32000, ref message }
                if message
                    == "Assert Exception:!check_max_block_age( args.max_block_age )"
        ),
        "unexpected error: {error:?}",
    );
}

// TS line 216: "Should be able to find NONEXISTING account based on mock
// interface".
#[tokio::test]
async fn finds_nonexisting_account_based_on_mock_interface() {
    let fixture = nonexisting_account_json();
    let chain = chain_with_accounts(&[("0steem", fixture.clone())]);

    // Intentionally use a name invalid on Hive ("0steem").
    let found = chain
        .api()
        .database_api
        .find_accounts(FindAccountsRequest {
            accounts: vec!["0steem".into()],
            delayed_votes_active: Some(true),
        })
        .await
        .expect("find_accounts");

    let expected: FindAccountsResponse =
        serde_json::from_value(json!({ "accounts": [fixture] }))
            .expect("deserialize fixture");
    assert_eq!(found, expected);
}

// TS line 228: "Should be able to get authority trace with mock data".
#[tokio::test]
async fn authority_trace_with_mock_data() {
    let chain = chain_with_accounts(&[
        ("andablackwidow", andablackwidow_json()),
        ("ecency.app", ecency_app_json()),
    ]);

    let trace = trace_for(
        &chain,
        r#"{
            "ref_block_num": 47527,
            "ref_block_prefix": 1507238693,
            "extensions": [],
            "expiration": "2024-11-12T10:34:48",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {
                        "voter": "andablackwidow",
                        "author": "hbd.funder",
                        "weight": 10000,
                        "permlink": "re-upvote-this-post-to-fund-hbdstabilizer-20241112t045515z"
                    }
                }
            ],
            "signatures": [
                "1f411808fe07ba78c8e0d1edc7e4bdf14b8af1b85a26437fd7e082054fc0fa5b503627072e4cc482d1a4e60ea5f318a85539282c5beb9747e83a429bcd369d1ece"
            ]
        }"#,
    )
    .await;

    assert_eq!(
        trace,
        json!([
            {
                "finalAuthorityPath": {
                    "processedEntry": "andablackwidow",
                    "processedRole": "posting",
                    "threshold": 1,
                    "weight": 1,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                    },
                    "visitedEntries": [
                        {
                            "processedEntry": "STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 0,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": []
                        }
                    ]
                },
                "matchingSignatures": [{
                    "signature": "1f411808fe07ba78c8e0d1edc7e4bdf14b8af1b85a26437fd7e082054fc0fa5b503627072e4cc482d1a4e60ea5f318a85539282c5beb9747e83a429bcd369d1ece",
                    "signatureKey": "STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK"
                }]
            }
        ])
    );
}

// TS line 295: "Should be able to get authority trace with mock data for
// account which declares itself as account authority".
//
// TS NOTE: the TS test is marked `test.fail()` — the implementation reports
// `hasAccountAuthorityCycle: false` although the account declares itself as
// its own account authority, and the Rust port reproduces that defect.
// `#[should_panic]` is the Rust analogue of `test.fail()`: the expectation
// below documents the CORRECT trace, and once cycle detection is fixed this
// test starts failing, prompting removal of the marker.
#[tokio::test]
#[should_panic = "assertion `left == right` failed"]
async fn authority_trace_for_self_declared_account_authority() {
    let chain = chain_with_accounts(&[("hivebuzz", hivebuzz_json())]);

    let trace = trace_for(
        &chain,
        r#"{
            "ref_block_num": 41973,
            "ref_block_prefix": 2696396446,
            "extensions": [],
            "expiration": "2025-02-11T10:33:18",
            "operations": [
                {
                    "type": "comment_operation",
                    "value": {
                        "body": "Edite su comentario. La **primera línea** debe contener **solo el nombre del usuario**, ¡nada más!<div><a href=\"https://engage.hivechain.app\">![](https://i.imgur.com/XsrNmcl.png)</a></div>",
                        "title": "",
                        "author": "hivebuzz",
                        "permlink": "re-1739269398362",
                        "json_metadata": "{\"app\":\"engage\"}",
                        "parent_author": "numa26",
                        "parent_permlink": "re-hivebuzz-srhhfn"
                    }
                }
            ],
            "signatures": [
                "1f6a2c32c04a3def7d91832c6b476abaeb686472036ef9fb80a920baab9c63dac31a0c3ac67f4c66e42eecfd1cceb0e926ab6e224b97fa3fa0150435ca0db804f3"
            ]
        }"#,
    )
    .await;

    assert_eq!(
        trace,
        json!([
            {
                "finalAuthorityPath": {
                    "processedEntry": "hivebuzz",
                    "processedRole": "owner",
                    "threshold": 1,
                    "weight": 0,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": false,
                        "accountAuthorityProcessingDepthExceeded": false,
                        "accountAuthorityCountExceeded": false,
                        "accountAuthorityPointsMissingAccount": false,
                        "hasAccountAuthorityCycle": true,
                        "hasInsufficientWeight": true,
                        "hasMatchingPublicKey": false
                    },
                    "visitedEntries": []
                },
                "matchingSignatures": []
            }
        ])
    );
}

// TS line 354: "Should be able to get authority trace with mock data with
// delegated authority where 2 accounts are required to satisfy threshold".
#[tokio::test]
async fn authority_trace_for_delegated_authority_with_threshold_2() {
    let chain = chain_with_accounts(&[
        ("sunnyvo", sunnyvo_json()),
        ("ecency.app", ecency_app_json()),
        ("hive.blog", hive_blog_json()),
        ("steemauto", steemauto_json()),
        ("threespeak", threespeak_json()),
    ]);

    let trace = trace_for(
        &chain,
        r#"{
            "ref_block_num": 59824,
            "ref_block_prefix": 3761625792,
            "extensions": [],
            "expiration": "2024-12-12T12:30:00",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {
                        "voter": "sunnyvo",
                        "author": "franciscomarval",
                        "weight": 475,
                        "permlink": "alegoria-sirenida-mermaid-allegory"
                    }
                }
            ],
            "signatures": [
                "20282d87e22cad745d263ee43fe8552044ecb68ebd274a03421d6e59aaaa891d5a594808c58605828c240b9e498f53d32a8f4f7baec5bfcbc7d391af4e4283366e"
            ]
        }"#,
    )
    .await;

    assert_eq!(
        trace,
        json!([
            {
                "finalAuthorityPath": {
                    "processedEntry": "sunnyvo",
                    "processedRole": "posting",
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false,
                    },
                    "recursionDepth": 0,
                    "threshold": 2,
                    "weight": 2,
                    "visitedEntries": [
                        {
                            "processedEntry": "steemauto",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 1,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": [
                                {
                                    "processedEntry": "STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF",
                                    "processedRole": "posting",
                                    "threshold": 1,
                                    "weight": 1,
                                    "recursionDepth": 1,
                                    "processingStatus": {
                                        "entryAccepted": true,
                                        "isOpenAuthority": false
                                    },
                                    "visitedEntries": []
                                }
                            ]
                        },
                        {
                            "processedEntry": "threespeak",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 1,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": [
                                {
                                    "processedEntry": "STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF",
                                    "processedRole": "posting",
                                    "threshold": 1,
                                    "weight": 1,
                                    "recursionDepth": 1,
                                    "processingStatus": {
                                        "entryAccepted": true,
                                        "isOpenAuthority": false
                                    },
                                    "visitedEntries": []
                                }
                            ]
                        }
                    ]
                },
                "matchingSignatures": [{
                    "signature": "20282d87e22cad745d263ee43fe8552044ecb68ebd274a03421d6e59aaaa891d5a594808c58605828c240b9e498f53d32a8f4f7baec5bfcbc7d391af4e4283366e",
                    "signatureKey": "STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF"
                }]
            }
        ])
    );
}

// TS line 460: "Should be able to get authority trace with mock data for 6
// signatures where one of the public keys (in the middle of public keys
// array) does not match any account".
#[tokio::test]
async fn authority_trace_for_6_signatures_with_unmatched_middle_key() {
    let chain = chain_with_accounts(&[
        ("ecency", ecency_6_json()),
        ("ecency.stats", ecency_stats_json()),
        ("ecency.waves", ecency_waves_json()),
        ("esteem.app", esteem_app_json()),
        ("esteemapp", esteemapp_json()),
        (
            "good-karma",
            good_karma_json(
                "STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
            ),
        ),
    ]);

    let trace = trace_for(
        &chain,
        r#"{
            "ref_block_num": 59525,
            "ref_block_prefix": 1587984329,
            "extensions": [],
            "expiration": "2025-02-07T11:50:42",
            "operations": [
                {"type": "vote_operation", "value": {"voter": "ecency", "author": "alzee", "weight": 100, "permlink": "13562877099-8088131425"}},
                {"type": "vote_operation", "value": {"voter": "ecency.stats", "author": "alzee", "weight": 100, "permlink": "13562877099-8088131425"}},
                {"type": "vote_operation", "value": {"voter": "ecency.waves", "author": "alzee", "weight": 100, "permlink": "13562877099-8088131425"}},
                {"type": "vote_operation", "value": {"voter": "esteem.app", "author": "alzee", "weight": 100, "permlink": "13562877099-8088131425"}},
                {"type": "vote_operation", "value": {"voter": "good-karma", "author": "alzee", "weight": 100, "permlink": "13562877099-8088131425"}},
                {"type": "vote_operation", "value": {"voter": "esteemapp", "author": "alzee", "weight": 100, "permlink": "13562877099-8088131425"}}
            ],
            "signatures": [
                "1f4149e010568da05380ae5beb143bb94db658567c20b73228ea84b269da7bc82208b9493535515ad4aef8c347bd8c9681b7827af9720130c20999774518cb620b",
                "1f475ba65d89c97fc82c7858ae863154d6770b0dea7aafc94e111a9c8a3bcb7cba17d29a86e93c5eae3a5f8b51f963a8532c33313bf7e3d5a43a31d8ddfaef8251",
                "1f73e14ee975d584f121c7ad3de059d4f361cdbb417a0020b911efe77632bd86044c33d276ea72fb45d1138d061c90226f6127dc163e1ac92baf3340eb1848b09f",
                "2027682ab7577d97da39f6e6ec3bfc26221e45e93336b17027523080c83843d2cc5be76380e6fda21f28ada5194adb345f6a172600cdab9377e475935a3af7e7b4",
                "2043c1aadca24f71aab3efb48aa809d06f644ef17fe7016febea9d75fb2207710a14ed0a7ae72180acab16676bdce6d05638e6bd9b719a4b41eaf201095776aab9",
                "205e09b4e5af6338f2a2d90a5d7a0a7c64203668f53beb0dd24b401cec25a347190988aaa102af008674803d6665647258f99076b3a1dc2da7c2629b1f61332d60"
            ]
        }"#,
    )
    .await;

    assert_eq!(
        trace,
        json!([
            {
                "finalAuthorityPath": {
                    "processedEntry": "ecency",
                    "processedRole": "owner",
                    "threshold": 1,
                    "weight": 0,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": false,
                        "accountAuthorityProcessingDepthExceeded": false,
                        "accountAuthorityCountExceeded": false,
                        "accountAuthorityPointsMissingAccount": false,
                        "hasAccountAuthorityCycle": false,
                        "hasInsufficientWeight": true,
                        "hasMatchingPublicKey": false
                    },
                    "visitedEntries": []
                },
                "matchingSignatures": []
            },
            {
                "finalAuthorityPath": {
                    "processedEntry": "ecency.stats",
                    "processedRole": "posting",
                    "threshold": 1,
                    "weight": 1,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                    },
                    "visitedEntries": [
                        {
                            "processedEntry": "STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 0,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": []
                        }
                    ]
                },
                "matchingSignatures": [{
                    "signature": "205e09b4e5af6338f2a2d90a5d7a0a7c64203668f53beb0dd24b401cec25a347190988aaa102af008674803d6665647258f99076b3a1dc2da7c2629b1f61332d60",
                    "signatureKey": "STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd"
                }]
            },
            {
                "finalAuthorityPath": {
                    "processedEntry": "ecency.waves",
                    "processedRole": "posting",
                    "threshold": 1,
                    "weight": 1,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                    },
                    "visitedEntries": [
                        {
                            "processedEntry": "STM8UxNA8pQpL7wtvzZUrfFFz1qGxgGH6a1VnJqDTGbivsU3Mi4Mz",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 0,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": []
                        }
                    ]
                },
                "matchingSignatures": [{
                    "signature": "2043c1aadca24f71aab3efb48aa809d06f644ef17fe7016febea9d75fb2207710a14ed0a7ae72180acab16676bdce6d05638e6bd9b719a4b41eaf201095776aab9",
                    "signatureKey": "STM8UxNA8pQpL7wtvzZUrfFFz1qGxgGH6a1VnJqDTGbivsU3Mi4Mz"
                }]
            },
            {
                "finalAuthorityPath": {
                    "processedEntry": "esteem.app",
                    "processedRole": "posting",
                    "threshold": 1,
                    "weight": 1,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                    },
                    "visitedEntries": [
                        {
                            "processedEntry": "STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 0,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": []
                        }
                    ]
                },
                "matchingSignatures": [{
                    "signature": "1f4149e010568da05380ae5beb143bb94db658567c20b73228ea84b269da7bc82208b9493535515ad4aef8c347bd8c9681b7827af9720130c20999774518cb620b",
                    "signatureKey": "STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK"
                }]
            },
            {
                "finalAuthorityPath": {
                    "processedEntry": "esteemapp",
                    "processedRole": "posting",
                    "threshold": 1,
                    "weight": 1,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                    },
                    "visitedEntries": [
                        {
                            "processedEntry": "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 0,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": []
                        }
                    ]
                },
                "matchingSignatures": [{
                    "signature": "1f475ba65d89c97fc82c7858ae863154d6770b0dea7aafc94e111a9c8a3bcb7cba17d29a86e93c5eae3a5f8b51f963a8532c33313bf7e3d5a43a31d8ddfaef8251",
                    "signatureKey": "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP"
                }]
            },
            {
                "finalAuthorityPath": {
                    "processedEntry": "good-karma",
                    "processedRole": "posting",
                    "threshold": 1,
                    "weight": 1,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                    },
                    "visitedEntries": [
                        {
                            "processedEntry": "STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 0,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": []
                        }
                    ]
                },
                "matchingSignatures": [{
                    "signature": "1f73e14ee975d584f121c7ad3de059d4f361cdbb417a0020b911efe77632bd86044c33d276ea72fb45d1138d061c90226f6127dc163e1ac92baf3340eb1848b09f",
                    "signatureKey": "STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR"
                }]
            }
        ])
    );
}

// TS line 723: "Should be able to get authority trace with mock data for
// transaction with one required authority with threshold 2".
#[tokio::test]
async fn authority_trace_for_one_required_authority_with_threshold_2() {
    let chain = chain_with_accounts(&[
        ("alice", alice_json()),
        ("guest4test8", guest4test8_json()),
    ]);

    let trace = trace_for(
        &chain,
        r#"{
            "ref_block_num": 15353,
            "ref_block_prefix": 1141939857,
            "expiration": "2025-02-10T12:11:41",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {"voter": "alice", "author": "bob", "permlink": "example-post", "weight": 10000}
                },
                {
                    "type": "vote_operation",
                    "value": {"voter": "alice", "author": "bob", "permlink": "example-post", "weight": 10000}
                }
            ],
            "extensions": [],
            "signatures": [
                "1f32e76fbebe2a92a2b83953e62460ef150bac1ab0989bc5338bbc3a3978c077573403787d509b669f548ccdc06ec6c1995dadd51b5221172635df0f1a443a4d8f",
                "209b7e96212bf1d776187d9321e083eddfed55f9b4b2bf58034302255eb7b8402e436519b4d391bc54462920a9fb1e36b5f60c951e51895f0e19ac3b22f1a97af1"
            ]
        }"#,
    )
    .await;

    assert_eq!(
        trace,
        json!([
            {
                "finalAuthorityPath": {
                    "processedEntry": "alice",
                    "processedRole": "posting",
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                    },
                    "recursionDepth": 0,
                    "threshold": 2,
                    "visitedEntries": [
                        {
                            "processedEntry": "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh",
                            "processedRole": "posting",
                            "processingStatus": {
                                "accountAuthorityCountExceeded": false,
                                "accountAuthorityPointsMissingAccount": false,
                                "accountAuthorityProcessingDepthExceeded": false,
                                "entryAccepted": false,
                                "hasAccountAuthorityCycle": false,
                                "hasInsufficientWeight": true,
                                "hasMatchingPublicKey": true,
                            },
                            "recursionDepth": 0,
                            "threshold": 2,
                            "visitedEntries": [],
                            "weight": 1,
                        },
                        {
                            "processedEntry": "STM6a34GANY5LD8deYvvfySSWGd7sPahgVNYoFPapngMUD27pWb45",
                            "processedRole": "posting",
                            "processingStatus": {
                                "accountAuthorityCountExceeded": false,
                                "accountAuthorityPointsMissingAccount": false,
                                "accountAuthorityProcessingDepthExceeded": false,
                                "entryAccepted": false,
                                "hasAccountAuthorityCycle": false,
                                "hasInsufficientWeight": true,
                                "hasMatchingPublicKey": true
                            },
                            "recursionDepth": 0,
                            "threshold": 2,
                            "visitedEntries": [],
                            "weight": 1
                        }
                    ],
                    "weight": 2
                },
                "matchingSignatures": [
                    {
                        "signature": "1f32e76fbebe2a92a2b83953e62460ef150bac1ab0989bc5338bbc3a3978c077573403787d509b669f548ccdc06ec6c1995dadd51b5221172635df0f1a443a4d8f",
                        "signatureKey": "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh"
                    },
                    {
                        "signature": "209b7e96212bf1d776187d9321e083eddfed55f9b4b2bf58034302255eb7b8402e436519b4d391bc54462920a9fb1e36b5f60c951e51895f0e19ac3b22f1a97af1",
                        "signatureKey": "STM6a34GANY5LD8deYvvfySSWGd7sPahgVNYoFPapngMUD27pWb45"
                    }
                ]
            }
        ])
    );
}

// TS line 826: "Should be able to get authority trace with mock data for 5
// signatures where one of the public keys does not match any account".
#[tokio::test]
async fn authority_trace_for_5_signatures_with_unmatched_key() {
    let chain = chain_with_accounts(&[
        ("ecency", ecency_5_json()),
        ("ecency.stats", ecency_stats_json()),
        ("esteem.app", esteem_app_json()),
        ("esteemapp", esteemapp_json()),
        (
            "good-karma",
            good_karma_json(
                "STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK",
            ),
        ),
    ]);

    let trace = trace_for(
        &chain,
        r#"{
            "ref_block_num": 808,
            "ref_block_prefix": 1359279161,
            "extensions": [],
            "expiration": "2024-08-02T12:09:03",
            "operations": [
                {"type": "vote_operation", "value": {"voter": "ecency", "author": "el-panal", "weight": 100, "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"}},
                {"type": "vote_operation", "value": {"voter": "ecency.stats", "author": "el-panal", "weight": 100, "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"}},
                {"type": "vote_operation", "value": {"voter": "esteem.app", "author": "el-panal", "weight": 100, "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"}},
                {"type": "vote_operation", "value": {"voter": "good-karma", "author": "el-panal", "weight": 100, "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"}},
                {"type": "vote_operation", "value": {"voter": "esteemapp", "author": "el-panal", "weight": 100, "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"}}
            ],
            "signatures": [
                "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
                "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
                "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
                "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
                "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5"
            ]
        }"#,
    )
    .await;

    assert_eq!(
        trace,
        json!([
            {
                "finalAuthorityPath": {
                    "processedEntry": "ecency",
                    "processedRole": "posting",
                    "threshold": 1,
                    "weight": 1,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                    },
                    "visitedEntries": [
                        {
                            "processedEntry": "STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 0,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": []
                        }
                    ]
                },
                "matchingSignatures": [{
                    "signature": "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5",
                    "signatureKey": "STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43"
                }]
            },
            {
                "finalAuthorityPath": {
                    "processedEntry": "ecency.stats",
                    "processedRole": "posting",
                    "threshold": 1,
                    "weight": 1,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                    },
                    "visitedEntries": [
                        {
                            "processedEntry": "STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 0,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": []
                        }
                    ]
                },
                "matchingSignatures": [{
                    "signature": "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
                    "signatureKey": "STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd"
                }]
            },
            {
                "finalAuthorityPath": {
                    "processedEntry": "esteem.app",
                    "processedRole": "posting",
                    "threshold": 1,
                    "weight": 1,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                    },
                    "visitedEntries": [
                        {
                            "processedEntry": "STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 0,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": []
                        }
                    ]
                },
                "matchingSignatures": [{
                    "signature": "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
                    "signatureKey": "STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK"
                }]
            },
            {
                "finalAuthorityPath": {
                    "processedEntry": "esteemapp",
                    "processedRole": "posting",
                    "threshold": 1,
                    "weight": 1,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                    },
                    "visitedEntries": [
                        {
                            "processedEntry": "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 0,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": []
                        }
                    ]
                },
                "matchingSignatures": [{
                    "signature": "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
                    "signatureKey": "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP"
                }]
            },
            {
                "finalAuthorityPath": {
                    "processedEntry": "good-karma",
                    "processedRole": "owner",
                    "threshold": 1,
                    "weight": 0,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": false,
                        "accountAuthorityProcessingDepthExceeded": false,
                        "accountAuthorityCountExceeded": false,
                        "accountAuthorityPointsMissingAccount": false,
                        "hasAccountAuthorityCycle": false,
                        "hasInsufficientWeight": true,
                        "hasMatchingPublicKey": false
                    },
                    "visitedEntries": []
                },
                "matchingSignatures": []
            }
        ])
    );
}

// TS line 1047: "Should be able to get authority trace with mock data for
// transaction with one required authority with threshold 2 (one signature
// direct and the other one redirected)".
#[tokio::test]
async fn authority_trace_for_threshold_2_direct_and_redirected() {
    let chain = chain_with_accounts(&[
        ("alice", alice_json()),
        ("guest4test8", guest4test8_json()),
    ]);

    let trace = trace_for(
        &chain,
        r#"{
            "ref_block_num": 55285,
            "ref_block_prefix": 3183350724,
            "expiration": "2025-03-04T09:40:37",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {"voter": "alice", "author": "test", "permlink": "test", "weight": 10000}
                }
            ],
            "extensions": [],
            "signatures": [
                "20a5932916064c776785df77821b0aaaa442af49faab4304083764de0a25de4ab660aec343efdb443ffa479446dfd1f433f3b968ad8f821c9497e4671f762e0d3a",
                "2068fd39a6a9751877b707e56adf1b8a814b02a7168e0be906e295daf4e35fbe072bf5dba4bfe5567239ed88aab84449bec09237b504ee5a0afaa1fb1e51770947"
            ]
        }"#,
    )
    .await;

    assert_eq!(
        trace,
        json!([
            {
                "finalAuthorityPath": {
                    "processedEntry": "alice",
                    "processedRole": "posting",
                    "threshold": 2,
                    "weight": 2,
                    "recursionDepth": 0,
                    "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                    },
                    "visitedEntries": [
                        {
                            "processedEntry": "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh",
                            "processedRole": "posting",
                            "threshold": 2,
                            "weight": 1,
                            "recursionDepth": 0,
                            "processingStatus": {
                                "entryAccepted": false,
                                "accountAuthorityProcessingDepthExceeded": false,
                                "accountAuthorityCountExceeded": false,
                                "accountAuthorityPointsMissingAccount": false,
                                "hasAccountAuthorityCycle": false,
                                "hasInsufficientWeight": true,
                                "hasMatchingPublicKey": true
                            },
                            "visitedEntries": []
                        },
                        {
                            "processedEntry": "guest4test8",
                            "processedRole": "posting",
                            "threshold": 1,
                            "weight": 1,
                            "recursionDepth": 1,
                            "processingStatus": {
                                "entryAccepted": true,
                                "isOpenAuthority": false
                            },
                            "visitedEntries": [
                                {
                                    "processedEntry": "STM6ooSpKC7jEhujcCakiH881MSgJhddrVb1dNCc1h47wF2nqB9zb",
                                    "processedRole": "posting",
                                    "threshold": 1,
                                    "weight": 1,
                                    "recursionDepth": 1,
                                    "processingStatus": {
                                        "entryAccepted": true,
                                        "isOpenAuthority": false
                                    },
                                    "visitedEntries": []
                                }
                            ]
                        }
                    ]
                },
                "matchingSignatures": [
                    {
                        "signature": "2068fd39a6a9751877b707e56adf1b8a814b02a7168e0be906e295daf4e35fbe072bf5dba4bfe5567239ed88aab84449bec09237b504ee5a0afaa1fb1e51770947",
                        "signatureKey": "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh"
                    },
                    {
                        "signature": "20a5932916064c776785df77821b0aaaa442af49faab4304083764de0a25de4ab660aec343efdb443ffa479446dfd1f433f3b968ad8f821c9497e4671f762e0d3a",
                        "signatureKey": "STM6ooSpKC7jEhujcCakiH881MSgJhddrVb1dNCc1h47wF2nqB9zb"
                    }
                ]
            }
        ])
    );
}
