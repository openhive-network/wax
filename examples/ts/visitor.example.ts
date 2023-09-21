import { OperationVisitor, transaction, comment, vote, limit_order_cancel, recurrent_transfer } from "@hive/wax";

import assert from "assert";

class MyVisitor extends OperationVisitor {
  public comment(op: comment): void {
    console.log('Got comment operation:', op.title);
  }
  public limit_order_cancel(op: limit_order_cancel): void {
    console.log('This should not be called on undefined op:', op.order);
  }
  public vote(op: vote): void {
    console.log(op);
  }
  public recurrent_transfer(op: recurrent_transfer): void {
    // Example json API transforming
    const jsonData = recurrent_transfer.toJSON(op) as { from?: string; to?: string; };

    assert.equal(jsonData.from, op.from_account);
    assert.equal(jsonData.to, op.to_account);
    console.log(op);
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
        extensions: [ { recurrent_transfer_pair_id: { pair_id: 0 } } ]
      }
    }
  ]
} as transaction);

const visitor = new MyVisitor();

for(const op of tx.operations)
  visitor.accept(op);

