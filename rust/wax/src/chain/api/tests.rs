//! Fixture-based (de)serialization tests of the default API DTOs, plus a
//! wire test of [`DefaultHiveApi`] through a chain.
//!
//! The response fixtures mirror real `database_api` / `block_api` / `rc_api`
//! payloads (the field sets reflected in `database_api_objects.hpp`), so a
//! type or name mismatch in any DTO field fails here instead of at the first
//! live call.

use serde_json::json;

use crate::models::hive_date_time::HiveDateTime;
use crate::{HiveChainOptions, create_hive_chain};

use super::super::transport::test_support::spawn_capture_server;
use super::*;

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

#[test]
fn deserializes_dynamic_global_properties_fixture() {
    let dgp: GetDynamicGlobalPropertiesResponse =
        serde_json::from_str(DGP_FIXTURE).unwrap();

    assert_eq!(dgp.head_block_number, 96_549_390);
    assert_eq!(
        dgp.time,
        HiveDateTime::parse("2025-07-08T12:34:57").unwrap()
    );
    assert_eq!(dgp.total_pow.as_u64(), Some(514_415));
    assert_eq!(dgp.virtual_supply.precision, 3);
    assert_eq!(
        dgp.recent_slots_filled,
        "340282366920938463463374607431768211455"
    );
}

#[test]
fn deserializes_find_accounts_fixture() {
    let fixture = r#"{"accounts": [{
        "id": 27007,
        "name": "gtg",
        "owner": {"weight_threshold": 1, "account_auths": [], "key_auths": [["STM7vP4NNZTiGP2LWfU4nZKGPWzTAcQ1MPtXVchpZq5YRhFqTBhFf", 1]]},
        "active": {"weight_threshold": 1, "account_auths": [["good-karma", 1]], "key_auths": [["STM5ZDPkbLuMLKSKGiuo5BFinviBK9jkAeWXLYchGuPUeVKzGbwz1", 1]]},
        "posting": {"weight_threshold": 1, "account_auths": [], "key_auths": [["STM6dNhJF7K7MnVvrf2uv7SPTFCdRDsDpq2vNVU1atu9Un5LcpKzs", 1]]},
        "memo_key": "STM6dNhJF7K7MnVvrf2uv7SPTFCdRDsDpq2vNVU1atu9Un5LcpKzs",
        "json_metadata": "",
        "posting_json_metadata": "{\"profile\":{\"name\":\"Gandalf\"}}",
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
        "delayed_votes": [{"time": "2025-07-05T05:14:33", "val": 11290483827}],
        "governance_vote_expiration_ts": "2026-04-08T18:52:15"
    }]}"#;

    let response: FindAccountsResponse = serde_json::from_str(fixture).unwrap();
    let account = &response.accounts[0];

    assert_eq!(account.name, "gtg");
    assert_eq!(account.active.account_auths[0], ("good-karma".into(), 1));
    assert_eq!(
        account.voting_manabar.current_mana.as_i64(),
        Some(323_542_936_294_746)
    );
    assert_eq!(
        account.delayed_votes.as_deref().unwrap()[0].val.as_u64(),
        Some(11_290_483_827)
    );
}

#[test]
fn deserializes_witness_schedule_fixture() {
    let fixture = r#"{
        "id": 0,
        "current_virtual_time": "415293136565341564990613846315",
        "next_shuffle_block_num": 96549399,
        "current_shuffled_witnesses": ["gtg", "blocktrades", "arcange"],
        "num_scheduled_witnesses": 21,
        "elected_weight": 1,
        "timeshare_weight": 5,
        "miner_weight": 1,
        "witness_pay_normalization_factor": 25,
        "median_props": {
            "account_creation_fee": {"amount": "3000", "precision": 3, "nai": "@@000000021"},
            "maximum_block_size": 65536,
            "hbd_interest_rate": 2000,
            "account_subsidy_budget": 797,
            "account_subsidy_decay": 347321
        },
        "majority_version": "1.27.11",
        "max_voted_witnesses": 20,
        "max_miner_witnesses": 0,
        "max_runner_witnesses": 1,
        "hardfork_required_witnesses": 17,
        "account_subsidy_rd": {
            "resource_unit": 10000,
            "budget_per_time_unit": 797,
            "pool_eq": 157691079,
            "max_pool_size": 157691079,
            "decay_params": {"decay_per_time_unit": 347321, "decay_per_time_unit_denom_shift": 36},
            "min_decay": 0
        },
        "account_subsidy_witness_rd": {
            "resource_unit": 10000,
            "budget_per_time_unit": 996,
            "pool_eq": 9989845,
            "max_pool_size": 9989845,
            "decay_params": {"decay_per_time_unit": 7626934, "decay_per_time_unit_denom_shift": 36},
            "min_decay": 0
        },
        "min_witness_account_subsidy_decay": 0
    }"#;

    let schedule: GetWitnessScheduleResponse =
        serde_json::from_str(fixture).unwrap();

    assert_eq!(schedule.num_scheduled_witnesses, 21);
    assert_eq!(schedule.median_props.hbd_interest_rate, 2000);
    assert_eq!(
        schedule.account_subsidy_rd.decay_params.decay_per_time_unit,
        347_321
    );
}

