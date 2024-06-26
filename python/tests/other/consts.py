from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Final

MAINNET_CHAIN_ID: Final[bytes] = b"beeab0de00000000000000000000000000000000000000000000000000000000"

ENCODING = "utf-8"

BASE_58_REGEX: Final[str] = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

PUBLIC_KEY_PATTERN = rf"^(?:STM)[{BASE_58_REGEX}]{{7,51}}$"
PRIVATE_KEY_PATTERN = rf"^[{BASE_58_REGEX}]{{51}}$"


def load_transaction(name: str) -> dict[bytes, dict[str, Any]]:
    """
    Load a transaction from the data directory with the given name.

    Args:
    ----
    =====
    name (str): The name of the transaction to load (without the extension).

    Returns:
    -------
    ========
    A dictionary with the binary transaction as key and the JSON transaction as value.
    """
    data_directory = Path(__file__).parent / "data"

    with (data_directory / f"{name}.json").open() as json_file:
        json_content = json.load(json_file)

    with (data_directory / f"{name}.bin").open("rb") as bin_file:
        bin_content = bin_file.read().strip()

    return {bin_content: json_content}


VALID_TRXS: Final[dict[bytes, dict[str, Any]]] = {
    **load_transaction("trx_1"),
    **load_transaction("trx_2_sig"),
    **load_transaction("trx_3_multisig"),
}

