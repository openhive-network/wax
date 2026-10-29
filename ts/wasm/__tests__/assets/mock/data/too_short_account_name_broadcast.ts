export default {
  "id": 1,
  "jsonrpc": "2.0",
  "error": {
    "code": -32003,
    "data": {
      "assert_hash": "17180696541040293791",
      "code": 10,
      "extension": {
        "assertion_expression": "validity_check_result != account_name_validity::too_short"
      },
      "message": "Assert Exception",
      "name": "assert_exception",
      "stack": [
        {
          "context": {
            "file": "validation.hpp",
            "hostname": "",
            "level": "error",
            "line": 99,
            "method": "validate_account_name",
            "thread_name": "worker_4_of_8",
            "timestamp": "2026-10-29T12:28:49"
          },
          "data": {
            "category": "protocol",
            "min": 3,
            "reason": "too_short",
            "subject": "a",
            "subject_type": "account_name"
          },
          "format": "Account name '${subject}' is too short. Use at least ${min} characters."
        },
        {
          "context": {
            "file": "hive_operations.cpp",
            "hostname": "",
            "level": "warn",
            "line": 249,
            "method": "validate",
            "thread_name": "worker_4_of_8",
            "timestamp": "2026-10-29T12:28:49"
          },
          "data": {
            "*this": {
              "amount": {
                "amount": "100",
                "nai": "@@000000021",
                "precision": 3
              },
              "from": "a",
              "memo": "",
              "to": "initminer"
            }
          },
          "format": ""
        },
        {
          "context": {
            "file": "operations.cpp",
            "hostname": "",
            "level": "warn",
            "line": 51,
            "method": "operation_validate",
            "thread_name": "worker_4_of_8",
            "timestamp": "2026-10-29T12:28:49"
          },
          "data": {
            "op": {
              "type": "transfer_operation",
              "value": {
                "amount": {
                  "amount": "100",
                  "nai": "@@000000021",
                  "precision": 3
                },
                "from": "a",
                "memo": "",
                "to": "initminer"
              }
            }
          },
          "format": ""
        },
        {
          "context": {
            "file": "full_transaction.cpp",
            "hostname": "",
            "level": "error",
            "line": 201,
            "method": "precompute_validation",
            "thread_name": "worker_4_of_8",
            "timestamp": "2026-10-29T12:28:49"
          },
          "data": {},
          "format": ""
        },
        {
          "context": {
            "file": "database.cpp",
            "hostname": "",
            "level": "warn",
            "line": 2719,
            "method": "_apply_transaction",
            "thread_name": "write_queue",
            "timestamp": "2026-10-29T12:28:49"
          },
          "data": {
            "full_transaction->get_transaction()": {
              "expiration": "2026-10-29T12:29:48",
              "extensions": [],
              "operations": [
                {
                  "type": "transfer_operation",
                  "value": {
                    "amount": {
                      "amount": "100",
                      "nai": "@@000000021",
                      "precision": 3
                    },
                    "from": "a",
                    "memo": "",
                    "to": "initminer"
                  }
                }
              ],
              "ref_block_num": 47390,
              "ref_block_prefix": 1328712092,
              "signatures": []
            }
          },
          "format": ""
        },
        {
          "context": {
            "file": "database.cpp",
            "hostname": "",
            "level": "warn",
            "line": 581,
            "method": "process_non_fast_confirm_transaction",
            "thread_name": "write_queue",
            "timestamp": "2026-10-29T12:28:49"
          },
          "data": {
            "trx": {
              "expiration": "2026-10-29T12:29:48",
              "extensions": [],
              "operations": [
                {
                  "type": "transfer_operation",
                  "value": {
                    "amount": {
                      "amount": "100",
                      "nai": "@@000000021",
                      "precision": 3
                    },
                    "from": "a",
                    "memo": "",
                    "to": "initminer"
                  }
                }
              ],
              "ref_block_num": 47390,
              "ref_block_prefix": 1328712092,
              "signatures": []
            }
          },
          "format": ""
        },
        {
          "context": {
            "file": "chain_plugin.cpp",
            "hostname": "",
            "level": "warn",
            "line": 1028,
            "method": "push_transaction",
            "thread_name": "write_queue",
            "timestamp": "2026-10-29T12:28:49"
          },
          "data": {
            "trx": {
              "expiration": "2026-10-29T12:29:48",
              "extensions": [],
              "operations": [
                {
                  "type": "transfer_operation",
                  "value": {
                    "amount": {
                      "amount": "100",
                      "nai": "@@000000021",
                      "precision": 3
                    },
                    "from": "a",
                    "memo": "",
                    "to": "initminer"
                  }
                }
              ],
              "ref_block_num": 47390,
              "ref_block_prefix": 1328712092,
              "signatures": []
            }
          },
          "format": ""
        },
        {
          "context": {
            "file": "chain_plugin.cpp",
            "hostname": "",
            "level": "warn",
            "line": 2141,
            "method": "determine_encoding_and_accept_transaction",
            "thread_name": "th_80",
            "timestamp": "2026-10-29T12:28:49"
          },
          "data": {},
          "format": ""
        }
      ]
    },
    "message": "Assert Exception:validity_check_result != account_name_validity::too_short: Account name 'a' is too short. Use at least 3 characters."
  }
};
