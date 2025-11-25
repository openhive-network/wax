export default {
	"error": {
		"code": -32003,
		"data": {
			"assert_hash": "15599059534279751802",
			"code": 10,
			"extension": {
				"assertion_expression": "in_len <= sizeof(data)"
			},
			"message": "Assert Exception",
			"name": "assert_exception",
			"stack": [
				{
					"context": {
						"file": "fixed_string.hpp",
						"hostname": "",
						"level": "error",
						"line": 151,
						"method": "assign",
						"thread_name": "th_78",
						"timestamp": "2025-11-25T13:04:28"
					},
					"data": {
						"fs": 16,
						"in": "toolargeinputitis",
						"is": 17
					},
					"format": "Input too large: `${in}` (${is}) for fixed size string: (${fs})"
				}
			]
		},
		"message": "Assert Exception:in_len <= sizeof(data): Input too large: `toolargeinputitis` (17) for fixed size string: (16)"
	},
	"id": 1,
	"jsonrpc": "2.0"
};
