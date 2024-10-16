from typing import Any

from wax import python_authority, python_authorities


MAINNET_CHAIN_ID = b"beeab0de00000000000000000000000000000000000000000000000000000000"

TREASURY_NAME = b"hive.fund"

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

API_LEGACY_REF_SERIALIZATION_SENSITIVE_TRANSACTION = {
    "ref_block_num": 1959,
    "ref_block_prefix": 3625727107,
    "expiration": "2023-11-09T22:01:24",
    "operations": [
      [
        "transfer",
        {
          "from": "oneplus7",
          "to": "kryptogames",
          "amount": "300.000 HIVE",
          "memo": "Roll under 50 4d434bd943616"
        }
      ]
    ],
    "extensions": [],
    "signatures": []
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

API_TRX_SIG1 = {
    "ref_block_num": 48545,
    "ref_block_prefix": 3455189990,
    "extensions": [],
    "expiration": "2024-08-06T10:44:15",
    "operations": [
        {
            "type": "custom_json_operation",
            "value": {
                "id": "spkcc_report",
                "json": '{"hash":"QmaCuYgBnF5zEest8fyZ3KkbhQwsUCnX7AnC45qyyFaSSE","block":87801201,"version":"v1.1.8"}',
                "required_auths": ["brofund-witness"],
                "required_posting_auths": [],
            },
        }
    ],
    "signatures": [
        "205accd7c54999ebccccb719d61af484931a97c862912e5bf8dfa0193f6d8a33fc35971fafc4a58fbdfb7df1dab1d20304867660f3c432584471cd4336f96052b7"
    ],
}

API_TRX_SIG1_AUTHORITIES = {
    "account_name": "brofund-witness",
    "authorities": {
        "owner": {
            "key_auths": [["STM79McmNPY35nkuk37crGF6irhz5CkrBgDvnH68Zav7sYkrz79ce", 1]],
            "account_auths": [],
            "weight_threshold": 1,
        },
        "active": {
            "key_auths": [["STM5zw6KDtQiiJMhkdkFm8CXxPUEa2QyitHBhkCE1iMJEGmEfd5aE", 1]],
            "account_auths": [],
            "weight_threshold": 1,
        },
        "posting": {
            "key_auths": [["STM8AaJXJfZ6gdSLKcVgMcNU6oEkuL7hcYxrqrUjN3Kwd2eHvXp4v", 1]],
            "account_auths": [["steemauto", 1], ["ecency.app", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM6wUkXGebWb9qaHEc59CPARQmzZmwQNedZ3ukb53wGLBsehrZ2g",
        "witness_signing": "",
    },
}

API_TRX_SIG5_v0 = {
    "ref_block_num": 808,
    "ref_block_prefix": 1359279161,
    "extensions": [],
    "expiration": "2024-08-02T12:09:03",
    "operations": [
        {
            "type": "vote_operation",
            "value": {
                "voter": "ecency",
                "author": "el-panal",
                "weight": 100,
                "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            },
        },
        {
            "type": "vote_operation",
            "value": {
                "voter": "ecency.stats",
                "author": "el-panal",
                "weight": 100,
                "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            },
        },
        {
            "type": "vote_operation",
            "value": {
                "voter": "esteem.app",
                "author": "el-panal",
                "weight": 100,
                "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            },
        },
        {
            "type": "vote_operation",
            "value": {
                "voter": "good-karma",
                "author": "el-panal",
                "weight": 100,
                "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            },
        },
        {
            "type": "vote_operation",
            "value": {
                "voter": "esteemapp",
                "author": "el-panal",
                "weight": 100,
                "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            },
        },
    ],
    "signatures": [
        "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
        "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
        "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
        "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
        "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5",
    ],
}

API_TRX_SIG5_AUTHORITIES_0 = {
    "account_name": "esteem.app",
    "authorities": {
        "owner": {
            "account_auths": [],
            "key_auths": [["STM6zXVBarPvth5XjcVmcyAiGEndvyiQAokVJHSsPGKWaoSqwHk5K", 1]],
            "weight_threshold": 1,
        },
        "active": {
            "account_auths": [],
            "key_auths": [["STM5XKXqoieAtbq8isuXty8SrysvsXfehJGZeLBQ6STEAsP4gHUBV", 1]],
            "weight_threshold": 1,
        },
        "posting": {
            "account_auths": [["ecency.app", 1]],
            "key_auths": [["STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM7rYhpTmVrhBmLcEaoxWvVk5M3FrN4xtapk1utikFD8hhrNmzAf",
    },
}

API_TRX_SIG5_AUTHORITIES_1 = {
    "account_name": "ecency",
    "authorities": {
        "owner": {
            "account_auths": [],
            "key_auths": [["STM4yhxC7Bum8St36z3nZmj9VA59EXM7DXReMLMRn8fwrazgNbKYQ", 1]],
            "weight_threshold": 1,
        },
        "active": {
            "account_auths": [],
            "key_auths": [["STM51ApnQm3HNieuy3ZUQNtXbdu8CzEFEWRPqMLY1422i8Gy7g2PJ", 1]],
            "weight_threshold": 1,
        },
        "posting": {
            "account_auths": [["ecency.app", 1]],
            "key_auths": [["STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM5vCxUjSAZAgKBornswBuzXgAZasbE3EkPHpLmDEVHmPVGMnnah",
    },
}

API_TRX_SIG5_AUTHORITIES_2 = {
    "account_name": "ecency.stats",
    "authorities": {
        "owner": {
            "account_auths": [],
            "key_auths": [["STM8h5aXWY4xxVZfUCT3Bp3un6G4aAu2aRseJ4U2QXEb6HmLzo98n", 1]],
            "weight_threshold": 1,
        },
        "active": {
            "account_auths": [],
            "key_auths": [["STM6yT137LvnvqENnQj1mZx62SGxA5gpXUpMo2yAmCBXNfjnH3RjZ", 1]],
            "weight_threshold": 1,
        },
        "posting": {
            "account_auths": [["demo", 1], ["ecency.app", 1]],
            "key_auths": [["STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM73YE8rEQoDh6Y6EvrX2tXmmzhEnoTTwrL5jh3Wet3iMxKBJJty",
    },
}

API_TRX_SIG5_AUTHORITIES_3 = {
    "account_name": "good-karma",
    "authorities": {
        "owner": {
            "account_auths": [],
            "key_auths": [["STM7Wv1ZehXeLJbUbauam6h3khcnMXD9BLmuMBoD1v8jxh8Qm6Wgt", 1]],
            "weight_threshold": 1,
        },
        "active": {
            "account_auths": [],
            "key_auths": [["STM6FgbXf53uLD7m2skkzWR6Y4VU5zYwDqC476W2vva1aVognPnT2", 1]],
            "weight_threshold": 1,
        },
        "posting": {
            "account_auths": [["ecency.app", 1], ["peakd.app", 1]],
            "key_auths": [["STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM8mZcbokoRM8LvRk1CGibFyfuTXp77w72ktgJrZNsjKYmoF3gTx",
    },
}

API_TRX_SIG5_AUTHORITIES_4 = {
    "account_name": "esteemapp",
    "authorities": {
        "owner": {
            "account_auths": [],
            "key_auths": [["STM6drpX8y9nRyMykbonvXXkFbtESvWKG35NrNhoQ97uRhRQxbUhg", 1]],
            "weight_threshold": 1,
        },
        "active": {
            "account_auths": [],
            "key_auths": [["STM8eKCcDrQhmqmHjA2ifrtVUs5U7KXqXScnh4dwGzk6rhyRt2DtB", 1]],
            "weight_threshold": 1,
        },
        "posting": {
            "account_auths": [
                ["ecency.app", 1],
                ["hivesigner", 1],
                ["peakd.app", 1],
                ["steemconnect", 1],
            ],
            "key_auths": [["STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM6W6WwFy5P8putgwPppiyG1ySM65wvSQSPKErkDCNG9sTSevhjf",
    },
}

API_TRX_SIG5_AUTHORITIES_5 = {
    "account_name": "demo",
    "authorities": {
        "owner": {
            "account_auths": [],
            "key_auths": [["STM7N79vVmojHW4ZkCTytB753Eg938R3f8GA3M2ra7dd7TsTQKSCb", 1]],
            "weight_threshold": 1,
        },
        "active": {
            "account_auths": [],
            "key_auths": [
                ["STM5YR5MnAkAP4iKRWuzPv9Z33sdqDvyWHtknDse3c94M2krs9CDd", 1],
                ["STM5YRGgcSyWr9PWgPfMucw8sAaryQ71vaHwv1SNsSETcf5jQZj36", 1],
                ["STM5Z5Dmqt5hyidjhQYZkaoze3AW1BGm9LXVHL8oLt8gMTPhyZQm2", 1],
                ["STM5auKGdpPM5bJuQeeayASWn4yCifgrSWgn4K3tH5f123N7M41gB", 1],
                ["STM64nx2weChqikvdeYMzaR3hdVNrgvDtJyjNCAL4N8jQLC9kTmTX", 1],
                ["STM77EkCQWHwVfCESvhevCzw3TWgVLexwr2f4pxmY1oZtMnz7gsEJ", 1],
                ["STM7Vo1uyWAoyWKM7A7ExHEkfFCnq8ZRGyrZwZGpuJESCQ79cJ5cc", 1],
                ["STM7bvNHzp4nMNmVysBbicDtogYg7TyWrPxnXw9aegCzNgELsNvM4", 1],
                ["STM7nWjvRqLrdKKuqYZ2kL75TPMePNFc4dQpq6cHUkPJzmz5shP35", 1],
                ["STM7nnkD6ZdoMHKta3rA9XVeeqQ3wy41Kmv3J8JWc5hx5oHbZXEK5", 1],
                ["STM7sxc377Hac7vfVAT6xusAjVTMSHR4qSNy41CvZoJjnMLTePzK2", 1],
                ["STM8PcNaC4Zk5yKXYiUjikj4P3hadU7H6WBCKtqPQzkhMiK3YBr5t", 1],
                ["STM8fFik5Q7D8u9cD1WZW9pXGbqATxcyZT1SPaS21NCjqEar7zibD", 1],
            ],
            "weight_threshold": 1,
        },
        "posting": {
            "account_auths": [
                ["demo-app", 1],
                ["ecency.app", 1],
                ["hivesigner", 1],
                ["leofinance", 1],
            ],
            "key_auths": [["STM62fkRnTJSeJoWMLS5r61cgQbxSo3JJ7BoxCgZrkfRuNN71hA1A", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM5PV4XZSdKe9JdPXm7nxn3AtZPSzsrcD8hxFqueokxpqXbKxEs7",
    },
}

API_TRX_SIG5_AUTHORITIES_6 = {
    "account_name": "ecency.app",
    "authorities": {
        "owner": {
            "account_auths": [],
            "key_auths": [["STM6DFboChKgXFzkvEh18u2iXL7Q5N7ExNjqfPnuJ518uyRKWrsmJ", 1]],
            "weight_threshold": 1,
        },
        "active": {
            "account_auths": [],
            "key_auths": [["STM78Cf8BNZ6HmmeskFwGPfcjKzYhQHZD1bAiYHbmGFGQRJjQHuny", 1]],
            "weight_threshold": 1,
        },
        "posting": {
            "account_auths": [["hivesigner", 1]],
            "key_auths": [["STM7KDcjUNMqUdohFu9iYjCAqYEyXfM7pjNLx96GhRNpdYscB3aQc", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM8fACNECP4r4BvfMBJ8n8ScZ4sgEMRraNBVosuibPR1vbs25pAa",
    },
}

API_TRX_SIG5_AUTHORITIES_7 = {
    "account_name": "hivesigner",
    "authorities": {
        "owner": {
            "account_auths": [],
            "key_auths": [["STM7peJ4EfsE4yBrTcRqPwcrzuFyhHEZkHyaJMX7nscW78cEB1YjD", 1]],
            "weight_threshold": 1,
        },
        "active": {
            "account_auths": [],
            "key_auths": [["STM6DkcEaV3Jjo4owZEcK94kwc6hHhLAkLvxf9gsGUs6Fh6oG66tA", 1]],
            "weight_threshold": 1,
        },
        "posting": {
            "account_auths": [],
            "key_auths": [["STM574A9CiTg3EkcsZ7VfXin8tVtFVWqGq5x2wrfoqv5yMfxvx96d", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM5gPXMTMA8MPQBTUccSiTVBxgqKAijS4FQLkS6bZb3mN92ac6Xr",
    },
}

API_TRX_SIG5_AUTHORITIES_8 = {
    "account_name": "peakd.app",
    "authorities": {
        "owner": {
            "account_auths": [],
            "key_auths": [["STM6UYws2MJVPp32z1DhdwakP9Bhh9rfHeYq8zLPpcmJKafWKMHfU", 1]],
            "weight_threshold": 1,
        },
        "active": {
            "account_auths": [],
            "key_auths": [["STM6XFJgZM4Nfau2fVyVcQrVJJbqvvnD3RV2gRrPTiTaMVq5a1LcN", 1]],
            "weight_threshold": 1,
        },
        "posting": {
            "account_auths": [["hivesigner", 1]],
            "key_auths": [["STM64peLPcuSsUk591okRGUwv5rsTadSnnqi9ddMZhrVkxkDaSUzo", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM5YNzowSc6EwLjBhpHMN7iutMa5VAUjcRPcxifJW6N3udWWXVSP",
    },
}

API_TRX_SIG5_AUTHORITIES_9 = {
    "account_name": "steemconnect",
    "authorities": {
        "owner": {
            "account_auths": [],
            "key_auths": [["STM5HNbqoTitv3dN4iNttaUQnbWDZhNQRohQ59CFuEf7z4AiCoDTz", 1]],
            "weight_threshold": 1,
        },
        "active": {
            "account_auths": [],
            "key_auths": [["STM58efjiXLKkjYvrqNCHQ5J4DTBXgCN9EE5K4gNaYPdixREfuW1F", 1]],
            "weight_threshold": 1,
        },
        "posting": {
            "account_auths": [],
            "key_auths": [["STM5khoFYgEg8Mvh989JmXLhgEgwAF78nPRr2xppQgafzWCXe2krQ", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM7PApWPMRoKL1vGrsVrTS3Aqm95X8xGbpebWgNTFWWb5ex71W1M",
    },
}

API_TRX_SIG5_AUTHORITIES_10 = {
    "account_name": "demo-app",
    "authorities": {
        "owner": {
            "account_auths": [["steemconnect", 1]],
            "key_auths": [["STM82hFUKjN2j8KGqQ8rz9YgFAbMrWFuCPkabtrAnUfV2JQshNPLz", 1]],
            "weight_threshold": 1,
        },
        "active": {
            "account_auths": [],
            "key_auths": [["STM7g438Ha3LB7kfuYNyT2MXaFKdogKad5B7vp7Lj35mNay4RwKPf", 1]],
            "weight_threshold": 1,
        },
        "posting": {
            "account_auths": [["ecency.app", 1], ["steemconnect", 1]],
            "key_auths": [["STM6v5nwZYvAmyZZUoSdjJvgJ3FwiDHdKuWsAaB4zx3qhuhdyy76s", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM5kKfxHjCdhgCNS5vA67iKCJTYXEWzbQdm3fv7cv9SRs1f4UZ1N",
    },
}

API_TRX_SIG5_AUTHORITIES_11 = {
    "account_name": "leofinance",
    "authorities": {
        "owner": {
            "account_auths": [],
            "key_auths": [["STM5QemqxTCU4peHzSVL7vPGExgzsdRbAB3uYk8xAQVzuTycbU3hN", 1]],
            "weight_threshold": 1,
        },
        "active": {
            "account_auths": [],
            "key_auths": [["STM8dDctyAECwcwxgt4toBGockzs7WSUaXUrCkETP68pPLRAXSNsc", 1]],
            "weight_threshold": 1,
        },
        "posting": {
            "account_auths": [
                ["hivesigner", 1],
                ["leofinance", 1],
                ["peakd.app", 1],
                ["steem.leo", 1],
                ["steemauto", 1],
                ["threespeak", 1],
            ],
            "key_auths": [["STM57hDwzvNYEYfL4wLj9REhaRgiNxdFt232SxVzPwZYPqiH2ZfNW", 1]],
            "weight_threshold": 1,
        },
        "memo": "STM5Vz7MkUod4kzCoj5N4xW2FUyXUEgn5eqHx9m8EuupqXyej9aD3",
    },
}

API_TRX_SIG5_v1 = {
    "ref_block_num": 528,
    "ref_block_prefix": 1044714908,
    "extensions": [],
    "expiration": "2024-08-02T11:55:00",
    "operations": [
        {
            "type": "vote_operation",
            "value": {
                "voter": "ecency",
                "author": "oflyhigh",
                "weight": 100,
                "permlink": "5pualx-and",
            },
        },
        {
            "type": "vote_operation",
            "value": {
                "voter": "ecency.stats",
                "author": "oflyhigh",
                "weight": 100,
                "permlink": "5pualx-and",
            },
        },
        {
            "type": "vote_operation",
            "value": {
                "voter": "esteem.app",
                "author": "oflyhigh",
                "weight": 100,
                "permlink": "5pualx-and",
            },
        },
        {
            "type": "vote_operation",
            "value": {
                "voter": "good-karma",
                "author": "oflyhigh",
                "weight": 100,
                "permlink": "5pualx-and",
            },
        },
        {
            "type": "vote_operation",
            "value": {
                "voter": "esteemapp",
                "author": "oflyhigh",
                "weight": 100,
                "permlink": "5pualx-and",
            },
        },
    ],
    "signatures": [
        "1f090f0e06ee2d619c606d0a50619b7c0701eaf6aca1a1eb1be58f095cb470969c1878bc72fdc135dbc3313c32297d32cd4490e080dd737b1b84ca2490ec6b3ac2",
        "1f10a2f09b957b5d0fd33e8a4b194f180046d2140be27974b038f3be6a05497f1f535fae01eb8a42f830b318ce4c948d119c63fa39ec399c5f281234bc2fa75f3c",
        "1f4cbdc11512d188d8904efa86aadc9d641c8618ff14c216e20fd219dc1d5322d9636648558e38d3f5db16059073fbb7e98460877c71ca6206f02dcf25749192c5",
        "1f698ab8b3dc9077f57dcab0a0e74a3ea9e1faa3d4b022be22103888c5b03eca365c5d3f53bd39168fb097b5d90ea502a868d9e15e2d97db84bf63b4978e127fce",
        "203afe20deb225e5afc0f7825852a9f6eb7d1a5359a3f2a5d45367fdcd6322f65b147d511da7e0d8416878175107f07db0c5e40ad2c23d8aa2cddfe5cbccbbec94",
    ],
}

API_TRX_SIG5_v2 = {
    "ref_block_num": 435,
    "ref_block_prefix": 3476775084,
    "extensions": [],
    "expiration": "2024-08-02T11:50:21",
    "operations": [
        {
            "type": "vote_operation",
            "value": {
                "voter": "ecency",
                "author": "visualshots",
                "weight": 100,
                "permlink": "visual-shots-daily-curation-report-august-01-2024-eng-esp",
            },
        },
        {
            "type": "vote_operation",
            "value": {
                "voter": "ecency.stats",
                "author": "visualshots",
                "weight": 100,
                "permlink": "visual-shots-daily-curation-report-august-01-2024-eng-esp",
            },
        },
        {
            "type": "vote_operation",
            "value": {
                "voter": "esteem.app",
                "author": "visualshots",
                "weight": 100,
                "permlink": "visual-shots-daily-curation-report-august-01-2024-eng-esp",
            },
        },
        {
            "type": "vote_operation",
            "value": {
                "voter": "good-karma",
                "author": "visualshots",
                "weight": 100,
                "permlink": "visual-shots-daily-curation-report-august-01-2024-eng-esp",
            },
        },
        {
            "type": "vote_operation",
            "value": {
                "voter": "esteemapp",
                "author": "visualshots",
                "weight": 100,
                "permlink": "visual-shots-daily-curation-report-august-01-2024-eng-esp",
            },
        },
    ],
    "signatures": [
        "1f02e6406d1a0cbd2597f3731f8e7a8ae6625508113b26548eeb335cd640dcd2927bb5e499de290520a4e82e65139a2ee30c4b8366f1b27a2aa71255172f3e494b",
        "1f11363331f7175f8162c6541a5515f8f009934fbe8a6fd37ac00a936d723827e0422927cb91d6ec3a475a45fdd12da553ec485e7599220067fdac0ba000a25cfc",
        "1f27874abbaa01a5578b8e29338a55ea7e97a58bca009f9d9b405d49f6deee6a024f9cafdde4ff2c4b40236e5930eb1887df7e7a18d9ebd9418fc8bc5f38c81d77",
        "20095f4f6e756d0de3d5899864d80b85c67ba9833da54db7c359947dfcc94b5a7873bba9c87b78e21a0cfa9c4b00b7cf7c87aab96e1de516988235e8d7f33e89ca",
        "206043df39cab7bc40563e080627a7e4536922bdf57c4ef048c03b3cb72ee3e1955ec3ed7dd2013d2cee06a8da59a497255fa2d93fa5cf4e7dba01796ebda1d795",
    ],
}

ACCOUNT_AUTHS = [
    API_TRX_SIG1_AUTHORITIES,
    API_TRX_SIG5_AUTHORITIES_0,
    API_TRX_SIG5_AUTHORITIES_1,
    API_TRX_SIG5_AUTHORITIES_2,
    API_TRX_SIG5_AUTHORITIES_3,
    API_TRX_SIG5_AUTHORITIES_4,
    API_TRX_SIG5_AUTHORITIES_5,
    API_TRX_SIG5_AUTHORITIES_6,
    API_TRX_SIG5_AUTHORITIES_7,
    API_TRX_SIG5_AUTHORITIES_8,
    API_TRX_SIG5_AUTHORITIES_9,
    API_TRX_SIG5_AUTHORITIES_10,
    API_TRX_SIG5_AUTHORITIES_11,
]

def list_to_dict(l: list[Any]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for ll in l:
        result[ll[0]] = ll[1]
    return result

def to_python_authority(account_authority: dict[str, Any]) -> python_authority:
    result = python_authority(weight_threshold=account_authority["weight_threshold"],
                              account_auths=list_to_dict(account_authority["account_auths"]),
                              key_auths=list_to_dict(account_authority["key_auths"]),
                             )
    return result

def to_python_authorities(account_authorities: dict[str, Any]) -> python_authorities:
    result = python_authorities(active=to_python_authority(account_authorities["active"]),
                                owner=to_python_authority(account_authorities["owner"]),
                                posting=to_python_authority(account_authorities["posting"]),
                               )
    return result

ACCOUNT_AUTHS: dict[str, python_authorities] = {
    account_auth["account_name"]: to_python_authorities(account_auth["authorities"])
    for account_auth in ACCOUNT_AUTHS
}

SIGNING_KEYS = {
    "API_TRX_SIG1": [b"STM5zw6KDtQiiJMhkdkFm8CXxPUEa2QyitHBhkCE1iMJEGmEfd5aE"],
    "API_TRX_SIG5_v0": [
        b"STM574A9CiTg3EkcsZ7VfXin8tVtFVWqGq5x2wrfoqv5yMfxvx96d",
        b"STM57hDwzvNYEYfL4wLj9REhaRgiNxdFt232SxVzPwZYPqiH2ZfNW",
        b"STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
        b"STM5khoFYgEg8Mvh989JmXLhgEgwAF78nPRr2xppQgafzWCXe2krQ",
        b"STM62fkRnTJSeJoWMLS5r61cgQbxSo3JJ7BoxCgZrkfRuNN71hA1A",
        b"STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
        b"STM64peLPcuSsUk591okRGUwv5rsTadSnnqi9ddMZhrVkxkDaSUzo",
        b"STM6v5nwZYvAmyZZUoSdjJvgJ3FwiDHdKuWsAaB4zx3qhuhdyy76s",
        b"STM7KDcjUNMqUdohFu9iYjCAqYEyXfM7pjNLx96GhRNpdYscB3aQc",
        b"STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
        b"STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
        b"STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
    ],
    "API_TRX_SIG5_v1": [
        b"STM574A9CiTg3EkcsZ7VfXin8tVtFVWqGq5x2wrfoqv5yMfxvx96d",
        b"STM57hDwzvNYEYfL4wLj9REhaRgiNxdFt232SxVzPwZYPqiH2ZfNW",
        b"STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
        b"STM5khoFYgEg8Mvh989JmXLhgEgwAF78nPRr2xppQgafzWCXe2krQ",
        b"STM62fkRnTJSeJoWMLS5r61cgQbxSo3JJ7BoxCgZrkfRuNN71hA1A",
        b"STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
        b"STM64peLPcuSsUk591okRGUwv5rsTadSnnqi9ddMZhrVkxkDaSUzo",
        b"STM6v5nwZYvAmyZZUoSdjJvgJ3FwiDHdKuWsAaB4zx3qhuhdyy76s",
        b"STM7KDcjUNMqUdohFu9iYjCAqYEyXfM7pjNLx96GhRNpdYscB3aQc",
        b"STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
        b"STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
        b"STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
    ],
    "API_TRX_SIG5_v2": [
        b"STM574A9CiTg3EkcsZ7VfXin8tVtFVWqGq5x2wrfoqv5yMfxvx96d",
        b"STM57hDwzvNYEYfL4wLj9REhaRgiNxdFt232SxVzPwZYPqiH2ZfNW",
        b"STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
        b"STM5khoFYgEg8Mvh989JmXLhgEgwAF78nPRr2xppQgafzWCXe2krQ",
        b"STM62fkRnTJSeJoWMLS5r61cgQbxSo3JJ7BoxCgZrkfRuNN71hA1A",
        b"STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
        b"STM64peLPcuSsUk591okRGUwv5rsTadSnnqi9ddMZhrVkxkDaSUzo",
        b"STM6v5nwZYvAmyZZUoSdjJvgJ3FwiDHdKuWsAaB4zx3qhuhdyy76s",
        b"STM7KDcjUNMqUdohFu9iYjCAqYEyXfM7pjNLx96GhRNpdYscB3aQc",
        b"STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
        b"STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
        b"STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
    ],
}
