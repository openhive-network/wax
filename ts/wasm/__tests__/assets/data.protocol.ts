/**
 * Required data for the protocol.spec.ts tests
 */

import Long from "long";
import type { transaction as transactionT } from "../../dist/lib";
import type { witness_set_properties_data } from "../../dist/lib/wax_module";

/// Converts given number to the array of low and high number parts
export const numToHighLow = (value: number | string | Long): [ number, number ] => {
  const long = Long.fromValue(value);

  return [ long.low, long.high ];
};

export const serializedWitnessSetProperties = {
  type: 'witness_set_properties_operation',
  value: {
    owner: 'gtg',
    props: [
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
        "3553544d355271564241564e703575664d4365745174764c474c4a6f37756e58396e7943424d4d7254585257513969315a7a7a697a68",
      ],
      [
        "maximum_block_size",
        "e8030000",
      ],
      [
        "new_signing_key",
        "3553544d365471534a61533161526a367036795a456f35786963583762764c6872666456716935546f4e724b78485533465242456457",
      ],
      [
        "url",
        "0f68747470733a2f2f686976652e696f",
      ]
    ]
  }
};


/// https://explore.openhive.network/transaction/208ae2b74e32151a77e73c13b8324b07e5953d0f
export const realSerializedWitnessSetProperties = {
  type: 'witness_set_properties_operation',
  value: {
    "owner": "igormuba",
    "props": [
      ["hbd_exchange_rate", "11010000000000000353424400000000e80300000000000003535445454d0000"],
      ["key", "029072da2e84ebd6eb520f944db3d1af718500b0f1ddf60e11e986f990acddd524"]],
      "extensions": []
  }
};

export const input_witness_properties: witness_set_properties_data = {
  key: 'STM5z76mjZJnTZHHZjgnFxFadTb1ztc6R7EuDgCzd6dNiv6ETB2tj',
  new_signing_key: 'STM5z76mjZJnTZHHZjgnFxFadTb1ztc6R7EuDgCzd6dNiv6ETB2tj',
  hbd_exchange_rate: {
    base: {
      amount: "273",
      nai: "@@000000013",
      precision: 3
    },
    quote: {
      amount: "1000",
      nai: "@@000000021",
      precision: 3
    }
  },
  account_creation_fee: {
    nai: "@@000000021",
    precision: 3,
    amount: "5000"
  },
  url: 'https://hive.io',
  maximum_block_size: 131072,
  hbd_interest_rate: 1000,
  account_subsidy_budget: 797,
  account_subsidy_decay: 347321
};

export const witness_properties: witness_set_properties_data = {
  key: 'STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh',
  new_signing_key: 'STM6TqSJaS1aRj6p6yZEo5xicX7bvLhrfdVqi5ToNrKxHU3FRBEdW',
  account_creation_fee: {
    nai: "@@000000021",
    precision: 3,
    amount: "5000"
  },
  url: 'https://hive.io',
  hbd_exchange_rate: {
    base: {
      "amount": "100",
      "nai": "@@000000013",
      "precision": 3
    },
    quote: {
      "amount": "100",
      "nai": "@@000000021",
      "precision": 3
    }
  },
  maximum_block_size: 131072,
  hbd_interest_rate: 1000,
  account_subsidy_budget: 797,
  account_subsidy_decay: 347321
};

export const naiAsset = {
  amount: "300000",
  precision: 3,
  nai: "@@000000021"
};

export const vote_operation = {
  type: "vote_operation",
  value: {
    voter: "otom",
    author: "c0ff33a",
    permlink: "ewxhnjbj",
    weight: 2200
  }
};

export const transfer_operation = {
  type: "transfer_operation",
  value: {
    from: "oneplus7",
    to: "kryptogames",
    amount: naiAsset,
    memo: "Roll under 50 4d434bd943616"
  }
};

export const transaction = JSON.stringify({
  ref_block_num: 34559,
  ref_block_prefix: 1271006404,
  expiration: "2021-12-13T11:31:33",
  operations: [
    vote_operation
  ]
});

export const legacyApiTransaction = JSON.stringify({
  ref_block_num: 1959,
  ref_block_prefix: 3625727107,
  expiration: '2023-11-09T22:01:24',
  operations: [['transfer', { from: 'oneplus7', to: 'kryptogames', amount: '300.000 HIVE', memo: 'Roll under 50 4d434bd943616' }]],
  extensions: [],
  signatures: [],
});

