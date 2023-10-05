import type { comment, vote, transaction, limit_order_cancel, recurrent_transfer } from "@hive/wax";

declare var wax: typeof import("@hive/wax");

export const evaluate = async() => {

const { OperationVisitor, comment, vote, transaction, recurrent_transfer } = wax;

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
  ref_block_num: 0,
  ref_block_prefix: 0,
  expiration: "1970-01-01T01:00:00",
  extensions: [],
  operations: [
    {
      vote: vote.create({
        author: "alice",
        voter: "bob",
        permlink: "/",
        weight: 1,
      }  as vote),
    },
    {
      comment: comment.create({
        parent_permlink: "/",
        parent_author: "",
        author: "alice",
        permlink: "/",
        title: "Best comment",
        body: "<span>comment</span>",
        json_metadata: "{}"
      }  as comment)
    },
    {
      vote: vote.create({
        voter: "bob",
        author: "alice",
        permlink: "/",
        weight: 1
      }  as vote)
    },
    {
      limit_order_cancel: undefined
    },
    {
      recurrent_transfer: recurrent_transfer.create({
        from_account: "alice",
        to_account: "harry",
        amount: { nai: "@@000000021", precision: 3, amount: "10" },
        memo: "it is only memo",
        recurrence: 1,
        executions: 3,
        extensions: [ { recurrent_transfer_pair_id: { pair_id: 0 } }, { void_t: {} } ]
      }  as recurrent_transfer)
    }
  ]
}  as transaction);

const visitor = new MyVisitor();

for(const op of tx.operations) {
  // Undefined on no supported visitor or given operation is undefined
  const returnData = visitor.accept(op);

  if(returnData === false)
    throw new Error( "Visitor should return true for supported operations" );
}

};
