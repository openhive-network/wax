/**
 * @file Performs some transaction actions in NodeJS env, to verify proper C++ side object destruction.
 *
 * @requires @hiveio/wax
 *
 * @output
 
 * If you want to start this example locally, please run following command:
 * ```bash
 * pnpm start
 * ```
 */

import { createHiveChain, ResourceCreditsOperation, operation } from "@hiveio/wax";

const main = async() => {

// Create Hive Wax chain instance and fetch transaction data from the blockchain to create a transaction
const chain = await createHiveChain();

const tx = await chain.createTransaction();

const rcOp = new ResourceCreditsOperation()

tx.pushOperation(rcOp.removeDelegation('dummy', 'guest4test1', 'guest4test2').authorize('guest4test666'));
tx.pushOperation(rcOp.delegate('dummy', "100000000000", 'guest4test666').authorize('guest4test666'));

const op: operation = { delegate_vesting_shares_operation: {
    delegator: "guest4test666",
    delegatee: "dummy",
    vesting_shares: chain.vestsCoins(10014)
} };


tx.pushOperation(op);
console.log(`Tramsaction id: ${tx.id}`);

console.log(`This is internally encoded operation, completely not readable for humans: ${tx.toApi()}`);

/* Here is used another wax big feature: extendable and customizable operation formatters.
 * Please consult wax documentation for details...
 */
console.log(chain.waxify`And here we can easily decode given operation: ${tx.transaction}`);

// Clean up
//chain.delete();

console.log('Exiting main');

return chain;
};

let chain = await main();

let direct_chain: any = chain;

const gcCycle = (iteration: number, limit: number): boolean => {
  try {
    console.log('Forcing garbage collection...');
    global.gc({execution: "sync", type: "major"});

    const count = direct_chain.protocol.cpp_report_transaction_handle_stats();
    console.log('Transaction handle stats:', count);

    if(count > 0) {
      if (iteration >= limit)
        throw new Error('Garbage collection limit reached');

      console.log(`Rescheduling garbage collection - iteration: ${iteration+1}...`);
      setTimeout(() => gcCycle(iteration + 1, limit),
        1000);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error during garbage collection:', error);
    throw error;
  }
};

if (global.gc) {
  gcCycle(0, 100);
} else {
    console.log('Garbage collection unavailable.  Pass --expose-gc '
      + 'when launching node to enable forced garbage collection.');

    throw new Error('Garbage collection is inaccessible.');
}
