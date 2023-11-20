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

# See Hive mainnet block 80021416, trx_id: 7f34699e9eea49d1bcc10c88f96e38897839ece3
PROTO_REF_SERIALIZATION_SENSITIVE_TRANSACTION = {
    "ref_block_num": 1959,
    "ref_block_prefix": 3625727107,
    "expiration": "2023-11-09T22:01:24",
    "operations": [
        {
            "transfer": {
                "from": "oneplus7",
                "to": "kryptogames",
                "amount": {
                    "amount": "300000",
                    "precision": 3,
                    "nai": "@@000000021"
                },
                "memo": "Roll under 50 4d434bd943616"
            }
        }
    ],
    "extensions": []
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

PROTO_REF_RELEASE_BLOCK = {
    "block_id": "000f424ceba45f761f7af77e3769f29309064606",
    "extensions": [ { "version": "1.27.4" } ],
    "previous": "000f424b4e3f3a6069ef7ff86e39ca43628208ad",
    "signing_key": "STM7xxob4v4X99qiBNpwpd6rTFqh2JpXER9DC4EYqr8rAH8J2QUMR",
    "timestamp": "2016-04-29T04:12:36",
    "transaction_ids": [ "5ab7fb8138ef8f701661d68f7d654df5f8e2fcfc" ],
    "transaction_merkle_root": "b373963ebfd9e8016fb1bd40278e0f6b3db9d1dd",
    "transactions": [
        {
            "expiration": "2016-04-29T05:12:33",
            "extensions": [],
            "operations": [
                {
                    "pow": {
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

PROTO_REF_HF_BLOCK = {
    "block_id": "018ca4f6465b584e528fa6f18465cc30d9d02dc2",
    "extensions": [
        { "version": "0.20.0" },
        {
            "hardfork_version_vote": {
                "hf_time": "2018-09-25T15:00:00",
                "hf_version": "0.20.0"
            }
        }
    ],
    "previous": "018ca4f536a6dff7701e10dbb659f406acd27f38",
    "signing_key": "STM7HrgGgxhCNbhjyJ8jbcwVdGx3ifMJkX3QVmGDPXyR5PNKmR94i",
    "timestamp": "2018-09-15T23:18:30",
    "transaction_ids": [ "9cba69c9cbe6ee3e0ba433cd8516e3e8f36dcaf3", "c1bca85930424a2f3c89567f42ad9a1ce4125107", "a0df47da3860cbd699702f21200bcad74650e06d", "a0ab6d002ee3ae31cec32cdf777a25db5c3ce484", "1e39d1496355a746c3fa74c675c6893d23e9361d", "0e7da2a92883e2b6c21a9037ebea4a3e246dac38", "aafa82526e0c4b83c1f3783913a5db9676e73860", "6ed0fce84ba4b478270fd0142291ed63359b1c14", "d62ad095ce1ce34de0f885e0a1d5a92f5f0bcaa0", "ef76243bcae5e82a0ae4025d9a0f9fe8be784f55", "3f97f5ce8f042fda20e0172c8640a358420201b3", "97ba4006f230c82f052bbe16a38195b324c36327", "8dd0e979c536ee5eac79165172503ec2ed57d192", "8e593a4ef831e2a804804f3ee0cffabd37ce7c60", "994d0a4939d43dd00759f110874362a788a97c75", "9f182b8c120a24b4642ded2dc16ac089baeaecf0", "dd48ca09f196529fa11ba250a7883fc5a3c218d7", "767f9d9e495acf0298e25f95b26354cca5657723", "a97ce292872f17ed9fb39b28fe503845f63621f2", "31055fd783e1e2a1b708690012d18ba8c4b0ec2c" ],
    "transaction_merkle_root": "549a1d5e48cbd55d4a0ee97dd996ea6b92b48ff9",
    "transactions": [
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:24",
            "operations": [
                {
                    "vote": {
                        "voter": "fallenangel1789",
                        "author": "mrpro81",
                        "permlink": "kripto-ile-mikro-kazanc-elde-etmek",
                        "weight": 10000
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f26c2554853ae6c4fed36b37f7159b9e0e9a3a534706d87d667db4c4c95f642521921d6688923ce9551cebb2a5ecbd942ae456e4850a799b2799943e73dde2228" ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:24",
            "operations": [
                {
                    "custom_json": {
                        "required_auths": [],
                        "required_posting_auths": [ "vafa" ],
                        "id": "follow",
                        "json": "[follow\",{\"follower\":\"vafa\",\"following\":\"quantumobstruct\",\"what\":[]}]\""
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "204d7fa577d0e55274f50ddc6581a181cc05cc161ff3fcdb82d3b0f03c87314a537cc47ca1946d505a9edcafe3a9d979c92fbb87f7e6b66f144905fe274b1fa3ee" ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:27",
            "operations": [
                {
                    "vote": {
                        "voter": "carolynseymour",
                        "author": "krasnec",
                        "permlink": "7g8xsa-new-strange-garden-painting",
                        "weight": 500
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f4b46ab43d46d53c2607f074ad9b93c39dff43e9e735237abaf52fb1228d4ba4b3ceb6c7a8880da982e3fea54a095946a970c9c919a0ab44693dc2df458cac8b2" ],
        },
        {
            "ref_block_num": 42204,
            "ref_block_prefix": 107415962,
            "expiration": "2018-09-15T23:28:18",
            "operations": [
                {
                    "custom_json": {
                        "required_auths": [],
                        "required_posting_auths": [ "shila" ],
                        "id": "follow",
                        "json": "[follow\",{\"follower\":\"shila\",\"following\":\"benfreed\",\"what\":[\"blog\"]}]\""
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "203783dea5ecb7c1a0fa0ab476889d0c6ff4998d24638f952b8f5045482ae4c07817d7810744dddc30f934284834715c30bd61c3843b01cd0700e07069f7c5283e" ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:27",
            "operations": [
                {
                    "vote": {
                        "voter": "zulfan88",
                        "author": "krasnec",
                        "permlink": "7g8xsa-new-strange-garden-painting",
                        "weight": 1000
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "2051f48b740abcf09dd2b93eb27befac9e0580f84e26e774315e3c1507b3276d0b604e5dd3da87b60b6c2b9dce1877659728e54bc61d9c1af5a50231039f4f91c8" ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:24",
            "operations": [
                {
                    "vote": {
                        "voter": "miqyk",
                        "author": "cryptoworldzug",
                        "permlink": "bigthingsgoingonwithcwz-89eamqxic4",
                        "weight": 10000
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f07b8d9441869f6430c553e926edd1fbc55e567aa651eb8ce6ef6c571a202602d5c3231dfa0a471c68a2b5c4cf0325fe15e8ef25ca8d492da73a329b438d41723" ],
        },
        {
            "ref_block_num": 42206,
            "ref_block_prefix": 3666543155,
            "expiration": "2018-09-15T23:28:21",
            "operations": [
                {
                    "vote": {
                        "voter": "sthitaprajna",
                        "author": "creadordelfuturo",
                        "permlink": "winners-of-lottery-for-the-jury-of-the-best-title-contest-something-unthinkable-happened",
                        "weight": 10000
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f55ceb63354c6b5e50deb1c5218a040f7b135060593192a9c0c4b1ba4e60908d1634673721d5cd3b3141e932ec2eb6cb878c28b73917212ff317f05f9e77d2583" ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:24",
            "operations": [
                {
                    "custom_json": {
                        "required_auths": [],
                        "required_posting_auths": [ "vodavic" ],
                        "id": "follow",
                        "json": "[follow\",{\"follower\":\"vodavic\",\"following\":\"xsonicxpt\",\"what\":[]}]\""
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "2048ea21cd6d09455cc00d55f531b9d4d6cbfeae602e5cdf7af21c85377718258114c6e3759fa0a69d25a49570384dad208c321bcca1590eff4a02ed95e17d625b" ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:27",
            "operations": [
                {
                    "custom_json": {
                        "required_auths": [],
                        "required_posting_auths": [ "eddee" ],
                        "id": "follow",
                        "json": "[follow\",{\"follower\":\"eddee\",\"following\":\"kabir88\",\"what\":[]}]\""
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f3ba3e48b2f05a523614b80947fd0369df2705a73ca540953b9ae35247b984e5e2a68c6a98cb95602089476c3027a96581b12214f36464eeec9096fbd147f3f17" ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:24",
            "operations": [
                {
                    "custom_json": {
                        "required_auths": [],
                        "required_posting_auths": [ "madava" ],
                        "id": "follow",
                        "json": "[follow\",{\"follower\":\"madava\",\"following\":\"xeline\",\"what\":[]}]\""
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f0fa524a7232c11ecddbaeccd4b1c0336af6bda9b336b1155460b22653d470923338055791d9227f96595f18c35b2e006d3a235cecc5a627437b9054361b6aca7" ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:27",
            "operations": [
                {
                    "custom_json": {
                        "required_auths": [],
                        "required_posting_auths": [ "cryptolists" ],
                        "id": "follow",
                        "json": "[follow\",{\"follower\":\"cryptolists\",\"following\":\"eosunion\",\"what\":[\"blog\"]}]\""
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "2008795dc28ba4b98f09b8f4eea096c6e56c6511c762ab6d8f6fb9956a09e4c01c3f27226a6ca38ad4b53e36dbdf0e15afcfb463f407233d13d275cecc082855dc" ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:28",
            "operations": [
                {
                    "vote": {
                        "voter": "kendallron",
                        "author": "krasnec",
                        "permlink": "7g8xsa-new-strange-garden-painting",
                        "weight": 1000
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f398cf24fd4fed541291f13f11fa7371efec5f68be5ced3b892c2989f99b0606367c84091c30b8bd9a811b4c797cd52d2c3eb1c5696afe966ce68df835e337165" ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:28",
            "operations": [
                {
                    "vote": {
                        "voter": "yoonwonlim",
                        "author": "kamo.munshi",
                        "permlink": "20180915t165140903z",
                        "weight": 10000
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f74778260afba9111f5b62283cdc00cfdf620c946eb06c67cedd105bfde0e88460bf66801f2f25c299bbc72fa086f4a58cd383465b690eda8066fbb393d54fb02" ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:27",
            "operations": [
                {
                    "vote": {
                        "voter": "guru2",
                        "author": "renzoarg",
                        "permlink": "scream-into-the-void-space-communications",
                        "weight": 10000
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "20168f6dc7e18a1d318e71fd10ba50b590e27ecafb931f632959f29073ee6b728d4819fbf67c8bbbb3c79a9a70f5f804d07054d587a3254e06933e7b79ae925599" ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:27",
            "operations": [
                {
                    "custom_json": {
                        "required_auths": [],
                        "required_posting_auths": [ "livo" ],
                        "id": "follow",
                        "json": "[follow\",{\"follower\":\"livo\",\"following\":\"ldacey-laforge\",\"what\":[]}]\""
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f7bbf6835df84b9f4995fe4aef482dc51ede15ba0ef52a8b186ac3652f6ada7ea2751b0d99c83494fcda3faf548be000c222aadee905a422a7583d4448b309bfd" ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:24",
            "operations": [
                {
                    "custom_json": {
                        "required_auths": [],
                        "required_posting_auths": [ "manudibango" ],
                        "id": "follow",
                        "json": "[follow\",{\"follower\":\"manudibango\",\"following\":\"originalworks\",\"what\":[\"blog\"]}]\""
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "202c00153c21d096c2ca8f65f0858b48359a065281befae54004b086cb2bcbfbe1690ac85af7821199aa7acf8c739a511491dfb7f382cdab0795bbb6f9c05f3c27" ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:28",
            "operations": [
                {
                    "vote": {
                        "voter": "futbolsport",
                        "author": "rayhankabirs",
                        "permlink": "apple-teased-by-xiaomi-for-over-the-top-pricing-of-iphones",
                        "weight": 10000
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f7a153e4729dd3b9666722908ebb716e8a7805af3aeba8439f2c6689b1d21b36e4631204eb754d1d8babee6bd74e04648585f0596355b4c0576a6cf2d5f3cde98" ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:27",
            "operations": [
                {
                    "custom_json": {
                        "required_auths": [],
                        "required_posting_auths": [ "masiha" ],
                        "id": "follow",
                        "json": "[follow\",{\"follower\":\"masiha\",\"following\":\"oyakhs4u\",\"what\":[]}]\""
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f74177e67a47b97ba905851d637038eb270604307a3998caa32966f285c301cc25a16638885398852be7ad770c36a66255c3fcc02a1009124d9e889662cff167e" ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:28",
            "operations": [
                {
                    "transfer": {
                        "from": "buildawhale",
                        "to": "just-smile",
                        "amount": {
                            "nai": "@@000000021",
                            "precision": 3,
                            "amount": "357000"
                        },
                        "memo": "Thank you for using buildawhale - If you want to support our daily Curation Digest and anti-spam efforts please vote_operation @themarkymark as witness"
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f4e3c1d7b44d7863a76a9eb652ee2b66c2ebeeb2e8a090b6850c0fc12d5b4363c7b4c1620136de221312bf8d36cbe29a4a1649c85ae0d2defb6c039df76da16f2" ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:28",
            "operations": [
                {
                    "vote": {
                        "voter": "penghuren",
                        "author": "thetruth36",
                        "permlink": "re-infinity28-re-thetruth36-hawaii-oahu-paradise-cove-though-the-blockchain-pt-1-20180915t230606269z",
                        "weight": 7500
                    }
                }
            ],
            "extensions": [],
            "signatures": [ "1f0192f7d801078f4e66acf95c4c92f7bb5cc12287f7b9d88dd9fd8f4c0bde89831a970b72d97ec4a8919a57abc75954e667c1baca5aa44d9339178efb916ce757" ],
        }
    ],
    "witness": "c0ff33a",
    "witness_signature": "206755695d45d061b3135be8e9a6a889de8b941907a04c255f82f45b3f9ec9a2f92595a696408d51d39def6f0fa7300fc26db1651a728034924fe652d89c2ffdf3"
}

PROTO_REF_BLOCK_EMPTY_TRANSACTION = {
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

# See Hive mainnet block 80021416, trx_id: 7f34699e9eea49d1bcc10c88f96e38897839ece3
API_REF_SERIALIZATION_SENSITIVE_TRANSACTION = {
    "ref_block_num": 1959,
    "ref_block_prefix": 3625727107,
    "expiration": "2023-11-09T22:01:24",
    "operations": [
      {
        "type": "transfer_operation",
        "value": {
          "from": "oneplus7",
          "to": "kryptogames",
          "amount": {
            "amount": "300000",
            "precision": 3,
            "nai": "@@000000021"
          },
          "memo": "Roll under 50 4d434bd943616"
        }
      }
    ],
    "extensions": []
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

API_REF_RELEASE_BLOCK = {
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

API_REF_HF_BLOCK = {
    "block_id": "018ca4f6465b584e528fa6f18465cc30d9d02dc2",
    "extensions": [
        {
            "type": "version",
            "value": "0.20.0"
        },
        {
            "type": "hardfork_version_vote",
            "value": {
                "hf_time": "2018-09-25T15:00:00",
                "hf_version": "0.20.0"
            }
        }
    ],
    "previous": "018ca4f536a6dff7701e10dbb659f406acd27f38",
    "signing_key": "STM7HrgGgxhCNbhjyJ8jbcwVdGx3ifMJkX3QVmGDPXyR5PNKmR94i",
    "timestamp": "2018-09-15T23:18:30",
    "transaction_ids": [
        "9cba69c9cbe6ee3e0ba433cd8516e3e8f36dcaf3",
        "c1bca85930424a2f3c89567f42ad9a1ce4125107",
        "a0df47da3860cbd699702f21200bcad74650e06d",
        "a0ab6d002ee3ae31cec32cdf777a25db5c3ce484",
        "1e39d1496355a746c3fa74c675c6893d23e9361d",
        "0e7da2a92883e2b6c21a9037ebea4a3e246dac38",
        "aafa82526e0c4b83c1f3783913a5db9676e73860",
        "6ed0fce84ba4b478270fd0142291ed63359b1c14",
        "d62ad095ce1ce34de0f885e0a1d5a92f5f0bcaa0",
        "ef76243bcae5e82a0ae4025d9a0f9fe8be784f55",
        "3f97f5ce8f042fda20e0172c8640a358420201b3",
        "97ba4006f230c82f052bbe16a38195b324c36327",
        "8dd0e979c536ee5eac79165172503ec2ed57d192",
        "8e593a4ef831e2a804804f3ee0cffabd37ce7c60",
        "994d0a4939d43dd00759f110874362a788a97c75",
        "9f182b8c120a24b4642ded2dc16ac089baeaecf0",
        "dd48ca09f196529fa11ba250a7883fc5a3c218d7",
        "767f9d9e495acf0298e25f95b26354cca5657723",
        "a97ce292872f17ed9fb39b28fe503845f63621f2",
        "31055fd783e1e2a1b708690012d18ba8c4b0ec2c"
    ],
    "transaction_merkle_root": "549a1d5e48cbd55d4a0ee97dd996ea6b92b48ff9",
    "transactions": [
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:24",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {
                        "voter": "fallenangel1789",
                        "author": "mrpro81",
                        "permlink": "kripto-ile-mikro-kazanc-elde-etmek",
                        "weight": 10000
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f26c2554853ae6c4fed36b37f7159b9e0e9a3a534706d87d667db4c4c95f642521921d6688923ce9551cebb2a5ecbd942ae456e4850a799b2799943e73dde2228"
            ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:24",
            "operations": [
                {
                    "type": "custom_json_operation",
                    "value": {
                        "required_auths": [
                        ],
                        "required_posting_auths": [
                            "vafa"
                        ],
                        "id": "follow",
                        "json": "["
                        "follow\",{\"follower\":\"vafa\",\"following\":\"quantumobstruct\",\"what\":[]}]\"",
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "204d7fa577d0e55274f50ddc6581a181cc05cc161ff3fcdb82d3b0f03c87314a537cc47ca1946d505a9edcafe3a9d979c92fbb87f7e6b66f144905fe274b1fa3ee"
            ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:27",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {
                        "voter": "carolynseymour",
                        "author": "krasnec",
                        "permlink": "7g8xsa-new-strange-garden-painting",
                        "weight": 500
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f4b46ab43d46d53c2607f074ad9b93c39dff43e9e735237abaf52fb1228d4ba4b3ceb6c7a8880da982e3fea54a095946a970c9c919a0ab44693dc2df458cac8b2"
            ],
        },
        {
            "ref_block_num": 42204,
            "ref_block_prefix": 107415962,
            "expiration": "2018-09-15T23:28:18",
            "operations": [
                {
                    "type": "custom_json_operation",
                    "value": {
                        "required_auths": [
                        ],
                        "required_posting_auths": [
                            "shila"
                        ],
                        "id": "follow",
                        "json": "["
                        "follow\",{\"follower\":\"shila\",\"following\":\"benfreed\",\"what\":[\"blog\"]}]\"",
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "203783dea5ecb7c1a0fa0ab476889d0c6ff4998d24638f952b8f5045482ae4c07817d7810744dddc30f934284834715c30bd61c3843b01cd0700e07069f7c5283e"
            ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:27",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {
                        "voter": "zulfan88",
                        "author": "krasnec",
                        "permlink": "7g8xsa-new-strange-garden-painting",
                        "weight": 1000
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "2051f48b740abcf09dd2b93eb27befac9e0580f84e26e774315e3c1507b3276d0b604e5dd3da87b60b6c2b9dce1877659728e54bc61d9c1af5a50231039f4f91c8"
            ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:24",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {
                        "voter": "miqyk",
                        "author": "cryptoworldzug",
                        "permlink": "bigthingsgoingonwithcwz-89eamqxic4",
                        "weight": 10000
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f07b8d9441869f6430c553e926edd1fbc55e567aa651eb8ce6ef6c571a202602d5c3231dfa0a471c68a2b5c4cf0325fe15e8ef25ca8d492da73a329b438d41723"
            ],
        },
        {
            "ref_block_num": 42206,
            "ref_block_prefix": 3666543155,
            "expiration": "2018-09-15T23:28:21",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {
                        "voter": "sthitaprajna",
                        "author": "creadordelfuturo",
                        "permlink": "winners-of-lottery-for-the-jury-of-the-best-title-contest-something-unthinkable-happened",
                        "weight": 10000
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f55ceb63354c6b5e50deb1c5218a040f7b135060593192a9c0c4b1ba4e60908d1634673721d5cd3b3141e932ec2eb6cb878c28b73917212ff317f05f9e77d2583"
            ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:24",
            "operations": [
                {
                    "type": "custom_json_operation",
                    "value": {
                        "required_auths": [
                        ],
                        "required_posting_auths": [
                            "vodavic"
                        ],
                        "id": "follow",
                        "json": "["
                        "follow\",{\"follower\":\"vodavic\",\"following\":\"xsonicxpt\",\"what\":[]}]\"",
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "2048ea21cd6d09455cc00d55f531b9d4d6cbfeae602e5cdf7af21c85377718258114c6e3759fa0a69d25a49570384dad208c321bcca1590eff4a02ed95e17d625b"
            ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:27",
            "operations": [
                {
                    "type": "custom_json_operation",
                    "value": {
                        "required_auths": [
                        ],
                        "required_posting_auths": [
                            "eddee"
                        ],
                        "id": "follow",
                        "json": "["
                        "follow\",{\"follower\":\"eddee\",\"following\":\"kabir88\",\"what\":[]}]\"",
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f3ba3e48b2f05a523614b80947fd0369df2705a73ca540953b9ae35247b984e5e2a68c6a98cb95602089476c3027a96581b12214f36464eeec9096fbd147f3f17"
            ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:24",
            "operations": [
                {
                    "type": "custom_json_operation",
                    "value": {
                        "required_auths": [
                        ],
                        "required_posting_auths": [
                            "madava"
                        ],
                        "id": "follow",
                        "json": "["
                        "follow\",{\"follower\":\"madava\",\"following\":\"xeline\",\"what\":[]}]\"",
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f0fa524a7232c11ecddbaeccd4b1c0336af6bda9b336b1155460b22653d470923338055791d9227f96595f18c35b2e006d3a235cecc5a627437b9054361b6aca7"
            ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:27",
            "operations": [
                {
                    "type": "custom_json_operation",
                    "value": {
                        "required_auths": [
                        ],
                        "required_posting_auths": [
                            "cryptolists"
                        ],
                        "id": "follow",
                        "json": "["
                        "follow\",{\"follower\":\"cryptolists\",\"following\":\"eosunion\",\"what\":[\"blog\"]}]\"",
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "2008795dc28ba4b98f09b8f4eea096c6e56c6511c762ab6d8f6fb9956a09e4c01c3f27226a6ca38ad4b53e36dbdf0e15afcfb463f407233d13d275cecc082855dc"
            ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:28",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {
                        "voter": "kendallron",
                        "author": "krasnec",
                        "permlink": "7g8xsa-new-strange-garden-painting",
                        "weight": 1000
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f398cf24fd4fed541291f13f11fa7371efec5f68be5ced3b892c2989f99b0606367c84091c30b8bd9a811b4c797cd52d2c3eb1c5696afe966ce68df835e337165"
            ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:28",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {
                        "voter": "yoonwonlim",
                        "author": "kamo.munshi",
                        "permlink": "20180915t165140903z",
                        "weight": 10000
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f74778260afba9111f5b62283cdc00cfdf620c946eb06c67cedd105bfde0e88460bf66801f2f25c299bbc72fa086f4a58cd383465b690eda8066fbb393d54fb02"
            ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:27",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {
                        "voter": "guru2",
                        "author": "renzoarg",
                        "permlink": "scream-into-the-void-space-communications",
                        "weight": 10000
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "20168f6dc7e18a1d318e71fd10ba50b590e27ecafb931f632959f29073ee6b728d4819fbf67c8bbbb3c79a9a70f5f804d07054d587a3254e06933e7b79ae925599"
            ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:27",
            "operations": [
                {
                    "type": "custom_json_operation",
                    "value": {
                        "required_auths": [
                        ],
                        "required_posting_auths": [
                            "livo"
                        ],
                        "id": "follow",
                        "json": "["
                        "follow\",{\"follower\":\"livo\",\"following\":\"ldacey-laforge\",\"what\":[]}]\"",
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f7bbf6835df84b9f4995fe4aef482dc51ede15ba0ef52a8b186ac3652f6ada7ea2751b0d99c83494fcda3faf548be000c222aadee905a422a7583d4448b309bfd"
            ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:24",
            "operations": [
                {
                    "type": "custom_json_operation",
                    "value": {
                        "required_auths": [
                        ],
                        "required_posting_auths": [
                            "manudibango"
                        ],
                        "id": "follow",
                        "json": "["
                        "follow\",{\"follower\":\"manudibango\",\"following\":\"originalworks\",\"what\":[\"blog\"]}]\"",
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "202c00153c21d096c2ca8f65f0858b48359a065281befae54004b086cb2bcbfbe1690ac85af7821199aa7acf8c739a511491dfb7f382cdab0795bbb6f9c05f3c27"
            ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:28",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {
                        "voter": "futbolsport",
                        "author": "rayhankabirs",
                        "permlink": "apple-teased-by-xiaomi-for-over-the-top-pricing-of-iphones",
                        "weight": 10000
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f7a153e4729dd3b9666722908ebb716e8a7805af3aeba8439f2c6689b1d21b36e4631204eb754d1d8babee6bd74e04648585f0596355b4c0576a6cf2d5f3cde98"
            ],
        },
        {
            "ref_block_num": 42209,
            "ref_block_prefix": 312307961,
            "expiration": "2018-09-15T23:28:27",
            "operations": [
                {
                    "type": "custom_json_operation",
                    "value": {
                        "required_auths": [
                        ],
                        "required_posting_auths": [
                            "masiha"
                        ],
                        "id": "follow",
                        "json": "["
                        "follow\",{\"follower\":\"masiha\",\"following\":\"oyakhs4u\",\"what\":[]}]\"",
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f74177e67a47b97ba905851d637038eb270604307a3998caa32966f285c301cc25a16638885398852be7ad770c36a66255c3fcc02a1009124d9e889662cff167e"
            ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:28",
            "operations": [
                {
                    "type": "transfer_operation",
                    "value": {
                        "from": "buildawhale",
                        "to": "just-smile",
                        "amount": {
                            "nai": "@@000000021",
                            "precision": 3,
                            "amount": "357000"
                        },
                        "memo": "Thank you for using buildawhale - If you want to support our daily Curation Digest and anti-spam efforts please vote_operation @themarkymark as witness"
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f4e3c1d7b44d7863a76a9eb652ee2b66c2ebeeb2e8a090b6850c0fc12d5b4363c7b4c1620136de221312bf8d36cbe29a4a1649c85ae0d2defb6c039df76da16f2"
            ],
        },
        {
            "ref_block_num": 42229,
            "ref_block_prefix": 4158629430,
            "expiration": "2018-09-15T23:19:28",
            "operations": [
                {
                    "type": "vote_operation",
                    "value": {
                        "voter": "penghuren",
                        "author": "thetruth36",
                        "permlink": "re-infinity28-re-thetruth36-hawaii-oahu-paradise-cove-though-the-blockchain-pt-1-20180915t230606269z",
                        "weight": 7500
                    }
                }
            ],
            "extensions": [
            ],
            "signatures": [
                "1f0192f7d801078f4e66acf95c4c92f7bb5cc12287f7b9d88dd9fd8f4c0bde89831a970b72d97ec4a8919a57abc75954e667c1baca5aa44d9339178efb916ce757"
            ],
        }
    ],
    "witness": "c0ff33a",
    "witness_signature": "206755695d45d061b3135be8e9a6a889de8b941907a04c255f82f45b3f9ec9a2f92595a696408d51d39def6f0fa7300fc26db1651a728034924fe652d89c2ffdf3"
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
