import type { comment, vote, transaction, limit_order_cancel, recurrent_transfer } from "@hive/wax";
import { fileURLToPath } from 'url';
import process from 'process';

export const evaluate = async() => {

const { OperationVisitor, transaction, recurrent_transfer } = await import ("@hive/wax");

class MyVisitor extends OperationVisitor<boolean> {
  public comment(op: comment): boolean {
    return op.author === "alice";
  }
  // This should be never visited in our example
  public limit_order_cancel(op: limit_order_cancel): boolean {
    return op.orderid === Number.POSITIVE_INFINITY;
  }
  public vote(op: vote): boolean {
    return op.voter === "bob";
  }
  public recurrent_transfer(op: recurrent_transfer): boolean {
    // Example json API transforming
    const jsonData = recurrent_transfer.toJSON(op) as { from?: string; to?: string; };

    return jsonData.to === op.to_account && jsonData.from === op.from_account;
  }
}

const tx = transaction.create({
  operations: [
    {
      vote: {
        author: "alice",
        voter: "bob",
        permlink: "/",
        weight: 1,
      },
    },
    {
      comment: {
        parent_permlink: "/",
        parent_author: "",
        author: "alice",
        permlink: "/",
        title: "Best comment",
        body: "<span>comment</span>",
        json_metadata: "{}"
      }
    },
    {
      vote: {
        voter: "bob",
        author: "alice",
        permlink: "/",
        weight: 1
      }
    },
    {
      limit_order_cancel: undefined
    },
    {
      recurrent_transfer: {
        from_account: "alice",
        to_account: "harry",
        amount: { nai: "@@000000021", precision: 3, amount: "10" },
        memo: "it is only memo",
        recurrence: 1,
        executions: 3,
        extensions: [ { recurrent_transfer_pair_id: { pair_id: 0 } }, { void_t: {} } ]
      }
    }
  ]
} as transaction);

const visitor = new MyVisitor();

for(const op of tx.operations) {
  // Undefined on no supported visitor or given operation is undefined
  const returnData = visitor.accept(op);

  if(typeof returnData !== "undefined")
  console.assert( returnData === true, "Visitor should return true for supported operations" );
}

};

// Run evaluate function when running from the console, instead of importing a module
if(process.argv[1] === fileURLToPath(import.meta.url))
  evaluate();
