import { createHiveChain, IHiveChainInterface, transaction, ApiTransaction, ApiAuthority, TAccountName, TWaxExtended, ApiKeyAuth, transfer, TTransactionPackType, VerifyAuthorityRequest } from '@hive/wax/node'
import { required_authority_collection, protocol, string_set_iterator, string_set_iterator_result, string_set } from '@hive/wax/node'

const settest = (hiveChain: IHiveChainInterface): void => {
  const vote_operation = {
    type: "vote_operation",
    value: {
      voter: "otom",
      author: "c0ff33a",
      permlink: "ewxhnjbj",
      weight: 2200
    }
  };
  

  const transaction = JSON.stringify({
    ref_block_num: 34559,
    ref_block_prefix: 1271006404,
    expiration: "2021-12-13T11:31:33",
    operations: [
      vote_operation
    ]
  });

  const p: protocol = hiveChain.getProtocol();

  const raq :required_authority_collection = p.cpp_collect_transaction_required_authorities(transaction);

  console.log(raq.posting_accounts.size());

  console.log(`Received raq: ${JSON.stringify(raq)}, ${typeof(raq)}`);

  let vvv: string_set_iterator = raq.posting_accounts.values();

  console.log(`raq.posting_accounts type: ${typeof(raq.posting_accounts)}, object props: ${Object.getOwnPropertyNames(raq.posting_accounts)}, prototype props: ${Object.getOwnPropertyNames(Object.getPrototypeOf(raq.posting_accounts))}`);

  console.log(`vvv type: ${typeof(vvv)}, object props: ${Object.getOwnPropertyNames(vvv)}, prototype props: ${Object.getOwnPropertyNames(Object.getPrototypeOf(vvv))}`);

//  let ps = new Set(raq.posting_accounts);
  //const psValues = ps.values();

  //console.log(`ps type: ${typeof(ps)}, object props: ${Object.getOwnPropertyNames(ps)}, prototype props: ${Object.getOwnPropertyNames(Object.getPrototypeOf(ps))}`);

  //console.log(`ps.values type: ${typeof(psValues)}, object props: ${Object.getOwnPropertyNames(psValues)}, prototype props: ${Object.getOwnPropertyNames(Object.getPrototypeOf(psValues))}`);

  for(let i of raq.posting_accounts) {
    console.log(`raq.posting_accounts Iterated items: ${i}`);
  }


  for(let i of vvv) {
    console.log(`vvvIterable Iterated items: ${i}`);
  }

//  const n = vvv.next();

//  console.log(`Received vvv.next item: ${JSON.stringify(n)}, ${typeof (n)}`);

// for(let a of raq.posting_accounts)
  // console.log(`Required posting auth: ${a}`);


  //for(let a of raq.posting_accounts.values())
    //console.log(`Required posting auth: ${a}`);

  //let _iterable: Iterable<string> = raq.posting_accounts.values();

 
  //console.log(`Set size: ${ps.size}`);

  //let _iterable2: Iterable<string> = ps;
}

const main = async (): Promise<void> =>  {

  const hiveChain: IHiveChainInterface = await createHiveChain();

  settest(hiveChain);

  const s:Set<string> = new Set<string>(["a", "B"]);

  const i:IterableIterator<string> = s.values();

  const n: IteratorResult<string, any> = i.next();

  class MyIterator {
    [Symbol.iterator](): MyIterator { return this};
    next(): any
     {
      if(this.first) {
        this.first = false;
        return {/*done: false,*/ value: "xxx"};
      }
      else {
        return {done: true};
      }
    };

    private first: boolean = true;
  };

let mi: MyIterator = new MyIterator();

let iii: Iterable<string> = mi;

  for(let i of iii) {
    console.log(i);
  }


  /*
  /// This is your tx received from KeyChain after signing
  const txJSON = {
    "expiration": "2024-02-21T06:55:40",
    "extensions": [],
    "operations": [
      {
        "type": "account_update2_operation",
        "value": {
          "account": "thatcryptodave",
          "extensions": [],
          "json_metadata": "",
          "posting_json_metadata": "{\"name\":\"David P.\",\"about\":\"\",\"website\":\"\",\"location\":\"Ontario, Canada\",\"birthday\":\"03.28.1984\",\"profile\":{\"name\":\"David P.\",\"about\":\"\",\"website\":\"\",\"location\":\"Ontario, Canada\",\"birthday\":\"03.28.1984\",\"profile_image\":\"\",\"cover_image\":\"\"}}"
        }
      }
    ],
    "signatures": [
      "1f6ad21ddf9f57f1a94c1462185744cb0ea779ec1e99899f2556a3ce02b18d1b810fcddaccb349a53037798aea8023909447df756db461235ba5b63984d515c977"
    ],
    "ref_block_num": 26295,
    "ref_block_prefix": 26859167
  };

  const tx: transaction = transaction.fromJSON(txJSON);

  const txBuilder = hiveChain.TransactionBuilder.fromApi(txJSON);

  const sigDigest = txBuilder.sigDigest;
  console.log(`sigDigest of passed transaction is: ${sigDigest}`);

  const extendedChain = hiveChain;

  let expectedAuthorityLevel: AuthorityLevel = AuthorityLevel.POSTING;

  const authorityVerificationResult = await extendedChain.api.database_api.verify_authority({ trx: txJSON });

  if (authorityVerificationResult.valid) {
    console.log("Transaction is CORRECTLY signed, going to additionally validate that key used to genrate signature is directly specified in Signer account authority");

    const signatureKeys = txBuilder.signatureKeys;

  }
  else {
    console.log("Transaction has specified INVALID authority");
  }

  */
};

const x = await main();
