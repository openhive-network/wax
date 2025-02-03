import type { ApiAccount } from '../../../../dist/bundle';

export default {
  id: 1,
  jsonrpc: '2.0',
  result: {
    accounts: [
      {
        "active": {
          "account_auths": [],
          "key_auths": [
            [
              "STM5bAX9A3CR7CeYRP2Zv6doCQMwiYTfViXqj6wqafpUZwq1yFbxh",
              1
            ]
          ],
          "weight_threshold": 1
        },
        "balance": {
          "amount": "0",
          "nai": "@@000000021",
          "precision": 3
        },
        "can_vote": true,
        "comment_count": 0,
        "created": "2018-01-23T21:51:18",
        "curation_rewards": 299038,
        "delayed_votes": [],
        "delegated_vesting_shares": {
          "amount": "0",
          "nai": "@@000000037",
          "precision": 6
        },
        "downvote_manabar": {
          "current_mana": 905018594737,
          "last_update_time": 1738633293
        },
        "governance_vote_expiration_ts": "2025-05-11T23:56:51",
        "hbd_balance": {
          "amount": "254",
          "nai": "@@000000013",
          "precision": 3
        },
        "hbd_last_interest_payment": "2021-05-26T23:32:18",
        "hbd_seconds": "8084081790",
        "hbd_seconds_last_update": "2021-06-24T23:37:33",
        "id": 650167,
        "is_smt": false,
        "json_metadata": "{}",
        "last_account_recovery": "1970-01-01T00:00:00",
        "last_account_update": "2021-05-28T00:23:30",
        "last_owner_update": "1970-01-01T00:00:00",
        "last_post": "2025-01-16T04:22:15",
        "last_post_edit": "2025-01-16T04:22:15",
        "last_root_post": "2025-01-14T02:18:12",
        "last_vote_time": "2025-02-04T01:41:33",
        "lifetime_vote_count": 0,
        "memo_key": "STM6YomsriJAM85HDjxwtoeZCsfT4oLn8r3uVJxQ37VfJTEpxp7gs",
        "mined": false,
        "name": "andablackwidow",
        "next_vesting_withdrawal": "1969-12-31T23:59:59",
        "open_recurrent_transfers": 0,
        "owner": {
          "account_auths": [],
          "key_auths": [
            [
              "STM8J45CaDLtDK1JXMLLNrMpTNSGdELd7Fd3nQJfwXKFBsr1diCe8",
              1
            ]
          ],
          "weight_threshold": 1
        },
        "pending_claimed_accounts": 0,
        "pending_transfers": 0,
        "post_bandwidth": 0,
        "post_count": 270,
        "post_voting_power": {
          "amount": "3620074378949",
          "nai": "@@000000037",
          "precision": 6
        },
        "posting": {
          "account_auths": [
            [
              "ecency.app",
              1
            ]
          ],
          "key_auths": [
            [
              "STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK",
              1
            ]
          ],
          "weight_threshold": 1
        },
        "posting_json_metadata": "{\"profile\":{\"name\":\"ABW\",\"about\":\"Backend Developer\",\"profile_image\":\"https://images.hive.blog/DQmRu4qAGpQh9SQYFkdgMeBUQZ2fVWTViJWumnpVyqomC5x/abw512.jpg\",\"version\":2}}",
        "posting_rewards": 2539133,
        "previous_owner_update": "1970-01-01T00:00:00",
        "proxied_vsf_votes": [
          0,
          0,
          0,
          0
        ],
        "proxy": "gtg",
        "received_vesting_shares": {
          "amount": "0",
          "nai": "@@000000037",
          "precision": 6
        },
        "recovery_account": "blocktrades",
        "reset_account": "null",
        "reward_hbd_balance": {
          "amount": "0",
          "nai": "@@000000013",
          "precision": 3
        },
        "reward_hive_balance": {
          "amount": "0",
          "nai": "@@000000021",
          "precision": 3
        },
        "reward_vesting_balance": {
          "amount": "366410345",
          "nai": "@@000000037",
          "precision": 6
        },
        "reward_vesting_hive": {
          "amount": "217",
          "nai": "@@000000021",
          "precision": 3
        },
        "savings_balance": {
          "amount": "0",
          "nai": "@@000000021",
          "precision": 3
        },
        "savings_hbd_balance": {
          "amount": "0",
          "nai": "@@000000013",
          "precision": 3
        },
        "savings_hbd_last_interest_payment": "2025-01-07T23:21:45",
        "savings_hbd_seconds": "4390510685529",
        "savings_hbd_seconds_last_update": "2025-02-02T19:22:09",
        "savings_withdraw_requests": 1,
        "to_withdraw": 0,
        "vesting_shares": {
          "amount": "3620074378949",
          "nai": "@@000000037",
          "precision": 6
        },
        "vesting_withdraw_rate": {
          "amount": "0",
          "nai": "@@000000037",
          "precision": 6
        },
        "voting_manabar": {
          "current_mana": 3216520962048,
          "last_update_time": 1738633293
        },
        "withdraw_routes": 0,
        "withdrawn": 0,
        "witnesses_voted_for": 0
      } satisfies ApiAccount,
    ],
  },
};
