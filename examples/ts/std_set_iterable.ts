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

  class StringSetIterator implements Iterator<string_set_iterator_result['value']> {
    
    public static from(source: string_set): StringSetIterator {
      return new StringSetIterator(source.values());
    }

    public next(...args: [] | [any]): IteratorResult<string_set_iterator_result['value'], undefined> {
      let result: IteratorResult<string_set_iterator_result['value'], undefined>;

      console.log("StringSetIterator::next()");

      const sourceResult = this.source.next();

      console.log(`Received sourceResult: ${JSON.stringify(sourceResult)}, ${typeof (sourceResult)}`);

      if(sourceResult.done === true) {
        console.log("StringSetIterator::next(): done");
        return { done: true, value: undefined };
      }
      else {
        console.log("StringSetIterator::next(): nonempty");
        return { value: sourceResult.value };
      }

      return result;
    }

    [Symbol.iterator](): StringSetIterator { return this};

    private constructor(private readonly source: string_set_iterator) {
      console.log("StringSetIterator()");
    }
  }

  const p: protocol = hiveChain.getProtocol();

  const raq :required_authority_collection = p.cpp_collect_transaction_required_authorities(transaction);

  console.log(raq.posting_accounts.size());

  console.log(`Received raq: ${JSON.stringify(raq)}, ${typeof(raq)}`);

  let iii = StringSetIterator.from(raq.posting_accounts);

  for(let i of iii) {
    console.log(`Iterated items: ${i}`);
  }


  let vvv = raq.posting_accounts.values();

  const n = vvv.next();

  console.log(`Received vvv.next item: ${JSON.stringify(n)}, ${typeof (n)}`);

  let ps: Set<string> = new Set<string>();

  for(const k of Object.keys(ps)) {
    console.log(`Key: ${k}`);
  }

  console.log(`Received values: ${JSON.stringify(vvv)}, ${typeof(vvv)}`);

// for(let a of raq.posting_accounts)
  // console.log(`Required posting auth: ${a}`);


  for(let a of raq.posting_accounts.values())
    console.log(`Required posting auth: ${a}`);

  //let _iterable: Iterable<string> = raq.posting_accounts.values();

 
  //console.log(`Set size: ${ps.size}`);

  //let _iterable2: Iterable<string> = ps;

  const cit = raq.posting_accounts.values();

  const r = cit.next();
  r.done;

  const sit = ps.values();
  const sr : IteratorResult<string, any> = sit.next();
  sr.done
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