#[test]
fn deserializes_get_block_fixture() {
    let fixture = r#"{"block": {
        "previous": "05c1578d947b2c8db32b1c0d3ad3f4b7ea4bf68e",
        "timestamp": "2025-07-08T12:34:57",
        "witness": "gtg",
        "transaction_merkle_root": "77c5ff89838e11a92d3b0ce6b8d1e9d0f2e0c823",
        "extensions": [],
        "witness_signature": "1f227719b21a238e75c14e88fe442d20a488c1f61e17197a2a3faee7e07db4a3b415d1e224ba641f558a824d1cbcdbe915308c1c88cf35eb32ffdb28f4582d1af0",
        "transactions": [{
            "ref_block_num": 22412,
            "ref_block_prefix": 2381934996,
            "expiration": "2025-07-08T12:44:54",
            "operations": [{
                "type": "vote_operation",
                "value": {"voter": "gtg", "author": "someone", "permlink": "post", "weight": 10000}
            }],
            "extensions": [],
            "signatures": ["2049b435a15f1b21870b6bae4a5c655b1a2f2e5335de91443b6ab77996f1e42e163e224a1e12b52e871ca9e28f9d0a5fd066f0d0d64242fa3e352b1e0f4e01aa25"]
        }],
        "block_id": "05c1578e0a90cf6de23e3fbd407ba00fedbb1c15",
        "signing_key": "STM5UyJHhrps78HH9dTMQpccHhs1BGnwYYPnobKKLNY6nikp1J1KE",
        "transaction_ids": ["fdcd407448b1b910b26e77dbf30a458f4c542a91"]
    }}"#;

    let response: GetBlockResponse = serde_json::from_str(fixture).unwrap();
    let block = response.block.unwrap();

    // `header` fields are flattened on the wire.
    assert_eq!(block.header.witness, "gtg");
    assert_eq!(block.transactions[0].ref_block_num, 22412);
    assert_eq!(block.transactions[0].operations[0].r#type, "vote_operation");

    let missing: GetBlockResponse = serde_json::from_str("{}").unwrap();

    assert_eq!(missing.block, None);
}

#[test]
fn deserializes_find_rc_accounts_fixture() {
    let fixture = r#"{"rc_accounts": [{
        "account": "gtg",
        "rc_manabar": {"current_mana": "587235630149708", "last_update_time": 1751966086},
        "max_rc_creation_adjustment": {"amount": "2020748973", "precision": 6, "nai": "@@000000037"},
        "max_rc": "587235630149708"
    }]}"#;

    let response: FindRcAccountsResponse =
        serde_json::from_str(fixture).unwrap();

    assert_eq!(
        response.rc_accounts[0].max_rc.as_u64(),
        Some(587_235_630_149_708)
    );
}

#[test]
fn serializes_verify_authority_request_in_hf26_pack() {
    let request = VerifyAuthorityRequest {
        trx: ApiTransaction {
            ref_block_num: 1960,
            ref_block_prefix: 3_915_120_327,
            expiration: HiveDateTime::parse("2025-07-08T12:35:27").unwrap(),
            operations: vec![ApiOperation {
                r#type: "vote_operation".into(),
                value: json!({ "voter": "gtg", "weight": 10000 }),
            }],
            extensions: vec![],
            signatures: vec!["20e2bcbe...".into()],
        },
        pack: TransactionPackType::Hf26,
    };

    let value = serde_json::to_value(&request).unwrap();

    assert_eq!(value["pack"], "hf26");
    assert_eq!(value["trx"]["expiration"], "2025-07-08T12:35:27");
    assert_eq!(value["trx"]["operations"][0]["type"], "vote_operation");
}

#[test]
fn omits_unset_optional_request_fields() {
    let request = FindAccountsRequest {
        accounts: vec!["gtg".into()],
        delayed_votes_active: None,
    };

    let value = serde_json::to_value(&request).unwrap();

    assert_eq!(value, json!({ "accounts": ["gtg"] }));
}

#[tokio::test]
async fn chain_api_calls_default_namespace_over_json_rpc() {
    let envelope = Box::leak(
        format!(r#"{{"jsonrpc":"2.0","id":1,"result":{DGP_FIXTURE}}}"#)
            .into_boxed_str(),
    );
    let (endpoint, captured) = spawn_capture_server(envelope);

    let chain = create_hive_chain(HiveChainOptions {
        api_endpoint: endpoint,
        ..Default::default()
    })
    .unwrap();

    let dgp = chain
        .api()
        .database_api
        .get_dynamic_global_properties(Default::default())
        .await
        .unwrap();

    assert_eq!(dgp.head_block_number, 96_549_390);

    let raw = captured.recv().unwrap();

    assert!(
        raw.contains(
            r#""method":"database_api.get_dynamic_global_properties""#
        )
    );
    assert!(raw.contains(r#""params":{}"#));
}
