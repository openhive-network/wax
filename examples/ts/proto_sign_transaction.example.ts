import WaxModule, { transaction } from "@hive/wax";
import BeekeeperModule from "@hive/beekeeper";

import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STORAGE_ROOT = path.join(__dirname, 'storage_root');
const WALLET_OPTIONS = ['--wallet-dir', `${STORAGE_ROOT}/.beekeeper`];

const protoTx = transaction.create({
  ref_block_num: 19260,
  ref_block_prefix: 2140466769,
  expiration: "2016-09-15T19:47:33",
  operations: [
    {
      vote: {
        voter: "taoteh1221",
        author: "ozchartart",
        permlink: "usdsteem-btc-daily-poloniex-bittrex-technical-analysis-market-report-update-46-glass-half-full-but-the-bottle-s-left-empty-sept",
        weight: 10000
      }
    }
  ],
  extensions: []
});

const OUR_MAINNET_INITMINER_PRIVATE_KEY_DO_NOT_SHARE = "5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n"; // :)
const walletName = "pear";

const handleBeekeeperJsonResult = (value: string) => {
  const { result } = JSON.parse(value);

  return JSON.parse(result);
};

(async () => {
  const waxProvider = await WaxModule();
  const beekeeperProvider = await BeekeeperModule();
  const beekeeperOptions = new beekeeperProvider.StringList();
  WALLET_OPTIONS.forEach((opt: string) => void beekeeperOptions.push_back(opt));

  const wax = new waxProvider.proto_protocol();
  const beekeeper  = new beekeeperProvider.beekeeper_api(beekeeperOptions);
  beekeeper.init();

  // We have to transform our API to the plain object first and then stringify it so it can be sent to wasm
  const { content: sigDigest } = wax.cpp_calculate_sig_digest(JSON.stringify(transaction.toJSON(protoTx)), "42");

  const { token } = handleBeekeeperJsonResult(beekeeper.create_session('pear') as string);

  beekeeper.create(token, walletName)
  beekeeper.import_key(token, walletName, OUR_MAINNET_INITMINER_PRIVATE_KEY_DO_NOT_SHARE);

  const { keys: [ { public_key: publicKey } ] } = handleBeekeeperJsonResult(beekeeper.get_public_keys(token) as string);

  const { signature } = handleBeekeeperJsonResult(beekeeper.sign_digest(token, sigDigest, publicKey) as string);

  console.log(`Your signature for transmitting: "${signature}"`);
})();
