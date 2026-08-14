// Canned database_api.find_accounts response for "initminer", captured from
// api.hive.blog, so the formatter test is hermetic (the live account's
// vesting_withdraw_rate previously drifted on-chain and broke the snapshot).
// Values match the initminerAccountApi snapshot in ../../data.protocol.ts.
export default {
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "accounts": [
      {
        "id": 3,
        "name": "initminer",
        "owner": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            [
              "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX",
              1
            ]
          ]
        },
        "active": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            [
              "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX",
              1
            ]
          ]
        },
        "posting": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            [
              "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX",
              1
            ]
          ]
        },
        "memo_key": "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX",
        "json_metadata": "",
        "posting_json_metadata": "",
        "proxy": "",
        "previous_owner_update": "1970-01-01T00:00:00",
        "last_owner_update": "1970-01-01T00:00:00",
        "last_account_update": "1970-01-01T00:00:00",
        "created": "2016-03-24T16:00:00",
        "mined": true,
        "recovery_account": "",
        "last_account_recovery": "1970-01-01T00:00:00",
        "reset_account": "null",
        "comment_count": 0,
        "lifetime_vote_count": 0,
        "post_count": 0,
        "can_vote": true,
        "voting_manabar": {
          "current_mana": 0,
          "last_update_time": 0
        },
        "downvote_manabar": {
          "current_mana": 0,
          "last_update_time": 0
        },
        "balance": {
          "amount": "6",
          "precision": 3,
          "nai": "@@000000021"
        },
        "savings_balance": {
          "amount": "0",
          "precision": 3,
          "nai": "@@000000021"
        },
        "hbd_balance": {
          "amount": "2",
          "precision": 3,
          "nai": "@@000000013"
        },
        "hbd_seconds": "0",
        "hbd_seconds_last_update": "2016-08-11T09:57:42",
        "hbd_last_interest_payment": "1970-01-01T00:00:00",
        "savings_hbd_balance": {
          "amount": "0",
          "precision": 3,
          "nai": "@@000000013"
        },
        "savings_hbd_seconds": "0",
        "savings_hbd_seconds_last_update": "1970-01-01T00:00:00",
        "savings_hbd_last_interest_payment": "1970-01-01T00:00:00",
        "savings_withdraw_requests": 0,
        "reward_hbd_balance": {
          "amount": "0",
          "precision": 3,
          "nai": "@@000000013"
        },
        "reward_hive_balance": {
          "amount": "0",
          "precision": 3,
          "nai": "@@000000021"
        },
        "reward_vesting_balance": {
          "amount": "0",
          "precision": 6,
          "nai": "@@000000037"
        },
        "reward_vesting_hive": {
          "amount": "0",
          "precision": 3,
          "nai": "@@000000021"
        },
        "vesting_shares": {
          "amount": "1000000000000",
          "precision": 6,
          "nai": "@@000000037"
        },
        "delegated_vesting_shares": {
          "amount": "0",
          "precision": 6,
          "nai": "@@000000037"
        },
        "received_vesting_shares": {
          "amount": "0",
          "precision": 6,
          "nai": "@@000000037"
        },
        "vesting_withdraw_rate": {
          "amount": "0",
          "precision": 6,
          "nai": "@@000000037"
        },
        "post_voting_power": {
          "amount": "1000000000000",
          "precision": 6,
          "nai": "@@000000037"
        },
        "next_vesting_withdrawal": "1969-12-31T23:59:59",
        "withdrawn": 0,
        "to_withdraw": 0,
        "withdraw_routes": 0,
        "pending_transfers": 0,
        "curation_rewards": 0,
        "posting_rewards": 0,
        "proxied_vsf_votes": [
          0,
          0,
          0,
          0
        ],
        "witnesses_voted_for": 0,
        "last_post": "1970-01-01T00:00:00",
        "last_root_post": "1970-01-01T00:00:00",
        "last_post_edit": "1970-01-01T00:00:00",
        "last_vote_time": "1970-01-01T00:00:00",
        "post_bandwidth": 0,
        "pending_claimed_accounts": 0,
        "open_recurrent_transfers": 0,
        "is_smt": false,
        "delayed_votes": [],
        "governance_vote_expiration_ts": "1969-12-31T23:59:59"
      }
    ]
  }
};
