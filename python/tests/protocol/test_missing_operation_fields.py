import json

from wax import validate_transaction, calculate_transaction_id

import json

from wax import validate_transaction

def test_another_bad_serialization():
    trx = json.dumps(
      {
         "ref_block_num":10,
         "ref_block_prefix":1549820395,
         "expiration":"2025-08-06T08:27:33",
         "extensions":[
         ],
         "signatures":[
            "203e4bbd2d08fcfe484f36492406fe97d07018cf17226e2fa065948986be336499575e1c1206b21d80a33dbfbb93f790ca5204e36b83ec3f5498c8d049f879fbc0"
         ],
         "operations":[
            {
               "type":"account_update_operation",
               "value":{
                  "account":"bob",
                  "owner":{
                     "weight_threshold":1,
                     "account_auths":[
                     ],
                     "key_auths":[
                        [
                           "STM613c9viKXrSGASsJj3yKogatPHCzDhZzASJgM33FjM3ThDLyG6",
                           1
                        ],
                        [
                           "STM613c9viKXrSGASsJj3yKogatPHCzDhZzASJgM33FjM3ThDLyG6",
                           3
                        ]
                     ]
                  },
                  "memo_key":"STM7HGgvzxAsNFxMB1h5pMVqBpixPp2iA4nkZD9YnuDvvdfzAwCVn",
                  "json_metadata":"{}"
               }
            }
         ]
      }
    )
    result = calculate_transaction_id(trx)
    assert result.status == result.status.ok
    assert result.result == b'f022d1cab57d8e53e5cc15c833496c800f391e0a'

def test_missing_allow_votes_and_allow_curation_rewards_members_in_comment_options_operation():
    """
    Transaction from hive-python test:
      test_is_get_impacted_accounts_operation_collect_accounts_from_the_comment_payout_beneficiaries
    """

    trx = json.dumps(
        {
            "ref_block_num": 6,
            "ref_block_prefix": 4097099125,
            "expiration": "2025-08-04T13:33:57",
            "extensions": [],
            "signatures": [],
            "operations": [
                {
                    "type": "comment_options_operation",
                    "value": {
                        "author": "initminer",
                        "permlink": "test-post",
                        "max_accepted_payout": {"amount": "100000000", "nai": "@@000000013", "precision": 3},
                        "percent_hbd": 10000,
                        "extensions": [
                            {
                                "type": "comment_payout_beneficiaries",
                                "value": {"beneficiaries": [{"account": "alice", "weight": 100}]},
                            }
                        ],
                        # "allow_votes": "true",  # todo: missing fields
                        # "allow_curation_rewards": "true",  # todo: missing fields
                    },
                }
            ],
        }
    )

    result = validate_transaction(trx)
    assert result.status == result.status.ok


def test_missing_decline_field_in_decline_voting_rights_operation():
    """
    Transaction from hive-python test:
      test_remove_decline_voting_rights_request
    """
    trx = json.dumps(
        {
            "ref_block_num": 20,
            "ref_block_prefix": 2595823944,
            "expiration": "2025-08-05T07:32:39",
            "extensions": [],
            "signatures": [],
            "operations": [
                {
                    "type": "decline_voting_rights_operation",
                    "value": {
                        "account": "voter",
                        # "decline": "true"  # todo: missing field
                    },
                }
            ],
        }
    )

    result = validate_transaction(trx)
    assert result.status == result.status.ok


def test_missing_fill_or_kill_in_limit_order_create_operation():
    """
    Transaction from hive-python test:
      test_remove_decline_voting_rights_request
    """
    trx = json.dumps(
        {
            "ref_block_num": 8,
            "ref_block_prefix": 2889768484,
            "expiration": "2025-08-05T07:37:51",
            "extensions": [],
            "signatures": [],
            "operations": [
                {
                    "type": "limit_order_create_operation",
                    "value": {
                        "owner": "alice",
                        "orderid": 0,
                        "amount_to_sell": {"amount": "300000", "nai": "@@000000021", "precision": 3},
                        "min_to_receive": {"amount": "30000", "nai": "@@000000013", "precision": 3},
                        "expiration": "2025-08-05T08:37:21",
                        # "fill_or_kill": "false",  # todo: missing field
                    },
                }
            ],
        }
    )
    result = validate_transaction(trx)
    assert result.status == result.status.ok


