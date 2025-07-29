import { memoryUsage } from 'node:process';
import { ApiTransaction, createHiveChain } from '@hiveio/wax';
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const chain = await createHiveChain();

const tx: ApiTransaction = {
  "expiration": "2021-10-14T19:35:06",
  "extensions": [],
  "operations": [
    {
      "type": "create_claimed_account_operation",
      "value": {
        "owner": {
          "key_auths": [
            [
              "STM5Exrdndcj5x5mxRWJYZVgjCEHyb1cGRwdz5RzDTosdNWivPdcC",
              1
            ]
          ],
          "account_auths": [],
          "weight_threshold": 1
        },
        "active": {
          "key_auths": [
            [
              "STM4utwdRemiWrprD4aZantE8CVRnxRRZShz68W5SoDfZinfhCmSA",
              1
            ]
          ],
          "account_auths": [],
          "weight_threshold": 1
        },
        "creator": "appreciator",
        "posting": {
          "key_auths": [
            [
              "STM6NPx2HsYEBTyCpsA792NMbHFJYSB8GL79wFDovAjiEvGEiXbF2",
              1
            ]
          ],
          "account_auths": [
            [
              "ecency.app",
              1
            ]
          ],
          "weight_threshold": 1
        },
        "memo_key": "STM7AHWfXYqDmNb6NEtbP4AMm298oNTLxWrotNpEurzo8MsmNYjAb",
        "extensions": [],
        "json_metadata": "",
        "new_account_name": "mtyszczak"
      }
    }
  ],
  "signatures": [
    "1f01aec0307b4534f2de3d92344100591ac17f0b6bf62ad0ce12cf10b8fc73a3e968e4296a944de5a6583f4693508e94cade3514643553e519db924417bf46b9a3"
  ],
  "ref_block_num": 25122,
  "ref_block_prefix": 3683859877
};

const firstMemoryUsed = memoryUsage();
const firstMemoryUsedTotal = firstMemoryUsed.heapUsed + firstMemoryUsed.external + firstMemoryUsed.rss + firstMemoryUsed.arrayBuffers + firstMemoryUsed.heapTotal;
let lastMemoryUsedTotal = firstMemoryUsedTotal;

const initialCheck = Date.now();
let lastCheck = initialCheck;
let lastCheckIteration = 0;

const analyzeTxsCount = 100_000;
console.log("Analyzing", analyzeTxsCount, "transactions...");

const bytesToMiB = (bytes: number) => Math.round(bytes / 1024 / 1024 * 100) / 100;

globalThis.gc!({execution: "sync", type: "major"});

for(let i = 0; i < analyzeTxsCount; ++i) {
  if (lastCheck + 1000 < Date.now()) {
    globalThis.gc!({execution: "sync", type: "major"});
    const currentMemoryUsed = memoryUsage();
    const currentMemoryUsedTotal = currentMemoryUsed.heapUsed + currentMemoryUsed.external + currentMemoryUsed.rss + currentMemoryUsed.arrayBuffers + currentMemoryUsed.heapTotal;
    const percentMemoryUsedChange = ((currentMemoryUsedTotal - lastMemoryUsedTotal) / lastMemoryUsedTotal) * 100;

    console.log(`tx/sec = ${i - lastCheckIteration}, percent memory used change = ${percentMemoryUsedChange.toFixed(2)}%`);
    lastMemoryUsedTotal = currentMemoryUsedTotal;
    lastCheckIteration = i;
    globalThis.gc!();
    lastCheck = Date.now();
  }

  const txH: any = chain.createTransactionFromJson(tx);
  if (i===0)
    console.log('Transaction size:', txH.toBinaryForm().length / 2, 'bytes');
  txH.id; // Just to perform any action on the transaction to ensure it is processed
  // txH.txHandle.delete();
}

globalThis.gc!({execution: "sync", type: "major"});

const finalMemoryUsed = memoryUsage();
const finalMemoryUsedTotal = finalMemoryUsed.heapUsed + finalMemoryUsed.external + finalMemoryUsed.rss + finalMemoryUsed.arrayBuffers + finalMemoryUsed.heapTotal;
const percentMemoryUsedChange = ((finalMemoryUsedTotal - firstMemoryUsedTotal) / firstMemoryUsedTotal) * 100;
console.log("Final memory percent change", parseFloat(percentMemoryUsedChange.toFixed(2)), "%");
console.log("Average memory used change per tx:", Math.round((finalMemoryUsedTotal - firstMemoryUsedTotal) / analyzeTxsCount), "B");
console.log("Total memory used change:", bytesToMiB(finalMemoryUsedTotal - firstMemoryUsedTotal), "MiB");

const result = await session.post('HeapProfiler.takeHeapSnapshot');
console.log('HeapProfiler.takeHeapSnapshot done:', result);
session.disconnect();
fs.closeSync(fd);

console.log("Transactions processed, forcing garbage collection...");

const gcCycle = (iteration: number, limit: number) => {
  console.log('Forcing garbage collection...');
  global.gc!({execution: "sync", type: "major"});

  const count = (chain as any).protocol.cpp_report_transaction_handle_stats() as {
    instance_count: number;
    max_instance_count: number;
  };
  if (iteration === 0)
    console.log("Max transaction handle instances:", count.max_instance_count);
  console.log('Current transaction handle instances:', count.instance_count);

  if(count.instance_count > 0) {
    if (iteration >= limit)
      throw new Error('Garbage collection limit reached');

    console.log(`Rescheduling garbage collection - iteration: ${iteration+1}...`);
    setTimeout(() => gcCycle(iteration + 1, limit), 1000);
  } else {
    console.log('Garbage collection completed successfully.');
  }
};
gcCycle(0, 100);
