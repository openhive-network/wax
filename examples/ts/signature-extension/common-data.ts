import { type account_create, createHiveChain, IHiveChainInterface, TAccountName, TPublicKey } from "@hiveio/wax";
import createBeekeeper, {IBeekeeperUnlockedWallet} from "@hiveio/beekeeper";
import { BeekeeperProvider } from "@hiveio/wax-signers-beekeeper";

const testAccountName = "keychainsigner";
const testAccountPostingKey = "5J7cSrAhgnAWe2uQqTTPhb7BggUeKjuLS8AFPpn53Yv7mFYHo53";

// Memo encryption recipient, distinct from the sender - hits requestEncodeMessage.
const testRecipientAccountName = "keychainrcpt";

export const voteData = {
  voter: testAccountName,
  author: "c0ff33a",
  permlink: "ewxhnjbj",
  weight: 2200
};

// Shared between the browser-side encoding page and the Node-side decryption assertion.
export const memoTestMessage = "Wax keychain memo casing regression test";

export interface TTestAccountAuthorityData {
  accountName: TAccountName;
  publicKey: TPublicKey;
  privateKey: string;
  role: string;
};

export interface TMemoRecipientData {
  accountName: TAccountName;
  memoPublicKey: TPublicKey;
  memoPrivateKey: string;
};

export interface TTestEnvData extends TTestAccountAuthorityData {
  accountName: TAccountName;
  publicKey: TPublicKey;
  privateKey: string;
  role: string;
  memoPrivateKey: string;
  memoPublicKey: TPublicKey;
  configuredChain: IHiveChainInterface;
  preparedBeekeeperWallet: IBeekeeperUnlockedWallet;
};

const mirrornetSkeletonKey = '5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n';


//owner: 5KYoVXJ9oPCQXXPXbyec5BABxappnnRNxZGvGDSujJ7caR6szCj
//active: 5JaodMcwGiuYd53Hf1gGE7AmXS9KrW5hTeTAe9HakjJ4F3Jsg2h
//posting: 5J7cSrAhgnAWe2uQqTTPhb7BggUeKjuLS8AFPpn53Yv7mFYHo53
//memo: 5JsJ6rcbZSLM4MrvhCkWAY88Hn8Ci5nhNLapbpLXUemtUAwGHcd

/// Derives an account's keys from the skeleton password and creates it if a mirrornet reset wiped it out.
const ensureAccountExists = async (
  chain: IHiveChainInterface,
  wallet: IBeekeeperUnlockedWallet,
  mirrornetSkeletonPublicKey: TPublicKey,
  accountName: TAccountName
) => {
  const ownerKeyData = chain.getPrivateKeyFromPassword(accountName, "owner", mirrornetSkeletonKey);
  const activeKeyData = chain.getPrivateKeyFromPassword(accountName, "active", mirrornetSkeletonKey);
  const postingKeyData = chain.getPrivateKeyFromPassword(accountName, "posting", mirrornetSkeletonKey);
  const memoKeyData = chain.getPrivateKeyFromPassword(accountName, "memo", mirrornetSkeletonKey);

  const accountData = await chain.api.database_api.find_accounts({accounts: [accountName], delayed_votes_active: true});

  if(accountData.accounts.length === 0) {
    console.log(`Account: ${accountName} not found. Attempting to create it...`)

    console.log("owner:", ownerKeyData.wifPrivateKey);
    console.log("active:", activeKeyData.wifPrivateKey);
    console.log("posting:", postingKeyData.wifPrivateKey);
    console.log("memo:", memoKeyData.wifPrivateKey);

    const ownerAuthorityKeyAuths: Record<string, number> = {};
    ownerAuthorityKeyAuths[ownerKeyData.associatedPublicKey] = 1;
    ownerAuthorityKeyAuths[mirrornetSkeletonPublicKey] = 1;

    const activeAuthorityKeyAuths: Record<string, number> = {};
    activeAuthorityKeyAuths[activeKeyData.associatedPublicKey] = 1;

    const postingAuthorityKeyAuths: Record<string, number> = {};
    postingAuthorityKeyAuths[postingKeyData.associatedPublicKey] = 1;

    const tx = await chain.createTransaction();

    const operationBody: account_create = {
      fee: chain.hiveCoins(3),
      creator: "xbtsio",
      new_account_name: accountName,
      owner:   {weight_threshold: 1, account_auths: {}, key_auths: ownerAuthorityKeyAuths},
      active:  {weight_threshold: 1, account_auths: {}, key_auths: activeAuthorityKeyAuths},
      posting: {weight_threshold: 1, account_auths: {}, key_auths: postingAuthorityKeyAuths},
      memo_key: memoKeyData.associatedPublicKey,
      json_metadata: '{"description": "Account created for Wax keychain signer extension testing purposes"}'
    };

    tx.pushOperation({account_create_operation: operationBody});
    const signer = BeekeeperProvider.for(chain, wallet, mirrornetSkeletonPublicKey) as BeekeeperProvider;
    await signer.signTransaction(tx);

    await chain.broadcast(tx);

    console.log(`Account: ${accountName} created successfully!`);

    await new Promise(resolve => setTimeout(resolve, 4000)); /// naive way to wait for transaction completed
  }

  return { ownerKeyData, activeKeyData, postingKeyData, memoKeyData };
};

/// Intent of this script is automatically prepare testing account in case of mirrornet reset.
export const prepareTestingEnvironemnt = async (): Promise<TTestEnvData> => {
  const chain = await createHiveChain({chainId: "4200000000000000000000000000000000000000000000000000000000000000", apiEndpoint: "https://api.fake.openhive.network"});

  const beekeeperInstance = await createBeekeeper({inMemory: true});
  const session = beekeeperInstance.createSession("salt and pepper");

  const {wallet} = await session.createWallet("temp-wallet", "somePass", true);
  const mirrornetSkeletonPublicKey = await wallet.importKey(mirrornetSkeletonKey);
  const testAccountPublicKey = await wallet.importKey(testAccountPostingKey);

  const senderKeys = await ensureAccountExists(chain, wallet, mirrornetSkeletonPublicKey, testAccountName);

  const accountData = await chain.api.database_api.find_accounts({accounts: [testAccountName], delayed_votes_active: true});

  console.log(`Received account info: ${JSON.stringify(accountData)}`);

  return {
    accountName: testAccountName,
    publicKey: testAccountPublicKey,
    privateKey: testAccountPostingKey,
    role: "posting",
    memoPrivateKey: senderKeys.memoKeyData.wifPrivateKey,
    memoPublicKey: senderKeys.memoKeyData.associatedPublicKey,
    configuredChain: chain,
    preparedBeekeeperWallet: wallet
  };

};

/// Separate from prepareTestingEnvironemnt() so it doesn't delay window.useKeychain wiring.
export const prepareMemoRecipient = async (
  testEnv: Pick<TTestEnvData, "configuredChain" | "preparedBeekeeperWallet">
): Promise<TMemoRecipientData> => {
  const mirrornetSkeletonPublicKey = await testEnv.preparedBeekeeperWallet.importKey(mirrornetSkeletonKey);
  const recipientKeys = await ensureAccountExists(testEnv.configuredChain, testEnv.preparedBeekeeperWallet, mirrornetSkeletonPublicKey, testRecipientAccountName);

  return {
    accountName: testRecipientAccountName,
    memoPublicKey: recipientKeys.memoKeyData.associatedPublicKey,
    memoPrivateKey: recipientKeys.memoKeyData.wifPrivateKey
  };
};