VALID_OPERATIONS: Final[dict[str, str]] = {
    "vote_operation": '{"type":"vote_operation","value":{"voter":"steemit78","author":"steemit","permlink":"firstpost","weight":10000}}',
    "comment_operation": (
        '{"type":"comment_operation","value":{"parent_author":"","parent_permlink":"meta","author":"steemit","permlink":"firstpost","title":"Welcome'
        ' to Steem!","body":"Steemit is a social media platform where anyone can earn STEEM points by posting. The more'
        " people who like a post, the more STEEM the poster earns. Anyone can sell their STEEM for cash or vest it to"
        ' boost their voting power.","json_metadata":""}}'
    ),
    "transfer_operation": '{"type":"transfer_operation","value":{"from":"admin","to":"steemit","amount":{"amount":"833000","precision":3,"nai":"@@000000021"},"memo":""}}',
    "transfer_to_vesting_operation": '{"type":"transfer_to_vesting_operation","value":{"from":"faddy","to":"","amount":{"amount":"357000","precision":3,"nai":"@@000000021"}}}',
    "withdraw_vesting_operation": '{"type":"withdraw_vesting_operation","value":{"account":"steemit","vesting_shares":{"amount":"200000000000","precision":6,"nai":"@@000000037"}}}',
    "limit_order_create_operation": '{"type":"limit_order_create_operation","value":{"owner":"linouxis9","orderid":10,"amount_to_sell":{"amount":"9950","precision":3,"nai":"@@000000021"},"min_to_receive":{"amount":"3500","precision":3,"nai":"@@000000013"},"fill_or_kill":false,"expiration":"2035-10-29T06:32:22"}}',
    "limit_order_cancel_operation": (
        '{"type":"limit_order_cancel_operation","value":{"owner":"linouxis9","orderid":10}}'
    ),
    "feed_publish_operation": '{"type":"feed_publish_operation","value":{"publisher":"abit","exchange_rate":{"base":{"amount":"1000","precision":3,"nai":"@@000000013"},"quote":{"amount":"1000000","precision":3,"nai":"@@000000021"}}}}',
    "convert_operation": '{"type":"convert_operation","value":{"owner":"summon","requestid":1467592156,"amount":{"amount":"5000","precision":3,"nai":"@@000000013"}}}',
    "account_create_operation": '{"type":"account_create_operation","value":{"fee":{"amount":"0","precision":3,"nai":"@@000000021"},"creator":"hello","new_account_name":"fabian","owner":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM8MN3FNBa8WbEpxz3wGL3L1mkt6sGnncH8iuto7r8Wa3T9NSSGT",1]]},"active":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM8HCf7QLUexogEviN8x1SpKRhFwg2sc8LrWuJqv7QsmWrua6ZyR",1]]},"posting":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM8EhGWcEuQ2pqCKkGHnbmcTNpWYZDjGTT7ketVBp4gUStDr2brz",1]]},"memo_key":"STM6Gkj27XMkoGsr4zwEvkjNhh4dykbXmPFzHhT8g86jWsqu3U38X","json_metadata":"{}"}}',
    "account_update_operation": '{"type":"account_update_operation","value":{"account":"theoretical","posting":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo",1],["STM76EQNV2RTA6yF9TnBvGSV71mW7eW36MM7XQp24JxdoArTfKA76",1]]},"memo_key":"STM6FATHLohxTN8RWWkU9ZZwVywXo6MEDjHHui1jEBYkG2tTdvMYo","json_metadata":""}}',
    "witness_update_operation": '{"type":"witness_update_operation","value":{"owner":"steempty","url":"fmooo/steemd-docker","block_signing_key":"STM8LoQjQqJHvotqBo7HjnqmUbFW9oJ2theyqonzUd9DdJ7YYHsvD","props":{"account_creation_fee":{"amount":"100000","precision":3,"nai":"@@000000021"},"maximum_block_size":131072,"hbd_interest_rate":1000},"fee":{"amount":"0","precision":3,"nai":"@@000000021"}}}',
    "account_witness_vote_operation": '{"type":"account_witness_vote_operation","value":{"account":"donalddrumpf","witness":"berniesanders","approve":true}}',
    "account_witness_proxy_operation": (
        '{"type":"account_witness_proxy_operation","value":{"account":"bunkermining","proxy":"datasecuritynode"}}'
    ),
    "pow_operation": '{"type":"pow_operation","value":{"worker_account":"admin","block_id":"000004433bd4602cf5f74dbb564183837df9cef8","nonce":82,"work":{"worker":"STM65wH1LZ7BfSHcK69SShnqCAH5xdoSZpGkUjmzHJ5GCuxEK9V5G","input":"59b009f89477919f95914151cef06f28bf344dd6fb7670aca1c1f4323c80446b","signature":"1f3f83209097efcd01b7d6f27ce726164323d503d6fcf4d55bfb7cb3032796f6766738b36062b5850d69447fdf9c091cbc70825df5eeacc4710a0b11ffdbf0912a","work":"0b62f4837801cd857f01d6a541faeb13d6bb95f1c36c6b4b14a47df632aa6c92"},"props":{"account_creation_fee":{"amount":"100000","precision":3,"nai":"@@000000021"},"maximum_block_size":131072,"hbd_interest_rate":1000}}}',
    "custom_operation": '{"type":"custom_operation","value":{"required_auths":["bytemaster"],"id":777,"data":"0a627974656d617374657207737465656d697402a3d13897d82114466ad87a74b73a53292d8331d1bd1d3082da6bfbcff19ed097029db013797711c88cccca3692407f9ff9b9ce7221aaa2d797f1692be2215d0a5f6d2a8cab6832050078bc5729201e3ea24ea9f7873e6dbdc65a6bd9899053b9acda876dc69f11a13df9ca8b26b6"}}',
    "delete_comment_operation": '{"type":"delete_comment_operation","value":{"author":"jsc","permlink":"test-delete"}}',
    "custom_json_operation": '{"type":"custom_json_operation","value":{"required_auths":[],"required_posting_auths":["steemit"],"id":"follow","json":"{\\"follower\\":\\"steemit\\",\\"following\\":\\"steem\\",\\"what\\":[\\"posts\\"]}"}}',
    "comment_options_operation": '{"type":"comment_options_operation","value":{"author":"testing001","permlink":"testing6","max_accepted_payout":{"amount":"1000000","precision":3,"nai":"@@000000013"},"percent_hbd":5000,"allow_votes":true,"allow_curation_rewards":true,"extensions":[]}}',
    "set_withdraw_vesting_route_operation": '{"type":"set_withdraw_vesting_route_operation","value":{"from_account":"newyo6","to_account":"newyo","percent":10000,"auto_vest":true}}',
    "limit_order_create2_operation": '{"type":"limit_order_create2_operation","value":{"owner":"arcange","orderid":1,"amount_to_sell":{"amount":"1000","precision":3,"nai":"@@000000021"},"exchange_rate":{"base":{"amount":"1000","precision":3,"nai":"@@000000021"},"quote":{"amount":"987","precision":3,"nai":"@@000000013"}},"fill_or_kill":false,"expiration":"2021-10-10T00:00:00"}}',
    "claim_account_operation": '{"type":"claim_account_operation","value":{"creator":"ocdb","fee":{"amount":"0","precision":3,"nai":"@@000000021"},"extensions":[]}}',
    "create_claimed_account_operation": '{"type":"create_claimed_account_operation","value":{"creator":"steemmonsters","new_account_name":"sucex","owner":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM5WvcuYu4168VSqgm63MFPRYUnMEjkPsW6Wg2rA3yUFkvox8UDs",1]]},"active":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM8NVCSy6zWdtmT774g7BJHFBoYvKcW8UGe74sVLzWHu8tkpugfA",1]]},"posting":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM76uXyX1yPoDT11ytZrKK4PsnecXn8WCKUyXBgP2hQ33tPpgbrH",1]]},"memo_key":"STM57tqSEVL6VYLtHyDktHD6G3M3Y97wvyoahpKBtjwp1Dc15W9DE","json_metadata":"","extensions":[]}}',
    "request_account_recovery_operation": '{"type":"request_account_recovery_operation","value":{"recovery_account":"steem","account_to_recover":"gandalf","new_owner_authority":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM6LYxj96zdypHYqgDdD6Nyh2NxerN3P1Mp3ddNm7gci63nfrSuZ",1]]},"extensions":[]}}',
    "recover_account_operation": '{"type":"recover_account_operation","value":{"account_to_recover":"chitty","new_owner_authority":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM7j3nhkhHTpXqLEvdx2yEGhQeeorTcxSV6WDL2DZGxwUxYGrHvh",1]]},"recent_owner_authority":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM78Xth94gNxp8nmByFV2vNAhg9bsSdviJ6fQXUTFikySLK3uTxC",1]]},"extensions":[]}}',
    "change_recovery_account_operation": '{"type":"change_recovery_account_operation","value":{"account_to_recover":"barrie","new_recovery_account":"boombastic","extensions":[]}}',
    "escrow_transfer_operation": '{"type":"escrow_transfer_operation","value":{"from":"pimeyuifmldj","to":"pimeyuifmldj","hbd_amount":{"amount":"0","precision":3,"nai":"@@000000013"},"hive_amount":{"amount":"1000","precision":3,"nai":"@@000000021"},"escrow_id":10723,"agent":"hiveio","fee":{"amount":"0","precision":3,"nai":"@@000000021"},"json_meta":"{\\"test\\":\\"4865465321456\\"}","ratification_deadline":"2021-01-07T18:48:04","escrow_expiration":"2021-01-20T18:48:04"}}',
    "escrow_dispute_operation": '{"type":"escrow_dispute_operation","value":{"from":"dlux-io","to":"disregardfiat","agent":"qwoyn-dlux","who":"disregardfiat","escrow_id":618657382}}',
    "escrow_release_operation": '{"type":"escrow_release_operation","value":{"from":"disregardfiat","to":"inconceivable","agent":"dlux-io","who":"inconceivable","receiver":"disregardfiat","escrow_id":919386271,"hbd_amount":{"amount":"1000","precision":3,"nai":"@@000000013"},"hive_amount":{"amount":"0","precision":3,"nai":"@@000000021"}}}',
    "pow2_operation": '{"type":"pow2_operation","value":{"work":{"type":"pow2","value":{"input":{"worker_account":"aizen06","prev_block":"003ea604345523c344fbadab605073ea712dd76f","nonce":"1052853013628665497"},"pow_summary":3817904373}},"props":{"account_creation_fee":{"amount":"1","precision":3,"nai":"@@000000021"},"maximum_block_size":131072,"hbd_interest_rate":1000}}}',
    "escrow_approve_operation": '{"type":"escrow_approve_operation","value":{"from":"disregardfiat","to":"inconceivable","agent":"dlux-io","who":"dlux-io","escrow_id":199891652,"approve":false}}',
    "transfer_to_savings_operation": '{"type":"transfer_to_savings_operation","value":{"from":"hiveauth","to":"hiveauth","amount":{"amount":"13541","precision":3,"nai":"@@000000013"},"memo":""}}',
    "transfer_from_savings_operation": (
        '{"type":"transfer_from_savings_operation","value":{"from":"portalmine","request_id":378116,"to":"portalmine","amount":{"amount":"1","precision":3,"nai":"@@000000013"},"memo":"Claim'
        ' HBD interest"}}'
    ),
    "cancel_transfer_from_savings_operation": (
        '{"type":"cancel_transfer_from_savings_operation","value":{"from":"portalmine","request_id":378116}}'
    ),
    "decline_voting_rights_operation": (
        '{"type":"decline_voting_rights_operation","value":{"account":"bilalhaider","decline":true}}'
    ),
    "claim_reward_balance_operation": '{"type":"claim_reward_balance_operation","value":{"account":"bradleyarrow","reward_hive":{"amount":"0","precision":3,"nai":"@@000000021"},"reward_hbd":{"amount":"104","precision":3,"nai":"@@000000013"},"reward_vests":{"amount":"531747227","precision":6,"nai":"@@000000037"}}}',
    "delegate_vesting_shares_operation": '{"type":"delegate_vesting_shares_operation","value":{"delegator":"elamaria","delegatee":"music1sound","vesting_shares":{"amount":"90111193694","precision":6,"nai":"@@000000037"}}}',
    "account_create_with_delegation_operation": '{"type":"account_create_with_delegation_operation","value":{"fee":{"amount":"35000","precision":3,"nai":"@@000000021"},"delegation":{"amount":"0","precision":6,"nai":"@@000000037"},"creator":"steem","new_account_name":"hendratayogas","owner":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM51YSoy7MdrAWgeTsQo4xYVR7L4BKucjqDPefsB7ZojBZgU7CCN",1]]},"active":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM5jgwX1VPT4oZpescjwTmf6k8T8oYmg3RrhjaDnSapis9sFojAL",1]]},"posting":{"weight_threshold":1,"account_auths":[],"key_auths":[["STM5BcLMqLSBXa3DX7ThbbDYFEwcHbvUYWoF8PgTaSVAdNUikBQK1",1]]},"memo_key":"STM5Fj3bNfLCvhFC6U67kfNCg6d8CfpxW2AJRJ9KhELEaoBMK9Ltf","json_metadata":"","extensions":[]}}',
    "witness_set_properties_operation": '{"type":"witness_set_properties_operation","value":{"owner":"alloyxuast","props":[["hbd_exchange_rate","67010000000000000353424400000000e80300000000000003535445454d0000"],["key","03d8cb826edbc3222ac59f30ce5d419d95903b94d0adfb197e25c60bca3b1ab5ae"]],"extensions":[]}}',
    "account_update2_operation": (
        '{"type":"account_update2_operation","value":{"account":"rosylisboa","json_metadata":"","posting_json_metadata":"{\\"profile\\":{\\"name\\":\\"Rosy'
        ' Lisboa\\",\\"about\\":\\"\\",\\"website\\":\\"https://www.instagram.com/rosylisboa_/\\",\\"profile_image\\":\\"https://i.postimg.cc/5NhHzzBJ/yoxi.jpg\\",\\"cover_image\\":\\"https://i.postimg.cc/rmWwns1W/portada4.png\\",\\"version\\":2,\\"location\\":\\"Venezuela,'
        ' Maturín\\"}}","extensions":[]}}'
    ),
    "create_proposal_operation": (
        '{"type":"create_proposal_operation","value":{"creator":"ecency","receiver":"ecency","start_date":"2022-11-30T00:00:00","end_date":"2023-11-30T00:00:00","daily_pay":{"amount":"600000","precision":3,"nai":"@@000000013"},"subject":"Ecency'
        ' development and maintenance #3","permlink":"ecency-development-and-maintenance-3","extensions":[]}}'
    ),
    "update_proposal_votes_operation": '{"type":"update_proposal_votes_operation","value":{"voter":"ballenaprepago","proposal_ids":[0],"approve":true,"extensions":[]}}',
    "remove_proposal_operation": (
        '{"type":"remove_proposal_operation","value":{"proposal_owner":"doze","proposal_ids":[225],"extensions":[]}}'
    ),
    "update_proposal_operation": (
        '{"type":"update_proposal_operation","value":{"proposal_id":247,"creator":"arcange","daily_pay":{"amount":"135000","precision":3,"nai":"@@000000013"},"subject":"HiveSQL'
        ' Services Proposal - Let\'s Keep It Free To Use","permlink":"hivesql-proposal-2023-2024","extensions":[]}}'
    ),
    "collateralized_convert_operation": '{"type":"collateralized_convert_operation","value":{"owner":"karbea","requestid":2,"amount":{"amount":"102","precision":3,"nai":"@@000000021"}}}',
    "recurrent_transfer_operation": '{"type":"recurrent_transfer_operation","value":{"from":"adamada","to":"jonalyn2020","amount":{"amount":"230","precision":3,"nai":"@@000000021"},"memo":"","recurrence":168,"executions":8,"extensions":[]}}',
}

