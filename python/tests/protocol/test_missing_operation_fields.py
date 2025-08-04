import json

from wax import validate_transaction


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

    result = validate_transaction(trx.encode())
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

    result = validate_transaction(trx.encode())
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
    result = validate_transaction(trx.encode())
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
    result = validate_transaction(trx.encode())
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
    result = validate_transaction(trx.encode())
    assert result.status == result.status.ok