export const signatureTransaction = {
  expiration: "2024-02-21T06:55:40",
  extensions: [],
  operations: [
    {
      type: "account_update2_operation",
      value: {
        account: "thatcryptodave",
        extensions: [],
        json_metadata: "",
        posting_json_metadata: "{\"name\":\"David P.\",\"about\":\"\",\"website\":\"\",\"location\":\"Ontario, Canada\",\"birthday\":\"03.28.1984\",\"profile\":{\"name\":\"David P.\",\"about\":\"\",\"website\":\"\",\"location\":\"Ontario, Canada\",\"birthday\":\"03.28.1984\",\"profile_image\":\"\",\"cover_image\":\"\"}}"
      }
    }
  ],
  signatures: [
    "1f6ad21ddf9f57f1a94c1462185744cb0ea779ec1e99899f2556a3ce02b18d1b810fcddaccb349a53037798aea8023909447df756db461235ba5b63984d515c977"
  ],
  ref_block_num: 26295,
  ref_block_prefix: 26859167
};

export const requiredActiveAuthorityTransaction = {
  "ref_block_num": 59819,
  "ref_block_prefix": 1319397834,
  "extensions": [],
  "expiration": "2024-09-12T07:15:15",
  "operations": [
    {
      "type": "limit_order_cancel_operation",
      "value": {
        "owner": "droida",
        "orderid": 877434673
      }
    }
  ],
  "signatures": [
    "20470dc8de917827ea55328774123c93b4670cfe72133981072e2821e7fa20bfaf04f5dcec762ebc89a64232bc2c5d5d0de98a61ab670647cfb4c5ff5c438e865e"
  ]
};

export const requiredOwnerAuthorityTransaction = {
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
            [
              "STM4xCRKtqz2GyCq4ctwyi2SFk29fyVyCMxpuNioGGi7JAJuTXWD2",
              1
            ],
            [
              "STM57pVtywZGeywtcxtozLjxRUZFSt9kcFv2LDP8YsTQzW1e4b8NT",
              1
            ],
            [
              "STM5QHDFfzSFzPRGknGiXAbFtdkadgFmDzMazCSFWch5k3QRYrNUu",
              1
            ],
            [
              "STM5gQ79TFvy483xLvW2ZDyZRw979yxeNSrVY278J5ZkRKfFkXn2u",
              1
            ],
            [
              "STM5jQxUpMn84tCFQCrhwvVxkhbgTBYGYYiPJys1QHd9bJvb92UdP",
              1
            ],
            [
              "STM5tzqAFVovzopZszs46P22PLUQzTVTyPdkFaGkxgRcFV3sPWUMa",
              1
            ],
            [
              "STM5victPsYtnLQvHi4V1c3ZshMMe1sxFHkj1YtM3sMwW49Dim5Rn",
              1
            ],
            [
              "STM6bzzDhAH7by2H8CuD742p89ZDEkPg3W3nhxcLWzjqxFTyfEUga",
              1
            ],
            [
              "STM6fSMwqr6F1c2aNf7ov8WnKnAn7Grrb8A7kQR4Qu5yDJF8Y5icL",
              1
            ],
            [
              "STM6hGTjCRfDHLuzzYKVwr9cmjzgXdBJ8Efv7SK75gGiywqNwbp8u",
              1
            ],
            [
              "STM6psb1cFxfd8YbWUfSbbMazp16Dq189sTcZ3oDuEAw96jY7fgvs",
              1
            ],
            [
              "STM6qtzpc2d4M2vWZJFJptcS5c8RYmYPgLrRfjx2s6PZJDViaEsAR",
              1
            ],
            [
              "STM6v5nGgfZ1jTPB7FbS92McNU2iA15oyi8FBGnemHuYU5yP9cmBF",
              1
            ],
            [
              "STM6wtyPzJ9DbExRQMGh39FrMPT9USFQxcEiNycVJToZ1YgBSRhka",
              1
            ],
            [
              "STM6xHrBQuK3HeQ6ydQwD1fLdL65H4W6XGA8tmzwntMuNuoxwKnD6",
              1
            ],
            [
              "STM76nQCMeBybWbHLNdoyTwLRxefc3CWAQUTPfkS981FCH4jKCKyU",
              1
            ],
            [
              "STM7Qt3bkotstLhuaNXGbDLcsGUxSauY8pqBFFKBqQXPmdCfFjWoN",
              1
            ],
            [
              "STM7upEkw7FBfNexisNxnotd6v47oA4Vd26gu69ijEZnxFnK3nYuU",
              1
            ],
            [
              "STM7zgquZgbBCw3SmgtyMvRcB67XGSDEAsPw3Unqay4NSYApuF6oQ",
              1
            ],
            [
              "STM859GqiDqMZBAjW1hZQ6JuK2EoCbMN8g1VomACiHLHUSXgwMJ1J",
              1
            ],
            [
              "STM8XB3ZtazYGLGpPVT6Vjwjeaiqgx8tfjmmUAfn31DDmzvVpaLqo",
              1
            ]
          ],
          "account_auths": [
            [
              "vsc.network",
              11
            ]
          ],
          "weight_threshold": 11
        },
        "active": {
          "key_auths": [],
          "account_auths": [],
          "weight_threshold": 11
        },
        "account": "vsc.gateway",
        "posting": {
          "key_auths": [],
          "account_auths": [
            [
              "vsc.network",
              11
            ]
          ],
          "weight_threshold": 11
        },
        "memo_key": "STM8buQNWovTcX7H8yLdYNx82xDddQE9R5MzQDNg4mocScnXTGSkE",
        "json_metadata": "{\"message\":\"VSC Multsig Account\",\"epoch\":378}"
      }
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
    "20724430ed1b6628616d20f95818e065f67799cbe05bb4f3aaeb588cbf85e0e18c460414e423fe80f2c0b429d292f6e6d1fd8890f26c5c00f18c46f93feafcebef"
  ]
};

