PROTO_REF_VOTE_OP = {
    "vote": {
        "voter": "otom",
        "author": "c0ff33a",
        "permlink": "ewxhnjbj",
        "weight": 2200
    }
}

PROTO_REF_VOTE_OP_EMPTY = {
    "vote": {
    }
}

PROTO_REF_TRANSACTION = {
    "ref_block_num": 19260,
    "ref_block_prefix": 2140466769,
    "expiration": "2016-09-15T19:47:33",
    "operations": [
        {
            "vote": {
                "voter": "taoteh1221",
                "author": "ozchartart",
                "permlink": "usdsteem-btc-daily-poloniex-bittrex-technical-analysis-market-report-update-46-glass-half-full-but-the-bottle-s-left-empty-sept",
                "weight": 10000,
            }
        }
    ],
    "extensions": [{"void_t": {}}],
    "signatures": [
        "202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8b37d3fb3"
    ],
}

PROTO_REF_TRANSACTION_EMPTY_OPERATIONS = {
    "ref_block_num": 19260,
    "ref_block_prefix": 2140466769,
    "expiration": "2016-09-15T19:47:33",
    "operations": []
}

PROTO_REF_TRANSACTION_NO_OPERATIONS = {
    "ref_block_num": 19260,
    "ref_block_prefix": 2140466769,
    "expiration": "2016-09-15T19:47:33"
}

API_REF_VOTE_OP = {
    "type": "vote_operation",
    "value": {
        "voter": "otom",
        "author": "c0ff33a",
        "permlink": "ewxhnjbj",
        "weight": 2200
    }
}

API_REF_VOTE_OP_EMPTY = {
    "type": "vote_operation",
    "value": {
    }
}

API_REF_TRANSACTION = {
    "ref_block_num": 19260,
    "ref_block_prefix": 2140466769,
    "expiration": "2016-09-15T19:47:33",
    "operations": [
        {
            "type": "vote_operation",
            "value": {
                "voter": "taoteh1221",
                "author": "ozchartart",
                "permlink": "usdsteem-btc-daily-poloniex-bittrex-technical-analysis-market-report-update-46-glass-half-full-but-the-bottle-s-left-empty-sept",
                "weight": 10000,
            },
        }
    ],
    "extensions": [{"type": "void_t", "value": {}}],
    "signatures": [
        "202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8b37d3fb3"
    ],
}

API_REF_TRANSACTION_EMPTY_OPERATIONS = {
    "ref_block_num": 19260,
    "ref_block_prefix": 2140466769,
    "expiration": "2016-09-15T19:47:33",
    "operations": []
}

API_REF_TRANSACTION_NO_OPERATIONS = {
    "ref_block_num": 19260,
    "ref_block_prefix": 2140466769,
    "expiration": "2016-09-15T19:47:33"
}

API_REF_BLOCK = {
    "block_id": "000f424ceba45f761f7af77e3769f29309064606",
    "extensions": [
        {
            "type": "version",
            "value": "1.27.4"
        }
    ],
    "previous": "000f424b4e3f3a6069ef7ff86e39ca43628208ad",
    "signing_key": "STM7xxob4v4X99qiBNpwpd6rTFqh2JpXER9DC4EYqr8rAH8J2QUMR",
    "timestamp": "2016-04-29T04:12:36",
    "transaction_ids": [
        "5ab7fb8138ef8f701661d68f7d654df5f8e2fcfc"
    ],
    "transaction_merkle_root": "b373963ebfd9e8016fb1bd40278e0f6b3db9d1dd",
    "transactions": [
        {
            "expiration": "2016-04-29T05:12:33",
            "extensions": [],
            "operations": [
                {
                    "type": "pow_operation",
                    "value": {
                        "block_id": "000f424b4e3f3a6069ef7ff86e39ca43628208ad",
                        "nonce": "7402656884829255743",
                        "props": {
                            "account_creation_fee": {
                                "amount": "1",
                                "nai": "@@000000021",
                                "precision": 3
                            },
                            "hbd_interest_rate": 1000,
                            "maximum_block_size": 131072
                        },
                        "work": {
                            "input": "62a5ccd974a8f3fb08c75aa8969a9fe518a3b25dbd1c45ffe519dd1b13da1564",
                            "signature": "2017904d537351ea950ec133f1b2c06c114d5250f798ab977e8e6357d1b759c8865db3827a0bf9dc5b05f108745575b28431f9ec97d4b69172cc1d21a886e35bd7",
                            "work": "00000009b8dae9e6e043afd09c3d7fade06e7a93ea059d3cc42aa651a336ee31",
                            "worker": "STM7D7oC3o7YYLoVVd47qXr3tMaABtGGsvWiraQQt2jtnX8gZAjdB"
                        },
                        "worker_account": "hr803"
                    }
                }
            ],
            "ref_block_num": 16971,
            "ref_block_prefix": 1614430030,
            "signatures": []
        }
    ],
    "witness": "bhuz",
    "witness_signature": "2032c88716d797ec86bd110d310bb4788665883f3b06dc47ac5eb56b8a0e7eb7b51bf00db0bd2a810d49fae23191bf3afff79a46784143e39d4d45028e58d16f98"
}

API_REF_BLOCK_EMPTY_TRANSACTIONS = {
    "block_id": "000f4240e8f91385f7bff8f5aeebddc9b14e4281",
    "extensions": [],
    "previous": "000f423f974857674873d93d1909e0eeb7e4916e",
    "signing_key": "STM67P2LhV4FCvk2y6sQjNTnp6b1MVTKnftw2mLE2Vxf89Vdn7xYG",
    "timestamp": "2016-04-29T04:12:00",
    "transaction_ids": [],
    "transaction_merkle_root": "0000000000000000000000000000000000000000",
    "transactions": [],
    "witness": "abit",
    "witness_signature": "1f72bd3f4b06e7dc6b156729f0fd7873163814972eecea9d77cb29bae11d0fea3865c814d11a58e818c2494ce19f4c3d4c3e17eab3b1465ebccb102c52c56472c0"
}

API_REF_BLOCK_NO_TRANSACTIONS = {
    "block_id": "000f4240e8f91385f7bff8f5aeebddc9b14e4281",
    "extensions": [],
    "previous": "000f423f974857674873d93d1909e0eeb7e4916e",
    "signing_key": "STM67P2LhV4FCvk2y6sQjNTnp6b1MVTKnftw2mLE2Vxf89Vdn7xYG",
    "timestamp": "2016-04-29T04:12:00",
    "transaction_ids": [],
    "transaction_merkle_root": "0000000000000000000000000000000000000000",
    "witness": "abit",
    "witness_signature": "1f72bd3f4b06e7dc6b156729f0fd7873163814972eecea9d77cb29bae11d0fea3865c814d11a58e818c2494ce19f4c3d4c3e17eab3b1465ebccb102c52c56472c0"
}
