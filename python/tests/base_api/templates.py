from __future__ import annotations

from typing import Any, Final

from wax.wax_result import python_json_asset, python_price, python_witness_set_properties_data

SIGNATURE_TRANSACTION: Final[dict[str, Any]] = {
    "expiration": "2024-02-21T06:55:40",
    "extensions": [],
    "operations": [
        {
            "type": "account_update2_operation",
            "value": {
                "account": "thatcryptodave",
                "extensions": [],
                "json_metadata": "",
                "posting_json_metadata": (
                    '{"name":"David P.","about":"","website":"","location":"Ontario, Canada",'
                    '"birthday":"03.28.1984","profile":{"name":"David P.","about":"",'
                    '"website":"","location":"Ontario, Canada","birthday":"03.28.1984",'
                    '"profile_image":"","cover_image":""}}'
                ),
            },
        }
    ],
    "signatures": [
        "1f6ad21ddf9f57f1a94c1462185744cb0ea779ec1e99899f2556a3ce02b18d1b810fcddaccb349a53037798aea8023909447df756db461235ba5b63984d515c977"
    ],
    "ref_block_num": 26295,
    "ref_block_prefix": 26859167,
}

REQUIRED_ACTIVE_AUTHORITY_TRANSACTION: Final[dict[str, Any]] = {
    "ref_block_num": 59819,
    "ref_block_prefix": 1319397834,
    "extensions": [],
    "expiration": "2024-09-12T07:15:15",
    "operations": [{"type": "limit_order_cancel_operation", "value": {"owner": "droida", "orderid": 877434673}}],
    "signatures": [
        "20470dc8de917827ea55328774123c93b4670cfe72133981072e2821e7fa20bfaf04f5dcec762ebc89a64232bc2c5d5d0de98a61ab670647cfb4c5ff5c438e865e"
    ],
}


REQUIRED_OWNER_AUTHORITY_TRANSACTION: Final[dict[str, Any]] = {
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
                        ["STM8XB3ZtazYGLGpPVT6Vjwjeaiqgx8tfjmmUAfn31DDmzvVpaLqo", 1],
                    ],
                    "account_auths": [["vsc.network", 11]],
                    "weight_threshold": 11,
                },
                "active": {"key_auths": [], "account_auths": [], "weight_threshold": 11},
                "account": "vsc.gateway",
                "posting": {"key_auths": [], "account_auths": [["vsc.network", 11]], "weight_threshold": 11},
                "memo_key": "STM8buQNWovTcX7H8yLdYNx82xDddQE9R5MzQDNg4mocScnXTGSkE",
                "json_metadata": '{"message":"VSC Multsig Account","epoch":378}',
            },
        }
    ],
    "signatures": [
        "2025e4786d42348e3dcf68a19a35cfe690c196e02b77e87547710753bebe44e4da21b35f12b1e3fd786d5b867d114b12c676d7d6ee6c84c26d9430206677011461",
        "1f078118754c4dac8161de0a9387e612eb51946a817ee7f0153c9a6f46b6e4d33c1491b166edeaaa496016342411c980def6c94162eb73e95f4fade4cd96c8f37a",
        "1f0e3e48e0546372e5bd665dd39489d1d40b9db979b6678c627fc964dd20e5155e5dcf30ed41ed514c6b47be1ea95b0ff64cd3f91f6c6065ba4a63decd0f5d69fe",
        "1f0edd1681496f394eecc7fa075ab776f6b7fbb1ce0251e7b636f6076699a741de368ff8d063bbe36f9a8fe0378935d8a2d9d9030625aa84552cb804bde6b19798",
        "1f19b81eb6c2e97043933d6ca583b6c98c59514a88bb4e35e1a74007f27c6e9931748d44bebcebd6a18ecc4132e49411d17cf8236200009f76f93e2be4784af179",
        "1f687c876c35d1074473a1ee044681f1d6d25b4331e1ec9502174880874be4011a23fd9b3205fa881765939d51070809bc68745c218947163b6f86de587e8a9189",
        "1f752c413fa9378982fcc59668cfa14f38dd4ad24d2358ff98b702f807389d434a5271cdfacc8884e719d4cd515b6d7c2827c0735ac0e0c79468d85965821cd960",
        "203231db1e1cc3f955958a2663d257dae1533fd3c2130bd0e0c5ad18edc854cbb5440a7c481497c92752e343330d53e07b93f7a9b6b441e0b3671835e3b6609e2e",
        "2051589eddc26ed021ee53edfa45f75dbc960705410eb3b22f61bd0c74246382397cdcc57fc513262aefca21b8d03eef7773bd20a29f451198160079b564ff4130",
        "20707cf3698fa3ec3848b73ae1def7c3344d4fe60a42c15ee5c1986b2ee1d5a80e730e7df2ad5759fc2ad0138249b4db6a3d0efbe9ac4bc136660285177177ba68",
        "20724430ed1b6628616d20f95818e065f67799cbe05bb4f3aaeb588cbf85e0e18c460414e423fe80f2c0b429d292f6e6d1fd8890f26c5c00f18c46f93feafcebef",
    ],
}