/// See Hive mainnet block 80021416, trx_id: 7f34699e9eea49d1bcc10c88f96e38897839ece3
export const serialization_sensitive_transaction = JSON.stringify({
  ref_block_num: 1959,
  ref_block_prefix: 3625727107,
  expiration: "2023-11-09T22:01:24",
  operations: [
    transfer_operation
  ],
  extensions: []
});

export const serialization_sensitive_transaction_proto: transactionT = {
  ref_block_num: 1959,
  ref_block_prefix: 3625727107,
  expiration: "2023-11-09T22:01:24",
  operations: [
    {
      transfer: {
        from_account: transfer_operation.value.from,
        to_account: transfer_operation.value.to,
        amount: transfer_operation.value.amount,
        memo: transfer_operation.value.memo
      }
    }
  ],
  extensions: [],
  signatures: []
};

export const initminerAccountApi = {
  active: {
    account_auths: [],
    key_auths: [
      [
        "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX",
        1
      ]
    ],
    weight_threshold: 1
  },
  balance: "0.004 HIVE",
  can_vote: true,
  comment_count: 0,
  created: "2016-03-24T16:00:00",
  curation_rewards: 0,
  delayed_votes: [],
  delegated_vesting_shares: "0.000000 VESTS",
  downvote_manabar: {
    current_mana: 0,
    last_update_time: 0
  },
  governance_vote_expiration_ts: "1969-12-31T23:59:59",
  hbd_balance: "0.002 HBD",
  hbd_last_interest_payment: "1970-01-01T00:00:00",
  hbd_seconds: "0",
  hbd_seconds_last_update: "2016-08-11T09:57:42",
  id: 3,
  is_smt: false,
  json_metadata: "",
  last_account_recovery: "1970-01-01T00:00:00",
  last_account_update: "1970-01-01T00:00:00",
  last_owner_update: "1970-01-01T00:00:00",
  last_post: "1970-01-01T00:00:00",
  last_post_edit: "1970-01-01T00:00:00",
  last_root_post: "1970-01-01T00:00:00",
  last_vote_time: "1970-01-01T00:00:00",
  lifetime_vote_count: 0,
  memo_key: "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX",
  mined: true,
  name: "initminer",
  next_vesting_withdrawal: "1969-12-31T23:59:59",
  open_recurrent_transfers: 0,
  owner: {
    account_auths: [],
    key_auths: [
      [
        "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX",
        1
      ]
    ],
    weight_threshold: 1
  },
  pending_claimed_accounts: 0,
  pending_transfers: 0,
  post_bandwidth: 0,
  post_count: 0,
  post_voting_power: "1,000,000.000000 VESTS",
  posting: {
    account_auths: [],
    key_auths: [
      [
        "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX",
        1
      ]
    ],
    weight_threshold: 1
  },
  posting_json_metadata: "",
  posting_rewards: 0,
  previous_owner_update: "1970-01-01T00:00:00",
  proxied_vsf_votes: [
    0,
    0,
    0,
    0
  ],
  proxy: "",
  received_vesting_shares: "0.000000 VESTS",
  recovery_account: "",
  reset_account: "null",
  reward_hbd_balance: "0.000 HBD",
  reward_hive_balance: "0.000 HIVE",
  reward_vesting_balance: "0.000000 VESTS",
  reward_vesting_hive: "0.000 HIVE",
  savings_balance: "0.000 HIVE",
  savings_hbd_balance: "0.000 HBD",
  savings_hbd_last_interest_payment: "1970-01-01T00:00:00",
  savings_hbd_seconds: "0",
  savings_hbd_seconds_last_update: "1970-01-01T00:00:00",
  savings_withdraw_requests: 0,
  to_withdraw: 0,
  vesting_shares: "1,000,000.000000 VESTS",
  vesting_withdraw_rate: "0.000001 VESTS",
  voting_manabar: {
    current_mana: 0,
    last_update_time: 0
  },
  withdraw_routes: 0,
  withdrawn: 0,
  witnesses_voted_for: 0
};

