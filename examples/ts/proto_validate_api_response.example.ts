declare var wax: typeof import("@hive/wax");

export const evaluate = async() => {

const { default: MainModule } = wax;

const apiData = JSON.stringify({
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
        "weight": 10000
      }
    }
  ],
  "extensions": [],
  "signatures": [
    "202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8b37d3fb3"
  ]
});

const provider = await MainModule();
const protoInstance = new provider.proto_protocol();

const protoData = protoInstance.cpp_api_to_proto(apiData);
if(protoData.value !== provider.error_code.ok)
  throw new Error("Could not convert api to proto");

const result = protoInstance.cpp_validate_transaction(protoData.content);
if(result.value !== provider.error_code.ok)
  throw new Error("Could not convert api to proto");
};