RECOVER_ACCOUNT_TRANSACTION: Final[dict[str, Any]] = {
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
                    "key_auths": [["STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW", 1]],
                },
                "recent_owner_authority": {
                    "weight_threshold": 1,
                    "account_auths": [],
                    "key_auths": [["STM4wJYLcRnALfbpb4ziqiH3oLEgw9PTJZTBBj8goFyjta3mm6D1s", 1]],
                },
                "extensions": [],
            },
        }
    ],
}


INPUT_WITNESS_PROPERTIES: Final[python_witness_set_properties_data] = python_witness_set_properties_data(
    key="STM5z76mjZJnTZHHZjgnFxFadTb1ztc6R7EuDgCzd6dNiv6ETB2tj",
    new_signing_key="STM5z76mjZJnTZHHZjgnFxFadTb1ztc6R7EuDgCzd6dNiv6ETB2tj",
    hbd_exchange_rate=python_price(
        base=python_json_asset(amount="273", precision=3, nai="@@000000013"),
        quote=python_json_asset(amount="1000", precision=3, nai="@@000000021"),
    ),
    account_creation_fee=python_json_asset(amount="5000", precision=3, nai="@@000000021"),
    url="https://hive.io",
    maximum_block_size=131072,
    hbd_interest_rate=1000,
    account_subsidy_budget=797,
    account_subsidy_decay=347321,
)

WITNESS_PROPERTIES: Final[python_witness_set_properties_data] = python_witness_set_properties_data(
    key="STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh",
    new_signing_key="STM6TqSJaS1aRj6p6yZEo5xicX7bvLhrfdVqi5ToNrKxHU3FRBEdW",
    account_creation_fee=python_json_asset(amount="5000", precision=3, nai="@@000000021"),
    url="https://hive.io",
    hbd_exchange_rate=python_price(
        base=python_json_asset(amount="100", precision=3, nai="@@000000013"),
        quote=python_json_asset(amount="100", precision=3, nai="@@000000021"),
    ),
    maximum_block_size=131072,
    hbd_interest_rate=1000,
    account_subsidy_budget=797,
    account_subsidy_decay=347321,
)


WITNESS_PROPERTIES_HF26: Final[dict[str, Any]] = {
    "type": "witness_set_properties_operation",
    "value": {
        "owner": "gtg",
        "props": [
            [
                "account_creation_fee",
                "88130000000000002320bcbe",
            ],
            [
                "account_subsidy_budget",
                "e8030000",
            ],
            [
                "account_subsidy_decay",
                "e8030000",
            ],
            [
                "hbd_exchange_rate",
                "e8030000000000000320bcbee8030000000000002320bcbe",
            ],
            [
                "hbd_interest_rate",
                "e803",
            ],
            [
                "key",
                "02472d6eb6d691b6de8b103b51ebdf4e128a523946d8cd03d6ded91b1497ee2e83",
            ],
            [
                "maximum_block_size",
                "e8030000",
            ],
            [
                "new_signing_key",
                "02cf69b1f999d133ebbe178a8b4bbf4da356b264dfdc843b1c740378bff8f65b33",
            ],
            [
                "url",
                "0f68747470733a2f2f686976652e696f",
            ],
        ],
    },
}
