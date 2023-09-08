import { OperationVisitor, transaction, comment, vote, limit_order_cancel } from "@hive/wax";

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
    }
  ]
} as transaction);

const visitor = new MyVisitor();

for(const op of tx.operations)
  visitor.accept(op);