def test_missing_approve_field_in_account_witness_vote_operation():
    """
    Transaction from hive-python test:
      test_list_witness_votes
    """
    trx = json.dumps(
        {
            "ref_block_num": 7,
            "ref_block_prefix": 1475512945,
            "expiration": "2025-08-05T07:49:09",
            "extensions": [],
            "signatures": [],
            "operations": [
                {
                    "type": "account_witness_vote_operation",
                    "value": {
                        "account": "bob",
                        "witness": "alice",
                        # "approve": "true",  # todo: missing field
                    },
                }
            ],
        }
    )
    result = validate_transaction(trx)
    assert result.status == result.status.ok


def test_missing_max_accepted_payout_field_in_comment_options_operation():
    """
    Transaction from hive-python test:
      test_claim_all_calculated_vests_reward
    """
    trx = json.dumps(
        {
            "ref_block_num": 127,
            "ref_block_prefix": 2905439095,
            "expiration": "2025-08-05T10:35:51",
            "extensions": [],
            "signatures": [],
            "operations": [
                {
                    "type": "comment_operation",
                    "value": {
                        "parent_author": "",
                        "parent_permlink": "parent-permlink-is-not-empty",
                        "author": "account-0",
                        "permlink": "main-permlink-account-0",
                        "title": "tittle-main-permlink-account-0",
                        "body": "body-main-permlink-account-0",
                        "json_metadata": "{}",
                    },
                },
                {
                    "type": "comment_options_operation",
                    "value": {
                        "author": "account-0",
                        "permlink": "main-permlink-account-0",
                        "percent_hbd": 0,
                        # "max_accepted_payout": {
                        #     "amount": "100000000",
                        #     "nai": "@@000000013",
                        #     "precision": 3,
                        # },  # todo: missing fields
                        # "allow_votes": "true",  # todo: missing fields
                        # "allow_curation_rewards": "true",  # todo: missing fields
                        # "extensions": [],  # todo: missing fields
                    },
                },
            ],
        }
    )
    result = validate_transaction(trx)
    assert result.status == result.status.ok

def test_bad_array_deserialization():

    trx = json.dumps(
      {
      "ref_block_num": 4,
      "ref_block_prefix": 1920864452,
      "expiration": "2025-08-04T23:16:12",
      "operations": [
        {
          "type": "update_proposal_votes_operation",
          "value": 
            {
              "voter": "initminer",
              "proposal_ids": [0],
              "approve": True,
              "extensions": []
            }
        }
        ],
      "extensions": [],
      "signatures": ["20e388a54d7de4c3990f57e8bbe1271c8d47678f571570f7123f32ea805f382a8b3ffd3ce112069ac9a3f07a54d3d9e25ef139e68f7596576e3c42ae33d46239c7"]
      }
    )

    result = calculate_transaction_id(trx)
    assert result.status == result.status.ok
    assert result.result == b'2c5cdf6bb4bc5a62eb0e81fa52a8e5598a92c075'

    trx = json.dumps(
      {
      "ref_block_num": 9,
      "ref_block_prefix": 1621488055,
      "expiration": "2025-08-04T23:10:30",
      "operations": [
          {
              "type": "account_update_operation",
              "value": {
                  "account": "bob",
                  "owner": {
                      "weight_threshold": 1,
                      "account_auths": [],
                      "key_auths": [
                          ["STM61T5ngsX8DmRxQKBaDTJ1ov6gphGwX9ewCJN8ffKFFwjGd5pxF", 1]
                      ]
                  },
                  "memo_key": "STM72Ujsx5KJz8S2PGcqavrNPcTzzVd2nXs2GMEuiYondN2MMj6vU",
                  "json_metadata": "{}"
              }
          }
      ],
      "extensions": [],
      "signatures": ["2040599ca1e3c4f89463e95dce08cd0498a3125ec3b2a593de41b736689d50581c49ee84561ad99afda32607372feb7f52d76e871f1c03459e669aca817d75a6f1"]
      }
    )

    result = calculate_transaction_id(trx)
    assert result.status == result.status.ok
    assert result.result == b'9a970e05ccf2ef77a7149f32ed46228b96908b98'

