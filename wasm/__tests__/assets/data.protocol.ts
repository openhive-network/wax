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
