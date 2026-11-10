// hived's answer to a claim_reward_balance asking for more HIVE than the account's reward balance (HIVE_CHAIN_BALANCE_ASSERT in hive_evaluator_transfer.cpp)
export default {
  "id": 1,
  "jsonrpc": "2.0",
  "error": {
    "code": -32003,
    "data": {
      "assert_hash": "3542581213549328473",
      "code": 10,
      "extension": {
        "assertion_expression": "op_reward_hive <= acnt.get_hive_rewards()"
      },
      "message": "Assert Exception",
      "name": "assert_exception",
      "stack": [
        {
          "context": {
            "file": "hive_evaluator_transfer.cpp",
            "hostname": "",
            "level": "error",
            "line": 677,
            "method": "do_apply",
            "thread_name": "worker_4_of_8",
            "timestamp": "2026-11-10T12:00:00"
          },
          "data": {
            "a": { "amount": "500", "nai": "@@000000021", "precision": 3 },
            "c": { "amount": "1000", "nai": "@@000000021", "precision": 3 },
            "category": "chain",
            "subject": "guest4test1",
            "subject_type": "balance"
          },
          "format": "Cannot claim that much HIVE. Claim: ${c} Actual: ${a}"
        }
      ]
    },
    "message": "Assert Exception:op_reward_hive <= acnt.get_hive_rewards(): Cannot claim that much HIVE. Claim: 1.000 HIVE Actual: 0.500 HIVE"
  }
};