export const customJsonsTransaction = {
  ref_block_num: 1960,
  ref_block_prefix: 3915120327,
  expiration: "2023-11-09T21:51:27",
  operations: [
    vote_operation,
    {
      type: "custom_json_operation",
      value: {
        required_posting_auths: [
          "initminer"
        ],
        id: "follow",
        json: "[\"follow\",{\"follower\":\"initminer\",\"following\":\"gtg\",\"what\":[\"blog\"]}]"
      }
    },
    {
      type: "custom_json_operation",
      value: {
        required_posting_auths: [
          "initminer"
        ],
        id: "follow",
        json: "[\"follow\",{\"follower\":\"initminer\",\"following\":\"spammer\",\"what\":[\"ignore\"]}]"
      }
    },
    {
      type: "custom_json_operation",
      value: {
        required_posting_auths: [
          "initminer"
        ],
        id: "follow",
        json: "[\"follow\",{\"follower\":\"initminer\",\"following\":\"spammer\",\"what\":[\"reset_following_list\"]}]"
      }
    },
    {
      type: "custom_json_operation",
      value: {
        required_posting_auths: [
          "initminer"
        ],
        id: "follow",
        json: "[\"follow\",{\"follower\":\"initminer\",\"following\":\"spammer\",\"what\":[\"reset_muted_list\"]}]"
      }
    }
  ]
};