VALID_TRXID_SIGDIGEST_TRX: Final[list[tuple[str, str, str]]] = [
    (
        "ac1f78cde9dffe4f18f37f631f16d023f4097a59",
        "4b6f4891a04f9d60116bb89b793a8985095874f462d7f3a10076d2c3438d4f0e",
        '{"ref_block_num":25501,"ref_block_prefix":4211555470,"expiration":"2016-03-25T13:49:33","operations":[{"type":"transfer_operation","value":{"from":"admin","to":"steemit","amount":{"amount":"833000","precision":3,"nai":"@@000000021"},"memo":""}}],"extensions":[],"signatures":["204ffd40d4feefdf309780a62058e7944b6833595c500603f3bb66ddbbca2ea661391196a97aa7dde53fdcca8aeb31f8c63aee4f47a20238f3749d9f4cb77f03f5"],"transaction_id":"4bf285b77aa9efc2d29d82b4a545dde0ef68a9fe","block_num":25502,"transaction_num":0}',
    ),
    (
        "45af050cf625be7b0bcd11c6f46184ec36b84785",
        "50dcfd8dd51667a8e310643c569c2a37a325d6fc2a419c77a6e4a0f6f5088c8c",
        '{"ref_block_num":25512,"ref_block_prefix":1508835498,"expiration":"2016-03-25T13:50:06","operations":[{"type":"transfer_operation","value":{"from":"administrator","to":"steemit","amount":{"amount":"785000","precision":3,"nai":"@@000000021"},"memo":""}}],"extensions":[],"signatures":["203e096b840bc4ecaa3b51833cc32acd8e182308e035c357f5cbc8d6c3f5cdf7a92cbdefacc448d5adab4286a365c77bd4471b5f5d3cf71973992c60318c5e24ef"],"transaction_id":"307e82a0982f7f2dada115235cfb865ca7f4c7cd","block_num":25513,"transaction_num":0}',
    ),
    (
        "234b964db48e89ea7c75c704f706e706fdf58489",
        "08ec93147876906e68d25fb1f7e920fa7f1bfa62b15a7dfc360c246b01c942fd",
        '{"ref_block_num":28315,"ref_block_prefix":3725516805,"expiration":"2016-03-25T16:11:06","operations":[{"type":"transfer_operation","value":{"from":"faddy3","to":"faddy","amount":{"amount":"40000","precision":3,"nai":"@@000000021"},"memo":""}}],"extensions":[],"signatures":["1f1de10d38fc0c614440e9a017630a9127d127854e466b17d8296fa782c9735e895ff7abad80c1e2e73a821a87cd8c78bb537fd4504c05cfdcd8feef7002c896de"],"transaction_id":"2657e41414e1a2a31a60091803477864bfa9b7ae","block_num":28316,"transaction_num":0}',
    ),
    (
        "f22a79e5023725530f13fe99e5a003c6750e0860",
        "dd1607fa4f64a6ae28341ee0f16892f4ae00e20daf181857be7064648fa30f4c",
        '{"ref_block_num":28360,"ref_block_prefix":3155818521,"expiration":"2016-03-25T16:13:21","operations":[{"type":"transfer_to_vesting_operation","value":{"from":"faddy","to":"","amount":{"amount":"357000","precision":3,"nai":"@@000000021"}}}],"extensions":[],"signatures":["205b831ab3e60511e7560674864e44f6a9ed63fb470ae8819863420cb49448f3543b3eb08888a497ee7190f9943b8bf624531a9b0eb3008f7a0c7139bfb236e54c"],"transaction_id":"7f05d20a73344312e2f5d73cba1549d3ae5d01cc","block_num":28361,"transaction_num":0}',
    ),
    (
        "3dd73e9b4bc3ed8173d3b7ea62777d988d006249",
        "bf0a48bc5fe746aa497509436516da1e5c437ecfa2ff776f2141fd6c1b093299",
        '{"ref_block_num":29832,"ref_block_prefix":827814211,"expiration":"2016-03-25T17:28:42","operations":[{"type":"transfer_to_vesting_operation","value":{"from":"steemit","to":"","amount":{"amount":"2211000","precision":3,"nai":"@@000000021"}}}],"extensions":[],"signatures":["1f07dc99bc886eeecf2a8e71424de1bbfd852ba4404a2f1d11c509a485b60625556a04e6aefce0c184a64540d41ef63c532658646c9173817e828b08c52a338ec9"],"transaction_id":"7212d7054d2ce95b8c1736390e0c2512bf6cd06a","block_num":29833,"transaction_num":0}',
    ),
    (
        "5d54e303318c84e7a613ae8dd522426d0cd6b79d",
        "be897a7e440f78e64b84e7da041ba8c8b344880c327b907ce2525b2b219cfc39",
        '{"ref_block_num":35160,"ref_block_prefix":2589604000,"expiration":"2016-03-25T21:56:33","operations":[{"type":"transfer_to_vesting_operation","value":{"from":"steemit70","to":"steemit","amount":{"amount":"100000","precision":3,"nai":"@@000000021"}}}],"extensions":[],"signatures":["1f1bc44337f63fa02fcd9686d7f67db21f31449534a580a190c68ed26092f72e880a7e111c500a8a3b4947add49fdeba8c33399c03cde25533116dd7b7378f5074"],"transaction_id":"f550ad436b78848a7bd29529efdcbfb350020f9b","block_num":35161,"transaction_num":0}',
    ),
    (
        "ac3aade02de653e1a94d7c7eba723309bc756d4a",
        "f530c847aa422b7f4b7e12ddda46f14334b320c8f235fedf1fe72f51dd2f1c7c",
        '{"ref_block_num":55654,"ref_block_prefix":4093603531,"expiration":"2016-03-26T15:03:24","operations":[{"type":"transfer_operation","value":{"from":"fmooo","to":"root","amount":{"amount":"1000","precision":3,"nai":"@@000000021"},"memo":"test"}}],"extensions":[],"signatures":["201b0d09f7c9c3b47649f1cabef73eb81554d84439fb2388022dfdc9d718cd5c342671b8d193dbcebcc9444243832ea1f475e17e1d4dad755a9de6ddc7a0cf331c"],"transaction_id":"e5a9f188ffc16f8cda143a28f13520a46595a432","block_num":55655,"transaction_num":0}',
    ),
    (
        "22ee9f8e90508c339ef345b81d950fe40928168e",
        "978c6bcb7e6b964f45d8f50952f9ce8a39ff726adde0845cca62348b3fcda356",
        '{"ref_block_num":56983,"ref_block_prefix":206632692,"expiration":"2016-03-26T16:09:51","operations":[{"type":"transfer_operation","value":{"from":"fmooo","to":"root","amount":{"amount":"1000","precision":3,"nai":"@@000000021"},"memo":"test2"}}],"extensions":[],"signatures":["1f69836ca3d70f417dd750573f23b3fb166de94b18aaaae272031925bb756dbc6011912da2881cfbce0b6d938896e3961c346151d9e512608815339f615f96aa46"],"transaction_id":"0007d195dbb2798372cf254103d8e279d6da206f","block_num":56984,"transaction_num":0}',
    ),
    (
        "9c39bbf5de741412f3efc207d33af48d442a094b",
        "35ec40be08924d40a94aa733aa3d2d5d6ed358de16dd89e6455ab329807a6f8a",
        '{"ref_block_num":61958,"ref_block_prefix":3826185324,"expiration":"2016-03-26T20:18:36","operations":[{"type":"transfer_operation","value":{"from":"steemit40","to":"steemit","amount":{"amount":"533000","precision":3,"nai":"@@000000021"},"memo":"memo"}}],"extensions":[],"signatures":["2023889603edd218e98428fea9825d2e7df7be9387d31147bffaad28ba19620b0f0ae7a2f938f5ad0a02d6167d5b5b21e269eaa14ee3eb324ca623f77bb9c7d67b"],"transaction_id":"ea3a8512971825891ee76629e5b96c2cbfa4e05e","block_num":61959,"transaction_num":0}',
    ),
    (
        "22a568240234cbd72941e85ab43d9698bbf8d857",
        "507cb7fcf188c7025ff5ae661faffbe80dea9258315746ab69c6e61d528fbda6",
        '{"ref_block_num":64844,"ref_block_prefix":2595708119,"expiration":"2016-03-26T22:42:54","operations":[{"type":"transfer_to_vesting_operation","value":{"from":"fminerten","to":"","amount":{"amount":"60000","precision":3,"nai":"@@000000021"}}}],"extensions":[],"signatures":["20687d4456bad9756706346ef90b401817afc6d6cd12d559fc11c736fbf119554c47d4c35d8c962606d1fbecb31ae9b2c95fa37f6359972aba6981c6e9535176ca"],"transaction_id":"e1240460b831c5d81c3c7b4d9751389910af588e","block_num":64845,"transaction_num":0}',
    ),
]

VALID_SIG_DIGEST_WITH_TRANSACTIONS = {sig_digest: trx for _, sig_digest, trx in VALID_TRXID_SIGDIGEST_TRX}
VALID_TRX_ID_WITH_TRANSACTIONS = {trx_id: trx for trx_id, _, trx in VALID_TRXID_SIGDIGEST_TRX}

VALID_PROTO_OPERATIONS: Final[list[dict[str, Any]]] = [
    {
        "comment": {
            "parent_permlink": "/",
            "author": "alice",
            "permlink": "/",
            "title": "Best comment",
            "body": "<span>comment</span>",
            "json_metadata": "{}",
        }
    },
    {"vote": {"voter": "bob", "author": "alice", "permlink": "/", "weight": 1}},
]

VALID_PROTO_TRANSACTION: Final[dict[str, Any]] = {
    "operations": VALID_PROTO_OPERATIONS,
}
