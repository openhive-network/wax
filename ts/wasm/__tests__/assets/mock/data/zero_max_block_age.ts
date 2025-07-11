//import type { ApiAccount } from '../../../../dist/bundle';

export default {
  id: 1,
  jsonrpc: '2.0',
  error: {
    code: -32000,
    message: 'Assert Exception:!check_max_block_age( args.max_block_age )',
    data: {
      code: 10,
      name: "assert_exception",
      message: "Assert Exception",
      stack:[
          {
          context: {
            level: "error",
            file: "network_broadcast_api.cpp",
            line: 30,
            method: "broadcast_transaction",
            hostname: "",
            thread_name: "th_100",
            timestamp: "2025-08-19T12:58:56"
          },
          format: "",
          data: {}
          }
        ],
      extension: { assertion_expression: "!check_max_block_age( args.max_block_age )" },
      assert_hash: "4716502953486857149"
    }
  },
};
