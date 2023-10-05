declare var wax: typeof import("@hive/wax");
declare var beekeeper: typeof import("@hive/beekeeper");

// XXX: We use TS 4.4.4, but it Awaited has been introduced in TS 4.5.
// Usage of awaited will not be required after we improve our types in beekeeper
type PolyAwaited<T> =
  T extends null | undefined ? T : // special case for `null | undefined` when not in `--strictNullChecks` mode
      T extends object & { then(onfulfilled: infer F, ...args: infer _): any } ? // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
          F extends ((value: infer V, ...args: infer _) => any) ? // if the argument to `then` is callable, extracts the first argument
          PolyAwaited<V> : // recursively unwrap the value
              never : // the argument to `then` was not callable
      T; // non-object or non-thenable

export const evaluate = async() => {

const { default: BeekeeperModule } = beekeeper;
const { default: WaxModule, transaction } = wax;

const initWasmModule = async(): ReturnType<typeof BeekeeperModule> => {
  const module = await BeekeeperModule();
  const FS = module.FS;
  FS.mkdir(STORAGE_ROOT);
  // XXX: We should not conver it to any
  FS.mount(FS.filesystems.IDBFS as any, {}, STORAGE_ROOT);
  return await new Promise((resolve, reject) => {
    FS.syncfs(true, (err: any) => {
      if (err)
        reject(err);

      resolve(module);
    });
  });
}

// XXX: This should be easier to type
const sync = (fs: PolyAwaited<ReturnType<typeof BeekeeperModule>>['FS']) =>
  new Promise((resolve, reject) => {
    fs.syncfs((err: any) => {
      if (err) reject(err);

      resolve(null);
    });
  });

const STORAGE_ROOT = '/storage_root';
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

const waxProvider = await WaxModule();
const beekeeperProvider = await initWasmModule();
const beekeeperOptions = new beekeeperProvider.StringList();
WALLET_OPTIONS.forEach((opt: string) => void beekeeperOptions.push_back(opt));

const proto = new waxProvider.proto_protocol();
const keeper  = new beekeeperProvider.beekeeper_api(beekeeperOptions);
keeper.init();

// We have to transform our API to the plain object first and then stringify it so it can be sent to wasm
const { content: sigDigest } = proto.cpp_calculate_sig_digest(JSON.stringify(transaction.toJSON(protoTx)), "42");

const { token } = handleBeekeeperJsonResult(keeper.create_session('pear') as string);

keeper.create(token, walletName)
keeper.import_key(token, walletName, OUR_MAINNET_INITMINER_PRIVATE_KEY_DO_NOT_SHARE);

const { keys: [ { public_key: publicKey } ] } = handleBeekeeperJsonResult(keeper.get_public_keys(token) as string);

const { signature } = handleBeekeeperJsonResult(keeper.sign_digest(token, sigDigest, publicKey) as string);

console.log(`Your signature for transmitting: "${signature}"`);

await sync(beekeeperProvider.FS);
};