export const customMultipleJsonsTransaction = {
  ref_block_num: 1960,
  ref_block_prefix: 3915120327,
  expiration: "2023-11-09T21:51:27",
  operations: [
    {
      type: 'custom_json_operation',
      value: {
        id: 'follow',
        json: '["follow",{"follower":"initminer","following":"gtg","what":["follow_blacklist"]}]',
        required_posting_auths: [
          "initminer"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'follow',
        json: '["follow",{"follower":"initminer","following":"gtg","what":["follow_muted"]}]',
        required_posting_auths: [
          "initminer"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'follow',
        json: '["follow",{"follower":"initminer","following":"gtg","what":["reset_all_lists"]}]',
        required_posting_auths: [
          "initminer"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'follow',
        json: '["follow",{"follower":"initminer","following":"gtg","what":["reset_blacklist"]}]',
        required_posting_auths: [
          "initminer"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'follow',
        json: '["follow",{"follower":"initminer","following":"gtg","what":["reset_follow_blacklist"]}]',
        required_posting_auths: [
          "initminer"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'follow',
        json: '["follow",{"follower":"initminer","following":"gtg","what":["reset_follow_muted_list"]}]',
        required_posting_auths: [
          "initminer"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'follow',
        json: '["follow",{"follower":"initminer","following":"gtg","what":["unblacklist"]}]',
        required_posting_auths: [
          "initminer"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'follow',
        json: '["follow",{"follower":"initminer","following":"gtg","what":["unfollow_blacklist"]}]',
        required_posting_auths: [
          "initminer"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'follow',
        json: '["follow",{"follower":"initminer","following":"gtg","what":[""]}]',
        required_posting_auths: [
          "initminer"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'follow',
        json: '["follow",{"follower":"initminer","following":"gtg","what":["unfollow_muted"]}]',
        required_posting_auths: [
          "initminer"
        ]
      }
    }
  ]
};


export const customCommunityJsonsTransaction = {
  ref_block_num: 1960,
  ref_block_prefix: 3915120327,
  expiration: "2023-11-09T21:51:27",
  operations: [
    {
      type: 'custom_json_operation',
      value: {
        id: 'community',
        json: '["flagPost",{"community":"mycomm","account":"gtg","permlink":"first-post","notes":"note"}]',
        required_posting_auths: [
          "gtg"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'community',
        json: '["mutePost",{"community":"mycomm","account":"gtg","permlink":"first-post","notes":"note"}]',
        required_posting_auths: [
          "gtg"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'community',
        json: '["pinPost",{"community":"mycomm","account":"gtg","permlink":"first-post"}]',
        required_posting_auths: [
          "gtg"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'community',
        json: '["subscribe",{"community":"mycomm"}]',
        required_posting_auths: [
          "gtg"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'community',
        json: '["unmutePost",{"community":"mycomm","account":"gtg","permlink":"first-post","notes":"note"}]',
        required_posting_auths: [
          "gtg"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'community',
        json: '["unpinPost",{"community":"mycomm","account":"gtg","permlink":"first-post"}]',
        required_posting_auths: [
          "gtg"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'community',
        json: '["unsubscribe",{"community":"mycomm"}]',
        required_posting_auths: [
          "gtg"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'community',
        json: '["setUserTitle",{"community":"mycomm","account":"gtg","title":"first-post"}]',
        required_posting_auths: [
          "gtg"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'community',
        json: '["updateProps",{"community":"mycomm","props":{"title":"Custom title","about":"This community is the best!","description":"Accepting all kind of users","flag_text":"1. Smoking here is not allowed","is_nsfw":false,"lang":"en"}}]',
        required_posting_auths: [
          "gtg"
        ]
      }
    },
    {
      type: 'custom_json_operation',
      value: {
        id: 'community',
        json: '["setRole",{"community":"mycomm","account":"gtg","role":"owner"}]',
        required_posting_auths: [
          "gtg"
        ]
      }
    }
  ]
};

export const specificBenchmarkTransaction = {
  transfer: {
    from_account: "oneplus7",
    to_account: "kryptogames",
    amount: naiAsset,
    memo: "Roll under 50 4d434bd943616"
  },
  vote: {
    voter: "otom",
    author: "c0ff33a",
    permlink: "ewxhnjbj",
    weight: 2200
  },
  custom_json: {
    required_auths: [],
    required_posting_auths: [
      "initminer"
    ],
    id: "follow",
    json: "[\"follow\",{\"follower\":\"initminer\",\"following\":\"gtg\",\"what\":[\"blog\"]}]"
  },
  account_witness_vote: {
    account: "initminer",
    witness: "initminer",
    approve: true
  },
  feed_publish: {
    publisher: "gtg",
    exchange_rate: {
      base: { nai: "@@000000013", amount: "337", precision: 3 },
      quote: { nai: "@@000000013", amount: "1", precision: 3 }
    }
  },
  claim_account: {
    fee: { nai: "@@000000021", amount: "0", precision: 3 },
    creator: "gtg",
    extensions: []
  },
  claim_reward_balance: {
    account: "gtg",
    reward_hbd: { nai: "@@000000013", amount: "0", precision: 3 },
    reward_hive: { nai: "@@000000021", amount: "0", precision: 3 },
    reward_vests: { nai: "@@000000037", amount: "524461404202", precision: 6 }
  },
  comment: {
    body: "`aria2c` looks interesting. `lftp` is great about not redownloading files that haven't been modified so once that fat 1.8TB download is done, no need to send that through the pipes anymore, just the incremental stuff.",
    title: "",
    author: "rishi556",
    permlink: "re-gtg-scddr6",
    json_metadata: "{\"tags\":[\"hive-139531\"],\"app\":\"peakd/2024.4.3\"}",
    parent_author: "gtg",
    parent_permlink: "scdbbz"
  }
};

export const required_authorities_transaction = JSON.stringify({
  ref_block_num: 19260,
  ref_block_prefix: 2140466769,
  expiration: "2016-09-15T19:47:33",
  operations: [
      {
          type: "vote_operation",
          value: {
              voter: "taoteh1221",
              author: "ozchartart",
              permlink: "usdsteem-btc-daily-poloniex-bittrex-technical-analysis-market-report-update-46-glass-half-full-but-the-bottle-s-left-empty-sept",
              weight: 10000,
          },
      }
  ],
  extensions: [{"type": "void_t", "value": {}}],
  signatures: [
      "202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8b37d3fb3"
  ],
});

export const recoverAccountTransaction = {
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
          "key_auths": [
            ["STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW", 1]
          ]
        },
        "recent_owner_authority": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            ["STM4wJYLcRnALfbpb4ziqiH3oLEgw9PTJZTBBj8goFyjta3mm6D1s", 1]
          ]
        },
        "extensions": []
      }
    }
  ]
};